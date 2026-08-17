'use client';

import { useMemo } from 'react';
import { WeatherVisualizationMap } from '@/components/maps/WeatherVisualizationMap';
import { CurrentWeatherPanel } from '@/components/weather/CurrentWeatherPanel';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { DailyForecast } from '@/components/weather/DailyForecast';
import { WeatherCharts } from '@/components/weather/WeatherCharts';
import { WeatherAlerts } from '@/components/weather/WeatherAlerts';
import { ForecastTimeline } from '@/components/weather/ForecastTimeline';
import { WeatherBackground } from '@/components/effects/WeatherBackground';
import { SearchBar } from '@/components/ui/SearchBar';
import { MapModal } from '@/components/ui/MapModal';
import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSectionInView } from '@/hooks/useSectionInView';
import { useWeatherStore } from '@/lib/store';
import type { AppLocation, WeatherMapLayer } from '@/lib/types';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import Portal from '../Portal';

function AnimatedSection({
  children,
  animation = 'animate-section-left',
  delay = 0,
}: {
  children: React.ReactNode;
  animation?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useSectionInView();

  return (
    <div
      ref={ref}
      className={isVisible ? animation : 'opacity-0'}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function formatLocationName(location: AppLocation | null): string { if (!location) return ''; const parts = [location.name !== 'Loading...' && location.name !== 'Selected Location' ? location.name : 'Current Location', location.state, location.country,].filter(Boolean); return parts.join(', ').replace('Iran (Islamic Republic of)', 'Iran'); }

export function DashboardLayout() {
  const { selectedLocation, setSelectedLocation, mapModalOpen, setMapModalOpen, mapLayer, setMapLayer } = useWeatherStore();
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

  const locationName = formatLocationName(selectedLocation);
  
  return (
    <div className="min-h-screen bg-(--background) flex flex-col relative">
      <WeatherBackground condition={currentWeather?.condition} hour={new Date().getHours()} />

      <div className="relative z-10 flex flex-col items-center pt-8 pb-4 px-4">
        <SearchBar
          onSelect={handleSearchSelect}
          onUseCurrentLocation={handleUseCurrentLocation}
          onOpenMap={() => setMapModalOpen(true)}
          isLoading={isGeoLoading}
        />
      </div>

      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pb-8">
        {/* Gradient overlay to reduce brightness of lower sections */}
        <div className="fixed bottom-0 left-0 right-0 h-64 bg-linear-to-t from-(--background) via-(--background)/80 to-transparent pointer-events-none z-20" />

        <div className="max-w-7xl mx-auto space-y-8">
          {error && (
            <div className="glass-strong border border-rose-glow/30 rounded-xl p-4 flex items-center gap-3 animate-slide-up">
              <AlertTriangle className="text-rose-glow w-5 h-5 shrink-0" />
              <p className="text-sm text-rose-300 flex-1">{error}</p>
              <button onClick={handleRetry} className="btn-secondary text-sm px-3 py-1 rounded-lg flex flex-nowrap items-center gap-1">
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </button>
            </div>
          )}

          {selectedLocation && currentWeather && (
            <>
              <AnimatedSection animation="animate-section-blur" delay={100}>
                <CurrentWeatherPanel
                  locationName={locationName}
                  current={currentWeather}
                  isLoading={isLoading}
                />
              </AnimatedSection>

              <AnimatedSection animation="animate-section-right" delay={150}>
                <HourlyForecast hourly={hourlyForecast} timezoneOffset={weatherData?.timezone_offset || 0} />
              </AnimatedSection>

              <AnimatedSection animation="animate-section-left" delay={200}>
                <DailyForecast daily={dailyForecast} timezoneOffset={weatherData?.timezone_offset || 0} />
              </AnimatedSection>

              <AnimatedSection animation="animate-section-scale" delay={250}>
                <WeatherAlerts insights={insights} />
              </AnimatedSection>

              <AnimatedSection animation="animate-section-blur" delay={300}>
                <WeatherCharts
                  hourly={hourlyForecast}
                  daily={dailyForecast}
                  timezoneOffset={weatherData?.timezone_offset || 0}
                />
              </AnimatedSection>

              <AnimatedSection animation="animate-section-right" delay={350}>
                <ForecastTimeline
                  daily={dailyForecast}
                  hourly={hourlyForecast.map(h => ({ time: h.time, timestamp: h.timestamp }))}
                  timezoneOffset={weatherData?.timezone_offset || 0}
                />
              </AnimatedSection>

              <AnimatedSection animation="animate-section-left" delay={400}>
                <section aria-labelledby="weather-map-title" className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h2 id="weather-map-title" className="section-title">Weather Map</h2>
                    <LayerSelector value={mapLayer} onChange={setMapLayer} />
                  </div>
                  <div className="aspect-video md:aspect-21/9 rounded-2xl overflow-hidden glass-vibrant relative">
                    <WeatherVisualizationMap
                      selectedLocation={selectedLocation}
                      weatherData={hourlyForecast}
                      className=""
                    />
                    {/* Gradient overlay to reduce interactivity feel */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </section>
              </AnimatedSection>
            </>
          )}

          {!selectedLocation && !isLoading && (
            <div className="glass-vibrant rounded-2xl p-12 text-center animate-fade-in mt-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Select a Location</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Search for a city, click the map button, or use your current location to begin exploring weather analytics.
              </p>
            </div>
          )}

          {selectedLocation && isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-(--background)/80 backdrop-blur-sm z-50">
              <div className="glass-vibrant rounded-2xl p-8 text-center shadow-2xl animate-bounce-in">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                <p className="text-white">Loading weather data...</p>
                <p className="text-sm text-muted-foreground mt-2">{selectedLocation.name}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {mapModalOpen && (
        <Portal>
          <MapModal
            selectedLocation={selectedLocation}
            onLocationSelect={handleSearchSelect}
            onClose={() => setMapModalOpen(false)}
          />
        </Portal>
      )}
    </div>
  );
}

interface LayerSelectorProps {
  value: WeatherMapLayer;
  onChange: (value: WeatherMapLayer) => void;
}

const LAYER_OPTIONS = [
  { value: 'temperature', label: '🌡 Temperature' },
  { value: 'precipitation', label: '🌧 Precipitation' },
  { value: 'wind', label: '💨 Wind' },
  { value: 'humidity', label: '💧 Humidity' },
  { value: 'clouds', label: '☁ Clouds' },
  { value: 'uv', label: '🔆 UV Index' },
];

function LayerSelector({ value, onChange }: LayerSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as WeatherMapLayer)}
      className="input py-1.5 px-3 text-sm bg-slate-900/50"
      style={{ width: 'auto', minWidth: 160 }}
    >
      {LAYER_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}