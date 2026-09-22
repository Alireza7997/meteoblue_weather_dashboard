import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CITIES, getCityBySlug, getCitySeo } from '@/lib/cities';
import { SITE_URL } from '@/lib/seo';
import { CityDashboardClient } from './CityDashboardClient';
import { CitySeoContent } from '@/components/seo/CitySeoContent';

type Params = { city: string };

export function generateStaticParams(): Params[] {
  return CITIES.map((c) => ({ city: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return { title: 'هواشناسی | Weather Forecast' };

  const { title, description, keywords } = getCitySeo(city);
  const url = `/weather/${city.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        fa: `${url}?lang=fa`,
        en: `${url}?lang=en`,
      },
    },
    openGraph: {
      title: `${title} | Weather Forecast`,
      description,
      url,
      locale: 'fa_IR',
      alternateLocale: ['en_US'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Weather Forecast`,
      description,
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const { title, description } = getCitySeo(city);
  const url = `${SITE_URL}/weather/${city.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WeatherForecast',
    name: `هواشناسی ${city.nameFa}`,
    alternateName: `${city.name} weather forecast`,
    description,
    url,
    inLanguage: ['fa', 'en'],
    spatialCoverage: {
      '@type': 'City',
      name: city.nameFa,
      alternateName: city.name,
      containedInPlace: { '@type': 'Country', name: 'Iran' },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: city.latitude,
        longitude: city.longitude,
      },
    },
  };

  return (
    <>
      <h1 className="sr-only">{title} | Weather Forecast</h1>
      <CityDashboardClient city={city} />
      <CitySeoContent city={city} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
