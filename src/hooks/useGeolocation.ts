'use client';

import { useState, useCallback, useEffect } from 'react';

import type { AppLocation } from '@/lib/types';
import { fetchReverseGeocoding } from '@/lib/api';

interface UseGeocodingReturn {
  search: (query: string) => Promise<AppLocation[]>;
  isLoading: boolean;
  error: string | null;
}

export function useGeocoding(): UseGeocodingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string): Promise<AppLocation[]> => {
    if (query.length < 2) return [];

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/geocoding?q=${encodeURIComponent(query)}`
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

export function useGeocodingPosition() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    return new Promise<AppLocation | null>((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        resolve(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const result = await fetchReverseGeocoding(
              latitude,
              longitude
            );

            if (!result) {
              throw new Error('Failed to determine your location');
            }

            resolve({
              latitude: result.lat,
              longitude: result.lon,
              name: result.name,
              country: result.country,
              state: result.state,
              localNames: result.local_names,
            });
          } catch (err) {
            const message =
              err instanceof Error
                ? err.message
                : 'Failed to reverse geocode location';

            setError(message);
            resolve(null);
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          let message = 'Failed to get location';

          if (err.code === err.PERMISSION_DENIED) {
            message = 'Location permission denied';
          } else if (err.code === err.TIMEOUT) {
            message = 'Location request timed out';
          }

          setError(message);
          setIsLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
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