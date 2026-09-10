import React from 'react';

const RadioGroup = ({ label, options, value, onChange, error, className = '', required }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          {label} {required && <span className="text-[var(--color-danger)]">*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const isSelected = value === optValue;

          return (
            <label
              key={optValue}
              className={`flex-1 min-w-[110px] cursor-pointer rounded-[var(--radius-sm)] border p-2.5 text-center transition-all duration-200 select-none text-sm ${
                isSelected
                  ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold shadow-[var(--shadow-xs)]'
                  : 'border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:border-slate-300 font-medium'
              }`}
            >
              <input
                type="radio"
                name={label}
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
      {error && <span className="text-xs text-[var(--color-danger)] font-medium">{error}</span>}
    </div>
  );
};

export default RadioGroup;
