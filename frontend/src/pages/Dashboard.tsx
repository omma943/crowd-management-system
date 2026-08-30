import React from 'react';
import { Users, ArrowDownRight, ArrowUpRight, Award } from 'lucide-react';
import { useCrowdData } from '../context/CrowdContext';
import { useSettings } from '../context/SettingsContext';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { LiveCrowdCard } from '../components/dashboard/LiveCrowdCard';
import { CapacityCard } from '../components/dashboard/CapacityCard';
import { CrowdTrendChart } from '../components/dashboard/CrowdTrendChart';
import { EntryExitChart } from '../components/dashboard/EntryExitChart';
import { GateAnalyticsCard } from '../components/dashboard/GateAnalyticsCard';
import { CameraStatusCard } from '../components/dashboard/CameraStatusCard';
import { RecentEventsTable } from '../components/dashboard/RecentEventsTable';
import { VenueMapCard } from '../components/dashboard/VenueMapCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import type { NavTab } from '../components/layout/Sidebar';

interface DashboardProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const {
    currentCrowd,
    stats,
    history,
    gates,
    cameras,
    recentEvents,
    connectionStatus,
    isLoading,
    refreshData,
  } = useCrowdData();

  const { getRiskLevel } = useSettings();
  const riskLevel = getRiskLevel(currentCrowd);

  if (isLoading && !connectionStatus.lastSuccessfulUpdate) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingState type="card" />
          <LoadingState type="card" />
          <LoadingState type="card" />
          <LoadingState type="card" />
        </div>
        <LoadingState type="chart" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Backend Offline Warning Banner */}
      {!connectionStatus.isOnline && (
        <ErrorState
          title="Backend Connection Offline"
          message={
            connectionStatus.errorMessage ||
            'Unable to connect to the FastAPI crowd monitoring backend on http://127.0.0.1:8000. Retrying in the background...'
          }
          onRetry={refreshData}
        />
      )}

      {/* ================================================== */}
      {/* 6. MAIN KPI CARDS (TOP OF DASHBOARD)              */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. CURRENT CROWD (MOST IMPORTANT METRIC) */}
        <KpiCard
          title="CURRENT CROWD"
          value={`${currentCrowd} People`}
          subtitle={`Formula: ${stats.entered_today} Entries - ${stats.exited_today} Exits`}
          icon={Users}
          variant="primary"
          isHighlight={true}
          badge={<StatusBadge status={riskLevel} size="sm" />}
        />

        {/* 2. ENTERED TODAY */}
        <KpiCard
          title="ENTERED TODAY"
          value={stats.entered_today}
          subtitle="Total unique ingress counts"
          icon={ArrowDownRight}
          variant="success"
          trend={{ text: '+ Inflow Today', isPositive: true }}
        />

        {/* 3. EXITED TODAY */}
        <KpiCard
          title="EXITED TODAY"
          value={stats.exited_today}
          subtitle="Total unique egress counts"
          icon={ArrowUpRight}
          variant="danger"
          trend={{ text: '- Outflow Today', isPositive: false }}
        />

        {/* 4. PEAK CROWD TODAY */}
        <KpiCard
          title="PEAK CROWD TODAY"
          value={`${stats.peak_crowd} People`}
          subtitle={`Recorded at ${stats.peak_time || 'N/A'}`}
          icon={Award}
          variant="warning"
        />
      </div>

      {/* ================================================== */}
      {/* 7 & 8. LIVE CROWD STATUS & CAPACITY SECTION        */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveCrowdCard currentCrowd={currentCrowd} />
        </div>
        <div className="lg:col-span-1">
          <CapacityCard currentCrowd={currentCrowd} />
        </div>
      </div>

      {/* ================================================== */}
      {/* CREATIVE VENUE TOPOLOGY MAP                       */}
      {/* ================================================== */}
      <VenueMapCard gates={gates} cameras={cameras} currentCrowd={currentCrowd} />

      {/* ================================================== */}
      {/* 12 & 13. HOURLY TREND & ENTRY VS EXIT CHARTS       */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CrowdTrendChart data={history} title="Hourly Crowd Trend" />
        <EntryExitChart data={history} title="Entry vs Exit Flow" />
      </div>

      {/* ================================================== */}
      {/* 17 & 18. GATE ANALYTICS & CAMERA STATUS            */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GateAnalyticsCard gates={gates} />
        </div>
        <div className="lg:col-span-1">
          <CameraStatusCard cameras={cameras} />
        </div>
      </div>

      {/* ================================================== */}
      {/* 19. RECENT ANONYMOUS EVENTS STREAM                 */}
      {/* ================================================== */}
      <div>
        <RecentEventsTable
          events={recentEvents}
          onViewAll={() => setActiveTab('events')}
        />
      </div>
    </div>
  );
};
