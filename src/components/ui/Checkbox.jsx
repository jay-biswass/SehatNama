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
      className={`flex items-start gap-3.5 p-4 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors duration-200 select-none ${
        checked ? 'border-teal-500 bg-teal-50/20' : 'border-slate-200 bg-white'
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
          className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-200 ${
            checked
              ? 'bg-teal-600 border-teal-600 text-white scale-100'
              : 'border-slate-300 bg-white'
          }`}
        >
          {checked && <Check size={14} className="stroke-[3]" />}
        </div>
      </div>
      <div className="text-sm leading-relaxed text-slate-700">
        {children}
      </div>
    </label>
  );
};

export default Checkbox;
