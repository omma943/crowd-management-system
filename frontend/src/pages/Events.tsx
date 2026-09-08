import React, { useState, useEffect, useCallback } from 'react';
import { ListFilter, Download, PlusCircle, RefreshCw } from 'lucide-react';
import { crowdApi } from '../api/crowdApi';
import type { CrowdEvent } from '../types/crowd';
import { EventFilters } from '../components/events/EventFilters';
import { EventTable } from '../components/events/EventTable';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

interface EventsPageProps {
  onOpenSimulator?: () => void;
}

export const Events: React.FC<EventsPageProps> = ({ onOpenSimulator }) => {
  const [events, setEvents] = useState<CrowdEvent[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [skip, setSkip] = useState<number>(0);
  const [limit] = useState<number>(15);
  const [direction, setDirection] = useState<string>('all');
  const [gateId, setGateId] = useState<string>('all');
  const [cameraId, setCameraId] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await crowdApi.getEvents({
        skip,
        limit,
        direction,
        gate_id: gateId,
        camera_id: cameraId,
        start_date: startDate,
        end_date: endDate,
      });
      setEvents(response.events);
      setTotal(response.total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch event records';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [skip, limit, direction, gateId, cameraId, startDate, endDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleResetFilters = () => {
    setDirection('all');
    setGateId('all');
    setCameraId('all');
    setStartDate('');
    setEndDate('');
    setSkip(0);
  };

  const exportCSV = () => {
    if (events.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Camera_ID', 'Gate_ID', 'Direction', 'Count'];
    const rows = events.map((e) => [
      e.id,
      `"${e.timestamp}"`,
      `"${e.camera_id}"`,
      `"${e.gate_id}"`,
      e.direction,
      e.count,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `crowd_events_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
            <ListFilter className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Event Audit Explorer</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete Anonymous Detection Stream & Audit Trail
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchEvents()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportCSV}
            disabled={events.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors shadow-sm disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Simulate</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Component */}
      <EventFilters
        direction={direction}
        setDirection={(d) => { setDirection(d); setSkip(0); }}
        gateId={gateId}
        setGateId={(g) => { setGateId(g); setSkip(0); }}
        cameraId={cameraId}
        setCameraId={(c) => { setCameraId(c); setSkip(0); }}
        startDate={startDate}
        setStartDate={(s) => { setStartDate(s); setSkip(0); }}
        endDate={endDate}
        setEndDate={(e) => { setEndDate(e); setSkip(0); }}
        onReset={handleResetFilters}
      />

      {/* Error state */}
      {error && (
        <ErrorState
          title="Failed to Load Event Log"
          message={error}
          onRetry={fetchEvents}
        />
      )}

      {/* Loading state */}
      {isLoading && !error && <LoadingState type="table" />}

      {/* Table */}
      {!isLoading && !error && (
        <EventTable
          events={events}
          total={total}
          skip={skip}
          limit={limit}
          onPageChange={(newSkip) => setSkip(newSkip)}
        />
      )}
    </div>
  );
};
