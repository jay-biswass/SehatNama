import React from 'react';
import { useNavigate } from 'react-router-dom';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { User, Clock, ArrowRight, ShieldAlert, Calendar } from 'lucide-react';

export const CaseCard = ({ caseItem }) => {
  const navigate = useNavigate();

  if (!caseItem) return null;

  const patient = caseItem.patients || {};
  const caseId = caseItem.id || 'N/A';
  const shortCaseId = caseId.length > 8 ? `SN-${caseId.substring(0, 8).toUpperCase()}` : caseId;

  // Format relative or friendly submission time
  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays === 1) return 'Yesterday';
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const isHighPriority = caseItem.priority_level?.toLowerCase() === 'high';
  const hasAlerts = Array.isArray(caseItem.alerts) && caseItem.alerts.some(a => !a.is_acknowledged);

  return (
    <div
      onClick={() => navigate(`/doctor/cases/${caseItem.id}`)}
      className={`
        relative bg-white border rounded-3xl p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] transition-all duration-300 cursor-pointer select-none
        hover:shadow-[0_10px_30px_-5px_rgba(37,99,235,0.12)] hover:-translate-y-1 group
        ${isHighPriority ? 'border-red-200 bg-gradient-to-br from-red-50/30 via-white to-white' : 'border-slate-100'}
      `}
    >
      {/* Top Row: Patient Avatar, Name & Priority Badge */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`
            w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs
            ${isHighPriority ? 'bg-red-100 text-red-700' : 'bg-gradient-to-tr from-blue-600 to-sky-500 text-white'}
          `}>
            {patient.full_name ? patient.full_name.charAt(0).toUpperCase() : <User size={20} />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                {patient.full_name || 'Patient'}
              </h3>
              {hasAlerts && (
                <ShieldAlert size={16} className="text-red-600 shrink-0" title="Clinical Red-Flag Triggered" />
              )}
            </div>
            
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              {patient.age ? `${patient.age} yrs` : 'Age N/A'} • <span className="capitalize">{patient.gender || 'N/A'}</span>
            </p>
          </div>
        </div>

        <PriorityBadge priority={caseItem.priority_level} size="sm" />
      </div>

      {/* Health Concern Card Block */}
      <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 mb-3.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
            Chief Concern
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 capitalize block">
            {caseItem.chief_complaint ? caseItem.chief_complaint.replace(/_/g, ' ') : 'General Medical Concern'}
          </span>
        </div>

        <StatusBadge status={caseItem.status} size="sm" />
      </div>

      {/* Footer: Date, Time & Action Link */}
      <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100/80 text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock size={13} className="text-slate-400" />
          <span>{formatTime(caseItem.submitted_at || caseItem.created_at)}</span>
        </div>

        <div className="flex items-center gap-1 font-extrabold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all">
          <span>Review Case</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
