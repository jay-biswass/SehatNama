import React from 'react';
import { File, Trash2, CheckCircle2, AlertTriangle, RotateCw, Loader2 } from 'lucide-react';

export const UploadedDocumentCard = ({
  name,
  size,
  type,
  status,
  failureReason,
  onRemove,
  onRetry,
  isRetrying = false
}) => {
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

  const isFailed = status === 'extraction_failed';
  const isProcessing = status === 'processing' || status === 'reading' || isRetrying;
  const isSuccess = status === 'extracted' || status === 'completed';

  return (
    <div className={`flex flex-col gap-2 p-3.5 border rounded-xl select-none animate-fade-in ${
      isFailed
        ? 'border-amber-200 bg-amber-50/40'
        : isSuccess
          ? 'border-emerald-100 bg-emerald-50/20'
          : 'border-slate-100 bg-slate-50/50'
    }`}>
      <div className="flex items-center gap-3.5">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          isFailed ? 'bg-amber-100 text-amber-700' : 'bg-teal-50 text-teal-600'
        }`}>
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
          {isProcessing && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-teal-700 animate-pulse bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
              <Loader2 size={11} className="animate-spin" />
              <span>Analyzing...</span>
            </span>
          )}
          {isSuccess && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              <CheckCircle2 size={12} className="stroke-[2.5]" />
              <span>Extracted ✓</span>
            </div>
          )}
          {isFailed && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/60">
              <AlertTriangle size={12} className="stroke-[2.5]" />
              <span>Extraction Failed</span>
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

      {isFailed && (
        <div className="mt-1 pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-[11px] text-amber-900 leading-snug">
            <span className="font-bold block">⚠ Unable to extract information</span>
            <span className="text-amber-700 text-[10px]">
              {failureReason || 'The original document has been saved.'}
            </span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isProcessing}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-sm self-start sm:self-auto disabled:opacity-50"
            >
              <RotateCw size={12} className={isProcessing ? 'animate-spin' : ''} />
              <span>Retry Extraction</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadedDocumentCard;
