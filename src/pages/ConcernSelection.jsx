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
  { id: 'weakness_fatigue', label: 'General Weakness or Fatigue', icon: '❤️\u200d🩹', desc: 'Feeling unusually tired, weak, or low on energy' },
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
    if (selectedConcern) {
      selectHealthConcern(selectedConcern, description);
      navigate('/interview/question/0');
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
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              What health concern brings you here today?
            </h2>
            <p className="text-sm text-slate-500">
              Please select the main problem you are experiencing. You can also describe it in your own words.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {healthConcerns.map(concern => (
              <Card
                key={concern.id}
                onClick={() => handleSelect(concern.id)}
                selected={selectedConcern === concern.id}
                className={`flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none transition-all ${
                  selectedConcern === concern.id 
                    ? 'border-teal-500 bg-teal-50/20 shadow-sm shadow-teal-500/10 scale-[1.02]' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-3xl mb-2">{concern.icon}</div>
                <span className="text-sm font-bold text-slate-800 mb-1">{concern.label}</span>
                <span className="text-xs text-slate-500 font-medium">{concern.desc}</span>
              </Card>
            ))}
          </div>

          <div className="mt-4 pt-6 border-t border-slate-100 flex flex-col gap-3">
            <h3 className="font-bold text-slate-800 text-sm">Or describe your problem (Optional)</h3>
            <div className="relative">
              <textarea
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 min-h-[100px] resize-none pr-14"
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

          <div className="mt-4">
            <Button
              size="lg"
              className="w-full py-4 text-base font-bold"
              onClick={handleContinue}
              disabled={!selectedConcern}
            >
              Continue
            </Button>
          </div>
        </div>
      </PageContainer>
    </PatientLayout>
  );
};

export default ConcernSelection;
