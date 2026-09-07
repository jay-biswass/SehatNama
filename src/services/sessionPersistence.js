/**
 * Dedicated Clinical Session Persistence Service
 * 
 * Guarantees that clinical intake data survives:
 * - Route changes
 * - Component remounts
 * - Full browser page refresh (F5 / reload)
 * - Accidental browser tab closing / re-entry
 * 
 * Uses localStorage for client-side persistence in MVP.
 * NEVER stores API keys, credentials, or raw File binaries.
 */

import { createInitialClinicalHistory, validateClinicalHistory } from '../data/clinicalHistorySchema.js';

const STORAGE_KEY = 'sehatnama_active_clinical_session';
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours validity

let debounceTimer = null;

export const sessionPersistence = {
  /**
   * Generates a stable unique session ID
   */
  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  },

  /**
   * Serializes patientData into the standardized persistent session payload.
   * Strips non-serializable objects (like raw DOM File references).
   * 
   * @param {Object} patientData - Current React state from PatientContext
   * @returns {Object} Clean serializable session structure
   */
  formatSessionPayload(patientData) {
    if (!patientData || typeof patientData !== 'object') return null;

    const history = patientData.clinicalHistory || {};
    const conversation = patientData.conversation || {};

    // Sanitize documents to remove File objects and store only serializable metadata
    const sanitizedDocuments = Array.isArray(patientData.documents)
      ? patientData.documents.map(doc => ({
          id: doc.id,
          name: doc.name,
          size: doc.size,
          type: doc.type,
          status: doc.status,
          filePath: doc.filePath || null,
          publicUrl: doc.publicUrl || null,
          extractedData: doc.extractedData || null
        }))
      : [];

    return {
      sessionId: patientData.currentSessionId || patientData.currentCaseId || this.generateSessionId(),
      patient: {
        patientName: patientData.patientName || '',
        dateOfBirth: patientData.dateOfBirth || '',
        age: patientData.age || null,
        gender: patientData.gender || '',
        mobileNumber: patientData.mobileNumber || '',
        email: patientData.email || '',
        location: patientData.location || '',
        bloodGroup: patientData.bloodGroup || '',
        hasAllergies: patientData.hasAllergies || '',
        allergies: patientData.allergies || '',
        consentAccepted: Boolean(patientData.consentAccepted),
        dbPatientId: patientData.dbPatientId || null
      },
      selectedLanguage: patientData.selectedLanguage || conversation.language || 'hi',
      selectedConcern: patientData.selectedConcern || null,
      patientDescription: patientData.patientDescription || '',
      currentCaseId: patientData.currentCaseId || null,
      conversation: {
        language: conversation.language || patientData.selectedLanguage || 'hi',
        messages: Array.isArray(conversation.messages) ? conversation.messages : [],
        currentField: conversation.currentField || 'chief_complaint',
        currentQuestionId: conversation.currentQuestionId || conversation.currentField || 'chief_complaint',
        status: conversation.status || 'active',
        isProcessing: false // Always reset isProcessing on save
      },
      clinicalHistory: history,
      currentProtocol: history.protocolId || patientData.selectedConcern || null,
      currentQuestion: conversation.currentQuestionId || null,
      answeredQuestionIds: Array.isArray(history.answered_questions) ? [...history.answered_questions] : [],
      triageStatus: {
        priority: patientData.priorityLevel ? patientData.priorityLevel.toUpperCase() : (history.priority || 'NORMAL'),
        emergencyAlertTriggered: Boolean(patientData.emergencyAlertTriggered),
        redFlags: Array.isArray(history.red_flags) ? history.red_flags : (patientData.triage?.redFlags || [])
      },
      provenance: history.provenance || {},
      interviewStatus: conversation.status || (history.chief_complaint ? 'in_progress' : 'initial'),
      documents: sanitizedDocuments,
      extractedMedicalData: {
        medications: Array.isArray(patientData.extractedMedicalData?.medications) ? [...patientData.extractedMedicalData.medications] : [],
        labResults: Array.isArray(patientData.extractedMedicalData?.labResults) ? [...patientData.extractedMedicalData.labResults] : []
      },
      answers: patientData.answers || {},
      lastUpdated: new Date().toISOString()
    };
  },

  /**
   * Rehydrates saved session payload back into the full patientData state object.
   * 
   * @param {Object} saved - Parsed session payload from localStorage
   * @param {Object} fallback - Default initialPatientState
   * @returns {Object} Hydrated patientData state
   */
  hydratePatientData(saved, fallback = {}) {
    if (!saved || typeof saved !== 'object') return fallback;

    const patient = saved.patient || {};
    const triage = saved.triageStatus || {};
    const conversation = saved.conversation || {};
    const clinicalHistory = saved.clinicalHistory || createInitialClinicalHistory();

    return {
      ...fallback,
      currentSessionId: saved.sessionId,
      dbPatientId: patient.dbPatientId || fallback.dbPatientId || null,
      currentCaseId: saved.currentCaseId || fallback.currentCaseId || null,
      patientName: patient.patientName || '',
      dateOfBirth: patient.dateOfBirth || '',
      age: patient.age || null,
      gender: patient.gender || '',
      mobileNumber: patient.mobileNumber || '',
      email: patient.email || '',
      location: patient.location || '',
      bloodGroup: patient.bloodGroup || '',
      hasAllergies: patient.hasAllergies || '',
      allergies: patient.allergies || '',
      consentAccepted: Boolean(patient.consentAccepted),
      selectedLanguage: saved.selectedLanguage || 'hi',
      selectedConcern: saved.selectedConcern || null,
      patientDescription: saved.patientDescription || '',
      priorityLevel: (triage.priority || 'normal').toLowerCase(),
      emergencyAlertTriggered: Boolean(triage.emergencyAlertTriggered),
      triage: {
        priority: triage.priority || 'NORMAL',
        redFlags: Array.isArray(triage.redFlags) ? triage.redFlags : []
      },
      clinicalHistory: {
        ...createInitialClinicalHistory(),
        ...clinicalHistory,
        answered_questions: saved.answeredQuestionIds || clinicalHistory.answered_questions || [],
        provenance: saved.provenance || clinicalHistory.provenance || {}
      },
      conversation: {
        language: conversation.language || saved.selectedLanguage || 'hi',
        messages: Array.isArray(conversation.messages) ? conversation.messages : [],
        currentField: conversation.currentField || 'chief_complaint',
        currentQuestionId: conversation.currentQuestionId || conversation.currentField || 'chief_complaint',
        status: conversation.status || 'active',
        isProcessing: false
      },
      documents: Array.isArray(saved.documents) ? saved.documents : [],
      extractedMedicalData: {
        medications: Array.isArray(saved.extractedMedicalData?.medications) ? saved.extractedMedicalData.medications : [],
        labResults: Array.isArray(saved.extractedMedicalData?.labResults) ? saved.extractedMedicalData.labResults : []
      },
      answers: saved.answers || {}
    };
  },

  /**
   * Saves active session with optional debouncing (default: 300ms)
   * 
   * @param {Object} patientData - Current state
   * @param {boolean} [immediate=false] - If true, bypasses debounce timer
   */
  saveSession(patientData, immediate = false) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (!patientData) return;

    const doSave = () => {
      try {
        const payload = this.formatSessionPayload(patientData);
        if (!payload) return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.warn('[sessionPersistence] Failed to write session to localStorage:', err.message);
      }
    };

    if (immediate) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      doSave();
    } else {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        doSave();
        debounceTimer = null;
      }, 300);
    }
  },

  /**
   * Loads and validates the active session from localStorage.
   * 
   * @param {Object} [fallbackState=null] - Optional initial state for hydration
   * @returns {Object|null} Restored patientData or null if no valid session
   */
  loadSession(fallbackState = null) {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;

      // Validate session age
      if (parsed.lastUpdated) {
        const age = Date.now() - new Date(parsed.lastUpdated).getTime();
        if (age > SESSION_EXPIRY_MS) {
          console.info('[sessionPersistence] Active session expired (>24 hours). Clearing storage.');
          this.clearSession();
          return null;
        }
      }

      // Check if session has meaningful content
      const hasPatientInfo = Boolean(parsed.patient?.patientName || parsed.patient?.mobileNumber);
      const hasConcernOrHistory = Boolean(parsed.selectedConcern || parsed.clinicalHistory?.chief_complaint || parsed.conversation?.messages?.length > 1);

      if (!hasPatientInfo && !hasConcernOrHistory) {
        return null;
      }

      return fallbackState
        ? this.hydratePatientData(parsed, fallbackState)
        : parsed;
    } catch (err) {
      console.warn('[sessionPersistence] Error reading session from localStorage:', err.message);
      return null;
    }
  },

  /**
   * Checks if an active non-empty session currently exists in localStorage
   */
  hasActiveSession() {
    return this.loadSession() !== null;
  },

  /**
   * Clears the active session from localStorage
   */
  clearSession() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.warn('[sessionPersistence] Error clearing session:', err.message);
      }
    }
  }
};

export default sessionPersistence;
