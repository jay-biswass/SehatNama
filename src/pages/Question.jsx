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

  if (!flow) return null;

  const questions = flow.questions;
  const currentQuestion = questions[questionIndex];

  if (!currentQuestion) {
    return (
      <PatientLayout>
        <PageContainer className="justify-center items-center">
          <p className="text-slate-500 font-semibold">Question not found.</p>
          <Button onClick={() => navigate('/interview/concern')} className="mt-4">
            Return to Start
          </Button>
        </PageContainer>
      </PatientLayout>
    );
  }

  // Preload answer if it exists
  const existingAnswer = getAnswer(concernId, currentQuestion.id);
  // Using an internal state that syncs with context could be nice, but directly setting it is easier.
  // Actually, we need local state to manage the current input before hitting continue.
  const [answer, setAnswer] = useState(existingAnswer || (currentQuestion.type === 'scale' ? 5 : ''));

  useEffect(() => {
    const existing = getAnswer(concernId, currentQuestion.id);
    setAnswer(existing || (currentQuestion.type === 'scale' ? 5 : ''));
  }, [concernId, currentQuestion.id]);

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
          <AssistantMessage title="Sehat Assistant" className="mb-2">
            <span className="font-medium text-slate-700">
              {getAssistantMessage()}
            </span>
          </AssistantMessage>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-200/50 flex flex-col gap-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-800 leading-tight">
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

          <div className="mt-4">
            <Button
              size="lg"
              className="w-full py-3.5 text-sm"
              onClick={handleContinue}
              disabled={answer === '' || (Array.isArray(answer) && answer.length === 0)}
            >
              Continue
            </Button>
          </div>
        </div>
      </PageContainer>
    </PatientLayout>
  );
};

export default Question;
