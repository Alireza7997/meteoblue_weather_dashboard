'use client';

import { useRef, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { DashboardScrollProvider } from '@/hooks/useDashboardScroll';
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
import { useLocale } from '@/hooks/useLocale';
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

function formatLocationName(location: AppLocation | null, currentLocationLabel: string): string {
  if (!location) return '';
  const parts = [
    location.name !== 'Loading...' && location.name !== 'Selected Location' ? location.name : currentLocationLabel,
    location.state,
    location.country,
  ].filter(Boolean);
  return parts.join(', ').replace('Iran (Islamic Republic of)', 'Iran');
}

export function DashboardLayout() {
  const { selectedLocation, setSelectedLocation, mapModalOpen, setMapModalOpen, mapLayer, setMapLayer } = useWeatherStore();
  const { getCurrentLocation, isLoading: isGeoLoading } = useGeolocation();
  const { t } = useLocale();
  const [geoError, setGeoError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

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
    const { location, error: geoMsg } = await getCurrentLocation();
    setGeoError(geoMsg ?? null);
    if (location) {
      setSelectedLocation(location);
    }
  };

  const handleRetry = () => {
    setGeoError(null);
    refetch();
  };

  const locationName = formatLocationName(selectedLocation, t.dashboard.currentLocation);

  return (
    <DashboardScrollProvider
      value={{ progress: smoothScrollProgress, containerRef: scrollContainerRef }}
    >
    <div className="min-h-screen bg-(--background) flex flex-col relative">
      <WeatherBackground condition={currentWeather?.condition} hour={new Date().getHours()} />

      <div className="relative z-30 flex flex-col items-center pt-6 sm:pt-8 pb-4 px-3 sm:px-4">
        <SearchBar
          onSelect={handleSearchSelect}
          onUseCurrentLocation={handleUseCurrentLocation}
          onOpenMap={() => setMapModalOpen(true)}
          isLoading={isGeoLoading}
        />
      </div>

      <main ref={scrollContainerRef} className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 pb-8">
        <div className="fixed bottom-0 left-0 right-0 h-64 bg-linear-to-t from-(--background) via-(--background)/80 to-transparent pointer-events-none z-20" />

        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 mt-36 sm:mt-0">
          {(error || geoError) && (
            <div className="glass-strong border border-rose-glow/30 rounded-xl p-3 sm:p-4 flex flex-wrap sm:flex-nowrap items-center gap-3 animate-slide-up">
              <AlertTriangle className="text-rose-glow w-5 h-5 shrink-0" />
              <p className="text-sm text-rose-300 flex-1 basis-full sm:basis-auto">{error || geoError}</p>
              <button onClick={handleRetry} className="btn-secondary text-sm px-3 py-1 rounded-lg flex flex-nowrap items-center gap-1 shrink-0">
                <RefreshCw className="w-4 h-4 me-1" />
                {t.actions.retry}
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
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 id="weather-map-title" className="section-title mb-0">{t.map.title}</h2>
                    <LayerSelector value={mapLayer} onChange={setMapLayer} />
                  </div>
                  <div className="aspect-4/3 sm:aspect-video lg:aspect-21/9 rounded-2xl overflow-hidden glass-vibrant relative">
                    <WeatherVisualizationMap
                      selectedLocation={selectedLocation}
                      weatherData={hourlyForecast}
                      className=""
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </section>
              </AnimatedSection>
            </>
          )}

          {!selectedLocation && !isLoading && (
            <div className="glass-vibrant rounded-2xl p-6 sm:p-12 text-center animate-fade-in mt-4 sm:mt-12">
              <div className="text-4xl sm:text-6xl mb-4">🌍</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{t.dashboard.selectLocationTitle}</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                {t.dashboard.selectLocationDesc}
              </p>
            </div>
          )}

          {selectedLocation && isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-(--background)/80 backdrop-blur-sm z-50 px-4">
              <div className="glass-vibrant rounded-2xl p-6 sm:p-8 text-center shadow-2xl animate-bounce-in w-full max-w-sm">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                <p className="text-white">{t.dashboard.loadingWeather}</p>
                <p className="text-sm text-muted-foreground mt-2 truncate">{selectedLocation.name}</p>
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
    </DashboardScrollProvider>
  );
}

interface LayerSelectorProps {
  value: WeatherMapLayer;
  onChange: (value: WeatherMapLayer) => void;
}

const LAYER_OPTIONS: { value: WeatherMapLayer }[] = [
  { value: 'temperature' },
  { value: 'precipitation' },
  { value: 'wind' },
  { value: 'humidity' },
  { value: 'clouds' },
  { value: 'uv' },
];

function LayerSelector({ value, onChange }: LayerSelectorProps) {
  const { t } = useLocale();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as WeatherMapLayer)}
      className="input py-1.5 px-3 text-sm bg-slate-900/50 w-auto! max-w-full shrink min-w-32 sm:min-w-40"
    >
      {LAYER_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {t.layerOptions[option.value]}
        </option>
      ))}
    </select>
  );
}