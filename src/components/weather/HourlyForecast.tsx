'use client';

import { useState } from 'react';
import type { HourlyForecastItem } from '@/lib/utils';
import { useWeatherStore } from '@/lib/store';
import { useLocale } from '@/hooks/useLocale';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  timezoneOffset: number;
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
  const { selectedHour, setSelectedHour } = useWeatherStore();
  const { t, formatNumber } = useLocale();
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollToHour = (hour: number) => {
    const itemWidth = 80;
    const containerWidth = window.innerWidth - 48;
    const offset = hour * itemWidth - containerWidth / 2 + itemWidth / 2;
    setScrollPosition(Math.max(0, offset));
  };

  return (
    <div className="panel">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3 className="section-title mb-0">{t.hourly.title}</h3>
        <div className="text-sm text-slate-300">{t.hourly.next24}</div>
      </div>

      <div
        className="scrollbar-thin overflow-x-auto pb-4"
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
      >
        <div
          className="flex gap-3 min-w-max p-2"
          style={{ paddingLeft: 16, paddingRight: 16 }}
        >
          {hourly.map((hour, index) => (
            <HourlyCard
              key={hour.timestamp}
              hour={hour}
              index={index}
              isSelected={index === selectedHour}
              onClick={() => setSelectedHour(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
        <div className="text-xs text-slate-300">
          {t.hourly.selected}: {formatNumber(selectedHour)}:00
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

interface HourlyCardProps {
  hour: HourlyForecastItem;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

function HourlyCard({ hour, isSelected, onClick }: HourlyCardProps) {
  const { t, formatNumber } = useLocale();

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 min-w-20 ${
        isSelected
          ? 'glass-strong ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-400/10'
          : 'glass hover:bg-white/5'
      }`}
      style={{ transform: isSelected ? 'scale(1.05)' : 'scale(1)' }}
    >
      <div className="text-xs font-medium text-slate-300" dir="ltr">
        {hour.timeLabel}:{formatNumber(0, { minimumIntegerDigits: 2, useGrouping: false })}
      </div>
      <div className="text-3xl">{hour.icon}</div>
      <div className="text-lg font-bold text-white">{formatNumber(hour.temp)}°</div>
      <div className="text-xs text-slate-300">{formatNumber(hour.pop)}% 🌧</div>
      <div className="text-xs text-slate-300">
        {formatNumber(hour.windSpeed)} {t.units.kmh}
      </div>
    </button>
  );
}
