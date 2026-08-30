import React from 'react';

export const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`flex-1 flex flex-col p-6 sm:p-8 animate-fade-in ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
