'use client';

import { useState, useCallback, useEffect } from 'react';

import type { AppLocation } from '@/lib/types';
import { fetchReverseGeocoding } from '@/lib/api';
import type { Locale } from '@/lib/i18n';

interface UseGeocodingReturn {
  search: (query: string, locale?: Locale) => Promise<AppLocation[]>;
  isLoading: boolean;
  error: string | null;
}

export function useGeocoding(): UseGeocodingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, locale: Locale = 'en'): Promise<AppLocation[]> => {
    if (query.length < 2) return [];

    setIsLoading(true);
    setError(null);

    try {
      const language = locale === 'fa' ? 'fa' : 'en';
      const response = await fetch(
        `/api/geocoding?q=${encodeURIComponent(query)}&lang=${language}`
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const results = await response.json();

      return results.map((result: any) => ({
        latitude: result.lat,
        longitude: result.lon,
        name: result.name,
        country: result.country,
        state: result.state,
        localNames: result.local_names,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { search, isLoading, error };
}

interface GeolocationResult {
  location: AppLocation | null;
  error?: string;
}

function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function isGeolocationPositionError(err: unknown): err is GeolocationPositionError {
  return typeof err === 'object' && err !== null && 'code' in err && typeof (err as GeolocationPositionError).code === 'number';
}

// GeolocationPositionError.code spec values: PERMISSION_DENIED=1, POSITION_UNAVAILABLE=2, TIMEOUT=3
function isPermissionDenied(err: unknown): boolean {
  return isGeolocationPositionError(err) && err.code === 1;
}

function isTimeoutError(err: unknown): boolean {
  return isGeolocationPositionError(err) && err.code === 3;
}

async function resolvePosition(): Promise<GeolocationPosition> {
  try {
    return await getPosition({
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 30000,
    });
  } catch (err) {
    if (isPermissionDenied(err)) {
      throw err;
    }
    return getPosition({
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    });
  }
}

export function useGeocodingPosition() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<GeolocationResult> => {
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      const message = 'Location access requires a secure connection (HTTPS or localhost)';
      setError(message);
      return { location: null, error: message };
    }

    if (!navigator.geolocation) {
      const message = 'Geolocation is not supported by your browser';
      setError(message);
      return { location: null, error: message };
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await resolvePosition();
      const { latitude, longitude } = position.coords;

      try {
        const result = await fetchReverseGeocoding(latitude, longitude);

        if (!result) {
          throw new Error('Failed to determine your location');
        }

        return {
          location: {
            latitude: result.lat,
            longitude: result.lon,
            name: result.name,
            country: result.country,
            state: result.state,
            localNames: result.local_names,
          },
        };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to reverse geocode location';

        setError(message);
        return { location: null, error: message };
      }
    } catch (err) {
      let message = 'Failed to get location';

      if (isPermissionDenied(err)) {
        message = 'Location permission denied';
      } else if (isTimeoutError(err)) {
        message = 'Location request timed out';
      }

      setError(message);
      return { location: null, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getCurrentLocation, isLoading, error };
}

export const useGeolocation = useGeocodingPosition;

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}