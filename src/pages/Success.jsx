import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { CheckCircle2, Ticket, Sparkles, RefreshCw } from 'lucide-react';

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
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 animate-scale-check">
            <CheckCircle2 size={44} className="stroke-[2.2]" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-white animate-bounce">
            <Sparkles size={10} className="fill-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="animate-fade-in delay-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-1.5">
            Your health information is ready!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
            Your case summary has been securely prepared and sent to your healthcare team.
          </p>
        </div>

        {/* Token Card */}
        <Card className="w-full border-teal-100 bg-teal-50/10 p-6 flex flex-col items-center gap-1.5 animate-fade-in delay-200">
          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-widest flex items-center gap-1">
            <Ticket size={12} />
            Your Queue Token
          </span>
          <span className="text-4xl font-extrabold text-teal-900 tracking-wider">
            A-104
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-1">
            Token generated successfully
          </span>
        </Card>

        {/* Next Steps */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-600 leading-relaxed text-left animate-fade-in delay-300">
          <span className="font-bold text-slate-800 block mb-1">
            Next Instruction:
          </span>
          Please wait in the reception lounge. Your doctor will review this intake summary before calling your token number.
        </div>

        {/* Restart Button */}
        <div className="w-full max-w-xs mt-4 animate-fade-in delay-400">
          <Button
            variant="secondary"
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-teal-700 font-semibold"
            onClick={handleStartOver}
            icon={<RefreshCw size={14} />}
          >
            Start New Check-in
          </Button>
        </div>

      </div>

      {/* Footer */}
      <span className="text-xs text-slate-400 font-semibold mt-10 animate-fade-in delay-500 select-none">
        💙 Thank you for using SehatNama.
      </span>
    </PageContainer>
  );
};

export default Success;
