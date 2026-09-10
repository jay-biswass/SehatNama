import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const PriorityBadge = ({ priority = 'normal', size = 'md', showDescription = false }) => {
  const p = (priority || 'normal').toLowerCase();

  const configs = {
    high: {
      label: 'HIGH PRIORITY',
      sublabel: 'Priority Review Recommended',
      badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30',
      dotClass: 'bg-red-500 animate-pulse',
      icon: <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
    },
    medium: {
      label: 'MEDIUM PRIORITY',
      sublabel: 'Medical Review Recommended',
      badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30',
      dotClass: 'bg-amber-500',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
    },
    normal: {
      label: 'NORMAL',
      sublabel: 'Routine Review',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
      dotClass: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
    }
  };

  const config = configs[p] || configs.normal;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.badgeClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        {config.label}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl ${config.badgeClass}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
        <div className="flex flex-col">
          <span className="text-xs font-extrabold uppercase tracking-wider">{config.label}</span>
          {showDescription && (
            <span className="text-[10px] font-medium opacity-90">{config.sublabel}</span>
          )}
        </div>
      </div>
    );
  }

  // Default 'md'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${config.badgeClass}`}>
      <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  );
};

export default PriorityBadge;
