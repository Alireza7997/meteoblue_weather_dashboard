import { format, isToday, isTomorrow } from '@/lib/date-fns';
import type { CurrentWeather, HourlyForecast, DailyForecast, WeatherCondition } from './types';
import { WEATHER_ICONS, getWindDirection } from './constants';
import {
  DEFAULT_LOCALE,
  formatLocaleDate,
  formatLocaleTime,
  formatMessage,
  formatNumber,
  getDictionary,
  translateCondition,
  translateWindDirection,
  type Locale,
} from './i18n';

export function formatTemperature(temp: number, locale: Locale = DEFAULT_LOCALE): string {
  return `${formatNumber(Math.round(temp), locale)}°C`;
}

export function formatWindSpeed(speed: number, locale: Locale = DEFAULT_LOCALE): string {
  return `${formatNumber(Math.round(speed * 3.6), locale)} ${getDictionary(locale).units.kmh}`;
}

export function formatPressure(pressure: number, locale: Locale = DEFAULT_LOCALE): string {
  return `${formatNumber(pressure, locale)} hPa`;
}

export function formatHumidity(humidity: number, locale: Locale = DEFAULT_LOCALE): string {
  return `${formatNumber(humidity, locale)}%`;
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

export type UvCategory = 'Low' | 'Moderate' | 'High';

export function normalizeUvCategory(uv: string | number): UvCategory {
  if (typeof uv === 'number') {
    return uv < 3 ? 'Low' : uv < 6 ? 'Moderate' : 'High';
  }
  return uv === 'Moderate' || uv === 'High' ? uv : 'Low';
}

export function formatTime(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return format(date, 'HH:mm');
}

export function formatHour(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return format(date, 'HH');
}

export function formatDay(timestamp: number, timezoneOffset: number, locale: Locale = DEFAULT_LOCALE): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const dict = getDictionary(locale);
  if (isToday(date)) return dict.daily.today;
  if (isTomorrow(date)) return dict.daily.tomorrow;
  return formatLocaleDate(date, locale, 'full');
}

export function formatDayShort(timestamp: number, timezoneOffset: number, locale: Locale = DEFAULT_LOCALE): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return formatLocaleDate(date, locale, 'weekday');
}

export function getWeatherIcon(iconCode: string): string {
  return WEATHER_ICONS[iconCode] || '🌤️';
}

export function getWeatherDescription(weather: WeatherCondition[], locale: Locale = DEFAULT_LOCALE): string {
  if (weather.length === 0) return translateCondition('Unknown', locale);
  return translateCondition(weather[0].description, locale);
}

export function getCurrentWeatherInfo(
  current: CurrentWeather & { uvi: string | number },
  timezoneOffset: number,
  locale: Locale = DEFAULT_LOCALE
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
    temp: formatTemperature(current.temp, locale),
    condition: getWeatherDescription(current.weather, locale),
    icon: getWeatherIcon(current.weather[0]?.icon || '01d'),
    humidity: formatHumidity(current.humidity, locale),
    wind: formatWindSpeed(current.wind_speed, locale),
    windDir: translateWindDirection(getWindDirection(current.wind_deg), locale),
    pressure: formatPressure(current.pressure, locale),
    uv: formatUVIndex(current.uvi),
    clouds: `${formatNumber(current.clouds, locale)}%`,
  };
}

export function processHourlyForecast(
  hourly: HourlyForecast[],
  timezoneOffset: number,
  hours: number = 24,
  locale: Locale = DEFAULT_LOCALE
) {
  return hourly.slice(0, hours).map((hour) => ({
    time: formatHour(hour.dt, timezoneOffset),
    timeLabel: formatNumber(parseInt(formatHour(hour.dt, timezoneOffset), 10), locale),
    timestamp: hour.dt,
    temp: Math.round(hour.temp),
    pop: hour.pop ? Math.round(hour.pop * 100) : 0,
    precipitation: hour.rain?.['1h'] || hour.snow?.['1h'] || 0,
    icon: getWeatherIcon(hour.weather[0]?.icon || '01d'),
    condition: getWeatherDescription(hour.weather, locale),
    windSpeed: Math.round(hour.wind_speed * 3.6),
    windDir: translateWindDirection(getWindDirection(hour.wind_deg), locale),
    humidity: hour.humidity,
    clouds: hour.clouds ?? 0,
    uvi: hour.uvi ?? 0,
    pressure: hour.pressure,
  }));
}

