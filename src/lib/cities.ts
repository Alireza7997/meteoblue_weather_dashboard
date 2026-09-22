import type { AppLocation } from './types';

export interface CityInfo extends AppLocation {
  slug: string;
  nameFa: string;
  provinceFa: string;
  province: string;
}

/**
 * Major Iranian cities with stable latin slugs for /weather/[city] routes.
 * Each route renders Persian-first metadata targeting «هواشناسی [شهر]»
 * and «گزارش آب و هوای [شهر]».
 */
export const CITIES: CityInfo[] = [
  { slug: 'tehran', name: 'Tehran', nameFa: 'تهران', province: 'Tehran', provinceFa: 'تهران', country: 'Iran', latitude: 35.6892, longitude: 51.389 },
  { slug: 'mashhad', name: 'Mashhad', nameFa: 'مشهد', province: 'Razavi Khorasan', provinceFa: 'خراسان رضوی', country: 'Iran', latitude: 36.2605, longitude: 59.6168 },
  { slug: 'isfahan', name: 'Isfahan', nameFa: 'اصفهان', province: 'Isfahan', provinceFa: 'اصفهان', country: 'Iran', latitude: 32.6546, longitude: 51.668 },
  { slug: 'karaj', name: 'Karaj', nameFa: 'کرج', province: 'Alborz', provinceFa: 'البرز', country: 'Iran', latitude: 35.8407, longitude: 50.9391 },
  { slug: 'shiraz', name: 'Shiraz', nameFa: 'شیراز', province: 'Fars', provinceFa: 'فارس', country: 'Iran', latitude: 29.5918, longitude: 52.5837 },
  { slug: 'tabriz', name: 'Tabriz', nameFa: 'تبریز', province: 'East Azerbaijan', provinceFa: 'آذربایجان شرقی', country: 'Iran', latitude: 38.0962, longitude: 46.2738 },
  { slug: 'qom', name: 'Qom', nameFa: 'قم', province: 'Qom', provinceFa: 'قم', country: 'Iran', latitude: 34.6399, longitude: 50.8759 },
  { slug: 'ahvaz', name: 'Ahvaz', nameFa: 'اهواز', province: 'Khuzestan', provinceFa: 'خوزستان', country: 'Iran', latitude: 31.3183, longitude: 48.6706 },
  { slug: 'kermanshah', name: 'Kermanshah', nameFa: 'کرمانشاه', province: 'Kermanshah', provinceFa: 'کرمانشاه', country: 'Iran', latitude: 34.3142, longitude: 47.065 },
  { slug: 'urmia', name: 'Urmia', nameFa: 'ارومیه', province: 'West Azerbaijan', provinceFa: 'آذربایجان غربی', country: 'Iran', latitude: 37.5527, longitude: 45.076 },
  { slug: 'rasht', name: 'Rasht', nameFa: 'رشت', province: 'Gilan', provinceFa: 'گیلان', country: 'Iran', latitude: 37.2711, longitude: 49.5924 },
  { slug: 'kerman', name: 'Kerman', nameFa: 'کرمان', province: 'Kerman', provinceFa: 'کرمان', country: 'Iran', latitude: 30.2839, longitude: 57.0788 },
  { slug: 'yazd', name: 'Yazd', nameFa: 'یزد', province: 'Yazd', provinceFa: 'یزد', country: 'Iran', latitude: 31.8974, longitude: 54.3569 },
  { slug: 'bandar-abbas', name: 'Bandar Abbas', nameFa: 'بندرعباس', province: 'Hormozgan', provinceFa: 'هرمزگان', country: 'Iran', latitude: 27.1832, longitude: 56.2666 },
  { slug: 'arak', name: 'Arak', nameFa: 'اراک', province: 'Markazi', provinceFa: 'مرکزی', country: 'Iran', latitude: 34.0955, longitude: 49.7022 },
  { slug: 'ardabil', name: 'Ardabil', nameFa: 'اردبیل', province: 'Ardabil', provinceFa: 'اردبیل', country: 'Iran', latitude: 38.2433, longitude: 48.2978 },
  { slug: 'zanjan', name: 'Zanjan', nameFa: 'زنجان', province: 'Zanjan', provinceFa: 'زنجان', country: 'Iran', latitude: 36.6736, longitude: 48.4787 },
  { slug: 'sanandaj', name: 'Sanandaj', nameFa: 'سنندج', province: 'Kurdistan', provinceFa: 'کردستان', country: 'Iran', latitude: 35.3113, longitude: 46.9965 },
  { slug: 'khorramabad', name: 'Khorramabad', nameFa: 'خرم‌آباد', province: 'Lorestan', provinceFa: 'لرستان', country: 'Iran', latitude: 33.4878, longitude: 48.3558 },
  { slug: 'gorgan', name: 'Gorgan', nameFa: 'گرگان', province: 'Golestan', provinceFa: 'گلستان', country: 'Iran', latitude: 36.8417, longitude: 54.4347 },
  { slug: 'sari', name: 'Sari', nameFa: 'ساری', province: 'Mazandaran', provinceFa: 'مازندران', country: 'Iran', latitude: 36.5633, longitude: 53.0601 },
  { slug: 'babol', name: 'Babol', nameFa: 'بابل', province: 'Mazandaran', provinceFa: 'مازندران', country: 'Iran', latitude: 36.5513, longitude: 52.6789 },
  { slug: 'amol', name: 'Amol', nameFa: 'آمل', province: 'Mazandaran', provinceFa: 'مازندران', country: 'Iran', latitude: 36.4696, longitude: 52.3507 },
  { slug: 'dezful', name: 'Dezful', nameFa: 'دزفول', province: 'Khuzestan', provinceFa: 'خوزستان', country: 'Iran', latitude: 32.3879, longitude: 48.4581 },
  { slug: 'nishapur', name: 'Nishapur', nameFa: 'نیشابور', province: 'Razavi Khorasan', provinceFa: 'خراسان رضوی', country: 'Iran', latitude: 36.2133, longitude: 58.7958 },
  { slug: 'kashan', name: 'Kashan', nameFa: 'کاشان', province: 'Isfahan', provinceFa: 'اصفهان', country: 'Iran', latitude: 33.9873, longitude: 51.433 },
  { slug: 'qazvin', name: 'Qazvin', nameFa: 'قزوین', province: 'Qazvin', provinceFa: 'قزوین', country: 'Iran', latitude: 36.2688, longitude: 50.0041 },
  { slug: 'hamedan', name: 'Hamedan', nameFa: 'همدان', province: 'Hamedan', provinceFa: 'همدان', country: 'Iran', latitude: 34.7983, longitude: 48.5146 },
  { slug: 'zahedan', name: 'Zahedan', nameFa: 'زاهدان', province: 'Sistan and Baluchestan', provinceFa: 'سیستان و بلوچستان', country: 'Iran', latitude: 29.4519, longitude: 60.8845 },
  { slug: 'ilam', name: 'Ilam', nameFa: 'ایلام', province: 'Ilam', provinceFa: 'ایلام', country: 'Iran', latitude: 33.6374, longitude: 46.4227 },
  { slug: 'bushehr', name: 'Bushehr', nameFa: 'بوشهر', province: 'Bushehr', provinceFa: 'بوشهر', country: 'Iran', latitude: 28.9234, longitude: 50.8203 },
  { slug: 'birjand', name: 'Birjand', nameFa: 'بیرجند', province: 'South Khorasan', provinceFa: 'خراسان جنوبی', country: 'Iran', latitude: 32.8649, longitude: 59.2264 },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

export function getCityBySlug(slug: string): CityInfo | undefined {
  return CITIES.find((c) => c.slug === slug.toLowerCase());
}

/** Persian-first SEO strings for a city page. */
export function getCitySeo(city: CityInfo) {
  const title = `هواشناسی ${city.nameFa} | گزارش آب و هوا و پیش‌بینی دقیق ${city.nameFa}`;
  const description =
    `هواشناسی ${city.nameFa} (${city.provinceFa}): گزارش آب و هوای امروز و فردای ${city.nameFa}، پیش‌بینی ساعتی و ۷ روزه دما، بارش، باد، رطوبت و شاخص UV. دقیق‌ترین گزارش آب و هوای ${city.nameFa} را اینجا ببینید.`;
  const keywords = [
    `هواشناسی ${city.nameFa}`,
    `هواشناسی ${city.nameFa} امروز`,
    `هواشناسی ${city.nameFa} فردا`,
    `گزارش آب و هوای ${city.nameFa}`,
    `وضعیت آب و هوای ${city.nameFa}`,
    `پیش بینی آب و هوای ${city.nameFa}`,
    `پیش‌بینی آب و هوای ${city.nameFa}`,
    `آب و هوای ${city.nameFa}`,
    `هوای ${city.nameFa}`,
    `${city.name} weather`,
    `${city.name} weather forecast`,
    'هواشناسی',
    'گزارش آب و هوا',
  ];
  return { title, description, keywords };
}
