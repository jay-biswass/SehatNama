import React from 'react';

export const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`flex-1 flex flex-col px-5 sm:px-8 py-6 animate-fade-in ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
