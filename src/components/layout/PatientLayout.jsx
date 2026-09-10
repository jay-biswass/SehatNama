import React from 'react';
import { usePatient } from '../../context/PatientContext';

export const PatientLayout = ({ children }) => {
  const { patientData } = usePatient();
  
  return (
    <div className="flex-1 flex flex-col">
      {patientData.mobileNumber && (
        <div className="glass border-b border-[var(--color-border)] px-5 sm:px-8 py-2 flex items-center justify-between text-xs animate-fade-in shrink-0">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <span className="font-semibold text-[var(--color-text-primary)]">{patientData.patientName}</span>
            <span className="text-[var(--color-text-muted)]">•</span>
            <span>{patientData.patientName === 'Rahul Kumar' ? 'Male, 52 yrs' : ''}</span>
            <span className="text-[var(--color-text-muted)]">•</span>
            <span>+91 {patientData.mobileNumber}</span>
          </div>
          {patientData.selectedLanguage && (
            <div className="bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-semibold px-2 py-0.5 rounded-md text-[11px]">
              {patientData.selectedLanguage}
            </div>
          )}
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default PatientLayout;
