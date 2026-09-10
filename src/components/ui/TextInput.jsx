import React from 'react';

const TextInput = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-primary)]">
          {label} {props.required && <span className="text-[var(--color-danger)]">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`px-3.5 py-2.5 bg-[var(--color-bg-base)] border rounded-[var(--radius-sm)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:bg-white transition-all ${
          error ? 'border-[var(--color-danger)]/50 focus:border-[var(--color-danger)]' : 'border-[var(--color-border-strong)] focus:border-[var(--color-primary)] hover:border-slate-300'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-[var(--color-danger)] font-medium">{error}</span>}
    </div>
  );
};

export default TextInput;
