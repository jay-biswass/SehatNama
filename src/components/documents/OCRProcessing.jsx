import React, { useEffect, useState } from 'react';
import Loader from '../ui/Loader';

export const OCRProcessing = ({ isProcessing, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Delay onComplete slightly to let user see 100% complete
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 300);
            return 100;
          }
          return prev + 10;
        });
      }, 200); // 2 seconds total

      return () => clearInterval(interval);
    }
  }, [isProcessing, onComplete]);

  if (!isProcessing) return null;

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center animate-fade-in select-none">
      <Loader message="Reading your document & extracting health data..." progress={progress} />
      <div className="text-[10px] text-slate-400 font-medium mt-1 font-mono uppercase tracking-wider">
        SehatNama AI OCR Engine
      </div>
    </div>
  );
};

export default OCRProcessing;
