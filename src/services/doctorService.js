import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export const doctorService = {
  /**
   * Fetch aggregate clinical statistics dynamically from Supabase
   */
  async getDashboardStats() {
    if (!isSupabaseConfigured()) {
      return {
        data: {
          totalCases: 0,
          newCases: 0,
          highPriority: 0,
          mediumPriority: 0,
          underReview: 0,
          completed: 0,
          activeAlerts: 0
        },
        error: null
      };
    }

    try {
      // 1. Query all cases to compute dynamic counts
      const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select('id, status, priority_level, created_at');

      if (casesError) throw casesError;

      // 2. Query active alerts
      const { count: activeAlertsCount, error: alertsError } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('is_acknowledged', false);

      if (alertsError) console.warn('Alerts count notice:', alertsError.message);

      const all = cases || [];
      const stats = {
        totalCases: all.length,
        newCases: all.filter(c => c.status === 'waiting_for_doctor' || c.status === 'submitted' || c.status === 'in_progress').length,
        highPriority: all.filter(c => c.priority_level === 'high' && c.status !== 'completed').length,
        mediumPriority: all.filter(c => c.priority_level === 'medium' && c.status !== 'completed').length,
        underReview: all.filter(c => c.status === 'under_review').length,
        completed: all.filter(c => c.status === 'completed').length,
        activeAlerts: activeAlertsCount || 0
      };

      return { data: stats, error: null };
    } catch (err) {
      console.error('[doctorService.getDashboardStats] Error:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Fetch filtered and sorted patient cases queue from Supabase
   */
  async getCases({
    priority = 'all',
    status = 'all',
    concern = 'all',
    search = '',
    sortBy = 'priority_desc',
    page = 1,
    limit = 20
  } = {}) {
    if (!isSupabaseConfigured()) {
      return { data: [], total: 0, error: null };
    }

    try {
      let query = supabase
        .from('cases')
        .select(`
          id,
          chief_complaint,
          patient_description,
          priority_level,
          status,
          submitted_at,
          created_at,
          updated_at,
          patient_id,
          patients (
            id,
            full_name,
            age,
            gender,
            mobile_number,
            location,
            blood_group,
            preferred_language
          ),
          alerts (
            id,
            alert_type,
            priority,
            message,
            is_acknowledged
          )
        `, { count: 'exact' });

      // Filter: Priority
      if (priority && priority !== 'all') {
        query = query.eq('priority_level', priority.toLowerCase());
      }

      // Filter: Status
      if (status && status !== 'all') {
        if (status === 'new') {
          query = query.in('status', ['waiting_for_doctor', 'submitted']);
        } else {
          query = query.eq('status', status.toLowerCase());
        }
      }

      // Filter: Health Concern / Chief Complaint
      if (concern && concern !== 'all') {
        query = query.ilike('chief_complaint', `%${concern.replace(/_/g, ' ')}%`);
      }

      // Search: Text search across chief_complaint, patient_description, or case ID
      if (search && search.trim()) {
        const cleanSearch = search.trim();
        // Check if searching by UUID or text
        if (cleanSearch.length > 8 && cleanSearch.includes('-')) {
          query = query.or(`id.eq.${cleanSearch},chief_complaint.ilike.%${cleanSearch}%,patient_description.ilike.%${cleanSearch}%`);
        } else {
          query = query.or(`chief_complaint.ilike.%${cleanSearch}%,patient_description.ilike.%${cleanSearch}%`);
        }
      }

      // Sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'status') {
        query = query.order('status', { ascending: true }).order('created_at', { ascending: false });
      } else {
        // Default: Priority (High first, then medium, then normal) and newest
        query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      let casesList = data || [];

      // Sort by priority on client if default priority sorting is requested
      if (sortBy === 'priority_desc' || !sortBy) {
        const priorityRank = { high: 3, medium: 2, normal: 1 };
        casesList.sort((a, b) => {
          const rankA = priorityRank[a.priority_level?.toLowerCase()] || 1;
          const rankB = priorityRank[b.priority_level?.toLowerCase()] || 1;
          if (rankA !== rankB) return rankB - rankA;
          return new Date(b.created_at) - new Date(a.created_at);
        });
      }

      // If search matches patient name on client side for joined records
      if (search && search.trim()) {
        const lowerSearch = search.trim().toLowerCase();
        casesList = casesList.filter(c => {
          const pName = c.patients?.full_name?.toLowerCase() || '';
          const pMobile = c.patients?.mobile_number?.toLowerCase() || '';
          const cId = c.id?.toLowerCase() || '';
          const cComplaint = c.chief_complaint?.toLowerCase() || '';
          return pName.includes(lowerSearch) || pMobile.includes(lowerSearch) || cId.includes(lowerSearch) || cComplaint.includes(lowerSearch);
        });
      }

      return { data: casesList, total: count || casesList.length, error: null };
    } catch (err) {
      console.error('[doctorService.getCases] Error:', err.message);
      return { data: [], total: 0, error: err.message };
    }
  },

  /**
   * Fetch complete case details including Patient demographics, Interview Answers, Documents, Alerts & Clinical Notes
   */
  async getCaseById(caseId) {
    if (!isSupabaseConfigured() || !caseId) {
      return { data: null, error: 'Supabase not configured or missing caseId' };
    }

    try {
      // 1. Fetch Case Header & Linked Patient
      const { data: caseRecord, error: caseError } = await supabase
        .from('cases')
        .select(`
          id,
          chief_complaint,
          patient_description,
          priority_level,
          status,
          reviewed_by,
          reviewed_at,
          submitted_at,
          created_at,
          updated_at,
          patient_id,
          patients (*)
        `)
        .eq('id', caseId)
        .single();

      if (caseError) throw caseError;

      // 2. Fetch Interview Answers (case_answers)
      const { data: answers, error: answersError } = await supabase
        .from('case_answers')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

      if (answersError) console.warn('case_answers fetch notice:', answersError.message);

      // 3. Fetch Medical Documents (documents)
      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId)
        .order('uploaded_at', { ascending: false });

      if (docsError) console.warn('documents fetch notice:', docsError.message);

      // 4. Fetch Case Alerts (alerts)
      const { data: alerts, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (alertsError) console.warn('alerts fetch notice:', alertsError.message);

      // 5. Fetch Doctor Notes (case_notes)
      let notes = [];
      try {
        const { data: notesData, error: notesError } = await supabase
          .from('case_notes')
          .select('*')
          .eq('case_id', caseId)
          .order('created_at', { ascending: false });

        if (!notesError && notesData) {
          notes = notesData;
        }
      } catch (e) {
        console.warn('case_notes table query notice (will use empty array if not migrated):', e);
      }

      // Assemble complete case object
      const fullCase = {
        ...caseRecord,
        patient: caseRecord.patients || null,
        answers: answers || [],
        documents: documents || [],
        alerts: alerts || [],
        notes: notes || []
      };

      return { data: fullCase, error: null };
    } catch (err) {
      console.error('[doctorService.getCaseById] Error:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Update clinical case review status
   */
  async updateCaseStatus(caseId, status, doctorProfile = {}) {
    if (!isSupabaseConfigured() || !caseId) {
      return { data: { id: caseId, status }, error: null };
    }

    try {
      const payload = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'under_review' || status === 'completed') {
        payload.reviewed_at = new Date().toISOString();
        if (doctorProfile.id) {
          payload.reviewed_by = doctorProfile.id;
        }
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
      console.error('[doctorService.updateCaseStatus] Error:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Save a private clinical doctor note
   */
  async saveDoctorNote(caseId, noteText, doctorProfile = {}) {
    if (!isSupabaseConfigured() || !caseId || !noteText.trim()) {
      return {
        data: {
          id: `note-${Date.now()}`,
          case_id: caseId,
          doctor_name: doctorProfile.full_name || 'Dr. Ananya Sharma',
          note: noteText,
          created_at: new Date().toISOString()
        },
        error: null
      };
    }

    try {
      const payload = {
        case_id: caseId,
        doctor_id: doctorProfile.id || null,
        doctor_name: doctorProfile.full_name || 'Attending Physician',
        note: noteText.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('case_notes')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[doctorService.saveDoctorNote] Error:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Generate secure temporary signed URL for viewing/downloading medical documents
   */
  async getDocumentSignedUrl(filePath, expiresInSeconds = 3600) {
    if (!isSupabaseConfigured() || !filePath) return { url: '', error: 'No file path' };

    try {
      // First try signed URL (for private buckets)
      const { data, error } = await supabase.storage
        .from('medical-documents')
        .createSignedUrl(filePath, expiresInSeconds);

      if (!error && data?.signedUrl) {
        return { url: data.signedUrl, error: null };
      }

      // Fallback to public URL if public bucket
      const { data: publicData } = supabase.storage
        .from('medical-documents')
        .getPublicUrl(filePath);

      return { url: publicData?.publicUrl || '', error: null };
    } catch (err) {
      console.error('[doctorService.getDocumentSignedUrl] Error:', err.message);
      return { url: '', error: err.message };
    }
  },

  /**
   * Mark a priority alert as clinically acknowledged
   */
  async acknowledgeAlert(alertId) {
    if (!isSupabaseConfigured() || !alertId) return { success: true };

    try {
      const { data, error } = await supabase
        .from('alerts')
        .update({
          is_acknowledged: true,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[doctorService.acknowledgeAlert] Error:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Set up Realtime subscription for incoming patient applications and emergency alerts
   */
  subscribeToRealtimeCases({ onNewCase, onAlert, onCaseUpdate } = {}) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    try {
      const channel = supabase
        .channel('doctor-live-triage-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'cases' },
          (payload) => {
            console.log('[Realtime] New patient case submitted:', payload.new);
            if (onNewCase) onNewCase(payload.new);
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'cases' },
          (payload) => {
            console.log('[Realtime] Case updated:', payload.new);
            if (onCaseUpdate) onCaseUpdate(payload.new);
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'alerts' },
          (payload) => {
            console.log('[Realtime] High-priority alert triggered:', payload.new);
            if (onAlert) onAlert(payload.new);
          }
        )
        .subscribe((status) => {
          console.log(`[Realtime] Doctor Triage Channel status: ${status}`);
        });

      return {
        unsubscribe: () => {
          supabase.removeChannel(channel);
        }
      };
    } catch (err) {
      console.warn('[doctorService.subscribeToRealtimeCases] Realtime notice:', err.message);
      return { unsubscribe: () => {} };
    }
  }
};

export default doctorService;
