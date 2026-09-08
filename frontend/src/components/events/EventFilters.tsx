import React from 'react';
import { Filter, X } from 'lucide-react';

interface EventFiltersProps {
  direction: string;
  setDirection: (dir: string) => void;
  gateId: string;
  setGateId: (gate: string) => void;
  cameraId: string;
  setCameraId: (cam: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onReset: () => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  direction,
  setDirection,
  gateId,
  setGateId,
  cameraId,
  setCameraId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onReset,
}) => {
  const hasActiveFilters =
    direction !== 'all' ||
    gateId !== 'all' ||
    cameraId !== 'all' ||
    startDate !== '' ||
    endDate !== '';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Filter className="h-4 w-4 text-cyan-400" />
          <span>Filter Events</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        {/* Direction Filter */}
        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
            Direction
          </label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Directions</option>
            <option value="entry">Entry (+)</option>
            <option value="exit">Exit (-)</option>
          </select>
        </div>

        {/* Gate Filter */}
        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
            Gate
          </label>
          <select
            value={gateId}
            onChange={(e) => setGateId(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Gates</option>
            <option value="GATE_1">Gate 1</option>
            <option value="GATE_2">Gate 2</option>
            <option value="GATE_3">Gate 3</option>
          </select>
        </div>

        {/* Camera Filter */}
        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
            Camera
          </label>
          <select
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Cameras</option>
            <option value="ENTRY_01">ENTRY_01</option>
            <option value="EXIT_01">EXIT_01</option>
            <option value="GATE_2_ENTRY">GATE_2_ENTRY</option>
            <option value="GATE_2_EXIT">GATE_2_EXIT</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
