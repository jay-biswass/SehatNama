import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { questions } from '../data/questions';
import PageContainer from '../components/layout/PageContainer';
import PatientLayout from '../components/layout/PatientLayout';
import InterviewHeader from '../components/interview/InterviewHeader';
import AssistantMessage from '../components/interview/AssistantMessage';
import QuestionCard from '../components/interview/QuestionCard';
import VoiceButton from '../components/interview/VoiceButton';
import Button from '../components/ui/Button';
import BackButton from '../components/navigation/BackButton';

export const Question = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patientData, addAnswer } = usePatient();

  const questionId = parseInt(id, 10);
  const currentQuestion = questions.find((q) => q.id === questionId);

  const [selectedOption, setSelectedOption] = useState('');
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Load existing answer if patient is navigating back/forward
  useEffect(() => {
    if (patientData.answers && patientData.answers[questionId]) {
      setSelectedOption(patientData.answers[questionId]);
    } else {
      setSelectedOption('');
    }
    setShowVoicePanel(false);
  }, [questionId, patientData.answers]);

  if (!currentQuestion) {
    return (
      <PatientLayout>
        <PageContainer className="justify-center items-center">
          <p className="text-slate-500 font-semibold">Question not found.</p>
          <Button onClick={() => navigate('/interview')} className="mt-4">
            Return to Interview
          </Button>
        </PageContainer>
      </PatientLayout>
    );
  }

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (!selectedOption) return;

    // Save answer
    addAnswer(questionId, selectedOption);

    // Routing Logic
    if (questionId === 4) {
      if (selectedOption === 'Yes, I have difficulty breathing') {
        navigate('/priority-alert');
      } else {
        navigate('/documents');
      }
    } else {
      navigate(`/interview/question/${questionId + 1}`);
    }
  };

  const handleBack = () => {
    if (questionId === 1) {
      navigate('/interview');
    } else {
      navigate(`/interview/question/${questionId - 1}`);
    }
  };

  // Mock voice transcription for this question
  const handleVoiceTranscription = (text) => {
    // Select an option based on voice simulation
    let matchedOption = currentQuestion.options[0]; // fallback default
    if (questionId === 1) matchedOption = 'Left side of the chest';
    if (questionId === 2) matchedOption = 'Severe (7-8 / 10)';
    if (questionId === 3) matchedOption = 'Since this morning';
    if (questionId === 4) matchedOption = 'Yes, I have difficulty breathing';

    setSelectedOption(matchedOption);
    setShowVoicePanel(false);
  };

  const getAssistantMessage = () => {
    if (questionId === 1) {
      return `I understand that you're experiencing ${patientData.chiefComplaint || 'chest pain'}. Let's pinpoint the details.`;
    }
    if (questionId === 2) {
      return `Thank you for specifying. Next, let's understand how intense this pain is for you.`;
    }
    if (questionId === 3) {
      return `Knowing when it started helps our clinical team evaluate the progression.`;
    }
    if (questionId === 4) {
      return `Finally, let's check for any associated symptoms that need immediate attention.`;
    }
    return "Let's answer a few quick questions to help your doctor.";
  };

  return (
    <PatientLayout>
      <InterviewHeader currentStepText={`Question ${questionId} of 4`} />
      
      <PageContainer className="justify-between py-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <BackButton onClick={handleBack} />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-5">
          {/* AI Helper Context */}
          <AssistantMessage title="Sehat Assistant" className="mb-2">
            <span className="font-medium text-slate-700">
              {getAssistantMessage()}
            </span>
          </AssistantMessage>

          {/* Question Card */}
          {!showVoicePanel ? (
            <QuestionCard
              questionText={currentQuestion.question}
              options={currentQuestion.options}
              selectedOption={selectedOption}
              onSelectOption={handleSelectOption}
            />
          ) : (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center animate-fade-in flex flex-col gap-4 py-8">
              <h3 className="font-bold text-slate-800 text-sm">Voice Answer mode</h3>
              <p className="text-xs text-slate-500">
                Tap the mic below and describe your answer in detail.
              </p>
              <div className="py-4 flex justify-center">
                <VoiceButton
                  onTranscription={handleVoiceTranscription}
                  onStateChange={(state) => setIsVoiceActive(state === 'listening' || state === 'processing')}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-600"
                onClick={() => setShowVoicePanel(false)}
                disabled={isVoiceActive}
              >
                Cancel and use taps
              </Button>
            </div>
          )}

          {/* Voice Alternative Trigger */}
          {!showVoicePanel && (
            <button
              type="button"
              onClick={() => setShowVoicePanel(true)}
              className="text-teal-700 hover:text-teal-900 font-bold text-xs flex items-center justify-center gap-1.5 py-2 cursor-pointer border border-teal-100/50 hover:bg-teal-50/30 rounded-xl"
            >
              🎤 Speak your answer instead
            </button>
          )}

          {/* Action Row */}
          {!showVoicePanel && (
            <div className="mt-4">
              <Button
                size="lg"
                className="w-full py-3.5 text-sm"
                onClick={handleContinue}
                disabled={!selectedOption}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </PageContainer>
    </PatientLayout>
  );
};

export default Question;
