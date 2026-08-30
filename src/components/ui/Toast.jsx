import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export const Toast = ({
  message,
  type = 'success', // 'success' | 'error' | 'warning'
  isVisible,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    warning: 'bg-amber-500'
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm select-none font-medium max-w-xs sm:max-w-md w-[90%] justify-between transition-all duration-300 bg-teal-900 border border-teal-800">
      <div className="flex items-center gap-2 flex-1">
        {type === 'success' ? (
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle size={18} className="text-red-400 shrink-0" />
        )}
        <span className="leading-snug">{message}</span>
      </div>
      <button 
        type="button"
        onClick={onClose}
        className="text-white/60 hover:text-white rounded p-0.5 transition-colors cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
