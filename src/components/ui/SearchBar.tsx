'use client';

import { SearchAutocomplete } from './SearchAutocomplete';
import { LocaleToggle } from './LocaleToggle';
import { MapPin, Crosshair } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import type { AppLocation } from '@/lib/types';

interface SearchBarProps {
  onSelect: (location: AppLocation) => void;
  onUseCurrentLocation: () => void;
  onOpenMap: () => void;
  isLoading?: boolean;
}

export function SearchBar({ onSelect, onUseCurrentLocation, onOpenMap, isLoading }: SearchBarProps) {
  const { t } = useLocale();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchAutocomplete onSelect={onSelect} placeholder={t.search.placeholder} />
        </div>
        <button
          onClick={onOpenMap}
          className="btn-icon"
          title={t.actions.openMap}
        >
          <MapPin className="w-5 h-5" />
        </button>
        <button
          onClick={onUseCurrentLocation}
          disabled={isLoading}
          className="btn-icon"
          title={t.actions.useCurrentLocation}
        >
          <Crosshair className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        <LocaleToggle />
      </div>
    </div>
  );
}
