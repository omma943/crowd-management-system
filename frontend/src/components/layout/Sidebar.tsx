import React from 'react';
import {
  LayoutDashboard,
  Video,
  BarChart3,
  ListFilter,
  AlertTriangle,
  Settings,
  Shield,
  Radio,
} from 'lucide-react';
import { useCrowdData } from '../../context/CrowdContext';

export type NavTab = 'dashboard' | 'live' | 'analytics' | 'events' | 'alerts' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) => {
  const { alerts } = useCrowdData();
  const activeAlertCount = alerts.filter(a => a.priority === 'CRITICAL' || a.priority === 'HIGH').length;

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live' as NavTab, label: 'Live Monitoring', icon: Video },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3 },
    { id: 'events' as NavTab, label: 'Events Audit', icon: ListFilter },
    {
      id: 'alerts' as NavTab,
      label: 'Safety Alerts',
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? activeAlertCount : null,
    },
    { id: 'settings' as NavTab, label: 'System Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B0F17] transition-all duration-300 md:translate-x-0 shadow-lg md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 dark:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-sm">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 tracking-wider">CROWD OPTIX</span>
            <span className="block text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-bold">CONTROL ROOM 2.0</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3.5 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500/15 dark:bg-rose-500/20 px-1.5 text-xs font-extrabold text-rose-600 dark:text-rose-400 border border-rose-500/40 animate-bounce">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Creative Privacy Badge Container */}
        <div className="p-4 m-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1.5 font-bold text-xs">
            <Shield className="h-4 w-4" />
            <span className="uppercase tracking-wider">Privacy Engine</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Strictly anonymous edge person tracking. No biometric or facial recognition data stored.
          </p>
        </div>
      </aside>
    </>
  );
};
