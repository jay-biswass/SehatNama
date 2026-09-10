import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowRight, X, ShieldAlert, Heart } from 'lucide-react';

export const RealtimeToast = ({ notification, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const isHigh = notification.priority === 'high' || notification.priority_level === 'high';

  return (
    <div className={`
      fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border rounded-2xl p-4 shadow-2xl animate-slide-in-right select-none
      ${isHigh ? 'border-red-400 ring-2 ring-red-400/20' : 'border-teal-400 ring-2 ring-teal-400/20'}
    `}>
      <div className="flex items-start gap-3">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0
          ${isHigh ? 'bg-red-600 shadow-md shadow-red-200' : 'bg-teal-600 shadow-md shadow-teal-200'}
        `}>
          {isHigh ? <ShieldAlert size={20} /> : <Bell size={20} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isHigh ? 'text-red-600' : 'text-teal-700'}`}>
              {isHigh ? '🚨 High Priority Alert' : '🔔 New Patient Case'}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <h4 className="text-xs font-bold text-slate-900 mt-0.5 truncate">
            {notification.title || 'New application received'}
          </h4>

          <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-2">
            {notification.message || 'A patient has just completed their intake session.'}
          </p>

          {notification.caseId && (
            <button
              onClick={() => {
                navigate(`/doctor/cases/${notification.caseId}`);
                onClose();
              }}
              className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
            >
              <span>Review Case</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealtimeToast;
