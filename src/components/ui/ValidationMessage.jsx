import React from 'react';
import { AlertCircle } from 'lucide-react';

const ValidationMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 text-[var(--color-danger)] mt-1 bg-red-50/50 px-3 py-1.5 rounded-[var(--radius-sm)] border border-red-100/50">
      <AlertCircle size={13} className="shrink-0" />
      <span className="text-xs font-medium">{message}</span>
    </div>
  );
};

export default ValidationMessage;
