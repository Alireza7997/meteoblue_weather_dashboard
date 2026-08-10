import { NextRequest, NextResponse } from 'next/server';
import { fetchHistoricalData } from '@/lib/api';
import type { Location } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const name = searchParams.get('name');
  const country = searchParams.get('country');

  if (!lat || !lon || !name) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const location: Location = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    name,
    country: country || undefined,
  };

  try {
    const data = await fetchHistoricalData(location);

    if (!data) {
      return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Historical API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}