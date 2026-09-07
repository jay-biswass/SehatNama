/**
 * Deterministic Adaptive Clinical Question Engine
 * 
 * Scalable across 46+ major OPD presenting complaints.
 * 100% deterministic logic:
 * 1. Determines presenting complaint (chief_complaint)
 * 2. Selects appropriate clinical history-taking protocol via protocolRegistry
 * 3. Sequentially asks missing protocol questions in clinical priority order
 * 4. Automatically skips questions whose answers were already extracted from patient's natural language input
 * 5. Prevents duplicate questions and handles three-state symptom representation (UNKNOWN, YES, NO)
 * 6. Provides localized questions (Hindi / English) and quick-reply options
 */

import { matchProtocol, getProtocol, CHIEF_COMPLAINT_QUESTION } from '../clinical/protocolRegistry.js';
import { cardiovascularProtocols } from '../clinical/protocols/cardiovascular.js';

// Exported for backward compatibility with chest-pain tests and legacy flows
export const CHEST_PAIN_QUESTIONS = cardiovascularProtocols.chest_pain.questions;

export const questionEngine = {
  /**
   * Evaluates clinical history and returns the next clinically relevant question.
   * Deterministically skips already answered fields and prevents duplicate questions.
   * 
   * Supports both contract formats:
   * 1. getNextQuestion({ clinicalHistory, answeredQuestionIds, protocol, currentQuestionId, language })
   * 2. getNextQuestion(clinicalHistory, language)
   * 
   * @param {Object} input - Contract object or clinicalHistory
   * @param {string} [maybeLang='hi'] - Fallback language if not provided in object
   * @returns {Object} { isCompleted, questionId, field, questionText, text, type, options, protocolId }
   */
  getNextQuestion(input, maybeLang = 'hi') {
    let clinicalHistory;
    let answeredQuestionIds = [];
    let protocolOverride = null;
    let currentQuestionId = null;
    let language = maybeLang;

    if (input && typeof input === 'object') {
      if (input.clinicalHistory !== undefined) {
        clinicalHistory = input.clinicalHistory;
        answeredQuestionIds = input.answeredQuestionIds || clinicalHistory?.answered_questions || [];
        protocolOverride = input.protocol;
        currentQuestionId = input.currentQuestionId;
        language = input.language || maybeLang || 'hi';
      } else {
        clinicalHistory = input;
        answeredQuestionIds = clinicalHistory?.answered_questions || [];
        language = maybeLang || 'hi';
      }
    } else {
      clinicalHistory = input;
      language = maybeLang || 'hi';
    }

    const lang = (language === 'hi' || language === 'Hindi') ? 'hi' : 'en';

    // Build consolidated set of answered IDs
    const answeredSet = new Set(
      (Array.isArray(answeredQuestionIds) ? answeredQuestionIds : [])
        .concat(Array.isArray(clinicalHistory?.answered_questions) ? clinicalHistory.answered_questions : [])
    );

    // Step 1: Chief complaint must be identified
    if (!CHIEF_COMPLAINT_QUESTION.isKnown(clinicalHistory) && !answeredSet.has('chief_complaint')) {
      const qText = CHIEF_COMPLAINT_QUESTION.text[lang] || CHIEF_COMPLAINT_QUESTION.text.en;
      return {
        isCompleted: false,
        protocolId: null,
        questionId: 'chief_complaint',
        field: CHIEF_COMPLAINT_QUESTION.field,
        questionText: qText,
        text: qText,
        type: CHIEF_COMPLAINT_QUESTION.type,
        options: CHIEF_COMPLAINT_QUESTION.options[lang] || CHIEF_COMPLAINT_QUESTION.options.en
      };
    }

    // Step 2: Resolve matched protocol
    const protocolIdentifier = clinicalHistory?.protocolId || clinicalHistory?.chief_complaint;
    const protocol = protocolOverride || matchProtocol(protocolIdentifier, lang);
    const questions = protocol?.questions || [];

    // Step 3: Check protocol questions in clinical sequence
    for (const q of questions) {
      const qId = q.id || q.field;
      const qField = q.field || q.id;
      const canonical = q.canonical || qField;

      // Check if question is already answered via answeredSet, symptom_status, or isKnown
      const isAnswered = answeredSet.has(qId) ||
                         answeredSet.has(qField) ||
                         answeredSet.has(canonical) ||
                         (clinicalHistory?.symptom_status && (
                           clinicalHistory.symptom_status[qId] !== undefined ||
                           clinicalHistory.symptom_status[qField] !== undefined ||
                           clinicalHistory.symptom_status[canonical] !== undefined
                         )) ||
                         (typeof q.isKnown === 'function' && q.isKnown(clinicalHistory));

      if (isAnswered) {
        continue;
      }

      // Protection against duplicate questions (Section 6)
      if (currentQuestionId && (qId === currentQuestionId || qField === currentQuestionId || canonical === currentQuestionId)) {
        console.warn(`Duplicate question prevented: ${qId}`);
        answeredSet.add(qId);
        answeredSet.add(qField);
        answeredSet.add(canonical);
        continue;
      }

      // Found next unanswered question
      const qText = q.text?.[lang] || q.text?.en || '';
      const qOptions = (q.options && (q.options[lang] || q.options.en)) || [];

      return {
        isCompleted: false,
        protocolId: protocol.id,
        protocolTitle: protocol.title?.[lang] || protocol.title?.en,
        questionId: qId,
        field: qField,
        questionText: qText,
        text: qText,
        type: q.type || 'single_choice',
        options: qOptions
      };
    }

    // Step 4: All questions for the selected protocol are complete
    const completedText = lang === 'hi'
      ? "धन्यवाद। आपकी सभी आवश्यक जानकारी दर्ज कर ली गई है।"
      : "Thank you. All essential clinical history has been gathered.";

    return {
      isCompleted: true,
      protocolId: protocol?.id || null,
      protocolTitle: protocol?.title?.[lang] || protocol?.title?.en || '',
      questionId: null,
      field: null,
      questionText: completedText,
      text: completedText,
      options: []
    };
  },

  /**
   * Helper to check if a specific field is known in the active protocol
   */
  isFieldKnown(clinicalHistory, field, protocolId = null) {
    if (field === 'chief_complaint') {
      return Boolean(clinicalHistory?.chief_complaint);
    }
    const protocol = protocolId 
      ? getProtocol(protocolId) 
      : matchProtocol(clinicalHistory?.protocolId || clinicalHistory?.chief_complaint);
      
    const questions = protocol?.questions || CHEST_PAIN_QUESTIONS;
    const questionConfig = questions.find(q => (q.id === field || q.field === field || q.canonical === field));
    return questionConfig ? questionConfig.isKnown(clinicalHistory) : false;
  }
};

export default questionEngine;
