import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { healthQuestionFlows } from '../data/healthQuestionFlows';

import PageContainer from '../components/layout/PageContainer';
import PatientLayout from '../components/layout/PatientLayout';
import InterviewHeader from '../components/interview/InterviewHeader';
import AssistantMessage from '../components/interview/AssistantMessage';
import DynamicQuestion from '../components/interview/DynamicQuestion';
import Button from '../components/ui/Button';
import BackButton from '../components/navigation/BackButton';

export const Question = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patientData, saveAnswer, getAnswer, evaluateRedFlags } = usePatient();

  const concernId = patientData.selectedConcern;
  const flow = concernId ? healthQuestionFlows[concernId] : null;
  const questionIndex = parseInt(id, 10) || 0;

  useEffect(() => {
    if (!concernId || !flow) {
      navigate('/interview/concern');
    }
  }, [concernId, flow, navigate]);

  const questions = flow?.questions || [];
  const currentQuestion = questions[questionIndex];
  const questionId = currentQuestion?.id;
  const questionType = currentQuestion?.type;

  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (concernId && questionId) {
      const existing = getAnswer(concernId, questionId);
      setAnswer(existing || (questionType === 'scale' ? 5 : ''));
    }
  }, [concernId, questionId, questionType, getAnswer]);

  if (!flow) return null;

  if (!currentQuestion) {
    return (
      <PatientLayout>
        <PageContainer className="justify-center items-center">
          <p className="text-[var(--color-text-secondary)] font-medium">Question not found.</p>
          <Button onClick={() => navigate('/interview/concern')} className="mt-4">
            Return to Start
          </Button>
        </PageContainer>
      </PatientLayout>
    );
  }

  const handleContinue = () => {
    if (answer === '' || (Array.isArray(answer) && answer.length === 0)) return;

    // Save answer
    saveAnswer(concernId, currentQuestion.id, answer);

    // If it's the last question, evaluate red flags and route
    if (questionIndex >= questions.length - 1) {
      const isRedFlag = evaluateRedFlags();
      if (isRedFlag) {
        navigate('/priority-alert');
      } else {
        navigate('/documents');
      }
    } else {
      // Go to next question
      navigate(`/interview/question/${questionIndex + 1}`);
    }
  };

  const handleBack = () => {
    if (questionIndex === 0) {
      navigate('/interview/concern');
    } else {
      navigate(`/interview/question/${questionIndex - 1}`);
    }
  };

  const getAssistantMessage = () => {
    if (questionIndex === 0) {
      return flow.intro || "Let's gather some details to help your doctor.";
    }
    return `Question ${questionIndex + 1} of ${questions.length}`;
  };

  return (
    <PatientLayout>
      <InterviewHeader currentStepText={`Question ${questionIndex + 1} of ${questions.length}`} />
      
      <PageContainer className="justify-between py-6">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <BackButton onClick={handleBack} />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-5">
          <AssistantMessage title="Sehat Assistant" className="mb-1">
            <span className="font-medium text-[var(--color-text-secondary)]">
              {getAssistantMessage()}
            </span>
          </AssistantMessage>

          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] flex flex-col gap-5 animate-fade-in">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] leading-snug">
              {currentQuestion.question}
            </h3>

            <div className="flex flex-col">
              <DynamicQuestion
                question={currentQuestion}
                value={answer}
                onChange={setAnswer}
              />
            </div>
          </div>

          <Button
            size="lg"
            className="w-full mt-2"
            onClick={handleContinue}
            disabled={answer === '' || (Array.isArray(answer) && answer.length === 0)}
          >
            Continue
          </Button>
        </div>
      </PageContainer>
    </PatientLayout>
  );
};

export default Question;
