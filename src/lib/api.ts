import type { WeatherData, GeocodingResult, AppLocation, HistoricalData, CurrentWeather, HourlyForecast, DailyForecast } from './types';
import { getMockHistoricalData } from './constants';

// meteoblue API Configuration
const METEOBLUE_BASE = 'https://my.meteoblue.com';
const METEOBLUE_FORECAST = `${METEOBLUE_BASE}/packages/basic-1h`;
const METEOBLUE_LOCATION = `${METEOBLUE_BASE}/geocoding/v1/search`;

// Security: Use environment variables
const API_KEY = process.env.NEXT_PUBLIC_METEOBLUE_API_KEY;
const SHARED_SECRET = process.env.METEOBLUE_SHARED_SECRET; // For signature mechanism

function getApiKey(): string {
  if (!API_KEY) {
    throw new Error('Missing NEXT_PUBLIC_METEOBLUE_API_KEY environment variable.');
  }
  return API_KEY;
}

function signRequest(query: string): string {
  if (!SHARED_SECRET) {
    return query;
  }

  const crypto = require('crypto');
  // Sign the full base URL + query
  const sig = crypto
    .createHmac('sha256', SHARED_SECRET)
    .update(query)
    .digest('hex');

  return `${query}&sig=${sig}`;
}

// Transform MeteoBlue weather code to OpenWeather-style condition
function transformWeatherCode(code: number): { id: number; main: string; description: string; icon: string } {
  // MeteoBlue weather codes (standard WMO)
  const weatherMap: Record<number, { main: string; description: string; icon: string }> = {
    0: { main: 'Clear', description: 'clear sky', icon: '01d' },
    1: { main: 'Clear', description: 'mainly clear', icon: '01d' },
    2: { main: 'Clouds', description: 'partly cloudy', icon: '02d' },
    3: { main: 'Clouds', description: 'overcast', icon: '04d' },
    45: { main: 'Fog', description: 'fog', icon: '50d' },
    48: { main: 'Fog', description: 'depositing rime fog', icon: '50d' },
    51: { main: 'Drizzle', description: 'light drizzle', icon: '09d' },
    53: { main: 'Drizzle', description: 'moderate drizzle', icon: '09d' },
    55: { main: 'Drizzle', description: 'dense drizzle', icon: '09d' },
    61: { main: 'Rain', description: 'slight rain', icon: '10d' },
    63: { main: 'Rain', description: 'moderate rain', icon: '10d' },
    65: { main: 'Rain', description: 'heavy rain', icon: '10d' },
    71: { main: 'Snow', description: 'slight snow', icon: '13d' },
    73: { main: 'Snow', description: 'moderate snow', icon: '13d' },
    75: { main: 'Snow', description: 'heavy snow', icon: '13d' },
    80: { main: 'Rain', description: 'slight rain showers', icon: '09d' },
    81: { main: 'Rain', description: 'moderate rain showers', icon: '09d' },
    82: { main: 'Rain', description: 'violent rain showers', icon: '09d' },
    85: { main: 'Snow', description: 'slight snow showers', icon: '13d' },
    86: { main: 'Snow', description: 'heavy snow showers', icon: '13d' },
    95: { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
    96: { main: 'Thunderstorm', description: 'thunderstorm with hail', icon: '11d' },
    99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: '11d' },
  };

  const mapped = weatherMap[code] || { main: 'Unknown', description: 'unknown', icon: '01d' };
  return { id: code, ...mapped };
}

// Helper: Convert dew point to relative humidity (simplified)
function humidityToPercentage(dewPoint: number): number {
  return 50 + Math.round((dewPoint / 20) * 10);
}

