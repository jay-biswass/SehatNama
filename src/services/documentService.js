import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const documentService = {
  /**
   * Upload file binary to Supabase Storage bucket 'medical-documents'
   */
  async uploadFile(file, patientId = 'guest', caseId = 'draft') {
    if (!isSupabaseConfigured()) {
      console.warn('[documentService] Supabase not configured. Using local file path mock.');
      return { 
        filePath: `mock-storage/${file.name}`, 
        publicUrl: URL.createObjectURL(file),
        error: null 
      };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `medical-documents/${patientId}/${caseId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('medical-documents')
        .getPublicUrl(filePath);

      return {
        filePath,
        publicUrl: urlData?.publicUrl || '',
        error: null
      };
    } catch (err) {
      console.error('[documentService.uploadFile] Error:', err.message);
      return { filePath: file.name, publicUrl: '', error: err.message };
    }
  },

  /**
   * Save document metadata record into 'documents' table
   */
  async saveDocumentMetadata({ caseId, fileName, filePath, fileType, fileSize, documentType }) {
    if (!isSupabaseConfigured() || !caseId || caseId.startsWith('case-')) {
      return { data: { id: `doc-${Date.now()}`, fileName, filePath }, error: null };
    }

    try {
      const payload = {
        case_id: caseId,
        file_name: fileName,
        file_path: filePath,
        file_type: fileType || 'application/octet-stream',
        file_size: fileSize || 0,
        document_type: documentType || 'other',
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('documents')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('[documentService.saveDocumentMetadata] Error:', err.message);
      return { data: null, error: err.message };
    }
  }
};

export default documentService;
