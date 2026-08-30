import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  isHighlight?: boolean;
  badge?: React.ReactNode;
  trend?: {
    text: string;
    isPositive?: boolean;
  };
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  isHighlight = false,
  badge,
  trend,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          border: 'border-cyan-500/40 dark:border-cyan-500/40 hover:border-cyan-400',
          bg: 'bg-white dark:bg-gradient-to-br dark:from-cyan-950/40 dark:via-slate-900 dark:to-slate-900 shadow-md shadow-cyan-500/5',
          glow: 'shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30',
          iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500/30',
          valueColor: 'text-cyan-600 dark:text-cyan-300 font-extrabold',
        };
      case 'success':
        return {
          border: 'border-emerald-500/30 dark:border-emerald-500/30 hover:border-emerald-400',
          bg: 'bg-white dark:bg-slate-900/90 shadow-md shadow-emerald-500/5',
          glow: 'shadow-lg shadow-emerald-500/10',
          iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30',
          valueColor: 'text-emerald-600 dark:text-emerald-400 font-extrabold',
        };
      case 'warning':
        return {
          border: 'border-amber-500/30 dark:border-amber-500/30 hover:border-amber-400',
          bg: 'bg-white dark:bg-slate-900/90 shadow-md shadow-amber-500/5',
          glow: 'shadow-lg shadow-amber-500/10',
          iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30',
          valueColor: 'text-amber-600 dark:text-amber-400 font-extrabold',
        };
      case 'danger':
        return {
          border: 'border-rose-500/30 dark:border-rose-500/30 hover:border-rose-400',
          bg: 'bg-white dark:bg-slate-900/90 shadow-md shadow-rose-500/5',
          glow: 'shadow-lg shadow-rose-500/10',
          iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/30',
          valueColor: 'text-rose-600 dark:text-rose-400 font-extrabold',
        };
      case 'default':
      default:
        return {
          border: 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
          bg: 'bg-white dark:bg-slate-900/80 shadow-sm',
          glow: '',
          iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700',
          valueColor: 'text-slate-900 dark:text-slate-100 font-bold',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`relative rounded-2xl p-5 border transition-all duration-300 backdrop-blur-md ${styles.bg} ${styles.border} ${
        isHighlight ? `${styles.glow}` : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl transition-transform duration-200 hover:scale-110 ${styles.iconBg}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className={`text-3xl tracking-tight font-mono ${styles.valueColor}`}>
          {value}
        </div>
        {badge && <div>{badge}</div>}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {trend.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
