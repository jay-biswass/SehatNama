import React from 'react';
import RadioGroup from '../ui/RadioGroup';
import TextInput from '../ui/TextInput';

export const DynamicQuestion = ({ question, value, onChange }) => {
  if (!question) return null;

  switch (question.type) {
    case 'single_choice':
      return (
        <RadioGroup
          options={question.options.map(opt => ({ label: opt, value: opt }))}
          value={value}
          onChange={onChange}
        />
      );

    case 'multiple_choice': {
      const selectedValues = Array.isArray(value) ? value : [];
      const handleToggle = (opt) => {
        let newValues;
        if (opt === "It does not spread" || opt === "Neither" || opt === "None") {
          newValues = selectedValues.includes(opt) ? [] : [opt];
        } else {
          newValues = selectedValues.includes(opt)
            ? selectedValues.filter((v) => v !== opt)
            : [...selectedValues.filter(v => v !== "It does not spread" && v !== "Neither" && v !== "None"), opt];
        }
        onChange(newValues);
      };

      return (
        <div className="flex flex-col gap-3">
          {question.options.map((opt) => {
            const isSelected = selectedValues.includes(opt);
            return (
              <label
                key={opt}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                  checked={isSelected}
                  onChange={() => handleToggle(opt)}
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      );
    }

    case 'yes_no':
      return (
        <RadioGroup
          options={['Yes', 'No']}
          value={value}
          onChange={onChange}
        />
      );

    case 'scale': {
      const scaleValue = value ? parseInt(value, 10) : 5;
      return (
        <div className="flex flex-col gap-6 w-full py-4 px-2">
          <div className="text-center">
            <span className="text-4xl font-bold text-teal-600">{scaleValue}</span>
            <span className="text-slate-400 font-semibold text-lg"> / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={scaleValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-xs font-bold text-slate-400 px-1 uppercase tracking-wider">
            <span>Mild</span>
            <span>Severe</span>
          </div>
        </div>
      );
    }

    case 'text':
      return (
        <TextInput
          placeholder="Type your answer here..."
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      );

    default:
      return <div className="text-red-500">Unsupported question type</div>;
  }
};

export default DynamicQuestion;
