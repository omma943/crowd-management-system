import React from 'react';
import { DoorOpen, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { GateAnalytics } from '../../types/crowd';
import { EmptyState } from '../common/EmptyState';

interface GateAnalyticsCardProps {
  gates: GateAnalytics[];
}

export const GateAnalyticsCard: React.FC<GateAnalyticsCardProps> = ({ gates }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-200 h-full flex flex-col justify-between">
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
              <DoorOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">GATE ANALYTICS</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Multi-Point Ingress & Egress Contribution
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {gates.length} {gates.length === 1 ? 'Gate Active' : 'Gates Active'}
          </span>
        </div>

        {/* Gate List */}
        {gates.length === 0 ? (
          <EmptyState
            title="No Gate Data Available"
            message="Gate activity will populate here once camera events are detected."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gates.map((gate) => {
              const totalFlow = gate.entries + gate.exits;
              const entryRatio = totalFlow > 0 ? (gate.entries / totalFlow) * 100 : 50;

              return (
                <div
                  key={gate.gate_id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 hover:border-cyan-500/40 transition-all shadow-sm flex flex-col justify-between"
                >
                  {/* Gate Title & Status */}
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-black font-mono border border-cyan-500/20 shadow-sm">
                          {gate.gate_id.replace('GATE_', 'G')}
                        </span>
                        <div>
                          <span className="text-xs font-black text-slate-900 dark:text-slate-100 block">
                            {gate.gate_id === 'GATE_1' ? 'Gate 1 (Main Concourse)' : gate.gate_id === 'GATE_2' ? 'Gate 2 (North Turnstiles)' : gate.gate_id}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        Operational
                      </span>
                    </div>

                    {/* Sensor Nodes Connected */}
                    <div className="flex items-center gap-2 mb-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        <span>{gate.entry_camera || `${gate.gate_id}_ENTRY`}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                        <span>{gate.exit_camera || `${gate.gate_id}_EXIT`}</span>
                      </span>
                    </div>

                    {/* Numerical Metric Columns */}
                    <div className="grid grid-cols-3 gap-2 text-center mb-3">
                      <div className="bg-white dark:bg-slate-900 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5">
                          <ArrowDownRight className="h-3 w-3" /> Entries
                        </span>
                        <span className="text-base font-black font-mono text-slate-900 dark:text-slate-100 mt-0.5 block">
                          +{gate.entries}
                        </span>
                      </div>

                      <div className="bg-white dark:bg-slate-900 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-0.5">
                          <ArrowUpRight className="h-3 w-3" /> Exits
                        </span>
                        <span className="text-base font-black font-mono text-slate-900 dark:text-slate-100 mt-0.5 block">
                          -{gate.exits}
                        </span>
                      </div>

                      <div className="bg-white dark:bg-slate-900 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 block">
                          Inside
                        </span>
                        <span className="text-base font-black font-mono text-cyan-600 dark:text-cyan-300 mt-0.5 block">
                          {gate.current_contribution}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flow Distribution Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>Ingress {entryRatio.toFixed(0)}%</span>
                      <span>Egress {(100 - entryRatio).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${entryRatio}%` }}
                      />
                      <div
                        className="h-full bg-rose-500 transition-all duration-500"
                        style={{ width: `${100 - entryRatio}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
