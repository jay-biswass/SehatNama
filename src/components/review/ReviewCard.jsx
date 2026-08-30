import React from 'react';

export const ReviewCard = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col gap-4 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default ReviewCard;
