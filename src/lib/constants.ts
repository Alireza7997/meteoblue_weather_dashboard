export const LAYER_CONFIG = {
  temperature: {
    label: 'Temperature',
    unit: '°C',
    icon: '🌡',
    colors: [
      { value: -20, color: '#0d1b7a' },
      { value: -10, color: '#1e3df5' },
      { value: 0, color: '#00b4d8' },
      { value: 10, color: '#90e0ef' },
      { value: 20, color: '#ffd60a' },
      { value: 30, color: '#ff9f1c' },
      { value: 40, color: '#ff4b2b' },
      { value: 50, color: '#b8001f' },
    ],
    min: -20,
    max: 50,
  },
  precipitation: {
    label: 'Precipitation',
    unit: 'mm/h',
    icon: '🌧',
    colors: [
      { value: 0, color: '#f0f9ff' },
      { value: 0.5, color: '#bae6fd' },
      { value: 1, color: '#7dd3fc' },
      { value: 2.5, color: '#38bdf8' },
      { value: 5, color: '#0ea5e9' },
      { value: 10, color: '#0284c7' },
      { value: 25, color: '#0369a1' },
      { value: 50, color: '#075985' },
    ],
    min: 0,
    max: 50,
  },
  wind: {
    label: 'Wind Speed',
    unit: 'km/h',
    icon: '💨',
    colors: [
      { value: 0, color: '#f8fafc' },
      { value: 5, color: '#e0f2fe' },
      { value: 15, color: '#bae6fd' },
      { value: 30, color: '#7dd3fc' },
      { value: 50, color: '#38bdf8' },
      { value: 75, color: '#0ea5e9' },
      { value: 100, color: '#0284c7' },
      { value: 150, color: '#0369a1' },
    ],
    min: 0,
    max: 150,
  },
  humidity: {
    label: 'Humidity',
    unit: '%',
    icon: '💧',
    colors: [
      { value: 0, color: '#fef3c7' },
      { value: 20, color: '#fde68a' },
      { value: 40, color: '#fcd34d' },
      { value: 60, color: '#fbbf24' },
      { value: 70, color: '#f59e0b' },
      { value: 80, color: '#d97706' },
      { value: 90, color: '#b45309' },
      { value: 100, color: '#92400e' },
    ],
    min: 0,
    max: 100,
  },
  clouds: {
    label: 'Cloud Coverage',
    unit: '%',
    icon: '☁',
    colors: [
      { value: 0, color: '#1e3a8a' },
      { value: 10, color: '#1e40af' },
      { value: 25, color: '#2563eb' },
      { value: 50, color: '#3b82f6' },
      { value: 75, color: '#60a5fa' },
      { value: 90, color: '#93c5fd' },
      { value: 100, color: '#dbeafe' },
    ],
    min: 0,
    max: 100,
  },
  uv: {
    label: 'UV Index',
    unit: '',
    icon: '🔆',
    colors: [
      { value: 0, color: '#22c55e' },
      { value: 2, color: '#84cc16' },
      { value: 5, color: '#eab308' },
      { value: 7, color: '#f97316' },
      { value: 10, color: '#ef4444' },
      { value: 11, color: '#a855f7' },
    ],
    min: 0,
    max: 11,
  },
} as const;

export const MAP_STYLE = {
  version: 8,
  sources: {
    'osm': {
      type: 'raster',
      tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'osm-layer',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

import type { AppLocation } from './types';

export const DEFAULT_LOCATION: AppLocation = {
  latitude: 51.5074,
  longitude: -0.1278,
  name: 'London',
  country: 'GB',
};

export const WEATHER_ICONS: Record<string, string> = {
  '01d': '☀️',
  '01n': '🌙',
  '02d': '🌤️',
  '02n': '☁️',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '🌧️',
  '09n': '🌧️',
  '10d': '🌦️',
  '10n': '🌧️',
  '11d': '⛈️',
  '11n': '⛈️',
  '13d': '❄️',
  '13n': '❄️',
  '50d': '🌫️',
  '50n': '🌫️',
};

export const WIND_DIRECTIONS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

export function getWindDirection(degrees: number): string {
  const index = Math.round(degrees / 22.5) % 16;
  return WIND_DIRECTIONS[index];
}

export function interpolateColor(
  value: number,
  colorStops: { value: number; color: string }[],
  min: number,
  max: number
): string {
  const clampedValue = Math.max(min, Math.min(max, value));

  for (let i = 0; i < colorStops.length - 1; i++) {
    const stop1 = colorStops[i];
    const stop2 = colorStops[i + 1];

    if (clampedValue >= stop1.value && clampedValue <= stop2.value) {
      const ratio = (clampedValue - stop1.value) / (stop2.value - stop1.value);
      return lerpColor(stop1.color, stop2.color, ratio);
    }
  }

  return colorStops[colorStops.length - 1].color;
}

function lerpColor(color1: string, color2: string, ratio: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.slice(0, 2), 16);
  const g1 = parseInt(hex1.slice(2, 4), 16);
  const b1 = parseInt(hex1.slice(4, 6), 16);

  const r2 = parseInt(hex2.slice(0, 2), 16);
  const g2 = parseInt(hex2.slice(2, 4), 16);
  const b2 = parseInt(hex2.slice(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export const MOCK_HISTORICAL_DATA: Record<string, { temp_avg: number; temp_max_avg: number; temp_min_avg: number; precipitation_avg: number; rainy_days: number; hottest_day: number; coldest_day: number }> = {
  'london,gb': { temp_avg: 11.2, temp_max_avg: 15.1, temp_min_avg: 7.3, precipitation_avg: 583, rainy_days: 156, hottest_day: 38.7, coldest_day: -16.1 },
  'paris,fr': { temp_avg: 12.5, temp_max_avg: 16.8, temp_min_avg: 8.2, precipitation_avg: 637, rainy_days: 148, hottest_day: 42.6, coldest_day: -14.8 },
  'berlin,de': { temp_avg: 9.9, temp_max_avg: 14.2, temp_min_avg: 5.6, precipitation_avg: 570, rainy_days: 142, hottest_day: 38.9, coldest_day: -18.2 },
  'tokyo,jp': { temp_avg: 16.1, temp_max_avg: 20.4, temp_min_avg: 11.8, precipitation_avg: 1528, rainy_days: 124, hottest_day: 39.5, coldest_day: -5.1 },
  'new york,us': { temp_avg: 12.9, temp_max_avg: 17.6, temp_min_avg: 8.2, precipitation_avg: 1267, rainy_days: 122, hottest_day: 41.1, coldest_day: -20.5 },
  'sydney,au': { temp_avg: 19.5, temp_max_avg: 22.8, temp_min_avg: 16.2, precipitation_avg: 1213, rainy_days: 138, hottest_day: 47.3, coldest_day: 2.1 },
  'dubai,ae': { temp_avg: 27.6, temp_max_avg: 33.9, temp_min_avg: 21.3, precipitation_avg: 94, rainy_days: 25, hottest_day: 49.0, coldest_day: 7.2 },
  'singapore,sg': { temp_avg: 27.4, temp_max_avg: 31.3, temp_min_avg: 23.5, precipitation_avg: 2340, rainy_days: 178, hottest_day: 36.0, coldest_day: 19.4 },
};

export function getMockHistoricalData(location: AppLocation) {
  const key = `${location.name.toLowerCase()},${location.country?.toLowerCase()}`;
  return MOCK_HISTORICAL_DATA[key] || MOCK_HISTORICAL_DATA['london,gb'];
}