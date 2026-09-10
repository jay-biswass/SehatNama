import React from 'react';

const FormSection = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-1">
          {title && <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>}
          {subtitle && <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
