/**
 * Frontend Medical Document AI Service for SehatNama
 * 
 * Communicates ONLY with server-side endpoint POST /api/extract-medical-document.
 * The frontend NEVER calls Gemini directly and NEVER handles GEMINI_API_KEY.
 * 
 * Supports: JPG, JPEG, PNG, WEBP, PDF
 * ZERO fallback OCR. Real Gemini Multimodal Extraction only.
 */

const SUPPORTED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'pdf']);
const SUPPORTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf'
]);

// Track active extractions to prevent duplicate concurrent requests for the same document
const activeExtractions = new Set();

/**
 * Validates if the file is a supported image or PDF document
 * @param {File|Blob|string} fileOrType
 * @returns {boolean}
 */
export function isSupportedDocument(fileOrType) {
  if (!fileOrType) return false;

  if (typeof fileOrType === 'string') {
    const lower = fileOrType.toLowerCase().trim();
    if (SUPPORTED_MIME_TYPES.has(lower)) return true;
    const ext = lower.split('.').pop();
    return SUPPORTED_EXTENSIONS.has(ext);
  }

  const mime = (fileOrType.type || '').toLowerCase().trim();
  if (mime && SUPPORTED_MIME_TYPES.has(mime)) return true;

  const fileName = (fileOrType.name || '').toLowerCase().trim();
  const ext = fileName.split('.').pop();
  return SUPPORTED_EXTENSIONS.has(ext);
}

/**
 * Converts a File or Blob to a base64 Data URL
 * @param {File|Blob} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided to read as base64.'));
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err || new Error('FileReader failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts clinical facts from a medical document via POST /api/extract-medical-document
 * 
 * @param {Object} params
 * @param {File|Blob} [params.file] - The uploaded browser File/Blob
 * @param {string} [params.base64Data] - Pre-encoded base64 or Data URL
 * @param {string} [params.mimeType] - MIME type of the file
 * @param {string} [params.fileName] - Name of the file
 * @param {string} [params.documentId] - Unique ID of the document (to prevent concurrent duplicates)
 * @returns {Promise<{ success: boolean, extracted?: Object, reason?: string }>}
 */
export async function extractDocument({ file, base64Data, mimeType, fileName, documentId }) {
  const reqId = documentId || fileName || file?.name || 'unknown_doc';

  // 1. Prevent multiple simultaneous extraction requests for the same document
  if (activeExtractions.has(reqId)) {
    return {
      success: false,
      reason: 'Extraction is already in progress for this document.',
      inProgress: true
    };
  }

  // 2. Validate file presence
  if (!file && !base64Data) {
    return {
      success: false,
      reason: 'No document file was provided for extraction.'
    };
  }

  const effectiveName = fileName || file?.name || 'medical-document';
  let effectiveMime = mimeType || file?.type || '';

  // Infer mime type from extension if missing or generic
  if (!effectiveMime || effectiveMime === 'application/octet-stream') {
    const ext = effectiveName.split('.').pop().toLowerCase();
    if (ext === 'pdf') effectiveMime = 'application/pdf';
    else if (ext === 'jpg' || ext === 'jpeg') effectiveMime = 'image/jpeg';
    else if (ext === 'png') effectiveMime = 'image/png';
    else if (ext === 'webp') effectiveMime = 'image/webp';
  }

  // 3. Validate supported format (JPG, JPEG, PNG, WEBP, PDF)
  if (!isSupportedDocument(effectiveMime) && !isSupportedDocument(effectiveName)) {
    return {
      success: false,
      reason: 'This document format is not supported.'
    };
  }

  activeExtractions.add(reqId);

  try {
    // Convert to base64 if not already available
    let payloadBase64 = base64Data;
    if (!payloadBase64 && file) {
      payloadBase64 = await fileToBase64(file);
    }

    if (!payloadBase64) {
      return {
        success: false,
        reason: 'Failed to read document data.'
      };
    }

    const response = await fetch('/api/extract-medical-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base64Data: payloadBase64,
        mimeType: effectiveMime,
        fileName: effectiveName
      })
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const reason = errorJson?.reason || 'Unable to extract information from this document right now. The original document has been saved.';
      return {
        success: false,
        reason
      };
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        reason: data.reason || "We couldn't reliably extract information from this document. The original document has been saved."
      };
    }

    return {
      success: true,
      extracted: data.extracted,
      meta: data.meta
    };
  } catch (err) {
    console.error('[documentAIService] Network or extraction error:', err.message);
    return {
      success: false,
      reason: 'Unable to extract information from this document right now. The original document has been saved.'
    };
  } finally {
    activeExtractions.delete(reqId);
  }
}

export const documentAIService = {
  extractDocument,
  isSupportedDocument,
  fileToBase64,
  isExtracting: (docId) => activeExtractions.has(docId)
};

export default documentAIService;
