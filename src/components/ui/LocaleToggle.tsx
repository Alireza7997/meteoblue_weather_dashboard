'use client';

import { Languages } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import type { Locale } from '@/lib/i18n';

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  const toggle = () => {
    const next: Locale = locale === 'en' ? 'fa' : 'en';
    setLocale(next);
  };

  return (
    <button
      onClick={toggle}
      className="btn-icon"
      title={locale === 'en' ? 'فارسی' : 'English'}
      aria-label={locale === 'en' ? 'تغییر زبان به فارسی' : 'Switch language to English'}
    >
      <Languages className="w-5 h-5" />
    </button>
  );
}
