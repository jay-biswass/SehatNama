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

export const Documents = () => {
  const navigate = useNavigate();
  const { patientData, addDocument, updateDocumentStatus, removeDocument } = usePatient();
  
  const [selectedType, setSelectedType] = useState('prescription');
  const [processingDocId, setProcessingDocId] = useState(null);

  const documentTypes = [
    { id: 'prescription', label: 'Prescription', description: 'Add previous medicines or prescriptions', icon: '💊' },
    { id: 'lab', label: 'Lab Report', description: 'Blood tests and other investigations', icon: '🧪' },
    { id: 'discharge', label: 'Discharge Summary', description: 'Previous hospital treatment records', icon: '🏥' },
    { id: 'other', label: 'Other Document', description: 'Upload any other relevant health record', icon: '📄' }
  ];

  const handleFileUpload = (file) => {
    const docId = `doc-${Date.now()}`;
    const newDoc = {
      id: docId,
      name: file.name,
      size: file.size,
      type: selectedType,
      status: 'reading',
      extractedData: null
    };

    addDocument(newDoc);
    setProcessingDocId(docId);
  };

  const handleOCRComplete = () => {
    if (!processingDocId) return;

    // Define mock clinical findings based on selected document type
    let mockData = { medications: [], labResults: [] };
    if (selectedType === 'prescription') {
      mockData.medications = ['Metformin 500 mg', 'Amlodipine 5 mg'];
    } else if (selectedType === 'lab') {
      mockData.labResults = [{ name: 'HbA1c', value: '8.4%', status: 'attention' }];
    } else if (selectedType === 'discharge') {
      mockData.medications = ['Metformin 500 mg', 'Amlodipine 5 mg'];
    } else {
      mockData.medications = ['Metformin 500 mg'];
      mockData.labResults = [{ name: 'HbA1c', value: '8.4%', status: 'attention' }];
    }

    updateDocumentStatus(processingDocId, 'completed', mockData);
    setProcessingDocId(null);
  };

  const handleRemove = (docId) => {
    if (processingDocId === docId) {
      setProcessingDocId(null);
    }
    removeDocument(docId);
  };

  // Determine back navigation based on whether emergency was triggered
  const handleBack = () => {
    if (patientData.emergencyAlertTriggered) {
      navigate('/priority-alert');
    } else {
      navigate('/interview/question/4');
    }
  };

  const isScanning = processingDocId !== null;
  const hasUploadedDocs = patientData.documents.length > 0;

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

          {/* Scanning Animation */}
          {isScanning && (
            <OCRProcessing
              isProcessing={isScanning}
              onComplete={handleOCRComplete}
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
                    name={doc.name}
                    size={doc.size}
                    type={doc.type}
                    status={doc.status}
                    onRemove={() => handleRemove(doc.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Combined Extracted Clinical Details */}
          {hasUploadedDocs && !isScanning && (
            <ExtractedDataCard extractedData={patientData.extractedMedicalData} />
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
