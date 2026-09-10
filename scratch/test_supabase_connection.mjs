import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.resolve('.env'), 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim();
});

const url = envVars.VITE_SUPABASE_URL;
const key = envVars.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection:');
console.log('URL configured:', Boolean(url), url);
console.log('Anon key configured:', Boolean(key));

const supabase = createClient(url, key);

async function testFlow() {
  try {
    // 1. Test profiles query
    console.log('\n--- 1. Testing profiles table ---');
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('*').limit(3);
    if (pErr) console.error('Profiles query error:', pErr);
    else console.log('Profiles query success! Found profiles count:', profiles.length);

    // 2. Test patients insertion & query
    console.log('\n--- 2. Testing patients table insert & select ---');
    const testPatient = {
      full_name: 'Test Ramesh Kumar',
      date_of_birth: '1985-05-15',
      age: 41,
      gender: 'Male',
      mobile_number: '9876543210',
      location: 'Delhi',
      blood_group: 'B+',
      preferred_language: 'hi'
    };
    const { data: patientData, error: patErr } = await supabase.from('patients').insert(testPatient).select().single();
    if (patErr) console.error('Patient insert error:', patErr);
    else console.log('Patient inserted successfully! ID:', patientData?.id);

    const patientId = patientData?.id;

    if (patientId) {
      // 3. Test cases insertion
      console.log('\n--- 3. Testing cases table insert ---');
      const testCase = {
        patient_id: patientId,
        chief_complaint: 'chest_pain',
        patient_description: 'Severe chest pain radiating to left arm',
        priority_level: 'high',
        status: 'waiting_for_doctor'
      };
      const { data: caseData, error: caseErr } = await supabase.from('cases').insert(testCase).select().single();
      if (caseErr) console.error('Case insert error:', caseErr);
      else console.log('Case inserted successfully! ID:', caseData?.id);

      const caseId = caseData?.id;

      if (caseId) {
        // 4. Test case_answers
        console.log('\n--- 4. Testing case_answers table insert ---');
        const testAnswers = [
          { case_id: caseId, question_id: 'site', question_text: 'Site', question_type: 'single_choice', answer: 'Central chest' },
          { case_id: caseId, question_id: 'onset', question_text: 'Onset', question_type: 'single_choice', answer: 'Sudden (1 hour ago)' }
        ];
        const { data: ansData, error: ansErr } = await supabase.from('case_answers').insert(testAnswers).select();
        if (ansErr) console.error('Answers insert error:', ansErr);
        else console.log('Answers inserted successfully! Count:', ansData?.length);

        // 5. Test alerts
        console.log('\n--- 5. Testing alerts table insert ---');
        const testAlert = {
          case_id: caseId,
          alert_type: 'chest_pain_red_flag',
          priority: 'high',
          message: 'Acute chest pain with radiation to left arm'
        };
        const { data: alertData, error: alertErr } = await supabase.from('alerts').insert(testAlert).select().single();
        if (alertErr) console.error('Alert insert error:', alertErr);
        else console.log('Alert inserted successfully! ID:', alertData?.id);

        // 6. Test Doctor view query (join cases with patients and alerts)
        console.log('\n--- 6. Testing Doctor Dashboard query ---');
        const { data: doctorCases, error: docErr } = await supabase
          .from('cases')
          .select(`
            id,
            chief_complaint,
            patient_description,
            priority_level,
            status,
            patient_id,
            patients (*),
            alerts (*)
          `)
          .eq('id', caseId)
          .single();

        if (docErr) console.error('Doctor query error:', docErr);
        else {
          console.log('Doctor query SUCCESS! Case retrieved:');
          console.log('  Case ID:', doctorCases.id);
          console.log('  Patient Name:', doctorCases.patients?.full_name);
          console.log('  Alerts:', doctorCases.alerts?.length);
        }
      }
    }

  } catch (err) {
    console.error('Fatal test error:', err);
  }
}

testFlow();
