import React from 'react';

const RadioGroup = ({ label, options, value, onChange, error, className = '', required }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const isSelected = value === optValue;

          return (
            <label
              key={optValue}
              className={`flex-1 min-w-[120px] cursor-pointer rounded-xl border p-3 text-center transition-all select-none ${
                isSelected
                  ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold shadow-sm shadow-teal-500/10'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-medium'
              }`}
            >
              <input
                type="radio"
                name={label} // simple naming
                value={optValue}
                checked={isSelected}
                onChange={() => onChange(optValue)}
                className="sr-only"
              />
              <span>{optLabel}</span>
            </label>
          );
        })}
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export default RadioGroup;
