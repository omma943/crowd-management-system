import React, { useState, useEffect } from 'react';
import { X, Search, Users, Check, ChevronRight } from 'lucide-react';
import { usePlace } from '../../context/PlaceContext';
import type { PlaceCategory } from '../../types/place';

export const LocationSelectorModal: React.FC = () => {
  const {
    places,
    selectedPlaceId,
    selectPlace,
    isLocationModalOpen,
    setIsLocationModalOpen,
  } = usePlace();

  const [modalSearch, setModalSearch] = useState<string>('');
  const [modalCategory, setModalCategory] = useState<PlaceCategory | 'All'>('All');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLocationModalOpen) {
        setIsLocationModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocationModalOpen, setIsLocationModalOpen]);

  if (!isLocationModalOpen) return null;

  const filteredPlaces = places.filter((p) => {
    const matchesCategory = modalCategory === 'All' || p.category === modalCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
      p.shortName.toLowerCase().includes(modalSearch.toLowerCase()) ||
      p.city.toLowerCase().includes(modalSearch.toLowerCase()) ||
      p.address.toLowerCase().includes(modalSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: string, occupancy: number) => {
    switch (status) {
      case 'CRITICAL':
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            {status} ({occupancy}%)
          </span>
        );
      case 'MODERATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            MODERATE ({occupancy}%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            LOW ({occupancy}%)
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md p-4 transition-all"
      onClick={() => setIsLocationModalOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden border border-teal-400/40 shadow-md shadow-teal-500/20 bg-[#081226] shrink-0">
              <img
                src="/images/logo.jpg"
                alt="CrowdSafe AI Logo"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                SELECT MONITORED LOCATION
              </h3>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                Choose a temple, fort, or pilgrimage site to view live occupancy
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by temple name, fort, city, or area..."
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              autoFocus
              className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-medium placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {(['All', 'Temple', 'Heritage'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setModalCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap text-[11px] ${
                  modalCategory === cat
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {cat === 'All' ? '🌟 All Locations' : cat === 'Temple' ? '🛕 Temples & Shrines' : '🏰 Heritage & Forts'}
              </button>
            ))}
          </div>
        </div>

        {/* Places List */}
        <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredPlaces.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching locations found for "{modalSearch}".
            </div>
          ) : (
            filteredPlaces.map((place) => {
              const isSelected = place.id === selectedPlaceId;
              const occupancyPct = Math.round((place.currentCount / place.baseCapacity) * 100);

              return (
                <div
                  key={place.id}
                  onClick={() => selectPlace(place.id)}
                  className={`pt-2.5 first:pt-0 flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/40 shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={place.image}
                      alt={place.shortName}
                      className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
                          {place.shortName}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          • {place.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                          <Users className="h-3 w-3 text-cyan-500" />
                          {place.currentCount.toLocaleString()}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        {getStatusBadge(place.status, occupancyPct)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    {isSelected ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-white shadow-sm">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </span>
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-center text-[11px] text-slate-500 font-medium">
          Selecting a location updates Live Crowd, Capacity AI Forecast, Help Facilities, and Safety Alerts.
        </div>
      </div>
    </div>
  );
};
