import React from 'react';
import EditButton from './EditButton';

export const ReviewSection = ({ title, children, onEdit, icon }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-slate-100 bg-slate-50/20 rounded-2xl relative animate-fade-in select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1">
        <div className="flex items-center gap-2 text-slate-800">
          {icon && <span className="text-teal-600 shrink-0">{icon}</span>}
          <h4 className="font-bold text-xs uppercase tracking-wider">{title}</h4>
        </div>
        {onEdit && <EditButton onClick={onEdit} />}
      </div>
      <div className="text-sm text-slate-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default ReviewSection;
