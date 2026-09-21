'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { SearchAutocomplete } from './SearchAutocomplete';
import { LocaleToggle } from './LocaleToggle';
import { MapPin, Crosshair } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import type { AppLocation } from '@/lib/types';

const NARROW_QUERY = '(max-width: 639px)';

// Tracks small screens; re-reads on every render, so it self-corrects
// after hydration, resizes, and orientation changes.
function useNarrowScreen(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia(NARROW_QUERY);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const getSnapshot = useCallback(() => window.matchMedia(NARROW_QUERY).matches, []);
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface SearchBarProps {
  onSelect: (location: AppLocation) => void;
  onUseCurrentLocation: () => void;
  onOpenMap: () => void;
  isLoading?: boolean;
}

export function SearchBar({ onSelect, onUseCurrentLocation, onOpenMap, isLoading }: SearchBarProps) {
  const { t } = useLocale();
  const isNarrowScreen = useNarrowScreen();

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Glass toolbar: keeps the sun/moon glow behind the controls
          so it never washes out the search field or buttons. */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-2xl border border-white/10 bg-(--background)/40 p-2 backdrop-blur-md sm:p-2.5">
        <div className="max-sm:flex sm:flex-1 max-sm:w-full">
          <SearchAutocomplete
            onSelect={onSelect}
            placeholder={isNarrowScreen ? t.search.placeholderShort : t.search.placeholder}
            className='max-sm:w-full'
          />
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
