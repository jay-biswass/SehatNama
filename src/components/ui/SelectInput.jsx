import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectInput = ({ label, id, options, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-slate-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`appearance-none w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
            error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-teal-500 hover:border-slate-300'
          } ${!props.value ? 'text-slate-400' : ''}`}
          {...props}
        >
          <option value="" disabled hidden>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export default SelectInput;
