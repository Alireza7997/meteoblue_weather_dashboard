'use client';

import { useWeatherStore } from '@/lib/store';
import type { DailyForecastItem } from '@/lib/utils';
import type { WeatherMapLayer } from '@/lib/types';

interface ForecastTimelineProps {
  daily: DailyForecastItem[];
  hourly: { time: string; timestamp: number }[];
  timezoneOffset: number;
}

export function ForecastTimeline({ daily, hourly, timezoneOffset }: ForecastTimelineProps) {
  const { selectedDate, selectedHour, setSelectedDate, setSelectedHour, mapLayer, setMapLayer } = useWeatherStore();

  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">Forecast Timeline</h3>
        <div className="flex items-center gap-4">
          <LayerSelector value={mapLayer} onChange={setMapLayer} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-slate-400 w-10 text-right">NOW</span>
            <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                style={{ width: `${(currentHour / 24) * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-cyan-400"
                style={{ left: `${(currentHour / 24) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 w-16 text-left">+24h</span>
          </div>

          <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-2">
            {hourly.slice(0, 24).map((h, index) => (
              <button
                key={h.timestamp}
                onClick={() => setSelectedHour(index)}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[50px] ${
                  index === selectedHour
                    ? 'glass-strong ring-2 ring-cyan-400/50'
                    : index === currentHour
                    ? 'glass ring-1 ring-emerald-400/50'
                    : 'glass hover:bg-white/5'
                }`}
              >
                <span className={`text-xs font-medium ${index === currentHour ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {h.time}:00
                </span>
                <span className="text-lg">{index === selectedHour ? '●' : '○'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-slate-400 w-10">DAYS</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
            {daily.slice(0, 7).map((day) => (
              <button
                key={day.timestamp}
                onClick={() => setSelectedDate(day.date)}
                className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 min-w-[70px] ${
                  day.date === selectedDate
                    ? 'glass-strong ring-2 ring-cyan-400/50'
                    : day.index === 0
                    ? 'glass ring-1 ring-emerald-400/50'
                    : 'glass hover:bg-white/5'
                }`}
              >
                <span className="text-xs font-medium text-slate-300">{day.dateShort}</span>
                <span className="text-2xl">{day.icon}</span>
                <span className="text-sm font-bold text-white">{day.tempMax}°/{day.tempMin}°</span>
                <span className="text-xs text-slate-400">{day.pop}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>
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