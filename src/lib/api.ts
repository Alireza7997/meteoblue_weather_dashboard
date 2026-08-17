import type { WeatherData, GeocodingResult, AppLocation, HistoricalData, CurrentWeather, HourlyForecast, DailyForecast, BigDataCloudReverseGeocodingResponse } from './types';
import { getMockHistoricalData } from './constants';

// meteoblue API Configuration
const METEOBLUE_BASE = 'https://my.meteoblue.com';
const METEOBLUE_FORECAST = `${METEOBLUE_BASE}/packages/basic-1h`;
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

// Security: Use environment variables
const API_KEY = process.env.NEXT_PUBLIC_METEOBLUE_API_KEY;
const SHARED_SECRET = process.env.METEOBLUE_SHARED_SECRET;

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
  const sig = crypto
    .createHmac('sha256', SHARED_SECRET)
    .update(query)
    .digest('hex');

  return `${query}&sig=${sig}`;
}

// Transform meteoblue pictocode to OpenWeather-style condition
function transformPictocode(code: number): { id: number; main: string; description: string; icon: string } {
  // meteoblue pictocodes: https://help.meteoblue.com/en/weather-variables/weather-forecast/pictocode
  const weatherMap: Record<number, { main: string; description: string; icon: string }> = {
    1: { main: 'Clear', description: 'clear sky', icon: '01d' },
    2: { main: 'Clouds', description: 'partly cloudy', icon: '02d' },
    3: { main: 'Clouds', description: 'cloudy', icon: '03d' },
    4: { main: 'Clouds', description: 'overcast', icon: '04d' },
    5: { main: 'Fog', description: 'fog', icon: '50d' },
    6: { main: 'Drizzle', description: 'light drizzle', icon: '09d' },
    7: { main: 'Rain', description: 'light rain', icon: '10d' },
    8: { main: 'Rain', description: 'moderate rain', icon: '10d' },
    9: { main: 'Rain', description: 'heavy rain', icon: '10d' },
    10: { main: 'Clear', description: 'clear sky', icon: '01d' },
    11: { main: 'Clouds', description: 'cloudy', icon: '04d' },
    12: { main: 'Rain', description: 'rain', icon: '10d' },
    13: { main: 'Snow', description: 'light snow', icon: '13d' },
    14: { main: 'Snow', description: 'moderate snow', icon: '13d' },
    15: { main: 'Snow', description: 'heavy snow', icon: '13d' },
    16: { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
    17: { main: 'Thunderstorm', description: 'thunderstorm with hail', icon: '11d' },
    18: { main: 'Rain', description: 'light rain showers', icon: '09d' },
    19: { main: 'Rain', description: 'moderate rain showers', icon: '09d' },
    20: { main: 'Snow', description: 'light snow showers', icon: '13d' },
    21: { main: 'Snow', description: 'moderate snow showers', icon: '13d' },
    22: { main: 'Drizzle', description: 'light drizzle', icon: '09d' },
    23: { main: 'Rain', description: 'light rain', icon: '10d' },
    24: { main: 'Rain', description: 'moderate rain', icon: '10d' },
    25: { main: 'Snow', description: 'light snow', icon: '13d' },
    26: { main: 'Snow', description: 'moderate snow', icon: '13d' },
    27: { main: 'Fog', description: 'fog', icon: '50d' },
    28: { main: 'Clouds', description: 'overcast', icon: '04d' },
    29: { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
  };

  const mapped = weatherMap[code] || { main: 'Clear', description: 'clear sky', icon: '01d' };
  return { id: code, ...mapped };
}

// Transform meteoblue response to our WeatherData format
// Response structure: { metadata, units, data_1h: { time[], temperature[], windspeed[], ... } }
function transformMeteoBlueResponse(any: any, lat: number, lon: number): WeatherData {
  const now = Math.floor(Date.now() / 1000);
  const then = new Date();

  // Data is in data_1h object with direct arrays (not .val)
  const data1h = any?.data_1h || {};
  const temperature = data1h.temperature || [];
  const precipitation = data1h.precipitation || [];
  const precipitationProb = data1h.precipitation_probability || [];
  const windspeed = data1h.windspeed || [];
  const winddirection = data1h.winddirection || [];
  const sealevelpressure = data1h.sealevelpressure || [];
  const relativehumidity = data1h.relativehumidity || [];
  const uvindex = data1h.uvindex || [];
  const felttemperature = data1h.felttemperature || [];
  const pictocode = data1h.pictocode || [];
  const isdaylight = data1h.isdaylight || [];

  const timeStrings = data1h.time || [];
  const timezone = any?.metadata?.timezone_abbrevation || 'UTC';
  const utcOffset = any?.metadata?.utc_timeoffset || 0;
  const timezoneOffset = -utcOffset * 60; // Convert hours to minutes, negate for JS

  const getTimestamp = (timeStr: string): number => {
    if (!timeStr) return now;
    const [dateStr, hourStr] = timeStr.split(' ');
    const date = new Date(dateStr);
    const hour = parseInt(hourStr.substring(0, 2), 10);
    date.setUTCHours(hour, 0, 0, 0);
    return Math.floor(date.getTime() / 1000);
  };

  const timestamps = timeStrings.map(getTimestamp);

  // Find current hour index
  let currentIdx = timestamps.findIndex((t: number) => Math.abs(t - now) < 1800);
  if (currentIdx < 0) currentIdx = timestamps.findIndex((t: number) => t > now) || 0;

  const current: CurrentWeather = {
    dt: timestamps[currentIdx] || now,
    temp: temperature[currentIdx] || 0,
    feels_like: felttemperature[currentIdx] || 0,
    pressure: sealevelpressure[currentIdx] || 1013,
    humidity: relativehumidity[currentIdx] || 50,
    uvi: uvindex[currentIdx] || 0,
    clouds: 0, // Not provided in basic-1h
    wind_speed: windspeed[currentIdx] || 0, // Already in m/s
    wind_deg: winddirection[currentIdx] || 0,
    weather: [transformPictocode(pictocode[currentIdx] || 10)],
  };

  // Hourly forecast - next 24 hours (every 3 hours)
  const hourly: HourlyForecast[] = [];
  const baseIdx = currentIdx + 1;

  for (let i = 0; i < 24; i++) {
    const idx = baseIdx + i;
    if (idx < timestamps.length) {
      const precipAmount = precipitation[idx] || 0;
      hourly.push({
        dt: timestamps[idx],
        temp: temperature[idx] || 0,
        feels_like: felttemperature[idx] || 0,
        pressure: sealevelpressure[idx] || 1013,
        humidity: relativehumidity[idx] || 50,
        wind_speed: windspeed[idx] || 0,
        wind_deg: winddirection[idx] || 0,
        weather: [transformPictocode(pictocode[idx] || 10)],
        pop: (precipitationProb[idx] || 0) / 100, // Convert 0-100 to 0-1
        rain: precipAmount > 0 ? { '1h': precipAmount } : undefined,
      });
    }
  }

  // Daily forecast - aggregate by day
  const daily: DailyForecast[] = [];
  const daysMap = new Map<number, number[]>();

  timestamps.forEach((ts: number, idx: number) => {
    const dayStart = Math.floor(ts / 86400) * 86400;
    if (!daysMap.has(dayStart)) {
      daysMap.set(dayStart, []);
    }
    daysMap.get(dayStart)!.push(idx);
  });

  let dayCount = 0;
  for (const [dayStart, indices] of daysMap) {
    if (dayCount >= 7) break;

    const dayTemps = indices.map(i => temperature[i]).filter(t => t !== undefined);
    const dayPrecip = indices.reduce((sum, i) => sum + (precipitation[i] || 0), 0);
    const dayPrecipProb = Math.max(...indices.map(i => precipitationProb[i] || 0));

    if (dayTemps.length === 0) continue;

    daily.push({
      dt: dayStart,
      temp: {
        day: dayTemps.reduce((a, b) => a + b, 0) / dayTemps.length,
        min: Math.min(...dayTemps),
        max: Math.max(...dayTemps),
        night: dayTemps[Math.floor(dayTemps.length / 2)] || dayTemps[0],
        eve: dayTemps[Math.floor(dayTemps.length * 0.7)] || dayTemps[dayTemps.length - 1],
        morn: dayTemps[Math.floor(dayTemps.length * 0.2)] || dayTemps[0],
      },
      humidity: Math.round(indices.reduce((sum, i) => sum + relativehumidity[i], 0) / indices.length),
      wind_speed: Math.max(...indices.map(i => windspeed[i] || 0)),
      pop: dayPrecipProb / 100,
      rain: dayPrecip > 0 ? dayPrecip : undefined,
      weather: [transformPictocode(pictocode[indices[0]] || 10)],
    });

    dayCount++;
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
    const url = `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];
    const resultsArray = Array.isArray(results) ? results : [results];

    return resultsArray.map(transformGeocodingResult);
  } catch (error) {
    console.error('Failed to fetch geocoding:', error);
    return [];
  }
}

export async function fetchReverseGeocoding(
  lat: number,
  lon: number
): Promise<GeocodingResult | null> {

  try {
    const url =
      `https://api.bigdatacloud.net/data/reverse-geocode-client` +
      `?latitude=${lat}` +
      `&longitude=${lon}` +
      `&localityLanguage=en`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Reverse geocoding API error: ${response.status} ${response.statusText}`
      );
    }

    const data =
      (await response.json()) as BigDataCloudReverseGeocodingResponse;

    return {
      name: data.city || data.locality || "Unknown location",
      lat: data.latitude,
      lon: data.longitude,
      country: data.countryName || "",
      state: data.principalSubdivision || "",
    };
  } catch (error) {
    console.error("Failed to fetch reverse geocoding:", error);
    return null;
  }
}

export async function fetchHistoricalData(location: AppLocation): Promise<HistoricalData | null> {
  try {
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