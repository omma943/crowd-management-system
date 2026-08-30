import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SystemSettings, RiskLevel } from '../types/crowd';

const DEFAULT_SETTINGS: SystemSettings = {
  maxCapacity: 200,
  thresholdLow: 30,        // 0-30% LOW
  thresholdModerate: 70,   // 31-70% MODERATE
  thresholdHigh: 90,       // 71-90% HIGH
  thresholdCritical: 100,  // 91-100% CRITICAL, >100% OVER CAPACITY
  pollingIntervalMs: 3000, // 3 seconds
  defaultGate: 'GATE_1',
  enableSoundAlerts: false,
};

interface SettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetSettings: () => void;
  getOccupancyPercentage: (current: number) => number;
  getRiskLevel: (current: number) => RiskLevel;
  getStatusColor: (level: RiskLevel) => { text: string; bg: string; border: string; glow: string; fill: string };
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('crowd_system_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('crowd_system_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to persist settings', e);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const getOccupancyPercentage = (current: number): number => {
    if (!settings.maxCapacity || settings.maxCapacity <= 0) return 0;
    return Number(((current / settings.maxCapacity) * 100).toFixed(1));
  };

  const getRiskLevel = (current: number): RiskLevel => {
    const pct = getOccupancyPercentage(current);
    if (pct > settings.thresholdCritical) return 'OVER CAPACITY';
    if (pct > settings.thresholdHigh) return 'CRITICAL';
    if (pct > settings.thresholdModerate) return 'HIGH';
    if (pct > settings.thresholdLow) return 'MODERATE';
    return 'LOW';
  };

  const getStatusColor = (level: RiskLevel) => {
    switch (level) {
      case 'OVER CAPACITY':
        return {
          text: 'text-red-500',
          bg: 'bg-red-500/10',
          border: 'border-red-500/40',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
          fill: '#DC2626'
        };
      case 'CRITICAL':
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/40',
          glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
          fill: '#EF4444'
        };
      case 'HIGH':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/40',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
          fill: '#F97316'
        };
      case 'MODERATE':
        return {
          text: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/40',
          glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]',
          fill: '#EAB308'
        };
      case 'LOW':
      default:
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/40',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
          fill: '#10B981'
        };
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        getOccupancyPercentage,
        getRiskLevel,
        getStatusColor,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
