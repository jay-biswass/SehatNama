import React from 'react';
import Card from '../ui/Card';

export const AnswerOption = ({ label, selected, onClick }) => {
  return (
    <Card
      onClick={onClick}
      selected={selected}
      className={`py-4 px-5 text-left transition-all select-none cursor-pointer ${
        selected
          ? 'border-teal-500 bg-teal-50/20 shadow-sm shadow-teal-500/5'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <span className="font-semibold text-slate-800 text-sm">{label}</span>
    </Card>
  );
};

export default AnswerOption;
