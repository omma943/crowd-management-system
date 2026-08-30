import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useCrowdData } from '../context/CrowdContext';
import { AnalyticsSummary } from '../components/analytics/AnalyticsSummary';
import { BusiestHourCard } from '../components/analytics/BusiestHourCard';
import { CrowdTrendChart } from '../components/dashboard/CrowdTrendChart';
import { EntryExitChart } from '../components/dashboard/EntryExitChart';
import { DailyTrendChart } from '../components/analytics/DailyTrendChart';

export const Analytics: React.FC = () => {
  const { stats, history, setHistoryPeriod } = useCrowdData();
  const [selectedRange, setSelectedRange] = useState<'today' | 'yesterday' | '7days' | '30days'>('today');

  const handlePeriodChange = (period: 'today' | 'yesterday' | '7days' | '30days') => {
    setSelectedRange(period);
    setHistoryPeriod(period);
  };

  const isDailyView = selectedRange === '7days' || selectedRange === '30days';

  return (
    <div className="space-y-6">
      {/* Top Header & Range Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md transition-all duration-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Crowd Analytics & Flow Intelligence</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aggregated Traffic Trends, Peak Distribution, and Gate Load
              </p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-inner">
          {[
            { id: 'today' as const, label: 'Today' },
            { id: 'yesterday' as const, label: 'Yesterday' },
            { id: '7days' as const, label: 'Last 7 Days' },
            { id: '30days' as const, label: 'Last 30 Days' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handlePeriodChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                selectedRange === tab.id
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <AnalyticsSummary stats={stats} />

      {/* Busiest Hour Highlight */}
      <BusiestHourCard busiestHour={stats.busiest_hour} count={stats.busiest_hour_count} />

      {/* Primary Analytics Charts */}
      {isDailyView ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyTrendChart data={history} title={`Daily Attendance (${selectedRange})`} />
          <EntryExitChart data={history} title={`Daily Entry vs Exit (${selectedRange})`} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CrowdTrendChart data={history} title={`Hourly Crowd Trend (${selectedRange})`} />
          <EntryExitChart data={history} title={`Hourly Entry vs Exit Flow (${selectedRange})`} />
        </div>
      )}
    </div>
  );
};
