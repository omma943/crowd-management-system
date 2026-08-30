import React from 'react';
import { DoorOpen, Video } from 'lucide-react';
import type { GateAnalytics } from '../../types/crowd';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';

interface GateAnalyticsCardProps {
  gates: GateAnalytics[];
}

export const GateAnalyticsCard: React.FC<GateAnalyticsCardProps> = ({ gates }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md transition-all duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
            <DoorOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">GATE ANALYTICS</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Multi-Point Ingress & Egress Contribution</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
          {gates.length} {gates.length === 1 ? 'Gate Active' : 'Gates Monitored'}
        </span>
      </div>

      {gates.length === 0 ? (
        <EmptyState
          title="No Gate Data"
          message="Gate statistics will appear once entry and exit events are detected."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gates.map((gate) => (
            <div
              key={gate.gate_id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 transition-all shadow-sm"
            >
              {/* Gate Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-bold text-cyan-700 dark:text-cyan-400 font-mono shadow-sm">
                    {gate.gate_id.replace('GATE_', 'G')}
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{gate.gate_id}</span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                  OPERATIONAL
                </span>
              </div>

              {/* Cameras attached to gate */}
              <div className="space-y-1.5 mb-3.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium">
                    <Video className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>{gate.entry_camera || `${gate.gate_id}_ENTRY`}</span>
                  </span>
                  <StatusBadge status={gate.entry_status || 'ONLINE'} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium">
                    <Video className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>{gate.exit_camera || `${gate.gate_id}_EXIT`}</span>
                  </span>
                  <StatusBadge status={gate.exit_status || 'ONLINE'} size="sm" />
                </div>
              </div>

              {/* Metric Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2.5 border-t border-slate-200 dark:border-slate-800/80">
                <div className="bg-white dark:bg-slate-900/60 rounded-xl p-2 border border-slate-200 dark:border-slate-800/50 shadow-sm">
                  <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                    Entries
                  </span>
                  <span className="text-sm font-black font-mono text-slate-900 dark:text-slate-100">
                    +{gate.entries}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900/60 rounded-xl p-2 border border-slate-200 dark:border-slate-800/50 shadow-sm">
                  <span className="text-[9px] uppercase font-bold text-rose-600 dark:text-rose-400 block">
                    Exits
                  </span>
                  <span className="text-sm font-black font-mono text-slate-900 dark:text-slate-100">
                    -{gate.exits}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900/60 rounded-xl p-2 border border-slate-200 dark:border-slate-800/50 shadow-sm">
                  <span className="text-[9px] uppercase font-bold text-cyan-600 dark:text-cyan-400 block">
                    Inside
                  </span>
                  <span className="text-sm font-black font-mono text-cyan-600 dark:text-cyan-300">
                    {gate.current_contribution}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
