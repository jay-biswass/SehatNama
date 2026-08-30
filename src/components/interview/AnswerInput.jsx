import React from 'react';
import { Send } from 'lucide-react';

export const AnswerInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Type your answer here...",
  disabled = false,
  onFillMock
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-auto select-none">
      {onFillMock && (
        <button
          type="button"
          onClick={onFillMock}
          className="self-end text-xs font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100/50 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
        >
          💡 Auto-fill: "I have chest pain"
        </button>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm transition-all font-medium"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="w-11 h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-colors shadow-md shadow-teal-600/10 cursor-pointer disabled:bg-slate-200 disabled:shadow-none disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default AnswerInput;
