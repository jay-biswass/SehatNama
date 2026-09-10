import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  UserCircle, 
  LogOut, 
  Heart,
  Stethoscope,
  X,
  ExternalLink,
  MessageSquare,
  FileText
} from 'lucide-react';

export const DoctorSidebar = ({ isOpen, onClose }) => {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/doctor/login');
  };

  const navItems = [
    {
      to: '/doctor/dashboard',
      label: 'Home',
      icon: <LayoutDashboard size={18} />
    },
    {
      to: '/doctor/cases',
      label: 'Patient Queue',
      icon: <Users size={18} />
    },
    {
      to: '/doctor/cases?priority=high',
      label: 'Priority Alerts',
      icon: <AlertTriangle size={18} className="text-red-400" />,
      badge: 'Urgent'
    },
    {
      to: '/doctor/profile',
      label: 'Doctor Profile',
      icon: <UserCircle size={18} />
    }
  ];

  const isPriorityActive = location.pathname === '/doctor/cases' && location.search.includes('priority=high');

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`
          fixed lg:static top-0 left-0 bottom-0 z-50
          w-64 bg-slate-950 text-slate-100 flex flex-col justify-between
          border-r border-slate-800/80 transition-transform duration-300 ease-in-out select-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Branding & Profile Summary */}
        <div className="p-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate('/doctor/dashboard')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Heart size={20} className="fill-white stroke-blue-600" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight block leading-none">
                  SehatNama
                </span>
                <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase flex items-center gap-1 mt-0.5">
                  <Stethoscope size={10} />
                  <span>DOCTOR PORTAL</span>
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Doctor Profile Card */}
          <div className="p-3 bg-slate-900/90 border border-slate-800/90 rounded-2xl flex items-center gap-3 shadow-inner">
            <img
              src="/doctor_hero.jpg"
              alt="Doctor Avatar"
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 font-bold text-xs hidden items-center justify-center border border-blue-500/30 shrink-0">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'D'}
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate block">
                {profile?.full_name || 'Dr. Ananya Sharma'}
              </span>
              <span className="text-[10px] text-blue-400 font-medium truncate block">
                {profile?.specialization || 'Attending Physician'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
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
                    flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-slate-800/80 flex flex-col gap-2">
          {/* Link to Patient Portal */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              <span>Patient Portal</span>
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-bold">Preview</span>
          </a>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out Doctor</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DoctorSidebar;
