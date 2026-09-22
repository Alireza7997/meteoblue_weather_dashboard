import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_NAME_FA, SITE_URL } from "@/lib/seo";

const vazirmatn = localFont({
  src: '../../public/fonts/variable/Vazirmatn[wght].ttf',
  variable: '--font-vazirmatn',
  display: 'swap',
});

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: 'هواشناسی | گزارش آب و هوا و پیش‌بینی دقیق ساعتی و ۷ روزه | Weather Forecast',
    template: '%s | Weather Forecast',
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  category: 'weather',
  alternates: {
    canonical: '/',
    languages: {
      fa: '/?lang=fa',
      en: '/?lang=en',
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'هواشناسی | گزارش آب و هوا و پیش‌بینی دقیق | Weather Forecast',
    description: SITE_DESCRIPTION,
    url: '/',
    locale: 'fa_IR',
    alternateLocale: ['en_US'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'هواشناسی | گزارش آب و هوا | Weather Forecast',
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  other: {
    'geo.region': 'IR',
    'geo.placename': 'Iran',
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
  width: "device-width",
  initialScale: 1,
  colorScheme: 'dark',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: ['هواشناسی', 'گزارش آب و هوا', SITE_NAME_FA],
  url: `${SITE_URL}/`,
  description: SITE_DESCRIPTION,
  inLanguage: ['fa', 'en'],
};

const appJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  applicationCategory: 'WeatherApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Hourly weather forecast',
    '7-day weather forecast',
    'Interactive weather maps',
    'Weather analytics and charts',
    'English and Persian (Farsi) interface',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`h-full antialiased ${vazirmatn.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            // ?lang=fa|en takes precedence so localized URLs (hreflang)
            // open with the right language; otherwise use stored locale.
            // SSR default is fa/rtl for Persian-first SEO.
            __html: `(function(){try{var m=location.search.match(/[?&]lang=(en|fa)\\b/);var l=m?m[1]:localStorage.getItem('weather-locale');if(m){try{localStorage.setItem('weather-locale',l)}catch(e){}}if(l==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr'}else if(l==='fa'||!l){document.documentElement.lang='fa';document.documentElement.dir='rtl'}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-full flex flex-col bg-background text-(--color-foreground)`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
