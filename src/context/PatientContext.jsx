import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createInitialClinicalHistory,
  mergeClinicalHistory,
  recordPhysicianConfirmation,
  generatePhysicianSummary,
  PROVENANCE_SOURCES
} from '../data/clinicalHistorySchema';
import { evaluateRedFlagsFromHistory, checkRedFlags } from '../utils/redFlagRules';
import { questionEngine } from '../utils/questionEngine';
import { CHIEF_COMPLAINT_QUESTION } from '../clinical/protocolRegistry';
import sessionPersistence from '../services/sessionPersistence';
import clinicalAIService from '../services/clinicalAIService';
import patientService from '../services/patientService';
import caseService from '../services/caseService';
import documentService from '../services/documentService';
import alertService from '../services/alertService';

const PatientContext = createContext();

const initialPatientState = {
  dbPatientId: null,
  currentCaseId: null,
  patientName: '',
  dateOfBirth: '',
  age: null,
  gender: '',
  mobileNumber: '',
  email: '',
  location: '',
  bloodGroup: '',
  hasAllergies: '',
  allergies: '',
  selectedLanguage: 'hi', // Default to Hindi as per MVP OPD priority
  consentAccepted: false,
  
  // Intelligent interview state
  selectedConcern: null,
  patientDescription: '',
  answers: {}, // Legacy answers: { [concernId]: { [questionId]: value } }
  priorityLevel: 'normal',
  emergencyAlertTriggered: false,

  // Conversational Clinical History Engine State
  conversation: {
    language: 'hi',
    messages: [], // Array<{ id, role: 'assistant' | 'patient', text, timestamp, inputType, field }>
    currentField: 'chief_complaint',
    status: 'idle', // 'idle' | 'active' | 'alert' | 'completed'
    isProcessing: false
  },
  clinicalHistory: createInitialClinicalHistory(),
  triage: {
    priority: 'NORMAL',
    redFlags: []
  },

  documents: [],
  extractedMedicalData: {
    medications: [],
    labResults: []
  }
};

