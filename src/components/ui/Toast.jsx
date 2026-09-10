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

  const styles = {
    success: 'border-emerald-200/60 bg-white',
    error: 'border-red-200/60 bg-white',
    warning: 'border-amber-200/60 bg-white'
  };

  const iconColors = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500'
  };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] shadow-[var(--shadow-elevated)] text-sm select-none font-medium max-w-sm w-[90%] border ${styles[type]} transition-all duration-300`}>
      <div className="flex items-center gap-2.5 flex-1">
        {type === 'success' ? (
          <CheckCircle size={18} className={`${iconColors[type]} shrink-0`} />
        ) : (
          <AlertCircle size={18} className={`${iconColors[type]} shrink-0`} />
        )}
        <span className="text-[var(--color-text-primary)] leading-snug text-[13px]">{message}</span>
      </div>
      <button 
        type="button"
        onClick={onClose}
        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] rounded p-0.5 transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
