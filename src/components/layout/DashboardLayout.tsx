'use client';

import { LocationSelectionMap } from '@/components/maps/LocationSelectionMap';
import { WeatherVisualizationMap } from '@/components/maps/WeatherVisualizationMap';
import { CurrentWeatherPanel } from '@/components/weather/CurrentWeatherPanel';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { DailyForecast } from '@/components/weather/DailyForecast';
import { WeatherCharts } from '@/components/weather/WeatherCharts';
import { WeatherAlerts } from '@/components/weather/WeatherAlerts';
import { ForecastTimeline } from '@/components/weather/ForecastTimeline';
import { LocationHeader } from '@/components/layout/Header';
import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeatherStore } from '@/lib/store';
import type { AppLocation } from '@/lib/types';
import type { HourlyForecastItem, DailyForecastItem } from '@/lib/utils';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

export function DashboardLayout() {
  const { selectedLocation, setSelectedLocation, setError } = useWeatherStore();
  const { getCurrentLocation, isLoading: isGeoLoading } = useGeolocation();

  const {
    weatherData,
    currentWeather,
    hourlyForecast,
    dailyForecast,
    insights,
    isLoading,
    error,
    refetch,
  } = useWeather(selectedLocation);

  const handleSearchSelect = (location: AppLocation) => {
    setSelectedLocation(location);
  };

  const handleUseCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setSelectedLocation(location);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <LocationHeader
        location={selectedLocation}
        onSearchSelect={handleSearchSelect}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLoading={isGeoLoading}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          {error && (
            <div className="glass-strong border border-red-500/30 rounded-xl p-4 flex items-center gap-3 animate-slide-up">
              <AlertTriangle className="text-red-400 w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-red-300 flex-1">{error}</p>
              <button onClick={handleRetry} className="btn-secondary text-sm px-3 py-1">
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </button>
            </div>
          )}

          <section aria-labelledby="location-selection-title" className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 id="location-selection-title" className="section-title">Select Location</h2>
              {selectedLocation && (
                <div className="glass rounded-lg px-3 py-1.5 text-sm">
                  <span className="text-slate-400">Selected:</span>{' '}
                  <span className="text-white font-medium">
                    {selectedLocation.name}{selectedLocation.country && `, ${selectedLocation.country}`}
                  </span>
                </div>
              )}
            </div>
            <div className="aspect-video md:aspect-[16/9] rounded-xl overflow-hidden glass">
              <LocationSelectionMap
                selectedLocation={selectedLocation}
                onLocationSelect={handleSearchSelect}
              />
            </div>
          </section>

          {selectedLocation && currentWeather && (
            <>
              <section aria-labelledby="current-weather-title" className="animate-slide-up">
                <CurrentWeatherPanel current={currentWeather} isLoading={isLoading} />
              </section>

              <section aria-labelledby="hourly-forecast-title" className="animate-slide-up">
                <HourlyForecast hourly={hourlyForecast} timezoneOffset={weatherData?.timezone_offset || 0} />
              </section>

              <section aria-labelledby="daily-forecast-title" className="animate-slide-up">
                <DailyForecast daily={dailyForecast} timezoneOffset={weatherData?.timezone_offset || 0} />
              </section>

              <section aria-labelledby="weather-map-title" className="animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="weather-map-title" className="section-title">Weather Map</h2>
                  <div className="text-sm text-slate-400">
                    Layer: <span className="text-white font-medium capitalize">{useWeatherStore.getState().mapLayer}</span>
                  </div>
                </div>
                <div className="aspect-video md:aspect-[16/9] rounded-xl overflow-hidden glass">
                  <WeatherVisualizationMap
                    selectedLocation={selectedLocation}
                    weatherData={hourlyForecast}
                  />
                </div>
              </section>

              <section aria-labelledby="alerts-title" className="animate-slide-up">
                <WeatherAlerts insights={insights} />
              </section>

              <section aria-labelledby="analytics-title" className="animate-slide-up">
                <WeatherCharts
                  hourly={hourlyForecast}
                  daily={dailyForecast}
                  timezoneOffset={weatherData?.timezone_offset || 0}
                />
              </section>

              <section aria-labelledby="timeline-title" className="animate-slide-up">
                <ForecastTimeline
                  daily={dailyForecast}
                  hourly={hourlyForecast.map(h => ({ time: h.time, timestamp: h.timestamp }))}
                  timezoneOffset={weatherData?.timezone_offset || 0}
                />
              </section>
            </>
          )}

          {!selectedLocation && (
            <div className="glass rounded-xl p-12 text-center animate-fade-in">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Select a Location</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Click on the map above, search for a city, or use your current location to begin exploring weather analytics.
              </p>
            </div>
          )}

          {selectedLocation && isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm z-50">
              <div className="glass-strong rounded-xl p-8 text-center shadow-2xl">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-4" />
                <p className="text-white">Loading weather data...</p>
                <p className="text-sm text-slate-400 mt-2">{selectedLocation.name}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}