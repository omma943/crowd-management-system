import React from 'react';
import { Flame, Clock, Users, Zap } from 'lucide-react';

interface BusiestHourCardProps {
  busiestHour: string | null;
  count: number;
}

export const BusiestHourCard: React.FC<BusiestHourCardProps> = ({ busiestHour, count }) => {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">BUSIEST HOUR</h3>
            <p className="text-[11px] text-slate-400">Peak Traffic Interval</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
          <Zap className="h-3 w-3" /> Peak Flow
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Time Window</span>
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-amber-300">
            {busiestHour || '10 AM - 11 AM'}
          </div>
        </div>

        <div className="border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase">
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            <span>People Volume</span>
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-slate-100">
            {count} <span className="text-xs text-slate-400 font-sans font-normal">inflow events</span>
          </div>
        </div>
      </div>
    </div>
  );
};
