import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import PriorityBadge from '../../components/doctor/PriorityBadge';
import StatusBadge from '../../components/doctor/StatusBadge';
import PatientInfoCard from '../../components/doctor/PatientInfoCard';
import InterviewAnswers from '../../components/doctor/InterviewAnswers';
import PriorityIndicators from '../../components/doctor/PriorityIndicators';
import MedicalDocuments from '../../components/doctor/MedicalDocuments';
import DoctorNotes from '../../components/doctor/DoctorNotes';
import doctorService from '../../services/doctorService';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Eye, 
  Printer, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

export const DoctorCaseDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const loadCase = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await doctorService.getCaseById(caseId);
      if (fetchError || !data) {
        setError(fetchError || 'Case details not found.');
      } else {
        setCaseData(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load case');
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    loadCase();
  }, [loadCase]);

  // Handle case status transitions
  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const { data, error: updateError } = await doctorService.updateCaseStatus(
        caseId,
        newStatus,
        profile || {}
      );

      if (updateError) {
        alert(`Failed to update status: ${updateError}`);
      } else {
        setCaseData(prev => ({
          ...prev,
          status: newStatus,
          reviewed_by: profile?.id,
          reviewed_at: new Date().toISOString()
        }));
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle saving private clinical note
  const handleSaveNote = async (noteText) => {
    setIsSavingNote(true);
    try {
      const { data, error: noteError } = await doctorService.saveDoctorNote(
        caseId,
        noteText,
        profile || {}
      );

      if (noteError) {
        alert(`Failed to save note: ${noteError}`);
        return false;
      }

      if (data) {
        setCaseData(prev => ({
          ...prev,
          notes: [data, ...(prev.notes || [])]
        }));
        return true;
      }
      return false;
    } finally {
      setIsSavingNote(false);
    }
  };

  const formatFullDate = (isoString) => {
    if (!isoString) return 'Not recorded';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return (
      <DoctorLayout>
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader message="Loading complete patient case records..." />
        </div>
      </DoctorLayout>
    );
  }

  if (error || !caseData) {
    return (
      <DoctorLayout>
        <div className="py-12 flex flex-col items-center justify-center text-center gap-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Case Record Error</h3>
          <p className="text-xs text-slate-500">{error || 'Case not found or access restricted.'}</p>
          <Button onClick={() => navigate('/doctor/cases')} icon={<ArrowLeft size={16} />} className="rounded-full">
            Back to Cases Queue
          </Button>
        </div>
      </DoctorLayout>
    );
  }

  const patient = caseData.patient || {};
  const shortCaseId = caseData.id?.length > 8 ? `SN-${caseData.id.substring(0, 8).toUpperCase()}` : caseData.id;

  // Parse raw description if human-readable string vs JSON summary
  let patientRawDescription = caseData.patient_description;
  if (patientRawDescription && patientRawDescription.startsWith('{')) {
    try {
      const parsed = JSON.parse(patientRawDescription);
      patientRawDescription = parsed.chief_complaint || parsed.clinicalHistory?.chief_complaint || 'Completed clinical intake';
    } catch {
      // Keep as-is
    }
  }

  return (
    <DoctorLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
        {/* Navigation & Top Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <Link
            to="/doctor/cases"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Case Queue</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Case Summary</span>
            </button>
          </div>
        </div>

        {/* Case Header Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Case ID: {shortCaseId}
              </span>
              <PriorityBadge priority={caseData.priority_level} size="sm" />
              <StatusBadge status={caseData.status} size="sm" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize tracking-tight mt-1">
              {caseData.chief_complaint ? caseData.chief_complaint.replace(/_/g, ' ') : 'General Medical Intake'}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                Submitted: {formatFullDate(caseData.submitted_at || caseData.created_at)}
              </span>
              {caseData.reviewed_at && (
                <>
                  <span>•</span>
                  <span>Reviewed: {formatFullDate(caseData.reviewed_at)}</span>
                </>
              )}
            </div>
          </div>

          {/* Workflow Status Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {caseData.status !== 'under_review' && caseData.status !== 'completed' && (
              <Button
                onClick={() => handleStatusChange('under_review')}
                disabled={isUpdatingStatus}
                size="md"
                variant="outline"
                className="text-xs font-bold border-amber-300 text-amber-900 bg-amber-50/60 hover:bg-amber-100 rounded-full px-5 py-2.5"
                icon={<Eye size={15} />}
              >
                {isUpdatingStatus ? 'Updating...' : 'Mark Under Review'}
              </Button>
            )}

            {caseData.status !== 'completed' && (
              <Button
                onClick={() => handleStatusChange('completed')}
                disabled={isUpdatingStatus}
                size="md"
                variant="primary"
                className="text-xs font-extrabold rounded-full px-6 py-2.5 shadow-md shadow-blue-500/20"
                icon={<CheckCircle size={15} />}
              >
                {isUpdatingStatus ? 'Updating...' : 'Mark Consultation Completed'}
              </Button>
            )}

            {caseData.status === 'completed' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-full">
                <CheckCircle size={16} />
                <span>Consultation Completed</span>
              </span>
            )}
          </div>
        </div>

        {/* 1. Priority / Triage Screening Banner */}
        <PriorityIndicators
          priority={caseData.priority_level}
          alerts={caseData.alerts}
        />

        {/* 2. Patient Demographics Profile Card */}
        <PatientInfoCard patient={patient} />

        {/* 3. Primary Health Concern & Patient's Own Words */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] flex flex-col gap-3.5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Chief Complaint & Patient's Description
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Initial statement reported directly by patient during intake
              </p>
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Primary Reported Problem:
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 capitalize block mb-2">
              {caseData.chief_complaint ? caseData.chief_complaint.replace(/_/g, ' ') : 'Unspecified'}
            </span>

            {patientRawDescription && (
              <div className="pt-3 border-t border-slate-200/60">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Patient's Stated Description:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed italic">
                  "{patientRawDescription}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Complete Patient Interview (SOCRATES Answers) */}
        <InterviewAnswers
          answers={caseData.answers}
          caseData={caseData}
        />

        {/* 5. Medical Documents & AI Extractions */}
        <MedicalDocuments
          documents={caseData.documents}
          caseData={caseData}
        />

        {/* 6. Private Clinical Doctor Notes */}
        <DoctorNotes
          notes={caseData.notes}
          onSaveNote={handleSaveNote}
          isSaving={isSavingNote}
          doctorProfile={profile || {}}
        />
      </div>
    </DoctorLayout>
  );
};

export default DoctorCaseDetails;
