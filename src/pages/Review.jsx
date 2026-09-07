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
import {
  Activity,
  MessageSquare,
  Pill,
  FileText,
  Send,
  Eye,
  UserCheck,
  Stethoscope,
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';

export const Review = () => {
  const navigate = useNavigate();
  const {
    patientData,
    submitFinalCase,
    exportPhysicianSummary,
    isSubmitting: isContextSubmitting
  } = usePatient();
  
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const concernFlow = patientData?.selectedConcern ? healthQuestionFlows[patientData.selectedConcern] : null;
  const answers = (patientData?.selectedConcern && patientData?.answers && patientData.answers[patientData.selectedConcern]) || {};
  
  const medications = Array.isArray(patientData?.extractedMedicalData?.medications) && patientData.extractedMedicalData.medications.length > 0
    ? patientData.extractedMedicalData.medications
    : (patientData?.clinicalHistory?.medications || []);

  const docsCount = Array.isArray(patientData?.documents) ? patientData.documents.length : 0;

  const clinicalHistory = patientData?.clinicalHistory || {};
  const hpi = clinicalHistory?.hpi || {};
  const provenance = clinicalHistory?.provenance || {};
  const physicianSummary = exportPhysicianSummary ? exportPhysicianSummary() : {};

  const handleCopySummary = () => {
    navigator.clipboard.writeText(JSON.stringify(physicianSummary, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderProvenanceBadge = (fieldKey) => {
    const entry = provenance[fieldKey];
    if (!entry) return null;

    if (entry.source === 'PATIENT_DIRECT') {
      return (
        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
          🗣️ Patient Direct
        </span>
      );
    }
    if (entry.source === 'AI_EXTRACTION') {
      return (
        <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded" title={entry.raw_utterance ? `Utterance: "${entry.raw_utterance}"` : ''}>
          🤖 AI Extracted
        </span>
      );
    }
    if (entry.source === 'PHYSICIAN_CONFIRMED') {
      return (
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
          👨‍⚕️ Physician Confirmed
        </span>
      );
    }
    return null;
  };

  return (
    <PatientLayout>
      <PageContainer className="justify-between py-6">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <BackButton to="/documents" />
        </div>

        <div className="flex-1 flex flex-col max-w-xl mx-auto w-full gap-5 select-none">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                Review your health info
              </h2>
              <p className="text-sm text-slate-500">
                Please check the details below before submitting them to your doctor.
              </p>
            </div>

            {/* Quick Physician View Button */}
            <button
              type="button"
              onClick={() => setIsSummaryModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0"
            >
              <Stethoscope size={16} />
              <span>Physician JSON</span>
            </button>
          </div>

          {/* Priority / Triage Alert Banner if High Priority */}
          {clinicalHistory.priority === 'HIGH' && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-900 text-xs font-bold">
                <ShieldAlert size={18} className="text-red-600 shrink-0" />
                <span>High-Priority Triage Signal Flagged for Clinical Team</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
                High Priority
              </span>
            </div>
          )}

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

            {/* Structured Clinical History (SOCRATES Intake) */}
            <ReviewSection 
              title="Clinical History (SOCRATES)" 
              icon={<Activity size={16} />}
              onEdit={() => editSection('/interview')}
            >
              <div className="flex flex-col gap-2.5 mt-1">
                {/* Chief Complaint */}
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs text-slate-500 font-semibold">Chief Complaint:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 capitalize">
                      {clinicalHistory.chief_complaint || concernFlow?.title || 'Not specified'}
                    </span>
                    {renderProvenanceBadge('chief_complaint')}
                  </div>
                </div>

                {/* Site */}
                {hpi.site && (
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs text-slate-500 font-semibold">Site (Location):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 capitalize">{hpi.site}</span>
                      {renderProvenanceBadge('hpi.site')}
                    </div>
                  </div>
                )}

                {/* Onset */}
                {hpi.onset && (
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs text-slate-500 font-semibold">Onset:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 capitalize">{hpi.onset}</span>
                      {renderProvenanceBadge('hpi.onset')}
                    </div>
                  </div>
                )}

                {/* Duration */}
                {hpi.duration && (
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs text-slate-500 font-semibold">Duration:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{hpi.duration}</span>
                      {renderProvenanceBadge('hpi.duration')}
                    </div>
                  </div>
                )}

                {/* Character */}
                {hpi.character && (
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs text-slate-500 font-semibold">Pain Character:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 capitalize">{hpi.character}</span>
                      {renderProvenanceBadge('hpi.character')}
                    </div>
                  </div>
                )}

                {/* Radiation */}
                {hpi.radiation && (
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs text-slate-500 font-semibold">Radiation:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 capitalize">{hpi.radiation}</span>
                      {renderProvenanceBadge('hpi.radiation')}
                    </div>
                  </div>
                )}

                {/* Severity */}
                {hpi.severity !== null && hpi.severity !== undefined && (
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs text-slate-500 font-semibold">Severity (0-10):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {hpi.severity} / 10
                      </span>
                      {renderProvenanceBadge('hpi.severity')}
                    </div>
                  </div>
                )}

                {/* Associated Symptoms */}
                {Array.isArray(hpi.associated_symptoms) && hpi.associated_symptoms.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold">Associated Symptoms:</span>
                      {renderProvenanceBadge('hpi.associated_symptoms')}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hpi.associated_symptoms.map((sym, idx) => (
                        <span key={idx} className="bg-amber-50 border border-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-lg text-xs capitalize">
                          ⚠️ {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ReviewSection>

            {/* Legacy answers if available */}
            {concernFlow && concernFlow.questions && answers && typeof answers === 'object' && Object.keys(answers).length > 0 && (
              <ReviewSection 
                title="Interview Responses" 
                icon={<MessageSquare size={16} />}
                onEdit={() => editSection('/interview')}
              >
                <div className="flex flex-col gap-3 mt-1">
                  {concernFlow.questions.map((q) => {
                    const ans = answers[q.id];
                    if (ans === undefined || ans === null || ans === '') return null;
                    return (
                      <div key={q.id} className="flex flex-col gap-0.5 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{q.question}</span>
                        <span className="text-xs font-semibold text-slate-800">{Array.isArray(ans) ? ans.join(', ') : String(ans)}</span>
                      </div>
                    );
                  })}
                </div>
              </ReviewSection>
            )}

            {/* Medications */}
            <ReviewSection 
              title="Current Medications" 
              icon={<Pill size={16} />}
              onEdit={() => editSection('/documents')}
            >
              <div className="flex flex-wrap gap-1.5 mt-1">
                {medications.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No medications recorded</span>
                ) : (
                  medications.map((med, idx) => (
                    <span key={idx} className="bg-teal-50 border border-teal-100 text-teal-900 font-bold px-2.5 py-1 rounded-lg text-xs">
                      💊 {med}
                    </span>
                  ))
                )}
              </div>
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
              👨‍⚕️ Your doctor will review, adjust, and clinically confirm all information and audit trails during your consultation.
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

        {/* Modal: View Uploaded Documents */}
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

        {/* Modal: Physician-Ready JSON View with Audit Trail */}
        <Modal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          title="Physician-Ready Structured Summary & Audit Trail"
        >
          <div className="flex flex-col gap-3 max-h-[70vh] overflow-hidden">
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600 font-semibold">
                Clinical JSON representation for physician EMR integration:
              </span>
              <button
                type="button"
                onClick={handleCopySummary}
                className="flex items-center gap-1 text-xs font-bold text-teal-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50 cursor-pointer transition-all"
              >
                {copied ? <Check size={14} className="text-teal-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono max-h-[50vh]">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(physicianSummary, null, 2)}
              </pre>
            </div>

            <Button className="mt-2 w-full" onClick={() => setIsSummaryModalOpen(false)}>
              Close
            </Button>
          </div>
        </Modal>
      </PageContainer>
    </PatientLayout>
  );
};

export default Review;
