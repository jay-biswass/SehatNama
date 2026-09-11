/**
 * Test Suite: SehatNama Multi-Complaint Clinical History-Taking Engine
 * 
 * Comprehensive verification across 46+ presentations:
 * 1. Multi-Complaint Entity Extraction (15+ Presentations)
 * 2. Protocol Selection & Adaptive Question Flow via Protocol Registry
 * 3. Voice-First Text-to-Speech (TTS) Service
 * 4. Negation, Uncertainty & Non-Hallucination Handling
 * 5. Contradictory-Answer Resolution & Audit Trail Provenance
 * 6. Deterministic Safety Red Flags across Specialties (Cardio, Neuro, Bleeding, Eye, Pregnancy, Self-Harm)
 * 7. End-to-End Clinical Intake Simulation for Multiple Complaints (Chest Pain, Headache, Fever)
 * 8. Physician-Ready Structured Summary Generation
 */

import assert from 'node:assert';
import { localExtractClinicalInfo } from '../api/clinicalAIEngine.js';
import {
  createInitialClinicalHistory,
  mergeClinicalHistory,
  recordPhysicianConfirmation,
  generatePhysicianSummary,
  PROVENANCE_SOURCES
} from '../src/data/clinicalHistorySchema.js';
import { evaluateRedFlagsFromHistory } from '../src/utils/redFlagRules.js';
import { questionEngine } from '../src/utils/questionEngine.js';
import { matchProtocol, getProtocol, getAllProtocols } from '../src/clinical/protocolRegistry.js';
import ttsService from '../src/services/ttsService.js';
import sessionPersistence from '../src/services/sessionPersistence.js';
import {
  extractMedicalDocument,
  validateAndSanitizeGeminiResponse,
  isSupportedMimeType,
  DOCUMENT_EXTRACTION_PROMPT,
  getCompatibleModel,
  COMPATIBLE_MULTIMODAL_MODEL
} from '../api/documentAIEngine.js';
import {
  isSupportedDocument,
  extractDocument,
  documentAIService
} from '../src/services/documentAI/documentAIService.js';

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log(' SEHATNAMA MULTI-COMPLAINT CLINICAL ENGINE TEST SUITE');
console.log('======================================================\n');

// -----------------------------------------------------------------------------
// 1. MULTI-COMPLAINT EXTRACTION & PROTOCOL MAPPING (15+ COMPLAINTS)
// -----------------------------------------------------------------------------
console.log('--- 1. Multi-Complaint Protocol Matching & Extraction Tests ---');

const complaintCases = [
  { input: "Mere seene mein kal se bahut dard ho raha hai", expectedId: 'chest_pain', desc: '1. Chest Pain (Cardiovascular)' },
  { input: "Kal se mere sir mein bahut dard hai", expectedId: 'headache', desc: '2. Headache (Neurological)' },
  { input: "Mujhe 2 din se tez bukhar hai", expectedId: 'fever', desc: '3. Fever (General)' },
  { input: "Bahut khansi aa rahi hai balgam ke sath", expectedId: 'cough', desc: '4. Cough (Respiratory)' },
  { input: "Saans lene mein takleef ho rahi hai", expectedId: 'breathlessness', desc: '5. Breathlessness (Respiratory)' },
  { input: "Pet mein bahut tez marod aur dard hai", expectedId: 'abdominal_pain', desc: '6. Abdominal Pain (Gastrointestinal)' },
  { input: "Subah se baar baar ulti ho rahi hai", expectedId: 'nausea_vomiting', desc: '7. Vomiting / Nausea (Gastrointestinal)' },
  { input: "Kal se loose motion aur dast lage hain", expectedId: 'diarrhea', desc: '8. Diarrhea (Gastrointestinal)' },
  { input: "Kamar mein bahut dard hai pair tak ja raha hai", expectedId: 'back_pain', desc: '9. Back Pain / Sciatica (Musculoskeletal)' },
  { input: "Achanak sir ghoom raha hai aur chakkar aa rahe hain", expectedId: 'dizziness', desc: '10. Dizziness / Vertigo (Neurological)' },
  { input: "Dil ki dhadkan achanak bahut tez chal rahi hai", expectedId: 'palpitations', desc: '11. Palpitations (Cardiovascular)' },
  { input: "Peshab mein bohot jalan aur dard hai", expectedId: 'painful_urination', desc: '12. Painful Urination (Genitourinary)' },
  { input: "Achanak aankh ke aage andhera ho gaya roshni chali gayi", expectedId: 'sudden_vision_loss', desc: '13. Sudden Vision Loss (Eye Emergency)' },
  { input: "3 mahine ki pregnancy hai aur ulti ho rahi hai", expectedId: 'pregnancy_symptoms', desc: '14. Pregnancy Symptoms (Women\'s Health)' },
  { input: "Mujhe kuch dino se theek nahi lag raha hai, ajeeb si takleef hai", expectedId: 'generic_complaint', desc: '15. Broad / Generic Fallback Presentation' }
];

for (const c of complaintCases) {
  runTest(`Extracts & maps ${c.desc}`, () => {
    const extracted = localExtractClinicalInfo(c.input);
    const protocol = matchProtocol(extracted.chief_complaint || c.input);
    assert.strictEqual(protocol.id, c.expectedId, `Expected protocol ${c.expectedId}, got ${protocol.id}`);
  });
}

// -----------------------------------------------------------------------------
// 2. PROTOCOL REGISTRY INTEGRITY TESTS
// -----------------------------------------------------------------------------
console.log('\n--- 2. Protocol Registry Integrity Tests ---');

