import React, { useState, useEffect } from 'react';
import { X, Zap, ArrowDownRight, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import type { EventCreatePayload } from '../../types/crowd';

interface SimulateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: EventCreatePayload) => Promise<boolean>;
}

export const SimulateEventModal: React.FC<SimulateEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [direction, setDirection] = useState<'entry' | 'exit'>('entry');
  const [gateId, setGateId] = useState<string>('GATE_1');
  const [cameraId, setCameraId] = useState<string>('ENTRY_01');
  const [count, setCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDirectionChange = (newDir: 'entry' | 'exit') => {
    setDirection(newDir);
    if (newDir === 'entry') {
      setCameraId(gateId === 'GATE_2' ? 'GATE_2_ENTRY' : 'ENTRY_01');
    } else {
      setCameraId(gateId === 'GATE_2' ? 'GATE_2_EXIT' : 'EXIT_01');
    }
  };

  const handleGateChange = (newGate: string) => {
    setGateId(newGate);
    if (newGate === 'GATE_2') {
      setCameraId(direction === 'entry' ? 'GATE_2_ENTRY' : 'GATE_2_EXIT');
    } else {
      setCameraId(direction === 'entry' ? 'ENTRY_01' : 'EXIT_01');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    const success = await onSubmit({
      camera_id: cameraId,
      gate_id: gateId,
      direction,
      count: Number(count),
    });

    setIsSubmitting(false);

    if (success) {
      setStatusMsg({
        type: 'success',
        text: `Detection event recorded! +${count} ${direction.toUpperCase()} dispatched to backend.`,
      });
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1000);
    } else {
      setStatusMsg({
        type: 'error',
        text: 'Failed to post event to backend API. Please check server status.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md p-4 transition-all duration-300">
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Simulate Camera Event</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Trigger simulated optical crossing detection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Direction Toggle */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
              Flow Direction
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDirectionChange('entry')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-xs transition-all ${
                  direction === 'entry'
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/60 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                <span>ENTRY (+ INGRESS)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDirectionChange('exit')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-xs transition-all ${
                  direction === 'exit'
                    ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-400 dark:border-rose-500/60 shadow-md shadow-rose-500/10 ring-1 ring-rose-500/30'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <ArrowUpRight className="h-4 w-4 text-rose-500" />
                <span>EXIT (- EGRESS)</span>
              </button>
            </div>
          </div>

          {/* Gate Selection */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
              Target Gate Location
            </label>
            <select
              value={gateId}
              onChange={(e) => handleGateChange(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:border-cyan-500 focus:outline-none"
            >
              <option value="GATE_1">Gate 1 — Main Entrance & Ingress</option>
              <option value="GATE_2">Gate 2 — North Turnstiles</option>
              <option value="GATE_3">Gate 3 — South Corridor</option>
            </select>
          </div>

          {/* Camera Node Identifier */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
              Vision Node Identifier
            </label>
            <input
              type="text"
              value={cameraId}
              onChange={(e) => setCameraId(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Person Count with Presets */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
              People Count ({count} {count === 1 ? 'Person' : 'People'})
            </label>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {[1, 2, 5, 10, 25].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`py-1.5 rounded-lg border font-mono font-bold text-xs transition-all ${
                    count === n
                      ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  +{n}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              max="500"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-slate-900 dark:text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Feedback Status Alert */}
          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-500" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Ingesting Event...' : 'Dispatch Detection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
