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
      className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
        isSelected
          ? 'glass-strong ring-1 ring-cyan-400/30'
          : 'glass hover:bg-white/5'
      }`}
    >
      <div className="w-20 text-left">
        <div className="font-medium text-white">{day.date}</div>
        <div className="text-xs text-slate-400">{day.dateShort}</div>
      </div>

      <div className="text-3xl flex-shrink-0">{day.icon}</div>

      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-300 truncate">{day.condition}</div>
        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
          <span>💧 {day.humidity}%</span>
          <span>💨 {day.windSpeed} km/h {day.windDir}</span>
          <span>🔆 UV {day.uvi.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-right">
        <div className="text-lg font-bold text-white">
          {day.tempMax}° / {day.tempMin}°
        </div>
        <div className="text-sm text-slate-400 w-16 text-right">
          {day.pop}% 🌧
        </div>
        {isSelected && (
          <div className="w-2 h-2 rounded-full bg-cyan-400 ml-2" />
        )}
      </div>
    </button>
  );
}