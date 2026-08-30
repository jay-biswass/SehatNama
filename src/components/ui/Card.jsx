import React from 'react';

export const Card = ({
  children,
  onClick,
  selected = false,
  className = '',
  ...props
}) => {
  const clickableStyles = onClick ? 'cursor-pointer hover:shadow-md hover:border-teal-300 hover:bg-slate-50/20 transition-all duration-200 active:scale-[0.99] select-none' : '';
  const selectedStyles = selected ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-500/20' : 'border-slate-200 bg-white';

  return (
    <div
      onClick={onClick}
      className={`border rounded-2xl p-5 ${clickableStyles} ${selectedStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
