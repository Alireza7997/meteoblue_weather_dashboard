'use client';

import { useWeatherStore } from '@/lib/store';
import { useLocale } from '@/hooks/useLocale';
import type { DailyForecastItem } from '@/lib/utils';
import type { WeatherMapLayer } from '@/lib/types';

interface ForecastTimelineProps {
  daily: DailyForecastItem[];
  hourly: { time: string; timestamp: number }[];
  timezoneOffset: number;
}

export function ForecastTimeline({ hourly }: ForecastTimelineProps) {
  const { selectedHour, setSelectedHour } = useWeatherStore();
  const { t, formatNumber } = useLocale();

  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">{t.timeline.title}</h3>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-slate-300 w-10 text-end">{t.timeline.now}</span>
            <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden" dir="ltr">
              <div
                className="absolute top-0 left-0 h-full bg-linear-to-r from-cyan-400 to-blue-400 rounded-full"
                style={{ width: `${(currentHour / 24) * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-cyan-400"
                style={{ left: `${(currentHour / 24) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-300 w-16 text-start" dir="ltr">+24h</span>
          </div>

          <div className="flex gap-1 overflow-x-auto scrollbar-thin p-2" dir="ltr">
            {hourly.slice(0, 24).map((h, index) => (
              <button
                key={h.timestamp}
                onClick={() => setSelectedHour(index)}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-12.5 ${
                  index === selectedHour
                    ? 'glass-strong ring-2 ring-cyan-400/50'
                    : index === currentHour
                    ? 'glass ring-1 ring-emerald-400/50'
                    : 'glass hover:bg-white/5'
                }`}
              >
                <span className={`text-xs font-medium ${index === currentHour ? 'text-emerald-400' : 'text-slate-300'}`} dir="ltr">
                  {formatNumber(parseInt(h.time, 10))}:{formatNumber(0, { minimumIntegerDigits: 2, useGrouping: false })}
                </span>
                <span className="text-lg">{index === selectedHour ? '●' : '○'}</span>
              </button>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}

