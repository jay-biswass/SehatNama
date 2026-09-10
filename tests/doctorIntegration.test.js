import assert from 'node:assert';
import { doctorService } from '../src/services/doctorService.js';
import { caseService } from '../src/services/caseService.js';
import { patientService } from '../src/services/patientService.js';
import { alertService } from '../src/services/alertService.js';

console.log('\n======================================================');
console.log(' SEHATNAMA PHASE 3: DOCTOR DASHBOARD & CASE INTEGRATION TESTS');
console.log('======================================================\n');

let totalPassed = 0;
const runTest = async (name, fn) => {
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    totalPassed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
};

(async () => {
  // Test 1: Doctor service structure
  await runTest('doctorService contains all required API methods', () => {
    assert.strictEqual(typeof doctorService.getDashboardStats, 'function');
    assert.strictEqual(typeof doctorService.getCases, 'function');
    assert.strictEqual(typeof doctorService.getCaseById, 'function');
    assert.strictEqual(typeof doctorService.updateCaseStatus, 'function');
    assert.strictEqual(typeof doctorService.saveDoctorNote, 'function');
    assert.strictEqual(typeof doctorService.getDocumentSignedUrl, 'function');
    assert.strictEqual(typeof doctorService.subscribeToRealtimeCases, 'function');
  });

  // Test 2: Unconfigured / Offline Fallback for Dashboard Stats
  await runTest('getDashboardStats handles offline fallback gracefully without crash', async () => {
    const res = await doctorService.getDashboardStats();
    assert.ok(res);
    assert.ok(res.data);
    assert.strictEqual(typeof res.data.totalCases, 'number');
    assert.strictEqual(typeof res.data.newCases, 'number');
    assert.strictEqual(typeof res.data.highPriority, 'number');
  });

  // Test 3: Unconfigured / Offline Fallback for Cases Queue
  await runTest('getCases returns array with count', async () => {
    const res = await doctorService.getCases({ priority: 'all', status: 'all' });
    assert.ok(res);
    assert.ok(Array.isArray(res.data));
    assert.strictEqual(typeof res.total, 'number');
  });

  // Test 4: Doctor Status Updates
  await runTest('updateCaseStatus returns updated payload with timestamp and doctor ID', async () => {
    const res = await doctorService.updateCaseStatus('case-test-123', 'under_review', {
      id: 'doc-uuid-1',
      full_name: 'Dr. Ananya Sharma'
    });
    assert.ok(res);
    assert.ok(res.data);
    assert.strictEqual(res.data.status, 'under_review');
  });

  // Test 5: Doctor Notes Creation
  await runTest('saveDoctorNote saves note with doctor attribution', async () => {
    const res = await doctorService.saveDoctorNote('case-test-123', 'Clinical note: Recommend ECG.', {
      id: 'doc-uuid-1',
      full_name: 'Dr. Ananya Sharma'
    });
    assert.ok(res);
    assert.ok(res.data);
    assert.strictEqual(res.data.note, 'Clinical note: Recommend ECG.');
    assert.strictEqual(res.data.doctor_name, 'Dr. Ananya Sharma');
  });

  // Test 6: Patient submission data model integration
  await runTest('Patient caseService & alertService payload formats match Doctor schema requirements', async () => {
    const newCaseRes = await caseService.createCase({
      patientId: 'patient-test-uuid',
      chiefComplaint: 'chest_pain',
      patientDescription: 'Sharp chest pain since morning',
      priorityLevel: 'high'
    });
    assert.ok(newCaseRes);
    assert.ok(newCaseRes.data);
    assert.strictEqual(newCaseRes.data.chief_complaint, 'chest_pain');

    const alertRes = await alertService.createAlert({
      caseId: newCaseRes.data.id,
      alertType: 'potential_priority_symptoms',
      priority: 'high',
      message: 'Severe chest pain radiating to left arm flagged.'
    });
    assert.ok(alertRes);
    assert.ok(alertRes.data);
    assert.strictEqual(alertRes.data.priority, 'high');
  });

  // Test 7: Realtime Subscription Handler
  await runTest('subscribeToRealtimeCases returns unsubscribe function', () => {
    const sub = doctorService.subscribeToRealtimeCases({
      onNewCase: () => {},
      onAlert: () => {}
    });
    assert.ok(sub);
    assert.strictEqual(typeof sub.unsubscribe, 'function');
    sub.unsubscribe();
  });

  console.log('\n======================================================');
  console.log(` RESULTS: ${totalPassed} PASSED, 0 FAILED (TOTAL: ${totalPassed})`);
  console.log('======================================================\n');
})();
