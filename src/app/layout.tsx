import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

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
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-full flex flex-col bg-background text-(--color-foreground)`}
      >
        {children}
      </body>
    </html>
  );
}