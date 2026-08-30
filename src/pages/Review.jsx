import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import PageContainer from '../components/layout/PageContainer';
import PatientLayout from '../components/layout/PatientLayout';
import ReviewCard from '../components/review/ReviewCard';
import ReviewSection from '../components/review/ReviewSection';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import BackButton from '../components/navigation/BackButton';
import { Activity, Clock, BarChart2, MessageSquare, Pill, FileText, Send, Eye } from 'lucide-react';

export const Review = () => {
  const navigate = useNavigate();
  const { patientData } = usePatient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission loading for 2 seconds, then navigate to success
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/success');
    }, 2000);
  };

  const editSection = (path) => {
    navigate(path);
  };

  if (isSubmitting) {
    return (
      <PatientLayout>
        <PageContainer className="justify-center items-center py-12">
          <div className="max-w-xs text-center flex flex-col items-center gap-4">
            <Loader message="Preparing your clinical case summary..." />
            <p className="text-xs text-slate-400 font-medium">
              We are formatting your inputs securely for your doctor's dashboard.
            </p>
          </div>
        </PageContainer>
      </PatientLayout>
    );
  }

  // Fallback defaults if patient skipped fields (helps for standalone prototype exploration)
  const complaint = patientData.chiefComplaint || 'Chest pain';
  const severity = patientData.severity || 'Severe (7-8 / 10)';
  const duration = patientData.duration || 'Since this morning';
  const symptoms = patientData.associatedSymptoms.length > 0 
    ? patientData.associatedSymptoms 
    : ['Difficulty breathing', 'Sweating'];
  
  const medications = patientData.extractedMedicalData.medications.length > 0
    ? patientData.extractedMedicalData.medications
    : ['Metformin 500 mg', 'Amlodipine 5 mg'];

  const labResults = patientData.extractedMedicalData.labResults;
  const docsCount = patientData.documents.length;

  return (
    <PatientLayout>
      <PageContainer className="justify-between py-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <BackButton to="/documents" />
        </div>

        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full gap-5 select-none">
          {/* Header */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              Review your health info
            </h2>
            <p className="text-sm text-slate-500">
              Please check the details below before submitting them to your doctor.
            </p>
          </div>

          {/* Compiled Summary Cards */}
          <ReviewCard>
            {/* Chief Complaint */}
            <ReviewSection 
              title="Main Health Concern" 
              icon={<Activity size={16} />}
              onEdit={() => editSection('/interview')}
            >
              <span className="font-bold text-slate-900 text-sm block">
                {complaint}
              </span>
            </ReviewSection>

            {/* Severity */}
            <ReviewSection 
              title="Severity" 
              icon={<BarChart2 size={16} />}
              onEdit={() => editSection('/interview/question/2')}
            >
              <span className="font-bold text-slate-900 text-sm block">
                {severity}
              </span>
            </ReviewSection>

            {/* Duration */}
            <ReviewSection 
              title="Duration" 
              icon={<Clock size={16} />}
              onEdit={() => editSection('/interview/question/3')}
            >
              <span className="font-bold text-slate-900 text-sm block">
                {duration}
              </span>
            </ReviewSection>

            {/* Associated Symptoms */}
            <ReviewSection 
              title="Associated Symptoms" 
              icon={<MessageSquare size={16} />}
              onEdit={() => editSection('/interview/question/4')}
            >
              <div className="flex flex-wrap gap-1.5 mt-1">
                {symptoms.map((symptom, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-lg text-xs">
                    {symptom}
                  </span>
                ))}
              </div>
            </ReviewSection>

            {/* Medications */}
            <ReviewSection 
              title="Current Medications (from Documents)" 
              icon={<Pill size={16} />}
              onEdit={() => editSection('/documents')}
            >
              <div className="flex flex-wrap gap-1.5 mt-1">
                {medications.map((med, idx) => (
                  <span key={idx} className="bg-teal-50 border border-teal-100 text-teal-900 font-bold px-2.5 py-1 rounded-lg text-xs">
                    💊 {med}
                  </span>
                ))}
              </div>
              {labResults.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs flex flex-col gap-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Extracted Observations:</span>
                  {labResults.map((lab, idx) => (
                    <div key={idx} className="flex justify-between font-bold text-slate-700">
                      <span>{lab.name}</span>
                      <span className={lab.status === 'attention' ? 'text-amber-600' : 'text-slate-900'}>{lab.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </ReviewSection>

            {/* Documents */}
            <ReviewSection 
              title="Medical Documents" 
              icon={<FileText size={16} />}
              onEdit={() => editSection('/documents')}
            >
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-slate-900 text-sm">
                  {docsCount === 0 ? 'No documents added' : `${docsCount} document${docsCount > 1 ? 's' : ''} added`}
                </span>
                {docsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-teal-700 hover:text-teal-900 font-bold text-xs flex items-center gap-1 bg-teal-50 px-2.5 py-1.5 rounded-lg cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>View list</span>
                  </button>
                )}
              </div>
            </ReviewSection>
          </ReviewCard>

          {/* Doctor Review Alert */}
          <Alert variant="success" className="py-3 px-4">
            <span className="font-medium text-xs leading-relaxed block">
              👨‍⚕️ Your doctor will review, adjust, and confirm all this information during your consultation.
            </span>
          </Alert>

          {/* Action Button */}
          <div className="mt-2">
            <Button
              size="lg"
              className="w-full py-4 text-base font-bold"
              onClick={handleSubmit}
              icon={<Send size={18} />}
            >
              Submit to Doctor
            </Button>
          </div>
        </div>

        {/* Modal to view files list */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Uploaded Documents"
        >
          <div className="flex flex-col gap-3">
            {patientData.documents.map((doc) => (
              <div key={doc.id} className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-between text-xs select-none">
                <div>
                  <span className="font-bold text-slate-800 block truncate max-w-[200px]">{doc.name}</span>
                  <span className="text-[10px] text-slate-400 capitalize block mt-0.5">{doc.type}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {((doc.size || 0) / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
            <Button className="mt-2 w-full" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </Modal>
      </PageContainer>
    </PatientLayout>
  );
};

export default Review;
