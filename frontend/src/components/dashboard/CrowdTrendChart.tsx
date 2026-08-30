import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { CrowdHistoryPoint } from '../../types/crowd';
import { useTheme } from '../../context/ThemeContext';

interface CrowdTrendChartProps {
  data: CrowdHistoryPoint[];
  title?: string;
  height?: number;
}

export const CrowdTrendChart: React.FC<CrowdTrendChartProps> = ({
  data,
  title = 'Hourly Crowd Trend',
  height = 280,
}) => {
  const { theme } = useTheme();
  const chartData = data && data.length > 0 ? data : [
    { time: '08:00', crowd: 0, entries: 0, exits: 0 },
    { time: '10:00', crowd: 0, entries: 0, exits: 0 },
    { time: '12:00', crowd: 0, entries: 0, exits: 0 },
    { time: '14:00', crowd: 0, entries: 0, exits: 0 },
    { time: '16:00', crowd: 0, entries: 0, exits: 0 },
    { time: '18:00', crowd: 0, entries: 0, exits: 0 },
  ];

  const gridColor = theme === 'dark' ? '#1E293B' : '#F1F5F9';
  const axisColor = theme === 'dark' ? '#64748B' : '#94A3B8';

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md transition-all duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Headcount Velocity Over Time</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50 animate-pulse"></span>
          <span className="font-semibold">Live Occupancy</span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="crowdGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
                  return (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 shadow-xl text-xs font-mono">
                      <p className="font-bold text-slate-900 dark:text-slate-200 mb-1 border-b border-slate-100 dark:border-slate-800 pb-1">
                        Time: {label}
                      </p>
                      <p className="text-cyan-600 dark:text-cyan-400 flex items-center justify-between gap-4">
                        <span className="font-medium">Crowd Level:</span>
                        <span className="font-extrabold text-sm">{payload[0].value} People</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="crowd"
              stroke="#06B6D4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#crowdGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
