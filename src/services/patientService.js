import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const patientService = {
  /**
   * Save or update patient demographic details
   */
  async upsertPatient(data) {
    if (!isSupabaseConfigured()) {
      console.warn('[patientService] Supabase not configured. Using local state fallback.');
      return { data: { id: data.id || 'local-patient-id', ...data }, error: null };
    }

    try {
      const payload = {
        full_name: data.patientName || data.full_name || 'Patient',
        date_of_birth: data.dateOfBirth || data.date_of_birth || null,
        age: data.age || null,
        gender: data.gender || null,
        mobile_number: data.mobileNumber || data.mobile_number || '',
        email: data.email || null,
        location: data.location || null,
        blood_group: data.bloodGroup || data.blood_group || null,
        has_allergies: data.hasAllergies || data.has_allergies || null,
        allergies: data.allergies || null,
        preferred_language: data.selectedLanguage || data.preferred_language || null,
        updated_at: new Date().toISOString()
      };

      if (data.id) {
        payload.id = data.id;
      }

      const { data: result, error } = await supabase
        .from('patients')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;
      return { data: result, error: null };
    } catch (err) {
      console.error('[patientService.upsertPatient] Error:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Get patient by mobile number
   */
  async getPatientByMobile(mobileNumber) {
    if (!isSupabaseConfigured() || !mobileNumber) return { data: null, error: null };

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('mobile_number', mobileNumber)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[patientService.getPatientByMobile] Error:', err.message);
      return { data: null, error: err.message };
    }
  }
};

export default patientService;
