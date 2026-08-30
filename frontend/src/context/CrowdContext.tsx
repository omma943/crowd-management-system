import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { crowdApi } from '../api/crowdApi';
import type {
  CrowdStats,
  CrowdEvent,
  GateAnalytics,
  CameraStatus,
  CrowdHistoryPoint,
  AlertItem,
  ConnectionStatus,
  EventCreatePayload,
} from '../types/crowd';
import { useSettings } from './SettingsContext';

interface CrowdContextType {
  currentCrowd: number;
  stats: CrowdStats;
  history: CrowdHistoryPoint[];
  gates: GateAnalytics[];
  cameras: CameraStatus[];
  recentEvents: CrowdEvent[];
  alerts: AlertItem[];
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
  dispatchSimulatedEvent: (payload: EventCreatePayload) => Promise<boolean>;
  historyPeriod: 'today' | 'yesterday' | '7days' | '30days';
  setHistoryPeriod: (period: 'today' | 'yesterday' | '7days' | '30days') => void;
}

const DEFAULT_STATS: CrowdStats = {
  current_crowd: 0,
  entered_today: 0,
  exited_today: 0,
  peak_crowd: 0,
  peak_time: null,
  average_crowd: 0,
  busiest_hour: null,
  busiest_hour_count: 0,
};

const CrowdContext = createContext<CrowdContextType | undefined>(undefined);

export const CrowdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [stats, setStats] = useState<CrowdStats>(DEFAULT_STATS);
  const [history, setHistory] = useState<CrowdHistoryPoint[]>([]);
  const [gates, setGates] = useState<GateAnalytics[]>([]);
  const [cameras, setCameras] = useState<CameraStatus[]>([]);
  const [recentEvents, setRecentEvents] = useState<CrowdEvent[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [historyPeriod, setHistoryPeriod] = useState<'today' | 'yesterday' | '7days' | '30days'>('today');

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isOnline: false,
    lastSuccessfulUpdate: null,
    errorMessage: null,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const isFetchingRef = useRef<boolean>(false);

  const fetchAllData = useCallback(async (isSilent = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (!isSilent) setIsRefreshing(true);

    try {
      const [
        statsRes,
        historyRes,
        gatesRes,
        camerasRes,
        eventsRes,
        alertsRes
      ] = await Promise.allSettled([
        crowdApi.getTodayStats(),
        crowdApi.getCrowdHistory(historyPeriod),
        crowdApi.getGateAnalytics(),
        crowdApi.getCameraStatuses(),
        crowdApi.getEvents({ limit: 15 }),
        crowdApi.getAlerts(settings.maxCapacity),
      ]);

      let hasSuccess = false;

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
        hasSuccess = true;
      }
      if (historyRes.status === 'fulfilled') {
        setHistory(historyRes.value);
      }
      if (gatesRes.status === 'fulfilled') {
        setGates(gatesRes.value);
      }
      if (camerasRes.status === 'fulfilled') {
        setCameras(camerasRes.value);
      }
      if (eventsRes.status === 'fulfilled') {
        setRecentEvents(eventsRes.value.events || []);
      }
      if (alertsRes.status === 'fulfilled') {
        setAlerts(alertsRes.value);
      }

      if (hasSuccess) {
        setConnectionStatus({
          isOnline: true,
          lastSuccessfulUpdate: new Date(),
          errorMessage: null,
        });
      } else {
        throw new Error('Unable to retrieve live crowd data from backend.');
      }
    } catch (error: any) {
      setConnectionStatus((prev) => ({
        isOnline: false,
        lastSuccessfulUpdate: prev.lastSuccessfulUpdate,
        errorMessage: error.message || 'Unable to connect to crowd monitoring backend.',
      }));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  }, [historyPeriod, settings.maxCapacity]);

  useEffect(() => {
    fetchAllData(false);
  }, [fetchAllData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData(true);
    }, settings.pollingIntervalMs || 3000);

    return () => clearInterval(interval);
  }, [fetchAllData, settings.pollingIntervalMs]);

  const dispatchSimulatedEvent = async (payload: EventCreatePayload): Promise<boolean> => {
    try {
      await crowdApi.createEvent(payload);
      await fetchAllData(true);
      return true;
    } catch (err: any) {
      console.error('Failed to post event:', err);
      return false;
    }
  };

  const refreshData = async () => {
    await fetchAllData(false);
  };

  return (
    <CrowdContext.Provider
      value={{
        currentCrowd: stats.current_crowd,
        stats,
        history,
        gates,
        cameras,
        recentEvents,
        alerts,
        connectionStatus,
        isLoading,
        isRefreshing,
        refreshData,
        dispatchSimulatedEvent,
        historyPeriod,
        setHistoryPeriod,
      }}
    >
      {children}
    </CrowdContext.Provider>
  );
};

export const useCrowdData = (): CrowdContextType => {
  const context = useContext(CrowdContext);
  if (!context) {
    throw new Error('useCrowdData must be used within a CrowdProvider');
  }
  return context;
};