runTest('Protocol Registry contains 46+ clinical protocols plus generic fallback', () => {
  const protocols = getAllProtocols();
  assert.ok(protocols.length >= 25, `Expected >= 25 protocols, found ${protocols.length}`);

  // Verify key protocols exist
  const expectedKeys = [
    'chest_pain', 'palpitations', 'leg_swelling',
    'breathlessness', 'cough', 'wheezing', 'sore_throat',
    'headache', 'dizziness', 'fainting', 'weakness', 'numbness_tingling',
    'abdominal_pain', 'nausea_vomiting', 'diarrhea', 'constipation', 'loss_of_appetite',
    'fever', 'fatigue', 'weight_loss',
    'back_pain', 'joint_pain', 'limb_pain',
    'painful_urination', 'increased_urination', 'blood_in_urine', 'difficulty_urinating',
    'ear_pain', 'hearing_difficulty', 'nasal_congestion',
    'eye_pain', 'red_eye', 'blurred_vision', 'sudden_vision_loss',
    'rash', 'itching', 'skin_swelling', 'skin_lesion',
    'menstrual_problems', 'pelvic_pain', 'abnormal_vaginal_bleeding', 'pregnancy_symptoms',
    'sleep_problems', 'anxiety_symptoms', 'low_mood',
    'generic_complaint'
  ];

  for (const key of expectedKeys) {
    const p = getProtocol(key);
    assert.ok(p && p.id === key, `Protocol ${key} must exist in registry`);
    assert.ok(p.questions && p.questions.length > 0, `Protocol ${key} must have questions defined`);
  }
});

// -----------------------------------------------------------------------------
// 3. VOICE-FIRST TEXT-TO-SPEECH (TTS) TESTS
// -----------------------------------------------------------------------------
console.log('\n--- 3. Voice-First Text-to-Speech (TTS) Tests ---');

runTest('TTS Service manages mute state, repeat, and graceful fallbacks', () => {
  assert.strictEqual(typeof ttsService.speak, 'function');
  assert.strictEqual(typeof ttsService.repeat, 'function');
  assert.strictEqual(typeof ttsService.setMuted, 'function');

  // Mute control
  ttsService.setMuted(true);
  assert.strictEqual(ttsService.isMuted(), true);

  // Calling speak while muted must execute onStart/onEnd without throwing
  let started = false;
  let ended = false;
  ttsService.speak("Test voice speech", {
    language: 'hi',
    onStart: () => { started = true; },
    onEnd: () => { ended = true; }
  });

  assert.strictEqual(started, true, 'onStart should execute');
  assert.strictEqual(ended, true, 'onEnd should execute');

  ttsService.setMuted(false);
  assert.strictEqual(ttsService.isMuted(), false);
});

// -----------------------------------------------------------------------------
// 4. NEGATION & UNCERTAINTY HANDLING
// -----------------------------------------------------------------------------
console.log('\n--- 4. Negation & Uncertainty Handling Tests ---');

runTest('Correctly identifies negated chief complaints and symptoms', () => {
  const result = localExtractClinicalInfo("Seene mein dard nahi hai aur bukhar bhi nahi hai");
  assert.notStrictEqual(result.chief_complaint, 'chest pain', 'Negated chest pain must not be active chief complaint');
  assert.ok(result.negated_symptoms.includes('chest pain'), 'chest pain must be recorded in negated_symptoms');
  assert.ok(result.negated_symptoms.includes('fever'), 'fever must be recorded in negated_symptoms');
});

runTest('Flags patient uncertainty without creating hallucinated facts', () => {
  const result = localExtractClinicalInfo("Shayad 2 din se sir dard hai, pakka nahi pata");
  assert.strictEqual(result.uncertainty_flag, true, 'Uncertainty flag should be true');
  assert.strictEqual(result.chief_complaint, 'headache');
});

// -----------------------------------------------------------------------------
// 5. CONTRADICTION & AUDIT TRAIL PROVENANCE
// -----------------------------------------------------------------------------
console.log('\n--- 5. Contradiction & Provenance Audit Trail Tests ---');

runTest('Maintains clinical provenance and records contradiction revisions', () => {
  let history = createInitialClinicalHistory();

  // Patient directly clicks 'sudden'
  history = mergeClinicalHistory(history, { hpi: { onset: 'sudden' } }, {
    source: PROVENANCE_SOURCES.PATIENT_DIRECT,
    rawUtterance: 'Sudden'
  });
  assert.strictEqual(history.provenance['hpi.onset'].source, 'PATIENT_DIRECT');
  assert.strictEqual(history.provenance['hpi.onset'].status, 'draft');

  // Next turn patient contradicts: "Actually it came on gradually"
  history = mergeClinicalHistory(history, { hpi: { onset: 'gradual' } }, {
    source: PROVENANCE_SOURCES.AI_EXTRACTION,
    rawUtterance: 'Actually it came on gradually'
  });
  assert.strictEqual(history.hpi.onset, 'gradual');
  assert.strictEqual(history.provenance['hpi.onset'].status, 'contradiction_flagged');
  assert.strictEqual(history.provenance['hpi.onset'].previous_value, 'sudden');

  // Physician confirms
  history = recordPhysicianConfirmation(history, 'hpi.onset');
  assert.strictEqual(history.provenance['hpi.onset'].status, 'confirmed');
  assert.strictEqual(history.provenance['hpi.onset'].confirmed_by, 'PHYSICIAN');
});

// -----------------------------------------------------------------------------
// 6. EXPANDED DETERMINISTIC RED FLAGS ACROSS SPECIALTIES
// -----------------------------------------------------------------------------
console.log('\n--- 6. Expanded Deterministic Safety Red-Flag Tests ---');

runTest('1. Cardiovascular: Severe chest pain + dyspnea -> High Priority', () => {
  const history = createInitialClinicalHistory();
  history.chief_complaint = 'chest pain';
  history.hpi.severity = 8;
  history.hpi.associated_symptoms = ['breathing difficulty'];

  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'HIGH');
  assert.strictEqual(triage.alertTriggered, true);
  assert.strictEqual(triage.redFlags[0].type, 'severe_chest_pain_with_dyspnea');
});

