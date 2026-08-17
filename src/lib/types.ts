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
  temp: number;
  pressure: number;
  humidity: number;
  uvi: number;
  clouds: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
  // Fields NOT available in basic-1h, optional
  feels_like?: number;
  dew_point?: number;
  visibility?: number;
  wind_gust?: number;
  sunrise?: number;
  sunset?: number;
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
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
  // Fields NOT available in basic-1h, optional
  feels_like?: number;
  dew_point?: number;
  uvi?: number;
  clouds?: number;
  visibility?: number;
  wind_gust?: number;
  pop?: number;
  rain?: { '1h': number };
  snow?: { '1h': number };
}

export interface DailyForecast {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  weather: WeatherCondition[];
  // Fields NOT available in basic-1h, optional
  sunrise?: number;
  sunset?: number;
  moonrise?: number;
  moonset?: number;
  moon_phase?: number;
  summary?: string;
  feels_like?: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure?: number;
  humidity?: number;
  dew_point?: number;
  wind_speed?: number;
  wind_deg?: number;
  wind_gust?: number;
  clouds?: number;
  pop?: number;
  rain?: number;
  snow?: number;
  uvi?: number;
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

export interface BigDataCloudReverseGeocodingResponse {
  latitude: number;
  longitude: number;
  countryName: string;
  countryCode: string;
  principalSubdivision: string;
  principalSubdivisionCode: string;
  city: string;
  locality: string;
  postcode: string;
  plusCode: string;
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
