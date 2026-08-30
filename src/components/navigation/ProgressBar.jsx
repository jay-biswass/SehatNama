import React from 'react';
import { useLocation } from 'react-router-dom';

export const ProgressBar = () => {
  const location = useLocation();
  const path = location.pathname;

  let currentStep = 1;
  let stepLabel = 'Identification';

  if (path.startsWith('/check-in')) {
    currentStep = 1;
    stepLabel = 'Patient Identification';
  } else if (path.startsWith('/language')) {
    currentStep = 2;
    stepLabel = 'Choose Language';
  } else if (path.startsWith('/consent')) {
    currentStep = 3;
    stepLabel = 'Consent & Privacy';
  } else if (path.startsWith('/interview')) {
    currentStep = 4;
    stepLabel = 'AI Health Interview';
  } else if (path.startsWith('/documents') || path.startsWith('/priority-alert')) {
    currentStep = 5;
    stepLabel = 'Upload Documents';
  } else if (path.startsWith('/review')) {
    currentStep = 5;
    stepLabel = 'Review & Submit';
  }

  const percentage = (currentStep / 5) * 100;

  return (
    <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100 shrink-0 select-none">
      <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-500">
        <span className="text-teal-700 font-semibold uppercase tracking-wider">Step {currentStep} of 5</span>
        <span className="text-slate-600 font-semibold">{stepLabel}</span>
      </div>
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div 
          className="bg-teal-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
