'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Location, WeatherData } from '@/lib/types';
import { fetchWeatherData, fetchReverseGeocoding } from '@/lib/api';
import { processHourlyForecast, processDailyForecast, getCurrentWeatherInfo, generateWeatherInsights } from '@/lib/utils';
import { useWeatherStore } from '@/lib/store';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  currentWeather: ReturnType<typeof getCurrentWeatherInfo> | null;
  hourlyForecast: ReturnType<typeof processHourlyForecast>;
  dailyForecast: ReturnType<typeof processDailyForecast>;
  insights: ReturnType<typeof generateWeatherInsights>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWeather(location: Location | null): UseWeatherReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentWeather, setCurrentWeather] = useState<ReturnType<typeof getCurrentWeatherInfo> | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<ReturnType<typeof processHourlyForecast>>([]);
  const [dailyForecast, setDailyForecast] = useState<ReturnType<typeof processDailyForecast>>([]);
  const [insights, setInsights] = useState<ReturnType<typeof generateWeatherInsights>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { selectedDate, selectedHour, setLoading, setError: setStoreError } = useWeatherStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!location) {
      setWeatherData(null);
      setCurrentWeather(null);
      setHourlyForecast([]);
      setDailyForecast([]);
      setInsights([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setLoading(true);
    setError(null);
    setStoreError(null);

    try {
      const data = await fetchWeatherData(location.latitude, location.longitude);

      if (!data) {
        throw new Error('Failed to fetch weather data');
      }

      setWeatherData(data);
      setCurrentWeather(getCurrentWeatherInfo(data.current, data.timezone_offset));
      setHourlyForecast(processHourlyForecast(data.hourly, data.timezone_offset));
      setDailyForecast(processDailyForecast(data.daily, data.timezone_offset));
      setInsights(generateWeatherInsights(data.current, data.hourly, data.daily, data.timezone_offset));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(message);
      setStoreError(message);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [location, setLoading, setStoreError]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  useEffect(() => {
    if (weatherData) {
      setCurrentWeather(getCurrentWeatherInfo(weatherData.current, weatherData.timezone_offset));
      setHourlyForecast(processHourlyForecast(weatherData.hourly, weatherData.timezone_offset));
      setDailyForecast(processDailyForecast(weatherData.daily, weatherData.timezone_offset));
      setInsights(generateWeatherInsights(weatherData.current, weatherData.hourly, weatherData.daily, weatherData.timezone_offset));
    }
  }, [weatherData, selectedDate, selectedHour]);

  return {
    weatherData,
    currentWeather,
    hourlyForecast,
    dailyForecast,
    insights,
    isLoading,
    error,
    refetch: fetchData,
  };
}

export function useReverseGeocoding() {
  const [isLoading, setIsLoading] = useState(false);

  const reverseGeocode = useCallback(async (lat: number, lon: number): Promise<Location | null> => {
    setIsLoading(true);
    try {
      const result = await fetchReverseGeocoding(lat, lon);
      if (result) {
        return {
          latitude: result.lat,
          longitude: result.lon,
          name: result.name,
          country: result.country,
          state: result.state,
          localNames: result.local_names,
        };
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { reverseGeocode, isLoading };
}