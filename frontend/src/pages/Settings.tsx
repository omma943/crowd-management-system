import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();

  const [maxCapacity, setMaxCapacity] = useState<number>(settings.maxCapacity);
  const [thresholdLow, setThresholdLow] = useState<number>(settings.thresholdLow);
  const [thresholdModerate, setThresholdModerate] = useState<number>(settings.thresholdModerate);
  const [thresholdHigh, setThresholdHigh] = useState<number>(settings.thresholdHigh);
  const [thresholdCritical, setThresholdCritical] = useState<number>(settings.thresholdCritical);
  const [pollingInterval, setPollingInterval] = useState<number>(settings.pollingIntervalMs / 1000);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      maxCapacity: Number(maxCapacity),
      thresholdLow: Number(thresholdLow),
      thresholdModerate: Number(thresholdModerate),
      thresholdHigh: Number(thresholdHigh),
      thresholdCritical: Number(thresholdCritical),
      pollingIntervalMs: Number(pollingInterval) * 1000,
    });
    setStatusMsg('Settings successfully updated!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleReset = () => {
    resetSettings();
    setMaxCapacity(200);
    setThresholdLow(30);
    setThresholdModerate(70);
    setThresholdHigh(90);
    setThresholdCritical(100);
    setPollingInterval(3);
    setStatusMsg('Settings reset to system defaults.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-md flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">System Configuration</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure Venue Limits, Density Thresholds & UI Preferences
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            Appearance & Theme
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Theme Mode</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch between Dark Cyber Mode and Crisp Light Mode</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 font-bold text-xs shadow-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span>Dark Mode (Active)</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-indigo-600" />
                  <span>Light Mode (Active)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Venue Capacity Parameters */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            Venue Capacity & Safety Limits
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Maximum Venue Capacity (People)
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Used as the 100% baseline for calculating occupancy percentage, density gauge, and headroom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                Moderate Risk Band (% of Max)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={thresholdModerate}
                onChange={(e) => setThresholdModerate(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">
                High Risk Band (% of Max)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={thresholdHigh}
                onChange={(e) => setThresholdHigh(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
                Critical Alert Band (% of Max)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={thresholdCritical}
                onChange={(e) => setThresholdCritical(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Polling Interval */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            Telemetry Refresh Rate
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Polling Frequency ({pollingInterval} Seconds)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={pollingInterval}
              onChange={(e) => setPollingInterval(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              <span>1s (Ultra Fast)</span>
              <span>3s (Recommended)</span>
              <span>10s (Relaxed)</span>
            </div>
          </div>
        </div>

        {statusMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold shadow-md shadow-cyan-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
