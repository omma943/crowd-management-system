import React from 'react';
import {
  Users,
  ArrowDownRight,
  ArrowUpRight,
  Trophy,
} from 'lucide-react';
import { useCrowdData } from '../context/CrowdContext';
import { usePlace } from '../context/PlaceContext';
import { KpiCard } from '../components/common/KpiCard';
import { LiveCrowdCard } from '../components/dashboard/LiveCrowdCard';
import { CapacityCard } from '../components/dashboard/CapacityCard';
import { VenueMapCard } from '../components/dashboard/VenueMapCard';
import { CrowdTrendChart } from '../components/dashboard/CrowdTrendChart';
import { EntryExitChart } from '../components/dashboard/EntryExitChart';
import { GateAnalyticsCard } from '../components/dashboard/GateAnalyticsCard';
import { CameraStatusCard } from '../components/dashboard/CameraStatusCard';
import { RecentEventsTable } from '../components/dashboard/RecentEventsTable';
import { ZoneCrowdCard } from '../components/dashboard/ZoneCrowdCard';

export const Dashboard: React.FC = () => {
  const {
    history,
    gates,
    cameras,
    recentEvents,
  } = useCrowdData();

  const { selectedPlace } = usePlace();

  const occupancyPct = Math.round(
    (selectedPlace.currentCount / selectedPlace.baseCapacity) * 100
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Location Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-500/30 uppercase">
              {selectedPlace.categoryLabel}
            </span>
            <span className="text-xs text-slate-400">• {selectedPlace.city}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Live Crowd — {selectedPlace.shortName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Real-time optical density telemetry & spatial zone monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
              occupancyPct >= 90
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : occupancyPct >= 70
                ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30'
                : occupancyPct >= 50
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}
          >
            {selectedPlace.status} ({occupancyPct}% Capacity)
          </span>
        </div>
      </div>

      {/* 4 Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="CURRENT CROWD"
          value={selectedPlace.currentCount.toLocaleString()}
          subtitle="People currently inside"
          icon={Users}
          variant="primary"
          trend={{
            text: `${occupancyPct}% of safe cap`,
            isPositive: occupancyPct < 85,
          }}
        />

        <KpiCard
          title="ENTERED TODAY"
          value={`+${selectedPlace.enteredToday.toLocaleString()}`}
          subtitle="Total recorded entries"
          icon={ArrowDownRight}
          variant="success"
        />

        <KpiCard
          title="EXITED TODAY"
          value={`-${selectedPlace.exitedToday.toLocaleString()}`}
          subtitle="Total recorded exits"
          icon={ArrowUpRight}
          variant="danger"
        />

        <KpiCard
          title="PEAK CROWD TODAY"
          value={selectedPlace.peakCrowd.toLocaleString()}
          subtitle={`Recorded at ${selectedPlace.peakTime}`}
          icon={Trophy}
          variant="warning"
        />
      </div>

      {/* Live Crowd HUD Gauge & Capacity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveCrowdCard currentCrowd={selectedPlace.currentCount} />
        </div>
        <div className="lg:col-span-1">
          <CapacityCard currentCrowd={selectedPlace.currentCount} />
        </div>
      </div>

      {/* Zone-Wise Breakdown Card */}
      <ZoneCrowdCard
        zones={selectedPlace.zones}
        placeName={selectedPlace.shortName}
      />

      {/* Optical Spatial Topology Map */}
      <VenueMapCard
        gates={gates}
        cameras={cameras}
        currentCrowd={selectedPlace.currentCount}
      />

      {/* Trend & Entry/Exit Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CrowdTrendChart data={history} />
        <EntryExitChart data={history} />
      </div>

      {/* Gate Analytics & Camera Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GateAnalyticsCard gates={gates} />
        </div>
        <div className="lg:col-span-1">
          <CameraStatusCard cameras={cameras} />
        </div>
      </div>

      {/* Recent Anonymous Events Table */}
      <RecentEventsTable events={recentEvents} />
    </div>
  );
};
