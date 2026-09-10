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
      <div className="flex items-center justify-between mb-2 shrink-0">
        <BackButton to="/check-in" />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full gap-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
            Choose your language
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Select the language you are most comfortable speaking or reading.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 my-2">
          {languages.map((lang) => {
            const isSelected = patientData.selectedLanguage === lang.name;
            return (
              <Card
                key={lang.id}
                onClick={() => handleSelectLanguage(lang.name)}
                selected={isSelected}
                className="flex flex-col items-center justify-center p-5 text-center select-none"
              >
                <span className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">
                  {lang.nativeName}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {lang.name}
                </span>
              </Card>
            );
          })}
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!patientData.selectedLanguage}
        >
          Continue
        </Button>
      </div>
      
      <div className="h-6 shrink-0" />
    </PageContainer>
  );
};

export default Language;
