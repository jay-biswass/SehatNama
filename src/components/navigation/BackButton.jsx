import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BackButton = ({ to, onClick, className = '' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors duration-200 cursor-pointer select-none ${className}`}
    >
      <ArrowLeft size={16} />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
