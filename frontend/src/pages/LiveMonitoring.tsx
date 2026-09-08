import React from 'react';
import { VideoOff, Radio, Eye, Camera } from 'lucide-react';
import { useCrowdData } from '../context/CrowdContext';
import { useSettings } from '../context/SettingsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import type { CameraStatus, CrowdEvent } from '../types/crowd';

export const LiveMonitoring: React.FC = () => {
  const { currentCrowd, stats, cameras, connectionStatus, recentEvents } = useCrowdData();
  const { settings, getOccupancyPercentage, getRiskLevel, getStatusColor } = useSettings();

  const occupancyPct = getOccupancyPercentage(currentCrowd);
  const riskLevel = getRiskLevel(currentCrowd);
  const colors = getStatusColor(riskLevel);

  const formatLastUpdate = (dt: Date | null) => {
    if (!dt) return 'Waiting for first sync...';
    return dt.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
              <Eye className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Live Video Surveillance & Camera Feeds</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI Vision-Based Optical Counting Nodes (Privacy Preserving)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
              Last Ingestion Sync
            </span>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-300 font-bold">
              {formatLastUpdate(connectionStatus.lastSuccessfulUpdate)}
            </span>
          </div>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Current Crowd</span>
          <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-300 mt-1">{currentCrowd}</div>
        </div>

        <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Capacity</span>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">{settings.maxCapacity}</div>
        </div>

        <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Occupancy</span>
          <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1">{occupancyPct}%</div>
        </div>

        <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Risk Level</span>
          <div className={`text-sm font-black font-mono mt-2 ${colors.text}`}>{riskLevel}</div>
        </div>

        <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Entries Today</span>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">+{stats.entered_today}</div>
        </div>

        <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Exits Today</span>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">-{stats.exited_today}</div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cameras.map((cam: CameraStatus) => {
          const isEntry = cam.direction === 'entry';
          const lastCamEvent = recentEvents.find((e: CrowdEvent) => e.camera_id === cam.camera_id);

          return (
            <div
              key={cam.camera_id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 overflow-hidden shadow-lg flex flex-col justify-between"
            >
              {/* Camera Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm">
                    <Camera className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-mono">{cam.camera_id}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Location: {cam.gate_id} &bull; Channel: {isEntry ? 'Ingress (+)' : 'Egress (-)'}
                    </p>
                  </div>
                </div>
                <StatusBadge status={cam.status} size="sm" />
              </div>

              {/* Feed Placeholder Frame */}
              <div className="relative aspect-video bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-950 dark:to-[#0A0E18] flex flex-col items-center justify-center p-6 text-center border-y border-slate-200 dark:border-slate-800/50">
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-500/40"></div>
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-500/40"></div>
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-500/40"></div>
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-500/40"></div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-400 shadow-sm mb-3">
                  <VideoOff className="h-8 w-8 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Live camera feed unavailable</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1 leading-relaxed">
                  Optical AI processing is running in background detection mode via local edge engine.
                </p>

                <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 shadow-sm">
                  <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
                  <span>AI Ingestion: ACTIVE</span>
                </div>
              </div>

              {/* Diagnostics Footer */}
              <div className="p-4 bg-slate-50/60 dark:bg-slate-950/40 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-white dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Last Event</span>
                  <span className="text-slate-900 dark:text-slate-200 font-bold">
                    {lastCamEvent
                      ? `${lastCamEvent.direction.toUpperCase()} (${lastCamEvent.count > 0 ? `+${lastCamEvent.count}` : lastCamEvent.count})`
                      : 'None recorded'}
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Last Activity</span>
                  <span className="text-slate-900 dark:text-slate-200 font-bold">
                    {cam.last_event_time
                      ? new Date(cam.last_event_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : 'Standby'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
