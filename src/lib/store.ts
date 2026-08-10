import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppLocation, WeatherMapLayer, WeatherState } from './types';
import { DEFAULT_LOCATION } from './constants';

interface WeatherStore extends WeatherState {
  setSelectedLocation: (location: AppLocation | null) => void;
  setSelectedDate: (date: string) => void;
  setSelectedHour: (hour: number) => void;
  setMapLayer: (layer: WeatherMapLayer) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  mapModalOpen: boolean;
  setMapModalOpen: (open: boolean) => void;
  reset: () => void;
}

const initialState: WeatherState = {
  selectedLocation: DEFAULT_LOCATION,
  selectedDate: new Date().toISOString().split('T')[0],
  selectedHour: new Date().getHours(),
  mapLayer: 'temperature',
  isLoading: false,
  error: null,
};

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      ...initialState,
      mapModalOpen: false,
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedHour: (hour) => set({ selectedHour: hour }),
      setMapLayer: (layer) => set({ mapLayer: layer }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setMapModalOpen: (open) => set({ mapModalOpen: open }),
      reset: () => set(initialState),
    }),
    {
      name: 'weather-dashboard-store',
      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
        mapLayer: state.mapLayer,
      }),
    }
  )
);
