import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Checkbox from '../components/ui/Checkbox';
import BackButton from '../components/navigation/BackButton';
import { Activity, FileText, UserCheck, ShieldCheck } from 'lucide-react';

export const Consent = () => {
  const navigate = useNavigate();
  const { patientData, updatePatientData } = usePatient();
  const [checked, setChecked] = useState(patientData.consentAccepted || false);

  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleContinue = () => {
    if (checked) {
      updatePatientData({ consentAccepted: true });
      navigate('/interview/concern');
    }
  };

  return (
    <PageContainer className="justify-between py-6">
      {/* Navigation Row */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <BackButton to="/language" />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-5">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            Your privacy matters
          </h2>
          <p className="text-sm text-slate-500">
            Before we begin, please understand how your information will be used.
          </p>
        </div>

        {/* Information List */}
        <div className="flex flex-col gap-3.5">
          <div className="flex gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 mb-1">Understand your health concerns</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your answers help create a clear, structured summary of symptoms for your doctor to review.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 mb-1">Read your medical documents</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You can securely upload previous prescriptions and lab reports to help explain your medical history.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 mb-1">Support your doctor</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your doctor will review, edit, and verify all information before making any clinical decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Notice Alert */}
        <Alert variant="info" className="py-3 px-4">
          <span className="font-medium text-xs">
            <strong>Important Notice:</strong> SehatNama does not provide medical diagnoses or replace your doctor. It acts as an assistant to organize your case history.
          </span>
        </Alert>

        {/* Consent Checkbox */}
        <Checkbox
          id="consent-check"
          checked={checked}
          onChange={handleCheckboxChange}
        >
          <span className="font-semibold text-slate-800 block text-xs mb-0.5">I understand and agree to continue</span>
          <span className="text-[10px] text-slate-400 block leading-tight">
            I consent to sharing my answers and documents with my doctor.
          </span>
        </Checkbox>

        {/* Action Button */}
        <Button
          size="lg"
          className="w-full mt-1"
          onClick={handleContinue}
          disabled={!checked}
          icon={<ShieldCheck size={18} />}
        >
          I Agree & Continue
        </Button>
      </div>
    </PageContainer>
  );
};

export default Consent;
