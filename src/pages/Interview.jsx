import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import PageContainer from '../components/layout/PageContainer';
import PatientLayout from '../components/layout/PatientLayout';
import InterviewHeader from '../components/interview/InterviewHeader';
import AssistantMessage from '../components/interview/AssistantMessage';
import VoiceButton from '../components/interview/VoiceButton';
import AnswerInput from '../components/interview/AnswerInput';
import BackButton from '../components/navigation/BackButton';

export const Interview = () => {
  const navigate = useNavigate();
  const { patientData, updatePatientData } = usePatient();
  
  const [complaintText, setComplaintText] = useState(patientData.chiefComplaint || '');
  const [isListening, setIsListening] = useState(false);

  const handleTranscription = (text) => {
    setComplaintText(text);
    // Simulating small delay before moving forward to show completion state
    setTimeout(() => {
      updatePatientData({ chiefComplaint: text });
      navigate('/interview/question/1');
    }, 1000);
  };

  const handleVoiceStateChange = (state) => {
    setIsListening(state === 'listening' || state === 'processing');
  };

  const handleTextSubmit = () => {
    if (complaintText.trim()) {
      updatePatientData({ chiefComplaint: complaintText });
      navigate('/interview/question/1');
    }
  };

  const handleFillMock = () => {
    setComplaintText('I have chest pain.');
  };

  return (
    <PatientLayout>
      <InterviewHeader currentStepText="Initial Intake" />
      
      <PageContainer className="justify-between py-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <BackButton to="/consent" />
        </div>

        {/* Chat Feed */}
        <div className="flex-1 flex flex-col gap-6 max-w-md mx-auto w-full justify-center">
          <div className="flex flex-col gap-4">
            <AssistantMessage title="Sehat Assistant">
              <span className="font-semibold text-slate-800 block mb-1">
                Hello! I'm Sehat, your health assistant.
              </span>
              <span className="text-3xl font-bold text-slate-900 block my-3 tracking-tight">
                How can I help you today?
              </span>
              <span className="text-slate-500 block text-xs leading-relaxed mt-2 font-medium">
                Please tell me what health problem you are experiencing. You can type it below, or tap the microphone to speak naturally in your selected language.
              </span>
            </AssistantMessage>
          </div>

          {/* Voice Input Section */}
          <div className="py-6 border-y border-slate-100 flex justify-center items-center">
            <VoiceButton
              onTranscription={handleTranscription}
              onStateChange={handleVoiceStateChange}
              disabled={isListening}
            />
          </div>

          {/* Text Input Section */}
          <div className="mt-auto">
            <AnswerInput
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              onSubmit={handleTextSubmit}
              onFillMock={handleFillMock}
              placeholder="Type your concern here (e.g. chest pain)..."
              disabled={isListening}
            />
          </div>
        </div>
      </PageContainer>
    </PatientLayout>
  );
};

export default Interview;
