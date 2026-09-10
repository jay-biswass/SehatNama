import React from 'react';
import { Clock, Eye, CheckCircle, FileText } from 'lucide-react';

export const StatusBadge = ({ status = 'waiting_for_doctor', size = 'md' }) => {
  const s = (status || 'waiting_for_doctor').toLowerCase();

  const configs = {
    waiting_for_doctor: {
      label: 'Waiting for Doctor',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      icon: <Clock size={12} className="text-blue-600 dark:text-blue-400" />
    },
    submitted: {
      label: 'Submitted',
      badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
      icon: <Clock size={12} className="text-sky-600 dark:text-sky-400" />
    },
    under_review: {
      label: 'Under Review',
      badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      icon: <Eye size={12} className="text-amber-600 dark:text-amber-400" />
    },
    completed: {
      label: 'Completed',
      badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      icon: <CheckCircle size={12} className="text-emerald-600 dark:text-emerald-400" />
    },
    in_progress: {
      label: 'In Intake',
      badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300',
      icon: <FileText size={12} className="text-slate-500" />
    },
    draft: {
      label: 'Draft',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200',
      icon: <FileText size={12} className="text-slate-400" />
    }
  };

  const config = configs[s] || configs.waiting_for_doctor;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${config.badgeClass}`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${config.badgeClass}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
