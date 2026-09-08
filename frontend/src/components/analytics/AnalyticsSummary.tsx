import React from 'react';
import { Users, ArrowDownRight, ArrowUpRight, Award } from 'lucide-react';
import type { CrowdStats } from '../../types/crowd';
import { KpiCard } from '../common/KpiCard';

interface AnalyticsSummaryProps {
  stats: CrowdStats;
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Total Entries"
        value={stats.entered_today}
        subtitle="Cumulative entries recorded"
        icon={ArrowDownRight}
        variant="success"
      />
      <KpiCard
        title="Total Exits"
        value={stats.exited_today}
        subtitle="Cumulative exits recorded"
        icon={ArrowUpRight}
        variant="danger"
      />
      <KpiCard
        title="Peak Crowd"
        value={`${stats.peak_crowd} People`}
        subtitle={`Recorded at ${stats.peak_time || 'N/A'}`}
        icon={Award}
        variant="warning"
      />
      <KpiCard
        title="Average Crowd"
        value={`${stats.average_crowd} People`}
        subtitle="Mean occupancy today"
        icon={Users}
        variant="primary"
      />
    </div>
  );
};
