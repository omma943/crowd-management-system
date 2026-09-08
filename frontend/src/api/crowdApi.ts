import { request } from './apiClient';
import type {
  CrowdCurrent,
  CrowdStats,
  CrowdEvent,
  EventListResponse,
  EventCreatePayload,
  GateAnalytics,
  CameraStatus,
  CrowdHistoryPoint,
  AlertItem,
} from '../types/crowd';

export const crowdApi = {
  /**
   * Check backend server health
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return request<{ status: string; timestamp: string }>('/health');
  },

  /**
   * Get real-time current crowd count (Total entries - Total exits)
   */
  async getCurrentCrowd(): Promise<CrowdCurrent> {
    return request<CrowdCurrent>('/crowd/current');
  },

  /**
   * Get comprehensive today metrics (current crowd, entered today, exited today, peak crowd, avg, etc.)
   */
  async getTodayStats(): Promise<CrowdStats> {
    return request<CrowdStats>('/crowd/stats');
  },

  /**
   * Get timeline history for line and comparison charts
   */
  async getCrowdHistory(period: 'today' | 'yesterday' | '7days' | '30days' = 'today'): Promise<CrowdHistoryPoint[]> {
    return request<CrowdHistoryPoint[]>(`/crowd/history?period=${encodeURIComponent(period)}`);
  },

  /**
   * Get multi-gate breakdown (entries, exits, current contribution, camera status)
   */
  async getGateAnalytics(): Promise<GateAnalytics[]> {
    return request<GateAnalytics[]>('/crowd/gates');
  },

  /**
   * Get camera device health and last active timestamps
   */
  async getCameraStatuses(): Promise<CameraStatus[]> {
    return request<CameraStatus[]>('/crowd/cameras');
  },

  /**
   * Get real-time system alerts calculated from current crowd thresholds
   */
  async getAlerts(capacity: number = 200): Promise<AlertItem[]> {
    return request<AlertItem[]>(`/crowd/alerts?capacity=${encodeURIComponent(capacity)}`);
  },

  /**
   * List anonymous events with pagination and filters
   */
  async getEvents(params: {
    skip?: number;
    limit?: number;
    direction?: string;
    gate_id?: string;
    camera_id?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<EventListResponse> {
    const searchParams = new URLSearchParams();
    if (params.skip !== undefined) searchParams.append('skip', String(params.skip));
    if (params.limit !== undefined) searchParams.append('limit', String(params.limit));
    if (params.direction && params.direction !== 'all') searchParams.append('direction', params.direction);
    if (params.gate_id && params.gate_id !== 'all') searchParams.append('gate_id', params.gate_id);
    if (params.camera_id && params.camera_id !== 'all') searchParams.append('camera_id', params.camera_id);
    if (params.start_date) searchParams.append('start_date', params.start_date);
    if (params.end_date) searchParams.append('end_date', params.end_date);

    const queryString = searchParams.toString();
    return request<EventListResponse>(`/events${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Dispatch a new entry or exit event (e.g. from camera/simulator)
   */
  async createEvent(payload: EventCreatePayload): Promise<CrowdEvent> {
    return request<CrowdEvent>('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
