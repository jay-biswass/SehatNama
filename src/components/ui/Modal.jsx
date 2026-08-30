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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative z-10 animate-fade-in border border-slate-100 max-h-[90vh] flex flex-col select-none">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 shrink-0">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
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
