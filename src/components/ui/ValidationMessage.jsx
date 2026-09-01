import React from 'react';
import { AlertCircle } from 'lucide-react';

const ValidationMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 text-red-500 mt-1 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
      <AlertCircle size={14} className="shrink-0" />
      <span className="text-xs font-medium">{message}</span>
    </div>
  );
};

export default ValidationMessage;
