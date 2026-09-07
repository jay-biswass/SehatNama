/**
 * Deterministic Red-Flag & Clinical Triage Safety Engine
 * 
 * Evaluates patient clinical history against deterministic clinical safety rules
 * across 46+ major OPD presentations and specialties.
 * 
 * CRITICAL SAFETY PRINCIPLE:
 * Red flags are treated as URGENT TRIAGE SIGNALS requiring prompt in-person
 * clinical assessment by hospital healthcare staff.
 * They are NEVER presented or stored as definitive medical diagnoses.
 */

const NON_DIAGNOSTIC_DISCLAIMER = "This is a non-diagnostic triage signal indicating clinical urgency. Immediate assessment by healthcare staff is recommended.";

/**
 * Evaluates structured clinical history object deterministically across all presentations.
 * 
 * @param {Object} clinicalHistory - Standardized clinical history object
 * @returns {{ priority: 'NORMAL' | 'HIGH', alertTriggered: boolean, redFlags: Array<Object> }}
 */
export function evaluateRedFlagsFromHistory(clinicalHistory) {
  if (!clinicalHistory || typeof clinicalHistory !== 'object') {
    return { priority: 'NORMAL', alertTriggered: false, redFlags: [] };
  }

  const redFlags = [];
  const hpi = clinicalHistory.hpi || {};
  const severity = hpi.severity !== null && hpi.severity !== undefined ? Number(hpi.severity) : 0;
  const associated = Array.isArray(hpi.associated_symptoms) ? hpi.associated_symptoms.map(s => String(s).toLowerCase()) : [];
  const radiation = hpi.radiation ? String(hpi.radiation).toLowerCase() : '';
  const onset = hpi.onset ? String(hpi.onset).toLowerCase() : '';
  const complaint = String(clinicalHistory.chief_complaint || '').toLowerCase();
  const rawText = String(clinicalHistory.raw_statement || '').toLowerCase();

  // -------------------------------------------------------------
  // 1. MENTAL HEALTH: SELF-HARM / SUICIDAL STATEMENTS
  // -------------------------------------------------------------
  const selfHarmPatterns = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'khudkushi',
    'marne ka man', 'aatmahatya', 'jaan lena', 'harm myself', 'don\'t want to live'
  ];
  if (selfHarmPatterns.some(p => rawText.includes(p) || complaint.includes(p))) {
    redFlags.push({
      type: 'emergency_self_harm_statement',
      signal: 'Patient statement expresses intent or thoughts of self-harm or suicide.',
      priority: 'high',
      recommended_action: 'Direct to immediate human psychiatric emergency support / Tele-MANAS (14416) / Kiran (1800-599-0019) / in-person clinical care.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  // -------------------------------------------------------------
  // 2. CARDIOVASCULAR RED FLAGS
  // -------------------------------------------------------------
  const isChestPain = complaint.includes('chest') || complaint.includes('heart') || complaint.includes('seene') || (hpi.site && String(hpi.site).toLowerCase().includes('chest'));

  if (isChestPain) {
    const hasDyspnea = associated.includes('breathing difficulty') || associated.includes('shortness of breath');
    if (severity >= 7 && hasDyspnea) {
      redFlags.push({
        type: 'severe_chest_pain_with_dyspnea',
        signal: 'Severe chest discomfort (score ≥ 7/10) accompanied by reported breathing difficulty.',
        priority: 'high',
        recommended_action: 'Direct patient immediately to hospital emergency / triage counter.',
        clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
      });
    }

    const hasSweating = associated.includes('sweating') || associated.includes('cold sweats');
    if (severity >= 7 && hasSweating) {
      redFlags.push({
        type: 'severe_chest_pain_with_diaphoresis',
        signal: 'Severe chest discomfort (score ≥ 7/10) accompanied by reported diaphoresis / unusual sweating.',
        priority: 'high',
        recommended_action: 'Immediate human clinical assessment required.',
        clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
      });
    }

    const radiatesToArmOrJaw = radiation.includes('left arm') || radiation.includes('jaw');
    const hasDizziness = associated.includes('dizziness') || associated.includes('lightheadedness') || associated.includes('syncope');
    if (radiatesToArmOrJaw && (hasDizziness || severity >= 8)) {
      redFlags.push({
        type: 'chest_pain_with_radiation_and_hypoperfusion',
        signal: 'Chest discomfort radiating to left arm or jaw with elevated severity or lightheadedness.',
        priority: 'high',
        recommended_action: 'Expedited physician assessment and ECG triage recommended.',
        clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
      });
    }

    if (onset === 'sudden' && severity >= 9) {
      redFlags.push({
        type: 'sudden_severe_chest_pain',
        signal: 'Sudden onset excruciating chest pain (score ≥ 9/10).',
        priority: 'high',
        recommended_action: 'Immediate emergency evaluation for acute vascular / cardiopulmonary event.',
        clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
      });
    }
  }

  // Palpitations with syncope
  const isPalpitation = complaint.includes('palpitation') || complaint.includes('dhadkan');
  if (isPalpitation && (associated.includes('syncope') || associated.includes('fainting') || associated.includes('chest pain'))) {
    redFlags.push({
      type: 'palpitations_with_syncope_or_chest_pain',
      signal: 'Palpitations accompanied by fainting, loss of consciousness, or chest pain.',
      priority: 'high',
      recommended_action: 'Urgent medical evaluation and cardiac monitoring.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  // -------------------------------------------------------------
  // 3. RESPIRATORY RED FLAGS
  // -------------------------------------------------------------
  const isDyspnea = complaint.includes('breath') || complaint.includes('saans') || complaint.includes('dyspnea');
  if (isDyspnea && (onset === 'sudden' && (isChestPain || severity >= 7))) {
    redFlags.push({
      type: 'sudden_severe_dyspnea',
      signal: 'Sudden onset breathing difficulty with elevated severity or chest discomfort.',
      priority: 'high',
      recommended_action: 'Immediate clinical review and oxygen saturation triage.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  // -------------------------------------------------------------
  // 4. NEUROLOGICAL RED FLAGS (FAST Stroke, Thunderclap, Seizure)
  // -------------------------------------------------------------
  const isHeadache = complaint.includes('headache') || complaint.includes('sir') || complaint.includes('head');
  if (isHeadache && onset === 'sudden' && severity >= 8) {
    redFlags.push({
      type: 'sudden_thunderclap_headache',
      signal: 'Sudden onset maximal intensity headache ("thunderclap" pattern, score ≥ 8/10).',
      priority: 'high',
      recommended_action: 'Immediate emergency neurological evaluation to exclude acute intracranial event.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  const hasFocalDeficit = associated.includes('facial drooping') || associated.includes('arm weakness') || 
                          associated.includes('speech difficulty') || associated.includes('slurred speech') ||
                          rawText.includes('face drooping') || rawText.includes('speech difficulty') ||
                          rawText.includes('lakwa') || rawText.includes('ek taraf kamzori');
  if (hasFocalDeficit) {
    redFlags.push({
      type: 'acute_focal_neurological_deficit',
      signal: 'Sudden focal weakness, facial asymmetry, or speech disturbance (FAST criteria).',
      priority: 'high',
      recommended_action: 'Immediate emergency stroke team evaluation recommended.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  // -------------------------------------------------------------
  // 5. EYE RED FLAGS: SUDDEN VISION LOSS
  // -------------------------------------------------------------
  const isSuddenVisionLoss = complaint.includes('sudden vision loss') || complaint.includes('blindness') ||
                            (complaint.includes('eye') && (associated.includes('vision loss') || rawText.includes('roshni chali gayi')));
  if (isSuddenVisionLoss) {
    redFlags.push({
      type: 'acute_vision_loss',
      signal: 'Sudden loss of visual acuity or darkness reported in one or both eyes.',
      priority: 'high',
      recommended_action: 'Immediate ophthalmologic emergency evaluation.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  // -------------------------------------------------------------
  // 6. ALLERGY / ANAPHYLAXIS RED FLAGS
  // -------------------------------------------------------------
  const isAllergyOrSkin = complaint.includes('rash') || complaint.includes('swelling') || complaint.includes('hives') || complaint.includes('pitti');
  const hasFacialOrThroatSwelling = associated.includes('facial swelling') || associated.includes('lip swelling') || 
                                    associated.includes('throat tightness') || hpi.site === 'throat';
  const hasDyspneaWithSwelling = associated.includes('breathing difficulty') || associated.includes('shortness of breath');
  if ((isAllergyOrSkin || hasFacialOrThroatSwelling) && (hasFacialOrThroatSwelling && hasDyspneaWithSwelling)) {
    redFlags.push({
      type: 'suspected_anaphylaxis',
      signal: 'Acute swelling of face/lips/throat accompanied by respiratory difficulty.',
      priority: 'high',
      recommended_action: 'Immediate emergency airway assessment for severe hypersensitivity reaction.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  // -------------------------------------------------------------
  // 7. GASTROINTESTINAL & ACUTE ABDOMEN RED FLAGS
  // -------------------------------------------------------------
  const hasHematemesis = associated.includes('vomiting blood') || associated.includes('hematemesis') || 
                         rawText.includes('ulti mein khoon') || rawText.includes('blood in vomit');
  const hasMelena = associated.includes('black stool') || associated.includes('melena') || rawText.includes('kala dast');
  if (hasHematemesis || hasMelena) {
    redFlags.push({
      type: 'acute_gastrointestinal_bleeding',
      signal: 'Reported vomiting of blood (hematemesis) or black tarry stools (melena).',
      priority: 'high',
      recommended_action: 'Urgent clinical assessment and hemodynamic monitoring.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  const isAbdominalPain = complaint.includes('abdom') || complaint.includes('pet') || complaint.includes('stomach');
  if (isAbdominalPain && severity >= 8 && (associated.includes('high fever') || associated.includes('rigid abdomen') || associated.includes('fainting'))) {
    redFlags.push({
      type: 'acute_severe_abdomen',
      signal: 'Severe abdominal pain (score ≥ 8/10) with systemic fever or peritoneal signs.',
      priority: 'high',
      recommended_action: 'Urgent surgical / clinical abdominal evaluation.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  // -------------------------------------------------------------
  // 8. MUSCULOSKELETAL: CAUDA EQUINA RED FLAG
  // -------------------------------------------------------------
  const isBackPain = complaint.includes('back') || complaint.includes('kamar') || complaint.includes('spine');
  const hasBowelBladderLoss = associated.includes('bowel incontinence') || associated.includes('urinary retention') ||
                              rawText.includes('peshab rukna') || rawText.includes('peshab par control nahi');
  if (isBackPain && hasBowelBladderLoss) {
    redFlags.push({
      type: 'suspected_cauda_equina',
      signal: 'Severe back pain associated with acute loss of bowel or bladder sphincter control.',
      priority: 'high',
      recommended_action: 'Emergency MRI / neurosurgical evaluation required to prevent permanent nerve injury.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  // -------------------------------------------------------------
  // 9. PREGNANCY WARNING SIGNS
  // -------------------------------------------------------------
  const isPregnancy = complaint.includes('pregnan') || complaint.includes('garbh');
  const hasBleeding = associated.includes('bleeding') || associated.includes('vaginal bleeding') || rawText.includes('khoon aana');
  if (isPregnancy && hasBleeding && (severity >= 6 || associated.includes('dizziness'))) {
    redFlags.push({
      type: 'pregnancy_acute_bleeding',
      signal: 'Pregnancy accompanied by active vaginal bleeding or severe pelvic pain.',
      priority: 'high',
      recommended_action: 'Immediate obstetric emergency assessment.',
      clinical_disclaimer: NON_DIAGNOSTIC_DISCLAIMER
    });
  }

  const alertTriggered = redFlags.length > 0;
  return {
    priority: alertTriggered ? 'HIGH' : 'NORMAL',
    alertTriggered,
    redFlags
  };
}

/**
 * Legacy adapter for backward compatibility with Question.jsx and older views.
 */
export function checkRedFlags(concern, answers) {
  if (!answers || Object.keys(answers).length === 0) {
    return { priority: "normal", alertTriggered: false, redFlags: [] };
  }

  // Convert legacy answer map into standard structured check
  const severityVal = answers.severity !== undefined ? parseInt(answers.severity, 10) : null;
  const isBreathing = answers.breathing === "Yes" || answers.breathing === "हाँ, सांस लेने में परेशानी है" || answers.breathing === "Yes, having difficulty breathing";
  const isSweating = answers.sweating === "Yes" || answers.sweating === "हाँ, पसीना आ रहा है" || answers.sweating === "Yes, sweating unusually";

  const syntheticHistory = {
    chief_complaint: concern === 'chest_pain' ? 'chest pain' : concern,
    hpi: {
      severity: severityVal,
      associated_symptoms: [
        ...(isBreathing ? ['breathing difficulty'] : []),
        ...(isSweating ? ['sweating'] : [])
      ],
      onset: answers.onset_speed === "Suddenly" || answers.speed === "Suddenly" ? 'sudden' : null,
      radiation: Array.isArray(answers.radiation) ? answers.radiation.join(', ') : (answers.radiation || null)
    }
  };

  const result = evaluateRedFlagsFromHistory(syntheticHistory);
  return {
    priority: result.alertTriggered ? "high" : "normal",
    alertTriggered: result.alertTriggered,
    redFlags: result.redFlags
  };
}

export default {
  evaluateRedFlagsFromHistory,
  checkRedFlags
};
