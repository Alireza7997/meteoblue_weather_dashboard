import { create } from 'zustand';
import type { WeatherMapLayer } from './types';

export type Locale = 'en' | 'fa';

export const LOCALES: Locale[] = ['en', 'fa'];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'weather-locale';

export function normalizeLocale(value: unknown): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
}

export function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    return normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return DEFAULT_LOCALE;
  }
}

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()((set) => ({
  locale: DEFAULT_LOCALE,
  setLocale: (locale) => {
    const next = normalizeLocale(locale);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable
    }
    set({ locale: next });
  },
}));

const en = {
  app: {
    title: 'Advanced Weather Analytics',
  },
  search: {
    placeholder: 'Search for a city, landmark, or address...',
    ariaLabel: 'Search location',
    clear: 'Clear search',
    searching: 'Searching...',
  },
  actions: {
    openMap: 'Open map',
    useCurrentLocation: 'Use current location',
    retry: 'Retry',
    closeMap: 'Close map',
  },
  dashboard: {
    selectLocationTitle: 'Select a Location',
    selectLocationDesc:
      'Search for a city, click the map button, or use your current location to begin exploring weather analytics.',
    loadingWeather: 'Loading weather data...',
    currentLocation: 'Current Location',
  },
  map: {
    title: 'Weather Map',
    loading: 'Loading weather map...',
    selectedCoordinates: 'Selected Coordinates',
    lat: 'Lat',
    lng: 'Lng',
    resolving: 'Resolving location...',
    selectedLocationFallback: 'Selected Location',
  },
  layers: {
    temperature: 'Temperature',
    precipitation: 'Precipitation',
    wind: 'Wind Speed',
    humidity: 'Humidity',
    clouds: 'Cloud Coverage',
    uv: 'UV Index',
  } as Record<WeatherMapLayer, string>,
  layerOptions: {
    temperature: '🌡 Temperature',
    precipitation: '🌧 Precipitation',
    wind: '💨 Wind',
    humidity: '💧 Humidity',
    clouds: '☁ Clouds',
    uv: '🔆 UV Index',
  } as Record<WeatherMapLayer, string>,
  stats: {
    humidity: 'Humidity',
    wind: 'Wind',
    pressure: 'Pressure',
    clouds: 'Clouds',
    uv: 'UV Index',
  },
  units: {
    kmh: 'km/h',
  },
  uv: {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
  },
  hourly: {
    title: 'Hourly Forecast',
    next24: 'Next 24 hours',
    selected: 'Selected',
    now: 'Now',
  },
  daily: {
    title: '7-Day Forecast',
    today: 'Today',
    tomorrow: 'Tomorrow',
  },
  timeline: {
    title: 'Forecast Timeline',
    now: 'NOW',
  },
  insights: {
    title: 'Weather Insights',
    noData: 'No forecast data available',
    rainLikely: 'Rain likely throughout the day',
    tempVary: 'Temperature will vary by {value}°C',
    strongWind: 'Strong winds ({speed} km/h) expected around {time}',
    uvLow: 'Low UV - minimal sun protection needed',
    tempDrop: 'Temperature will drop {value}°C tomorrow',
    tempRise: 'Temperature will rise {value}°C tomorrow',
    noChange: 'No significant weather changes expected',
  },
  charts: {
    title: 'Analytics',
    tempTitle: 'Temperature',
    tempSub: 'Hourly & Daily',
    precipTitle: 'Precipitation',
    precipSub: 'Probability & Amount',
    windTitle: 'Wind',
    windSub: 'Speed & Gusts',
    hpTitle: 'Humidity & Pressure',
    hpSub: 'Trends',
    dailyTitle: 'Daily High/Low',
    dailySub: '7-Day Outlook',
    series: {
      temperature: 'Temperature',
      probability: 'Probability',
      amount: 'Amount (mm)',
      speed: 'Speed',
      gusts: 'Gusts',
      humidity: 'Humidity',
      pressure: 'Pressure',
      high: 'High',
      low: 'Low',
    },
  },
};

export type Messages = typeof en;

