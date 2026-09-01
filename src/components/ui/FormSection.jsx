import React from 'react';

const FormSection = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-2">
          {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
        </div>
      )}
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
