import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, AlertCircle } from 'lucide-react';
import asrService from '../../services/asrService';

export const VoiceButton = ({
  onTranscription,
  onStateChange,
  disabled = false,
  language = 'hi'
}) => {
  const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [interimText, setInterimText] = useState('');
  const activeRef = useRef(false);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(voiceState);
    }
  }, [voiceState, onStateChange]);

  const handleMicClick = () => {
    if (disabled) return;

    if (voiceState === 'listening') {
      // Stop early if clicked while recording
      asrService.stop();
      setVoiceState('processing');
      activeRef.current = false;
      return;
    }

    if (voiceState !== 'idle' && voiceState !== 'error') return;

    setErrorMessage('');
    setInterimText('');
    setVoiceState('listening');
    activeRef.current = true;

    asrService.start({
      language,
      onStart: () => {
        setVoiceState('listening');
      },
      onResult: ({ text, isFinal }) => {
        setInterimText(text);
        if (isFinal && text) {
          setVoiceState('processing');
          activeRef.current = false;
          setTimeout(() => {
            setVoiceState('idle');
            setInterimText('');
            if (onTranscription) {
              onTranscription(text);
            }
          }, 400);
        }
      },
      onError: (err) => {
        activeRef.current = false;
        setVoiceState('error');
        setErrorMessage(err.message || 'Microphone error');
        setTimeout(() => {
          setVoiceState('idle');
        }, 3000);
      },
      onEnd: () => {
        if (activeRef.current) {
          activeRef.current = false;
          setVoiceState('idle');
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full select-none">
      <button
        type="button"
        disabled={disabled}
        onClick={handleMicClick}
        aria-label="Voice input button"
        className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 cursor-pointer shadow-lg outline-none border-0 ${
          voiceState === 'listening'
            ? 'bg-red-500 shadow-red-500/30 ring-4 ring-red-100 scale-105'
            : voiceState === 'processing'
            ? 'bg-teal-500 shadow-teal-500/20 cursor-wait'
            : voiceState === 'error'
            ? 'bg-amber-600 shadow-amber-600/20'
            : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20 hover:scale-105 active:scale-95 disabled:bg-slate-300 disabled:shadow-none disabled:scale-100'
        }`}
      >
        {/* Animated outer ring when listening */}
        {voiceState === 'listening' && (
          <span className="absolute inset-0 rounded-full bg-red-400 opacity-75 animate-ping" />
        )}

        {voiceState === 'processing' ? (
          <svg className="animate-spin h-8 w-8 text-white relative z-10" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : voiceState === 'listening' ? (
          <Square size={26} className="fill-white relative z-10" />
        ) : voiceState === 'error' ? (
          <AlertCircle size={30} className="relative z-10" />
        ) : (
          <Mic size={32} className="relative z-10" />
        )}
      </button>

      {/* Voice status label */}
      <div className="text-center min-h-[20px]">
        {voiceState === 'listening' && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-red-600 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Listening... Speak now (Tap to finish)
            </span>
            {interimText && (
              <span className="text-xs text-slate-600 italic max-w-xs truncate">
                "{interimText}"
              </span>
            )}
          </div>
        )}

        {voiceState === 'processing' && (
          <span className="text-xs font-semibold text-teal-700 flex items-center gap-1.5">
            ✨ Analyzing clinical statement...
          </span>
        )}

        {voiceState === 'error' && (
          <span className="text-xs font-semibold text-amber-700">
            ⚠️ {errorMessage || 'Could not hear. Please try again or type.'}
          </span>
        )}

        {voiceState === 'idle' && (
          <span className="text-xs font-semibold text-slate-500">
            🎤 Tap to Speak ({language === 'hi' ? 'हिन्दी / English' : 'English / Hindi'})
          </span>
        )}
      </div>
    </div>
  );
};

export default VoiceButton;
