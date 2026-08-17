import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "Advanced Weather Analytics Dashboard",
  description:
    "Professional meteorological dashboard with interactive maps, forecasts, and analytics",
  keywords: [
    "weather",
    "analytics",
    "dashboard",
    "forecast",
    "meteorology",
    "maps",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`h-full antialiased ${vazirmatn.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem('weather-locale');if(l==='fa'){document.documentElement.lang='fa';document.documentElement.dir='rtl'}}catch(e){}})()`,
          }}
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
