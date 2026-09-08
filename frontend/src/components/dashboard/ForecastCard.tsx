import React from 'react';
import { Sparkles, TrendingUp, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { CrowdForecastPoint } from '../../types/place';

interface ForecastCardProps {
  forecast: CrowdForecastPoint[];
  forecastWarning?: string;
  recommendedVisitTime: string;
  recommendedVisitReason: string;
  placeName: string;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  forecast,
  forecastWarning,
  recommendedVisitTime,
  recommendedVisitReason,
  placeName,
}) => {
  const getForecastColor = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'HIGH':
        return 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'MODERATE':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
              AI CROWD FORECAST & PROJECTIONS
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Predictive neural density curve for {placeName}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-500/30">
          <TrendingUp className="h-3.5 w-3.5" />
          Real-Time AI Model
        </span>
      </div>

      {/* Forecast Timeline Progression */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {forecast.map((point) => {
          const colorClass = getForecastColor(point.status);
          return (
            <div
              key={point.time}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-center shadow-sm"
            >
              <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-slate-400 mb-1">
                <Clock className="h-3 w-3" />
                <span>{point.time}</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
                {point.occupancyPercentage}%
              </div>
              <div className="mt-1.5">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${colorClass}`}
                >
                  {point.status}
                </span>
              </div>
              {point.note && (
                <div className="mt-1 text-[9px] text-slate-500 dark:text-slate-400 truncate">
                  {point.note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Forecast Warning Banner if any */}
      {forecastWarning && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-black text-rose-600 dark:text-rose-400">
              Capacity Advisory Alert
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
              {forecastWarning}
            </p>
          </div>
        </div>
      )}

      {/* Recommended Visit Window */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              AI Recommended Visit Time
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-slate-100">
              {recommendedVisitTime}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium sm:text-right max-w-xs">
          {recommendedVisitReason}
        </div>
      </div>
    </div>
  );
};
