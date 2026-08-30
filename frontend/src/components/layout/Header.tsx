import React, { useState, useEffect } from 'react';
import { RefreshCw, Activity, PlusCircle, Sun, Moon, Zap } from 'lucide-react';
import { useCrowdData } from '../../context/CrowdContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onOpenSimulator?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSimulator }) => {
  const { connectionStatus, isRefreshing, refreshData, stats } = useCrowdData();
  const { theme, toggleTheme } = useTheme();
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B0F17]/80 px-4 md:px-6 backdrop-blur-xl transition-colors duration-300">
      {/* Title & Cyber Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white shadow-md shadow-cyan-500/20">
          <Activity className="h-5 w-5 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Crowd Management System
            </h1>
            <span className="hidden sm:inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
              AI Vision Core
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Optical Person Ingress/Egress & Density Safety Intelligence
          </p>
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Status, Actions */}
      <div className="flex items-center gap-2 md:gap-3.5">
        {/* Real-time Rate Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span>Today:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">+{stats.entered_today} In</span>
          <span className="text-slate-400">|</span>
          <span className="font-bold text-rose-600 dark:text-rose-400">-{stats.exited_today} Out</span>
        </div>

        {/* Connection Status Pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
            connectionStatus.isOnline
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
          }`}
          title={connectionStatus.isOnline ? 'Connected to FastAPI backend' : connectionStatus.errorMessage || 'Disconnected'}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              connectionStatus.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-rose-500 animate-pulse'
            }`}
          />
          <span className="hidden md:inline font-mono">
            {connectionStatus.isOnline ? 'SYSTEM LIVE' : 'BACKEND OFFLINE'}
          </span>
          <span className="md:hidden">
            {connectionStatus.isOnline ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>

        {/* Date / Time Ticker */}
        <div className="hidden lg:flex flex-col text-right border-l border-slate-200 dark:border-slate-800 pl-3.5">
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{timeStr}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wide font-medium">{dateStr}</span>
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all shadow-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* Manual Refresh Button */}
        <button
          onClick={() => refreshData()}
          disabled={isRefreshing}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shadow-sm"
          title="Manual refresh data"
          aria-label="Refresh crowd data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
        </button>

        {/* Test Simulator Action */}
        {onOpenSimulator && (
          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all hover:scale-105 active:scale-95"
            title="Simulate entry/exit camera event for testing"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Simulate Event</span>
          </button>
        )}
      </div>
    </header>
  );
};
