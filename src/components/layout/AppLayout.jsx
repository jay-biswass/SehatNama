import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../navigation/Header';
import ProgressBar from '../navigation/ProgressBar';

export const AppLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // The Welcome page ("/") and Success page ("/success") don't show the full progress bar
  const isLandingOrSuccess = path === '/' || path === '/success';

  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg-base)] flex flex-col select-none font-sans text-[var(--color-text-primary)]">
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
        {!isLandingOrSuccess && (
          <>
            <Header />
            <ProgressBar />
          </>
        )}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