export const PatientProvider = ({ children }) => {
  const [patientData, setPatientData] = useState(() => {
    return sessionPersistence.loadSession(initialPatientState) || initialPatientState;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically persist any session updates (debounced)
  useEffect(() => {
    sessionPersistence.saveSession(patientData);
  }, [patientData]);

  const updatePatientData = (fields) => {
    setPatientData(prev => ({
      ...prev,
      ...fields
    }));
  };

  /**
   * Persist patient demographic profile to Supabase
   */
  const savePatientProfile = async (overrides = {}) => {
    const updated = { ...patientData, ...overrides };
    const { data } = await patientService.upsertPatient({
      id: patientData.dbPatientId,
      ...updated
    });

    if (data && data.id) {
      setPatientData(prev => ({ ...prev, dbPatientId: data.id }));
      return data.id;
    }
    return null;
  };

  /**
   * Select a health concern and initialize case in Supabase
   */
  const selectHealthConcern = async (concernId, description = '') => {
    setPatientData(prev => ({
      ...prev,
      selectedConcern: concernId,
      patientDescription: description
    }));

    try {
      let patientId = patientData.dbPatientId;
      if (!patientId && (patientData.patientName || patientData.mobileNumber)) {
        patientId = await savePatientProfile();
      }

      const { data: newCase } = await caseService.createCase({
        patientId,
        chiefComplaint: concernId,
        patientDescription: description,
        priorityLevel: patientData.priorityLevel
      });

      if (newCase && newCase.id) {
        setPatientData(prev => ({ ...prev, currentCaseId: newCase.id }));
      }
    } catch (err) {
      console.warn('Background Supabase case initialization fallback:', err);
    }
  };

  const updatePatientDescription = (description) => {
    setPatientData(prev => ({
      ...prev,
      patientDescription: description
    }));
  };

  const saveAnswer = (concernId, questionId, answer) => {
    setPatientData(prev => {
      const concernAnswers = prev.answers[concernId] || {};
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [concernId]: {
            ...concernAnswers,
            [questionId]: answer
          }
        }
      };
    });
  };

  const getAnswer = (concernId, questionId) => {
    if (!patientData.answers[concernId]) return null;
    return patientData.answers[concernId][questionId];
  };

  const clearAnswers = (concernId) => {
    setPatientData(prev => {
      const newAnswers = { ...prev.answers };
      delete newAnswers[concernId];
      return {
        ...prev,
        answers: newAnswers
      };
    });
  };

  /**
   * Evaluates Red Flags using deterministic safety rules
   */
  const evaluateRedFlags = () => {
    const historyResult = evaluateRedFlagsFromHistory(patientData.clinicalHistory);
    const legacyResult = checkRedFlags(patientData.selectedConcern, patientData.answers[patientData.selectedConcern]);
    
    const alertTriggered = historyResult.alertTriggered || legacyResult.alertTriggered;
    const priority = alertTriggered ? 'high' : 'normal';
    const redFlags = historyResult.redFlags.length > 0 ? historyResult.redFlags : (legacyResult.redFlags || []);

    setPatientData(prev => ({
      ...prev,
      priorityLevel: priority,
      emergencyAlertTriggered: alertTriggered,
      clinicalHistory: {
        ...prev.clinicalHistory,
        priority: priority.toUpperCase(),
        red_flags: redFlags
      },
      triage: {
        priority: priority.toUpperCase(),
        redFlags
      }
    }));

    if (patientData.currentCaseId) {
      caseService.updateCase(patientData.currentCaseId, { priority_level: priority });
    }

    return alertTriggered;
  };

  const triggerEmergencyAlert = (triggered) => {
    setPatientData(prev => ({
      ...prev,
      emergencyAlertTriggered: triggered,
      priorityLevel: triggered ? 'high' : 'normal'
    }));
  };

  // =========================================================================
  // CONVERSATIONAL CLINICAL ENGINE ACTIONS
  // =========================================================================

  /**
   * Initializes or resets the conversational interview stream
   */
  const initConversationalIntake = async (concernId = null, initialUtterance = '') => {
    const lang = (patientData.selectedLanguage === 'hi' || patientData.selectedLanguage === 'Hindi') ? 'hi' : 'en';

    let initialHistory = createInitialClinicalHistory();
    if (concernId) {
      initialHistory.chief_complaint = concernId.replace(/_/g, ' ');
      initialHistory.protocolId = concernId;
      initialHistory.answered_questions.push('chief_complaint');
      if (concernId === 'chest_pain' || concernId === 'chest') {
        initialHistory.hpi.site = 'chest';
      }
    }

    const firstQ = questionEngine.getNextQuestion({
      clinicalHistory: initialHistory,
      language: lang
    });

    const greetingText = lang === 'hi'
      ? "नमस्ते! मैं सेहत (Sehat), आपका डिजिटल स्वास्थ्य सहायक हूँ। कृपया बताएं कि आज आपको क्या स्वास्थ्य समस्या हो रही है? (आप बोलकर या लिखकर बता सकते हैं)"
      : "Hello! I am Sehat, your digital clinical assistant. Please tell me what health concern brings you here today? (You can speak or type)";

    const assistantText = concernId
      ? (firstQ.questionText || firstQ.text)
      : greetingText;

    const initialMessages = [
      {
        id: `msg-${Date.now()}-1`,
        role: 'assistant',
        text: assistantText,
        timestamp: new Date().toISOString(),
        field: concernId ? firstQ.field : 'chief_complaint',
        questionId: concernId ? firstQ.questionId : 'chief_complaint',
        options: concernId ? firstQ.options : (CHIEF_COMPLAINT_QUESTION.options[lang] || CHIEF_COMPLAINT_QUESTION.options.en)
      }
    ];

    setPatientData(prev => ({
      ...prev,
      selectedConcern: concernId || prev.selectedConcern,
      clinicalHistory: initialHistory,
      conversation: {
        language: lang,
        messages: initialMessages,
        currentField: concernId ? firstQ.field : 'chief_complaint',
        currentQuestionId: concernId ? firstQ.questionId : 'chief_complaint',
        status: 'active',
        isProcessing: false
      },
      triage: {
        priority: 'NORMAL',
        redFlags: []
      }
    }));

    if (initialUtterance && initialUtterance.trim()) {
      await handlePatientMessage(initialUtterance, 'text');
    }
  };

  /**
   * Processes a patient utterance (voice or text or touch) through the clinical pipeline:
   * 1. Appends patient message
   * 2. AI Entity Extraction (Gemini 3.8 Flash / deterministic fallback)
   * 3. Merges into structured clinical history + updates Provenance Audit Trail
   * 4. Evaluates deterministic red-flag safety rules BEFORE next routine question
   * 5. If red flag: triggers emergency state
   * 6. Else: evaluates deterministic question engine & advances currentQuestion
   */
  const handlePatientMessage = async (text, inputType = 'text') => {
    const cleanText = (text || '').trim();
    if (!cleanText) return { success: false, error: 'Empty input' };

    const lang = (patientData.selectedLanguage === 'hi' || patientData.selectedLanguage === 'Hindi') ? 'hi' : 'en';
    const now = new Date().toISOString();
    const currentField = patientData.conversation.currentField || 'chief_complaint';
    const currentQuestionId = patientData.conversation.currentQuestionId || currentField;

    const patientMsg = {
      id: `msg-${Date.now()}-p`,
      role: 'patient',
      text: cleanText,
      timestamp: now,
      inputType,
      field: currentField,
      questionId: currentQuestionId
    };

    // Update UI immediately with patient message and set processing state
    setPatientData(prev => ({
      ...prev,
      conversation: {
        ...prev.conversation,
        isProcessing: true,
        messages: [...prev.conversation.messages, patientMsg]
      }
    }));

    try {
      // 1. Clinical Entity Extraction
      const extractionResult = await clinicalAIService.extract(cleanText, {
        currentField,
        currentQuestionId,
        currentHistory: patientData.clinicalHistory,
        language: lang
      });

      const extractedData = extractionResult.extracted || {};
      const provenanceSource = inputType === 'touch'
        ? PROVENANCE_SOURCES.PATIENT_DIRECT
        : PROVENANCE_SOURCES.AI_EXTRACTION;

      // Ensure the answered field and questionId are tagged in answered_questions
      if (!Array.isArray(extractedData.answered_questions)) {
        extractedData.answered_questions = [];
      }
      if (currentField && !extractedData.answered_questions.includes(currentField)) {
        extractedData.answered_questions.push(currentField);
      }
      if (currentQuestionId && !extractedData.answered_questions.includes(currentQuestionId)) {
        extractedData.answered_questions.push(currentQuestionId);
      }
      extractedData.answered_field = currentField;

      // 2. Merge into Structured History with Provenance
      const updatedHistory = mergeClinicalHistory(patientData.clinicalHistory, extractedData, {
        source: provenanceSource,
        rawUtterance: cleanText,
        confidence: extractionResult.meta?.confidence || 0.95
      });

      // 3. Deterministic Red-Flag Triage Evaluation (BEFORE routine questioning)
      const triageResult = evaluateRedFlagsFromHistory(updatedHistory);
      updatedHistory.priority = triageResult.priority;
      updatedHistory.red_flags = triageResult.redFlags;

      if (triageResult.alertTriggered) {
        // Red flag triggered!
        const alertMsgText = lang === 'hi'
          ? "चेतावनी: आपके द्वारा बताए गए लक्षणों में कुछ ऐसे संकेत हैं जिनके लिए तुरंत डॉक्टर या अस्पताल के इमरजेंसी स्टाफ को दिखाना आवश्यक है। हम आपको इमरजेंसी अलर्ट स्क्रीन पर भेज रहे हैं।"
          : "Triage Alert: The symptoms described indicate potential warning signs requiring immediate clinical review by healthcare staff. Directing you to the priority alert page.";

        const alertAssistantMsg = {
          id: `msg-${Date.now()}-alert`,
          role: 'assistant',
          text: alertMsgText,
          timestamp: new Date().toISOString(),
          isAlert: true
        };

        setPatientData(prev => ({
          ...prev,
          priorityLevel: 'high',
          emergencyAlertTriggered: true,
          clinicalHistory: updatedHistory,
          triage: {
            priority: 'HIGH',
            redFlags: triageResult.redFlags
          },
          conversation: {
            ...prev.conversation,
            isProcessing: false,
            status: 'alert',
            messages: [...prev.conversation.messages, alertAssistantMsg]
          }
        }));

        if (patientData.currentCaseId) {
          caseService.updateCase(patientData.currentCaseId, { priority_level: 'high' });
          alertService.createAlert({
            caseId: patientData.currentCaseId,
            alertType: triageResult.redFlags[0]?.type || 'potential_priority_symptoms',
            priority: 'high',
            message: triageResult.redFlags[0]?.signal || 'High priority clinical warning detected.'
          });
        }

        return { triggeredRedFlag: true, redFlags: triageResult.redFlags };
      }

      // 4. Deterministic Question Engine: Select Next Missing Question
      // Uses newly merged history and answeredQuestionIds
      const nextQ = questionEngine.getNextQuestion({
        clinicalHistory: updatedHistory,
        answeredQuestionIds: updatedHistory.answered_questions,
        currentQuestionId: currentQuestionId,
        language: lang
      });

      const nextAssistantMsg = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        text: nextQ.questionText || nextQ.text,
        timestamp: new Date().toISOString(),
        field: nextQ.field,
        questionId: nextQ.questionId,
        options: nextQ.options,
        isCompleted: nextQ.isCompleted
      };

      setPatientData(prev => ({
        ...prev,
        clinicalHistory: updatedHistory,
        conversation: {
          ...prev.conversation,
          isProcessing: false,
          currentField: nextQ.field,
          currentQuestionId: nextQ.questionId,
          status: nextQ.isCompleted ? 'completed' : 'active',
          messages: [...prev.conversation.messages, nextAssistantMsg]
        }
      }));

      return {
        triggeredRedFlag: false,
        completed: nextQ.isCompleted,
        nextQuestion: nextQ
      };
    } catch (err) {
      console.error('[handlePatientMessage] Pipeline error:', err);
      setPatientData(prev => ({
        ...prev,
        conversation: {
          ...prev.conversation,
          isProcessing: false
        }
      }));
      return { success: false, error: err.message };
    }
  };

  /**
   * Skips the current question and advances
   */
  const skipCurrentQuestion = () => {
    const lang = (patientData.selectedLanguage === 'hi' || patientData.selectedLanguage === 'Hindi') ? 'hi' : 'en';
    const currentField = patientData.conversation.currentField;
    const currentQuestionId = patientData.conversation.currentQuestionId || currentField;

    // Mark current field as explicitly skipped in history
    const updatedHistory = { ...patientData.clinicalHistory };
    if (!updatedHistory.provenance) updatedHistory.provenance = {};
    updatedHistory.provenance[`hpi.${currentField}`] = {
      value: 'SKIPPED_BY_PATIENT',
      source: PROVENANCE_SOURCES.PATIENT_DIRECT,
      timestamp: new Date().toISOString(),
      status: 'skipped'
    };
    if (!Array.isArray(updatedHistory.answered_questions)) {
      updatedHistory.answered_questions = [];
    }
    if (currentField && !updatedHistory.answered_questions.includes(currentField)) {
      updatedHistory.answered_questions.push(currentField);
    }
    if (currentQuestionId && !updatedHistory.answered_questions.includes(currentQuestionId)) {
      updatedHistory.answered_questions.push(currentQuestionId);
    }

    const nextQ = questionEngine.getNextQuestion({
      clinicalHistory: updatedHistory,
      answeredQuestionIds: updatedHistory.answered_questions,
      currentQuestionId: currentQuestionId,
      language: lang
    });

    const nextMsg = {
      id: `msg-${Date.now()}-skip`,
      role: 'assistant',
      text: nextQ.questionText || nextQ.text,
      timestamp: new Date().toISOString(),
      field: nextQ.field,
      questionId: nextQ.questionId,
      options: nextQ.options,
      isCompleted: nextQ.isCompleted
    };

    setPatientData(prev => ({
      ...prev,
      clinicalHistory: updatedHistory,
      conversation: {
        ...prev.conversation,
        currentField: nextQ.field,
        currentQuestionId: nextQ.questionId,
        status: nextQ.isCompleted ? 'completed' : 'active',
        messages: [...prev.conversation.messages, nextMsg]
      }
    }));
  };

  /**
   * Marks a specific field as confirmed by physician
   */
  const confirmFieldByPhysician = (fieldKey) => {
    setPatientData(prev => ({
      ...prev,
      clinicalHistory: recordPhysicianConfirmation(prev.clinicalHistory, fieldKey)
    }));
  };

  /**
   * Returns standardized physician summary
   */
  const exportPhysicianSummary = () => {
    return generatePhysicianSummary(patientData.clinicalHistory, patientData);
  };

  // =========================================================================
  // DOCUMENT MANAGEMENT & FINAL SUBMISSION
  // =========================================================================

  const uploadAndAddDocument = async (file, docType) => {
    const docId = `doc-${Date.now()}`;
    const newDoc = {
      id: docId,
      documentId: docId,
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      name: file.name,
      size: file.size,
      type: docType,
      status: 'uploaded',
      extractedData: null,
      extraction: null,
      failureReason: null,
      fileRef: file
    };

    setPatientData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));

    try {
      const { filePath, publicUrl } = await documentService.uploadFile(
        file,
        patientData.dbPatientId || 'guest',
        patientData.currentCaseId || 'draft'
      );

      if (patientData.currentCaseId) {
        await documentService.saveDocumentMetadata({
          caseId: patientData.currentCaseId,
          fileName: file.name,
          filePath,
          fileType: file.type,
          fileSize: file.size,
          documentType: docType
        });
      }

      setPatientData(prev => ({
        ...prev,
        documents: prev.documents.map(d => 
          d.id === docId ? { ...d, filePath, publicUrl } : d
        )
      }));
    } catch (err) {
      console.warn('Document storage upload fallback:', err);
    }

    return docId;
  };

  const addDocument = (doc) => {
    setPatientData(prev => ({
      ...prev,
      documents: [...prev.documents, doc]
    }));
  };

  const updateDocumentStatus = (docId, status, extractedData, extraFields = {}) => {
    setPatientData(prev => {
      const updatedDocs = prev.documents.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            status,
            extractedData: extractedData || null,
            extraction: extractedData || doc.extraction || null,
            failureReason: extraFields.failureReason || null,
            ...extraFields
          };
        }
        return doc;
      });

      let cumulativeMeds = [...(prev.extractedMedicalData?.medications || [])];
      let cumulativeLab = [...(prev.extractedMedicalData?.labResults || [])];

      if ((status === 'completed' || status === 'extracted') && extractedData) {
        if (Array.isArray(extractedData.medications)) {
          extractedData.medications.forEach(med => {
            const medStr = typeof med === 'string'
              ? med
              : [med.name, med.dose, med.frequency].filter(Boolean).join(' ');
            if (medStr && !cumulativeMeds.includes(medStr)) cumulativeMeds.push(medStr);
          });
        }
        if (Array.isArray(extractedData.investigations)) {
          extractedData.investigations.forEach(inv => {
            const name = inv.name || 'Investigation';
            const value = [inv.value, inv.unit].filter(Boolean).join(' ');
            const labStatus = inv.flag || 'normal';
            if (!cumulativeLab.some(l => l.name === name)) {
              cumulativeLab.push({ name, value, status: labStatus });
            }
          });
        } else if (Array.isArray(extractedData.labResults)) {
          extractedData.labResults.forEach(lab => {
            if (!cumulativeLab.some(l => l.name === lab.name)) cumulativeLab.push(lab);
          });
        }
      }

      return {
        ...prev,
        documents: updatedDocs,
        extractedMedicalData: { medications: cumulativeMeds, labResults: cumulativeLab }
      };
    });
  };

  const removeDocument = (docId) => {
    setPatientData(prev => {
      const remainingDocs = prev.documents.filter(doc => doc.id !== docId);
      let cumulativeMeds = [];
      let cumulativeLab = [];
      
      remainingDocs.forEach(doc => {
        if ((doc.status === 'completed' || doc.status === 'extracted') && (doc.extractedData || doc.extraction)) {
          const data = doc.extraction || doc.extractedData;
          if (Array.isArray(data.medications)) {
            data.medications.forEach(med => {
              const medStr = typeof med === 'string'
                ? med
                : [med.name, med.dose, med.frequency].filter(Boolean).join(' ');
              if (medStr && !cumulativeMeds.includes(medStr)) cumulativeMeds.push(medStr);
            });
          }
          if (Array.isArray(data.investigations)) {
            data.investigations.forEach(inv => {
              const name = inv.name || 'Investigation';
              const value = [inv.value, inv.unit].filter(Boolean).join(' ');
              const labStatus = inv.flag || 'normal';
              if (!cumulativeLab.some(l => l.name === name)) {
                cumulativeLab.push({ name, value, status: labStatus });
              }
            });
          } else if (Array.isArray(data.labResults)) {
            data.labResults.forEach(lab => {
              if (!cumulativeLab.some(l => l.name === lab.name)) cumulativeLab.push(lab);
            });
          }
        }
      });

      return {
        ...prev,
        documents: remainingDocs,
        extractedMedicalData: { medications: cumulativeMeds, labResults: cumulativeLab }
      };
    });
  };

  /**
   * Final submission: Syncs patient profile, structured clinical history & status to Supabase
   */
  const submitFinalCase = async () => {
    setIsSubmitting(true);
    try {
      const patientId = await savePatientProfile();
      let caseId = patientData.currentCaseId;

      const physicianSummary = generatePhysicianSummary(patientData.clinicalHistory, patientData);

      if (!caseId) {
        const { data: newCase } = await caseService.createCase({
          patientId,
          chiefComplaint: patientData.clinicalHistory.chief_complaint || patientData.selectedConcern || 'General Concern',
          patientDescription: JSON.stringify(physicianSummary),
          priorityLevel: patientData.priorityLevel
        });
        caseId = newCase?.id;
      }

      if (caseId) {
        // Save structured SOCRATES answers
        const hpi = patientData.clinicalHistory.hpi || {};
        const socratesAnswers = [
          { question_id: 'chief_complaint', question_text: 'Chief Complaint', question_type: 'text', answer: patientData.clinicalHistory.chief_complaint },
          { question_id: 'site', question_text: 'Site', question_type: 'single_choice', answer: hpi.site },
          { question_id: 'onset', question_text: 'Onset', question_type: 'single_choice', answer: hpi.onset },
          { question_id: 'duration', question_text: 'Duration', question_type: 'single_choice', answer: hpi.duration },
          { question_id: 'character', question_text: 'Character', question_type: 'single_choice', answer: hpi.character },
          { question_id: 'radiation', question_text: 'Radiation', question_type: 'single_choice', answer: hpi.radiation },
          { question_id: 'severity', question_text: 'Severity', question_type: 'scale', answer: hpi.severity },
          { question_id: 'associated_symptoms', question_text: 'Associated Symptoms', question_type: 'multiple_choice', answer: hpi.associated_symptoms }
        ].filter(item => item.answer !== null && item.answer !== undefined);

        await caseService.saveAnswers(caseId, socratesAnswers);

        if (patientData.emergencyAlertTriggered || patientData.priorityLevel === 'high') {
          await alertService.createAlert({
            caseId,
            alertType: patientData.clinicalHistory.red_flags[0]?.type || 'potential_priority_symptoms',
            priority: 'high',
            message: patientData.clinicalHistory.red_flags[0]?.signal || 'High priority clinical symptoms detected.'
          });
        }

        await caseService.updateCase(caseId, {
          status: 'waiting_for_doctor',
          priority_level: patientData.priorityLevel,
          patient_id: patientId || undefined,
          patient_description: JSON.stringify(physicianSummary)
        });
      }
    } catch (err) {
      console.error('Final case submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPatientData = () => {
    sessionPersistence.clearSession();
    setPatientData({
      ...initialPatientState,
      selectedLanguage: patientData.selectedLanguage
    });
  };

  return (
    <PatientContext.Provider value={{
      patientData,
      isSubmitting,
      updatePatientData,
      savePatientProfile,
      selectHealthConcern,
      updatePatientDescription,
      saveAnswer,
      getAnswer,
      clearAnswers,
      evaluateRedFlags,
      triggerEmergencyAlert,
      initConversationalIntake,
      handlePatientMessage,
      skipCurrentQuestion,
      confirmFieldByPhysician,
      exportPhysicianSummary,
      uploadAndAddDocument,
      addDocument,
      updateDocumentStatus,
      removeDocument,
      submitFinalCase,
      resetPatientData,
      sessionPersistence
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

export default PatientContext;
