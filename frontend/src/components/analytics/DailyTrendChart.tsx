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
import { Calendar } from 'lucide-react';
import type { CrowdHistoryPoint } from '../../types/crowd';

interface DailyTrendChartProps {
  data: CrowdHistoryPoint[];
  title?: string;
  height?: number;
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({
  data,
  title = 'Daily Crowd Comparison',
  height = 300,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">{title}</h3>
            <p className="text-[11px] text-slate-400">Aggregated Daily Attendance</p>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 shadow-xl text-xs font-mono">
                      <p className="font-bold text-slate-200 mb-1 border-b border-slate-800 pb-1">
                        Date: {label}
                      </p>
                      <p className="text-cyan-400 flex items-center justify-between gap-4">
                        <span>Attendance:</span>
                        <span className="font-bold text-sm">{payload[0].value} People</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="crowd" name="Daily Attendance" fill="#06B6D4" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