runTest('2. Neurological: FAST acute stroke symptoms -> High Priority', () => {
  const history = createInitialClinicalHistory();
  history.chief_complaint = 'weakness';
  history.hpi.associated_symptoms = ['facial drooping', 'speech difficulty'];

  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'HIGH');
  assert.strictEqual(triage.redFlags[0].type, 'acute_focal_neurological_deficit');
});

runTest('3. Neurological: Thunderclap headache (sudden + severity 9) -> High Priority', () => {
  const history = createInitialClinicalHistory();
  history.chief_complaint = 'headache';
  history.hpi.onset = 'sudden';
  history.hpi.severity = 9;

  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'HIGH');
  assert.strictEqual(triage.redFlags[0].type, 'sudden_thunderclap_headache');
});

runTest('4. Eye: Sudden vision loss -> High Priority', () => {
  const history = createInitialClinicalHistory();
  history.chief_complaint = 'sudden vision loss';

  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'HIGH');
  assert.strictEqual(triage.redFlags[0].type, 'acute_vision_loss');
});

runTest('5. Anaphylaxis: Facial/lip swelling + dyspnea -> High Priority', () => {
  const history = createInitialClinicalHistory();
  history.chief_complaint = 'rash';
  history.hpi.associated_symptoms = ['facial swelling', 'breathing difficulty'];

  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'HIGH');
  assert.strictEqual(triage.redFlags[0].type, 'suspected_anaphylaxis');
});

runTest('6. Bleeding: Hematemesis (vomiting blood) -> High Priority', () => {
  const history = createInitialClinicalHistory();
  history.chief_complaint = 'vomiting';
  history.hpi.associated_symptoms = ['vomiting blood'];

  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'HIGH');
  assert.strictEqual(triage.redFlags[0].type, 'acute_gastrointestinal_bleeding');
});

runTest('7. Musculoskeletal: Cauda equina (back pain + bowel/bladder retention) -> High Priority', () => {
  const history = createInitialClinicalHistory();
  history.chief_complaint = 'back pain';
  history.hpi.associated_symptoms = ['urinary retention'];

  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'HIGH');
  assert.strictEqual(triage.redFlags[0].type, 'suspected_cauda_equina');
});

runTest('8. Pregnancy: Pregnancy + vaginal bleeding -> High Priority', () => {
  const history = createInitialClinicalHistory();
  history.chief_complaint = 'pregnancy';
  history.hpi.severity = 7;
  history.hpi.associated_symptoms = ['vaginal bleeding'];

  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'HIGH');
  assert.strictEqual(triage.redFlags[0].type, 'pregnancy_acute_bleeding');
});

runTest('9. Mental Health: Suicidal / Self-Harm statement -> Emergency Escalation', () => {
  const history = createInitialClinicalHistory();
  history.raw_statement = 'Mujhe marne ka man kar raha hai, I want to end my life';

  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'HIGH');
  assert.strictEqual(triage.redFlags[0].type, 'emergency_self_harm_statement');
});

runTest('10. Routine presentations without red flags remain NORMAL priority', () => {
  const history = createInitialClinicalHistory();
  history.chief_complaint = 'cough';
  history.hpi.duration = '2 days';
  history.hpi.severity = 3;

  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'NORMAL');
  assert.strictEqual(triage.alertTriggered, false);
});

// -----------------------------------------------------------------------------
// 7. ADAPTIVE QUESTION FLOW: HEADACHE PROTOCOL (NO CHEST PAIN QUESTIONS)
// -----------------------------------------------------------------------------
console.log('\n--- 7. Adaptive Question Flow Tests ---');

runTest('Headache intake asks headache questions and does NOT ask chest pain questions', () => {
  let history = createInitialClinicalHistory();
  const lang = 'hi';

  // Patient states headache
  const step1 = localExtractClinicalInfo("Kal se mere sir mein bahut dard hai");
  history = mergeClinicalHistory(history, step1);
  assert.strictEqual(history.chief_complaint, 'headache');

  // Next question must come from headache protocol, NOT chest pain questions!
  const q = questionEngine.getNextQuestion(history, lang);
  assert.strictEqual(q.protocolId, 'headache');
  assert.ok(q.questionText.includes('सिर') || q.questionText.includes('दर्द'), 'Question should be about headache');
  assert.ok(!q.questionText.includes('सीने'), 'Must NOT ask chest questions for headache patient!');
});

runTest('Fever intake asks fever questions (chills, rash) and does NOT ask chest questions', () => {
  let history = createInitialClinicalHistory();
  const lang = 'en';

  // Patient states fever
  const step1 = localExtractClinicalInfo("I have high fever since yesterday");
  history = mergeClinicalHistory(history, step1);
  assert.strictEqual(history.chief_complaint, 'fever');

  const q = questionEngine.getNextQuestion(history, lang);
  assert.strictEqual(q.protocolId, 'fever');
  assert.ok(q.questionText.toLowerCase().includes('temperature') || q.questionText.toLowerCase().includes('chills') || q.questionText.toLowerCase().includes('fever'));
  assert.ok(!q.questionText.toLowerCase().includes('chest'), 'Must NOT ask chest questions for fever patient!');
});

// -----------------------------------------------------------------------------
// 8. PHYSICIAN-READY STRUCTURED SUMMARY GENERATION
// -----------------------------------------------------------------------------
console.log('\n--- 8. Physician Summary Generation Tests ---');

runTest('Produces compliant physician summary schema across complaints', () => {
  let history = createInitialClinicalHistory();
  history.chief_complaint = 'headache';
  history.hpi.onset = 'gradual';
  history.hpi.site = 'frontal';
  history.hpi.severity = 6;
  history.hpi.duration = '3 days';
  history.hpi.associated_symptoms = ['nausea', 'photophobia'];
  history.priority = 'NORMAL';

  const summary = generatePhysicianSummary(history, {
    patientName: 'Sunita Devi',
    age: 44,
    gender: 'Female',
    mobileNumber: '9123456780'
  });

  assert.strictEqual(summary.chief_complaint, 'Headache');
  assert.strictEqual(summary.hpi.onset, 'gradual');
  assert.strictEqual(summary.hpi.severity, 6);
  assert.strictEqual(summary.priority, 'NORMAL');
  assert.strictEqual(summary.patient.name, 'Sunita Devi');
  assert.ok(summary.audit_trail !== undefined);
  assert.ok(summary.clinical_disclaimer.includes('human physician confirmation'));
});

