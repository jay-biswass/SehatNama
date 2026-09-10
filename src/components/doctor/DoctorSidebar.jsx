import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  UserCircle, 
  LogOut, 
  Stethoscope,
  X,
  ExternalLink
} from 'lucide-react';

import logoIcon from '../../assets/SehatNama_Logo.png';

export const DoctorSidebar = ({ isOpen, onClose }) => {
  const { signOutDoctor, doctorProfile: profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOutDoctor();
    navigate('/doctor/login');
  };

  const navItems = [
    {
      to: '/doctor/dashboard',
      label: 'Home',
      icon: <LayoutDashboard size={17} />
    },
    {
      to: '/doctor/cases',
      label: 'Patient Queue',
      icon: <Users size={17} />
    },
    {
      to: '/doctor/cases?priority=high',
      label: 'Priority Alerts',
      icon: <AlertTriangle size={17} />,
      badge: 'Urgent'
    },
    {
      to: '/doctor/profile',
      label: 'Doctor Profile',
      icon: <UserCircle size={17} />
    }
  ];

  const isPriorityActive = location.pathname === '/doctor/cases' && location.search.includes('priority=high');

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`
          fixed lg:static top-0 left-0 bottom-0 z-50
          w-60 bg-slate-950 text-slate-100 flex flex-col justify-between
          border-r border-slate-800/50 transition-transform duration-300 ease-in-out select-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Branding & Profile */}
        <div className="p-4 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate('/doctor/dashboard')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img src={logoIcon} alt="SehatNama" className="h-8 w-auto object-contain shrink-0" />
              <div>
                <span className="font-semibold text-sm text-white tracking-tight block leading-none">
                  SehatNama
                </span>
                <span className="text-[9px] text-slate-500 font-medium tracking-wider uppercase flex items-center gap-1 mt-0.5">
                  <Stethoscope size={9} />
                  <span>Doctor Portal</span>
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Doctor Profile Card */}
          <div className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-[var(--radius-sm)] flex items-center gap-2.5">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile?.full_name || 'Doctor'}
                className="w-8 h-8 rounded-md object-cover border border-slate-700 shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-8 h-8 rounded-md bg-[var(--color-primary)]/20 text-teal-400 font-semibold text-xs flex items-center justify-center border border-teal-500/20 shrink-0 ${profile?.avatar_url ? 'hidden' : 'flex'}`}>
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'Dr'}
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-white truncate block">
                {profile?.full_name || 'Physician'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium truncate block">
                {profile?.specialization || 'Not provided'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isExactPriority = item.to.includes('priority=high');
              const isActive = isExactPriority
                ? isPriorityActive
                : location.pathname === item.to && !location.search.includes('priority=high');

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] text-[13px] font-medium transition-all
                    ${isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/50 flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] text-[13px] font-medium text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              <span>Patient Portal</span>
            </span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] text-[13px] font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DoctorSidebar;
