'use client';

import type { HourlyForecastItem } from '@/lib/utils';
import { useWeatherStore } from '@/lib/store';
import { useLocale } from '@/hooks/useLocale';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  timezoneOffset: number;
}

/**
 * Read-only strip of the next 24 hours. The hour selection lives in the
 * Forecast Timeline below, so these cards are not interactive.
 */
export function HourlyForecast({ hourly }: HourlyForecastProps) {
  const { selectedHour } = useWeatherStore();
  const { t, formatNumber } = useLocale();
  const minuteZero = formatNumber(0, { minimumIntegerDigits: 2, useGrouping: false });
  const selected = hourly[selectedHour];

  return (
    <div className="panel">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3 className="section-title mb-0">{t.hourly.title}</h3>
        <div className="text-sm text-slate-300">{t.hourly.next24}</div>
      </div>

      <div className="scrollbar-thin overflow-x-auto pb-4">
        <div
          className="flex gap-3 min-w-max p-2"
          style={{ paddingLeft: 16, paddingRight: 16 }}
        >
          {hourly.map((hour) => (
            <HourlyCard key={hour.timestamp} hour={hour} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
        <div className="text-xs text-slate-300">
          {t.hourly.selected}: {selected ? `${selected.timeLabel}:${minuteZero}` : '—'}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>{t.hourly.now}</span>
          <div className="w-20 sm:w-32 h-1 bg-slate-700 rounded-full relative overflow-hidden">
            <div
              className="absolute top-0 start-0 h-full bg-cyan-400 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (selectedHour / 24) * 100)}%`,
              }}
            />
          </div>
          <span dir="ltr">+24h</span>
        </div>
      </div>
    </div>
  );
}

function HourlyCard({ hour }: { hour: HourlyForecastItem }) {
  const { t, formatNumber } = useLocale();
  const minuteZero = formatNumber(0, { minimumIntegerDigits: 2, useGrouping: false });

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-lg min-w-20 glass">
      <div className="text-xs font-medium text-slate-300" dir="ltr">
        {hour.timeLabel}:{minuteZero}
      </div>
      <div className="text-3xl">{hour.icon}</div>
      <div className="text-lg font-bold text-white">{formatNumber(hour.temp)}°</div>
      <div className="text-xs text-slate-300">{formatNumber(hour.pop)}% 🌧</div>
      <div className="text-xs text-slate-300">
        {formatNumber(hour.windSpeed)} {t.units.kmh}
      </div>
    </div>
  );
}
