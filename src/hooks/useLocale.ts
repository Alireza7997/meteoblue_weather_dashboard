'use client';

import { useEffect, useLayoutEffect } from 'react';
import {
  useLocaleStore,
  readStoredLocale,
  getDictionary,
  getDirection,
  toIntlLocale,
  formatMessage as baseFormatMessage,
  formatNumber as baseFormatNumber,
  formatLocaleDate as baseFormatLocaleDate,
  translateWindDirection as baseTranslateWindDirection,
  translateCondition as baseTranslateCondition,
  type Locale,
  type Messages,
} from '@/lib/i18n';

export interface UseLocaleReturn {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
  dir: 'rtl' | 'ltr';
  intlLocale: string;
  formatMessage: (template: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatLocaleDate: (date: Date, style: 'full' | 'weekday') => string;
  translateWindDirection: (direction: string) => string;
  translateCondition: (description: string) => string;
}

let storedLocaleRead = false;

export function useLocale(): UseLocaleReturn {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  useEffect(() => {
    if (typeof window === 'undefined' || storedLocaleRead) return;
    storedLocaleRead = true;
    useLocaleStore.setState({ locale: readStoredLocale() });
  }, []);

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    const dir = getDirection(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  return {
    locale,
    setLocale,
    t: getDictionary(locale),
    dir: getDirection(locale),
    intlLocale: toIntlLocale(locale),
    formatMessage: (template, params) => baseFormatMessage(template, params),
    formatNumber: (value, options) => baseFormatNumber(value, locale, options),
    formatLocaleDate: (date, style) => baseFormatLocaleDate(date, locale, style),
    translateWindDirection: (direction) => baseTranslateWindDirection(direction, locale),
    translateCondition: (description) => baseTranslateCondition(description, locale),
  };
}
