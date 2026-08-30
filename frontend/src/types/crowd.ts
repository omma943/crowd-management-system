export type DirectionType = 'entry' | 'exit';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'OVER CAPACITY';

export type CameraStatusType = 'ONLINE' | 'OFFLINE' | 'UNKNOWN';

export type AlertPriority = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export interface CrowdCurrent {
  current_crowd: number;
}

export interface CrowdStats {
  current_crowd: number;
  entered_today: number;
  exited_today: number;
  peak_crowd: number;
  peak_time: string | null;
  average_crowd: number;
  busiest_hour: string | null;
  busiest_hour_count: number;
}

export interface CrowdEvent {
  id: number;
  camera_id: string;
  gate_id: string;
  direction: DirectionType;
  count: number;
  timestamp: string;
}

export interface EventListResponse {
  total: number;
  events: CrowdEvent[];
}

export interface EventCreatePayload {
  camera_id: string;
  gate_id: string;
  direction: DirectionType;
  count: number;
}

export interface GateAnalytics {
  gate_id: string;
  entries: number;
  exits: number;
  current_contribution: number;
  entry_camera?: string;
  exit_camera?: string;
  entry_status: CameraStatusType;
  exit_status: CameraStatusType;
}

export interface CameraStatus {
  camera_id: string;
  gate_id: string;
  direction: DirectionType;
  status: CameraStatusType;
  last_event_time?: string | null;
}

export interface CrowdHistoryPoint {
  time: string;
  timestamp: string;
  entries: number;
  exits: number;
  crowd: number;
}

export interface AlertItem {
  id: string;
  type: string;
  priority: AlertPriority;
  title: string;
  message: string;
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED' | 'RECORDED';
}

export interface SystemSettings {
  maxCapacity: number;
  thresholdLow: number;       // default 30%
  thresholdModerate: number;  // default 70%
  thresholdHigh: number;      // default 90%
  thresholdCritical: number;  // default 100%
  pollingIntervalMs: number;  // default 3000ms
  defaultGate: string;        // default "GATE_1"
  enableSoundAlerts: boolean;
}

export interface ConnectionStatus {
  isOnline: boolean;
  lastSuccessfulUpdate: Date | null;
  errorMessage: string | null;
}
