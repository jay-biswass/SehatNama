import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

export const DocumentUploader = ({ onUpload, disabled }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  const triggerFileSelect = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onClick={triggerFileSelect}
      className={`border-2 border-dashed border-slate-200 hover:border-teal-500 bg-slate-50/30 hover:bg-teal-50/10 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-3 select-none ${
        disabled ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,application/pdf"
      />
      
      <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
        <UploadCloud size={24} />
      </div>
      
      <div>
        <span className="font-bold text-sm text-slate-800 block mb-0.5">
          📷 Scan or Upload Document
        </span>
        <span className="text-xs text-slate-400 block max-w-[240px] mx-auto leading-relaxed">
          Take a photo of your prescription or report, or upload a file from your device.
        </span>
      </div>
    </div>
  );
};

export default DocumentUploader;
