import React from 'react';
import {
  Home,
  Users,
  Gauge,
  LifeBuoy,
  BarChart3,
  AlertTriangle,
  Settings,
  Shield,
  MapPin,
  Camera,
} from 'lucide-react';
import { usePlace } from '../../context/PlaceContext';

export type NavItem =
  | 'home'
  | 'live-crowd'
  | 'capacity'
  | 'help'
  | 'analytics'
  | 'alerts'
  | 'settings';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const { selectedPlace, setIsLocationModalOpen } = usePlace();

  const navItems = [
    { id: 'home' as NavItem, label: 'Explore Places', icon: Home, badge: 'All' },
    { id: 'live-crowd' as NavItem, label: 'Live Crowd', icon: Users, badge: 'Live' },
    { id: 'capacity' as NavItem, label: 'Capacity & Forecast', icon: Gauge, badge: 'AI' },
    { id: 'help' as NavItem, label: 'Help & Facilities', icon: LifeBuoy, badge: 'SOS' },
    { id: 'analytics' as NavItem, label: 'Analytics', icon: BarChart3 },
    { id: 'alerts' as NavItem, label: 'Safety Alerts', icon: AlertTriangle, badge: `${selectedPlace.alerts.length}` },
    { id: 'settings' as NavItem, label: 'Settings & Cameras', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090D15]/95 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding & Place Pill */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
                CrowdSafe AI
              </h2>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                Real-Time Safety & Density
              </p>
            </div>
          </div>

          {/* Active Monitored Place Quick Widget */}
          <div
            onClick={() => setIsLocationModalOpen(true)}
            className="p-3 rounded-2xl border border-teal-500/30 bg-teal-500/5 dark:bg-teal-500/10 hover:border-teal-400 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 mb-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> ACTIVE PLACE
              </span>
              <span className="group-hover:underline">Switch ▾</span>
            </div>
            <div className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
              {selectedPlace.shortName}
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>{selectedPlace.currentCount.toLocaleString()} inside</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">
                {Math.round((selectedPlace.currentCount / selectedPlace.baseCapacity) * 100)}%
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-slate-800/60 hover:text-teal-700 dark:hover:text-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge === 'SOS'
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Privacy & System info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 text-[10px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <Camera className="h-3.5 w-3.5 text-cyan-500" />
            <span>Anonymous Optical Telemetry</span>
          </div>
          <p className="leading-tight">
            Strict Zero-Biometrics Policy. Facial recognition disabled by default.
          </p>
        </div>
      </aside>
    </>
  );
};
