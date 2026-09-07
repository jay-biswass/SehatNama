import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import PageContainer from '../components/layout/PageContainer';
import PatientLayout from '../components/layout/PatientLayout';
import DocumentTypeCard from '../components/documents/DocumentTypeCard';
import DocumentUploader from '../components/documents/DocumentUploader';
import UploadedDocumentCard from '../components/documents/UploadedDocumentCard';
import OCRProcessing from '../components/documents/OCRProcessing';
import ExtractedDataCard from '../components/documents/ExtractedDataCard';
import Button from '../components/ui/Button';
import BackButton from '../components/navigation/BackButton';
import documentAIService from '../services/documentAI/documentAIService';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export const Documents = () => {
  const navigate = useNavigate();
  const { patientData, uploadAndAddDocument, updateDocumentStatus, removeDocument } = usePatient();
  
  const isUploadingRef = React.useRef(false);
  const [selectedType, setSelectedType] = useState('prescription');
  const [processingStage, setProcessingStage] = useState(null); // 'uploading' | 'analyzing' | null
  const [activeDocId, setActiveDocId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const documentTypes = [
    { id: 'prescription', label: 'Prescription', description: 'Add previous medicines or prescriptions', icon: '💊' },
    { id: 'lab', label: 'Lab Report', description: 'Blood tests and other investigations', icon: '🧪' },
    { id: 'discharge', label: 'Discharge Summary', description: 'Previous hospital treatment records', icon: '🏥' },
    { id: 'other', label: 'Other Document', description: 'Upload any other relevant health record', icon: '📄' }
  ];

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (isUploadingRef.current || processingStage !== null) {
      console.warn('[Documents] Upload already in progress, ignoring duplicate trigger');
      return;
    }

    // Validate supported formats (JPG, JPEG, PNG, WEBP, PDF)
    if (!documentAIService.isSupportedDocument(file)) {
      setStatusMessage({
        type: 'error',
        text: 'Unsupported file format. Please upload a JPG, JPEG, PNG, WEBP, or PDF document.'
      });
      return;
    }

    isUploadingRef.current = true;
    setStatusMessage(null);

    // Stage 1: Uploading document...
    setProcessingStage('uploading');
    let docId = null;

    try {
      docId = await uploadAndAddDocument(file, selectedType);
      setActiveDocId(docId);

      // Stage 2: Analyzing document with AI...
      setProcessingStage('analyzing');
      updateDocumentStatus(docId, 'processing', null);

      // Call server-side Gemini Multimodal Document Engine
      const result = await documentAIService.extractDocument({
        file,
        fileName: file.name,
        mimeType: file.type,
        documentId: docId
      });

      if (result.success && result.extracted) {
        // Stage 3: Success -> mark extracted
        updateDocumentStatus(docId, 'extracted', result.extracted);
        setStatusMessage({
          type: 'success',
          text: '✓ Document analyzed successfully'
        });
      } else {
        // Failure: mark extraction_failed, preserve original document with real reason
        const reason = result.reason || "We couldn't reliably extract information from this document. The original document has been saved.";
        updateDocumentStatus(docId, 'extraction_failed', null, { failureReason: reason });
        setStatusMessage({
          type: 'error',
          text: `⚠ ${reason}`
        });
      }
    } catch (err) {
      console.error('[Documents] Extraction pipeline error:', err);
      const fallbackReason = "We couldn't reliably extract information from this document. The original document has been saved.";
      if (docId) {
        updateDocumentStatus(docId, 'extraction_failed', null, {
          failureReason: fallbackReason
        });
      }
      setStatusMessage({
        type: 'error',
        text: `⚠ ${fallbackReason}`
      });
    } finally {
      setProcessingStage(null);
      setActiveDocId(null);
      isUploadingRef.current = false;
    }
  };

  const handleRetryExtraction = async (doc) => {
    if (!doc || !doc.id) return;
    if (processingStage !== null || isUploadingRef.current) return; // Prevent concurrent requests

    setStatusMessage(null);
    setActiveDocId(doc.id);
    setProcessingStage('analyzing');
    updateDocumentStatus(doc.id, 'processing', null);

    try {
      const result = await documentAIService.extractDocument({
        file: doc.fileRef,
        fileName: doc.fileName || doc.name,
        mimeType: doc.fileType || doc.type,
        documentId: doc.id
      });

      if (result.success && result.extracted) {
        updateDocumentStatus(doc.id, 'extracted', result.extracted);
        setStatusMessage({
          type: 'success',
          text: '✓ Document analyzed successfully'
        });
      } else {
        const reason = result.reason || "We couldn't reliably extract information from this document. The original document has been saved.";
        updateDocumentStatus(doc.id, 'extraction_failed', null, { failureReason: reason });
        setStatusMessage({
          type: 'error',
          text: `⚠ ${reason}`
        });
      }
    } catch (err) {
      console.error('[Documents] Retry extraction error:', err);
      const fallbackReason = "We couldn't reliably extract information from this document. The original document has been saved.";
      updateDocumentStatus(doc.id, 'extraction_failed', null, {
        failureReason: fallbackReason
      });
      setStatusMessage({
        type: 'error',
        text: `⚠ ${fallbackReason}`
      });
    } finally {
      setProcessingStage(null);
      setActiveDocId(null);
    }
  };

  const handleRemove = (docId) => {
    if (activeDocId === docId) {
      setActiveDocId(null);
      setProcessingStage(null);
    }
    removeDocument(docId);
  };

  // Determine back navigation based on whether emergency was triggered
  const handleBack = () => {
    if (patientData.emergencyAlertTriggered) {
      navigate('/priority-alert');
    } else {
      navigate('/interview');
    }
  };

  const isScanning = processingStage !== null;
  const hasUploadedDocs = patientData.documents.length > 0;

  // Build aggregate extracted data for display
  const latestExtractedDoc = [...patientData.documents].reverse().find(d => d.status === 'extracted' && d.extraction);
  const displayExtractedData = latestExtractedDoc ? latestExtractedDoc.extraction : (
    (patientData.extractedMedicalData?.medications?.length > 0 || patientData.extractedMedicalData?.labResults?.length > 0)
      ? patientData.extractedMedicalData
      : null
  );

  return (
    <PatientLayout>
      <PageContainer className="justify-between py-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <BackButton onClick={handleBack} />
        </div>

        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full gap-6 select-none">
          {/* Header */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              Do you have any previous medical reports?
            </h2>
            <p className="text-sm text-slate-500">
              You can add them so your doctor can better understand your medical history.
            </p>
          </div>

          {/* Status Banners */}
          {statusMessage && !isScanning && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Document Type Grid */}
          {!isScanning && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {documentTypes.map((type) => (
                <DocumentTypeCard
                  key={type.id}
                  label={type.label}
                  description={type.description}
                  icon={type.icon}
                  selected={selectedType === type.id}
                  onClick={() => setSelectedType(type.id)}
                />
              ))}
            </div>
          )}

          {/* Uploader Box */}
          {!isScanning && (
            <DocumentUploader
              onUpload={handleFileUpload}
              disabled={isScanning}
            />
          )}

          {/* Processing Animation */}
          {isScanning && (
            <OCRProcessing
              isProcessing={isScanning}
              message={
                processingStage === 'uploading'
                  ? 'Uploading document...'
                  : 'Analyzing document with AI...'
              }
            />
          )}

          {/* Uploaded Document List */}
          {hasUploadedDocs && (
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide">
                Uploaded Records ({patientData.documents.length})
              </h4>
              <div className="flex flex-col gap-2.5">
                {patientData.documents.map((doc) => (
                  <UploadedDocumentCard
                    key={doc.id}
                    name={doc.fileName || doc.name}
                    size={doc.size}
                    type={doc.type}
                    status={doc.status}
                    failureReason={doc.failureReason}
                    onRemove={() => handleRemove(doc.id)}
                    onRetry={() => handleRetryExtraction(doc)}
                    isRetrying={activeDocId === doc.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Combined Extracted Clinical Details */}
          {hasUploadedDocs && !isScanning && displayExtractedData && (
            <ExtractedDataCard extractedData={displayExtractedData} />
          )}

          {/* Action Row */}
          {!isScanning && (
            <div className="flex flex-col gap-2.5 mt-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="ghost"
                className="w-full sm:w-auto text-slate-500 hover:text-slate-700 font-semibold"
                onClick={() => navigate('/review')}
              >
                {hasUploadedDocs ? 'Skip Remaining' : 'Skip for now'}
              </Button>
              <Button
                size="lg"
                className="w-full sm:w-48 py-3.5 text-sm"
                onClick={() => navigate('/review')}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </PageContainer>
    </PatientLayout>
  );
};

export default Documents;
