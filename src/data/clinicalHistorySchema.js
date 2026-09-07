/**
 * Clinical History Schema & Provenance Audit Trail Data Model
 * 
 * Standardized SOCRATES-compliant clinical intake model for SehatNama.
 * Supports extensible pathways, data validation, merge algorithms,
 * and clinical provenance tracking (PATIENT_DIRECT, AI_EXTRACTION, PHYSICIAN_CONFIRMED).
 */

export const PROVENANCE_SOURCES = {
  PATIENT_DIRECT: 'PATIENT_DIRECT',       // Direct selection via touch UI / discrete input
  AI_EXTRACTION: 'AI_EXTRACTION',         // Extracted from free text or transcribed voice
  PHYSICIAN_CONFIRMED: 'PHYSICIAN_CONFIRMED' // Confirmed or adjusted by clinician
};

export const initialClinicalHistory = {
  chief_complaint: "",
  hpi: {
    onset: null,               // e.g. "sudden" | "gradual"
    duration: null,            // e.g. "1 day" | "since yesterday"
    site: null,                // e.g. "center of chest" | "left chest"
    character: null,           // e.g. "pressure" | "tightness" | "sharp" | "burning"
    radiation: null,           // e.g. "left arm" | "jaw" | "none"
    severity: null,            // number 1-10
    timing: null,              // e.g. "constant" | "intermittent"
    aggravating_factors: [],   // e.g. ["exertion", "deep breathing"]
    relieving_factors: [],     // e.g. ["rest"]
    associated_symptoms: []    // e.g. ["breathing difficulty", "sweating", "nausea"]
  },
  past_medical_history: [],    // e.g. ["hypertension", "diabetes", "previous MI"]
  past_surgical_history: [],
  medications: [],             // e.g. ["aspirin", "metformin"]
  allergies: [],               // e.g. ["penicillin"]
  family_history: [],
  personal_history: {
    smoking: null,             // "yes" | "no" | "former"
    alcohol: null,
    diet: null,
    occupation: null,
    sleep: null
  },
  priority: "NORMAL",          // "NORMAL" | "HIGH"
  red_flags: [],               // Active triage safety signals
  symptom_status: {},          // Three-state representation: { [symptomId]: 'YES' | 'NO' | 'UNKNOWN' }
  answered_questions: [],      // Array of answered question IDs / canonical fields
  negated_symptoms: [],        // Explicitly denied symptoms, e.g. ["breathing difficulty", "sweating"]
  provenance: {}               // Field-level audit trail: { [fieldKey]: ProvenanceEntry }
};

/**
 * Creates a fresh deep-cloned copy of the initial clinical history schema.
 */
export function createInitialClinicalHistory() {
  return JSON.parse(JSON.stringify(initialClinicalHistory));
}

/**
 * Validates a clinical history object against basic type and value constraints.
 */
