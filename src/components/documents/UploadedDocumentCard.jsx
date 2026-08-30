import React from 'react';
import { File, Trash2, CheckCircle2 } from 'lucide-react';

export const UploadedDocumentCard = ({ name, size, type, status, onRemove }) => {
  const formatSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  };

  const getDocTypeLabel = (type) => {
    const types = {
      prescription: 'Prescription',
      lab: 'Lab Report',
      discharge: 'Discharge Summary',
      other: 'Medical Document'
    };
    return types[type] || 'Medical Document';
  };

  return (
    <div className="flex items-center gap-3.5 p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl select-none animate-fade-in">
      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
        <File size={20} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h5 className="font-bold text-xs text-slate-800 truncate leading-snug">{name}</h5>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-0.5">
          <span className="uppercase">{getDocTypeLabel(type)}</span>
          <span>•</span>
          <span>{formatSize(size)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        {status === 'reading' && (
          <span className="text-[10px] font-bold text-teal-600 animate-pulse bg-teal-50 px-2 py-0.5 rounded">
            Scanning...
          </span>
        )}
        {status === 'completed' && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            <CheckCircle2 size={12} className="stroke-[2.5]" />
            <span>Success ✓</span>
          </div>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="text-slate-400 hover:text-red-500 rounded p-1 hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent"
          title="Delete document"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default UploadedDocumentCard;