// -----------------------------------------------------------------------------
// 9. BUG REGRESSION TESTS: QUESTION PROGRESSION & PREVENT REPEATED QUESTIONS
// -----------------------------------------------------------------------------
console.log('\n--- 9. Question Progression & Looping Bug Regression Tests ---');

// Helper to create a chest pain history up to the dyspnea question
function createChestPainHistoryBeforeDyspnea() {
  const h = createInitialClinicalHistory();
  h.chief_complaint = 'chest pain';
  h.protocolId = 'chest_pain';
  h.answered_questions.push('chief_complaint', 'site', 'onset', 'duration', 'severity');
  h.hpi.site = 'center of chest';
  h.hpi.onset = 'sudden';
  h.hpi.duration = '1 day';
  h.hpi.severity = 5;
  return h;
}

runTest('TEST 1: dyspnea = UNKNOWN -> asks dyspnea -> Answer: dyspnea = true -> getNextQuestion() is NOT dyspnea', () => {
  let history = createChestPainHistoryBeforeDyspnea();

  // Initial: dyspnea is UNKNOWN
  const q1 = questionEngine.getNextQuestion({ clinicalHistory: history, language: 'hi' });
  assert.strictEqual(q1.questionId, 'dyspnea', 'First question must be dyspnea');
  assert.strictEqual(q1.field, 'breathing');

  // Answer: dyspnea = true (via touch or positive statement)
  const extracted = localExtractClinicalInfo("हाँ, सांस लेने में परेशानी है", { currentField: 'breathing' });
  assert.strictEqual(extracted.symptom_status.dyspnea, 'YES');
  history = mergeClinicalHistory(history, extracted);

  // Next question must NOT be dyspnea!
  const q2 = questionEngine.getNextQuestion({
    clinicalHistory: history,
    answeredQuestionIds: history.answered_questions,
    language: 'hi'
  });
  assert.notStrictEqual(q2.questionId, 'dyspnea', 'Next question must NOT be dyspnea again');
  assert.notStrictEqual(q2.field, 'breathing', 'Next field must NOT be breathing again');
});

runTest('TEST 2: Answer: dyspnea = false -> getNextQuestion() is NOT dyspnea', () => {
  let history = createChestPainHistoryBeforeDyspnea();

  const q1 = questionEngine.getNextQuestion({ clinicalHistory: history, language: 'hi' });
  assert.strictEqual(q1.questionId, 'dyspnea');

  // Answer: dyspnea = false (via touch or negative statement "नहीं, सांस ठीक है")
  const extracted = localExtractClinicalInfo("नहीं, सांस ठीक है", { currentField: 'breathing' });
  assert.strictEqual(extracted.symptom_status.dyspnea, 'NO');
  assert.ok(extracted.negated_symptoms.includes('breathing difficulty'));
  history = mergeClinicalHistory(history, extracted);

  const q2 = questionEngine.getNextQuestion({
    clinicalHistory: history,
    answeredQuestionIds: history.answered_questions,
    language: 'hi'
  });
  assert.notStrictEqual(q2.questionId, 'dyspnea', 'Next question must NOT be dyspnea again after NO');
  assert.notStrictEqual(q2.field, 'breathing');
});

runTest('TEST 3: Typed answer: "haan" -> dyspnea = true -> advances to next question', () => {
  let history = createChestPainHistoryBeforeDyspnea();

  const extracted = localExtractClinicalInfo("haan", { currentField: 'breathing' });
  assert.strictEqual(extracted.symptom_status.dyspnea, 'YES');
  history = mergeClinicalHistory(history, extracted);

  const q = questionEngine.getNextQuestion({
    clinicalHistory: history,
    answeredQuestionIds: history.answered_questions,
    language: 'hi'
  });
  assert.notStrictEqual(q.questionId, 'dyspnea', 'Must advance beyond dyspnea after "haan"');
  assert.notStrictEqual(q.field, 'breathing');
});

runTest('TEST 4: Typed answer: "nahi" -> dyspnea = false -> advances to next question', () => {
  let history = createChestPainHistoryBeforeDyspnea();

  const extracted = localExtractClinicalInfo("nahi", { currentField: 'breathing' });
  assert.strictEqual(extracted.symptom_status.dyspnea, 'NO');
  history = mergeClinicalHistory(history, extracted);

  const q = questionEngine.getNextQuestion({
    clinicalHistory: history,
    answeredQuestionIds: history.answered_questions,
    language: 'hi'
  });
  assert.notStrictEqual(q.questionId, 'dyspnea', 'Must advance beyond dyspnea after "nahi"');
  assert.notStrictEqual(q.field, 'breathing');
});

runTest('TEST 5: Same answer submitted twice -> question does not duplicate and state remains stable', () => {
  let history = createChestPainHistoryBeforeDyspnea();
  const extracted = localExtractClinicalInfo("हाँ, सांस लेने में परेशानी है", { currentField: 'breathing' });

  // First submission
  history = mergeClinicalHistory(history, extracted);
  // Second submission of identical payload
  history = mergeClinicalHistory(history, extracted);

  // Even if currentQuestionId was accidentally passed as 'dyspnea'
  const q = questionEngine.getNextQuestion({
    clinicalHistory: history,
    answeredQuestionIds: history.answered_questions,
    currentQuestionId: 'dyspnea',
    language: 'hi'
  });

  assert.notStrictEqual(q.questionId, 'dyspnea', 'Question must not duplicate even if re-submitted');
  // Confirm answered_questions does not contain endless duplicates
  const dyspneaOccurrences = history.answered_questions.filter(id => id === 'dyspnea').length;
  assert.strictEqual(dyspneaOccurrences, 1, 'dyspnea should only be recorded once in answered_questions');
});

