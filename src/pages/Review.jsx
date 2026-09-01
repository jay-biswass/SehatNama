import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { healthQuestionFlows } from '../data/healthQuestionFlows';
import PageContainer from '../components/layout/PageContainer';
import PatientLayout from '../components/layout/PatientLayout';
import ReviewCard from '../components/review/ReviewCard';
import ReviewSection from '../components/review/ReviewSection';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import BackButton from '../components/navigation/BackButton';
import { Activity, Clock, BarChart2, MessageSquare, Pill, FileText, Send, Eye, CheckCircle2, UserCheck } from 'lucide-react';

export const Review = () => {
  const navigate = useNavigate();
  const { patientData, submitFinalCase, isSubmitting: isContextSubmitting } = usePatient();
  
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    setLocalSubmitting(true);
    await submitFinalCase();
    setLocalSubmitting(false);
    navigate('/success');
  };

  const isSubmitting = localSubmitting || isContextSubmitting;

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

  const concernFlow = patientData.selectedConcern ? healthQuestionFlows[patientData.selectedConcern] : null;
  const answers = patientData.selectedConcern ? patientData.answers[patientData.selectedConcern] : {};
  
  const medications = patientData.extractedMedicalData.medications.length > 0
    ? patientData.extractedMedicalData.medications
    : [];

  const labResults = patientData.extractedMedicalData.labResults;
  const docsCount = patientData.documents.length;

  return (
    <PatientLayout>
      <PageContainer className="justify-between py-6">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <BackButton to="/documents" />
        </div>

        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full gap-5 select-none">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              Review your health info
            </h2>
            <p className="text-sm text-slate-500">
              Please check the details below before submitting them to your doctor.
            </p>
          </div>

          <ReviewCard>
            {/* Patient Information */}
            <ReviewSection
              title="Patient Information"
              icon={<UserCheck size={16} />} 
              onEdit={() => editSection('/patient-details')}
            >
              <div className="flex flex-col gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  👤 {patientData.patientName || 'Not specified'}
                </span>
                
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs font-medium text-slate-600 mt-1">
                  <span>Age: {patientData.age ? `${patientData.age} years` : 'Not specified'}</span>
                  <span>Gender: {patientData.gender || 'Not specified'}</span>
                  <span>📱 {patientData.mobileNumber ? `+91 ${patientData.mobileNumber}` : 'Not specified'}</span>
                  {patientData.location && <span>📍 {patientData.location}</span>}
                </div>

                {(patientData.bloodGroup || patientData.hasAllergies === 'Yes') && (
                  <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    {patientData.bloodGroup && (
                      <span className="font-medium">Blood Group: <span className="font-bold text-slate-800">{patientData.bloodGroup}</span></span>
                    )}
                    {patientData.hasAllergies === 'Yes' && patientData.allergies && (
                      <span className="font-medium">Allergies: <span className="font-bold text-slate-800">{patientData.allergies}</span></span>
                    )}
                  </div>
                )}
              </div>
            </ReviewSection>

            {/* Main Health Concern */}
            <ReviewSection 
              title="Main Health Concern" 
              icon={<Activity size={16} />}
              onEdit={() => editSection('/interview/concern')}
            >
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-900 text-sm block">
                  {concernFlow ? concernFlow.title : 'Not specified'}
                </span>
                {patientData.patientDescription && (
                  <span className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{patientData.patientDescription}"
                  </span>
                )}
              </div>
            </ReviewSection>

            {/* Dynamic Interview Answers */}
            {concernFlow && concernFlow.questions && concernFlow.questions.length > 0 && (
              <ReviewSection 
                title="Interview Answers" 
                icon={<MessageSquare size={16} />}
                onEdit={() => editSection('/interview/question/0')}
              >
                <div className="flex flex-col gap-4 mt-1">
                  {concernFlow.questions.map((q, idx) => {
                    const ans = answers && answers[q.id];
                    if (ans === undefined || ans === null || ans === '' || (Array.isArray(ans) && ans.length === 0)) {
                      return null;
                    }
                    return (
                      <div key={q.id} className="flex flex-col gap-1 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
                          {q.question}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {Array.isArray(ans) ? ans.join(', ') : (q.type === 'scale' ? `${ans} / 10` : ans)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ReviewSection>
            )}

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
