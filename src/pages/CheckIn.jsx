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
    updatePatientData({ mobileNumber, patientName: 'Rahul Kumar' }); // default name
    navigate('/language');
  };

  const handleAbhaContinue = () => {
    updatePatientData({ mobileNumber: '9876543210', patientName: 'Rahul Kumar' }); // Mock values
    navigate('/language');
  };

  return (
    <PageContainer className="justify-between py-6">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-6">
        {/* Header Section */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            Let's identify you
          </h2>
          <p className="text-sm text-slate-500">
            This helps us prepare the right health record for your consultation.
          </p>
        </div>

        {/* Option 1: Mobile Number form */}
        <Card className="flex flex-col gap-4 border-slate-200">
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-teal-600" />
            <h3 className="font-bold text-sm text-slate-800">Mobile Number Check-in</h3>
          </div>
          
          <form onSubmit={handleMobileContinue} className="flex flex-col gap-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold select-none">
                +91
              </span>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={handleMobileChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm transition-all font-medium"
              />
            </div>
            
            {error && (
              <span className="text-xs text-red-500 font-semibold">{error}</span>
            )}
            
            <Button
              type="submit"
              disabled={mobileNumber.length !== 10}
              className="w-full mt-1"
            >
              Continue
            </Button>
          </form>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 select-none">
          <div className="flex-1 h-[1px] bg-slate-200" />
          <span>OR</span>
          <div className="flex-1 h-[1px] bg-slate-200" />
        </div>

        {/* Option 2: ABHA Health ID */}
        <Card className="flex flex-col gap-4 border-teal-100 bg-teal-50/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-teal-600" />
              <h3 className="font-bold text-sm text-teal-900">Use ABHA Health ID</h3>
            </div>
            <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Govt of India
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Connect your existing digital health record securely under the Ayushman Bharat Digital Mission (ABDM).
          </p>
          <Button
            variant="secondary"
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-teal-700 font-semibold"
            onClick={handleAbhaContinue}
          >
            Continue with ABHA
          </Button>
        </Card>
      </div>

      {/* Footer */}
      <div className="flex items-start gap-2.5 max-w-md mx-auto mt-6 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-4 shrink-0">
        <ShieldAlert size={16} className="text-teal-600 shrink-0 mt-0.5" />
        <span>
          Your health information is handled securely and only used for your healthcare consultation. We adhere to ABDM privacy guidelines.
        </span>
      </div>
    </PageContainer>
  );
};

export default CheckIn;