// Transform MeteoBlue response to our WeatherData format
function transformMeteoBlueResponse(any: any, lat: number, lon: number): WeatherData {
  const now = Math.floor(Date.now() / 1000);
  const then = new Date();
  const currentHourIndex = then.getUTCHours();

  // Basic-1h package returns parallel array structures (per doc.md)
  // Structure: metadata + parallel arrays for each variable
  // e.g., temperature {time[], val[]}, weathercode {time[], val[]}, etc.
  const temperature = any.temperature?.val || [];
  const precipitation = any.precipitationamount?.val || [];
  const windspeed = any.windspeed?.val || [];
  const winddirection = any.winddirection?.val || [];
  const cloudcover = any.cloudcover?.val || [];
  const uv_index = any.uv_index?.val || [];
  const dewpoint = any.dewpoint?.val || [];
  const weathercode = any.weathercode?.val || [];
  const relativehumidity = any.relativehumidity?.val || [];

  const timeStrings = any.temperature?.time || [];

  const timezone = any.timezone || 'UTC';
  const timezoneOffset = then.getTimezoneOffset();

  // Convert time strings to timestamps
  const getTimestamp = (timeStr: string): number => {
    if (!timeStr) return now;
    const [dateStr, hourStr] = timeStr.split(' ');
    const date = new Date(dateStr);
    const hour = parseInt(hourStr.substring(0, 2), 10);
    date.setUTCHours(hour, 0, 0, 0);
    return Math.floor(date.getTime() / 1000);
  };

  const timestamps = timeStrings.map(getTimestamp);

  // Find current weather (nearest to current time)
  const currentTime = now;
  let currentIdx = timestamps.findIndex((t: number) => Math.abs(t - currentTime) < (3600 / 2)); // within 30 mins
  if (currentIdx < 0) currentIdx = timestamps.findIndex((t: number) => t > currentTime) || 0;

  const currentHourDataIdx = currentIdx;
  const currentHourIdx = currentHourIndex + Math.floor((currentIdx - currentHourDataIdx) / 3); // approximate

  // Get current weather
  const getVal = (idx: number): number => temperature[idx] || 0;
  const getWeatherCode = (idx: number): number => weathercode?.[idx] || 0;

  const current: CurrentWeather = {
    dt: timestamps[currentIdx] || now,
    sunrise: 0,
    sunset: 0,
    temp: getVal(currentIdx),
    feels_like: 0, // MeteoBlue basic doesn't provide
    pressure: 1013,
    humidity: humidityToPercentage(dewpoint[currentIdx] || 0),
    dew_point: dewpoint[currentIdx] || 0,
    uvi: uv_index[currentIdx] || 0,
    clouds: cloudcover[currentIdx] || 0,
    visibility: 10000,
    wind_speed: windspeed[currentIdx] ? windspeed[currentIdx] / 3.6 : 0,
    wind_deg: winddirection[currentIdx] || 0,
    wind_gust: 0,
    weather: [transformWeatherCode(getWeatherCode(currentIdx))],
  };

  // Transform hourly forecast (next 24 hours, every 3 hours)
  const hourly: HourlyForecast[] = [];
  const baseIdx = currentIdx + 3; // Start at next 3-hour interval

  for (let i = 0; i < 8; i++) {
    const idx = baseIdx + (i * 3);
    if (timestamps[idx]) {
      const temp = getVal(idx);
      const wind = windspeed[idx] ? windspeed[idx] / 3.6 : 0;
      const code = getWeatherCode(idx);
      const precipProb = precipitation[idx] > 0 ? Math.min(100, Math.round((precipitation[idx] / 5) * 100)) : 0;
      const precipAmount = precipitation[idx] || 0;

      hourly.push({
        dt: timestamps[idx],
        temp: temp,
        feels_like: 0,
        pressure: 1013,
        humidity: humidityToPercentage(dewpoint[idx] || 0),
        dew_point: dewpoint[idx] || 0,
        uvi: uv_index[idx] || 0,
        clouds: cloudcover[idx] || 0,
        visibility: 10000,
        wind_speed: wind,
        wind_deg: winddirection[idx] || 0,
        wind_gust: 0,
        weather: [transformWeatherCode(code)],
        pop: precipProb / 100,
        rain: precipAmount > 0.1 ? { '1h': Math.round(precipAmount) * 10 } : undefined,
      });
    }
  }

  // Transform daily forecast (next 7 days)
  const daily: DailyForecast[] = [];
  let dayIndex = 0;
  const targetDays = 7;

  while (daily.length < targetDays && dayIndex + (2 * 24) < timestamps.length) {
    // Get representative hour for this day
    const baseDateIdx = currentIdx + dayIndex * (2 * 24);
    const baseDate = new Date(timestamps[baseDateIdx] * 1000);

    // Find hour closest to 14:00 UTC for day average
    const dayStartIdx = Math.min(baseDateIdx + 24, timestamps.length - 1);
    const dayEndIdx = Math.min(baseDateIdx + 2 * 24 - 1, timestamps.length - 1);

    const temps = temperature.slice(dayStartIdx, dayEndIdx + 1);
    if (temps.length === 0) {
      dayIndex++;
      continue;
    }

    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const avgTemp = temps.reduce((a: number, b: number) => a + b, 0) / temps.length;

    const dayPrecip = precipitation.slice(dayStartIdx, dayEndIdx + 1).reduce((a: number, b: number) => a + b, 0);
    const precipProb = dayPrecip > 0 ? Math.min(100, Math.round((dayPrecip / 5) * 100)) : 0;
    const precipAmount = Math.round(dayPrecip);

    const dayCode = getWeatherCode(baseDateIdx);

    daily.push({
      dt: timestamps[baseDateIdx] || Math.floor(baseDate.getTime() / 1000),
      sunrise: 0,
      sunset: 0,
      moonrise: 0,
      moonset: 0,
      moon_phase: 0,
      summary: '',
      temp: {
        day: avgTemp,
        min: minTemp,
        max: maxTemp,
        night: minTemp,
        eve: avgTemp,
        morn: avgTemp,
      },
      feels_like: {
        day: avgTemp,
        night: minTemp,
        eve: avgTemp,
        morn: avgTemp,
      },
      pressure: 1013,
      humidity: humidityToPercentage(dewpoint[baseDateIdx] || 0),
      dew_point: dewpoint[baseDateIdx] || 0,
      wind_speed: windspeed[baseDateIdx] ? windspeed[baseDateIdx] / 3.6 : 0,
      wind_deg: winddirection[baseDateIdx] || 0,
      wind_gust: 0,
      weather: [transformWeatherCode(dayCode)],
      clouds: cloudcover[baseDateIdx] || 0,
      pop: precipProb / 100,
      rain: precipAmount > 0.1 ? precipAmount : undefined,
      uvi: uv_index[baseDateIdx] || 0,
    });

    dayIndex++;
  }

  return {
    lat,
    lon,
    timezone,
    timezone_offset: timezoneOffset,
    current,
    hourly,
    daily,
  };
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    // Basic-1h package: 1-hour forecast for next 7 days
    const query = `/packages/basic-1h?lat=${lat}&lon=${lon}&apikey=${getApiKey()}&expire=1924948800`;
    const signedQuery = signRequest(query);
    const url = `${METEOBLUE_BASE}${signedQuery}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your meteoblue API key.');
      }
      if (response.status === 429) {
        throw new Error('API rate limit exceeded (500 calls/minute). Please try again later.');
      }
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    return transformMeteoBlueResponse(data, lat, lon);
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return null;
  }
}

// Transform MeteoBlue geocoding response to our format
function transformGeocodingResult(result: any): GeocodingResult {
  return {
    name: result.name || result.city || 'Unknown',
    lat: result.latitude || result.lat || 0,
    lon: result.longitude || result.lon || 0,
    country: result.country || result.country_code || '',
    state: result.admin1 || result.state || undefined,
    local_names: result.local_names || undefined,
  };
}

export async function fetchGeocoding(query: string): Promise<GeocodingResult[]> {
  try {
    const url = `${METEOBLUE_LOCATION}?q=${encodeURIComponent(query)}&count=5&language=en&format=json&apikey=${getApiKey()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    // MeteoBlue returns results in a results array
    const results = data.results || data || [];

    // Handle both array and single result formats
    const resultsArray = Array.isArray(results) ? results : [results];

    return resultsArray.map(transformGeocodingResult);
  } catch (error) {
    console.error('Failed to fetch geocoding:', error);
    return [];
  }
}

