'use client';

import { WEATHER_ICONS } from '@/lib/constants';

interface CurrentWeatherPanelProps {
  current: {
    temp: string;
    feelsLike: string;
    condition: string;
    icon: string;
    humidity: string;
    wind: string;
    windDir: string;
    pressure: string;
    visibility: string;
    uv: string;
    sunrise: string;
    sunset: string;
  } | null;
  isLoading?: boolean;
}

interface WeatherBadgeProps {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}

function WeatherBadge({ icon, label, value, highlight }: WeatherBadgeProps) {
  return (
    <div className="weather-badge glass rounded-xl px-4 py-3 cursor-default">
      <div className="flex items-center gap-2.5">
        <span className="badge-icon text-lg">{icon}</span>
        <div>
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="text-base font-semibold text-white">{value}</div>
        </div>
      </div>
      {highlight && (
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-glow animate-pulse" />
      )}
    </div>
  );
}

export function CurrentWeatherPanel({ current, isLoading }: CurrentWeatherPanelProps) {
  if (isLoading || !current) {
    return (
      <div className="panel animate-pulse-slow">
        <div className="flex flex-col items-center space-y-6">
          <div className="h-24 w-24 rounded-full bg-white/5"></div>
          <div className="h-8 w-32 bg-white/5 rounded"></div>
          <div className="h-4 w-24 bg-white/5 rounded"></div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <div className="h-16 w-32 bg-white/5 rounded-xl"></div>
            <div className="h-16 w-32 bg-white/5 rounded-xl"></div>
            <div className="h-16 w-32 bg-white/5 rounded-xl"></div>
            <div className="h-16 w-32 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <div className="text-8xl font-thin text-white tracking-tighter mb-2">{current.temp}</div>
          <div className="text-2xl text-slate-300 mb-1">
            {WEATHER_ICONS[current.icon as keyof typeof WEATHER_ICONS] || '🌤️'} {current.condition}
          </div>
          <div className="text-sm text-muted-foreground">Feels like {current.feelsLike}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <WeatherBadge icon="💧" label="Humidity" value={current.humidity} />
          <WeatherBadge icon="💨" label="Wind" value={`${current.wind} ${current.windDir}`} />
          <WeatherBadge icon="📊" label="Pressure" value={current.pressure} />
          <WeatherBadge icon="👁" label="Visibility" value={current.visibility} />
          <WeatherBadge
            icon="🔆"
            label="UV Index"
            value={current.uv}
            highlight={parseFloat(current.uv) > 5}
          />
          <WeatherBadge icon="🌅" label="Sunrise" value={current.sunrise} />
          <WeatherBadge icon="🌇" label="Sunset" value={current.sunset} />
          <WeatherBadge icon="🌡" label="Feels Like" value={current.feelsLike} />
        </div>
      </div>
    </div>
  );
}
