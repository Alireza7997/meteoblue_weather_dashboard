import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { CITIES } from '@/lib/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          fa: `${SITE_URL}/?lang=fa`,
          en: `${SITE_URL}/?lang=en`,
        },
      },
    },
    ...CITIES.map((city) => ({
      url: `${SITE_URL}/weather/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
      alternates: {
        languages: {
          fa: `${SITE_URL}/weather/${city.slug}?lang=fa`,
          en: `${SITE_URL}/weather/${city.slug}?lang=en`,
        },
      },
    })),
  ];
}
