import React from 'react';
import { usePatient } from '../../context/PatientContext';

export const PatientLayout = ({ children }) => {
  const { patientData } = usePatient();
  
  return (
    <div className="flex-1 flex flex-col">
      {patientData.mobileNumber && (
        <div className="bg-teal-50/60 border-b border-teal-100/60 px-6 py-2.5 flex items-center justify-between text-xs text-teal-800 animate-fade-in shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-teal-900">{patientData.patientName}</span>
            <span className="text-teal-300">•</span>
            <span>{patientData.patientName === 'Rahul Kumar' ? 'Male, 52 yrs' : ''}</span>
            <span className="text-teal-300">•</span>
            <span>+91 {patientData.mobileNumber}</span>
          </div>
          {patientData.selectedLanguage && (
            <div className="bg-teal-100/80 text-teal-900 font-medium px-2 py-0.5 rounded-md">
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
