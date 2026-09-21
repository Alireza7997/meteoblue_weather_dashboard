import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const [vazirmatnRegular, vazirmatnBold] = await Promise.all([
    readFile(join(process.cwd(), 'public/fonts/ttf/Vazirmatn-Regular.ttf')),
    readFile(join(process.cwd(), 'public/fonts/ttf/Vazirmatn-Bold.ttf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 45%, #0f2027 100%)',
          color: 'white',
          fontFamily: 'Vazirmatn, sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            marginBottom: 24,
            background: 'radial-gradient(circle at 38% 34%, #fffdf0 0%, #ffefad 30%, #ffd24d 62%, #ffb62e 100%)',
            boxShadow: '0 0 45px rgba(255,215,90,0.9), 0 0 110px rgba(255,180,50,0.5)',
          }}
        />
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -1 }}>
          Iran Weather Forecast
        </div>
        <div style={{ fontSize: 40, marginTop: 12, opacity: 0.95 }}>
          پیش‌بینی آب‌وهوای ایران
        </div>
        <div style={{ fontSize: 30, marginTop: 28, opacity: 0.8 }}>
          Tehran · Mashhad · Isfahan · Shiraz · Tabriz
        </div>
        <div style={{ fontSize: 26, marginTop: 12, opacity: 0.65 }}>
          Hourly &amp; 7-day forecasts · Interactive maps
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Vazirmatn',
          data: vazirmatnRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Vazirmatn',
          data: vazirmatnBold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}
