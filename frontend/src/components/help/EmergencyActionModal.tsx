import React, { useState } from 'react';
import { X, AlertOctagon, ShieldAlert, HeartPulse, UserX, CheckCircle2, Phone, Megaphone, Send } from 'lucide-react';
import type { Place } from '../../types/place';

interface EmergencyActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'sos' | 'security' | 'medical' | 'lost';
  place: Place;
}

export const EmergencyActionModal: React.FC<EmergencyActionModalProps> = ({
  isOpen,
  onClose,
  type,
  place,
}) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lostName, setLostName] = useState<string>('');
  const [lostAge, setLostAge] = useState<string>('');
  const [lostDesc, setLostDesc] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      // simulated success
    }, 1000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setLostName('');
    setLostAge('');
    setLostDesc('');
    setContactPhone('');
    onClose();
  };

  const getModalConfig = () => {
    switch (type) {
      case 'sos':
        return {
          title: '🚨 EMERGENCY SOS ASSISTANCE',
          subtitle: `Immediate security & emergency response dispatched to ${place.shortName}`,
          icon: <AlertOctagon className="h-6 w-6 text-rose-500" />,
          accentColor: 'from-rose-600 to-red-600',
          borderColor: 'border-rose-500/40',
        };
      case 'security':
        return {
          title: '👮 CONTACT SECURITY & POLICE',
          subtitle: `Direct contact channels for onsite police & temple trust marshals at ${place.shortName}`,
          icon: <ShieldAlert className="h-6 w-6 text-indigo-500" />,
          accentColor: 'from-indigo-600 to-blue-600',
          borderColor: 'border-indigo-500/40',
        };
      case 'medical':
        return {
          title: '🏥 REQUEST MEDICAL / FIRST AID',
          subtitle: `First-aid stretcher & paramedic unit on standby at ${place.shortName}`,
          icon: <HeartPulse className="h-6 w-6 text-emerald-500" />,
          accentColor: 'from-emerald-600 to-teal-600',
          borderColor: 'border-emerald-500/40',
        };
      case 'lost':
        return {
          title: '🧑 REPORT LOST PERSON / CHILD',
          subtitle: `Broadcast description over ${place.shortName} PA audio & alert all exit checkpoints`,
          icon: <UserX className="h-6 w-6 text-amber-500" />,
          accentColor: 'from-amber-600 to-orange-600',
          borderColor: 'border-amber-500/40',
        };
    }
  };

  const config = getModalConfig();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md p-4 transition-all"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-lg rounded-3xl border ${config.borderColor} bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm">
              {config.icon}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                {config.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {config.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
              Emergency Request Dispatched!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Our on-ground coordinators at {place.shortName} have been notified. Stay in a safe spot near a marked facility or security booth.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs shadow-md transition-all hover:scale-105"
            >
              Close Window
            </button>
          </div>
        ) : type === 'lost' ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                Name of Missing Person / Child
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Patil"
                value={lostName}
                onChange={(e) => setLostName(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-slate-900 dark:text-slate-100 font-medium focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Age / Gender
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7 yrs, Boy"
                  value={lostAge}
                  onChange={(e) => setLostAge(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-slate-900 dark:text-slate-100 font-medium focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Guardian Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-slate-900 dark:text-slate-100 font-medium focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                Clothes Worn & Last Seen Location
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Yellow Kurta, blue jeans. Last seen near Main Mandap Aarti queue 15 mins ago."
                value={lostDesc}
                onChange={(e) => setLostDesc(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-slate-900 dark:text-slate-100 font-medium focus:border-cyan-500 focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-xl bg-gradient-to-r ${config.accentColor} text-white font-black text-xs shadow-md flex items-center gap-1.5`}
              >
                <Megaphone className="h-4 w-4" />
                Broadcast Announcement
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Direct Phone Dial Directory */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Direct Emergency Contact Numbers
              </div>
              {place.emergencyContacts.map((contact) => (
                <a
                  key={contact.phone}
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-cyan-500 transition-all group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {contact.role}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {contact.name} • <span className="text-emerald-500">{contact.availability}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono font-bold text-xs">
                    <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>{contact.phone}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Instant Alert Button */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 font-bold text-xs"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={`px-5 py-2 rounded-xl bg-gradient-to-r ${config.accentColor} text-white font-black text-xs shadow-md flex items-center gap-1.5`}
              >
                <Send className="h-4 w-4" />
                Dispatch Instant Alert
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
