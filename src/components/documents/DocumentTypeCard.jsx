import React from 'react';
import Card from '../ui/Card';

export const DocumentTypeCard = ({ label, description, icon, selected, onClick }) => {
  return (
    <Card
      onClick={onClick}
      selected={selected}
      className={`flex items-start gap-4 p-4 text-left cursor-pointer transition-all select-none ${
        selected ? 'border-teal-500 bg-teal-50/25 shadow-sm' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="text-2xl mt-0.5 shrink-0 select-none">{icon}</div>
      <div>
        <h4 className="font-bold text-sm text-slate-800 mb-0.5">{label}</h4>
        <p className="text-xs text-slate-500 leading-normal">{description}</p>
      </div>
    </Card>
  );
};

export default DocumentTypeCard;
