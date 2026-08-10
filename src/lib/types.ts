export interface AppLocation {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
  state?: string;
  localNames?: Record<string, string>;
}

export type Location = AppLocation;

export interface CurrentWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  pop: number;
  rain?: { '1h': number };
  snow?: { '1h': number };
}

export interface DailyForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
}

export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type WeatherMapLayer =
  | 'temperature'
  | 'precipitation'
  | 'wind'
  | 'humidity'
  | 'clouds'
  | 'uv';

export interface WeatherState {
  selectedLocation: AppLocation | null;
  selectedDate: string;
  selectedHour: number;
  mapLayer: WeatherMapLayer;
  isLoading: boolean;
  error: string | null;
}

export interface WeatherMapPoint {
  lat: number;
  lon: number;
  value: number;
  [key: string]: unknown;
}

export interface HistoricalData {
  location: AppLocation;
  averages: {
    temp_avg: number;
    temp_max_avg: number;
    temp_min_avg: number;
    precipitation_avg: number;
    rainy_days: number;
    hottest_day: number;
    coldest_day: number;
  };
  currentYear: {
    temp: number;
    precipitation: number;
  };
}