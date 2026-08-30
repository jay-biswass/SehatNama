import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const Alert = ({
  children,
  title,
  variant = 'info', // 'info' | 'success' | 'warning' | 'danger'
  className = ''
}) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    danger: 'bg-red-50 border-red-200 text-red-800'
  };

  const icons = {
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
    success: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    danger: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
  };

  return (
    <div className={`border rounded-xl p-4 flex gap-3 ${styles[variant]} ${className} select-none`}>
      {icons[variant]}
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-1 leading-snug">{title}</h4>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
