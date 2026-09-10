import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { healthQuestionFlows } from '../../data/healthQuestionFlows';

export const CaseFilters = ({
  priority = 'all',
  status = 'all',
  concern = 'all',
  sortBy = 'priority_desc',
  search = '',
  onFilterChange,
  totalResults = 0
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        onFilterChange({ search: localSearch });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, search, onFilterChange]);

  // Sync internal state if prop changes externally
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Available health concerns
  const concernOptions = [
    { value: 'all', label: 'All Health Concerns' },
    ...Object.entries(healthQuestionFlows).map(([key, flow]) => ({
      value: key,
      label: flow.title || key.replace(/_/g, ' ')
    }))
  ];

  const priorityTabs = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority', dot: 'bg-red-500' },
    { value: 'medium', label: 'Medium', dot: 'bg-amber-500' },
    { value: 'normal', label: 'Normal', dot: 'bg-emerald-500' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New / Waiting' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'completed', label: 'Completed' }
  ];

  const sortOptions = [
    { value: 'priority_desc', label: 'Sort: Priority (High → Normal)' },
    { value: 'newest', label: 'Sort: Newest First' },
    { value: 'oldest', label: 'Sort: Oldest First' },
    { value: 'status', label: 'Sort: Status' }
  ];

  const clearAllFilters = () => {
    setLocalSearch('');
    onFilterChange({
      priority: 'all',
      status: 'all',
      concern: 'all',
      sortBy: 'priority_desc',
      search: ''
    });
  };

  const hasActiveFilters = priority !== 'all' || status !== 'all' || concern !== 'all' || search !== '' || sortBy !== 'priority_desc';

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] flex flex-col gap-3.5">
      {/* Top Row: Search Input & Dropdowns */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by patient name, mobile, case ID, or concern..."
            className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all font-medium"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                onFilterChange({ search: '' });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdowns Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Health Concern Select */}
          <select
            value={concern}
            onChange={(e) => onFilterChange({ concern: e.target.value })}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {concernOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Row: Priority Pills & Active Status Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
        {/* Priority Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-slate-400 font-bold mr-1 shrink-0">Priority:</span>
          {priorityTabs.map((tab) => {
            const isSelected = priority === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onFilterChange({ priority: tab.value })}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-xs transition-all cursor-pointer shrink-0
                  ${isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'}
                `}
              >
                {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results summary & Reset Button */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-slate-500 font-semibold">
            Showing <strong className="text-slate-900">{totalResults}</strong> {totalResults === 1 ? 'case' : 'cases'}
          </span>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-extrabold text-xs px-2.5 py-1 rounded-full hover:bg-red-50 cursor-pointer transition-colors"
            >
              <X size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseFilters;
