import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../navigation/Header';
import ProgressBar from '../navigation/ProgressBar';

export const AppLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // Decide if we should show header and progress bar
  // The Welcome page ("/") and Success page ("/success") don't show the full progress bar
  const isLandingOrSuccess = path === '/' || path === '/success';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 select-none font-sans text-slate-800">
      <div className="w-full max-w-2xl bg-white min-h-screen sm:min-h-[850px] sm:max-h-[900px] flex flex-col sm:rounded-3xl sm:shadow-2xl sm:border sm:border-slate-100 overflow-hidden relative">
        {!isLandingOrSuccess && (
          <>
            <Header />
            <ProgressBar />
          </>
        )}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
