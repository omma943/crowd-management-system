import React from 'react';
import { AlertTriangle, ShieldCheck, Gauge } from 'lucide-react';
import { CrowdGauge } from './CrowdGauge';
import { useSettings } from '../../context/SettingsContext';

interface LiveCrowdCardProps {
  currentCrowd: number;
}

export const LiveCrowdCard: React.FC<LiveCrowdCardProps> = ({ currentCrowd }) => {
  const { settings, getOccupancyPercentage, getRiskLevel, getStatusColor } = useSettings();
  const percentage = getOccupancyPercentage(currentCrowd);
  const riskLevel = getRiskLevel(currentCrowd);
  const colors = getStatusColor(riskLevel);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              LIVE CROWD TELEMETRY
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-Time Density, Flow Rate & Safety Index</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">
            OPTICAL SYNC
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Occupancy Gauge */}
        <div className="md:col-span-5 flex justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/80 pb-6 md:pb-0 md:pr-6">
          <CrowdGauge currentCrowd={currentCrowd} size={250} />
        </div>

        {/* Right: Detailed Metric Breakdown */}
        <div className="md:col-span-7 space-y-4">
          {/* Main Crowd Ratio */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                HEADCOUNT OCCUPANCY
              </span>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {percentage}% OF MAXIMUM
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-cyan-600 dark:text-cyan-300">
                {currentCrowd}
              </span>
              <span className="text-2xl font-mono font-bold text-slate-400 dark:text-slate-500">
                / {settings.maxCapacity}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto font-mono">
                People Present
              </span>
            </div>
          </div>

          {/* Grid of Density & Risk indicators */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className={`rounded-xl p-3.5 border transition-all ${colors.bg} ${colors.border}`}>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Crowd Density
              </div>
              <div className={`mt-1 text-lg font-black font-mono ${colors.text}`}>
                {riskLevel}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {percentage}% of venue limit
              </div>
            </div>

            <div className="rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shadow-sm">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Safety Protocol
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                {riskLevel === 'CRITICAL' || riskLevel === 'OVER CAPACITY' ? (
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                ) : (
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                )}
                <span className={`text-base font-bold ${colors.text}`}>
                  {riskLevel === 'OVER CAPACITY'
                    ? 'RESTRICTED'
                    : riskLevel === 'CRITICAL'
                    ? 'HIGH ALERT'
                    : riskLevel === 'HIGH'
                    ? 'ELEVATED'
                    : riskLevel === 'MODERATE'
                    ? 'CONTROLLED'
                    : 'SAFE / NORMAL'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Active Threshold Control
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