const fa: Messages = {
  app: {
    title: 'تحلیل پیشرفته آب‌وهوا',
  },
  search: {
    placeholder: 'جستجوی شهر، مکان یا آدرس...',
    ariaLabel: 'جستجوی مکان',
    clear: 'پاک کردن جستجو',
    searching: 'در حال جستجو...',
  },
  actions: {
    openMap: 'باز کردن نقشه',
    useCurrentLocation: 'استفاده از موقعیت فعلی',
    retry: 'تلاش مجدد',
    closeMap: 'بستن نقشه',
  },
  dashboard: {
    selectLocationTitle: 'انتخاب یک مکان',
    selectLocationDesc:
      'شهری را جستجو کنید، روی دکمه نقشه بزنید، یا از موقعیت فعلی خود برای شروع تحلیل آب‌وهوا استفاده کنید.',
    loadingWeather: 'در حال بارگذاری اطلاعات آب‌وهوا...',
    currentLocation: 'موقعیت فعلی',
  },
  map: {
    title: 'نقشه آب‌وهوا',
    loading: 'در حال بارگذاری نقشه آب‌وهوا...',
    selectedCoordinates: 'مختصات انتخاب‌شده',
    lat: 'عرض جغرافیایی',
    lng: 'طول جغرافیایی',
    resolving: 'در حال شناسایی موقعیت...',
    selectedLocationFallback: 'مکان انتخابی',
  },
  layers: {
    temperature: 'دما',
    precipitation: 'بارش',
    wind: 'سرعت باد',
    humidity: 'رطوبت',
    clouds: 'پوشش ابر',
    uv: 'شاخص UV',
  },
  layerOptions: {
    temperature: '🌡 دما',
    precipitation: '🌧 بارش',
    wind: '💨 باد',
    humidity: '💧 رطوبت',
    clouds: '☁ ابر',
    uv: '🔆 شاخص UV',
  },
  stats: {
    humidity: 'رطوبت',
    wind: 'باد',
    pressure: 'فشار',
    clouds: 'ابر',
    uv: 'شاخص UV',
  },
  units: {
    kmh: 'کیلومتر/ساعت',
  },
  uv: {
    low: 'کم',
    moderate: 'متوسط',
    high: 'زیاد',
  },
  hourly: {
    title: 'پیش‌بینی ساعتی',
    next24: '۲۴ ساعت آینده',
    selected: 'انتخاب‌شده',
    now: 'اکنون',
  },
  daily: {
    title: 'پیش‌بینی ۷ روزه',
    today: 'امروز',
    tomorrow: 'فردا',
  },
  timeline: {
    title: 'خط زمانی پیش‌بینی',
    now: 'اکنون',
  },
  insights: {
    title: 'نکات و هشدارهای هواشناسی',
    noData: 'اطلاعاتی برای پیش‌بینی در دسترس نیست',
    rainLikely: 'احتمال بارش باران در طول روز زیاد است',
    tempVary: 'دما به اندازه {value}°C تغییر خواهد کرد',
    strongWind: 'انتظار می‌رود بادهای شدید ({speed} کیلومتر بر ساعت) حدود ساعت {time} بوزد',
    uvLow: 'اشعه UV کم - محافظت خاصی لازم نیست',
    tempDrop: 'دما فردا {value}°C کاهش می‌یابد',
    tempRise: 'دما فردا {value}°C افزایش می‌یابد',
    noChange: 'تغییر قابل‌توجهی در آب‌وهوا انتظار نمی‌رود',
  },
  charts: {
    title: 'تحلیل‌ها',
    tempTitle: 'دما',
    tempSub: 'ساعتی و روزانه',
    precipTitle: 'بارش',
    precipSub: 'احتمال و مقدار',
    windTitle: 'باد',
    windSub: 'سرعت و وزش شدید',
    hpTitle: 'رطوبت و فشار',
    hpSub: 'روندها',
    dailyTitle: 'بیشینه/کمینه روزانه',
    dailySub: 'چشم‌انداز ۷ روزه',
    series: {
      temperature: 'دما',
      probability: 'احتمال',
      amount: 'مقدار (میلی‌متر)',
      speed: 'سرعت',
      gusts: 'وزش شدید',
      humidity: 'رطوبت',
      pressure: 'فشار',
      high: 'بیشینه',
      low: 'کمینه',
    },
  },
};

