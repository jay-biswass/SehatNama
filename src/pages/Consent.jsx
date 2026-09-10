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

  const infoItems = [
    { icon: <Activity size={18} />, title: 'Understand your health concerns', desc: 'Your answers help create a clear, structured summary of symptoms for your doctor to review.' },
    { icon: <FileText size={18} />, title: 'Read your medical documents', desc: 'Securely upload previous prescriptions and lab reports to help explain your medical history.' },
    { icon: <UserCheck size={18} />, title: 'Support your doctor', desc: 'Your doctor will review, edit, and verify all information before making any clinical decisions.' },
  ];

  return (
    <PageContainer className="justify-between py-6">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <BackButton to="/language" />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-5">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
            Your privacy matters
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Before we begin, please understand how your information will be used.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {infoItems.map((item, i) => (
            <div key={i} className="flex gap-3.5 p-4 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-xs)]">
              <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--color-primary-muted)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)] mb-0.5">{item.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Alert variant="info">
          <span className="text-xs">
            <strong>Important:</strong> SehatNama does not provide medical diagnoses or replace your doctor. It acts as an assistant to organize your case history.
          </span>
        </Alert>

        <Checkbox
          id="consent-check"
          checked={checked}
          onChange={handleCheckboxChange}
        >
          <span className="font-semibold text-[var(--color-text-primary)] block text-xs mb-0.5">I understand and agree to continue</span>
          <span className="text-[10px] text-[var(--color-text-muted)] block leading-tight">
            I consent to sharing my answers and documents with my doctor.
          </span>
        </Checkbox>

        <Button
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!checked}
          icon={<ShieldCheck size={16} />}
        >
          I Agree & Continue
        </Button>
      </div>
    </PageContainer>
  );
};

export default Consent;
