import React from 'react';
import Badge from '../ui/Badge';
import { Pill, Activity, ShieldCheck } from 'lucide-react';

export const ExtractedDataCard = ({ extractedData }) => {
  if (!extractedData) return null;
  const { medications = [], labResults = [] } = extractedData;

  const hasData = medications.length > 0 || labResults.length > 0;
  if (!hasData) return null;

  return (
    <div className="border border-teal-100 bg-teal-50/15 rounded-2xl p-5 select-none animate-fade-in flex flex-col gap-4">
      <div className="flex items-center gap-2 text-teal-800 border-b border-teal-100/50 pb-2">
        <ShieldCheck size={16} className="text-teal-600" />
        <h4 className="font-bold text-xs uppercase tracking-wider">AI Extracted Clinical Details</h4>
      </div>

      {medications.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <Pill size={12} className="text-teal-500" />
            Current Medications
          </span>
          <div className="flex flex-wrap gap-1.5">
            {medications.map((med, idx) => (
              <span key={idx} className="bg-white border border-teal-100 text-teal-900 px-3 py-1 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                {med}
              </span>
            ))}
          </div>
        </div>
      )}

      {labResults.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <Activity size={12} className="text-teal-500" />
            Lab Observations
          </span>
          <div className="flex flex-col gap-2">
            {labResults.map((lab, idx) => (
              <div key={idx} className="bg-white border border-teal-100 rounded-xl p-3 flex items-center justify-between shadow-sm">
                <span className="text-xs font-bold text-slate-800">{lab.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
                    {lab.value}
                  </span>
                  {lab.status === 'attention' && (
                    <Badge variant="warning">Attention</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractedDataCard;
