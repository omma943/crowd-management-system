import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Activity,
  PlusCircle,
  Sun,
  Moon,
  Zap,
  MapPin,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { useCrowdData } from '../../context/CrowdContext';
import { useTheme } from '../../context/ThemeContext';
import { usePlace } from '../../context/PlaceContext';
import { LocationSelectorModal } from './LocationSelectorModal';

interface HeaderProps {
  onOpenSimulator?: () => void;
  onNavigateHome?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSimulator,
  onNavigateHome,
  onToggleSidebar,
}) => {
  const { connectionStatus, isRefreshing, refreshData } = useCrowdData();
  const { theme, toggleTheme } = useTheme();
  const { selectedPlace, setIsLocationModalOpen } = usePlace();

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
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B0F17]/90 px-3 sm:px-6 backdrop-blur-xl transition-colors duration-200">
        {/* Brand & Persistent Location Selector */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Open Navigation Menu"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Logo */}
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  CrowdSafe AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Know the crowd. Plan your visit.
              </p>
            </div>
          </div>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* Persistent Location Selector Button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-slate-100 transition-all shadow-sm hover:scale-105 active:scale-95 group min-w-0"
            title="Click to switch monitored place"
          >
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-500 group-hover:animate-bounce shrink-0" />
            <span className="max-w-[95px] xs:max-w-[130px] sm:max-w-[180px] md:max-w-[220px] truncate text-[11px] sm:text-xs">
              {selectedPlace.shortName}
            </span>
            <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Flow Pill for Selected Place */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 shadow-sm">
            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>Active:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {selectedPlace.currentCount.toLocaleString()}
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              +{selectedPlace.enteredToday.toLocaleString()} In
            </span>
          </div>

          {/* Connection Status Pill */}
          <div
            className={`hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              connectionStatus.isOnline
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                connectionStatus.isOnline
                  ? 'bg-emerald-500 animate-ping'
                  : 'bg-rose-500 animate-pulse'
              }`}
            />
            <span className="font-mono text-[11px]">
              {connectionStatus.isOnline ? 'AI SENSORS LIVE' : 'OFFLINE'}
            </span>
          </div>

          {/* Time Ticker */}
          <div className="hidden lg:flex flex-col text-right border-l border-slate-200 dark:border-slate-800 pl-3">
            <span className="text-xs font-mono font-black text-slate-900 dark:text-slate-100">
              {timeStr}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {dateStr}
            </span>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => refreshData()}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            title="Manual refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`}
            />
          </button>

          {/* Simulate Event Button */}
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black shadow-md shadow-cyan-600/20 transition-all hover:scale-105 active:scale-95"
              title="Simulate entry/exit camera event"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Simulate</span>
            </button>
          )}
        </div>
      </header>

      {/* Location Selector Search Modal */}
      <LocationSelectorModal />
    </>
  );
};
