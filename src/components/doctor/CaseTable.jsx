import React from 'react';
import { useNavigate } from 'react-router-dom';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { ArrowRight, Clock, ShieldAlert, User } from 'lucide-react';

export const CaseTable = ({ cases = [], isLoading = false }) => {
  const navigate = useNavigate();

  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMins = Math.floor((now - date) / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] animate-pulse">
        <div className="h-12 bg-slate-50 border-b border-slate-100" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 border-b border-slate-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-2xl" />
              <div className="flex flex-col gap-1.5">
                <div className="h-3.5 bg-slate-200 rounded w-32" />
                <div className="h-2.5 bg-slate-100 rounded w-20" />
              </div>
            </div>
            <div className="h-6 bg-slate-200 rounded-full w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!cases || cases.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_20px_0_rgba(0,0,0,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-4 px-6">Patient</th>
              <th className="py-4 px-4">Case ID</th>
              <th className="py-4 px-4">Health Concern</th>
              <th className="py-4 px-4">Priority</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Submitted</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100/80 text-xs">
            {cases.map((c) => {
              const patient = c.patients || {};
              const isHigh = c.priority_level?.toLowerCase() === 'high';
              const shortId = c.id?.length > 8 ? `SN-${c.id.substring(0, 8).toUpperCase()}` : c.id;
              const hasAlerts = Array.isArray(c.alerts) && c.alerts.some(a => !a.is_acknowledged);

              return (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/doctor/cases/${c.id}`)}
                  className={`
                    hover:bg-blue-50/30 transition-colors cursor-pointer group select-none
                    ${isHigh ? 'bg-red-50/30 hover:bg-red-50/60' : ''}
                  `}
                >
                  {/* Patient Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs
                        ${isHigh ? 'bg-red-100 text-red-700' : 'bg-gradient-to-tr from-blue-600 to-sky-500 text-white'}
                      `}>
                        {patient.full_name ? patient.full_name.charAt(0).toUpperCase() : <User size={16} />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate block">
                            {patient.full_name || 'Patient'}
                          </span>
                          {hasAlerts && (
                            <ShieldAlert size={15} className="text-red-600 shrink-0" title="Clinical Red-Flag Triggered" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                          {patient.age ? `${patient.age} yrs` : 'Age N/A'} • <span className="capitalize">{patient.gender || 'N/A'}</span>
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Case ID */}
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-500 font-semibold">
                    {shortId}
                  </td>

                  {/* Chief Complaint / Concern */}
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 capitalize">
                      {c.chief_complaint ? c.chief_complaint.replace(/_/g, ' ') : 'General Concern'}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-4">
                    <PriorityBadge priority={c.priority_level} size="sm" />
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <StatusBadge status={c.status} size="sm" />
                  </td>

                  {/* Submission Time */}
                  <td className="py-4 px-4 text-slate-500 font-semibold text-[11px]">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock size={12} />
                      <span>{formatTime(c.submitted_at || c.created_at)}</span>
                    </div>
                  </td>

                  {/* Action Link */}
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/doctor/cases/${c.id}`);
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Review</span>
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaseTable;
