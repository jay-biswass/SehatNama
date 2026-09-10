import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const Alert = ({
  children,
  title,
  variant = 'info', // 'info' | 'success' | 'warning' | 'danger'
  className = ''
}) => {
  const styles = {
    info: 'bg-blue-50/60 border-blue-200/50 text-blue-800',
    success: 'bg-emerald-50/60 border-emerald-200/50 text-emerald-800',
    warning: 'bg-amber-50/60 border-amber-200/50 text-amber-800',
    danger: 'bg-red-50/60 border-red-200/50 text-red-800'
  };

  const icons = {
    info: <Info className="h-4 w-4 text-blue-500 shrink-0" />,
    success: <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
    danger: <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
  };

  return (
    <div className={`border rounded-[var(--radius-sm)] p-3.5 flex gap-2.5 ${styles[variant]} ${className} select-none`}>
      <div className="mt-0.5">{icons[variant]}</div>
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-0.5 text-[13px] leading-snug">{title}</h4>}
        <div className="leading-relaxed text-[13px] opacity-90">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
