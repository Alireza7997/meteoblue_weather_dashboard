import { format } from '@/lib/date-fns';
import type { CurrentWeather, HourlyForecast, DailyForecast, WeatherCondition } from './types';
import { WEATHER_ICONS, getWindDirection } from './constants';
import {
  DEFAULT_LOCALE,
  formatLocaleDate,
  formatLocaleTime,
  formatMessage,
  formatNumber,
  getDictionary,
  localizeDigits,
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

/**
 * Forecast days are bucketed by the *location's* calendar day, not the
 * viewer's, so "Today"/"Tomorrow" must be derived from the location offset.
 * `localDayIndex` maps an epoch to the location-local day number.
 */
function localDayIndex(timestamp: number, timezoneOffset: number): number {
  return Math.floor((timestamp + timezoneOffset) / 86400);
}

function todayIndex(timezoneOffset: number): number {
  return localDayIndex(Math.floor(Date.now() / 1000), timezoneOffset);
}

/**
 * Calendar date of a forecast timestamp in the location's timezone, returned as
 * a plain local Date whose getters are already timezone-independent.
 */
function calendarDate(timestamp: number, timezoneOffset: number): Date {
  const shifted = new Date((timestamp + timezoneOffset) * 1000);
  return new Date(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
}

export function isForecastToday(timestamp: number, timezoneOffset: number): boolean {
  return localDayIndex(timestamp, timezoneOffset) === todayIndex(timezoneOffset);
}

/** "Today" / "Tomorrow" / weekday name, in the location's timezone. */
export function formatDayLabel(timestamp: number, timezoneOffset: number, locale: Locale = DEFAULT_LOCALE): string {
  const dict = getDictionary(locale);
  const day = localDayIndex(timestamp, timezoneOffset);
  const today = todayIndex(timezoneOffset);
  if (day === today) return dict.daily.today;
  if (day === today + 1) return dict.daily.tomorrow;
  return formatLocaleDate(calendarDate(timestamp, timezoneOffset), locale, 'weekdayLong');
}

/** Calendar date only, e.g. "Oct 7" / "۱۷ مهر". */
export function formatDayDate(timestamp: number, timezoneOffset: number, locale: Locale = DEFAULT_LOCALE): string {
  return formatLocaleDate(calendarDate(timestamp, timezoneOffset), locale, 'date');
}

export function formatDayShort(timestamp: number, timezoneOffset: number, locale: Locale = DEFAULT_LOCALE): string {
  return formatLocaleDate(calendarDate(timestamp, timezoneOffset), locale, 'weekday');
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
  /** Untranslated API description — the background effect matches on this. */
  conditionKey: string;
  icon: string;
  humidity: string;
  wind: string;
  windDir: string;
  pressure: string;
  uv: string;
} {
  return {
    temp: formatTemperature(current.temp, locale),
    condition: getWeatherDescription(current.weather, locale),
    conditionKey: current.weather[0]?.description ?? '',
    icon: getWeatherIcon(current.weather[0]?.icon || '01d'),
    humidity: formatHumidity(current.humidity, locale),
    wind: formatWindSpeed(current.wind_speed, locale),
    windDir: translateWindDirection(getWindDirection(current.wind_deg), locale),
    pressure: formatPressure(current.pressure, locale),
    uv: formatUVIndex(current.uvi),
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
    // Zero-padded and localized ("۰۷" / "07") so every slot renders as HH:00.
    timeLabel: localizeDigits(formatHour(hour.dt, timezoneOffset), locale),
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
    timestamp: day.dt,
    isToday: isForecastToday(day.dt, timezoneOffset),
    dayLabel: formatDayLabel(day.dt, timezoneOffset, locale),
    dateLabel: formatDayDate(day.dt, timezoneOffset, locale),
    dateShort: formatDayShort(day.dt, timezoneOffset, locale),
    tempMax: Math.round(day.temp.max),
    tempMin: Math.round(day.temp.min),
    pop: day.pop ? Math.round(day.pop * 100) : 0,
    precipitation: day.rain || day.snow || 0,
    icon: getWeatherIcon(day.weather[0]?.icon || '01d'),
    condition: getWeatherDescription(day.weather, locale),
    conditionKey: day.weather[0]?.description ?? '',
    windSpeed: day.wind_speed ? Math.round(day.wind_speed * 3.6) : 0,
    windDir: day.wind_deg ? translateWindDirection(getWindDirection(day.wind_deg), locale) : '',
    humidity: day.humidity ?? 0,
    uvi: day.uvi ?? 0,
  }));
}

/** Selected day falls back to the first (today's) entry when nothing matches. */
export function resolveSelectedDay<T extends { timestamp: number }>(
  selectedDate: string,
  days: T[]
): T | null {
  if (days.length === 0) return null;
  return days.find((day) => String(day.timestamp) === selectedDate) ?? days[0];
}

export type HeroWeather = {
  temp: string;
  tempMin?: string;
  condition: string;
  conditionKey: string;
  icon: string;
  dayLabel?: string;
  humidity: string;
  wind: string;
  windDir: string;
  pressure?: string;
  precipChance?: string;
  uv: string;
};

/**
 * Hero panel data for the day the user picked in the 7-day forecast.
 * Today keeps the live readings; any other day previews that day's aggregates.
 */
export function buildHeroWeather(
  current: ReturnType<typeof getCurrentWeatherInfo>,
  day: DailyForecastItem | null,
  locale: Locale = DEFAULT_LOCALE,
  kmhUnit = 'km/h'
): HeroWeather | null {
  if (!current) return null;

  const base: HeroWeather = {
    temp: current.temp,
    condition: current.condition,
    conditionKey: current.conditionKey,
    icon: current.icon,
    humidity: current.humidity,
    wind: current.wind,
    windDir: current.windDir,
    pressure: current.pressure,
    uv: current.uv,
  };

  if (!day) return base;

  base.precipChance = `${formatNumber(day.pop, locale)}%`;

  if (day.isToday) return base;

  return {
    ...base,
    temp: formatTemperature(day.tempMax, locale),
    tempMin: formatTemperature(day.tempMin, locale),
    condition: day.condition,
    conditionKey: day.conditionKey,
    icon: day.icon,
    dayLabel: `${day.dayLabel} · ${day.dateLabel}`,
    humidity: `${formatNumber(day.humidity, locale)}%`,
    wind: `${formatNumber(day.windSpeed, locale)} ${kmhUnit}`,
    windDir: day.windDir,
    pressure: undefined,
    uv: normalizeUvCategory(day.uvi),
  };
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
