import React from 'react';
import { Camera, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import type { CameraStatus } from '../../types/crowd';
import { StatusBadge } from '../common/StatusBadge';

interface CameraStatusCardProps {
  cameras: CameraStatus[];
}

export const CameraStatusCard: React.FC<CameraStatusCardProps> = ({ cameras }) => {
  const formatTimestamp = (ts?: string | null) => {
    if (!ts) return 'No events yet';
    try {
      const dt = new Date(ts);
      return dt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ONLINE':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'OFFLINE':
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md transition-all duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">CAMERA HEALTH</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Vision Sensor Node Connectivity</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-500/30">
          {cameras.filter((c) => c.status === 'ONLINE').length}/{cameras.length} Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cameras.map((cam) => (
          <div
            key={cam.camera_id}
            className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3.5 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                {getStatusIcon(cam.status)}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-200 font-mono flex items-center gap-2">
                  <span>{cam.camera_id}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-normal">
                    ({cam.direction.toUpperCase()})
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Last seen: {formatTimestamp(cam.last_event_time)}
                </div>
              </div>
            </div>
            <StatusBadge status={cam.status} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
};
