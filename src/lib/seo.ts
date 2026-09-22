/**
 * Central SEO configuration.
 *
 * Brand name is "Weather Forecast" (English). SEO is Persian-first so the
 * site ranks for: هواشناسی، گزارش آب و هوا، هواشناسی [شهر].
 *
 * Set NEXT_PUBLIC_SITE_URL to the production origin
 * (e.g. https://weather.example.com) so canonical URLs, Open Graph tags,
 * the sitemap and robots.txt all point at the real domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://weather-iran.example.com'
).replace(/\/+$/, '');

export const SITE_NAME = 'Weather Forecast';
export const SITE_NAME_FA = 'هواشناسی';

export const SITE_DESCRIPTION =
  'هواشناسی دقیق و گزارش آب و هوا: پیش‌بینی ساعتی و ۷ روزه دما، بارش، باد و رطوبت برای تهران و همه شهرهای ایران. Weather Forecast with hourly & 7-day forecasts, interactive maps and analytics.';

export const SITE_KEYWORDS = [
  // Primary Persian targets (highest priority)
  'هواشناسی',
  'گزارش آب و هوا',
  'پیش بینی آب و هوا',
  'پیش‌بینی آب و هوا',
  'پیش‌بینی آب‌وهوا',
  'وضعیت آب و هوا',
  'آب و هوای امروز',
  'آب و هوای فردا',
  // Persian city targets — هواشناسی [شهر]
  'هواشناسی تهران',
  'هواشناسی مشهد',
  'هواشناسی اصفهان',
  'هواشناسی شیراز',
  'هواشناسی تبریز',
  'هواشناسی کرج',
  'هواشناسی قم',
  'هواشناسی اهواز',
  'هواشناسی کرمانشاه',
  'هواشناسی ارومیه',
  'هواشناسی رشت',
  'هواشناسی کرمان',
  'هواشناسی یزد',
  'هواشناسی بندرعباس',
  'گزارش آب و هوای تهران',
  'گزارش آب و هوای مشهد',
  'گزارش آب و هوای اصفهان',
  'گزارش آب و هوای شیراز',
  'هوای تهران',
  'هوای مشهد',
  'هوای اصفهان',
  'هوای شیراز',
  'هوای تبریز',
  // English (secondary)
  'Weather Forecast',
  'Iran weather',
  'Tehran weather',
  'hourly weather forecast',
  '7-day weather forecast',
];
