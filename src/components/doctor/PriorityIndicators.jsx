import React from 'react';
import { ShieldAlert, AlertTriangle, Info, ShieldCheck } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

export const PriorityIndicators = ({ priority = 'normal', alerts = [], redFlags = [] }) => {
  const p = (priority || 'normal').toLowerCase();
  const isHigh = p === 'high';
  const isMedium = p === 'medium';

  const combinedAlerts = [
    ...(Array.isArray(alerts) ? alerts : []),
    ...(Array.isArray(redFlags) ? redFlags.map(rf => ({ message: rf.signal || rf.message || rf.type, priority: 'high' })) : [])
  ];

  return (
    <div className={`
      border rounded-3xl p-6 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] flex flex-col gap-4 transition-all
      ${isHigh ? 'bg-red-50/50 border-red-200' : isMedium ? 'bg-amber-50/50 border-amber-200' : 'bg-emerald-50/40 border-emerald-200'}
    `}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs
            ${isHigh ? 'bg-red-100 text-red-700' : isMedium ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}
          `}>
            {isHigh ? <ShieldAlert size={22} /> : isMedium ? <AlertTriangle size={22} /> : <ShieldCheck size={22} />}
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>Clinical Triage Screening Result</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {isHigh 
                ? 'High-priority clinical indicators identified during intake screening'
                : isMedium
                ? 'Moderate clinical symptoms flagged for routine doctor review'
                : 'Routine clinical review recommended based on screening intake'}
            </p>
          </div>
        </div>

        <PriorityBadge priority={priority} size="md" showDescription />
      </div>

      {/* Flagged Symptoms / Alerts List */}
      {combinedAlerts.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
            Identified Priority Indicators:
          </span>

          <div className="flex flex-col gap-2">
            {combinedAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 bg-white/90 border border-red-200/80 rounded-2xl text-xs shadow-2xs"
              >
                <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-extrabold text-red-950 block">
                    {alert.message || 'Potential priority symptom flagged'}
                  </span>
                  {alert.alert_type && (
                    <span className="text-[10px] text-slate-500 capitalize font-medium">
                      Category: {alert.alert_type.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : isHigh ? (
        <div className="p-3.5 bg-white/90 border border-red-200/80 rounded-2xl text-xs text-red-900 flex items-center gap-2.5 font-medium">
          <AlertTriangle size={18} className="text-red-600 shrink-0" />
          <span>Patient responses reached high-priority triage threshold (e.g. severe pain score or critical symptom radiation).</span>
        </div>
      ) : null}

      {/* Medical Safety Disclaimer */}
      <div className="pt-3 border-t border-black/5 flex items-start gap-2 text-xs text-slate-500 font-medium leading-relaxed">
        <Info size={15} className="text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-800">Clinical Disclaimer:</strong> SehatNama provides automated clinical intake and rule-based screening indicators. Triage flags are not definitive medical diagnoses and are intended solely to assist clinical staff in prioritizing care.
        </span>
      </div>
    </div>
  );
};

export default PriorityIndicators;