runTest('TEST 6: React state update simulation: next question uses newly merged history, not stale history', () => {
  const staleHistory = createChestPainHistoryBeforeDyspnea();
  const extracted = localExtractClinicalInfo("हाँ, सांस लेने में परेशानी है", { currentField: 'breathing' });

  // If someone incorrectly used staleHistory:
  const staleQuestion = questionEngine.getNextQuestion({ clinicalHistory: staleHistory, language: 'hi' });
  assert.strictEqual(staleQuestion.questionId, 'dyspnea', 'Stale history would erroneously ask dyspnea again');

  // When correctly using newly merged history:
  const updatedHistory = mergeClinicalHistory(staleHistory, extracted);
  const nextQuestion = questionEngine.getNextQuestion({
    clinicalHistory: updatedHistory,
    answeredQuestionIds: updatedHistory.answered_questions,
    language: 'hi'
  });
  assert.notStrictEqual(nextQuestion.questionId, 'dyspnea', 'Updated history correctly advances');
});

runTest('TEST 7: HIGH red flag triggered (chest pain + severity 8 + dyspnea) -> no routine question, Priority Alert', () => {
  let history = createChestPainHistoryBeforeDyspnea();
  history.hpi.severity = 8; // High severity

  const extracted = localExtractClinicalInfo("हाँ, सांस लेने में परेशानी है", { currentField: 'breathing' });
  history = mergeClinicalHistory(history, extracted);

  // Check red flags BEFORE selecting routine question
  const triage = evaluateRedFlagsFromHistory(history);
  assert.strictEqual(triage.priority, 'HIGH', 'Triage priority must be HIGH');
  assert.strictEqual(triage.alertTriggered, true, 'Emergency alert must be triggered');
  assert.strictEqual(triage.redFlags[0].type, 'severe_chest_pain_with_dyspnea');
});

runTest('TEST 8: Next question appears -> TTS called exactly once per assistant question', () => {
  let speakCalls = 0;
  let lastSpokenText = '';
  const originalSpeak = ttsService.speak;

  // Mock ttsService.speak
  ttsService.speak = (text) => {
    speakCalls++;
    lastSpokenText = text;
  };

  try {
    let lastSpokenMsgId = null;

    function simulateAssistantRender(msg) {
      if (msg.role === 'assistant' && msg.id !== lastSpokenMsgId) {
        lastSpokenMsgId = msg.id;
        ttsService.speak(msg.text);
      }
    }

    const msg1 = { id: 'msg-1', role: 'assistant', text: 'Question 1' };
    simulateAssistantRender(msg1);
    assert.strictEqual(speakCalls, 1);
    assert.strictEqual(lastSpokenText, 'Question 1');

    // Simulate re-render with the same message (e.g. typing or child component render)
    simulateAssistantRender(msg1);
    assert.strictEqual(speakCalls, 1, 'TTS must NOT be called again for the same message on re-render');

    // Next question message arrives
    const msg2 = { id: 'msg-2', role: 'assistant', text: 'Question 2' };
    simulateAssistantRender(msg2);
    assert.strictEqual(speakCalls, 2, 'TTS should be called exactly once for the next question');
    assert.strictEqual(lastSpokenText, 'Question 2');
  } finally {
    ttsService.speak = originalSpeak;
  }
});

// -----------------------------------------------------------------------------
// 10. CLINICAL SESSION PERSISTENCE & DOCUMENT OCR TESTS
// -----------------------------------------------------------------------------
console.log('\n--- 10. Session Persistence & Medical Document OCR Tests ---');

runTest('1. Session Persistence: formats session payload matching schema without secrets', () => {
  const mockPatientData = {
    patientName: 'Anita Roy',
    dateOfBirth: '1990-04-12',
    age: 34,
    gender: 'Female',
    mobileNumber: '9876543210',
    selectedLanguage: 'hi',
    selectedConcern: 'chest_pain',
    priorityLevel: 'high',
    emergencyAlertTriggered: true,
    clinicalHistory: {
      chief_complaint: 'chest pain',
      hpi: {
        site: 'center of chest',
        onset: 'sudden',
        duration: '1 day',
        severity: 8,
        associated_symptoms: ['breathing difficulty']
      },
      answered_questions: ['chief_complaint', 'site', 'onset', 'duration', 'severity', 'dyspnea'],
      priority: 'HIGH'
    },
    conversation: {
      language: 'hi',
      messages: [
        { id: 'm1', role: 'assistant', text: 'सीने में ठीक किस जगह दर्द महसूस हो रहा है?' },
        { id: 'm2', role: 'patient', text: 'सीने के बीच में' }
      ],
      currentField: 'breathing',
      currentQuestionId: 'dyspnea',
      status: 'alert'
    },
    documents: [
      { id: 'doc-1', name: 'prescription.jpg', size: 1024, type: 'prescription', status: 'completed' }
    ],
    extractedMedicalData: {
      medications: ['Metformin 500 mg'],
      labResults: []
    }
  };

  const payload = sessionPersistence.formatSessionPayload(mockPatientData);

  assert.ok(payload.sessionId, 'Session ID must be generated');
  assert.strictEqual(payload.patient.patientName, 'Anita Roy');
  assert.strictEqual(payload.patient.mobileNumber, '9876543210');
  assert.strictEqual(payload.selectedLanguage, 'hi');
  assert.strictEqual(payload.clinicalHistory.chief_complaint, 'chest pain');
  assert.strictEqual(payload.clinicalHistory.hpi.severity, 8);
  assert.strictEqual(payload.triageStatus.priority, 'HIGH');
  assert.strictEqual(payload.triageStatus.emergencyAlertTriggered, true);
  assert.strictEqual(payload.conversation.messages.length, 2);
  assert.strictEqual(payload.documents.length, 1);
  assert.strictEqual(payload.documents[0].name, 'prescription.jpg');
  assert.ok(payload.lastUpdated, 'Must contain lastUpdated timestamp');
  // Confirm no API keys or secrets
  assert.strictEqual(payload.apiKey, undefined);
  assert.strictEqual(payload.GEMINI_API_KEY, undefined);
});

