import React from 'react';
import { Home, Users, Gauge, LifeBuoy, AlertTriangle } from 'lucide-react';
import type { NavItem } from './Sidebar';
import { usePlace } from '../../context/PlaceContext';

interface MobileBottomNavProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { selectedPlace } = usePlace();

  const navButtons: {
    id: NavItem;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'home', label: 'Explore', icon: Home },
    { id: 'live-crowd', label: 'Live', icon: Users },
    { id: 'capacity', label: 'Forecast', icon: Gauge },
    { id: 'help', label: 'Help & SOS', icon: LifeBuoy, badge: 'SOS' },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: AlertTriangle,
      badge: selectedPlace.alerts.length > 0 ? `${selectedPlace.alerts.length}` : undefined,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090D15]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom"
    >
      {navButtons.map((btn) => {
        const Icon = btn.icon;
        const isActive = currentTab === btn.id;

        return (
          <button
            key={btn.id}
            onClick={() => onSelectTab(btn.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl min-w-[58px] transition-all ${
              isActive
                ? 'text-teal-600 dark:text-teal-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1 w-7 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm shadow-teal-400/60" />
            )}

            <div className="relative p-0.5">
              <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : ''}`} />
              {btn.badge && (
                <span
                  className={`absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold ${
                    btn.badge === 'SOS'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {btn.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight truncate mt-0.5">
              {btn.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
