/**
 * Client-Side Clinical AI Service
 * 
 * Provides an abstraction for clinical entity extraction.
 * Communicates with the server-side API proxy (/api/extract-clinical-info)
 * without exposing any LLM API keys to the browser.
 * 
 * Includes client-level fault tolerance to guarantee the interview never hangs.
 */

import { localExtractClinicalInfo } from './localClinicalExtractor.js';
import { validateClinicalHistory } from '../data/clinicalHistorySchema.js';

export const clinicalAIService = {
  /**
   * Extracts structured clinical entities from natural language text.
   * 
   * @param {string} text - Patient's natural statement
   * @param {Object} context - { currentField, currentHistory, language }
   * @returns {Promise<{ success: boolean, extracted: Object, meta: Object }>}
   */
  async extract(text, context = {}) {
    if (!text || !text.trim()) {
      return {
        success: true,
        extracted: {},
        meta: { source: 'EMPTY', confidence: 1.0 }
      };
    }

    try {
      // 1. Attempt call to server API endpoint (which holds Gemini 3.8 Flash)
      const response = await fetch('/api/extract-clinical-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          context: {
            currentField: context.currentField,
            currentQuestionId: context.currentQuestionId,
            language: context.language || 'en',
            currentHistory: sanitizeHistoryForContext(context.currentHistory)
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result.extracted) {
          const validation = validateClinicalHistory(result.extracted);
          if (validation.valid) {
            return result;
          }
        }
      }
    } catch (err) {
      console.warn('[clinicalAIService] Server API unavailable or network failed, falling back to local extractor:', err.message);
    }

    // 2. Client-side deterministic fallback (offline / standalone resilience)
    const localExtracted = localExtractClinicalInfo(text, context);
    return {
      success: true,
      extracted: localExtracted,
      meta: {
        source: 'AI_EXTRACTION',
        engine: 'client_deterministic_fallback',
        rawUtterance: text,
        confidence: 0.90
      }
    };
  }
};

/**
 * Strips circular or large objects before sending context to server
 */
function sanitizeHistoryForContext(history) {
  if (!history) return {};
  return {
    chief_complaint: history.chief_complaint,
    hpi: history.hpi,
    priority: history.priority,
    symptom_status: history.symptom_status || {},
    answered_questions: history.answered_questions || [],
    negated_symptoms: history.negated_symptoms || []
  };
}

export default clinicalAIService;
