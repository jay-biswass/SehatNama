import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { calculateSOCRATESProgress } from '../data/clinicalHistorySchema';
import ttsService from '../services/ttsService';

import PageContainer from '../components/layout/PageContainer';
import PatientLayout from '../components/layout/PatientLayout';
import InterviewHeader from '../components/interview/InterviewHeader';
import AssistantMessage from '../components/interview/AssistantMessage';
import VoiceButton from '../components/interview/VoiceButton';
import AnswerInput from '../components/interview/AnswerInput';
import BackButton from '../components/navigation/BackButton';
import Button from '../components/ui/Button';
import { 
  AlertOctagon, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Radio
} from 'lucide-react';

export const Interview = () => {
  const navigate = useNavigate();
  const {
    patientData,
    updatePatientData,
    initConversationalIntake,
    handlePatientMessage,
    skipCurrentQuestion
  } = usePatient();

  const [inputText, setInputText] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isTtsMuted, setIsTtsMuted] = useState(ttsService.isMuted());
  const [isTtsSpeaking, setIsTtsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const lastSpokenMsgIdRef = useRef(null);

  const conversation = patientData.conversation || { messages: [], language: 'hi' };
  const messages = conversation.messages || [];
  const currentLang = patientData.selectedLanguage || conversation.language || 'hi';

  // Initialize conversational intake on mount if not yet started
  useEffect(() => {
    if (messages.length === 0) {
      initConversationalIntake(patientData.selectedConcern, patientData.patientDescription);
    }
  }, []);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, conversation.isProcessing]);

  // Voice-First TTS: Speak assistant messages automatically
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];

    if (lastMsg && lastMsg.role === 'assistant' && lastMsg.id !== lastSpokenMsgIdRef.current) {
      lastSpokenMsgIdRef.current = lastMsg.id;
      ttsService.speak(lastMsg.text, {
        language: currentLang,
        onStart: () => setIsTtsSpeaking(true),
        onEnd: () => setIsTtsSpeaking(false),
        onError: () => setIsTtsSpeaking(false)
      });
    }
  }, [messages, currentLang]);

  // Stop speech synthesis on component unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  // Monitor for emergency triage trigger
  useEffect(() => {
    if (patientData.emergencyAlertTriggered || conversation.status === 'alert') {
      const timer = setTimeout(() => {
        navigate('/priority-alert');
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [patientData.emergencyAlertTriggered, conversation.status, navigate]);

  const handleSendText = async () => {
    if (!inputText.trim() || conversation.isProcessing) return;
    const textToSend = inputText;
    setInputText('');
    await handlePatientMessage(textToSend, 'text');
  };

  const handleVoiceTranscription = async (transcript) => {
    if (!transcript.trim()) return;
    await handlePatientMessage(transcript, 'voice');
  };

  const handleTouchOption = async (optionValue) => {
    if (conversation.isProcessing) return;
    await handlePatientMessage(optionValue, 'touch');
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === 'hi' ? 'en' : 'hi';
    updatePatientData({ selectedLanguage: nextLang });
  };

  const handleToggleMute = () => {
    const nextState = ttsService.toggleMute();
    setIsTtsMuted(nextState);
  };

  const handleRepeatSpeech = () => {
    ttsService.repeat();
  };

  const handleSpeakSpecificText = (text) => {
    ttsService.speak(text, {
      language: currentLang,
      onStart: () => setIsTtsSpeaking(true),
      onEnd: () => setIsTtsSpeaking(false),
      onError: () => setIsTtsSpeaking(false)
    });
  };

  // Get current SOCRATES progress
  const progress = calculateSOCRATESProgress(patientData.clinicalHistory);

  // Extract touch options from latest assistant message
  const lastMessage = messages[messages.length - 1];
  const activeOptions = (!conversation.isProcessing && lastMessage?.role === 'assistant' && Array.isArray(lastMessage.options))
    ? lastMessage.options
    : [];

  return (
    <PatientLayout>
      <InterviewHeader currentStepText={`Clinical Intake (${progress.percentage}%)`} />

      <PageContainer className="justify-between py-4 max-w-2xl mx-auto flex flex-col h-[calc(100vh-80px)]">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between gap-2 shrink-0 pb-3 border-b border-slate-100">
          <BackButton to="/interview/concern" />

          {/* SOCRATES Progress Bar */}
          <div className="flex-1 max-w-xs mx-2 hidden sm:flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Clinical History</span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Wave Indicator when Assistant is Speaking */}
            {isTtsSpeaking && (
              <div className="flex items-center gap-1 bg-teal-50 border border-teal-200 px-2 py-1 rounded-xl animate-pulse text-teal-800 text-[11px] font-bold">
                <Radio size={12} className="animate-spin text-teal-600" />
                <span className="hidden md:inline">Speaking</span>
              </div>
            )}

            {/* Repeat Audio Button */}
            <button
              type="button"
              onClick={handleRepeatSpeech}
              title="Repeat question"
              className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 p-2 sm:px-2.5 sm:py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Repeat</span>
            </button>

            {/* Mute / Unmute Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleMute}
              title={isTtsMuted ? "Unmute voice" : "Mute voice"}
              className={`flex items-center gap-1 text-xs font-bold p-2 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all cursor-pointer ${
                isTtsMuted
                  ? 'text-slate-500 bg-slate-100 border-slate-300'
                  : 'text-teal-800 bg-teal-50 border-teal-200 hover:bg-teal-100'
              }`}
            >
              {isTtsMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span className="hidden sm:inline">{isTtsMuted ? "Muted" : "Voice On"}</span>
            </button>

            {/* Language Switcher Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100/70 border border-teal-200 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <Globe size={14} />
              <span>{currentLang === 'hi' ? 'English' : 'हिन्दी'}</span>
            </button>

            {/* Direct Emergency Staff Alert */}
            <button
              type="button"
              onClick={() => navigate('/priority-alert')}
              title="Urgent assistance"
              className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <AlertOctagon size={14} />
              <span className="hidden md:inline">Emergency</span>
            </button>
          </div>
        </div>

        {/* Chat Feed Scroll Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1 scroll-smooth">
          {messages.map((msg) => {
            const isAssistant = msg.role === 'assistant';

            if (isAssistant) {
              return (
                <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300 group">
                  <AssistantMessage
                    title={msg.isAlert ? "Triage Safety Alert" : "Sehat Assistant"}
                    className={msg.isAlert ? "border-red-200 bg-red-50/60" : ""}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-sm md:text-base font-semibold leading-relaxed block ${msg.isAlert ? 'text-red-950 font-bold' : 'text-slate-800'}`}>
                        {msg.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSpeakSpecificText(msg.text)}
                        title="Listen again"
                        className="shrink-0 p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                  </AssistantMessage>
                </div>
              );
            }

            // Patient speech/message bubble
            return (
              <div key={msg.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-1 duration-200">
                <div className="max-w-[85%] sm:max-w-[75%] bg-teal-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm shadow-teal-600/10">
                  <div className="flex items-center gap-1.5 mb-1 justify-end">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-teal-100 opacity-90">
                      {msg.inputType === 'voice' ? '🎙️ Spoken' : msg.inputType === 'touch' ? '👆 Selected' : 'Typed'}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed break-words">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* AI Thinking/Processing Indicator */}
          {conversation.isProcessing && (
            <div className="flex items-center gap-3 p-3 bg-teal-50/60 border border-teal-100 rounded-2xl max-w-sm animate-pulse">
              <Sparkles size={18} className="text-teal-600 animate-spin" />
              <span className="text-xs font-semibold text-teal-900">
                Understanding symptoms & checking clinical guidelines...
              </span>
            </div>
          )}

          {/* Completion state card */}
          {conversation.status === 'completed' && (
            <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col gap-3 text-center my-4 animate-in zoom-in-95">
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                {currentLang === 'hi' ? 'चिकित्सकीय इतिहास पूर्ण हुआ' : 'Clinical History Gathered'}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {currentLang === 'hi'
                  ? 'आपकी जानकारी सुरक्षित रूप से संरचित कर ली गई है। आप अगले चरण में अपनी पिछली रिपोर्ट अपलोड कर सकते हैं।'
                  : 'Your clinical history has been structured for your doctor. You can now upload existing reports or proceed to review.'}
              </p>
              <Button
                size="lg"
                className="w-full mt-1"
                onClick={() => navigate('/documents')}
                icon={<ArrowRight size={18} />}
              >
                {currentLang === 'hi' ? 'दस्तावेज़ जोड़ें (Continue to Documents)' : 'Continue to Documents'}
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Interactive Response Section */}
        {conversation.status !== 'completed' && conversation.status !== 'alert' && (
          <div className="shrink-0 pt-2 flex flex-col gap-3 bg-white border-t border-slate-100">
            {/* Quick-Response Touch Options (Chips) */}
            {activeOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center py-1">
                {activeOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={conversation.isProcessing || isVoiceListening}
                    onClick={() => handleTouchOption(opt)}
                    className="text-xs font-semibold px-3 py-2 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 border border-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Voice and Text Dual Input Area */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Voice Button */}
              <div className="shrink-0 flex items-center justify-center">
                <VoiceButton
                  language={currentLang}
                  onTranscription={handleVoiceTranscription}
                  onStateChange={(state) => setIsVoiceListening(state === 'listening')}
                  disabled={conversation.isProcessing}
                />
              </div>

              {/* Text Input & Skip Controls */}
              <div className="flex-1 w-full flex flex-col gap-1.5">
                <AnswerInput
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onSubmit={handleSendText}
                  placeholder={
                    currentLang === 'hi'
                      ? "जवाब यहाँ लिखें (उदा. कल से छाती में दर्द है)..."
                      : "Type your answer here (e.g. pain since yesterday)..."
                  }
                  disabled={conversation.isProcessing || isVoiceListening}
                />

                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Speak or type in Hindi or English
                  </span>
                  <button
                    type="button"
                    onClick={skipCurrentQuestion}
                    disabled={conversation.isProcessing || isVoiceListening}
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <SkipForward size={12} />
                    <span>Skip this question</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </PatientLayout>
  );
};

export default Interview;
