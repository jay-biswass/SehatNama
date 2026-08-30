import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import { RefreshCw, Heart } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPatientData } = usePatient();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset? All entered details will be cleared.")) {
      resetPatientData();
      navigate('/');
    }
  };

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => navigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-100">
          <Heart size={20} className="fill-white stroke-teal-600" />
        </div>
        <div>
          <span className="font-bold text-lg text-teal-800 tracking-tight block leading-none">SehatNama</span>
          <span className="text-[9px] text-slate-400 font-medium tracking-wider uppercase">PATIENT PORTAL</span>
        </div>
      </div>
      
      {location.pathname !== '/' && location.pathname !== '/success' && (
        <button 
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
          title="Reset Check-in"
        >
          <RefreshCw size={14} />
          <span>Reset Session</span>
        </button>
      )}
    </header>
  );
};

export default Header;
