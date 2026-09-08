import React from 'react';
import { Camera, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import type { CameraStatus } from '../../types/crowd';

interface CameraStatusCardProps {
  cameras: CameraStatus[];
}

export const CameraStatusCard: React.FC<CameraStatusCardProps> = ({ cameras }) => {
  const formatTimestamp = (ts?: string | null) => {
    if (!ts) return 'Standby';
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
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'OFFLINE':
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const activeCount = cameras.filter((c) => c.status === 'ONLINE').length;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-200 h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">CAMERA HEALTH</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Vision Sensor Node Connectivity</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-500/30">
            {activeCount}/{cameras.length} Active
          </span>
        </div>

        {/* Camera Sensor List */}
        <div className="space-y-2.5">
          {cameras.map((cam) => {
            const isEntry = cam.direction.toLowerCase() === 'entry';
            const isOnline = cam.status.toUpperCase() === 'ONLINE';

            return (
              <div
                key={cam.camera_id}
                className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-3 hover:border-cyan-500/40 transition-all shadow-sm"
              >
                {/* Node info */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    {getStatusIcon(cam.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black font-mono text-slate-900 dark:text-slate-100">
                        {cam.camera_id}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isEntry
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {isEntry ? 'INGRESS' : 'EGRESS'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {cam.last_event_time ? `Last: ${formatTimestamp(cam.last_event_time)}` : 'Standby Mode'}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border shadow-sm ${
                    isOnline
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>{cam.status}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
