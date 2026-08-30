import React from 'react';
import { History, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { CrowdEvent } from '../../types/crowd';
import { EmptyState } from '../common/EmptyState';

interface RecentEventsTableProps {
  events: CrowdEvent[];
  onViewAll?: () => void;
}

export const RecentEventsTable: React.FC<RecentEventsTableProps> = ({ events, onViewAll }) => {
  const formatTime = (ts: string) => {
    try {
      const dt = new Date(ts);
      return dt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md transition-all duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">RECENT INGRESS & EGRESS EVENTS</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Real-Time Anonymous Optical Detection Ingestion</p>
          </div>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
          >
            View All Records &rarr;
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No Events Logged"
          message="Detection events from entry and exit cameras will populate here in real-time."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold">TIME</th>
                <th className="pb-3 font-bold">CAMERA NODE</th>
                <th className="pb-3 font-bold">ACCESS GATE</th>
                <th className="pb-3 font-bold">DIRECTION</th>
                <th className="pb-3 font-bold text-right">HEADCOUNT</th>
                <th className="pb-3 font-bold text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {events.map((ev) => {
                const isEntry = ev.direction.toLowerCase() === 'entry';
                const countDisplay = isEntry ? `+${ev.count || 1}` : `-${ev.count || 1}`;

                return (
                  <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 text-slate-800 dark:text-slate-300 font-bold whitespace-nowrap">
                      {formatTime(ev.timestamp)}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{ev.camera_id}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{ev.gate_id}</td>
                    <td className="py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          isEntry
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                        }`}
                      >
                        {isEntry ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {ev.direction.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className={`py-3 text-right font-black text-sm whitespace-nowrap ${
                        isEntry ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {countDisplay}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 font-sans font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        Processed
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
