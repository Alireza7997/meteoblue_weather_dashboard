'use client';

import type { DailyForecastItem } from '@/lib/utils';
import { useWeatherStore } from '@/lib/store';
import { useLocale } from '@/hooks/useLocale';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  timezoneOffset: number;
}

export function DailyForecast({ daily, timezoneOffset }: DailyForecastProps) {
  const { selectedDate, setSelectedDate } = useWeatherStore();
  const { t } = useLocale();

  return (
    <div className="panel">
      <h3 className="section-title mb-4">{t.daily.title}</h3>

      <div className="space-y-2">
        {daily.slice(0, 7).map((day, index) => (
          <DailyCard
            key={day.timestamp}
            day={day}
            index={index}
            isSelected={day.date === selectedDate}
            onClick={() => setSelectedDate(day.date)}
          />
        ))}
      </div>
    </div>
  );
}

interface DailyCardProps {
  day: DailyForecastItem;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

function DailyCard({ day, index, isSelected, onClick }: DailyCardProps) {
  const { t, formatNumber, locale } = useLocale();
  const uvLabel = day.uvi < 3 ? t.uv.low : day.uvi < 6 ? t.uv.moderate : t.uv.high;
  const separator = locale === 'fa' ? '،' : ',';

  return (
    <button
      onClick={onClick}
      className={`w-full flex flex-wrap items-center gap-x-3 gap-y-2 p-3 rounded-lg transition-all duration-200 text-start ${
        isSelected
          ? 'glass-strong ring-1 ring-cyan-400/30'
          : 'glass hover:bg-white/5'
      }`}
    >
      <div className="w-14 sm:w-20 shrink-0">
        <div className="font-medium text-white text-sm sm:text-base">{day.date.split(separator)[0]}</div>
        <div className="text-xs text-slate-300 truncate">{day.dateShort}</div>
      </div>

      <div className="text-2xl sm:text-3xl shrink-0">{day.icon}</div>

      <div className="flex-1 min-w-0 basis-32 sm:basis-0">
        <div className="text-xs sm:text-sm text-slate-300 truncate">{day.condition}</div>
        <div className="flex flex-wrap items-center gap-x-3 sm:gap-4 gap-y-0.5 text-xs text-slate-300 mt-1">
          <span>💧 {formatNumber(day.humidity)}%</span>
          <span className="hidden sm:inline">💨 {formatNumber(day.windSpeed)} {t.units.kmh} {day.windDir}</span>
          <span className="sm:hidden">💨 {formatNumber(day.windSpeed)} {t.units.kmh}</span>
          <span className={day.uvi < 3 ? 'text-green-400' : day.uvi < 6 ? 'text-amber-400' : 'text-red-400'}>🔆 UV {uvLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 text-end ms-auto shrink-0">
        <div className="text-base sm:text-lg font-bold text-white whitespace-nowrap">
          {formatNumber(day.tempMax)}° / {formatNumber(day.tempMin)}°
        </div>
        <div className="text-xs sm:text-sm text-slate-300 w-12 sm:w-16 text-end whitespace-nowrap">
          {formatNumber(day.pop)}% 🌧
        </div>
      </div>
    </button>
  );
}
