import React from 'react';
import Loader from '../ui/Loader';
import { Sparkles } from 'lucide-react';

export const OCRProcessing = ({ isProcessing, message = 'Analyzing document with AI...' }) => {
  if (!isProcessing) return null;

  return (
    <div className="bg-slate-50 border border-teal-100/70 rounded-2xl p-6 text-center animate-fade-in select-none shadow-sm">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center animate-pulse">
          <Sparkles size={24} className="animate-spin-slow" />
        </div>
        <Loader message={message} />
        <div className="text-[11px] text-teal-700/80 font-semibold font-mono tracking-wide">
          SehatNama Gemini Multimodal Engine
        </div>
      </div>
    </div>
  );
};

export default OCRProcessing;
