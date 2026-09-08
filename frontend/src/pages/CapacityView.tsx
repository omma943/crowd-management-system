import React from 'react';
import { Gauge } from 'lucide-react';
import { usePlace } from '../context/PlaceContext';
import { ForecastCard } from '../components/dashboard/ForecastCard';
import { CrowdGauge } from '../components/dashboard/CrowdGauge';

export const CapacityView: React.FC = () => {
  const { selectedPlace } = usePlace();
  const occupancyPct = Math.round((selectedPlace.currentCount / selectedPlace.baseCapacity) * 100);
  const headroom = Math.max(0, selectedPlace.baseCapacity - selectedPlace.currentCount);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Location Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/30 uppercase">
              {selectedPlace.categoryLabel}
            </span>
            <span className="text-xs text-slate-400">• {selectedPlace.city}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Capacity & AI Forecast — {selectedPlace.shortName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Real-time optical headroom limits and predictive crowd trajectory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
              occupancyPct >= 90
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : occupancyPct >= 70
                ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30'
                : occupancyPct >= 50
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}
          >
            {selectedPlace.status} CAPACITY ({occupancyPct}%)
          </span>
        </div>
      </div>

      {/* Main Hero Capacity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Occupancy Gauge */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-xs font-mono font-bold uppercase text-slate-400 mb-2">
            Active Load Meter
          </div>
          <CrowdGauge currentCrowd={selectedPlace.currentCount} size={250} />
          <div className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            Current Active Density Index
          </div>
        </div>

        {/* Right 2 cols: Numerical Headroom Breakdown & Progress */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Gauge className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    REAL-TIME CAPACITY BREAKDOWN
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Threshold: {selectedPlace.baseCapacity.toLocaleString()} Max People
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">
                {occupancyPct}%
              </span>
            </div>

            {/* Big Progress Load Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                <span>Occupied: {selectedPlace.currentCount.toLocaleString()}</span>
                <span>Max Safe Limit: {selectedPlace.baseCapacity.toLocaleString()}</span>
              </div>

              <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    occupancyPct >= 90
                      ? 'bg-gradient-to-r from-rose-500 to-red-600'
                      : occupancyPct >= 70
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}
                  style={{ width: `${Math.min(100, occupancyPct)}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>0</span>
                <span>50%</span>
                <span>75% (Warning)</span>
                <span>100% (Critical)</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Pillars */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                Active Inside
              </div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">
                {selectedPlace.currentCount.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                Remaining Space
              </div>
              <div
                className={`text-xl font-black font-mono mt-1 ${
                  headroom > 500
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {headroom.toLocaleString()}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                Maximum Limit
              </div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">
                {selectedPlace.baseCapacity.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Forecast Section */}
      <ForecastCard
        forecast={selectedPlace.forecast}
        forecastWarning={selectedPlace.forecastWarning}
        recommendedVisitTime={selectedPlace.recommendedVisitTime}
        recommendedVisitReason={selectedPlace.recommendedVisitReason}
        placeName={selectedPlace.shortName}
      />
    </div>
  );
};
