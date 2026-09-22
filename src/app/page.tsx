import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HomeSeoContent } from '@/components/seo/HomeSeoContent';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'هواشناسی | گزارش آب و هوا و پیش‌بینی دقیق ساعتی و ۷ روزه',
  description:
    'هواشناسی دقیق و گزارش آب و هوا: پیش‌بینی ساعتی و ۷ روزه تهران، مشهد، اصفهان، شیراز، تبریز و همه شهرها — دما، بارش، باد و رطوبت. Weather Forecast.',
  keywords: [
    'هواشناسی',
    'گزارش آب و هوا',
    'پیش بینی آب و هوا',
    'پیش‌بینی آب و هوا',
    'وضعیت آب و هوا',
    'هواشناسی تهران',
    'هواشناسی مشهد',
    'هواشناسی اصفهان',
    'هواشناسی شیراز',
    'هواشناسی تبریز',
    'Weather Forecast',
  ],
  alternates: {
    canonical: '/',
    languages: { fa: '/?lang=fa', en: '/?lang=en' },
  },
  openGraph: {
    title: 'هواشناسی | گزارش آب و هوا | Weather Forecast',
    description:
      'گزارش آب و هوا و پیش‌بینی ساعتی و ۷ روزه تهران و همه شهرها: هواشناسی دقیق دما، بارش، باد و رطوبت.',
    url: '/',
    locale: 'fa_IR',
    alternateLocale: ['en_US'],
    type: 'website',
  },
};

export default function Home() {
  return (
    <>
      <DashboardLayout />
      <HomeSeoContent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'هواشناسی تهران امروز چگونه است؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'در این صفحه گزارش آب و هوای تهران شامل دمای فعلی، پیش‌بینی ساعتی و ۷ روزه، بارش، باد و رطوبت را مشاهده می‌کنید.',
                },
              },
              {
                '@type': 'Question',
                name: 'گزارش آب و هوای شهرهای ایران را از کجا ببینم؟',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'نام شهر را جستجو کنید یا از فهرست هواشناسی شهرها وارد صفحه اختصاصی هر شهر شوید تا گزارش آب و هوا و پیش‌بینی دقیق را ببینید.',
                },
              },
            ],
            url: `${SITE_URL}/`,
            inLanguage: 'fa',
          }),
        }}
      />
    </>
  );
}
