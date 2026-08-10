# Advanced Weather Analytics Dashboard

A professional meteorological dashboard built with Next.js 16, React 19, TypeScript, Tailwind CSS, MapLibre GL JS, and Recharts. Features two independent interactive maps for location selection and weather visualization, real-time weather data from OpenWeatherMap, and interactive analytics charts.

## Features

### Core Features
- **Two Independent Maps**: Location selection map and weather visualization map
- **Location Selection**: Click on map, search with autocomplete, or use browser geolocation
- **Reverse Geocoding**: Automatic location name resolution from coordinates
- **Current Weather**: Temperature, feels-like, humidity, wind, pressure, visibility, UV index, sunrise/sunset
- **Hourly Forecast**: 24-hour scrollable timeline with temperature, precipitation, wind
- **Daily Forecast**: 7-day forecast with high/low temps, conditions, precipitation probability
- **Weather Visualization Map**: 6 weather layers (Temperature, Precipitation, Wind, Humidity, Clouds, UV)
- **Interactive Analytics**: Temperature, precipitation, wind, humidity & pressure charts
- **Weather Insights**: Rule-based alerts for rain, temperature changes, wind, UV index
- **Forecast Timeline**: Unified time control for hourly and daily navigation
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Premium dark theme with glassmorphism effects

### Weather Map Layers
1. **Temperature** (°C) - Blue → Cyan → Yellow → Orange → Red
2. **Precipitation** (mm/h) - Light blue → Dark blue
3. **Wind Speed** (km/h) - Light blue → Dark blue
4. **Humidity** (%) - Yellow → Orange → Brown
5. **Cloud Coverage** (%) - Dark blue → Light blue
6. **UV Index** - Green → Yellow → Orange → Red → Purple

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Maps | MapLibre GL JS |
| Charts | Recharts |
| State | Zustand |
| Weather API | OpenWeatherMap One Call API 3.0 |
| Geocoding | OpenWeatherMap Geocoding API |
| Icons | Lucide React |
| Date Utils | date-fns |

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- OpenWeatherMap API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd advanced_weather_analytics
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your OpenWeatherMap API key:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Getting an OpenWeatherMap API Key

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Go to [API Keys](https://home.openweathermap.org/api_keys)
3. Generate a new API key
4. The free tier provides 1,000 calls/day

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── weather/           # Weather data proxy
│   │   ├── geocoding/         # Forward geocoding proxy
│   │   ├── reverse-geocoding/ # Reverse geocoding proxy
│   │   └── historical/        # Historical data proxy
│   ├── globals.css            # Global styles & Tailwind
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # Top header with search & location
│   │   └── DashboardLayout.tsx # Main dashboard composition
│   ├── maps/
│   │   ├── LocationSelectionMap.tsx  # Map 1: Choose location
│   │   └── WeatherVisualizationMap.tsx # Map 2: Weather layers
│   ├── weather/
│   │   ├── CurrentWeatherPanel.tsx   # Current conditions
│   │   ├── HourlyForecast.tsx        # 24-hour timeline
│   │   ├── DailyForecast.tsx         # 7-day forecast
│   │   ├── WeatherCharts.tsx         # Analytics charts
│   │   ├── WeatherAlerts.tsx         # Insights/alerts
│   │   └── ForecastTimeline.tsx      # Time navigation
│   └── ui/
│       └── SearchAutocomplete.tsx    # Location search with autocomplete
├── hooks/
│   ├── useWeather.ts          # Weather data fetching
│   └── useGeolocation.ts      # Geolocation & search
├── lib/
│   ├── store.ts               # Zustand state management
│   ├── api.ts                 # API utilities
│   ├── types.ts               # TypeScript types
│   ├── constants.ts           # Color scales, config, mock data
│   └── utils.ts               # Formatting & data processing
└── styles/
    └── map.css                # Map-specific styles (in globals.css)
```

## Architecture

### State Management (Zustand)
```typescript
type WeatherState = {
  selectedLocation: Location | null;
  selectedDate: string;
  selectedHour: number;
  mapLayer: WeatherMapLayer;
  isLoading: boolean;
  error: string | null;
};
```

### Data Flow
1. User selects location → `selectedLocation` updates
2. `useWeather` hook fetches weather data via `/api/weather`
3. Weather data flows to all components (current, hourly, daily, charts, map)
4. Time selection (`selectedHour`, `selectedDate`) updates charts & weather map
5. Layer selection (`mapLayer`) regenerates weather map visualization

### Two-Map Architecture

**Map 1: Location Selection**
- Full interactive OSM map
- Click to select, drag marker
- Reverse geocoding on click
- Search autocomplete integration
- Browser geolocation button

**Map 2: Weather Visualization**
- Separate MapLibre instance
- Client-side generated grid data
- Interpolated heatmap circles
- 6 switchable weather layers
- Real-time hover inspection
- Selected location marker
- Color legend per layer

### Weather Map Visualization
Since OpenWeatherMap doesn't provide raster weather tiles on the free tier, we implement client-side visualization:
1. Generate grid points around selected location (25×25, 300km radius)
2. Use hourly forecast data as base values
3. Add spatial variation using sine/cosine functions
4. Render as MapLibre circle layer with color interpolation
5. Interpolate values on hover/click for tooltips

## API Routes

All API routes are Next.js App Router route handlers that proxy to OpenWeatherMap:

| Route | Purpose |
|-------|---------|
| `GET /api/weather?lat={lat}&lon={lon}` | One Call API 3.0 |
| `GET /api/geocoding?q={query}` | Direct geocoding |
| `GET /api/reverse-geocoding?lat={lat}&lon={lon}` | Reverse geocoding |
| `GET /api/historical?lat={lat}&lon={lon}&name={name}&country={country}` | Mock historical data |

## Demo Mode

The application works without an API key using mock data:
- Default location: London, UK
- Mock weather data for demonstration
- All UI interactions functional
- Weather map shows generated visualization

To enable real data, add your OpenWeatherMap API key to `.env.local`.

## Customization

### Adding Weather Layers
1. Add layer config to `src/lib/constants.ts` in `LAYER_CONFIG`
2. Add layer to `WeatherMapLayer` type in `src/lib/types.ts`
3. Update `ForecastTimeline` layer selector
4. Handle in `WeatherVisualizationMap` grid generation

### Modifying Color Scales
Edit the `colors` array in `LAYER_CONFIG` for each layer:
```typescript
colors: [
  { value: 0, color: '#color' },
  { value: 10, color: '#color' },
  // ...
]
```

### Changing Default Location
Edit `DEFAULT_LOCATION` in `src/lib/constants.ts`.

## Performance Considerations

- Weather grid: ~1,300 points (25×25) rendered as circles
- Debounced search (200ms)
- AbortController for cancelled requests
- Memoized chart data with `useMemo`
- Persisted state (location, layer) in localStorage
- Efficient MapLibre rendering with WebGL

## Future Improvements

- [ ] Real weather tile layers (OpenWeatherMap paid tier)
- [ ] Historical data from OpenWeatherMap History API
- [ ] Multiple saved locations
- [ ] Weather radar overlay
- [ ] Animated transitions between layers
- [ ] PWA support with offline caching
- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright
- [ ] Server-side rendering for SEO
- [ ] Internationalization (i18n)

## License

MIT License - feel free to use for learning or commercial projects.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [MapLibre](https://maplibre.org/) for mapping
- [Recharts](https://recharts.org/) for charts
- [OpenStreetMap](https://www.openstreetmap.org/) for base maps
- [Tailwind CSS](https://tailwindcss.com/) for styling