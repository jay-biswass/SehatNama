import React from 'react';
import AnswerOption from './AnswerOption';

export const QuestionCard = ({
  questionText,
  options,
  selectedOption,
  onSelectOption
}) => {
  return (
    <div className="flex flex-col gap-4 w-full select-none animate-fade-in">
      <h3 className="text-lg font-bold text-slate-800 leading-snug">
        {questionText}
      </h3>
      <div className="flex flex-col gap-2.5">
        {options.map((option, idx) => (
          <AnswerOption
            key={idx}
            label={option}
            selected={selectedOption === option}
            onClick={() => onSelectOption(option)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
