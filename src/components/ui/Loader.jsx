import React from 'react';

export const Loader = ({ message, progress }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 select-none text-center">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring Spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin mb-2" />
      </div>
      {message && (
        <p className="text-sm font-medium text-slate-600 mt-2">
          {message}
        </p>
      )}
      {progress !== undefined && (
        <div className="w-48 bg-slate-200 h-2 rounded-full overflow-hidden mt-3 max-w-full">
          <div
            className="bg-teal-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Loader;
