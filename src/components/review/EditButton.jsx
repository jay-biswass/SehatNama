import React from 'react';
import { Edit2 } from 'lucide-react';

export const EditButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-teal-600 hover:text-teal-850 hover:bg-teal-50/50 rounded-lg p-1.5 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
      title="Edit section"
    >
      <Edit2 size={14} className="stroke-[2.5]" />
    </button>
  );
};

export default EditButton;
