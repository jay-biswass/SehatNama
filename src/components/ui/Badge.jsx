import React from 'react';

export const Badge = ({
  children,
  variant = 'info', // 'info' | 'success' | 'warning' | 'danger'
  className = ''
}) => {
  const styles = {
    info: 'bg-blue-50/80 text-blue-700 border-blue-200/60',
    success: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
    danger: 'bg-red-50/80 text-red-700 border-red-200/60'
  };

  const dots = {
    info: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${styles[variant]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[variant]}`} />
      {children}
    </span>
  );
};

export default Badge;
