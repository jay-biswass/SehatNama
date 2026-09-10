import React from 'react';

export const Loader = ({ message, progress }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 select-none text-center">
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-10 h-10 rounded-full border-[3px] border-slate-200 border-t-[var(--color-primary)] animate-spin" />
      </div>
      {message && (
        <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">
          {message}
        </p>
      )}
      {progress !== undefined && (
        <div className="w-40 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-[var(--color-primary)] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Loader;
