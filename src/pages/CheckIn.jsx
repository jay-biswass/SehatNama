import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Phone, ShieldAlert, Award } from 'lucide-react';

export const CheckIn = () => {
  const navigate = useNavigate();
  const { patientData, updatePatientData } = usePatient();
  
  const [mobileNumber, setMobileNumber] = useState(patientData.mobileNumber || '');
  const [error, setError] = useState('');

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // digit only
    if (val.length <= 10) {
      setMobileNumber(val);
      setError('');
    }
  };

  const handleMobileContinue = (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    updatePatientData({ mobileNumber }); // Removed hardcoded default name
    navigate('/language');
  };

  const handleAbhaContinue = () => {
    updatePatientData({ mobileNumber: '9876543210', patientName: 'Rahul Kumar' }); // Mock values
    navigate('/language');
  };

  return (
    <PageContainer className="justify-between py-6">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
            Let's identify you
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            This helps us prepare the right health record for your consultation.
          </p>
        </div>

        {/* Mobile Number form */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-[var(--color-primary)]" />
            <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">Mobile Number Check-in</h3>
          </div>
          
          <form onSubmit={handleMobileContinue} className="flex flex-col gap-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm font-medium select-none">
                +91
              </span>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={handleMobileChange}
                className="w-full pl-11 pr-3 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-bg-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] focus:bg-white text-sm transition-all"
              />
            </div>
            
            {error && (
              <span className="text-xs text-[var(--color-danger)] font-medium">{error}</span>
            )}
            
            <Button type="submit" disabled={mobileNumber.length !== 10} className="w-full">
              Continue
            </Button>
          </form>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-text-muted)] select-none">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span>OR</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        {/* ABHA Health ID */}
        <Card className="flex flex-col gap-3 bg-[var(--color-primary-light)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-[var(--color-primary)]" />
              <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">Use ABHA Health ID</h3>
            </div>
            <span className="text-[10px] font-semibold bg-[var(--color-primary-muted)] text-[var(--color-primary)] px-2 py-0.5 rounded-md uppercase tracking-wider">
              Govt of India
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Connect your existing digital health record under the Ayushman Bharat Digital Mission (ABDM).
          </p>
          <Button variant="secondary" className="w-full" onClick={handleAbhaContinue}>
            Continue with ABHA
          </Button>
        </Card>
      </div>

      {/* Footer */}
      <div className="flex items-start gap-2 max-w-md mx-auto mt-6 text-[11px] text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)] pt-4 shrink-0">
        <ShieldAlert size={14} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
        <span>
          Your health information is handled securely and only used for your healthcare consultation. We adhere to ABDM privacy guidelines.
        </span>
      </div>
    </PageContainer>
  );
};

export default CheckIn;
