import React, { useState } from 'react';
import {
  MapPin,
  HeartPulse,
  ShieldCheck,
  DoorOpen,
  Bath,
  Droplets,
  HelpCircle,
  Footprints,
  Accessibility,
  Navigation,
} from 'lucide-react';
import type { FacilityItem } from '../../types/place';

interface FacilitiesMapCardProps {
  facilities: FacilityItem[];
  placeName: string;
}

export const FacilitiesMapCard: React.FC<FacilitiesMapCardProps> = ({
  facilities,
  placeName,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medical':
        return <HeartPulse className="h-4 w-4 text-emerald-500" />;
      case 'security':
        return <ShieldCheck className="h-4 w-4 text-indigo-500" />;
      case 'exit':
        return <DoorOpen className="h-4 w-4 text-rose-500" />;
      case 'restroom':
        return <Bath className="h-4 w-4 text-blue-500" />;
      case 'water':
        return <Droplets className="h-4 w-4 text-cyan-500" />;
      case 'help':
        return <HelpCircle className="h-4 w-4 text-purple-500" />;
      case 'shoe':
        return <Footprints className="h-4 w-4 text-amber-500" />;
      case 'wheelchair':
        return <Accessibility className="h-4 w-4 text-teal-500" />;
      default:
        return <MapPin className="h-4 w-4 text-slate-500" />;
    }
  };

  const filteredFacilities =
    activeCategory === 'all'
      ? facilities
      : facilities.filter((f) => f.category === activeCategory);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
              NEAREST AMENITIES & EMERGENCY FACILITIES
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Verified spatial stations located inside {placeName}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          {facilities.length} Verified Stations
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Stations' },
          { id: 'medical', label: '🚑 Medical & First Aid' },
          { id: 'security', label: '👮 Police & Security' },
          { id: 'exit', label: '🚪 Emergency Exits' },
          { id: 'restroom', label: '🚻 Restrooms' },
          { id: 'water', label: '💧 Drinking Water' },
          { id: 'shoe', label: '👟 Shoe Stand' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap text-[11px] ${
              activeCategory === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredFacilities.map((f) => (
          <div
            key={f.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
              f.isEmergency
                ? 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10'
                : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mt-0.5">
                {getCategoryIcon(f.category)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                    {f.name}
                  </span>
                  {f.isEmergency && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      EMERGENCY
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  📍 {f.locationNote}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 text-right">
              <span className="inline-block px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-black text-xs border border-cyan-500/20">
                {f.distanceMeters}m
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
