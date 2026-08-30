import React from 'react';
import { Navigation } from 'lucide-react';
import type { GateAnalytics, CameraStatus } from '../../types/crowd';
import { useSettings } from '../../context/SettingsContext';

interface VenueMapCardProps {
  gates: GateAnalytics[];
  cameras: CameraStatus[];
  currentCrowd: number;
}

export const VenueMapCard: React.FC<VenueMapCardProps> = ({
  gates,
  cameras: _cameras,
  currentCrowd,
}) => {
  const { settings, getOccupancyPercentage, getRiskLevel, getStatusColor } = useSettings();
  const riskLevel = getRiskLevel(currentCrowd);
  const colors = getStatusColor(riskLevel);
  const occupancyPct = getOccupancyPercentage(currentCrowd);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md transition-all duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              VENUE OPTICAL TOPOLOGY MAP
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Spatial Ingress Nodes & Active Density Heatmap
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
            {occupancyPct}% LOAD
          </span>
        </div>
      </div>

      {/* Futuristic Venue Layout Diagram */}
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070B12] p-6 overflow-hidden cyber-grid min-h-[220px] flex flex-col justify-between">
        {/* Animated Radar Sweep Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30">
          <div className="w-full h-full rounded-full border border-cyan-500/20 absolute -top-1/2 -left-1/4"></div>
          <div className="w-full h-full rounded-full border border-cyan-500/15 absolute -bottom-1/2 -right-1/4"></div>
        </div>

        {/* Center Arena / Core Density Zone */}
        <div className="relative z-10 mx-auto w-full max-w-sm rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-4 text-center shadow-lg">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            MAIN CONCOURSE & ARENA
          </div>
          <div className="mt-1 flex items-baseline justify-center gap-2">
            <span className="text-3xl font-black font-mono text-cyan-600 dark:text-cyan-300">
              {currentCrowd}
            </span>
            <span className="text-sm font-mono text-slate-500">/ {settings.maxCapacity}</span>
          </div>
          <div className={`mt-1 text-[11px] font-bold ${colors.text}`}>
            Status: {riskLevel}
          </div>
        </div>

        {/* Gate Pin Nodes along Perimeters */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {gates.map((g) => (
            <div
              key={g.gate_id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-3 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                    {g.gate_id}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                    +{g.entries} In / -{g.exits} Out
                  </span>
                </div>
              </div>
              <span className="text-xs font-black font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/30">
                {g.current_contribution}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
