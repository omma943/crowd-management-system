import React from 'react';
import {
  Search,
  MapPin,
  Users,
  ArrowRight,
  ShieldCheck,
  Sparkles,
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
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Official CrowdSafe AI Artwork */}
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl group">
          <img
            src="/images/crowdsafe-banner.png"
            alt="CrowdSafe AI - Safer Crowds, Smarter Tomorrow"
            className="w-full h-auto max-h-[360px] object-cover sm:object-contain object-center transition-transform duration-700 group-hover:scale-[1.01]"
          />
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
        </div>

        {/* Search & Category Filter Section */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Explore Pilgrimage & Heritage Sites
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Real-time crowd density, safety alerts, and AI forecast across Maharashtra
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input
                type="text"
                placeholder="🔍 Search temples, historic forts, cities, or areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              { id: 'All', label: '🌟 All Places' },
              { id: 'Temple', label: '🛕 Temples & Pilgrimage' },
              { id: 'Heritage', label: '🏰 Forts & Heritage' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as PlaceCategory | 'All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live City Summary Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
              Monitored Places
            </div>
            <div className="text-xl font-black font-mono text-slate-900 dark:text-slate-100">
              {places.length} Locations
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
              Total Live Devotees
            </div>
            <div className="text-xl font-black font-mono text-slate-900 dark:text-slate-100">
              {totalPeopleTracked.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
              Low Density Places
            </div>
            <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {lowCrowdPlaces.length} Open & Clear
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
              AI Forecast Engine
            </div>
            <div className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">
              15-60m Active
            </div>
          </div>
        </div>
      </div>

      {/* Places Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              EXPLORE MONITORED PLACES
            </h2>
            <span className="text-xs font-mono font-bold text-slate-400">
              ({filteredPlaces.length} Results)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => {
            const occupancyPct = Math.round(
              (place.currentCount / place.baseCapacity) * 100
            );
            const { label, badgeClass, barClass } = getStatusBadge(place.status);

            return (
              <div
                key={place.id}
                onClick={() => handlePlaceClick(place.id)}
                className="group relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Place Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category & Status Badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                        {place.categoryLabel}
                      </span>
                    </div>

                    <div className="absolute top-3.5 right-3.5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase backdrop-blur-md border shadow-sm ${badgeClass}`}
                      >
                        {label}
                      </span>
                    </div>

                    {/* Place Name and City */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <h3 className="text-base font-black leading-tight drop-shadow-sm">
                        {place.shortName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-200 mt-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{place.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Metrics */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                          Current Crowd
                        </div>
                        <div className="flex items-center gap-1.5 text-xl font-black font-mono text-slate-900 dark:text-slate-100">
                          <Users className="h-4 w-4 text-cyan-500" />
                          <span>{place.currentCount.toLocaleString()}</span>
                          <span className="text-xs font-normal text-slate-400">
                            people
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                          Capacity
                        </div>
                        <div className="text-xl font-black font-mono text-slate-900 dark:text-slate-100">
                          {occupancyPct}%
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${barClass}`}
                          style={{ width: `${Math.min(100, occupancyPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Recommended visit time pill */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      <Clock className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate font-medium">
                        {place.recommendedVisitTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="px-5 pb-5 pt-0">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-white text-slate-900 dark:text-slate-100 font-bold text-xs transition-all flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-white shadow-sm"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