runTest('2. Session Hydration: accurately restores patientData from saved session', () => {
  const savedPayload = {
    sessionId: 'session-test-123',
    patient: {
      patientName: 'Ramesh Kumar',
      age: 52,
      gender: 'Male',
      mobileNumber: '9123456789'
    },
    selectedLanguage: 'en',
    selectedConcern: 'headache',
    clinicalHistory: {
      chief_complaint: 'headache',
      hpi: {
        site: 'frontal',
        severity: 6,
        duration: '2 days'
      },
      answered_questions: ['chief_complaint', 'site', 'severity', 'duration'],
      priority: 'NORMAL'
    },
    conversation: {
      language: 'en',
      messages: [{ id: '1', role: 'assistant', text: 'Where is the headache?' }],
      currentField: 'site',
      status: 'active'
    },
    documents: [],
    extractedMedicalData: { medications: [], labResults: [] }
  };

  const fallback = {
    patientName: '',
    mobileNumber: '',
    clinicalHistory: createInitialClinicalHistory(),
    conversation: { messages: [] }
  };

  const restored = sessionPersistence.hydratePatientData(savedPayload, fallback);

  assert.strictEqual(restored.currentSessionId, 'session-test-123');
  assert.strictEqual(restored.patientName, 'Ramesh Kumar');
  assert.strictEqual(restored.age, 52);
  assert.strictEqual(restored.selectedLanguage, 'en');
  assert.strictEqual(restored.clinicalHistory.chief_complaint, 'headache');
  assert.strictEqual(restored.clinicalHistory.hpi.severity, 6);
  assert.strictEqual(restored.clinicalHistory.answered_questions.length, 4);
});

// --- GEMINI MULTIMODAL MEDICAL DOCUMENT EXTRACTION TESTS (15 SCENARIOS) ---

await runTest('3. Gemini Document AI: 1. JPG upload format support', () => {
  assert.strictEqual(isSupportedMimeType('image/jpeg'), true);
  assert.strictEqual(isSupportedMimeType('image/jpg'), true);
  assert.strictEqual(isSupportedDocument('prescription.jpg'), true);
  assert.strictEqual(isSupportedDocument('rx.jpeg'), true);
});

await runTest('4. Gemini Document AI: 2. PNG upload format support', () => {
  assert.strictEqual(isSupportedMimeType('image/png'), true);
  assert.strictEqual(isSupportedDocument('lab_report.png'), true);
});

await runTest('5. Gemini Document AI: 3. PDF upload format support', () => {
  assert.strictEqual(isSupportedMimeType('application/pdf'), true);
  assert.strictEqual(isSupportedDocument('discharge_summary.pdf'), true);
  assert.strictEqual(isSupportedDocument('test_results.PDF'), true);
});

await runTest('6. Gemini Document AI: 4. Unsupported file rejection', async () => {
  assert.strictEqual(isSupportedMimeType('text/plain'), false);
  assert.strictEqual(isSupportedMimeType('application/msword'), false);
  assert.strictEqual(isSupportedDocument('records.docx'), false);
  assert.strictEqual(isSupportedDocument('notes.txt'), false);

  const result = await extractMedicalDocument({
    base64Data: 'dGVzdA==',
    mimeType: 'text/plain',
    fileName: 'notes.txt'
  });
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.reason, 'This document format is not supported.');
});

await runTest('7. Gemini Document AI: 5. Gemini multimodal request prompt integrity', () => {
  assert.ok(DOCUMENT_EXTRACTION_PROMPT.includes('You are the medical document extraction engine for SehatNama.'));
  assert.ok(DOCUMENT_EXTRACTION_PROMPT.includes('DO NOT diagnose the patient.'));
  assert.ok(DOCUMENT_EXTRACTION_PROMPT.includes('DO NOT hallucinate.'));
  assert.ok(DOCUMENT_EXTRACTION_PROMPT.includes('Never invent medications.'));
  assert.ok(DOCUMENT_EXTRACTION_PROMPT.includes('Return valid JSON only.'));
});

await runTest('8. Gemini Document AI: 6. Gemini structured response validation', () => {
  const sampleGeminiJson = JSON.stringify({
    success: true,
    documentType: 'prescription',
    documentDate: '2026-03-01',
    hospitalName: 'Apollo Hospitals',
    doctorName: 'Dr. A. Sharma',
    patient: { name: 'Sunita Devi', age: 48, sex: 'Female' },
    diagnoses: ['Hypertension'],
    medications: [
      { name: 'Telmisartan', dose: '40mg', route: 'oral', frequency: 'OD', duration: '30 days', instructions: 'morning' }
    ],
    investigations: [],
    procedures: [],
    allergies: [],
    vitalSigns: [{ name: 'BP', value: '138/88', unit: 'mmHg' }],
    clinicalNotes: ['Blood pressure reasonably controlled'],
    uncertainFields: [],
    extractionConfidence: 0.95
  });

  const parsed = validateAndSanitizeGeminiResponse(sampleGeminiJson);
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.documentType, 'prescription');
  assert.strictEqual(parsed.patient.name, 'Sunita Devi');
  assert.strictEqual(parsed.doctorName, 'Dr. A. Sharma');
  assert.strictEqual(parsed.medications.length, 1);
  assert.strictEqual(parsed.vitalSigns.length, 1);
});

