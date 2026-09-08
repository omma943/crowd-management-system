import React from 'react';
import {
  Clock,
  Users,
  Lightbulb,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import { useCrowdData } from '../context/CrowdContext';
import { usePlace } from '../context/PlaceContext';
import { DailyTrendChart } from '../components/analytics/DailyTrendChart';
import { BusiestHourCard } from '../components/analytics/BusiestHourCard';
import { AnalyticsSummary } from '../components/analytics/AnalyticsSummary';

export const Analytics: React.FC = () => {
  const { history, historyPeriod, setHistoryPeriod, stats } = useCrowdData();
  const { selectedPlace } = usePlace();

  return (
    <div className="space-y-6 pb-12">
      {/* Location Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/30 uppercase">
              Intelligence & Trends
            </span>
            <span className="text-xs text-slate-400">• {selectedPlace.city}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Analytics & Insights — {selectedPlace.shortName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Historical footfall intelligence and automated crowd behavioral patterns
          </p>
        </div>

        {/* Time Period Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
          {(
            [
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: '7days', label: 'This Week' },
              { id: '30days', label: 'This Month' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setHistoryPeriod(item.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                historyPeriod === item.id
                  ? 'bg-cyan-500 text-white shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Key Statistical Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Peak Time */}
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            <Clock className="h-4 w-4" />
            <span>PEAK TIME</span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {selectedPlace.peakTime}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {selectedPlace.peakCrowd.toLocaleString()} people recorded
          </div>
        </div>

        {/* Least Crowded Time */}
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            <Users className="h-4 w-4" />
            <span>LEAST CROWDED</span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {selectedPlace.leastCrowdedTime}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {selectedPlace.leastCrowdedCount.toLocaleString()} people recorded
          </div>
        </div>

        {/* Average Occupancy */}
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
            <BarChart2 className="h-4 w-4" />
            <span>AVERAGE OCCUPANCY</span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {selectedPlace.averageOccupancy}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Based on historical visitor logs
          </div>
        </div>
      </div>

      {/* AI Behavioral Insights Box */}
      <div className="p-5 rounded-3xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-500/10 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
              AI BEHAVIORAL INSIGHTS — {selectedPlace.shortName}
            </h3>
            <p className="text-[11px] text-slate-500">
              Machine learning observations from visitor trends
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {selectedPlace.aiInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium flex items-start gap-2.5 shadow-sm"
            >
              <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Trend Chart */}
      <DailyTrendChart data={history} />

      {/* Analytics Summary & Busiest Hour Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsSummary stats={stats} />
        </div>
        <div className="lg:col-span-1">
          <BusiestHourCard
            busiestHour={stats.busiest_hour}
            count={stats.busiest_hour_count}
          />
        </div>
      </div>
    </div>
  );
};
