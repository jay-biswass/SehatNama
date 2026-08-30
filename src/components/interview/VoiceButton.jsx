import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

export const VoiceButton = ({ onTranscription, onStateChange, disabled }) => {
  const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'listening' | 'processing'

  useEffect(() => {
    if (onStateChange) {
      onStateChange(voiceState);
    }
  }, [voiceState, onStateChange]);

  const handleMicClick = () => {
    if (voiceState !== 'idle' || disabled) return;

    // Start listening simulation
    setVoiceState('listening');

    // Stay listening for 3 seconds, then process
    const listeningTimeout = setTimeout(() => {
      setVoiceState('processing');

      // Process for 2 seconds, then complete
      const processingTimeout = setTimeout(() => {
        setVoiceState('idle');
        onTranscription('I have chest pain.');
      }, 2000);

      return () => clearTimeout(processingTimeout);
    }, 3000);

    return () => clearTimeout(listeningTimeout);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <button
        type="button"
        disabled={disabled || voiceState !== 'idle'}
        onClick={handleMicClick}
        className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 cursor-pointer shadow-lg outline-none select-none border-0 ${
          voiceState === 'listening'
            ? 'bg-red-500 animate-pulse-mic shadow-red-500/20 ring-4 ring-red-100'
            : voiceState === 'processing'
            ? 'bg-teal-500 shadow-teal-500/20 cursor-wait'
            : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20 hover:scale-105 active:scale-95 disabled:bg-slate-300 disabled:shadow-none disabled:scale-100'
        }`}
      >
        {voiceState === 'processing' ? (
          <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <Mic size={32} className={voiceState === 'listening' ? 'animate-bounce' : ''} />
        )}
      </button>

      <span className="text-xs font-semibold text-slate-500 select-none">
        {voiceState === 'listening' && (
          <span className="text-red-500 flex items-center gap-1.5 justify-center">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
            🔴 Listening... Speak now
          </span>
        )}
        {voiceState === 'processing' && (
          <span className="text-teal-700 flex items-center gap-1 justify-center animate-pulse">
            ✨ Understanding your response...
          </span>
        )}
        {voiceState === 'idle' && (
          <span>🎤 Tap and Speak</span>
        )}
      </span>
    </div>
  );
};

export default VoiceButton;
