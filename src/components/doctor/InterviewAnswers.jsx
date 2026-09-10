import React from 'react';
import { MessageSquare } from 'lucide-react';

export const InterviewAnswers = ({ answers = [], caseData = {} }) => {
  // Parse structured SOCRATES or physician JSON summary if present in patient_description
  let structuredSummary = null;
  if (caseData.patient_description && typeof caseData.patient_description === 'string' && caseData.patient_description.startsWith('{')) {
    try {
      structuredSummary = JSON.parse(caseData.patient_description);
    } catch (e) {
      structuredSummary = null;
    }
  }

  const hpi = structuredSummary?.hpi || {};
  const provenance = structuredSummary?.provenance || {};

  const formatAnswerValue = (val) => {
    if (val === null || val === undefined) return <span className="italic text-slate-400">Not answered</span>;
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (Array.isArray(val)) {
      if (val.length === 0) return <span className="italic text-slate-400">None reported</span>;
      return (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {val.map((item, idx) => (
            <span key={idx} className="bg-blue-50 text-blue-900 border border-blue-100 text-xs font-bold px-2.5 py-1 rounded-full capitalize">
              {String(item)}
            </span>
          ))}
        </div>
      );
    }
    if (typeof val === 'object') {
      return JSON.stringify(val);
    }
    return String(val);
  };

  const getQuestionTitle = (questionId) => {
    const map = {
      chief_complaint: 'Chief Complaint',
      site: 'Site (Location of Pain / Discomfort)',
      onset: 'Onset (When and how did symptoms begin?)',
      duration: 'Duration (How long has it lasted?)',
      character: 'Character (Pain sensation / description)',
      radiation: 'Radiation (Does pain spread to arm, neck, back?)',
      severity: 'Severity Score (0 to 10 scale)',
      associated_symptoms: 'Associated Symptoms (Sweating, breathlessness, nausea)',
      timing: 'Timing / Periodicity',
      exacerbating_factors: 'Exacerbating Factors (What makes it worse?)',
      relieving_factors: 'Relieving Factors (What makes it better?)'
    };
    return map[questionId] || questionId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderProvenanceBadge = (key) => {
    const prov = provenance[key] || provenance[`hpi.${key}`];
    if (!prov) return null;

    if (prov.source === 'PATIENT_DIRECT') {
      return (
        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full shrink-0">
          🗣️ Patient Direct
        </span>
      );
    }
    if (prov.source === 'AI_EXTRACTION') {
      return (
        <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full shrink-0" title={prov.raw_utterance ? `Utterance: "${prov.raw_utterance}"` : ''}>
          🤖 AI Extracted
        </span>
      );
    }
    return null;
  };

  const hasDbAnswers = Array.isArray(answers) && answers.length > 0;
  const hasHpiFields = hpi && Object.keys(hpi).length > 0;

  if (!hasDbAnswers && !hasHpiFields) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center text-slate-400 text-xs shadow-[0_4px_20px_0_rgba(0,0,0,0.03)]">
        No interview answers recorded for this case.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] flex flex-col gap-4">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Patient Clinical Interview (SOCRATES Intake)
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Dynamic responses collected during patient intake session
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
          {hasDbAnswers ? `${answers.length} Responses` : 'Structured Intake'}
        </span>
      </div>

      {/* Answers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {hasDbAnswers ? (
          answers.map((item) => {
            const isSeverity = item.question_id === 'severity' || item.question_type === 'scale';
            const answerValue = typeof item.answer === 'string' ? item.answer : (item.answer?.value ?? item.answer);

            return (
              <div
                key={item.id || item.question_id}
                className="flex flex-col justify-between p-4 bg-slate-50/80 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    {item.question_text || getQuestionTitle(item.question_id)}
                  </span>
                  {renderProvenanceBadge(item.question_id)}
                </div>

                <div className="mt-auto pt-1">
                  {isSeverity && typeof answerValue === 'number' ? (
                    <div className="flex items-center gap-2">
                      <span className={`
                        text-sm font-extrabold px-3 py-1 rounded-full
                        ${answerValue >= 7 ? 'bg-red-100 text-red-700' : answerValue >= 4 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}
                      `}>
                        {answerValue} / 10
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        {answerValue >= 7 ? 'Severe Pain' : answerValue >= 4 ? 'Moderate Pain' : 'Mild Discomfort'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs font-extrabold text-slate-900">
                      {formatAnswerValue(answerValue)}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          Object.entries(hpi).map(([key, val]) => {
            if (val === null || val === undefined || val === '') return null;
            const isSeverity = key === 'severity';

            return (
              <div
                key={key}
                className="flex flex-col justify-between p-4 bg-slate-50/80 border border-slate-100 rounded-2xl"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    {getQuestionTitle(key)}
                  </span>
                  {renderProvenanceBadge(key)}
                </div>

                <div className="mt-auto pt-1">
                  {isSeverity ? (
                    <div className="flex items-center gap-2">
                      <span className={`
                        text-sm font-extrabold px-3 py-1 rounded-full
                        ${val >= 7 ? 'bg-red-100 text-red-700' : val >= 4 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}
                      `}>
                        {val} / 10
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        {val >= 7 ? 'Severe Pain' : val >= 4 ? 'Moderate Pain' : 'Mild Discomfort'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs font-extrabold text-slate-900">
                      {formatAnswerValue(val)}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InterviewAnswers;
