import React from 'react';
import type { CrowdEvent } from '../../types/crowd';
import { EmptyState } from '../common/EmptyState';

interface EventTableProps {
  events: CrowdEvent[];
  total: number;
  skip: number;
  limit: number;
  onPageChange: (newSkip: number) => void;
}

export const EventTable: React.FC<EventTableProps> = ({
  events,
  total,
  skip,
  limit,
  onPageChange,
}) => {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  const formatTimestamp = (ts: string) => {
    try {
      const dt = new Date(ts);
      return dt.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
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
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 tracking-tight">EVENT LOG</h3>
          <p className="text-[11px] text-slate-400">
            Showing {total > 0 ? skip + 1 : 0} to {Math.min(skip + limit, total)} of {total} total records
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No Matching Events Found"
          message="Adjust your search filters or record new camera events."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">EVENT ID</th>
                <th className="pb-3 font-semibold">TIMESTAMP</th>
                <th className="pb-3 font-semibold">CAMERA NODE</th>
                <th className="pb-3 font-semibold">GATE ACCESS</th>
                <th className="pb-3 font-semibold">DIRECTION</th>
                <th className="pb-3 font-semibold text-right">HEADCOUNT</th>
                <th className="pb-3 font-semibold text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.map((ev: CrowdEvent) => {
                const isEntry = ev.direction.toLowerCase() === 'entry';
                const countDisplay = isEntry ? `+${ev.count || 1}` : `-${ev.count || 1}`;

                return (
                  <tr key={ev.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 text-slate-500 font-mono">#{ev.id}</td>
                    <td className="py-3 text-slate-300 whitespace-nowrap">
                      {formatTimestamp(ev.timestamp)}
                    </td>
                    <td className="py-3 text-slate-300 font-bold whitespace-nowrap">{ev.camera_id}</td>
                    <td className="py-3 text-slate-400 whitespace-nowrap">{ev.gate_id}</td>
                    <td className="py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isEntry
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {ev.direction.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className={`py-3 text-right font-bold text-sm whitespace-nowrap ${
                        isEntry ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {countDisplay}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-sans font-medium">
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onPageChange(Math.max(0, skip - limit))}
            disabled={skip === 0}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">
            {skip + 1} - {Math.min(skip + limit, total)} of {total}
          </span>

          <button
            onClick={() => onPageChange(skip + limit)}
            disabled={skip + limit >= total}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
          </button>
        </div>
      )}
    </div>
  );
};
