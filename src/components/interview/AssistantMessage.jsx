import React from 'react';
import AssistantAvatar from './AssistantAvatar';

export const AssistantMessage = ({ children, title, className = '' }) => {
  return (
    <div className={`flex items-start gap-3 w-full animate-fade-in ${className}`}>
      <AssistantAvatar />
      <div className="flex-1 flex flex-col gap-1 max-w-[85%] bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-4 text-slate-800">
        {title && <h3 className="font-bold text-sm text-teal-800 leading-snug">{title}</h3>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export default AssistantMessage;
