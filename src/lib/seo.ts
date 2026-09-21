/**
 * Central SEO configuration.
 *
 * Set NEXT_PUBLIC_SITE_URL to the production origin
 * (e.g. https://weather.example.com) so canonical URLs, Open Graph tags,
 * the sitemap and robots.txt all point at the real domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://weather-iran.example.com'
).replace(/\/+$/, '');

export const SITE_NAME = 'Iran Weather Forecast';
export const SITE_NAME_FA = 'پیش‌بینی آب‌وهوای ایران';

export const SITE_DESCRIPTION =
  'Live weather forecast for Iran: Tehran, Mashhad, Isfahan, Shiraz, Tabriz and more. Hourly and 7-day forecasts, interactive maps and analytics. پیش‌بینی زنده آب‌وهوای ایران.';

export const SITE_KEYWORDS = [
  // English
  'Iran weather forecast',
  'weather in Iran',
  'Iran weather',
  'Tehran weather',
  'Tehran weather forecast',
  'Mashhad weather',
  'Isfahan weather',
  'Shiraz weather',
  'Tabriz weather',
  'Karaj weather',
  'hourly weather forecast',
  '7-day weather forecast',
  'weather map Iran',
  // Persian (Farsi)
  'هواشناسی ایران',
  'پیش بینی آب و هوا',
  'پیش‌بینی آب‌وهوای ایران',
  'هوای تهران',
  'وضعیت آب و هوای تهران',
  'هواشناسی تهران',
  'هوای مشهد',
  'هوای اصفهان',
  'هوای شیراز',
  'هوای تبریز',
];
