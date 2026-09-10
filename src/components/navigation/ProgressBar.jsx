import React from 'react';
import { useLocation } from 'react-router-dom';

export const ProgressBar = () => {
  const location = useLocation();
  const path = location.pathname;

  const steps = [
    { label: 'Patient ID', paths: ['/check-in'] },
    { label: 'Language', paths: ['/language'] },
    { label: 'Consent', paths: ['/consent'] },
    { label: 'Interview', paths: ['/interview', '/concerns'] },
    { label: 'Review', paths: ['/documents', '/priority-alert', '/review'] },
  ];

  let currentStep = 0;
  steps.forEach((step, index) => {
    if (step.paths.some(p => path.startsWith(p))) {
      currentStep = index;
    }
  });

  return (
    <div className="px-5 sm:px-8 py-3 border-b border-[var(--color-border)] shrink-0 select-none bg-[var(--color-bg-elevated)]">
      <div className="flex items-center gap-1">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <React.Fragment key={step.label}>
              {/* Step dot + label */}
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-[var(--color-primary)]' :
                  isActive ? 'bg-[var(--color-primary)] ring-[3px] ring-[var(--color-primary)]/15' :
                  'bg-slate-200'
                }`} />
                <span className={`text-[11px] font-medium transition-colors hidden sm:inline ${
                  isCompleted ? 'text-[var(--color-primary)]' :
                  isActive ? 'text-[var(--color-text-primary)] font-semibold' :
                  'text-[var(--color-text-muted)]'
                }`}>
                  {step.label}
                </span>
              </div>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px transition-colors duration-300 ${
                  isCompleted ? 'bg-[var(--color-primary)]' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
