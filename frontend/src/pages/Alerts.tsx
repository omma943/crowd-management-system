import React from 'react';
import { AlertTriangle, ShieldCheck, Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useCrowdData } from '../context/CrowdContext';
import { useSettings } from '../context/SettingsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';

export const Alerts: React.FC = () => {
  const { alerts, currentCrowd } = useCrowdData();
  const { settings, getRiskLevel, getOccupancyPercentage, getStatusColor } = useSettings();

  const riskLevel = getRiskLevel(currentCrowd);
  const percentage = getOccupancyPercentage(currentCrowd);
  const colors = getStatusColor(riskLevel);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Safety & Incident Alerts</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated Safety Threshold Warnings and Venue Incident Matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            {alerts.length} Total Alerts Active
          </span>
        </div>
      </div>

      {/* Live System State Summary Banner */}
      <div className={`rounded-2xl border p-5 transition-all shadow-md ${colors.bg} ${colors.border}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
              {riskLevel === 'CRITICAL' || riskLevel === 'OVER CAPACITY' ? (
                <ShieldAlert className="h-6 w-6 text-rose-500 animate-bounce" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                CURRENT SAFETY STATUS: {riskLevel}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                Venue Occupancy is at {percentage}% of configured maximum limit ({currentCrowd} / {settings.maxCapacity} people).
              </p>
            </div>
          </div>
          <StatusBadge status={riskLevel} size="lg" />
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Triggered Incidents & System Notifications
        </h3>

        {alerts.length === 0 ? (
          <EmptyState
            title="All Clear — No Safety Incidents"
            message="All gates and venue occupancy levels are operating safely within normal parameters."
          />
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.priority === 'CRITICAL' || alert.priority === 'HIGH';

            return (
              <div
                key={alert.id}
                className={`rounded-2xl border p-4 transition-all shadow-sm flex items-start justify-between gap-4 ${
                  isCritical
                    ? 'border-rose-300 dark:border-rose-500/40 bg-rose-50/70 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl mt-0.5 ${
                      isCritical
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{alert.title}</h4>
                      <StatusBadge status={alert.priority} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{alert.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1.5 block">
                      Type: {alert.type} &bull; Timestamp: {alert.timestamp}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Active Rule</span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
