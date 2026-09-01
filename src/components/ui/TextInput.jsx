import React from 'react';

const TextInput = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-slate-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
          error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-teal-500 hover:border-slate-300'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export default TextInput;
