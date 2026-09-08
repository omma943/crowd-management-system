import React from 'react';
import { Layers } from 'lucide-react';
import type { ZoneCrowd } from '../../types/place';

interface ZoneCrowdCardProps {
  zones: ZoneCrowd[];
  placeName: string;
}

export const ZoneCrowdCard: React.FC<ZoneCrowdCardProps> = ({ zones, placeName }) => {
  const getZoneStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return {
          badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
          barClass: 'bg-rose-500',
          dotClass: 'bg-rose-500 animate-pulse',
        };
      case 'HIGH':
        return {
          badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
          barClass: 'bg-orange-500',
          dotClass: 'bg-orange-500',
        };
      case 'MODERATE':
        return {
          badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          barClass: 'bg-amber-500',
          dotClass: 'bg-amber-500',
        };
      default:
        return {
          badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          barClass: 'bg-emerald-500',
          dotClass: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
              ZONE-WISE CROWD DENSITY
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Real-time sector breakdown inside {placeName}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          {zones.length} Zones Monitored
        </span>
      </div>

      {/* Zones Grid */}
      <div className="space-y-3.5">
        {zones.map((zone) => {
          const { badgeClass, barClass, dotClass } = getZoneStatusBadge(zone.status);

          return (
            <div
              key={zone.id}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dotClass}`}></span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {zone.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300">
                    {zone.occupancyPercentage}%
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${badgeClass}`}
                  >
                    {zone.status}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barClass}`}
                  style={{ width: `${Math.min(100, zone.occupancyPercentage)}%` }}
                />
              </div>

              <div className="mt-1.5 flex justify-between text-[10px] font-mono text-slate-400">
                <span>{zone.currentCount.toLocaleString()} people inside</span>
                <span>Max: {zone.maxCapacity.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
