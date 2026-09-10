#!/usr/bin/env node
/**
 * =========================================================================
 * SEHATNAMA - SECURE DOCTOR ACCOUNT PROVISIONING CLI
 * =========================================================================
 * 
 * Secure administrative script to provision real physician accounts
 * with role = 'doctor' in Supabase Auth & public.profiles.
 * 
 * IMPORTANT:
 * - This script is strictly for admin/server-side execution.
 * - The SUPABASE_SERVICE_ROLE_KEY is NEVER embedded in client bundles.
 * 
 * Usage:
 *   node scripts/provision_doctor.mjs --email doctor@hospital.org --password MyStrongPassword --name "Dr. Sharma" --spec "Cardiology"
 * 
 * Or interactive mode:
 *   node scripts/provision_doctor.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// Read environment from .env if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...vals] = trimmed.split('=');
        env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

function askQuestion(rl, query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        options[key] = next;
        i++;
      } else {
        options[key] = true;
      }
    }
  }
  return options;
}

async function main() {
  console.log('\n==================================================');
  console.log(' SEHATNAMA PHYSICIAN PROVISIONING UTILITY');
  console.log('==================================================\n');

  const args = parseArgs();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    let url = supabaseUrl;
    if (!url) {
      url = await askQuestion(rl, 'Enter Supabase Project URL: ');
    }

    let key = serviceRoleKey;
    if (!key) {
      console.log('\nNOTE: Creating authenticated users directly via admin API requires your SUPABASE_SERVICE_ROLE_KEY.');
      console.log('(Find it in Supabase Dashboard -> Project Settings -> API -> service_role key)\n');
      key = await askQuestion(rl, 'Enter SUPABASE_SERVICE_ROLE_KEY: ');
    }

    if (!url || !key) {
      console.error('\n[Error] Missing Supabase URL or Service Role Key.');
      process.exit(1);
    }

    const supabaseAdmin = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const email = (args.email || await askQuestion(rl, 'Doctor Email (e.g. doctor@sehatnama.in): ')).trim().toLowerCase();
    const password = args.password || await askQuestion(rl, 'Doctor Password (min 6 characters): ');
    const fullName = args.name || await askQuestion(rl, 'Doctor Full Name (e.g. Dr. Rajesh Kumar): ');
    const specialization = args.spec || await askQuestion(rl, 'Specialization [General Physician]: ') || 'General Physician';
    const hospital = args.hospital || await askQuestion(rl, 'Hospital/Clinic [SehatNama Health]: ') || 'SehatNama Health';
    const registrationNo = args.reg || await askQuestion(rl, 'Medical Registration No (optional): ') || null;
    const phone = args.phone || await askQuestion(rl, 'Phone Number (optional): ') || null;

    if (!email || !password || password.length < 6) {
      console.error('\n[Error] Valid email and password (min 6 chars) are required.');
      process.exit(1);
    }

    console.log('\n[1/3] Provisioning user in Supabase Auth (auth.users)...');

    // 1. Create or update user in Supabase Auth
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: 'doctor',
        specialization,
        phone
      }
    });

    let userId = userData?.user?.id;

    if (createError) {
      if (createError.message?.toLowerCase().includes('already registered')) {
        console.log(`[Notice] User ${email} exists in auth.users. Fetching ID and updating password...`);
        // List users to get existing user ID
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const existing = listData?.users?.find(u => u.email?.toLowerCase() === email);
        if (existing) {
          userId = existing.id;
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password,
            email_confirm: true,
            user_metadata: {
              full_name: fullName,
              role: 'doctor',
              specialization,
              phone
            }
          });
        } else {
          throw createError;
        }
      } else {
        throw createError;
      }
    }

    console.log(`[2/3] User confirmed with UUID: ${userId}`);
    console.log('[3/3] Setting role = "doctor" in public.profiles table...');

    // 2. Upsert profile with role = 'doctor'
    const profilePayload = {
      id: userId,
      email,
      full_name: fullName,
      role: 'doctor',
      specialization,
      hospital,
      registration_no: registrationNo,
      phone,
      updated_at: new Date().toISOString()
    };

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' });

    if (profileError) {
      console.error('\n[Warning] Profile upsert error:', profileError.message);
    } else {
      console.log('\n==================================================');
      console.log(' SUCCESS: DOCTOR PROVISIONED SECURELY');
      console.log('==================================================');
      console.log(` Email:          ${email}`);
      console.log(` Full Name:      ${fullName}`);
      console.log(` Role:           doctor`);
      console.log(` Specialization: ${specialization}`);
      console.log(` Hospital:       ${hospital}`);
      console.log(` Reg Number:     ${registrationNo || 'Not provided'}`);
      console.log('\nThe physician can now log in at /doctor/login using:');
      console.log(`Email: ${email}`);
      console.log('Password: [the password you entered]');
      console.log('==================================================\n');
    }
  } catch (err) {
    console.error('\n[Fatal Error]', err.message);
  } finally {
    rl.close();
  }
}

main();
