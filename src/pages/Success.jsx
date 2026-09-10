import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { CheckCircle2, Ticket, RefreshCw } from 'lucide-react';

export const Success = () => {
  const navigate = useNavigate();
  const { resetPatientData } = usePatient();

  const handleStartOver = () => {
    resetPatientData();
    navigate('/');
  };

  return (
    <PageContainer className="justify-between py-10 text-center items-center">
      <div className="flex-1 flex flex-col justify-center items-center max-w-sm w-full gap-6 select-none">
        
        {/* Animated Checkmark */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[var(--color-success)] animate-scale-check">
          <CheckCircle2 size={36} className="stroke-[2]" />
        </div>

        {/* Heading */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1.5">
            Your health information is ready!
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-[280px] mx-auto">
            Your case summary has been securely prepared and sent to your healthcare team.
          </p>
        </div>

        {/* Token Card */}
        <Card className="w-full bg-[var(--color-primary-light)] p-5 flex flex-col items-center gap-1.5 animate-fade-in">
          <span className="text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-widest flex items-center gap-1">
            <Ticket size={11} />
            Your Queue Token
          </span>
          <span className="text-3xl font-bold text-[var(--color-text-primary)] tracking-wider">
            A-104
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)]">
            Token generated successfully
          </span>
        </Card>

        {/* Next Steps */}
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 text-xs text-[var(--color-text-secondary)] leading-relaxed text-left shadow-[var(--shadow-xs)] animate-fade-in">
          <span className="font-semibold text-[var(--color-text-primary)] block mb-1">
            Next:
          </span>
          Please wait in the reception lounge. Your doctor will review this intake summary before calling your token number.
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-xs flex flex-col gap-2.5 animate-fade-in">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              resetPatientData();
              navigate('/patient/dashboard');
            }}
          >
            Track in Patient Dashboard
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleStartOver}
            icon={<RefreshCw size={14} />}
          >
            Start New Check-in
          </Button>
        </div>

      </div>

      <span className="text-xs text-[var(--color-text-muted)] mt-8 animate-fade-in select-none">
        Thank you for using SehatNama.
      </span>
    </PageContainer>
  );
};

export default Success;