export function processDailyForecast(
  daily: DailyForecast[],
  timezoneOffset: number,
  locale: Locale = DEFAULT_LOCALE
) {
  return daily.map((day) => ({
    date: formatDay(day.dt, timezoneOffset, locale),
    dateShort: formatDayShort(day.dt, timezoneOffset, locale),
    timestamp: day.dt,
    tempMax: Math.round(day.temp.max),
    tempMin: Math.round(day.temp.min),
    pop: day.pop ? Math.round(day.pop * 100) : 0,
    precipitation: day.rain || day.snow || 0,
    icon: getWeatherIcon(day.weather[0]?.icon || '01d'),
    condition: getWeatherDescription(day.weather, locale),
    windSpeed: day.wind_speed ? Math.round(day.wind_speed * 3.6) : 0,
    windDir: day.wind_deg ? translateWindDirection(getWindDirection(day.wind_deg), locale) : '',
    humidity: day.humidity ?? 0,
    uvi: day.uvi ?? 0,
  }));
}

export function generateWeatherInsights(
  current: CurrentWeather,
  hourly: HourlyForecast[],
  daily: DailyForecast[],
  timezoneOffset: number,
  locale: Locale = DEFAULT_LOCALE
): { type: 'warning' | 'info' | 'success'; message: string; icon: string }[] {
  const dict = getDictionary(locale);
  const insights: { type: 'warning' | 'info' | 'success'; message: string; icon: string }[] = [];

  const next24Hours = hourly.slice(0, 8);
  if (next24Hours.length === 0) {
    insights.push({ type: 'info', message: dict.insights.noData, icon: '🌤' });
    return insights;
  }

  const maxTemp = Math.max(...next24Hours.map((h) => h.temp));
  const minTemp = Math.min(...next24Hours.map((h) => h.temp));
  const maxWind = Math.max(...next24Hours.map((h) => h.wind_speed));

  const rainHours = next24Hours.filter((h) => (h.rain?.['1h'] || 0) > 0.5);

  if (rainHours.length > 2) {
    insights.push({
      type: 'info',
      message: dict.insights.rainLikely,
      icon: '🌧',
    });
  }

  if (maxTemp - minTemp > 8) {
    insights.push({
      type: 'info',
      message: formatMessage(dict.insights.tempVary, {
        value: formatNumber(Math.round(maxTemp - minTemp), locale),
      }),
      icon: '🌡',
    });
  }

  if (maxWind > 13.8) {
    const windTime = next24Hours.find((h) => h.wind_speed === maxWind);
    if (windTime) {
      const time = formatLocaleTime(new Date((windTime.dt + timezoneOffset) * 1000), locale);
      insights.push({
        type: 'warning',
        message: formatMessage(dict.insights.strongWind, {
          speed: formatNumber(Math.round(maxWind * 3.6), locale),
          time,
        }),
        icon: '💨',
      });
    }
  }

  const uvCategory = typeof current.uvi === 'string' ? current.uvi : getUVIndexCategory(current.uvi);
  if (uvCategory === 'Low') {
    insights.push({
      type: 'success',
      message: dict.insights.uvLow,
      icon: '🔆',
    });
  }

  const tomorrow = daily[1];
  if (tomorrow) {
    const tempChange = tomorrow.temp.day - current.temp;
    if (tempChange < -5) {
      insights.push({
        type: 'info',
        message: formatMessage(dict.insights.tempDrop, {
          value: formatNumber(Math.abs(Math.round(tempChange)), locale),
        }),
        icon: '🌡',
      });
    } else if (tempChange > 5) {
      insights.push({
        type: 'info',
        message: formatMessage(dict.insights.tempRise, {
          value: formatNumber(Math.round(tempChange), locale),
        }),
        icon: '🌡',
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      message: dict.insights.noChange,
      icon: '🌤',
    });
  }

  return insights.slice(0, 5);
}

export type HourlyForecastItem = ReturnType<typeof processHourlyForecast>[number];

export type DailyForecastItem = ReturnType<typeof processDailyForecast>[number];

export type WeatherInsight = {
  type: 'warning' | 'info' | 'success';
  message: string;
  icon: string;
};
