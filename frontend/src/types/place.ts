export type PlaceCategory = 'Temple' | 'Heritage' | 'Tourist';

export interface ZoneCrowd {
  id: string;
  name: string;
  occupancyPercentage: number;
  status: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  currentCount: number;
  maxCapacity: number;
}

export interface CrowdForecastPoint {
  time: string;
  occupancyPercentage: number;
  status: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  note?: string;
}

export interface FacilityItem {
  id: string;
  name: string;
  category: 'medical' | 'security' | 'exit' | 'restroom' | 'water' | 'help' | 'shoe' | 'wheelchair';
  distanceMeters: number;
  locationNote: string;
  isEmergency?: boolean;
}

export interface EmergencyContact {
  role: string;
  name: string;
  phone: string;
  availability: string;
}

export interface PlaceAlert {
  id: string;
  priority: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: string;
  zoneId?: string;
  type: string;
}

export interface Place {
  id: string;
  name: string;
  shortName: string;
  category: PlaceCategory;
  categoryLabel: string;
  city: string;
  district: string;
  address: string;
  image: string;
  description: string;
  baseCapacity: number;
  currentCount: number;
  enteredToday: number;
  exitedToday: number;
  peakCrowd: number;
  peakTime: string;
  leastCrowdedTime: string;
  leastCrowdedCount: number;
  averageOccupancy: number;
  status: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  zones: ZoneCrowd[];
  forecast: CrowdForecastPoint[];
  forecastWarning?: string;
  recommendedVisitTime: string;
  recommendedVisitReason: string;
  facilities: FacilityItem[];
  emergencyContacts: EmergencyContact[];
  alerts: PlaceAlert[];
  aiInsights: string[];
}
