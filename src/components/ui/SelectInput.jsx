import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectInput = ({ label, id, options, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-primary)]">
          {label} {props.required && <span className="text-[var(--color-danger)]">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`appearance-none w-full px-3.5 py-2.5 bg-[var(--color-bg-base)] border rounded-[var(--radius-sm)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:bg-white transition-all ${
            error ? 'border-[var(--color-danger)]/50 focus:border-[var(--color-danger)]' : 'border-[var(--color-border-strong)] focus:border-[var(--color-primary)] hover:border-slate-300'
          } ${!props.value ? 'text-[var(--color-text-muted)]' : ''}`}
          {...props}
        >
          <option value="" disabled hidden>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--color-text-muted)]">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <span className="text-xs text-[var(--color-danger)] font-medium">{error}</span>}
    </div>
  );
};

export default SelectInput;