const dictionaries: Record<Locale, Messages> = { en, fa };

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale] ?? en;
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'fa' ? 'rtl' : 'ltr';
}

export function toIntlLocale(locale: Locale): string {
  return locale === 'fa' ? 'fa-IR' : 'en-US';
}

export function formatMessage(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template;
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}

const numberFormatters = new Map<string, Intl.NumberFormat>();

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  const intlLocale = toIntlLocale(locale);
  const cacheKey = `${intlLocale}:${JSON.stringify(options ?? {})}`;
  let formatter = numberFormatters.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat(intlLocale, options);
    numberFormatters.set(cacheKey, formatter);
  }
  return formatter.format(value);
}

const WEEKDAY_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function localizeDigits(str: string, locale: Locale): string {
  if (locale !== 'fa') return str;
  return str.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

export function formatLocaleTime(date: Date, locale: Locale): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const raw = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return localizeDigits(raw, locale);
}

export function formatLocaleDate(
  date: Date,
  locale: Locale,
  style: 'full' | 'weekday'
): string {
  const intlLocale = toIntlLocale(locale);
  if (locale === 'fa') {
    const formatter = style === 'full'
      ? new Intl.DateTimeFormat(intlLocale, { weekday: 'long', day: 'numeric', month: 'long' })
      : new Intl.DateTimeFormat(intlLocale, { weekday: 'short' });
    return formatter.format(date);
  }
  if (style === 'full') {
    return `${WEEKDAY_SHORT_EN[date.getDay()]}, ${MONTH_SHORT_EN[date.getMonth()]} ${date.getDate()}`;
  }
  return WEEKDAY_SHORT_EN[date.getDay()];
}

const WIND_DIRECTIONS_FA: Record<string, string> = {
  N: 'شمال',
  NNE: 'شمال‌شمال‌شرقی',
  NE: 'شمال‌شرقی',
  ENE: 'شرق‌شمال‌شرقی',
  E: 'شرق',
  ESE: 'شرق‌جنوب‌شرقی',
  SE: 'جنوب‌شرقی',
  SSE: 'جنوب‌جنوب‌شرقی',
  S: 'جنوب',
  SSW: 'جنوب‌جنوب‌غربی',
  SW: 'جنوب‌غربی',
  WSW: 'غرب‌جنوب‌غربی',
  W: 'غرب',
  WNW: 'غرب‌شمال‌غربی',
  NW: 'شمال‌غربی',
  NNW: 'شمال‌شمال‌غربی',
};

export function translateWindDirection(direction: string, locale: Locale): string {
  if (locale !== 'fa') return direction;
  return WIND_DIRECTIONS_FA[direction] ?? direction;
}

const CONDITIONS_FA: Record<string, string> = {
  'clear sky': 'آسمان صاف',
  'partly cloudy': 'نیمه‌ابری',
  cloudy: 'ابری',
  overcast: 'کاملاً ابری',
  fog: 'مه',
  'light drizzle': 'نم‌نم باران',
  drizzle: 'نم‌نم باران',
  'light rain': 'باران خفیف',
  'moderate rain': 'باران متوسط',
  'heavy rain': 'باران شدید',
  rain: 'باران',
  'light rain showers': 'رگبار خفیف باران',
  'moderate rain showers': 'رگبار متوسط باران',
  'light snow': 'برف خفیف',
  'moderate snow': 'برف متوسط',
  'heavy snow': 'برف شدید',
  'light snow showers': 'رگبار خفیف برف',
  'moderate snow showers': 'رگبار متوسط برف',
  thunderstorm: 'رعد و برق',
  'thunderstorm with hail': 'رعد و برق همراه با تگرگ',
  unknown: 'نامشخص',
};

export function translateCondition(description: string, locale: Locale): string {
  const key = description.trim().toLowerCase();
  if (locale === 'fa') {
    return CONDITIONS_FA[key] ?? description;
  }
  if (!description) return 'Unknown';
  return description.charAt(0).toUpperCase() + description.slice(1);
}
