import React from 'react';
import Badge from '../ui/Badge';
import { Pill, Activity, ShieldCheck, Stethoscope, HeartPulse, AlertCircle, FileText, Calendar } from 'lucide-react';

export const ExtractedDataCard = ({ extractedData }) => {
  if (!extractedData) return null;

  const {
    documentType = null,
    documentDate = null,
    diagnoses = [],
    medications = [],
    investigations = [],
    labResults = [], // backward compatibility
    procedures = [],
    allergies = [],
    vitalSigns = [],
    clinicalNotes = [],
    doctorAdvice = []
  } = extractedData;

  const effectiveLabs = investigations.length > 0 ? investigations : labResults;
  const hasData =
    documentType ||
    documentDate ||
    diagnoses.length > 0 ||
    medications.length > 0 ||
    effectiveLabs.length > 0 ||
    procedures.length > 0 ||
    allergies.length > 0 ||
    vitalSigns.length > 0 ||
    clinicalNotes.length > 0 ||
    doctorAdvice.length > 0;

  if (!hasData) return null;

  return (
    <div className="border border-teal-200 bg-teal-50/20 rounded-2xl p-5 select-none animate-fade-in flex flex-col gap-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-teal-100 pb-2.5">
        <div className="flex items-center gap-2 text-teal-800">
          <ShieldCheck size={18} className="text-teal-600" />
          <h4 className="font-bold text-xs uppercase tracking-wider">AI Extracted Clinical Details</h4>
        </div>
        {(documentType || documentDate) && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            {documentType && (
              <span className="capitalize bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded border border-teal-100">
                {documentType}
              </span>
            )}
            {documentDate && (
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar size={11} />
                {documentDate}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Diagnoses */}
      {diagnoses.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <Stethoscope size={12} className="text-teal-600" />
            Diagnoses / Clinical Findings
          </span>
          <div className="flex flex-wrap gap-1.5">
            {diagnoses.map((diag, idx) => (
              <span key={idx} className="bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs">
                {diag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Medications */}
      {medications.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <Pill size={12} className="text-teal-600" />
            Prescribed Medications
          </span>
          <div className="flex flex-wrap gap-1.5">
            {medications.map((med, idx) => {
              const medDisplay = typeof med === 'string'
                ? med
                : [med.name, med.dose, med.frequency, med.instructions ? `(${med.instructions})` : '']
                    .filter(Boolean)
                    .join(' ');
              return (
                <span key={idx} className="bg-white border border-teal-100 text-teal-900 px-3 py-1 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                  {medDisplay}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Investigations / Lab Results */}
      {effectiveLabs.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <Activity size={12} className="text-teal-600" />
            Investigations / Lab Observations
          </span>
          <div className="flex flex-col gap-1.5">
            {effectiveLabs.map((lab, idx) => {
              const valDisplay = lab.value !== undefined && lab.value !== null
                ? `${lab.value} ${lab.unit || ''}`.trim()
                : '';
              const isAttention = lab.flag === 'abnormal' || lab.flag === 'attention' || lab.status === 'attention';

              return (
                <div key={idx} className="bg-white border border-teal-100 rounded-xl px-3 py-2 flex items-center justify-between shadow-xs">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">{lab.name}</span>
                    {lab.referenceRange && (
                      <span className="text-[10px] text-slate-400">Ref: {lab.referenceRange}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                      {valDisplay}
                    </span>
                    {isAttention && (
                      <Badge variant="warning">Attention</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vital Signs */}
      {vitalSigns.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <HeartPulse size={12} className="text-rose-500" />
            Vital Signs
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {vitalSigns.map((v, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-2 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{v.name}</span>
                <span className="text-xs font-bold text-slate-800">{v.value} {v.unit || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Procedures */}
      {procedures.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Procedures</span>
          <div className="flex flex-wrap gap-1">
            {procedures.map((proc, idx) => (
              <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded">
                {proc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Allergies */}
      {allergies.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide flex items-center gap-1">
            <AlertCircle size={11} /> Known Allergies
          </span>
          <div className="flex flex-wrap gap-1">
            {allergies.map((all, idx) => (
              <span key={idx} className="bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-xs px-2 py-0.5 rounded">
                {all}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Notes */}
      {clinicalNotes.length > 0 && (
        <div className="flex flex-col gap-1 pt-1 border-t border-teal-100/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
            <FileText size={11} /> Clinical Notes
          </span>
          <p className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-lg border border-teal-50">
            {clinicalNotes.join(' ')}
          </p>
        </div>
      )}

      {/* Doctor Advice / Recommendations */}
      {doctorAdvice.length > 0 && (
        <div className="flex flex-col gap-1 pt-1 border-t border-teal-100/50">
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide flex items-center gap-1">
            <Stethoscope size={11} /> Doctor Advice / Recommendations
          </span>
          <ul className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-lg border border-teal-50 list-disc list-inside space-y-1">
            {doctorAdvice.map((advice, idx) => (
              <li key={idx}>{advice}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExtractedDataCard;
