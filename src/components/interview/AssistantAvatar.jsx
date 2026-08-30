import React from 'react';
import { Bot } from 'lucide-react';

export const AssistantAvatar = ({ className = '' }) => {
  return (
    <div className={`w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/10 shrink-0 ${className}`}>
      <Bot size={20} className="stroke-[2.2]" />
    </div>
  );
};

export default AssistantAvatar;