export function validateClinicalHistory(history) {
  if (!history || typeof history !== 'object') {
    return { valid: false, errors: ['History must be an object'] };
  }

  const errors = [];

  if (history.hpi && typeof history.hpi !== 'object') {
    errors.push('hpi must be an object');
  }

  if (history.hpi?.severity !== null && history.hpi?.severity !== undefined) {
    const num = Number(history.hpi.severity);
    if (isNaN(num) || num < 0 || num > 10) {
      errors.push('severity must be a number between 0 and 10 or null');
    }
  }

  if (history.hpi?.associated_symptoms && !Array.isArray(history.hpi.associated_symptoms)) {
    errors.push('associated_symptoms must be an array');
  }

  if (history.past_medical_history && !Array.isArray(history.past_medical_history)) {
    errors.push('past_medical_history must be an array');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Safely merges newly extracted clinical entities into existing clinical history,
 * preserving existing valid data and updating the clinical provenance audit trail.
 * 
 * @param {Object} current - Existing clinical history state
 * @param {Object} updates - Extracted or user-provided clinical delta
 * @param {Object} meta - Provenance metadata: { source, rawUtterance, confidence }
 * @returns {Object} Updated clinical history with updated audit trail
 */
export function mergeClinicalHistory(current, updates = {}, meta = {}) {
  const merged = JSON.parse(JSON.stringify(current || initialClinicalHistory));
  const now = new Date().toISOString();
  const source = meta.source || PROVENANCE_SOURCES.AI_EXTRACTION;
  const rawUtterance = meta.rawUtterance || '';
  const confidence = meta.confidence ?? 1.0;

  if (!merged.provenance) {
    merged.provenance = {};
  }

  // Record audit entry helper
  const recordProvenance = (fieldKey, value, isContradiction = false) => {
    const existing = merged.provenance[fieldKey];
    merged.provenance[fieldKey] = {
      value,
      source,
      raw_utterance: rawUtterance,
      confidence,
      timestamp: now,
      status: isContradiction ? 'contradiction_flagged' : (existing?.status === 'confirmed' ? 'confirmed' : 'draft'),
      previous_value: existing ? existing.value : undefined
    };
  };

  // 1. Chief complaint
  if (updates.chief_complaint && typeof updates.chief_complaint === 'string' && updates.chief_complaint.trim()) {
    const newVal = updates.chief_complaint.trim().toLowerCase();
    if (merged.chief_complaint && merged.chief_complaint.toLowerCase() !== newVal) {
      recordProvenance('chief_complaint', newVal, true);
    } else {
      recordProvenance('chief_complaint', newVal, false);
    }
    merged.chief_complaint = newVal;
  }

  // 2. HPI
  if (updates.hpi && typeof updates.hpi === 'object') {
    if (!merged.hpi) merged.hpi = {};

    const scalarFields = ['onset', 'duration', 'site', 'character', 'radiation', 'timing'];
    scalarFields.forEach(field => {
      if (updates.hpi[field] !== undefined && updates.hpi[field] !== null && updates.hpi[field] !== '') {
        const newVal = String(updates.hpi[field]).trim();
        const oldVal = merged.hpi[field];
        const isContradiction = oldVal && oldVal.toLowerCase() !== newVal.toLowerCase();
        recordProvenance(`hpi.${field}`, newVal, isContradiction);
        merged.hpi[field] = newVal;
      }
    });

    // Severity (number 0-10)
    if (updates.hpi.severity !== undefined && updates.hpi.severity !== null && updates.hpi.severity !== '') {
      const num = parseInt(updates.hpi.severity, 10);
      if (!isNaN(num) && num >= 0 && num <= 10) {
        const oldVal = merged.hpi.severity;
        const isContradiction = oldVal !== null && oldVal !== undefined && Math.abs(oldVal - num) > 3;
        recordProvenance('hpi.severity', num, isContradiction);
        merged.hpi.severity = num;
      }
    }

    // Array fields: aggravating_factors, relieving_factors, associated_symptoms
    const arrayFields = ['aggravating_factors', 'relieving_factors', 'associated_symptoms'];
    arrayFields.forEach(arrField => {
      if (Array.isArray(updates.hpi[arrField])) {
        if (!Array.isArray(merged.hpi[arrField])) {
          merged.hpi[arrField] = [];
        }
        updates.hpi[arrField].forEach(item => {
          if (item && typeof item === 'string') {
            const clean = item.trim().toLowerCase();
            if (!merged.hpi[arrField].map(i => i.toLowerCase()).includes(clean)) {
              merged.hpi[arrField].push(clean);
            }
          }
        });
        if (updates.hpi[arrField].length > 0) {
          recordProvenance(`hpi.${arrField}`, merged.hpi[arrField], false);
        }
      }
    });
  }

  // 3. Past Medical History
  if (Array.isArray(updates.past_medical_history)) {
    if (!Array.isArray(merged.past_medical_history)) merged.past_medical_history = [];
    updates.past_medical_history.forEach(item => {
      if (item && !merged.past_medical_history.includes(item)) {
        merged.past_medical_history.push(item);
      }
    });
    if (updates.past_medical_history.length > 0) {
      recordProvenance('past_medical_history', merged.past_medical_history, false);
    }
  }

  // 4. Medications & Allergies
  if (Array.isArray(updates.medications)) {
    if (!Array.isArray(merged.medications)) merged.medications = [];
    updates.medications.forEach(m => {
      if (m && !merged.medications.includes(m)) merged.medications.push(m);
    });
    if (updates.medications.length > 0) {
      recordProvenance('medications', merged.medications, false);
    }
  }

  if (Array.isArray(updates.allergies)) {
    if (!Array.isArray(merged.allergies)) merged.allergies = [];
    updates.allergies.forEach(a => {
      if (a && !merged.allergies.includes(a)) merged.allergies.push(a);
    });
    if (updates.allergies.length > 0) {
      recordProvenance('allergies', merged.allergies, false);
    }
  }

  // 5. Negated Symptoms
  if (Array.isArray(updates.negated_symptoms)) {
    if (!Array.isArray(merged.negated_symptoms)) merged.negated_symptoms = [];
    updates.negated_symptoms.forEach(item => {
      if (item && typeof item === 'string') {
        const clean = item.trim().toLowerCase();
        if (!merged.negated_symptoms.map(i => i.toLowerCase()).includes(clean)) {
          merged.negated_symptoms.push(clean);
        }
      }
    });
    if (updates.negated_symptoms.length > 0) {
      recordProvenance('negated_symptoms', merged.negated_symptoms, false);
    }
  }

  // 6. Symptom Status (Three-state: YES | NO | UNKNOWN)
  if (updates.symptom_status && typeof updates.symptom_status === 'object') {
    if (!merged.symptom_status || typeof merged.symptom_status !== 'object') {
      merged.symptom_status = {};
    }
    Object.entries(updates.symptom_status).forEach(([key, val]) => {
      if (val) {
        merged.symptom_status[key] = val;
        recordProvenance(`symptom_status.${key}`, val, false);
      }
    });
  }

  // 7. Answered Questions Tracking
  if (!Array.isArray(merged.answered_questions)) {
    merged.answered_questions = [];
  }
  if (Array.isArray(updates.answered_questions)) {
    updates.answered_questions.forEach(qId => {
      if (qId && !merged.answered_questions.includes(qId)) {
        merged.answered_questions.push(qId);
      }
    });
  }
  if (updates.answered_field && !merged.answered_questions.includes(updates.answered_field)) {
    merged.answered_questions.push(updates.answered_field);
  }

  return merged;
}

/**
 * Marks a specific field as confirmed by a physician in the audit trail.
 */
export function recordPhysicianConfirmation(history, fieldKey) {
  const updated = JSON.parse(JSON.stringify(history));
  if (!updated.provenance) updated.provenance = {};

  if (updated.provenance[fieldKey]) {
    updated.provenance[fieldKey].status = 'confirmed';
    updated.provenance[fieldKey].confirmed_at = new Date().toISOString();
    updated.provenance[fieldKey].confirmed_by = 'PHYSICIAN';
  } else {
    updated.provenance[fieldKey] = {
      source: PROVENANCE_SOURCES.PHYSICIAN_CONFIRMED,
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    };
  }

  return updated;
}

/**
 * Calculates completion status and SOCRATES checklist progress.
 */
export function calculateSOCRATESProgress(history) {
  const hpi = history?.hpi || {};
  
  const checklist = [
    { id: 'chief_complaint', label: 'Chief Complaint', known: Boolean(history?.chief_complaint), value: history?.chief_complaint },
    { id: 'site', label: 'Site (S)', known: Boolean(hpi.site), value: hpi.site },
    { id: 'onset', label: 'Onset (O)', known: Boolean(hpi.onset), value: hpi.onset },
    { id: 'character', label: 'Character (C)', known: Boolean(hpi.character), value: hpi.character },
    { id: 'radiation', label: 'Radiation (R)', known: Boolean(hpi.radiation), value: hpi.radiation },
    { id: 'associated_symptoms', label: 'Associated (A)', known: Array.isArray(hpi.associated_symptoms) && hpi.associated_symptoms.length > 0, value: hpi.associated_symptoms },
    { id: 'timing', label: 'Timing / Duration (T)', known: Boolean(hpi.timing || hpi.duration), value: hpi.timing || hpi.duration },
    { id: 'exacerbating', label: 'Exacerbating / Relieving (E)', known: (hpi.aggravating_factors?.length > 0 || hpi.relieving_factors?.length > 0), value: hpi.aggravating_factors },
    { id: 'severity', label: 'Severity (S)', known: hpi.severity !== null && hpi.severity !== undefined, value: hpi.severity }
  ];

  const knownCount = checklist.filter(item => item.known).length;
  const percentage = Math.round((knownCount / checklist.length) * 100);

  return {
    percentage,
    knownCount,
    totalCount: checklist.length,
    checklist
  };
}

/**
 * Produces the clean physician-ready structured object suitable for doctor review.
 */
export function generatePhysicianSummary(clinicalHistory, patientData = {}) {
  const hpi = clinicalHistory?.hpi || {};

  return {
    chief_complaint: clinicalHistory?.chief_complaint ? capitalize(clinicalHistory.chief_complaint) : "Unspecified",
    duration: hpi.duration || hpi.timing || null,
    hpi: {
      onset: hpi.onset || null,
      site: hpi.site || null,
      severity: hpi.severity !== null && hpi.severity !== undefined ? Number(hpi.severity) : null,
      character: hpi.character || null,
      radiation: hpi.radiation || null,
      associated_symptoms: Array.isArray(hpi.associated_symptoms) ? [...hpi.associated_symptoms] : [],
      aggravating_factors: Array.isArray(hpi.aggravating_factors) ? [...hpi.aggravating_factors] : [],
      relieving_factors: Array.isArray(hpi.relieving_factors) ? [...hpi.relieving_factors] : []
    },
    past_medical_history: Array.isArray(clinicalHistory?.past_medical_history) ? [...clinicalHistory.past_medical_history] : [],
    medications: Array.isArray(clinicalHistory?.medications) ? [...clinicalHistory.medications] : (patientData?.extractedMedicalData?.medications || []),
    allergies: Array.isArray(clinicalHistory?.allergies) ? [...clinicalHistory.allergies] : (patientData?.allergies ? [patientData.allergies] : []),
    priority: clinicalHistory?.priority || "NORMAL",
    red_flags: Array.isArray(clinicalHistory?.red_flags) ? [...clinicalHistory.red_flags] : [],
    patient: {
      name: patientData?.patientName || null,
      age: patientData?.age || null,
      gender: patientData?.gender || null,
      mobile: patientData?.mobileNumber || null
    },
    audit_trail: clinicalHistory?.provenance || {},
    generated_at: new Date().toISOString(),
    clinical_disclaimer: "Draft clinical history captured via patient intake assistant. Requires human physician confirmation."
  };
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  initialClinicalHistory,
  PROVENANCE_SOURCES,
  createInitialClinicalHistory,
  validateClinicalHistory,
  mergeClinicalHistory,
  recordPhysicianConfirmation,
  calculateSOCRATESProgress,
  generatePhysicianSummary
};
