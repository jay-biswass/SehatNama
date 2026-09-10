/**
 * Server-Side Clinical AI Engine
 * 
 * Powered by Google Gemini 3.8 Flash (gemini-3.8-flash) with a robust
 * deterministic fallback parser for Hindi, Hinglish, and English clinical entities.
 * 
 * Runs strictly on the server / edge layer.
 * ZERO API keys exposed to the client bundle.
 */

import { localExtractClinicalInfo } from '../src/services/localClinicalExtractor.js';
import { getEnv } from './documentAIEngine.js';

export { localExtractClinicalInfo };

const CLINICAL_EXTRACTION_SYSTEM_PROMPT = `
You are a precise clinical entity extraction system for hospital intake in India.
Your role is to extract factual patient-reported symptoms into a structured JSON schema.

INPUT LANGUAGES:
- Hindi (Devanagari or Romanized / Hinglish, e.g. "Mere seene mein kal se bahut dard ho raha hai")
- English
- Mixed Hindi-English

STRICT SAFETY CONSTRAINTS:
1. NEVER diagnose the patient (e.g. do NOT say "patient has myocardial infarction" or "angina").
2. NEVER prescribe medications or suggest treatments.
3. NEVER determine emergency triage priority - priority is governed by deterministic rules.
4. Extract ONLY information explicitly stated by the patient in their input.
5. NEVER invent, assume, or hallucinate details. If a field was not mentioned, it MUST be null or omitted.
6. NEGATION RULE: If a patient denies a symptom (e.g. "saans lene mein koi dikkat nahi hai", "no fever", "pain does not radiate to arm"), do NOT include it in positive symptoms or radiation!
7. UNCERTAINTY RULE: If a patient expresses uncertainty (e.g. "shayad kal se", "not sure", "pata nahi"), do not guess exact clinical values.
8. Normalize extracted entities into standard English medical terminology:
   - "seene mein dard" / "chhati mein dard" -> chief_complaint: "chest pain", site: "chest"
   - "kal se" -> duration: "1 day"
   - "achanak" -> onset: "sudden"
   - "dheere dheere" -> onset: "gradual"
   - "left haath" / "baayein haath" -> radiation: "left arm"
   - "saans phoolna" / "saans lene mein pareshani" -> associated_symptoms: ["breathing difficulty"]
   - "paseena aana" -> associated_symptoms: ["sweating"]
   - "chakkar aana" -> associated_symptoms: ["dizziness"]
   - "ulti aana" / "ghabrahat" -> associated_symptoms: ["nausea"]

SCHEMA TO RETURN (strict JSON only, no markdown wrapping):
{
  "chief_complaint": string or null,
  "hpi": {
    "onset": "sudden" | "gradual" | null,
    "duration": string or null,
    "site": string or null,
    "character": string or null,
    "radiation": string or null,
    "severity": number (0-10) or null,
    "timing": string or null,
    "aggravating_factors": string[],
    "relieving_factors": string[],
    "associated_symptoms": string[]
  },
  "past_medical_history": string[],
  "medications": string[],
  "allergies": string[],
  "uncertainty_flag": boolean,
  "negated_symptoms": string[]
}
`;

/**
 * Main extraction entry point called by server route.
 */
export async function extractClinicalInfo(patientUtterance, context = {}) {
  const text = (patientUtterance || '').trim();
  if (!text) {
    return {
      success: true,
      extracted: {},
      meta: { source: 'AI_EXTRACTION', engine: 'empty_input', confidence: 1.0 }
    };
  }

  const geminiApiKey = getEnv('GEMINI_API_KEY');
  const geminiModel = getEnv('GEMINI_MODEL') || 'gemini-3.6-flash';

  // 1. If Gemini API Key is configured, attempt Gemini 3.8 Flash call
  if (geminiApiKey && !geminiApiKey.includes('your_gemini_api_key')) {
    try {
      const geminiResult = await callGemini38Flash(text, context, geminiApiKey, geminiModel);
      if (geminiResult && typeof geminiResult === 'object') {
        const localEnrichment = localExtractClinicalInfo(text, context);
        if (!geminiResult.symptom_status && localEnrichment.symptom_status) {
          geminiResult.symptom_status = localEnrichment.symptom_status;
        }
        if (!geminiResult.answered_questions && localEnrichment.answered_questions) {
          geminiResult.answered_questions = localEnrichment.answered_questions;
        }
        if (Array.isArray(localEnrichment.negated_symptoms) && localEnrichment.negated_symptoms.length > 0) {
          geminiResult.negated_symptoms = [
            ...(geminiResult.negated_symptoms || []),
            ...localEnrichment.negated_symptoms.filter(s => !(geminiResult.negated_symptoms || []).includes(s))
          ];
        }
        return {
          success: true,
          extracted: geminiResult,
          meta: {
            source: 'AI_EXTRACTION',
            engine: geminiModel,
            rawUtterance: text,
            confidence: 0.96
          }
        };
      }
    } catch (err) {
      console.warn('[clinicalAIEngine] Gemini 3.8 Flash call failed, falling back to local deterministic extractor:', err.message);
    }
  }

  // 2. High-precision deterministic fallback parser (offline, test, or API fallback)
  const localResult = localExtractClinicalInfo(text, context);
  return {
    success: true,
    extracted: localResult,
    meta: {
      source: 'AI_EXTRACTION',
      engine: 'local_deterministic_rules',
      rawUtterance: text,
      confidence: 0.92
    }
  };
}

/**
 * Calls Gemini 3.8 Flash via REST API with strict JSON mode.
 */
async function callGemini38Flash(text, context = {}, apiKey, model) {
  const geminiApiKey = apiKey || getEnv('GEMINI_API_KEY');
  const geminiModel = model || getEnv('GEMINI_MODEL') || 'gemini-3.8-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

  const promptContext = `
Current Active Field: ${context.currentField || 'general intake'}
Existing Known History: ${JSON.stringify(context.currentHistory || {})}
Selected Language: ${context.language || 'en'}

Patient Statement: "${text}"
`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: CLINICAL_EXTRACTION_SYSTEM_PROMPT },
          { text: promptContext }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error status ${response.status}: ${errorText}`);
  }

  const json = await response.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini API');

  return JSON.parse(rawText);
}

export default {
  extractClinicalInfo,
  localExtractClinicalInfo
};
