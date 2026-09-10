import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import CaseFilters from '../../components/doctor/CaseFilters';
import CaseTable from '../../components/doctor/CaseTable';
import CaseCard from '../../components/doctor/CaseCard';
import doctorService from '../../services/doctorService';
import { Users, ChevronLeft, ChevronRight, Inbox, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';

export const DoctorCases = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlPriority = searchParams.get('priority') || 'all';
  const urlStatus = searchParams.get('status') || 'all';
  const urlConcern = searchParams.get('concern') || 'all';

  const [cases, setCases] = useState([]);
  const [totalCases, setTotalCases] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    priority: urlPriority,
    status: urlStatus,
    concern: urlConcern,
    search: '',
    sortBy: 'priority_desc',
    page: 1,
    limit: 15
  });

  // Sync state if URL query params change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priority: urlPriority,
      status: urlStatus,
      concern: urlConcern
    }));
  }, [urlPriority, urlStatus, urlConcern]);

  const loadCases = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setIsRefreshing(true);

    try {
      const { data, total } = await doctorService.getCases(filters);
      if (data) {
        setCases(data);
        setTotalCases(total || data.length);
      }
    } catch (err) {
      console.error('[DoctorCases] Load error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters, page: 1 };
      // Update URL query params
      const params = {};
      if (updated.priority !== 'all') params.priority = updated.priority;
      if (updated.status !== 'all') params.status = updated.status;
      if (updated.concern !== 'all') params.concern = updated.concern;
      setSearchParams(params);
      return updated;
    });
  };

  const totalPages = Math.ceil(totalCases / filters.limit) || 1;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <DoctorLayout onRealtimeEvent={() => loadCases(false)}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Users size={24} className="text-teal-700" />
              <span>Patient Applications</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
              Complete queue of submitted cases with priority triage indicators.
            </p>
          </div>

          <button
            onClick={() => loadCases(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-teal-600' : ''} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Filters Bar */}
        <CaseFilters
          priority={filters.priority}
          status={filters.status}
          concern={filters.concern}
          sortBy={filters.sortBy}
          search={filters.search}
          onFilterChange={handleFilterChange}
          totalResults={totalCases}
        />

        {/* Case Queue Table / Cards */}
        {isLoading ? (
          <CaseTable cases={[]} isLoading={true} />
        ) : cases.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <CaseTable cases={cases} isLoading={false} />
            </div>

            {/* Mobile Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
              {cases.map((c) => (
                <CaseCard key={c.id} caseItem={c} />
              ))}
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs text-xs">
                <span className="text-slate-500 font-medium">
                  Page <strong className="text-slate-800">{filters.page}</strong> of <strong className="text-slate-800">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page <= 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-semibold"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-semibold"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
              <Inbox size={28} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">
                No matching applications found
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Try removing some filters or searching with a different keyword.
              </p>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorCases;