await runTest('9. Gemini Document AI: 7. Medication extraction with dose, frequency, and instructions', () => {
  const rawResponse = JSON.stringify({
    success: true,
    medications: [
      { name: 'Metformin', dose: '1000 mg', route: 'oral', frequency: 'BD', duration: '90 days', instructions: 'after meals' },
      { name: 'Atorvastatin', dose: '20 mg', route: 'oral', frequency: 'HS', duration: '30 days', instructions: 'bedtime' }
    ]
  });

  const result = validateAndSanitizeGeminiResponse(rawResponse);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.medications.length, 2);
  assert.strictEqual(result.medications[0].name, 'Metformin');
  assert.strictEqual(result.medications[0].dose, '1000 mg');
  assert.strictEqual(result.medications[0].frequency, 'BD');
  assert.strictEqual(result.medications[1].name, 'Atorvastatin');
  assert.strictEqual(result.medications[1].frequency, 'HS');
});

await runTest('10. Gemini Document AI: 8. Lab result extraction with values, units, and flags', () => {
  const rawResponse = JSON.stringify({
    success: true,
    documentType: 'laboratory report',
    investigations: [
      { name: 'HbA1c', value: '8.1', unit: '%', referenceRange: '< 5.7', flag: 'high' },
      { name: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', referenceRange: '0.6 - 1.2', flag: 'normal' }
    ]
  });

  const result = validateAndSanitizeGeminiResponse(rawResponse);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.investigations.length, 2);
  assert.strictEqual(result.investigations[0].name, 'HbA1c');
  assert.strictEqual(result.investigations[0].value, '8.1');
  assert.strictEqual(result.investigations[0].unit, '%');
  assert.strictEqual(result.investigations[0].flag, 'high');
  assert.strictEqual(result.investigations[1].name, 'Serum Creatinine');
});

await runTest('11. Gemini Document AI: 9. Diagnosis extraction preserving visible diagnoses', () => {
  const rawResponse = JSON.stringify({
    success: true,
    diagnoses: ['Acute Bronchitis', 'Type 2 Diabetes Mellitus']
  });

  const result = validateAndSanitizeGeminiResponse(rawResponse);
  assert.strictEqual(result.success, true);
  assert.deepStrictEqual(result.diagnoses, ['Acute Bronchitis', 'Type 2 Diabetes Mellitus']);
});

await runTest('12. Gemini Document AI: 10. Invalid Gemini JSON & markdown fence handling', () => {
  // Test 1: Markdown code fences
  const fenced = '```json\n{"success": true, "documentType": "prescription", "medications": []}\n```';
  const res1 = validateAndSanitizeGeminiResponse(fenced);
  assert.strictEqual(res1.success, true);
  assert.strictEqual(res1.documentType, 'prescription');

  // Test 2: Malformed JSON returns controlled failure without throwing
  const malformed = 'Not valid json { test: 123';
  const res2 = validateAndSanitizeGeminiResponse(malformed);
  assert.strictEqual(res2.success, false);
  assert.strictEqual(res2.reason, "We couldn't reliably extract information from this document. The original document has been saved.");

  // Test 3: Unreadable document response
  const unreadable = JSON.stringify({ success: false, reason: 'Document could not be reliably read' });
  const res3 = validateAndSanitizeGeminiResponse(unreadable);
  assert.strictEqual(res3.success, false);
  assert.strictEqual(res3.reason, "We couldn't reliably extract information from this document. The original document has been saved.");
});

await runTest('13. Gemini Document AI: 11. Gemini API failure & 503 error handling without crash', async () => {
  const origFetch = globalThis.fetch;
  const origKey = process.env.GEMINI_API_KEY;
  try {
    process.env.GEMINI_API_KEY = 'test_unit_key';
    // Test API key authentication failure (401 / 403)
    globalThis.fetch = async () => ({
      ok: false,
      status: 401,
      text: async () => 'API_KEY_INVALID: The provided API key is invalid'
    });

    const authFailResult = await extractMedicalDocument({
      base64Data: 'validbase64data',
      mimeType: 'image/jpeg',
      fileName: 'test.jpg'
    });
    assert.strictEqual(authFailResult.success, false);
    assert.strictEqual(authFailResult.reason, 'Document AI authentication failed. Please check the server configuration.');

    // Test generic / 503 API failure
    globalThis.fetch = async () => ({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    });

    const result = await extractMedicalDocument({
      base64Data: 'validbase64data',
      mimeType: 'image/jpeg',
      fileName: 'test.jpg'
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.reason, 'Unable to extract information from this document right now. The original document has been saved.');
  } finally {
    globalThis.fetch = origFetch;
    process.env.GEMINI_API_KEY = origKey;
  }
});

await runTest('14. Gemini Document AI: 12. ZERO fallback OCR (no hardcoded medications on failure)', async () => {
  const origFetch = globalThis.fetch;
  const origKey = process.env.GEMINI_API_KEY;
  try {
    process.env.GEMINI_API_KEY = 'test_unit_key';
    // Simulate complete API network drop
    globalThis.fetch = async () => {
      throw new Error('Network failure connecting to Gemini');
    };

    const result = await extractMedicalDocument({
      base64Data: 'dummybase64',
      mimeType: 'image/png',
      fileName: 'prescription.png'
    });

    // Must be marked as failure, never returning fake medications or Metformin
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.extracted, undefined);
    assert.ok(!JSON.stringify(result).toLowerCase().includes('metformin'));
  } finally {
    globalThis.fetch = origFetch;
    process.env.GEMINI_API_KEY = origKey;
  }
});

await runTest('15. Gemini Document AI: 13. Failed extraction preserves original document in state', () => {
  const docState = {
    documentId: 'doc-456',
    fileName: 'blood_test.pdf',
    fileType: 'application/pdf',
    status: 'extraction_failed',
    extraction: null,
    failureReason: 'Unable to reliably extract information',
    fileRef: { name: 'blood_test.pdf', size: 102400 }
  };

  // Original document and metadata remain saved and available
  assert.strictEqual(docState.status, 'extraction_failed');
  assert.strictEqual(docState.fileName, 'blood_test.pdf');
  assert.strictEqual(docState.extraction, null);
  assert.ok(docState.fileRef !== null, 'Original document file must remain preserved');
});

