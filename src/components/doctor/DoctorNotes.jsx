import React, { useState } from 'react';
import { Stethoscope, Lock, Send, Check, Clock, User } from 'lucide-react';
import Button from '../ui/Button';

export const DoctorNotes = ({
  notes = [],
  onSaveNote,
  isSaving = false,
  doctorProfile = {}
}) => {
  const [noteText, setNoteText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim() || isSaving) return;

    const result = await onSaveNote(noteText.trim());
    if (result) {
      setNoteText('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
            <Stethoscope size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Doctor Clinical Notes & Observations
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Private physician records protected by Row Level Security (RLS)
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full">
          <Lock size={11} className="text-amber-600" />
          <span>Physician Eyes Only</span>
        </span>
      </div>

      {/* Note Input Box */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          rows={3}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add clinical triage notes, diagnostic hypotheses, recommended investigations, or follow-up instructions..."
          className="w-full p-4 text-xs bg-slate-50/80 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 resize-none transition-all leading-relaxed font-medium"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-semibold">
            Signed by: <strong className="text-slate-800">{doctorProfile.full_name || 'Attending Physician'}</strong>
          </span>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1 animate-fade-in">
                <Check size={14} />
                <span>Note saved securely!</span>
              </span>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={!noteText.trim() || isSaving}
              icon={isSaving ? undefined : <Send size={14} />}
              className="px-5 py-2.5 text-xs font-extrabold rounded-full"
            >
              {isSaving ? 'Saving...' : 'Save Notes'}
            </Button>
          </div>
        </div>
      </form>

      {/* Historical Notes Timeline */}
      {notes.length > 0 && (
        <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Previous Clinical Notes ({notes.length})
          </span>

          <div className="flex flex-col gap-2.5">
            {notes.map((noteItem) => (
              <div
                key={noteItem.id}
                className="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl flex flex-col gap-1.5 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1.5 border-b border-slate-200/50">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <User size={13} className="text-blue-600" />
                    <span>{noteItem.doctor_name || 'Attending Physician'}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 font-medium">
                    <Clock size={11} />
                    <span>{formatDate(noteItem.created_at)}</span>
                  </span>
                </div>
                <p className="text-slate-800 font-semibold whitespace-pre-wrap leading-relaxed pt-1">
                  {noteItem.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorNotes;
