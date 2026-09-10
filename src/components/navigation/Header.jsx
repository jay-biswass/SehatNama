import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePatient } from '../../context/PatientContext';
import { useAuth } from '../../context/AuthContext';
import { RotateCcw } from 'lucide-react';
import logoIcon from '../../assets/SehatNama_Logo.png';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPatientData } = usePatient();
  const { patientUser: user, isPatient } = useAuth();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset? All entered details will be cleared.")) {
      resetPatientData();
      navigate('/');
    }
  };

  return (
    <header className="glass-strong border-b border-[var(--color-border)] px-5 sm:px-8 py-3.5 flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => navigate('/')}>
        <img src={logoIcon} alt="SehatNama" className="h-8 w-auto object-contain shrink-0" />
        <div>
          <span className="font-semibold text-base text-[var(--color-text-primary)] tracking-tight block leading-none">SehatNama</span>
          <span className="text-[9px] text-[var(--color-text-muted)] font-medium tracking-wider uppercase">Patient Portal</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {user && isPatient ? (
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-muted)] hover:bg-[var(--color-primary-light)] border border-[var(--color-primary)]/15 rounded-[var(--radius-sm)] transition-all cursor-pointer"
          >
            <span>My Dashboard</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] border border-[var(--color-border)] rounded-[var(--radius-sm)] transition-all cursor-pointer"
          >
            <span>Sign In</span>
          </button>
        )}

        <button
          onClick={() => navigate('/doctor/dashboard')}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-slate-50 rounded-[var(--radius-sm)] transition-all cursor-pointer"
          title="Switch to Doctor Dashboard"
        >
          <span>Doctor Portal</span>
        </button>

        {location.pathname !== '/' && location.pathname !== '/success' && (
          <button 
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-red-50/50 rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer"
            title="Reset Check-in"
          >
            <RotateCcw size={13} />
            <span className="hidden md:inline">Reset</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
