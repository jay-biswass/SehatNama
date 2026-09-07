/**
 * Server-Side Gemini Multimodal Medical Document AI Engine
 * 
 * Powered directly by Google Gemini Multimodal Vision / Document Understanding.
 * Accepts JPG, JPEG, PNG, WEBP, and PDF documents.
 * 
 * ZERO OCR FALLBACK. Gemini is the ONLY extraction engine.
 * ZERO API keys exposed to client or logs.
 */

import fs from 'node:fs';
import path from 'node:path';

function loadServerEnv() {
  if (typeof process === 'undefined' || !process.env) return;

  // 1. Native Node.js env loader (Node 20.12+)
  if (typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile();
      return;
    } catch {
      // ignore
    }
  }

  // 2. Direct read of root .env file as reliable fallback
  try {
    const cwd = process.cwd ? process.cwd() : '.';
    const envPath = path.resolve(cwd, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (process.env && (process.env[key] === undefined || process.env[key] === '')) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch {
    // ignore
  }
}

export const getEnv = (key) => {
  if (typeof process === 'undefined' || !process.env) return '';
  if (process.env[key] && process.env[key].trim() !== '') {
    return process.env[key].trim();
  }
  loadServerEnv();
  return (process.env[key] ? process.env[key].trim() : '') || '';
};

export const COMPATIBLE_MULTIMODAL_MODEL = 'gemini-2.5-flash';

export function getCompatibleModel() {
  const configured = getEnv('GEMINI_MODEL') || COMPATIBLE_MULTIMODAL_MODEL;
  // If gemini-3.8-flash is configured, automatically switch to compatible multimodal model
  if (configured.toLowerCase() === 'gemini-3.8-flash') {
    return COMPATIBLE_MULTIMODAL_MODEL;
  }
  return configured;
}

const SUPPORTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf'
]);

export const DOCUMENT_EXTRACTION_PROMPT = `You are the medical document extraction engine for SehatNama.

Analyze the uploaded medical document (image or PDF).

The document may be:
- prescription
- laboratory report
- discharge summary
- consultation note
- diagnostic report
- imaging report
- medical certificate
- other medical document

Extract ONLY information explicitly visible in the document.

DO NOT diagnose the patient.
DO NOT infer information that is not present.
DO NOT hallucinate.

If information is missing, return null or an empty array.
If handwriting is unclear, do not guess.

If the document is too blurry, unreadable, corrupted, or does not contain reliably extractable medical information, return:
{
  "success": false,
  "reason": "Document could not be reliably read"
}

Otherwise return ONLY valid JSON:
{
  "success": true,
  "documentType": null,
  "documentDate": null,
  "hospitalName": null,
  "doctorName": null,

  "patient": {
    "name": null,
    "age": null,
    "sex": null
  },

  "diagnoses": [],

  "medications": [
    {
      "name": null,
      "dose": null,
      "route": null,
      "frequency": null,
      "duration": null,
      "instructions": null
    }
  ],

  "investigations": [
    {
      "name": null,
      "value": null,
      "unit": null,
      "referenceRange": null,
      "flag": null
    }
  ],

  "procedures": [],

  "allergies": [],

  "vitalSigns": [
    {
      "name": null,
      "value": null,
      "unit": null
    }
  ],

  "clinicalNotes": [],

  "doctorAdvice": [],

  "uncertainFields": [],

  "extractionConfidence": null
}

Rules:
1. Extract visible medications with dose/dosage, route, frequency, duration, and instructions. Never invent medications.
2. Extract visible laboratory tests/investigations with value, unit, reference range, and flag. Never invent test values.
3. Extract visible diagnoses and clinical impressions. Never invent diagnoses.
4. Extract visible procedures performed or planned.
5. Extract visible clinical notes and doctor advice/instructions.
6. Extract visible document date and patient details if present. Never invent dates or patient info.
7. Preserve values, dosages, frequencies, and laboratory units exactly as visible.
8. If something cannot be read, use null.
9. Put uncertain information in uncertainFields.
10. Do not provide medical advice or external diagnosis.
11. Return valid JSON only.`;

/**
 * Validates whether the mime type is supported (JPG, JPEG, PNG, WEBP, PDF)
 */
export function isSupportedMimeType(mimeType) {
  if (!mimeType) return false;
  const normalized = mimeType.toLowerCase().split(';')[0].trim();
  return SUPPORTED_MIME_TYPES.has(normalized);
}

/**
 * Safely parses and validates the Gemini structured JSON response
 */
export function validateAndSanitizeGeminiResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      success: false,
      reason: "We couldn't reliably extract information from this document. The original document has been saved."
    };
  }

  // Strip markdown code fences if present (e.g. ```json ... ```)
  let cleanJson = rawText.trim();
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(cleanJson);
  } catch (err) {
    return {
      success: false,
      reason: "We couldn't reliably extract information from this document. The original document has been saved."
    };
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      success: false,
      reason: "We couldn't reliably extract information from this document. The original document has been saved."
    };
  }

  // Check if Gemini explicitly returned an unreadable document flag
  if (parsed.success === false) {
    return {
      success: false,
      reason: "We couldn't reliably extract information from this document. The original document has been saved."
    };
  }

  // Sanitize and structure valid response
  return {
    success: true,
    documentType: parsed.documentType || null,
    documentDate: parsed.documentDate || null,
    hospitalName: parsed.hospitalName || null,
    doctorName: parsed.doctorName || null,
    patient: {
      name: parsed.patient?.name || null,
      age: parsed.patient?.age || null,
      sex: parsed.patient?.sex || null
    },
    diagnoses: Array.isArray(parsed.diagnoses) ? parsed.diagnoses.filter(Boolean).map(d => String(d).trim()) : [],
    medications: Array.isArray(parsed.medications)
      ? parsed.medications
          .filter(m => m && typeof m === 'object' && m.name)
          .map(m => ({
            name: String(m.name || '').trim(),
            dose: m.dose || m.dosage || null,
            route: m.route || null,
            frequency: m.frequency || null,
            duration: m.duration || null,
            instructions: m.instructions || null
          }))
      : [],
    investigations: Array.isArray(parsed.investigations || parsed.labTests || parsed.labResults)
      ? (parsed.investigations || parsed.labTests || parsed.labResults)
          .filter(i => i && typeof i === 'object' && (i.name || i.testName || i.value))
          .map(i => ({
            name: String(i.name || i.testName || '').trim(),
            value: i.value !== undefined && i.value !== null ? String(i.value) : null,
            unit: i.unit || null,
            referenceRange: i.referenceRange || i.range || null,
            flag: i.flag || null
          }))
      : [],
    labResults: Array.isArray(parsed.investigations || parsed.labTests || parsed.labResults)
      ? (parsed.investigations || parsed.labTests || parsed.labResults)
          .filter(i => i && typeof i === 'object' && (i.name || i.testName || i.value))
          .map(i => ({
            name: String(i.name || i.testName || '').trim(),
            value: i.value !== undefined && i.value !== null ? String(i.value) : null,
            unit: i.unit || null,
            referenceRange: i.referenceRange || i.range || null,
            flag: i.flag || null
          }))
      : [],
    procedures: Array.isArray(parsed.procedures) ? parsed.procedures.filter(Boolean).map(p => String(p).trim()) : [],
    allergies: Array.isArray(parsed.allergies) ? parsed.allergies.filter(Boolean).map(a => String(a).trim()) : [],
    vitalSigns: Array.isArray(parsed.vitalSigns)
      ? parsed.vitalSigns.filter(v => v && (v.name || v.value))
      : [],
    clinicalNotes: Array.isArray(parsed.clinicalNotes)
      ? parsed.clinicalNotes.filter(Boolean).map(n => String(n).trim())
      : (parsed.clinicalNotes && typeof parsed.clinicalNotes === 'string')
        ? [parsed.clinicalNotes.trim()]
        : [],
    doctorAdvice: Array.isArray(parsed.doctorAdvice)
      ? parsed.doctorAdvice.filter(Boolean).map(a => String(a).trim())
      : (parsed.doctorAdvice && typeof parsed.doctorAdvice === 'string')
        ? [parsed.doctorAdvice.trim()]
        : [],
    uncertainFields: Array.isArray(parsed.uncertainFields) ? parsed.uncertainFields : [],
    extractionConfidence: parsed.extractionConfidence || null
  };
}

/**
 * Calls Gemini Multimodal API with a specific model
 */
async function callGeminiApi({ model, apiKey, geminiMime, cleanBase64 }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: DOCUMENT_EXTRACTION_PROMPT },
          {
            inlineData: {
              mimeType: geminiMime,
              data: cleanBase64
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.0,
      responseMimeType: 'application/json'
    }
  };

  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

/**
 * Server-Side Document Extraction Handler
 * 
 * Directly calls Gemini Multimodal API with image or PDF binary base64.
 * ZERO OCR FALLBACK.
 * 
 * @param {Object} params
 * @param {string} params.base64Data - Raw base64 or Data URL of the file
 * @param {string} params.mimeType - MIME type of the uploaded file
 * @param {string} [params.fileName] - Original file name for reference
 * @returns {Promise<{ success: boolean, extracted?: Object, reason?: string }>}
 */
