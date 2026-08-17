# Advanced Weather Analytics Dashboard

A professional meteorological dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Features live weather data from Meteoblue, two independent MapLibre maps (location selection + weather visualization), interactive Recharts analytics, animated weather backgrounds, and full **English / Persian (RTL)** internationalization.

## Features

### Core

- **Three ways to pick a location**: search with autocomplete, click on the interactive map, or use browser geolocation (with accurate/low-accuracy fallback and visible error handling)
- **Reverse Geocoding**: coordinates resolve to city/state/country names via BigDataCloud
- **Current Weather**: temperature, humidity, wind speed & direction, pressure, cloud coverage, and UV index
- **Hourly Forecast**: 24-hour scrollable timeline with temperature, precipitation probability, and wind
- **Daily Forecast**: 7-day forecast with highs/lows, conditions, wind, humidity, and UV level
- **Interactive Charts**: temperature trend, precipitation (probability + amount), wind (speed + gusts), humidity & pressure, and daily high/low comparison
- **Weather Insights**: rule-based alerts for rain, temperature swings, strong winds, and UV index
- **Forecast Timeline**: unified time selector synced with the charts' selected-hour marker
- **Animated Backgrounds**: sun, moon & stars, rain, snow, clouds, fog, and lightning effects that respond to the current weather condition and time of day
- **Bilingual UI**: English and Persian with full RTL layout, Persian digits, Jalali calendar dates, and locale-aware formatting — see [Internationalization](#internationalization)
- **Responsive Design**: mobile-first layouts with RTL support
- **Dark Theme**: premium glassmorphism styling with animated weather effects

### Weather Map Layers

The weather map renders 6 switchable layers, each with its own color scale and legend:

1. **Temperature** (°C)
2. **Precipitation** (mm/h)
3. **Wind Speed** (km/h)
4. **Humidity** (%)
5. **Cloud Coverage** (%)
6. **UV Index**

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, React Compiler enabled) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Maps | MapLibre GL JS v4 |
| Charts | Recharts |
| State | Zustand (persisted to localStorage) |
| Weather API | Meteoblue `basic-1h` package |
| Geocoding | Open-Meteo Geocoding API |
| Reverse Geocoding | BigDataCloud |
| Fonts | Geist + Vazirmatn (Persian) |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Meteoblue API key ([my.meteoblue.com](https://my.meteoblue.com))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Alireza7997/weather_analytics_dashboard.git
   cd weather_analytics_dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Add your Meteoblue API key to `.env.local`:

   ```env
   NEXT_PUBLIC_METEOBLUE_API_KEY=your_api_key_here
   # Optional: shared secret to HMAC-sign requests
   METEOBLUE_SHARED_SECRET=your_shared_secret_here
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Internationalization

The dashboard is fully localized for **English** and **Persian**:

- Toggle the language from the button next to the search bar; the choice persists across visits
- Persian mode switches the document to **RTL**, applies the Vazirmatn font, and renders Persian digits plus Jalali calendar dates via `Intl.NumberFormat('fa-IR')` / `Intl.DateTimeFormat('fa-IR')`
- All numbers, weekday names, wind directions, weather conditions, insight messages, chart legends, and map labels are localized
- City search returns Persian names when the Persian locale is active (`lang=fa` is passed to the geocoding API)
- An inline script in `<head>` applies the persisted direction before first paint to avoid an LTR flash

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── weather/             # Meteoblue forecast proxy
│   │   ├── geocoding/           # Forward geocoding (Open-Meteo, lang-aware)
│   │   ├── reverse-geocoding/   # BigDataCloud reverse geocoding
│   │   └── historical/          # Mock historical data
│   ├── globals.css              # Tailwind + theme + glassmorphism
│   ├── layout.tsx               # Root layout (fonts, RTL pre-hydration script)
│   └── page.tsx                 # Main page
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx  # Dashboard composition & section animations
│   ├── maps/
│   │   ├── LocationSelectionMap.tsx    # Map 1: pick a location
│   │   └── WeatherVisualizationMap.tsx # Map 2: weather layer grid
│   ├── effects/
│   │   └── WeatherBackground.tsx       # Animated sun/rain/snow/etc.
│   ├── weather/
│   │   ├── CurrentWeatherPanel.tsx     # Current conditions
│   │   ├── HourlyForecast.tsx          # 24-hour timeline
│   │   ├── DailyForecast.tsx           # 7-day forecast
│   │   ├── WeatherCharts.tsx           # Analytics charts
│   │   ├── WeatherAlerts.tsx           # Insights/alerts
│   │   ├── ForecastTimeline.tsx        # Hour selection timeline
│   │   └── icons/AnimatedWeatherIcon.tsx
│   └── ui/
│       ├── SearchBar.tsx               # Search + location/locale buttons
│       ├── SearchAutocomplete.tsx      # Debounced autocomplete dropdown
│       ├── MapModal.tsx                # Fullscreen map selector
│       ├── LocaleToggle.tsx            # English/Persian switch
│       └── Portal.tsx
├── hooks/
│   ├── useWeather.ts            # Fetches & processes forecast data
│   ├── useGeolocation.ts        # Geolocation + geocoding search
│   ├── useLocale.ts             # Locale, RTL sync, formatters
│   ├── useSectionInView.ts      # Scroll-triggered section animations
│   └── useScrollLock.tsx
└── lib/
    ├── store.ts                 # Zustand store (persisted)
    ├── i18n.ts                  # en/fa dictionaries, locale store, formatters
    ├── api.ts                   # Meteoblue/BigDataCloud integrations
    ├── utils.ts                 # Forecast processing & insights
    ├── constants.ts             # Layer configs, color scales, icons
    ├── date-fns.ts              # Lightweight date utilities
    └── types.ts                 # Shared types
```

## Architecture

### State Management (Zustand)

```typescript
type WeatherState = {
  selectedLocation: AppLocation | null;
  selectedDate: string;
  selectedHour: number;
  mapLayer: WeatherMapLayer;
  isLoading: boolean;
  error: string | null;
};
```

`selectedLocation` and `mapLayer` persist to localStorage. The locale lives in a separate store keyed to the `weather-locale` localStorage entry.

### Data Flow

1. User selects a location (search / map click / geolocation) → `selectedLocation` updates
2. `useWeather` fetches the Meteoblue `basic-1h` forecast and transforms it into the app's OpenWeather-style shape
3. Data flows to the current panel, hourly/daily lists, charts, timeline, and weather map
4. Locale changes re-process all derived data (day names, conditions, digits) without re-fetching

### Two-Map Architecture

**Map 1 — Location Selection** (in a fullscreen modal)

- Interactive OSM base map
- Click to select; reverse-geocoded automatically
- Fullscreen control

**Map 2 — Weather Visualization** (in the dashboard)

- Separate MapLibre instance (pan/zoom locked for a stable canvas)
- Client-side generated grid rendered as a colored circle layer
- 6 switchable layers with per-layer legends (hidden under 500px screens)
- Hover/click inspection with interpolated value tooltips
- Selected-location marker

### Weather Map Visualization

Since raster weather tiles are unavailable on the free tier, the map is visualized client-side:

1. Generate a point grid around the selected location (300km radius, ~1,300 points)
2. Seed values from the selected hour's forecast
3. Add spatial variation and clamp to each layer's min/max range
4. Render as MapLibre circles with interpolated colors
5. Interpolate grid values on hover/click for tooltips

## API Routes

| Route | Purpose |
|-------|---------|
| `GET /api/weather?lat={lat}&lon={lon}` | Meteoblue basic-1h forecast |
| `GET /api/geocoding?q={query}&lang={en\|fa}` | Forward geocoding (Open-Meteo) |
| `GET /api/reverse-geocoding?lat={lat}&lon={lon}` | Reverse geocoding (BigDataCloud) |
| `GET /api/historical?...` | Mock historical data |

## Customization

### Adding Weather Layers

1. Add config to `LAYER_CONFIG` in `src/lib/constants.ts`
2. Extend `WeatherMapLayer` in `src/lib/types.ts`
3. Add labels in both dictionaries in `src/lib/i18n.ts`
4. Add the option to `LAYER_OPTIONS` in `DashboardLayout.tsx`
5. Handle the value mapping in `WeatherVisualizationMap`

### Modifying Color Scales

Edit the `colors` array per layer in `LAYER_CONFIG`:

```typescript
colors: [
  { value: 0, color: '#color' },
  { value: 10, color: '#color' },
]
```

### Default Location

Edit `DEFAULT_LOCATION` in `src/lib/constants.ts` (currently Tehran, Iran).

## Performance

- Weather grid: ~1,300 points rendered as one vector layer
- Debounced search (200ms)
- AbortController for cancelled requests
- Memoized chart datasets
- Cached `Intl.NumberFormat`/`DateTimeFormat` instances per locale
- Persisted state in localStorage
- React Compiler enabled, WebGL map rendering

## License

MIT License — free to use for learning or commercial projects.

## Acknowledgments

- [Meteoblue](https://www.meteoblue.com/) for forecast data
- [Open-Meteo](https://open-meteo.com/) for geocoding
- [BigDataCloud](https://www.bigdatacloud.com/) for reverse geocoding
- [MapLibre](https://maplibre.org/) and [OpenStreetMap](https://www.openstreetmap.org/) for mapping
- [Recharts](https://recharts.org/) for charts
- [Tailwind CSS](https://tailwindcss.com/) for styling
