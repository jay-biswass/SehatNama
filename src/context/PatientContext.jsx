import React, { createContext, useContext, useState } from 'react';
import { checkRedFlags } from '../utils/redFlagRules';
import { healthQuestionFlows } from '../data/healthQuestionFlows';
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
  selectedLanguage: null,
  consentAccepted: false,
  
  // Intelligent interview state
  selectedConcern: null,
  patientDescription: '',
  answers: {}, // Dynamic answers: { [concernId]: { [questionId]: value } }
  priorityLevel: 'normal',
  emergencyAlertTriggered: false,

  documents: [],
  extractedMedicalData: {
    medications: [],
    labResults: []
  }
};

export const PatientProvider = ({ children }) => {
  const [patientData, setPatientData] = useState(initialPatientState);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const { data, error } = await patientService.upsertPatient({
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

    // Async background sync with Supabase
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

  const evaluateRedFlags = () => {
    const concern = patientData.selectedConcern;
    const answers = patientData.answers[concern];
    const { priority, alertTriggered } = checkRedFlags(concern, answers);
    
    setPatientData(prev => ({
      ...prev,
      priorityLevel: priority,
      emergencyAlertTriggered: alertTriggered
    }));

    // Update case priority in Supabase if case exists
    if (patientData.currentCaseId) {
      caseService.updateCase(patientData.currentCaseId, { priority_level: priority });
    }

    return alertTriggered;
  };

  const triggerEmergencyAlert = (triggered) => {
    setPatientData(prev => ({
      ...prev,
      emergencyAlertTriggered: triggered
    }));
  };

  /**
   * Upload file to Supabase Storage & add metadata to Context + Database
   */
  const uploadAndAddDocument = async (file, docType) => {
    const docId = `doc-${Date.now()}`;
    const newDoc = {
      id: docId,
      name: file.name,
      size: file.size,
      type: docType,
      status: 'reading',
      extractedData: null,
      fileRef: file
    };

    // Add locally for instant UI response
    setPatientData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));

    // Upload to Supabase Storage
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

  const updateDocumentStatus = (docId, status, extractedData) => {
    setPatientData(prev => {
      const updatedDocs = prev.documents.map(doc => {
        if (doc.id === docId) {
          return { ...doc, status, extractedData };
        }
        return doc;
      });

      let cumulativeMeds = [...prev.extractedMedicalData.medications];
      let cumulativeLab = [...prev.extractedMedicalData.labResults];

      if (status === 'completed' && extractedData) {
        if (extractedData.medications) {
          extractedData.medications.forEach(med => {
            if (!cumulativeMeds.includes(med)) cumulativeMeds.push(med);
          });
        }
        if (extractedData.labResults) {
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
        if (doc.status === 'completed' && doc.extractedData) {
          if (doc.extractedData.medications) {
            doc.extractedData.medications.forEach(med => {
              if (!cumulativeMeds.includes(med)) cumulativeMeds.push(med);
            });
          }
          if (doc.extractedData.labResults) {
            doc.extractedData.labResults.forEach(lab => {
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
   * Final submission: Syncs patient profile, case answers, alerts & status to Supabase
   */
  const submitFinalCase = async () => {
    setIsSubmitting(true);
    try {
      // 1. Ensure patient record is saved
      const patientId = await savePatientProfile();

      // 2. Ensure active case exists
      let caseId = patientData.currentCaseId;
      if (!caseId) {
        const { data: newCase } = await caseService.createCase({
          patientId,
          chiefComplaint: patientData.selectedConcern || 'General Concern',
          patientDescription: patientData.patientDescription,
          priorityLevel: patientData.priorityLevel
        });
        caseId = newCase?.id;
      }

      if (caseId) {
        // 3. Batch save case answers
        const concern = patientData.selectedConcern;
        const flow = concern ? healthQuestionFlows[concern] : null;
        const currentAnswers = concern ? patientData.answers[concern] || {} : {};

        if (flow && flow.questions) {
          const answersPayload = flow.questions
            .filter(q => currentAnswers[q.id] !== undefined)
            .map(q => ({
              question_id: q.id,
              question_text: q.question,
              question_type: q.type,
              answer: currentAnswers[q.id]
            }));

          await caseService.saveAnswers(caseId, answersPayload);
        }

        // 4. Create Alert if priority is high or red flag was triggered
        if (patientData.emergencyAlertTriggered || patientData.priorityLevel === 'high') {
          await alertService.createAlert({
            caseId,
            alertType: 'potential_priority_symptoms',
            priority: 'high',
            message: `Priority symptoms reported for ${concern || 'chief complaint'}. Doctor review recommended.`
          });
        }

        // 5. Update Case Status to waiting_for_doctor
        await caseService.updateCase(caseId, {
          status: 'waiting_for_doctor',
          priority_level: patientData.priorityLevel,
          patient_id: patientId || undefined
        });
      }
    } catch (err) {
      console.error('Final case submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPatientData = () => {
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
      uploadAndAddDocument,
      addDocument,
      updateDocumentStatus,
      removeDocument,
      submitFinalCase,
      resetPatientData
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
