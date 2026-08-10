'use client';

import type { CurrentWeather } from '@/lib/types';
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

export function CurrentWeatherPanel({ current, isLoading }: CurrentWeatherPanelProps) {
  if (isLoading || !current) {
    return (
      <div className="panel animate-pulse-slow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="h-24 w-24 mx-auto bg-white/5 rounded-full"></div>
            <div className="h-8 w-32 mx-auto bg-white/5 rounded"></div>
            <div className="h-4 w-24 mx-auto bg-white/5 rounded"></div>
          </div>
          <div className="space-y-3 md:col-span-2">
            <div className="h-4 w-3/4 bg-white/5 rounded"></div>
            <div className="h-4 w-1/2 bg-white/5 rounded"></div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="h-16 bg-white/5 rounded-lg"></div>
              <div className="h-16 bg-white/5 rounded-lg"></div>
              <div className="h-16 bg-white/5 rounded-lg"></div>
              <div className="h-16 bg-white/5 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="text-center md:col-span-1">
          <div className="text-6xl font-light text-white mb-2">{current.temp}</div>
          <div className="text-2xl text-slate-300 mb-1">{WEATHER_ICONS[current.icon as keyof typeof WEATHER_ICONS] || '🌤️'} {current.condition}</div>
          <div className="text-slate-400 text-sm">Feels like {current.feelsLike}</div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon="💧"
              label="Humidity"
              value={current.humidity}
              change={null}
            />
            <MetricCard
              icon="💨"
              label="Wind"
              value={`${current.wind} ${current.windDir}`}
              change={null}
            />
            <MetricCard
              icon="📊"
              label="Pressure"
              value={current.pressure}
              change={null}
            />
            <MetricCard
              icon="👁"
              label="Visibility"
              value={current.visibility}
              change={null}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-white/5">
            <MetricCard
              icon="🔆"
              label="UV Index"
              value={current.uv}
              change={parseFloat(current.uv) > 5 ? '+High' : null}
              changeType={parseFloat(current.uv) > 5 ? 'negative' : 'neutral'}
            />
            <MetricCard
              icon="🌅"
              label="Sunrise"
              value={current.sunrise}
              change={null}
            />
            <MetricCard
              icon="🌇"
              label="Sunset"
              value={current.sunset}
              change={null}
            />
            <MetricCard
              icon="🌡"
              label="Feels Like"
              value={current.feelsLike}
              change={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  change: string | null;
  changeType?: 'positive' | 'negative' | 'neutral';
}

function MetricCard({ icon, label, value, change, changeType = 'neutral' }: MetricCardProps) {
  return (
    <div className="glass rounded-lg p-4 transition-all hover:bg-white/10">
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
      {change && (
        <div
          className={`text-xs font-medium mt-1 ${
            changeType === 'positive' ? 'text-emerald-400' :
            changeType === 'negative' ? 'text-red-400' :
            'text-slate-400'
          }`}
        >
          {change}
        </div>
      )}
    </div>
  );
}