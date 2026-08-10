import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    <html lang="en" className="h-full antialiased">
      <body
        className={`${geist.variable} ${geistMono.variable} min-h-full flex flex-col bg-background text-(--color-foreground)`}
      >
        {children}
      </body>
    </html>
  );
}