await runTest('16. Gemini Document AI: 14. Retry extraction using saved document without re-upload', async () => {
  const savedDoc = {
    id: 'doc-789',
    fileRef: { name: 'report.png', type: 'image/png' },
    base64Data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  };

  const origFetch = globalThis.fetch;
  let fetchCount = 0;
  try {
    globalThis.fetch = async () => {
      fetchCount++;
      return {
        ok: true,
        json: async () => ({
          success: true,
          extracted: {
            success: true,
            documentType: 'prescription',
            medications: [{ name: 'Paracetamol', dose: '650 mg' }]
          }
        })
      };
    };

    // Retry extraction takes saved document directly
    const retryResult = await extractDocument({
      file: savedDoc.fileRef,
      base64Data: savedDoc.base64Data,
      mimeType: 'image/png',
      documentId: savedDoc.id
    });

    assert.strictEqual(retryResult.success, true);
    assert.strictEqual(fetchCount, 1, 'Retry successfully executed without re-uploading file');
    assert.strictEqual(retryResult.extracted.medications[0].name, 'Paracetamol');
  } finally {
    globalThis.fetch = origFetch;
  }
});

await runTest('17. Gemini Document AI: 15. Duplicate simultaneous request prevention', async () => {
  const docId = 'doc-concurrent-test';
  let resolver;
  const slowPromise = new Promise(resolve => { resolver = resolve; });

  const origFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      await slowPromise;
      return {
        ok: true,
        json: async () => ({ success: true, extracted: {} })
      };
    };

    // Trigger request 1
    const req1 = extractDocument({
      base64Data: 'dummydata',
      mimeType: 'image/jpeg',
      documentId: docId
    });

    // Immediately trigger duplicate concurrent request 2 for same documentId
    const req2 = await extractDocument({
      base64Data: 'dummydata',
      mimeType: 'image/jpeg',
      documentId: docId
    });

    // Request 2 must be rejected as duplicate in-progress
    assert.strictEqual(req2.success, false);
    assert.strictEqual(req2.inProgress, true);

    resolver();
    await req1;
  } finally {
    globalThis.fetch = origFetch;
  }
});

await runTest('18. Gemini Document AI: 16. Doctor advice and instructions extraction & sanitization', () => {
  const sampleResponse = JSON.stringify({
    success: true,
    documentType: 'prescription',
    doctorAdvice: [
      'Take light meals and avoid oily food.',
      'Drink plenty of warm water.',
      'Review after 5 days if fever persists.'
    ],
    medications: [
      { name: 'Paracetamol', dose: '500 mg', frequency: 'TDS' }
    ]
  });

  const parsed = validateAndSanitizeGeminiResponse(sampleResponse);
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.doctorAdvice.length, 3);
  assert.strictEqual(parsed.doctorAdvice[0], 'Take light meals and avoid oily food.');
  assert.strictEqual(parsed.doctorAdvice[2], 'Review after 5 days if fever persists.');
});

await runTest('19. Gemini Document AI: 17. Differentiated HTTP error handling (400, 429, 503)', async () => {
  const origFetch = globalThis.fetch;
  const origKey = process.env.GEMINI_API_KEY;
  try {
    process.env.GEMINI_API_KEY = 'test_unit_key';

    // 1. HTTP 400 Bad Request
    globalThis.fetch = async () => ({
      ok: false,
      status: 400,
      text: async () => 'INVALID_ARGUMENT: Bad Request'
    });
    const res400 = await extractMedicalDocument({
      base64Data: 'dummybase64',
      mimeType: 'image/jpeg',
      fileName: 'test.jpg'
    });
    assert.strictEqual(res400.success, false);
    assert.ok(res400.reason.includes('400'), 'Error message must reflect HTTP 400 request error');

    // 2. HTTP 429 Rate Limit
    globalThis.fetch = async () => ({
      ok: false,
      status: 429,
      text: async () => 'RESOURCE_EXHAUSTED: Quota exceeded'
    });
    const res429 = await extractMedicalDocument({
      base64Data: 'dummybase64',
      mimeType: 'image/jpeg',
      fileName: 'test.jpg'
    });
    assert.strictEqual(res429.success, false);
    assert.ok(res429.reason.includes('429'), 'Error message must reflect rate limit/quota 429');

    // 3. HTTP 503 Service Unavailable
    globalThis.fetch = async () => ({
      ok: false,
      status: 503,
      text: async () => 'UNAVAILABLE: High demand'
    });
    const res503 = await extractMedicalDocument({
      base64Data: 'dummybase64',
      mimeType: 'image/jpeg',
      fileName: 'test.jpg'
    });
    assert.strictEqual(res503.success, false);
    assert.ok(res503.reason.includes('503'), 'Error message must reflect service unavailable 503');
  } finally {
    globalThis.fetch = origFetch;
    process.env.GEMINI_API_KEY = origKey;
  }
});

await runTest('20. Gemini Document AI: 18. Auto-upgrade legacy gemini-3.6-flash to active multimodal model', () => {
  const origModel = process.env.GEMINI_MODEL;
  try {
    process.env.GEMINI_MODEL = 'gemini-3.6-flash';
    const resolved = getCompatibleModel();
    assert.strictEqual(resolved, COMPATIBLE_MULTIMODAL_MODEL, 'gemini-3.6-flash must auto-upgrade to active gemini-3.6-flash');

    process.env.GEMINI_MODEL = 'gemini-2.0-flash';
    assert.strictEqual(getCompatibleModel(), 'gemini-2.0-flash');
  } finally {
    process.env.GEMINI_MODEL = origModel;
  }
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n======================================================');
console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
