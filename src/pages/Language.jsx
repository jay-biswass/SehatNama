import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { languages } from '../data/languages';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BackButton from '../components/navigation/BackButton';

export const Language = () => {
  const navigate = useNavigate();
  const { patientData, updatePatientData } = usePatient();

  const handleSelectLanguage = (langName) => {
    updatePatientData({ selectedLanguage: langName });
  };

  const handleContinue = () => {
    if (patientData.selectedLanguage) {
      navigate('/patient-details');
    }
  };

  return (
    <PageContainer className="justify-between py-6">
      {/* Navigation Row */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <BackButton to="/check-in" />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full gap-6">
        {/* Page Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            Choose your language
          </h2>
          <p className="text-sm text-slate-500">
            Select the language you are most comfortable speaking or reading.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-4 my-2">
          {languages.map((lang) => {
            const isSelected = patientData.selectedLanguage === lang.name;
            return (
              <Card
                key={lang.id}
                onClick={() => handleSelectLanguage(lang.name)}
                selected={isSelected}
                className={`flex flex-col items-center justify-center p-6 text-center select-none ${
                  isSelected 
                    ? 'border-teal-500 bg-teal-50/20 shadow-sm shadow-teal-500/10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-base font-bold text-slate-800 mb-0.5">
                  {lang.nativeName}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {lang.name}
                </span>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="w-full mt-2">
          <Button
            size="lg"
            className="w-full py-3.5 text-sm"
            onClick={handleContinue}
            disabled={!patientData.selectedLanguage}
          >
            Continue
          </Button>
        </div>
      </div>
      
      {/* Empty spacer footer for vertical balance */}
      <div className="h-6 shrink-0" />
    </PageContainer>
  );
};

export default Language;
