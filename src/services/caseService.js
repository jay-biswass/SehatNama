import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export const caseService = {
  /**
   * Create a new medical case record
   */
  async createCase({ patientId, chiefComplaint, patientDescription = '', priorityLevel = 'normal' }) {
    if (!isSupabaseConfigured()) {
      console.warn('[caseService] Supabase not configured. Using local case ID.');
      return { data: { id: `case-${Date.now()}`, chief_complaint: chiefComplaint, status: 'in_progress' }, error: null };
    }

    try {
      const payload = {
        patient_id: patientId || null,
        chief_complaint: chiefComplaint || 'Unspecified',
        patient_description: patientDescription || '',
        priority_level: priorityLevel || 'normal',
        status: 'in_progress',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (patientId && typeof patientId === 'string') {
        payload.patient_id = patientId;
      }

      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.id) {
          payload.profile_id = authData.user.id;
        }
      } catch {
        // ignore if unauthenticated guest
      }

      const { data, error } = await supabase
        .from('cases')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[caseService.createCase] Error:', err.message);
      return { data: { id: `case-${Date.now()}`, chief_complaint: chiefComplaint }, error: err.message };
    }
  },

  /**
   * Update existing case status or details
   */
  async updateCase(caseId, updates) {
    if (!isSupabaseConfigured() || !caseId || caseId.startsWith('case-')) {
      return { data: { id: caseId, ...updates }, error: null };
    }

    try {
      const payload = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.status === 'submitted' || updates.status === 'waiting_for_doctor') {
        payload.submitted_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('cases')
        .update(payload)
        .eq('id', caseId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[caseService.updateCase] Error:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Save dynamic interview answers for a case
   */
  async saveAnswers(caseId, answersList) {
    if (!isSupabaseConfigured() || !caseId || caseId.startsWith('case-') || !answersList.length) {
      return { data: answersList, error: null };
    }

    try {
      const records = answersList.map(item => ({
        case_id: caseId,
        question_id: item.question_id,
        question_text: item.question_text || '',
        question_type: item.question_type || 'single_choice',
        answer: item.answer,
        updated_at: new Date().toISOString()
      }));

      // Delete existing answers for these question IDs to overwrite, then insert
      const questionIds = records.map(r => r.question_id);
      await supabase
        .from('case_answers')
        .delete()
        .eq('case_id', caseId)
        .in('question_id', questionIds);

      const { data, error } = await supabase
        .from('case_answers')
        .insert(records)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[caseService.saveAnswers] Error:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Retrieve all cases submitted by a specific authenticated patient profile
   */
  async getPatientCases(profileId) {
    if (!isSupabaseConfigured() || !profileId) {
      return { data: [], error: null };
    }

    try {
      // Find patient record IDs belonging to this profile
      const { data: patientRows } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', profileId);

      const patientIds = (patientRows || []).map(p => p.id);

      let query = supabase
        .from('cases')
        .select(`
          id,
          chief_complaint,
          patient_description,
          priority_level,
          status,
          created_at,
          submitted_at,
          reviewed_at
        `)
        .order('created_at', { ascending: false });

      if (patientIds.length > 0) {
        query = query.or(`profile_id.eq.${profileId},patient_id.in.(${patientIds.join(',')})`);
      } else {
        query = query.eq('profile_id', profileId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('[caseService.getPatientCases] Error:', err.message);
      return { data: [], error: err.message };
    }
  }
};

export default caseService;
