import React from 'react';
import {
  Search,
  MapPin,
  Users,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Compass,
} from 'lucide-react';
import { usePlace } from '../context/PlaceContext';
import type { PlaceCategory } from '../types/place';

interface HomeExplorePlacesProps {
  onSelectPlaceToDashboard: (placeId: string) => void;
}

export const HomeExplorePlaces: React.FC<HomeExplorePlacesProps> = ({
  onSelectPlaceToDashboard,
}) => {
  const {
    places,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    selectPlace,
  } = usePlace();

  const handlePlaceClick = (placeId: string) => {
    selectPlace(placeId);
    onSelectPlaceToDashboard(placeId);
  };

  const filteredPlaces = places.filter((p) => {
    const matchesCategory =
      categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPeopleTracked = places.reduce((sum, p) => sum + p.currentCount, 0);
  const lowCrowdPlaces = places.filter((p) => p.status === 'LOW' || p.status === 'MODERATE');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return {
          label: '🔴 Critical Crowd',
          badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
          barClass: 'bg-rose-500',
        };
      case 'HIGH':
        return {
          label: '🔴 High Crowd',
          badgeClass: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
          barClass: 'bg-orange-500',
        };
      case 'MODERATE':
        return {
          label: '🟡 Moderate Crowd',
          badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
          barClass: 'bg-amber-500',
        };
      default:
        return {
          label: '🟢 Low Crowd',
          badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          barClass: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-28 lg:pb-16 max-w-7xl mx-auto px-1 sm:px-0">
      {/* Hero Banner with Official CrowdSafe AI Artwork (Responsive Aspect Ratio) */}
      <div className="space-y-4 sm:space-y-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-teal-500/30 dark:border-teal-400/30 bg-gradient-to-r from-[#031525] via-[#08223a] to-[#041a2e] shadow-xl sm:shadow-2xl shadow-teal-500/15 group">
          <img
            src="/images/crowdsafe-banner.png"
            alt="CrowdSafe AI - Safer Communities. Smarter Tomorrow."
            className="w-full h-auto block select-none transition-transform duration-500 group-hover:scale-[1.008]"
            style={{ aspectRatio: '1024 / 384' }}
          />
          {/* Subtle Ambient Neon Rim */}
          <div className="absolute inset-0 ring-1 ring-inset ring-teal-400/20 rounded-2xl sm:rounded-3xl pointer-events-none" />
        </div>

        {/* Search & Category Filter Section with High-Impact Responsive Styling */}
        <div className="p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-teal-500/20 dark:border-teal-500/30 bg-white/95 dark:bg-[#0A1322]/90 backdrop-blur-xl shadow-lg shadow-teal-500/5 space-y-3.5 sm:space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Explore Pilgrimage & Heritage Sites
            </h2>
            <p className="text-[11px] sm:text-sm text-teal-700 dark:text-teal-400 font-medium">
              Real-time crowd density, safety alerts, and AI forecast across Maharashtra
            </p>
          </div>

          {/* Search Bar - Touch Optimized for Mobile (Min 44px Height) */}
          <div className="max-w-xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-teal-500 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="🔍 Search temples, historic forts, cities, or areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl sm:rounded-2xl bg-teal-50/50 dark:bg-slate-950 border border-teal-200 dark:border-teal-800/80 pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-medium min-h-[44px]"
              />
            </div>
          </div>

          {/* Category Filter Chips - Fluid Touch Targets for Mobile */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
            {[
              { id: 'All', label: '🌟 All Places' },
              { id: 'Temple', label: '🛕 Temples & Pilgrimage' },
              { id: 'Heritage', label: '🏰 Forts & Heritage' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as PlaceCategory | 'All')}
                className={`px-3 sm:px-4 py-2 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all min-h-[38px] flex items-center justify-center ${
                  categoryFilter === cat.id
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/30 scale-105 border border-teal-300/40'
                    : 'bg-teal-500/10 dark:bg-slate-800/80 text-teal-800 dark:text-teal-300 border border-teal-500/20 dark:border-teal-700/50 hover:border-teal-400 active:scale-95'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live City Summary Stats Grid - Fluid 2 or 4 Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-2xl border border-teal-500/20 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
            <Compass className="h-4 sm:h-5 w-4 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 uppercase truncate">
              Monitored Places
            </div>
            <div className="text-sm sm:text-xl font-black font-mono text-slate-900 dark:text-slate-100 truncate">
              {places.length} Sites
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl border border-teal-500/20 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
            <Users className="h-4 sm:h-5 w-4 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 uppercase truncate">
              Live Devotees
            </div>
            <div className="text-sm sm:text-xl font-black font-mono text-slate-900 dark:text-slate-100 truncate">
              {totalPeopleTracked.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl border border-teal-500/20 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <ShieldCheck className="h-4 sm:h-5 w-4 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 uppercase truncate">
              Low Density
            </div>
            <div className="text-sm sm:text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 truncate">
              {lowCrowdPlaces.length} Clear
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl border border-teal-500/20 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
            <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 uppercase truncate">
              AI Forecast
            </div>
            <div className="text-sm sm:text-xl font-black font-mono text-purple-600 dark:text-purple-400 truncate">
              +15m / +60m
            </div>
          </div>
        </div>
      </div>

      {/* Places Cards Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              EXPLORE MONITORED PLACES
            </h2>
            <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800/60">
              {filteredPlaces.length}
            </span>
          </div>
        </div>

        {/* Empty State when Search has no results */}
        {filteredPlaces.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-teal-500/30 bg-white/50 dark:bg-slate-900/50 p-8 space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching locations found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any place matching "{searchQuery}". Try searching for another temple or fort.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All');
              }}
              className="px-4 py-2 rounded-xl bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPlaces.map((place) => {
              const occupancyPct = Math.round(
                (place.currentCount / place.baseCapacity) * 100
              );
              const { label, badgeClass, barClass } = getStatusBadge(place.status);

              return (
                <div
                  key={place.id}
                  onClick={() => handlePlaceClick(place.id)}
                  className="group relative rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0A1322] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-teal-500/15 hover:border-teal-400/60 dark:hover:border-teal-400/60 transition-all duration-300 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
                >
                  <div>
                    {/* Place Image with Dark Gradient & Responsive Aspect */}
                    <div className="relative h-44 xs:h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      {/* Top Badges (Category & Status) with Safe Spacing */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/20 truncate max-w-[130px]">
                          {place.categoryLabel}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase backdrop-blur-md border shadow-sm shrink-0 ${badgeClass}`}
                        >
                          {label}
                        </span>
                      </div>

                      {/* Place Name and City */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                        <h3 className="text-sm sm:text-base font-black leading-tight drop-shadow-sm line-clamp-1">
                          {place.shortName}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-teal-300 mt-0.5 font-medium">
                          <MapPin className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-teal-400 shrink-0" />
                          <span className="truncate">{place.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body Metrics */}
                    <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase text-slate-400">
                            Current Crowd
                          </div>
                          <div className="flex items-center gap-1.5 text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-slate-100">
                            <Users className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-teal-500 shrink-0" />
                            <span>{place.currentCount.toLocaleString()}</span>
                            <span className="text-xs font-normal text-slate-400">
                              devotees
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase text-slate-400">
                            Capacity
                          </div>
                          <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-slate-100">
                            {occupancyPct}%
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="h-2 sm:h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-700 shadow-sm ${barClass}`}
                            style={{ width: `${Math.min(100, occupancyPct)}%` }}
                          />
                        </div>
                      </div>

                      {/* Recommended visit time pill */}
                      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-teal-900 dark:text-teal-300 bg-teal-50/70 dark:bg-slate-950 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-teal-100 dark:border-teal-900/60">
                        <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate font-medium">
                          {place.recommendedVisitTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Button (Min 44px Touch Target) */}
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                    <button
                      type="button"
                      className="w-full py-2.5 sm:py-2.5 min-h-[44px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-500/25 group-hover:scale-[1.01] group-hover:shadow-lg group-hover:shadow-teal-500/40 active:scale-95"
                    >
                      <span>View Live Intelligence</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform shrink-0" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
