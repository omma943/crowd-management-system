import React, { useState } from 'react';
import { X, Zap, ArrowDownRight, ArrowUpRight } from 'lucide-react';
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
        text: `Simulated event posted! +${count} ${direction.toUpperCase()} recorded.`,
      });
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1200);
    } else {
      setStatusMsg({
        type: 'error',
        text: 'Failed to post event to backend API.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Simulate Camera Event</h3>
              <p className="text-xs text-slate-400">Trigger AI detection event into backend</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Direction Toggle */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
              Event Direction
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDirectionChange('entry')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border font-bold transition-all ${
                  direction === 'entry'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <ArrowDownRight className="h-4 w-4 text-emerald-400" />
                <span>ENTRY (+ INFLOW)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDirectionChange('exit')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border font-bold transition-all ${
                  direction === 'exit'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <ArrowUpRight className="h-4 w-4 text-rose-400" />
                <span>EXIT (- OUTFLOW)</span>
              </button>
            </div>
          </div>

          {/* Gate Selection */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Access Gate
            </label>
            <select
              value={gateId}
              onChange={(e) => handleGateChange(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="GATE_1">Gate 1 (Main Entrance)</option>
              <option value="GATE_2">Gate 2 (North Turnstiles)</option>
              <option value="GATE_3">Gate 3 (South Corridor)</option>
            </select>
          </div>

          {/* Camera Node */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Camera Node ID
            </label>
            <input
              type="text"
              value={cameraId}
              onChange={(e) => setCameraId(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Person Count */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
              People Count
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 5, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`flex-1 py-1.5 rounded-lg border font-mono font-bold ${
                    count === n
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  +{n}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full mt-2 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {statusMsg && (
            <div
              className={`p-2.5 rounded-lg text-xs font-semibold ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Dispatch Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
