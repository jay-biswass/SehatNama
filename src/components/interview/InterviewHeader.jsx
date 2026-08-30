import React from 'react';
import { usePatient } from '../../context/PatientContext';
import { Heart } from 'lucide-react';

export const InterviewHeader = ({ currentStepText }) => {
  const { patientData } = usePatient();

  return (
    <div className="bg-teal-50/80 border-b border-teal-100/60 px-6 py-3.5 flex items-center justify-between text-teal-800 shrink-0 select-none">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-teal-600 flex items-center justify-center text-white">
          <Heart size={12} className="fill-white stroke-teal-600" />
        </div>
        <span className="font-bold text-xs tracking-wide text-teal-900 uppercase">AI Health Assistant</span>
      </div>
      
      <div className="flex items-center gap-2 text-[10px]">
        {currentStepText && (
          <span className="bg-teal-100/80 text-teal-900 font-bold px-2 py-0.5 rounded">
            {currentStepText}
          </span>
        )}
        {patientData.selectedLanguage && (
          <span className="bg-white border border-teal-100 text-teal-800 font-medium px-2 py-0.5 rounded">
            {patientData.selectedLanguage}
          </span>
        )}
      </div>
    </div>
  );
};

export default InterviewHeader;