export async function extractMedicalDocument({ base64Data, mimeType, fileName = '' }) {
  // 1. Validate file format
  if (!mimeType || !isSupportedMimeType(mimeType)) {
    return {
      success: false,
      reason: 'This document format is not supported.'
    };
  }

  // 2. Validate base64 data
  if (!base64Data || typeof base64Data !== 'string') {
    return {
      success: false,
      reason: 'No file data received for analysis.'
    };
  }

  const geminiApiKey = getEnv('GEMINI_API_KEY');
  let selectedModel = getCompatibleModel();

  // 3. Verify server-side Gemini API key
  if (!geminiApiKey || geminiApiKey.includes('your_gemini_api_key')) {
    console.error('[documentAIEngine] GEMINI_API_KEY is missing or unconfigured on server.');
    return {
      success: false,
      reason: 'Document AI engine is not configured on the server.'
    };
  }

  // Clean data URL prefix if present
  const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '').trim();
  if (!cleanBase64) {
    return {
      success: false,
      reason: 'Document data was empty or invalid.'
    };
  }

  const cleanMime = mimeType.toLowerCase().split(';')[0].trim();
  const geminiMime = cleanMime === 'image/jpg' ? 'image/jpeg' : cleanMime;

  try {
    let response = await callGeminiApi({
      model: selectedModel,
      apiKey: geminiApiKey,
      geminiMime,
      cleanBase64
    });

    // Auto-retry once with COMPATIBLE_MULTIMODAL_MODEL if configured model returned 503 or 404
    if (
      !response.ok &&
      (response.status === 503 || response.status === 404) &&
      selectedModel !== COMPATIBLE_MULTIMODAL_MODEL
    ) {
      console.warn(`[documentAIEngine] Model ${selectedModel} returned HTTP ${response.status}. Retrying with ${COMPATIBLE_MULTIMODAL_MODEL}...`);
      selectedModel = COMPATIBLE_MULTIMODAL_MODEL;
      response = await callGeminiApi({
        model: selectedModel,
        apiKey: geminiApiKey,
        geminiMime,
        cleanBase64
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      // Sanitize to guarantee API key is never in logs
      const sanitizedErr = errorText.replaceAll ? errorText.replaceAll(geminiApiKey, '[REDACTED]') : errorText;
      console.error(`[documentAIEngine] Gemini API HTTP status ${response.status}:`, sanitizedErr);

      // Handle specific HTTP error status codes accurately
      if (response.status === 400) {
        return {
          success: false,
          reason: 'Gemini API request error (400): Invalid request format or unsupported parameter. Please check the document file.'
        };
      }

      if (
        response.status === 401 ||
        response.status === 403 ||
        errorText.includes('API_KEY_INVALID') ||
        errorText.includes('PERMISSION_DENIED')
      ) {
        return {
          success: false,
          reason: 'Document AI authentication failed. Please check the server configuration.'
        };
      }

      if (response.status === 429 || errorText.includes('RESOURCE_EXHAUSTED')) {
        return {
          success: false,
          reason: 'Gemini API rate limit or quota exceeded (429). Please wait a moment and click Retry Extraction.'
        };
      }

      if (response.status === 503 || errorText.includes('UNAVAILABLE')) {
        return {
          success: false,
          reason: 'Gemini service is temporarily unavailable (503). Please click Retry Extraction.'
        };
      }

      return {
        success: false,
        reason: 'Unable to extract information from this document right now. The original document has been saved.'
      };
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return {
        success: false,
        reason: "We couldn't reliably extract information from this document. The original document has been saved."
      };
    }

    // 5. Validate and structure Gemini output
    const validated = validateAndSanitizeGeminiResponse(rawText);
    if (!validated.success) {
      return {
        success: false,
        reason: validated.reason || "We couldn't reliably extract information from this document. The original document has been saved."
      };
    }

    return {
      success: true,
      extracted: validated,
      meta: {
        engine: selectedModel,
        fileName
      }
    };
  } catch (err) {
    console.error('[documentAIEngine] Extraction error:', err.message);
    return {
      success: false,
      reason: 'Unable to extract information from this document right now. The original document has been saved.'
    };
  }
}

export default {
  extractMedicalDocument,
  isSupportedMimeType,
  validateAndSanitizeGeminiResponse,
  DOCUMENT_EXTRACTION_PROMPT,
  getEnv,
  getCompatibleModel,
  COMPATIBLE_MULTIMODAL_MODEL
};
