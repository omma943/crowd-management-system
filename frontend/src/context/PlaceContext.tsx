import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Place, PlaceCategory } from '../types/place';
import { PLACES_DATA } from '../data/placesData';

interface PlaceContextType {
  places: Place[];
  selectedPlaceId: string;
  selectedPlace: Place;
  selectPlace: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: PlaceCategory | 'All';
  setCategoryFilter: (cat: PlaceCategory | 'All') => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  updatePlaceFlow: (placeId: string, direction: 'entry' | 'exit', count: number) => void;
}

const PlaceContext = createContext<PlaceContextType | undefined>(undefined);

export const PlaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places, setPlaces] = useState<Place[]>(() => {
    try {
      const saved = localStorage.getItem('crowdsafe_places_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return PLACES_DATA;
  });

  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('crowdsafe_selected_place_id');
      if (saved && PLACES_DATA.some((p) => p.id === saved)) return saved;
    } catch {
      // fallback
    }
    return 'dagdusheth';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<PlaceCategory | 'All'>('All');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('crowdsafe_selected_place_id', selectedPlaceId);
    } catch {
      // ignore
    }
  }, [selectedPlaceId]);

  useEffect(() => {
    try {
      localStorage.setItem('crowdsafe_places_v1', JSON.stringify(places));
    } catch {
      // ignore
    }
  }, [places]);

  const selectPlace = (id: string) => {
    setSelectedPlaceId(id);
    setIsLocationModalOpen(false);
  };

  const selectedPlace =
    places.find((p) => p.id === selectedPlaceId) || places[0] || PLACES_DATA[0];

  const updatePlaceFlow = (placeId: string, direction: 'entry' | 'exit', count: number) => {
    setPlaces((prevPlaces) =>
      prevPlaces.map((place) => {
        if (place.id !== placeId) return place;

        const delta = direction === 'entry' ? count : -count;
        const newCount = Math.max(0, place.currentCount + delta);
        const newEntered = direction === 'entry' ? place.enteredToday + count : place.enteredToday;
        const newExited = direction === 'exit' ? place.exitedToday + count : place.exitedToday;
        const newPeak = Math.max(place.peakCrowd, newCount);

        const occupancyPct = Math.round((newCount / place.baseCapacity) * 100);
        let newStatus: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
        if (occupancyPct >= 90) newStatus = 'CRITICAL';
        else if (occupancyPct >= 70) newStatus = 'HIGH';
        else if (occupancyPct >= 50) newStatus = 'MODERATE';

        // Update zones proportionately
        const updatedZones = place.zones.map((zone, idx) => {
          const zoneDelta = Math.round(delta * (idx === 1 || idx === 2 ? 0.4 : 0.1));
          const zCount = Math.max(0, zone.currentCount + zoneDelta);
          const zPct = Math.min(100, Math.round((zCount / zone.maxCapacity) * 100));
          let zStatus: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
          if (zPct >= 90) zStatus = 'CRITICAL';
          else if (zPct >= 70) zStatus = 'HIGH';
          else if (zPct >= 50) zStatus = 'MODERATE';
          return {
            ...zone,
            currentCount: zCount,
            occupancyPercentage: zPct,
            status: zStatus,
          };
        });

        // Update forecast
        const updatedForecast = [
          { time: 'Now', occupancyPercentage: occupancyPct, status: newStatus, note: 'Current Active Level' },
          { time: '+15 min', occupancyPercentage: Math.min(100, occupancyPct + (direction === 'entry' ? 3 : -2)), status: newStatus, note: 'Predicted Trend' },
          { time: '+30 min', occupancyPercentage: Math.min(100, occupancyPct + (direction === 'entry' ? 6 : -4)), status: newStatus, note: 'Predicted Trend' },
          { time: '+60 min', occupancyPercentage: Math.min(100, occupancyPct + (direction === 'entry' ? 9 : -6)), status: newStatus, note: 'Predicted Trend' },
        ];

        return {
          ...place,
          currentCount: newCount,
          enteredToday: newEntered,
          exitedToday: newExited,
          peakCrowd: newPeak,
          status: newStatus,
          zones: updatedZones,
          forecast: updatedForecast,
        };
      })
    );
  };

  return (
    <PlaceContext.Provider
      value={{
        places,
        selectedPlaceId,
        selectedPlace,
        selectPlace,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        isLocationModalOpen,
        setIsLocationModalOpen,
        updatePlaceFlow,
      }}
    >
      {children}
    </PlaceContext.Provider>
  );
};

export const usePlace = (): PlaceContextType => {
  const context = useContext(PlaceContext);
  if (!context) {
    throw new Error('usePlace must be used within a PlaceProvider');
  }
  return context;
};
