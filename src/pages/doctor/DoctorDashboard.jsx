import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import DashboardStats from '../../components/doctor/DashboardStats';
import CaseFilters from '../../components/doctor/CaseFilters';
import CaseTable from '../../components/doctor/CaseTable';
import CaseCard from '../../components/doctor/CaseCard';
import doctorService from '../../services/doctorService';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  Inbox, 
  Sparkles,
  ShieldAlert,
  Search,
  Filter,
  Stethoscope,
  TestTube2,
  Pill,
  ShieldCheck,
  Calendar,
  Heart,
  ChevronRight,
  Clock,
  BookOpen
} from 'lucide-react';
import Button from '../../components/ui/Button';

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [stats, setStats] = useState({
    totalCases: 0,
    newCases: 0,
    highPriority: 0,
    mediumPriority: 0,
    underReview: 0,
    completed: 0,
    activeAlerts: 0
  });

  const [cases, setCases] = useState([]);
  const [totalCases, setTotalCases] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    concern: 'all',
    search: '',
    sortBy: 'priority_desc',
    page: 1,
    limit: 15
  });

  const loadDashboardData = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setIsRefreshing(true);

    try {
      // 1. Fetch real dashboard statistics
      const { data: statsData } = await doctorService.getDashboardStats();
      if (statsData) setStats(statsData);

      // 2. Fetch recent patient cases matching filters
      const { data: casesData, total } = await doctorService.getCases(filters);
      if (casesData) {
        setCases(casesData);
        setTotalCases(total || casesData.length);
      }
    } catch (err) {
      console.error('[DoctorDashboard] Data load error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Realtime incoming case or alert
  const handleRealtimeEvent = useCallback(() => {
    loadDashboardData(false);
  }, [loadDashboardData]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  };

  const handleStatClick = (statId) => {
    if (statId === 'new') {
      handleFilterChange({ status: 'new', priority: 'all' });
    } else if (statId === 'high_priority') {
      handleFilterChange({ priority: 'high', status: 'all' });
    } else if (statId === 'medium_priority') {
      handleFilterChange({ priority: 'medium', status: 'all' });
    } else {
      handleFilterChange({ priority: 'all', status: 'all' });
    }
  };

  // Extract recent high-priority case if any for the featured hero card
  const featuredHighCase = cases.find(c => c.priority_level?.toLowerCase() === 'high');

  return (
    <DoctorLayout onRealtimeEvent={handleRealtimeEvent}>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
        
        {/* ========================================================================= */}
        {/* 1. HERO GREETING SECTION (Matching Reference Design Header) */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-sky-50/60 border border-blue-100/60 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.06)] relative overflow-hidden">
          {/* Subtle Decorative Backdrop Elements */}
          <div className="absolute top-0 right-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text */}
          <div className="flex flex-col gap-1.5 text-center sm:text-left z-10 max-w-xl">
            <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
              Good Morning,
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Take care of <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">your health.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
              Welcome back, <strong className="text-slate-800">{profile?.full_name || 'Dr. Ananya Sharma'}</strong>. Review clinical triage applications and triage urgent patient cases in real-time.
            </p>
          </div>

          {/* Right Hero Image (Reference Doctor Graphic with Circular Backdrop) */}
          <div className="relative shrink-0 z-10">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-blue-400/30 to-sky-200/50 p-2 shadow-lg shadow-blue-500/10 flex items-center justify-center">
              <img
                src="/doctor_hero.jpg"
                alt="Doctor Illustration"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl hidden items-center justify-center shadow-md">
                DS
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ROUNDED PILL SEARCH BAR (Matching Reference Image) */}
        {/* ========================================================================= */}
        <div className="relative w-full shadow-[0_8px_25px_-5px_rgba(0,0,0,0.04)]">
          <div className="flex items-center bg-white border border-slate-200/80 rounded-full p-2 pl-5 transition-all focus-within:ring-4 focus-within:ring-blue-500/15 focus-within:border-blue-500">
            <Search size={18} className="text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="Search doctors, specialties, patient names, or case ID..."
              className="w-full text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
            />

            <button
              type="button"
              onClick={() => handleFilterChange({ priority: 'all', status: 'all', concern: 'all' })}
              className="w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 transition-colors cursor-pointer ml-2"
              title="Filter Options"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. VIBRANT HERO BLUE CARD (Matching Reference "Book Appointment" Banner) */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#1d4ed8] rounded-3xl p-6 sm:p-8 text-white shadow-[0_15px_35px_-10px_rgba(37,99,235,0.35)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Background Glow Spheres */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />

          {/* Card Left Text & Action Button */}
          <div className="flex flex-col gap-2 text-center sm:text-left z-10 max-w-md">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-100 bg-white/15 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0 backdrop-blur-xs">
              Clinical Triage Portal
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              Book Appointment & Clinical Queue
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Consult with trusted patients and review intake records anytime.
            </p>

            <div className="mt-3">
              <button
                onClick={() => navigate('/doctor/cases')}
                className="bg-white text-[#2563eb] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-50 hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Review Cases Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Card Right 3D Badge (Reference Calendar Graphic) */}
          <div className="relative z-10 shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 p-4 flex flex-col items-center justify-center text-white shadow-inner">
              <Calendar size={44} className="stroke-white text-white drop-shadow-md" />
              <div className="flex items-center gap-1 bg-white text-blue-600 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold mt-2 shadow-sm">
                <ShieldCheck size={12} className="text-blue-600" />
                <span>Confirmed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. OUR SERVICES CATEGORIES (Matching Reference Services Grid) */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Our Services
            </h3>

            <button
              onClick={() => navigate('/doctor/cases')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View all</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* 4 Services Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* 1. Consultation */}
            <div
              onClick={() => handleFilterChange({ concern: 'chest_pain' })}
              className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center text-center gap-2 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Stethoscope size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 block">Consultation</h4>
                <span className="text-[10px] text-slate-400 font-medium block">Talk to a doctor</span>
              </div>
            </div>

            {/* 2. Lab Tests */}
            <div
              onClick={() => navigate('/doctor/cases')}
              className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center text-center gap-2 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-2xs group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <TestTube2 size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 block">Lab Tests</h4>
                <span className="text-[10px] text-slate-400 font-medium block">Book test easily</span>
              </div>
            </div>

            {/* 3. Medication */}
            <div
              onClick={() => navigate('/doctor/cases')}
              className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center text-center gap-2 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Pill size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 block">Medication</h4>
                <span className="text-[10px] text-slate-400 font-medium block">Get your meds</span>
              </div>
            </div>

            {/* 4. Health Checkup */}
            <div
              onClick={() => navigate('/doctor/cases')}
              className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center text-center gap-2 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-2xs group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 block">Health Checkup</h4>
                <span className="text-[10px] text-slate-400 font-medium block">Full body checkup</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. DYNAMIC STATISTICS METRICS CARDS */}
        {/* ========================================================================= */}
        <div className="mt-2">
          <DashboardStats
            stats={stats}
            activeFilter={filters.priority === 'high' ? 'high_priority' : filters.priority === 'medium' ? 'medium_priority' : filters.status === 'new' ? 'new' : ''}
            onStatClick={handleStatClick}
            isLoading={isLoading}
          />
        </div>

        {/* ========================================================================= */}
        {/* 6. UPCOMING / RECENT PATIENT APPLICATIONS QUEUE */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Patient Applications Queue
              </h3>
            </div>

            <button
              onClick={() => loadDashboardData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-blue-600' : ''} />
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Filter Toolbar */}
          <CaseFilters
            priority={filters.priority}
            status={filters.status}
            concern={filters.concern}
            sortBy={filters.sortBy}
            search={filters.search}
            onFilterChange={handleFilterChange}
            totalResults={totalCases}
          />

          {/* Queue View: Table for Desktop, Sleek Cards for Mobile */}
          {isLoading ? (
            <CaseTable cases={[]} isLoading={true} />
          ) : cases.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <CaseTable cases={cases} isLoading={false} />
              </div>

              {/* Mobile Card Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
                {cases.map((c) => (
                  <CaseCard key={c.id} caseItem={c} />
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)]">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Inbox size={28} />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-800">
                  No patient applications found
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                  {filters.search || filters.priority !== 'all' || filters.status !== 'all' || filters.concern !== 'all'
                    ? 'No cases match your active filters. Try adjusting your search query or priority filters.'
                    : 'New patient intake submissions from the Patient Portal will appear here automatically.'}
                </p>
              </div>

              {(filters.search || filters.priority !== 'all' || filters.status !== 'all' || filters.concern !== 'all') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleFilterChange({ priority: 'all', status: 'all', concern: 'all', search: '' })}
                  className="mt-2 text-xs"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 7. HEALTH INSIGHTS CARD (Matching Reference Image Health Insights Section) */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Health Insights
            </h3>

            <button
              onClick={() => navigate('/doctor/cases')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View all</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-50/80 via-white to-sky-50/50 border border-blue-100 rounded-3xl p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-md">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-full w-fit">
                Clinical Guide
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                How to maintain a healthy heart & triage chest discomfort
              </h4>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                <Clock size={12} />
                5 min read • Clinical Cardiology Standard
              </span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 shadow-2xs">
              <Heart size={32} className="fill-rose-500 stroke-white" />
            </div>
          </div>
        </div>

      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
