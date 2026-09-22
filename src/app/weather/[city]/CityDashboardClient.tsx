'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useWeatherStore } from '@/lib/store';
import type { CityInfo } from '@/lib/cities';

export function CityDashboardClient({ city }: { city: CityInfo }) {
  const setSelectedLocation = useWeatherStore((s) => s.setSelectedLocation);

  useEffect(() => {
    setSelectedLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      country: city.country,
      state: city.province,
      localNames: { fa: city.nameFa },
    });
  }, [city, setSelectedLocation]);

  return <DashboardLayout />;
}
