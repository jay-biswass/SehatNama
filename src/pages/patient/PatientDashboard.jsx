import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePatient } from '../../context/PatientContext';
import caseService from '../../services/caseService';
import { 
  Heart, 
  UserCircle, 
  LogOut, 
  PlusCircle, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Stethoscope,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Activity,
  Phone,
  Mail
} from 'lucide-react';
import Button from '../../components/ui/Button';

import logoIcon from '../../assets/SehatNama_Logo.png';

export const PatientDashboard = () => {
  const navigate = useNavigate();
  const { patientUser: user, patientProfile: profile, signOutPatient: signOut } = useAuth();
  const { resetPatientData, updatePatientData } = usePatient();

  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPatientCases = useCallback(async () => {
    if (!user?.id) return;
    setIsRefreshing(true);
    try {
      const { data } = await caseService.getPatientCases(user.id);
      setCases(data || []);
    } catch (err) {
      console.error('[PatientDashboard] Error loading cases:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadPatientCases();
  }, [loadPatientCases]);

  const handleStartNewCheckIn = () => {
    resetPatientData();
    // Pre-populate patient profile details into the check-in context
    if (profile) {
      updatePatientData({
        patientName: profile.full_name || '',
        email: profile.email || '',
        mobileNumber: profile.phone || ''
      });
    }
    navigate('/check-in');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const formatComplaint = (c) => {
    if (!c) return 'General Health Check-in';
    return c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 size={11} />
            <span>Consultation Completed</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Stethoscope size={11} />
            <span>Under Review</span>
          </span>
        );
      case 'waiting_for_doctor':
      case 'submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <Clock size={11} />
            <span>Waiting for Doctor</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
            <Activity size={11} />
            <span>In Progress</span>
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    if (priority?.toLowerCase() === 'high') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200">
          Urgent Attention
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
        Routine
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Patient Portal Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="SehatNama" className="h-10 w-auto object-contain shrink-0" />
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-none">
                SehatNama
              </span>
              <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
                Patient Health Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col gap-6">
        
        {/* 1. Patient Profile Greeting & Quick Actions */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 text-center md:text-left flex-col sm:flex-row w-full md:w-auto">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-teal-500/20 shrink-0">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'P'}
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                  {profile?.full_name || 'Patient'}
                </h1>
                <span className="flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={12} className="text-teal-600" />
                  <span>Verified Patient</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 mt-0.5 font-medium">
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-slate-400" />
                  <span>{profile?.email || user?.email}</span>
                </span>
                {profile?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-slate-400" />
                    <span>+91 {profile.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action to Start New Intake */}
          <div className="w-full md:w-auto shrink-0">
            <Button
              size="lg"
              onClick={handleStartNewCheckIn}
              className="w-full md:w-auto py-3.5 px-6 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-md shadow-teal-600/20"
              icon={<PlusCircle size={18} />}
            >
              Start New Health Check-in
            </Button>
          </div>
        </div>

        {/* 2. Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <FileText size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block">Total Submissions</span>
              <span className="text-2xl font-extrabold text-slate-900">{cases.length}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block">Active / Pending</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {cases.filter(c => c.status !== 'completed').length}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block">Completed Reviews</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {cases.filter(c => c.status === 'completed').length}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Case Consultation History */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Your Health Submissions & History
              </h2>
            </div>

            <button
              onClick={loadPatientCases}
              disabled={isRefreshing}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-teal-600' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {isLoading ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-xs text-slate-400">
              Loading your medical consultation records...
            </div>
          ) : cases.length > 0 ? (
            <div className="flex flex-col gap-3">
              {cases.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Stethoscope size={20} />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {formatComplaint(item.chief_complaint)}
                        </span>
                        {getPriorityBadge(item.priority_level)}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{new Date(item.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </span>
                        <span>Case ID: #{item.id.substring(0, 8)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <FileText size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No consultation records yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                When you complete an intake check-in, your symptoms and doctor review status will appear here.
              </p>
              <Button
                size="sm"
                onClick={handleStartNewCheckIn}
                className="mt-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-full px-5 py-2.5"
                icon={<PlusCircle size={15} />}
              >
                Start First Check-in
              </Button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default PatientDashboard;
