import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const alertService = {
  /**
   * Record a priority alert in the database for doctor triage
   */
  async createAlert({ caseId, alertType = 'potential_priority_symptoms', priority = 'high', message }) {
    if (!isSupabaseConfigured() || !caseId || caseId.startsWith('case-')) {
      return { data: { id: `alert-${Date.now()}`, message, priority }, error: null };
    }

    try {
      const payload = {
        case_id: caseId,
        alert_type: alertType,
        priority: priority,
        message: message || 'Potential priority symptoms identified. Doctor review recommended.',
        is_acknowledged: false,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('alerts')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[alertService.createAlert] Error:', err.message);
      return { data: null, error: err.message };
    }
  }
};

export default alertService;
