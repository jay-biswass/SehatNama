import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta?.env && import.meta.env[key] !== undefined) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process?.env && process.env[key] !== undefined) {
    return process.env[key];
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Check if credentials are properly configured
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_project_url' &&
    !supabaseUrl.includes('placeholder')
  );
};

const url = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
const key = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-key';

/**
 * Isolated Supabase Client for Patient Auth & Portal
 * Uses dedicated storage key: 'sehatnama-patient-auth-token'
 */
export const patientSupabase = createClient(url, key, {
  auth: {
    storageKey: 'sehatnama-patient-auth-token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * Isolated Supabase Client for Doctor Auth & Clinical Portal
 * Uses dedicated storage key: 'sehatnama-doctor-auth-token'
 */
export const doctorSupabase = createClient(url, key, {
  auth: {
    storageKey: 'sehatnama-doctor-auth-token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Default fallback export (Patient client as primary)
export const supabase = patientSupabase;

