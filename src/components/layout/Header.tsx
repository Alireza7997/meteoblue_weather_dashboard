'use client';

import { useGeolocation } from '@/hooks/useGeolocation';
import type { Location } from '@/lib/types';
import { Crosshair, Loader2 } from 'lucide-react';
import { SearchAutocomplete } from '@/components/ui/SearchAutocomplete';

interface LocationHeaderProps {
  location: Location | null;
  onSearchSelect: (location: Location) => void;
  onUseCurrentLocation: () => void;
  isLoading?: boolean;
}

export function LocationHeader({
  location,
  onSearchSelect,
  onUseCurrentLocation,
  isLoading,
}: LocationHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 glass border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-lg">🌡</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Advanced Weather Analytics</h1>
            <p className="text-xs text-slate-400">Professional meteorological dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block w-96">
          <SearchAutocomplete onSelect={onSearchSelect} placeholder="Search city, landmark, or address..." />
        </div>

        <button
          onClick={onUseCurrentLocation}
          disabled={isLoading}
          className="btn-secondary px-4 py-2 gap-2"
          aria-label="Use current location"
        >
          <Crosshair className="w-4 h-4" />
          <span className="hidden sm:inline">My Location</span>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        </button>
      </div>
    </header>
  );
}