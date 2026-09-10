import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Modal Box */}
      <div className="glass-strong rounded-[var(--radius-lg)] shadow-[var(--shadow-modal)] max-w-md w-full p-6 relative z-10 animate-fade-in max-h-[90vh] flex flex-col select-none">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4 shrink-0">
          <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{title}</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] rounded-[var(--radius-sm)] p-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
