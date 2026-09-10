import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, ShieldAlert, Heart, Search, Filter } from 'lucide-react';

export const DoctorHeader = ({ onMenuClick, alertsCount = 0 }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30 select-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
      {/* Left: Mobile Menu Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/doctor/dashboard')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Heart size={22} className="fill-white stroke-blue-600" />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-none">
              SehatNama
            </span>
            <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">
              Clinical Doctor Portal
            </span>
          </div>
        </div>
      </div>

      {/* Right Actions: Realtime live pill, Notification Bell & Doctor Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Realtime Live Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Realtime Live</span>
        </div>

        {/* Priority Notification Bell */}
        <button
          onClick={() => navigate('/doctor/cases?priority=high')}
          className="relative p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 hover:text-slate-900 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer"
          title="Priority Triage Alerts"
        >
          <Bell size={20} className="text-slate-700" />
          {alertsCount > 0 ? (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white animate-pulse shadow-sm">
              {alertsCount > 9 ? '9+' : alertsCount}
            </span>
          ) : (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        {/* Doctor Profile Avatar */}
        <div
          onClick={() => navigate('/doctor/profile')}
          className="flex items-center gap-3 pl-2 sm:pl-3 sm:border-l border-slate-200 cursor-pointer group"
        >
          <div className="relative">
            <img
              src="/doctor_hero.jpg"
              alt="Doctor Avatar"
              className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm items-center justify-center hidden shadow-md">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'D'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate max-w-[130px]">
              {profile?.full_name || 'Dr. Ananya Sharma'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Attending Physician
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DoctorHeader;
