import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import type { CrowdHistoryPoint } from '../../types/crowd';
import { useTheme } from '../../context/ThemeContext';

interface EntryExitChartProps {
  data: CrowdHistoryPoint[];
  title?: string;
  height?: number;
}

export const EntryExitChart: React.FC<EntryExitChartProps> = ({
  data,
  title = 'Entry vs Exit Flow',
  height = 280,
}) => {
  const { theme } = useTheme();
  const chartData = data && data.length > 0 ? data : [
    { time: '08:00', entries: 0, exits: 0 },
    { time: '10:00', entries: 0, exits: 0 },
    { time: '12:00', entries: 0, exits: 0 },
    { time: '14:00', entries: 0, exits: 0 },
    { time: '16:00', entries: 0, exits: 0 },
  ];

  const gridColor = theme === 'dark' ? '#1E293B' : '#F1F5F9';
  const axisColor = theme === 'dark' ? '#64748B' : '#94A3B8';

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Ingress & Egress Comparison</p>
          </div>
        </div>

        {/* Visual Legend with icons */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-emerald-500/20 border border-emerald-500/30">
              <ArrowDownRight className="h-3 w-3" />
            </span>
            <span>Entries (+)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-rose-500/20 border border-rose-500/30">
              <ArrowUpRight className="h-3 w-3" />
            </span>
            <span>Exits (-)</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="time"
              stroke={axisColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              fontFamily="monospace"
            />
            <YAxis
              stroke={axisColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              fontFamily="monospace"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const entryVal = payload.find((p) => p.dataKey === 'entries')?.value || 0;
                  const exitVal = payload.find((p) => p.dataKey === 'exits')?.value || 0;
                  const net = Number(entryVal) - Number(exitVal);
                  return (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 shadow-xl text-xs font-mono">
                      <p className="font-bold text-slate-900 dark:text-slate-200 mb-1.5 border-b border-slate-100 dark:border-slate-800 pb-1">
                        Time Slot: {label}
                      </p>
                      <div className="space-y-1">
                        <p className="text-emerald-600 dark:text-emerald-400 flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1">
                            <ArrowDownRight className="h-3 w-3" /> Entries:
                          </span>
                          <span className="font-bold">+{entryVal}</span>
                        </p>
                        <p className="text-rose-600 dark:text-rose-400 flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> Exits:
                          </span>
                          <span className="font-bold">-{exitVal}</span>
                        </p>
                        <p className="text-slate-800 dark:text-slate-200 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 font-bold">
                          <span>Net Inflow:</span>
                          <span className={net >= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-orange-500'}>
                            {net > 0 ? `+${net}` : net}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="entries" name="Entries" fill="#10B981" radius={[5, 5, 0, 0]} maxBarSize={28} />
            <Bar dataKey="exits" name="Exits" fill="#EF4444" radius={[5, 5, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