export async function fetchReverseGeocoding(lat: number, lon: number): Promise<GeocodingResult | null> {
  try {
    // meteoblue doesn't provide direct reverse geocoding
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      name: data.city || data.locality || 'Unknown location',
      lat: lat,
      lon: lon,
      country: data.countryName || '',
      state: data.principalSubdivision || ''
    } as GeocodingResult;
  } catch (error) {
    console.error('Failed to fetch reverse geocoding:', error);
    return null;
  }
}

export async function fetchHistoricalData(location: AppLocation): Promise<HistoricalData | null> {
  try {
    // NOTE: History API requires Enterprise tier (doc.md line 170)
    // Free tier only supports Forecast and Images APIs
    // Returning mock data for free tier users
    const mockData = getMockHistoricalData(location);
    return {
      location,
      averages: mockData,
      currentYear: {
        temp: mockData.temp_avg + (Math.random() - 0.5) * 4,
        precipitation: mockData.precipitation_avg * (0.8 + Math.random() * 0.4),
      },
    };
  } catch (error) {
    console.error('Failed to fetch historical data:', error);
    return null;
  }
}

export function generateWeatherGrid(
  centerLat: number,
  centerLon: number,
  radiusKm: number = 200,
  resolution: number = 20
): { lat: number; lon: number; value: number }[] {
  const points: { lat: number; lon: number; value: number }[] = [];
  const latStep = (radiusKm / 111) / resolution;
  const lonStep = (radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180))) / resolution;

  const gridSize = resolution * 2 + 1;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lat = centerLat - (resolution * latStep) + i * latStep;
      const lon = centerLon - (resolution * lonStep) + j * lonStep;

      const distance = Math.sqrt(
        Math.pow((lat - centerLat) * 111, 2) +
        Math.pow((lon - centerLon) * 111 * Math.cos((centerLat * Math.PI) / 180), 2)
      );

      if (distance <= radiusKm) {
        points.push({ lat, lon, value: 0 });
      }
    }
  }

  return points;
}

export function interpolateWeatherGrid(
  points: { lat: number; lon: number; value: number }[],
  targetLat: number,
  targetLon: number,
  radius: number = 50
): number {
  let weightedSum = 0;
  let weightSum = 0;

  for (const point of points) {
    const distance = Math.sqrt(
      Math.pow((point.lat - targetLat) * 111, 2) +
      Math.pow((point.lon - targetLon) * 111 * Math.cos((targetLat * Math.PI) / 180), 2)
    );

    if (distance <= radius) {
      const weight = 1 / (1 + distance);
      weightedSum += point.value * weight;
      weightSum += weight;
    }
  }

  return weightSum > 0 ? weightedSum / weightSum : 0;
}