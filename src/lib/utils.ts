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

export function formatVisibility(visibility: number): string {
  return `${(visibility / 1000).toFixed(1)} km`;
}

export function formatUVIndex(uvi: number): string {
  return `${uvi.toFixed(1)}`;
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

export function formatDate(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return format(date, 'MMMM d, yyyy');
}

export function getWeatherIcon(iconCode: string): string {
  return WEATHER_ICONS[iconCode] || '🌤️';
}

export function getWeatherDescription(weather: WeatherCondition[]): string {
  if (weather.length === 0) return 'Unknown';
  return weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1);
}

export function getCurrentWeatherInfo(
  current: CurrentWeather,
  timezoneOffset: number
): {
  temp: string;
  feelsLike: string;
  condition: string;
  icon: string;
  humidity: string;
  wind: string;
  windDir: string;
  pressure: string;
  visibility: string;
  uv: string;
  sunrise: string;
  sunset: string;
} {
  return {
    temp: formatTemperature(current.temp),
    feelsLike: formatTemperature(current.feels_like),
    condition: getWeatherDescription(current.weather),
    icon: getWeatherIcon(current.weather[0]?.icon || '01d'),
    humidity: formatHumidity(current.humidity),
    wind: formatWindSpeed(current.wind_speed),
    windDir: getWindDirection(current.wind_deg),
    pressure: formatPressure(current.pressure),
    visibility: formatVisibility(current.visibility),
    uv: formatUVIndex(current.uvi),
    sunrise: formatTime(current.sunrise, timezoneOffset),
    sunset: formatTime(current.sunset, timezoneOffset),
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
    feelsLike: Math.round(hour.feels_like),
    pop: Math.round(hour.pop * 100),
    precipitation: hour.rain?.['1h'] || hour.snow?.['1h'] || 0,
    icon: getWeatherIcon(hour.weather[0]?.icon || '01d'),
    condition: getWeatherDescription(hour.weather),
    windSpeed: Math.round(hour.wind_speed * 3.6),
    windDir: getWindDirection(hour.wind_deg),
    humidity: hour.humidity,
    clouds: hour.clouds,
    uvi: hour.uvi,
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
    pop: Math.round(day.pop * 100),
    precipitation: day.rain || day.snow || 0,
    icon: getWeatherIcon(day.weather[0]?.icon || '01d'),
    condition: getWeatherDescription(day.weather),
    windSpeed: Math.round(day.wind_speed * 3.6),
    windDir: getWindDirection(day.wind_deg),
    humidity: day.humidity,
    uvi: day.uvi,
    sunrise: formatTime(day.sunrise, timezoneOffset),
    sunset: formatTime(day.sunset, timezoneOffset),
  }));
}

export function generateWeatherInsights(
  current: CurrentWeather,
  hourly: HourlyForecast[],
  daily: DailyForecast[],
  timezoneOffset: number
): { type: 'warning' | 'info' | 'success'; message: string; icon: string }[] {
  const insights: { type: 'warning' | 'info' | 'success'; message: string; icon: string }[] = [];

  const next24Hours = hourly.slice(0, 24);
  const maxTemp = Math.max(...next24Hours.map((h) => h.temp));
  const minTemp = Math.min(...next24Hours.map((h) => h.temp));
  const maxPop = Math.max(...next24Hours.map((h) => h.pop));
  const maxWind = Math.max(...next24Hours.map((h) => h.wind_speed));
  const maxUvi = Math.max(...next24Hours.map((h) => h.uvi));

  const rainHours = next24Hours.filter((h) => h.pop > 0.5);
  const heavyRainHours = next24Hours.filter((h) => h.pop > 0.7 && (h.rain?.['1h'] || 0) > 5);

  if (heavyRainHours.length > 0) {
    const firstHeavy = heavyRainHours[0];
    const time = formatTime(firstHeavy.dt, timezoneOffset);
    insights.push({
      type: 'warning',
      message: `Heavy rain expected around ${time}`,
      icon: '🌧',
    });
  } else if (rainHours.length > 6) {
    insights.push({
      type: 'info',
      message: 'Rain likely throughout the day',
      icon: '🌧',
    });
  }

  if (maxTemp - minTemp > 8) {
    insights.push({
      type: 'info',
      message: `Temperature will vary by ${Math.round(maxTemp - minTemp)}°C today`,
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

  if (maxUvi > 7) {
    const uvTime = next24Hours.find((h) => h.uvi === maxUvi);
    if (uvTime) {
      const time = formatTime(uvTime.dt, timezoneOffset);
      insights.push({
        type: 'warning',
        message: `UV index reaches ${maxUvi.toFixed(1)} around ${time} - use sun protection`,
        icon: '🔆',
      });
    }
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

    if (tomorrow.pop > 0.7) {
      insights.push({
        type: 'warning',
        message: `High chance of rain tomorrow (${Math.round(tomorrow.pop * 100)}%)`,
        icon: '🌧',
      });
    }
  }

  if (current.uvi < 3) {
    insights.push({
      type: 'success',
      message: 'Low UV index - minimal sun protection needed',
      icon: '🔆',
    });
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
  feelsLike: number;
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
  sunrise: string;
  sunset: string;
  index?: number;
};

export type WeatherInsight = {
  type: 'warning' | 'info' | 'success';
  message: string;
  icon: string;
};