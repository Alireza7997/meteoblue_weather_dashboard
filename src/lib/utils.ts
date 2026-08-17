import { format, isToday, isTomorrow } from '@/lib/date-fns';
import type { CurrentWeather, HourlyForecast, DailyForecast, WeatherCondition } from './types';
import { WEATHER_ICONS, getWindDirection } from './constants';

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed * 3.6)} km/h`;
}

export function formatPressure(pressure: number): string {
  return `${pressure} hPa`;
}

export function formatHumidity(humidity: number): string {
  return `${humidity}%`;
}

export function formatUVIndex(uvi: number | string): string {
  if (typeof uvi === 'string') {
    return uvi;
  }
  if (uvi < 3) return 'Low';
  if (uvi < 6) return 'Moderate';
  return 'High';
}

export function getUVIndexCategory(uvi: number): string {
  if (uvi < 3) return 'Low';
  if (uvi < 6) return 'Moderate';
  return 'High';
}

export function formatTime(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return format(date, 'HH:mm');
}

export function formatHour(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return format(date, 'HH');
}

export function formatDay(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEE, MMM d');
}

export function formatDayShort(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return format(date, 'EEE');
}

export function getWeatherIcon(iconCode: string): string {
  return WEATHER_ICONS[iconCode] || '🌤️';
}

export function getWeatherDescription(weather: WeatherCondition[]): string {
  if (weather.length === 0) return 'Unknown';
  return weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1);
}

export function getCurrentWeatherInfo(
  current: CurrentWeather & { uvi: string | number },
  timezoneOffset: number
): {
  temp: string;
  condition: string;
  icon: string;
  humidity: string;
  wind: string;
  windDir: string;
  pressure: string;
  uv: string;
  clouds: string;
} {
  return {
    temp: formatTemperature(current.temp),
    condition: getWeatherDescription(current.weather),
    icon: getWeatherIcon(current.weather[0]?.icon || '01d'),
    humidity: formatHumidity(current.humidity),
    wind: formatWindSpeed(current.wind_speed),
    windDir: getWindDirection(current.wind_deg),
    pressure: formatPressure(current.pressure),
    uv: formatUVIndex(current.uvi),
    clouds: `${current.clouds}%`,
  };
}

export function processHourlyForecast(
  hourly: HourlyForecast[],
  timezoneOffset: number,
  hours: number = 24
) {
  return hourly.slice(0, hours).map((hour) => ({
    time: formatHour(hour.dt, timezoneOffset),
    timestamp: hour.dt,
    temp: Math.round(hour.temp),
    pop: hour.pop ? Math.round(hour.pop * 100) : 0,
    precipitation: hour.rain?.['1h'] || hour.snow?.['1h'] || 0,
    icon: getWeatherIcon(hour.weather[0]?.icon || '01d'),
    condition: getWeatherDescription(hour.weather),
    windSpeed: Math.round(hour.wind_speed * 3.6),
    windDir: getWindDirection(hour.wind_deg),
    humidity: hour.humidity,
    clouds: hour.clouds ?? 0,
    uvi: hour.uvi ?? 0,
    pressure: hour.pressure,
  }));
}

export function processDailyForecast(
  daily: DailyForecast[],
  timezoneOffset: number
) {
  return daily.map((day) => ({
    date: formatDay(day.dt, timezoneOffset),
    dateShort: formatDayShort(day.dt, timezoneOffset),
    timestamp: day.dt,
    tempMax: Math.round(day.temp.max),
    tempMin: Math.round(day.temp.min),
    pop: day.pop ? Math.round(day.pop * 100) : 0,
    precipitation: day.rain || day.snow || 0,
    icon: getWeatherIcon(day.weather[0]?.icon || '01d'),
    condition: getWeatherDescription(day.weather),
    windSpeed: day.wind_speed ? Math.round(day.wind_speed * 3.6) : 0,
    windDir: day.wind_deg ? getWindDirection(day.wind_deg) : '',
    humidity: day.humidity ?? 0,
    uvi: day.uvi ?? 0,
  }));
}

export function generateWeatherInsights(
  current: CurrentWeather,
  hourly: HourlyForecast[],
  daily: DailyForecast[],
  timezoneOffset: number
): { type: 'warning' | 'info' | 'success'; message: string; icon: string }[] {
  const insights: { type: 'warning' | 'info' | 'success'; message: string; icon: string }[] = [];

  const next24Hours = hourly.slice(0, 8);
  if (next24Hours.length === 0) {
    insights.push({ type: 'info', message: 'No forecast data available', icon: '🌤' });
    return insights;
  }

  const maxTemp = Math.max(...next24Hours.map((h) => h.temp));
  const minTemp = Math.min(...next24Hours.map((h) => h.temp));
  const maxWind = Math.max(...next24Hours.map((h) => h.wind_speed));

  const rainHours = next24Hours.filter((h) => (h.rain?.['1h'] || 0) > 0.5);

  if (rainHours.length > 2) {
    insights.push({
      type: 'info',
      message: 'Rain likely throughout the day',
      icon: '🌧',
    });
  }

  if (maxTemp - minTemp > 8) {
    insights.push({
      type: 'info',
      message: `Temperature will vary by ${Math.round(maxTemp - minTemp)}°C`,
      icon: '🌡',
    });
  }

  if (maxWind > 13.8) {
    const windTime = next24Hours.find((h) => h.wind_speed === maxWind);
    if (windTime) {
      const time = formatTime(windTime.dt, timezoneOffset);
      insights.push({
        type: 'warning',
        message: `Strong winds (${Math.round(maxWind * 3.6)} km/h) expected around ${time}`,
        icon: '💨',
      });
    }
  }

  const uvCategory = typeof current.uvi === 'string' ? current.uvi : getUVIndexCategory(current.uvi);
  if (uvCategory === 'Low') {
    insights.push({
      type: 'success',
      message: 'Low UV - minimal sun protection needed',
      icon: '🔆',
    });
  }

  const tomorrow = daily[1];
  if (tomorrow) {
    const tempChange = tomorrow.temp.day - current.temp;
    if (tempChange < -5) {
      insights.push({
        type: 'info',
        message: `Temperature will drop ${Math.abs(Math.round(tempChange))}°C tomorrow`,
        icon: '🌡',
      });
    } else if (tempChange > 5) {
      insights.push({
        type: 'info',
        message: `Temperature will rise ${Math.round(tempChange)}°C tomorrow`,
        icon: '🌡',
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      message: 'No significant weather changes expected',
      icon: '🌤',
    });
  }

  return insights.slice(0, 5);
}

export type HourlyForecastItem = {
  time: string;
  timestamp: number;
  temp: number;
  pop: number;
  precipitation: number;
  icon: string;
  condition: string;
  windSpeed: number;
  windDir: string;
  humidity: number;
  clouds: number;
  uvi: number;
  pressure: number;
};

export type DailyForecastItem = {
  date: string;
  dateShort: string;
  timestamp: number;
  tempMax: number;
  tempMin: number;
  pop: number;
  precipitation: number;
  icon: string;
  condition: string;
  windSpeed: number;
  windDir: string;
  humidity: number;
  uvi: number;
  index?: number;
};

export type WeatherInsight = {
  type: 'warning' | 'info' | 'success';
  message: string;
  icon: string;
};