import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';

import PageContainer from '../components/layout/PageContainer';
import PatientLayout from '../components/layout/PatientLayout';
import InterviewHeader from '../components/interview/InterviewHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BackButton from '../components/navigation/BackButton';
import VoiceButton from '../components/interview/VoiceButton';

const healthConcerns = [
  { id: 'chest_pain', label: 'Chest Pain', icon: '❤️', desc: 'Pain, pressure, tightness, or discomfort in the chest' },
  { id: 'headache', label: 'Headache', icon: '🧠', desc: 'Head pain, migraine, pressure, or dizziness' },
  { id: 'abdominal_pain', label: 'Abdominal Pain', icon: '🤕', desc: 'Stomach pain, cramps, or discomfort' },
  { id: 'fever', label: 'Fever', icon: '🌡️', desc: 'High temperature, chills, or feeling feverish' },
  { id: 'cough', label: 'Cough', icon: '🫁', desc: 'Dry cough, mucus, or persistent coughing' },
  { id: 'difficulty_breathing', label: 'Difficulty Breathing', icon: '🫁', desc: 'Shortness of breath or trouble breathing' },
  { id: 'nausea_vomiting', label: 'Nausea or Vomiting', icon: '🤢', desc: 'Feeling sick or vomiting' },
  { id: 'body_joint_pain', label: 'Body or Joint Pain', icon: '🦴', desc: 'Muscle pain, body ache, or joint discomfort' },
  { id: 'skin_problem', label: 'Skin Problem', icon: '🩸', desc: 'Rash, itching, swelling, or other skin concerns' },
  { id: 'weakness_fatigue', label: 'General Weakness or Fatigue', icon: '❤️‍🩹', desc: 'Feeling unusually tired, weak, or low on energy' },
  { id: 'other', label: 'Other Health Concern', icon: '➕', desc: 'Describe another health problem' }
];

export const ConcernSelection = () => {
  const navigate = useNavigate();
  const { patientData, selectHealthConcern, updatePatientDescription } = usePatient();

  const [selectedConcern, setSelectedConcern] = useState(patientData.selectedConcern || null);
  const [description, setDescription] = useState(patientData.patientDescription || '');
  const [isListening, setIsListening] = useState(false);

  const handleSelect = (id) => {
    setSelectedConcern(id);
  };

  const handleContinue = () => {
    if (selectedConcern || description.trim()) {
      selectHealthConcern(selectedConcern || 'chest_pain', description);
      navigate('/interview');
    }
  };

  const handleTranscription = (text) => {
    setDescription(prev => prev ? `${prev} ${text}` : text);
  };

  const handleVoiceStateChange = (state) => {
    setIsListening(state === 'listening' || state === 'processing');
  };

  return (
    <PatientLayout>
      <InterviewHeader currentStepText="Initial Intake" />
      
      <PageContainer className="justify-between py-6">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <BackButton to="/consent" />
        </div>

        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full gap-6 pb-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
              What health concern brings you here today?
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Select the main problem you are experiencing, or describe it in your own words.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {healthConcerns.map(concern => (
              <Card
                key={concern.id}
                onClick={() => handleSelect(concern.id)}
                selected={selectedConcern === concern.id}
                className="flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none"
              >
                <div className="text-2xl mb-1.5">{concern.icon}</div>
                <span className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">{concern.label}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{concern.desc}</span>
              </Card>
            ))}
          </div>

          <div className="mt-2 pt-5 border-t border-[var(--color-border)] flex flex-col gap-3">
            <h3 className="font-semibold text-[var(--color-text-primary)] text-sm">Or describe your problem (Optional)</h3>
            <div className="relative">
              <textarea
                className="w-full px-3.5 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] focus:bg-white min-h-[90px] resize-none pr-14 transition-all"
                placeholder="For example: I have been having chest pain since this morning."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isListening}
              />
              <div className="absolute right-2 bottom-2">
                <VoiceButton
                  onTranscription={handleTranscription}
                  onStateChange={handleVoiceStateChange}
                  disabled={isListening}
                />
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleContinue}
            disabled={!selectedConcern}
          >
            Continue
          </Button>
        </div>
      </PageContainer>
    </PatientLayout>
  );
};

export default ConcernSelection;
