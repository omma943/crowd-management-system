import React from 'react';
import { Layers, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface CapacityCardProps {
  currentCrowd: number;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({ currentCrowd }) => {
  const { settings, getOccupancyPercentage, getRiskLevel, getStatusColor } = useSettings();
  const percentage = getOccupancyPercentage(currentCrowd);
  const remaining = Math.max(0, settings.maxCapacity - currentCrowd);
  const isOver = currentCrowd > settings.maxCapacity;
  const riskLevel = getRiskLevel(currentCrowd);
  const colors = getStatusColor(riskLevel);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              CAPACITY HEADROOM
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-200 dark:border-cyan-500/30">
            {percentage}% LOAD
          </span>
        </div>

        {/* 3 Metric Columns */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/50 p-3 border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Max Limit</div>
            <div className="mt-1 text-xl font-black font-mono text-slate-900 dark:text-slate-100">
              {settings.maxCapacity}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/50 p-3 border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Occupied</div>
            <div className="mt-1 text-xl font-black font-mono text-cyan-600 dark:text-cyan-300">
              {currentCrowd}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/50 p-3 border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
              {isOver ? 'Excess' : 'Available'}
            </div>
            <div
              className={`mt-1 text-xl font-black font-mono ${
                isOver ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isOver ? `+${currentCrowd - settings.maxCapacity}` : remaining}
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-mono font-medium">
            <span>Dynamic Load Progression</span>
            <span className={colors.text}>{percentage}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: colors.fill,
                boxShadow: `0 0 10px ${colors.fill}80`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          {isOver ? (
            <AlertOctagon className="h-4 w-4 text-rose-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          )}
          <span>{isOver ? 'Exceeds Safety Threshold' : 'Safe Operating Capacity'}</span>
        </span>
        <span className="font-mono text-[11px] text-slate-400">Configurable Limit</span>
      </div>
    </div>
  );
};
