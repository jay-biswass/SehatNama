import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import PatientLayout from '../components/layout/PatientLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Toast from '../components/ui/Toast';
import BackButton from '../components/navigation/BackButton';
import { AlertOctagon, UserPlus, ArrowRight } from 'lucide-react';

export const PriorityAlert = () => {
  const navigate = useNavigate();
  const [toastVisible, setToastVisible] = useState(false);
  const [staffNotified, setStaffNotified] = useState(false);

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
          <BackButton to="/interview/question/4" />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-6 text-center sm:text-left select-none">
          {/* Alert Header Icon */}
          <div className="flex justify-center sm:justify-start">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 animate-bounce">
              <AlertOctagon size={36} className="stroke-[2.5]" />
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-red-950 mb-2">
              Priority medical attention may be needed
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Some of the symptoms you described (difficulty breathing) are considered warning flags that require immediate review by clinical staff.
            </p>
          </div>

          {/* Non-Diagnosis Disclaimer Alert */}
          <Alert variant="danger" title="Disclaimer" className="bg-red-50/50 border-red-200/60 text-red-950 text-left">
            <span className="text-xs leading-relaxed font-medium">
              This is <strong>not</strong> a diagnosis. A healthcare professional should assess your symptoms as soon as possible. Please inform our front desk immediately.
            </span>
          </Alert>

          {/* Buttons Section */}
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="danger"
              size="lg"
              className={`w-full py-4 text-base font-bold flex gap-2 justify-center items-center ${
                staffNotified ? 'opacity-80' : ''
              }`}
              onClick={handleAlertStaff}
              disabled={staffNotified}
              icon={<AlertOctagon size={18} />}
            >
              {staffNotified ? 'Staff Alerted ✓' : 'Alert Medical Staff'}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full py-3.5 text-sm bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 font-semibold"
              onClick={handleContinue}
              icon={<ArrowRight size={16} className="order-last" />}
            >
              Continue Case Information
            </Button>
          </div>
        </div>

        {/* Success Toast */}
        <Toast
          message="Emergency alert sent! Medical staff has been notified."
          type="success"
          isVisible={toastVisible}
          onClose={() => setToastVisible(false)}
        />
      </PageContainer>
    </PatientLayout>
  );
};

export default PriorityAlert;
