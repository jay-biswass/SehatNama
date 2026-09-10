import React from 'react';
import { Check } from 'lucide-react';

export const Checkbox = ({
  id,
  checked,
  onChange,
  children,
  className = ''
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 p-3.5 border rounded-[var(--radius-sm)] cursor-pointer hover:bg-slate-50/60 transition-all duration-200 select-none ${
        checked ? 'border-[var(--color-primary)]/30 bg-[var(--color-primary-light)]' : 'border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-[18px] h-[18px] border rounded-[4px] flex items-center justify-center transition-all duration-200 ${
            checked
              ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
              : 'border-slate-300 bg-white'
          }`}
        >
          {checked && <Check size={12} className="stroke-[3]" />}
        </div>
      </div>
      <div className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {children}
      </div>
    </label>
  );
};

export default Checkbox;
