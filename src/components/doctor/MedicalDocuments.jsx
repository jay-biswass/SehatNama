import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Eye, 
  Pill, 
  TestTube2, 
  Sparkles,
  Lock
} from 'lucide-react';
import doctorService from '../../services/doctorService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export const MedicalDocuments = ({ documents = [], extractedData = {}, caseData = {} }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loadingDocId, setLoadingDocId] = useState(null);
  const [docUrl, setDocUrl] = useState('');

  // Extract any medications or lab results from patient description summary
  let parsedSummary = null;
  if (caseData.patient_description && typeof caseData.patient_description === 'string' && caseData.patient_description.startsWith('{')) {
    try {
      parsedSummary = JSON.parse(caseData.patient_description);
    } catch (e) {
      parsedSummary = null;
    }
  }

  const medications = extractedData.medications?.length > 0
    ? extractedData.medications
    : (parsedSummary?.clinicalHistory?.medications || []);

  const labResults = extractedData.labResults?.length > 0
    ? extractedData.labResults
    : (parsedSummary?.extractedMedicalData?.labResults || []);

  const handleOpenDoc = async (doc) => {
    setLoadingDocId(doc.id);
    try {
      const { url } = await doctorService.getDocumentSignedUrl(doc.file_path || doc.filePath);
      if (url) {
        setDocUrl(url);
        setSelectedDoc(doc);
      } else {
        alert('Could not generate secure link for this document.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDocId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Size unknown';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Uploaded today';
    try {
      return new Date(isoString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Uploaded recently';
    }
  };

  const hasDocs = Array.isArray(documents) && documents.length > 0;
  const hasMeds = Array.isArray(medications) && medications.length > 0;
  const hasLabs = Array.isArray(labResults) && labResults.length > 0;

  if (!hasDocs && !hasMeds && !hasLabs) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center text-slate-400 text-xs shadow-[0_4px_20px_0_rgba(0,0,0,0.03)]">
        No medical documents or extracted records uploaded for this case.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Medical Documents & AI Extractions
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Secure patient-uploaded records stored with Supabase Storage encryption
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          <Lock size={11} className="text-blue-600" />
          <span>Encrypted EMR Access</span>
        </span>
      </div>

      {/* Extracted Medications & Labs (if available) */}
      {(hasMeds || hasLabs) && (
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900">
            <Sparkles size={15} className="text-blue-600" />
            <span>AI Document Intelligence Extractions</span>
          </div>

          {hasMeds && (
            <div>
              <span className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1 mb-1.5">
                <Pill size={13} className="text-blue-700" />
                <span>Extracted Current Medications:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {medications.map((med, idx) => (
                  <span key={idx} className="bg-white border border-blue-200 text-blue-950 font-extrabold px-3 py-1 rounded-full text-xs shadow-2xs">
                    💊 {typeof med === 'string' ? med : [med.name, med.dose, med.frequency].filter(Boolean).join(' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hasLabs && (
            <div>
              <span className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1 mb-1.5">
                <TestTube2 size={13} className="text-blue-700" />
                <span>Extracted Lab Findings / Vitals:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {labResults.map((lab, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-900 font-bold px-3 py-1 rounded-full text-xs shadow-2xs">
                    🔬 {lab.name || 'Lab'}: <strong className="text-blue-700">{lab.value || 'Normal'}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Documents List */}
      {hasDocs ? (
        <div className="flex flex-col gap-2.5">
          {documents.map((doc) => {
            const fileName = doc.file_name || doc.fileName || 'Medical Document';
            const docType = doc.document_type || doc.type || 'Prescription / Report';
            const isLoadingThis = loadingDocId === doc.id;

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-slate-50/80 border border-slate-100 rounded-2xl hover:bg-blue-50/40 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-slate-900 truncate block">
                      {fileName}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-0.5">
                      <span className="capitalize text-blue-700 font-bold">{docType}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.file_size || doc.size)}</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploaded_at || doc.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenDoc(doc)}
                    disabled={isLoadingThis}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-blue-700 bg-white border border-blue-200 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                  >
                    <Eye size={13} />
                    <span>{isLoadingThis ? 'Opening...' : 'View'}</span>
                  </button>

                  <a
                    href={doc.file_path ? doc.file_path : '#'}
                    onClick={async (e) => {
                      e.preventDefault();
                      const { url } = await doctorService.getDocumentSignedUrl(doc.file_path || doc.filePath);
                      if (url) window.open(url, '_blank');
                    }}
                    className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Download Document"
                  >
                    <Download size={15} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No document files attached.</p>
      )}

      {/* Document Preview Modal */}
      {selectedDoc && (
        <Modal
          isOpen={Boolean(selectedDoc)}
          onClose={() => {
            setSelectedDoc(null);
            setDocUrl('');
          }}
          title={selectedDoc.file_name || selectedDoc.fileName || 'Document Viewer'}
        >
          <div className="flex flex-col gap-4 max-h-[75vh]">
            <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">
                Type: <strong className="capitalize">{selectedDoc.document_type || selectedDoc.type || 'Medical Document'}</strong>
              </span>
              <a
                href={docUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-extrabold"
              >
                <span>Open in Full Tab</span>
                <ExternalLink size={13} />
              </a>
            </div>

            <div className="w-full h-96 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-700">
              {docUrl.endsWith('.pdf') || docUrl.includes('.pdf') ? (
                <iframe src={docUrl} title="Document PDF" className="w-full h-full" />
              ) : (
                <img
                  src={docUrl}
                  alt="Medical Document"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>

            <Button
              className="w-full rounded-2xl py-3 font-bold"
              onClick={() => {
                setSelectedDoc(null);
                setDocUrl('');
              }}
            >
              Close Viewer
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MedicalDocuments;
