import React from 'react';
import type { RiskLevel, CameraStatusType, AlertPriority } from '../../types/crowd';

interface StatusBadgeProps {
  status: RiskLevel | CameraStatusType | AlertPriority | 'ENTRY' | 'EXIT' | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const normalized = status.toUpperCase();

  let colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
  let dotColor = 'bg-slate-400';

  switch (normalized) {
    case 'LOW':
    case 'ONLINE':
    case 'NORMAL':
    case 'ACTIVE':
      colorClasses = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30';
      dotColor = 'bg-emerald-500 dark:bg-emerald-400';
      break;
    case 'MODERATE':
    case 'INFO':
      colorClasses = 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-500/30';
      dotColor = 'bg-yellow-500 dark:bg-yellow-400';
      break;
    case 'HIGH':
    case 'WARNING':
      colorClasses = 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/30';
      dotColor = 'bg-orange-500 dark:bg-orange-400';
      break;
    case 'CRITICAL':
    case 'OFFLINE':
      colorClasses = 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30';
      dotColor = 'bg-rose-500 dark:bg-rose-400 animate-pulse';
      break;
    case 'OVER CAPACITY':
      colorClasses = 'bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-400 border-red-400 dark:border-red-500/50 font-bold';
      dotColor = 'bg-red-600 dark:bg-red-500 animate-ping';
      break;
    case 'ENTRY':
      colorClasses = 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40';
      dotColor = 'bg-emerald-500 dark:bg-emerald-400';
      break;
    case 'EXIT':
      colorClasses = 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/40';
      dotColor = 'bg-rose-500 dark:bg-rose-400';
      break;
    case 'UNKNOWN':
    default:
      colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700';
      dotColor = 'bg-slate-400';
      break;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 space-x-1 font-bold',
    md: 'text-xs px-2.5 py-1 space-x-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 space-x-2 font-bold',
  }[size];

  return (
    <span
      role="status"
      aria-label={`Status: ${status}`}
      className={`inline-flex items-center rounded-full border tracking-wide uppercase transition-colors shadow-sm ${sizeClasses} ${colorClasses} ${className}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} aria-hidden="true" />}
      <span>{status}</span>
    </span>
  );
};
