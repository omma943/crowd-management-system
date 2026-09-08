import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useCrowdData } from '../context/CrowdContext';
import { usePlace } from '../context/PlaceContext';

export const Alerts: React.FC = () => {
  const { alerts: _backendAlerts } = useCrowdData();
  const { selectedPlace } = usePlace();

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return {
          icon: <AlertOctagon className="h-5 w-5 text-rose-500" />,
          badge: 'CRITICAL',
          badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
          borderClass: 'border-rose-500/40 bg-rose-500/5',
        };
      case 'HIGH':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
          badge: 'HIGH CROWD',
          badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
          borderClass: 'border-orange-500/40 bg-orange-500/5',
        };
      case 'WARNING':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          badge: 'WARNING',
          badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          borderClass: 'border-amber-500/40 bg-amber-500/5',
        };
      default:
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
          badge: 'NORMAL',
          badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          borderClass: 'border-emerald-500/40 bg-emerald-500/5',
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Location Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-500/30 uppercase">
              Real-Time Security
            </span>
            <span className="text-xs text-slate-400">• {selectedPlace.city}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Safety Alerts — {selectedPlace.shortName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active safety advisories and zone threshold trigger history
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          {selectedPlace.alerts.length} Active Incidents
        </span>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3">
        {selectedPlace.alerts.map((alert) => {
          const config = getPriorityConfig(alert.priority);

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${config.borderClass} bg-white dark:bg-slate-900`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm mt-0.5">
                  {config.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${config.badgeClass}`}
                    >
                      {config.badge}
                    </span>
                    <h3 className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {alert.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                    {alert.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center sm:flex-col sm:items-end justify-between text-right text-[11px] font-mono text-slate-400 pl-11 sm:pl-0">
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  {alert.timestamp}
                </span>
                <span>{selectedPlace.shortName}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
