'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useWeatherStore } from '@/lib/store';
import { translateCountry, useLocaleStore } from '@/lib/i18n';
import type { CityInfo } from '@/lib/cities';

export function CityDashboardClient({ city }: { city: CityInfo }) {
  const setSelectedLocation = useWeatherStore((s) => s.setSelectedLocation);
  const locale = useLocaleStore((s) => s.locale);

  // City pages know both names, so the header follows the active locale.
  useEffect(() => {
    setSelectedLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      name: locale === 'fa' ? city.nameFa : city.name,
      country: translateCountry(city.country, locale),
      state: locale === 'fa' ? city.provinceFa : city.province,
      localNames: { en: city.name, fa: city.nameFa },
    });
  }, [city, locale, setSelectedLocation]);

  return <DashboardLayout />;
}
