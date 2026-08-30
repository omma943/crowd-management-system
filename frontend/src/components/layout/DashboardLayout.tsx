import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { NavTab } from './Sidebar';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSimulator: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  setActiveTab,
  onOpenSimulator,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#080C14] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Ambient background glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        {/* Mobile Header bar */}
        <div className="md:hidden flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] px-4 py-3 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open sidebar navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Crowd Optix</span>
          <div className="w-5" />
        </div>

        {/* Global Dashboard Header */}
        <Header onOpenSimulator={onOpenSimulator} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 z-10">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
