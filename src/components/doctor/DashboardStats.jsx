import React from 'react';
import { 
  Inbox, 
  AlertTriangle, 
  Activity, 
  Files, 
  ArrowUpRight
} from 'lucide-react';

export const DashboardStats = ({ stats = {}, activeFilter = '', onStatClick, isLoading = false }) => {
  const cards = [
    {
      id: 'new',
      title: 'New Cases',
      subtitle: 'Awaiting triage',
      count: stats.newCases ?? 0,
      icon: <Inbox className="w-5 h-5 text-blue-600" />,
      iconBg: 'bg-blue-50/80 border-blue-100',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
      accentColor: 'text-slate-900'
    },
    {
      id: 'high_priority',
      title: 'High Priority',
      subtitle: 'Priority review needed',
      count: stats.highPriority ?? 0,
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      iconBg: 'bg-red-50/80 border-red-100',
      badgeColor: 'text-red-700 bg-red-50 border-red-200',
      accentColor: 'text-red-600',
      isUrgent: stats.highPriority > 0
    },
    {
      id: 'medium_priority',
      title: 'Medium Priority',
      subtitle: 'Medical review recommended',
      count: stats.mediumPriority ?? 0,
      icon: <Activity className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-50/80 border-amber-100',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      accentColor: 'text-amber-600'
    },
    {
      id: 'total',
      title: 'Total Applications',
      subtitle: 'All patient submissions',
      count: stats.totalCases ?? 0,
      icon: <Files className="w-5 h-5 text-indigo-600" />,
      iconBg: 'bg-indigo-50/80 border-indigo-100',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      accentColor: 'text-indigo-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white border border-slate-100 rounded-3xl p-5 h-32 flex flex-col justify-between shadow-[0_4px_20px_0_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-start">
              <div className="h-4 bg-slate-200 rounded w-20 mb-2" />
              <div className="w-10 h-10 bg-slate-100 rounded-2xl" />
            </div>
            <div className="h-8 bg-slate-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onStatClick && onStatClick(card.id)}
            className={`
              relative bg-white border rounded-3xl p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] transition-all duration-300
              flex flex-col justify-between cursor-pointer select-none group
              hover:shadow-[0_10px_30px_-5px_rgba(37,99,235,0.12)] hover:-translate-y-1
              ${isSelected ? 'border-blue-500 ring-4 ring-blue-500/15 bg-blue-50/20' : 'border-slate-100'}
            `}
          >
            {/* Top Icon & Arrow */}
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl border ${card.iconBg} shadow-2xs group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>

              <div className="p-1.5 rounded-full text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </div>

            {/* Title & Count */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between gap-1">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${card.accentColor}`}>
                  {card.count}
                </span>

                {card.isUrgent && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100/90 px-2 py-0.5 rounded-full animate-pulse">
                    Urgent
                  </span>
                )}
              </div>

              <h4 className="text-xs font-bold text-slate-800 mt-1">
                {card.title}
              </h4>
              <p className="text-[10px] font-medium text-slate-400 truncate">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
