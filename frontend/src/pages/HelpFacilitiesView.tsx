import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  HeartPulse,
  UserX,
  MapPin,
} from 'lucide-react';
import { usePlace } from '../context/PlaceContext';
import { EmergencyActionModal } from '../components/help/EmergencyActionModal';
import { FacilitiesMapCard } from '../components/help/FacilitiesMapCard';

export const HelpFacilitiesView: React.FC = () => {
  const { selectedPlace } = usePlace();
  const [modalType, setModalType] = useState<'sos' | 'security' | 'medical' | 'lost' | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Location Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-500/30 uppercase">
              Emergency & Support
            </span>
            <span className="text-xs text-slate-400">• {selectedPlace.city}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Help & Emergency Assistance — {selectedPlace.shortName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Instant emergency response dispatch and verified spatial amenities
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <MapPin className="h-4 w-4 text-cyan-500" />
          <span>You are at: {selectedPlace.shortName}</span>
        </div>
      </div>

      {/* Hero Location Status Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <img
          src={selectedPlace.image}
          alt={selectedPlace.shortName}
          className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md flex-shrink-0"
        />
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            ACTIVE ASSISTANCE SYSTEM ONLINE
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
            {selectedPlace.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            📍 {selectedPlace.address}
          </p>
          <div className="text-[11px] font-medium text-slate-400">
            On-ground response team stationed at Main Gates & First Aid Stations.
          </div>
        </div>
      </div>

      {/* 4 Big Emergency Action Buttons */}
      <div>
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
          Instant Emergency Action Triggers
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SOS Button */}
          <button
            onClick={() => setModalType('sos')}
            className="group p-5 rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 text-left flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-white/20">
                CRITICAL
              </span>
            </div>
            <div>
              <div className="text-base font-black tracking-tight">🚨 GET HELP / SOS</div>
              <div className="text-[11px] text-rose-100 mt-0.5">
                Immediate distress alarm & security dispatch
              </div>
            </div>
          </button>

          {/* Security Contact */}
          <button
            onClick={() => setModalType('security')}
            className="group p-5 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 text-left flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-white/20">
                SECURITY
              </span>
            </div>
            <div>
              <div className="text-base font-black tracking-tight">👮 CONTACT SECURITY</div>
              <div className="text-[11px] text-indigo-100 mt-0.5">
                Direct line to police chowki & temple marshals
              </div>
            </div>
          </button>

          {/* Request Medical */}
          <button
            onClick={() => setModalType('medical')}
            className="group p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 text-left flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                <HeartPulse className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-white/20">
                MEDICAL
              </span>
            </div>
            <div>
              <div className="text-base font-black tracking-tight">🏥 REQUEST MEDICAL</div>
              <div className="text-[11px] text-emerald-100 mt-0.5">
                First aid, stretcher & ambulance request
              </div>
            </div>
          </button>

          {/* Report Lost Person */}
          <button
            onClick={() => setModalType('lost')}
            className="group p-5 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 text-left flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                <UserX className="h-6 w-6" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-white/20">
                ANNOUNCEMENT
              </span>
            </div>
            <div>
              <div className="text-base font-black tracking-tight">🧑 REPORT LOST PERSON</div>
              <div className="text-[11px] text-amber-100 mt-0.5">
                Broadcast child/elder announcement on PA mic
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Nearest Facilities Directory */}
      <FacilitiesMapCard
        facilities={selectedPlace.facilities}
        placeName={selectedPlace.shortName}
      />

      {/* Emergency Action Modal */}
      {modalType && (
        <EmergencyActionModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          type={modalType}
          place={selectedPlace}
        />
      )}
    </div>
  );
};
