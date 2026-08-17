'use client';

import type { DailyForecastItem } from '@/lib/utils';
import { useWeatherStore } from '@/lib/store';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  timezoneOffset: number;
}

export function DailyForecast({ daily, timezoneOffset }: DailyForecastProps) {
  const { selectedDate, setSelectedDate } = useWeatherStore();

  return (
    <div className="panel">
      <h3 className="section-title mb-4">7-Day Forecast</h3>

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
  return (
    <button
      onClick={onClick}
      className={`w-full flex flex-wrap items-center gap-x-3 gap-y-2 p-3 rounded-lg transition-all duration-200 text-left ${
        isSelected
          ? 'glass-strong ring-1 ring-cyan-400/30'
          : 'glass hover:bg-white/5'
      }`}
    >
      <div className="w-14 sm:w-20 shrink-0">
        <div className="font-medium text-white text-sm sm:text-base">{day.date.split(',')[0]}</div>
        <div className="text-xs text-slate-300 truncate">{day.dateShort}</div>
      </div>

      <div className="text-2xl sm:text-3xl shrink-0">{day.icon}</div>

      <div className="flex-1 min-w-0 basis-32 sm:basis-0">
        <div className="text-xs sm:text-sm text-slate-300 truncate">{day.condition}</div>
        <div className="flex flex-wrap items-center gap-x-3 sm:gap-4 gap-y-0.5 text-xs text-slate-300 mt-1">
          <span>💧 {day.humidity}%</span>
          <span className="hidden sm:inline">💨 {day.windSpeed} km/h {day.windDir}</span>
          <span className="sm:hidden">💨 {day.windSpeed} km/h</span>
          <span className={day.uvi < 3 ? 'text-green-400' : day.uvi < 6 ? 'text-amber-400' : 'text-red-400'}>🔆 UV {day.uvi < 3 ? 'Low' : day.uvi < 6 ? 'Moderate' : 'High'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 text-right ml-auto shrink-0">
        <div className="text-base sm:text-lg font-bold text-white whitespace-nowrap">
          {day.tempMax}° / {day.tempMin}°
        </div>
        <div className="text-xs sm:text-sm text-slate-300 w-12 sm:w-16 text-right whitespace-nowrap">
          {day.pop}% 🌧
        </div>
      </div>
    </button>
  );
}