import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell } from 'lucide-react';

import logoIcon from '../../assets/SehatNama_Logo.png';

export const DoctorHeader = ({ onMenuClick, alertsCount = 0 }) => {
  const { doctorProfile: profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="glass-strong border-b border-[var(--color-border)] px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Menu Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-slate-100 border border-[var(--color-border)] transition-colors cursor-pointer"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/doctor/dashboard')}>
          <img src={logoIcon} alt="SehatNama" className="h-8 w-auto object-contain shrink-0" />
          <div className="hidden sm:block">
            <span className="font-semibold text-base text-[var(--color-text-primary)] tracking-tight block leading-none">
              SehatNama
            </span>
            <span className="text-[9px] text-[var(--color-text-muted)] font-medium tracking-wider uppercase">
              Doctor Portal
            </span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Realtime Live Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-success)] bg-emerald-50/60 border border-emerald-200/40 px-2.5 py-1 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          <span>Live</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/doctor/cases?priority=high')}
          className="relative p-2 rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-slate-100 border border-[var(--color-border)] transition-all cursor-pointer"
          title="Priority Triage Alerts"
        >
          <Bell size={18} />
          {alertsCount > 0 ? (
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[var(--color-danger)] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              {alertsCount > 9 ? '9+' : alertsCount}
            </span>
          ) : (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-danger)]" />
          )}
        </button>

        {/* Doctor Profile Avatar */}
        <div
          onClick={() => navigate('/doctor/profile')}
          className="flex items-center gap-2.5 pl-3 border-l border-[var(--color-border)] cursor-pointer group"
        >
          <div className="relative">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile?.full_name || 'Doctor'}
                className="w-8 h-8 rounded-[var(--radius-sm)] object-cover border border-[var(--color-border)] group-hover:ring-2 group-hover:ring-[var(--color-primary)]/20 transition-all"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-semibold text-xs flex items-center justify-center ${profile?.avatar_url ? 'hidden' : 'flex'}`}>
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'Dr'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--color-success)] border-2 border-white rounded-full" />
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-primary)] transition-colors truncate max-w-[120px]">
              {profile?.full_name || 'Attending Physician'}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] font-medium truncate max-w-[120px]">
              {profile?.specialization || 'Not provided'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DoctorHeader;
