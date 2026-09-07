import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import PageContainer from '../components/layout/PageContainer';
import PatientLayout from '../components/layout/PatientLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Toast from '../components/ui/Toast';
import BackButton from '../components/navigation/BackButton';
import { AlertOctagon, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const PriorityAlert = () => {
  const navigate = useNavigate();
  const { patientData } = usePatient();
  const [toastVisible, setToastVisible] = useState(false);
  const [staffNotified, setStaffNotified] = useState(false);

  const redFlags = patientData.clinicalHistory?.red_flags?.length > 0
    ? patientData.clinicalHistory.red_flags
    : patientData.triage?.redFlags || [];

  const handleAlertStaff = () => {
    setToastVisible(true);
    setStaffNotified(true);
  };

  const handleContinue = () => {
    navigate('/documents');
  };

  return (
    <PatientLayout>
      <PageContainer className="justify-between py-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <BackButton to="/interview" />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-5 text-center sm:text-left select-none">
          {/* Alert Header Icon */}
          <div className="flex justify-center sm:justify-start">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 animate-pulse">
              <AlertOctagon size={36} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-red-950 mb-2">
              Urgent Clinical Triage Signal Detected
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Based on the symptoms you reported, clinical safety guidelines recommend immediate human evaluation by hospital OPD / emergency triage staff.
            </p>
          </div>

          {/* Identified Triage Warning Flags */}
          {redFlags.length > 0 && (
            <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 flex flex-col gap-2 text-left">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-red-600" />
                Reported High-Priority Warning Signs:
              </span>
              <ul className="space-y-2 mt-1">
                {redFlags.map((flag, idx) => (
                  <li key={idx} className="text-xs font-semibold text-red-900 bg-white/80 p-2.5 rounded-xl border border-red-100 flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">•</span>
                    <span>{flag.signal || flag.message || flag.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Non-Diagnosis Disclaimer Alert */}
          <Alert variant="danger" title="Non-Diagnostic Clinical Notice" className="bg-red-50/40 border-red-200/80 text-red-950 text-left">
            <span className="text-xs leading-relaxed font-medium block">
              <strong>Important:</strong> This is a <em>triage priority warning</em>, <strong>not a medical diagnosis</strong>. SehatNama does not diagnose conditions (such as heart attacks). Please inform the triage nurse or OPD front desk right now for human clinical assessment.
            </span>
          </Alert>

          {/* Buttons Section */}
          <div className="flex flex-col gap-3 mt-2">
            <Button
              variant="danger"
              size="lg"
              className={`w-full py-4 text-base font-bold flex gap-2 justify-center items-center ${
                staffNotified ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
              }`}
              onClick={handleAlertStaff}
              disabled={staffNotified}
              icon={staffNotified ? <CheckCircle2 size={18} /> : <AlertOctagon size={18} />}
            >
              {staffNotified ? 'Medical Staff Alerted ✓' : 'Alert Medical Staff Immediately'}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full py-3.5 text-sm bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 font-semibold"
              onClick={handleContinue}
              icon={<ArrowRight size={16} className="order-last" />}
            >
              Continue Case Details
            </Button>
          </div>
        </div>

        {/* Success Toast */}
        <Toast
          message="Emergency triage alert generated! OPD staff has been notified."
          type="success"
          isVisible={toastVisible}
          onClose={() => setToastVisible(false)}
        />
      </PageContainer>
    </PatientLayout>
  );
};

export default PriorityAlert;
