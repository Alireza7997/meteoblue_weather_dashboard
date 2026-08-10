
# meteoblue API Data Export for Weather Analytics App

This document outlines the essential endpoints, authentication methods, data packages, and parameters from the meteoblue Weather APIs required for integrating weather analytics into your application.

## Authentication

All meteoblue Weather APIs authorize calls with an API key appended as a URL query parameter: `&apikey=YOUR_KEY`. Keys are issued on request via support@meteoblue.com or by enabling the Free Weather API trial in your meteoblue account. The default rate limit is 500 calls per minute, and per-package daily call limits may apply depending on your plan.

For protecting the key in client-side apps, meteoblue supports three mechanisms:
- **HMAC-SHA256 request signing** with a shared secret, plus an optional `&expire=<unix timestamp>` to time-limit the URL. Code samples are provided for PHP, JS, C#, Python, Java, Go and Ruby.
- **Referrer / Origin allow-list** (wildcard `*.domain.com` supported, comma-separated).
- **IP allow-list** in IPv4/IPv6/CIDR form.

## Base Endpoints

| API | Base URL | Method | Purpose |
|---|---|---|---|
| Forecast (packages) | `https://my.meteoblue.com/packages/{package}` | GET | Point forecasts up to 7 days (+ 4 days history) |
| History (point) | `https://my.meteoblue.com/history/point` | GET | One-variable time series from 1940 onward |
| Dataset | `https://my.meteoblue.com/dataset/query?apikey=…` | POST (JSON body) | Full archive; multi-variable, multi-location, server-side transforms |
| Accounting | `https://my.meteoblue.com/account/usage?apikey=…` | GET | Usage statistics |
| Image | `https://my.meteoblue.com/…` (per chart) | GET | PNG meteograms, pictoprints, cross-sections |
| Maps / Warnings / Measurements / Climate | `https://my.meteoblue.com/…` | GET | Map tiles, official alerts, station obs, climate normals |

## Forecast API — Packages & Variables

Base pattern: `https://my.meteoblue.com/packages/{package}?lat=47.5584&lon=7.57327&apikey=KEY&format=json`. 
Multiple packages can be combined in a single call (each is billed individually). Output formats: `json` (default for multi-resolution), `csv` (only when all packages share the same time interval).

Common query parameters: `lat`, `lon` (WGS84, required), `asl` (elevation in metres; auto-detected from an 80 m DEM if omitted), `apikey` (required), `format`, `tz` / timezone, `history_days` (up to 4), unit selectors (`temperature`, `windspeed`, `precipitationamount`, `winddirection`, `timeformat`).

| Category | Package | Time resolutions | Key variables |
|---|---|---|---|
| General | `basic` | 15 min, 1 h, 3 h, day | Temperature, precipitation, wind speed/direction, sea-level pressure, relative humidity, UV index, predictability |
| General | `current` | — | Current observed/model conditions |
| General | `clouds` | 1 h, 3 h, day | Total / low / mid / high cloud cover |
| General | `sunandmoon` (Sun & Moon) | — | Sunrise/sunset, moonrise/moonset, illumination |
| Agronomical | `agro` | 1 h, 3 h, day | Soil temperature, soil moisture, evapotranspiration, dew point, leaf wetness |
| Agronomical | `agromodel-leafwetness`, `agromodel-sowing`, `agromodel-spray` | 1 h, day | Leaf wetness, sowing windows, spray conditions |
| Renewable energy | `solar` | 15 min, 1 h, 3 h, day | GHI, GNI, DNI, DIF, solar power forecast |
| Renewable energy | `solar-ensemble` | 1 h | Probabilistic solar |
| Renewable energy | `wind` | 15 min, 1 h, 3 h, day | Wind speed/direction, gusts, air density, pressure, hub-height (e.g. 80 m) |
| Renewable energy | `wind-80m-ensemble` | 1 h | Probabilistic wind at 80 m |
| Advanced | `sea` | 1 h, 3 h, day | Significant wave height, wave direction/period, sea surface temp |
| Advanced | `air` | 1 h, 3 h, day | CAPE, lifted index, helicity, thunderstorm probability |
| Advanced | `airquality` | 1 h, 3 h, day | AQI, CAQI, O₃, NO₂, PM10, PM2.5, SO₂, CO |
| Multimodel (raw NWP) | `multimodel`, `multimodel-temperature`, `multimodel-precipitation`, `multimodel-relativehumidity`, `multimodel-wind`, `multimodel-wind80m`, `multimodel-clouds`, `multimodel-radiation` | 1 h | Per-model raw output for variance analysis |
| 14-day | `trend` | 1 h, day | T, wind, precip, cloud cover (14 d) |
| 14-day | `trendpro` (ensemble) | 1 h, day | Ensemble-based 14 d with uncertainty bands |
| 14-day | `ensemble` | 1 h | Full ensemble |

**Units selectable per request:** 
- Temperature: `C`/`K`/`F`
- Wind: `m/s`/`km/h`/`mph`/`kn`/`bft`
- Precipitation: `mm`/`inch`
- Wind direction: `degree`/`2char`/`3char`
- Time: `iso8601`/`timestamp_utc`/`timestamp_ms_utc`/`YMD`/`Y-M-D`

## History API — Variables & Parameters

Base URL: `https://my.meteoblue.com/history/point`. 
Returns one variable per call, up to 30 years, from 1940 onward (ERA5T reanalysis, ~8-day delay, gap-filled with NEMS). Default timezone is UTC.

**Mandatory parameters:** `start`, `end` (date), `lat`, `lon`, `variable`, `apikey`. 
**Optional:** `domain` (`ERA5T` default, or `NEMSAUTO`), `asl`, `utc_offset`, `format` (`json`/`csv`), `resolution` (`hourly`/`daily`/`monthly`), `aggregation` (`min`/`max`/`mean`/`sum`), `gapfill` (bool).

Available variables (with height level):

| Variable | Level |
|---|---|
| `temperature` | 2 m a.g. |
| `sealevelpressure` | mean sea level |
| `precipitation` | surface |
| `snowfraction` | surface |
| `winddirection`, `windspeed` | 10 m a.g. |
| `relativehumidity` | 2 m a.g. |
| `soiltemperature_0to7cm`, `soilmoisture_0to7cm` | 0–7 cm below ground |
| `skintemperature` | surface |
| `evapotranspiration` | surface |
| `referenceevapotranspiration_fao` | 2 m a.g. |
| `dewpointtemperature`, `wetbulbtemperature` | 2 m a.g. |
| `windspeed_100m`, `winddirection_100m` | 100 m a.g. |
| `gust` | surface |
| `windpower` | 100 m a.g. (needs `turbineid`, `numberofturbines`) |
| `totalcloudcover`, `lowclouds`, `midclouds`, `highclouds` | surface/layered |
| `sunshinetime` | surface |
| `ghi_backwards`, `dif_backwards`, `dni_backwards` | surface |
| `pvpower_backwards` | surface (needs `slope`, `facing`, `kwp`, `power_efficiency`, `tracker`) |

*Climate add-ons:* `modelclimate-day` (35-year monthly/daily normals) and `yearlyarchive/windrose` (30-year wind rose).

## Dataset API — JSON Request Body

Endpoint: `POST https://my.meteoblue.com/dataset/query?apikey=KEY` with `Content-Type: application/json`. 
Coordinates use **lon, lat, (asl)** order. Large jobs set `"runOnJobQueue": true` and are polled separately.

**Top-level body fields:**

| Field | Type | Description |
|---|---|---|
| `units` | object | `{temperature, velocity, length, energy}` — defaults C, km/h, metric, watts |
| `geometry` | GeoJSON | `Point`, `MultiPoint`, `Polygon`, `MultiPolygon`, `GeonamePolygon`, `MultiGeonamePolygon`, `GeometryCollection`; supports `mode` (`preferLandWithMatchingElevation`/`preferSea`/`nearest`/`includeNeighbours`), `excludeSeaPoints`, `fallbackToNearestNeighbour`, `locationNames` |
| `format` | string | `json`, `csv`, `csvTimeOriented`, `csvIrregular`, `xlsx`, `xlsxTimeOriented`, `xlsxIrregular`, `highcharts`, `highchartsHtml`, `geoJson`, `geoJsonHtml`, `kml`, `netCDF` |
| `timeIntervals` | array | ISO 8601 intervals, e.g. `"2019-01-01T+00:00/2019-12-31T+00:00"` |
| `timeIntervalsAlignment` | string | alignment of multiple intervals |
| `queries` | array | per-dataset queries (see below) |
| `oneTimeIntervalPerGeometry` | bool | pair each geometry with its own interval |
| `checkOnly` | bool | only compute required datapoints |
| `runOnJobQueue` | bool | execute on job queue |

**`queries[]` object:**

| Property | Type | Description |
|---|---|---|
| `domain` | string | dataset name: `NEMSGLOBAL`, `NEMS12`, `NEMS4`, `ERA5`, `ERA5T`, etc. |
| `gapFillDomain` | string/null | secondary dataset for gap-filling |
| `timeResolution` | string | `hourly` or `daily` |
| `codes` | array | `{code, level, aggregation?, gddBase?, gddLimit?, startDepth?, endDepth?, slope?, facing?}` |
| `transformations` | array | server-side transforms (see below) |
| `allowForecast` | bool | allow SSD-stored current forecasts |
| `allowHistory` | bool | allow archived forecasts |

*Note:* Variable `code` is numeric (originates from NOAA GRIB 1, extended); common examples: `11` = temperature, `52` = relative humidity, `157` = precipitation. The full code list is exposed as a JSON API. `level` examples: `2 m above gnd`, `10 m above gnd`, `180-0 mb above gnd`.

**Transformations** (chained, executed in order): `aggregateDaily`, `aggregateMonthly`, `aggregateYearly`, `aggregateDailyByLongitude`, `aggregateTimeInterval`, `aggregateHalfDaily` (with `dailyNightly`: `daylightAndNighttime`/`daylight`/`nighttime`), `timeLaggedAggregation` (`nTimesteps`), `aggregateNormals` (`temporalResolution`), `interpolateTemporal` (`5min`/`10min`/`15min`/`1min`), `valueIsAbove`/`valueIsBelow`/`valueIsBetween` (with `returnClassification`). Aggregation operators: `sum`, `min`, `max`, `mean`, `stddev`, `p10`, `p25`, `p50`, `p75`, `p90` (plus `*IgnoreNaN` variants).

## Sample Requests

**Forecast (Basic, hourly, JSON):**
```http
GET https://my.meteoblue.com/packages/basic-1h?lat=47.5584&lon=7.57327&apikey=KEY&format=json
```

**Combine packages in one call:**
```http
GET https://my.meteoblue.com/packages/basic-1h,wind-1h,solar-1h?lat=47.5584&lon=7.57327&apikey=KEY
```

**History (hourly temperature):**
```http
GET https://my.meteoblue.com/history/point?start=2022-11-01&end=2022-11-02&lat=47.1&lon=8.6&variable=temperature&apikey=KEY
```

**Signed forecast URL** (10-minute expiry recommended for frontend use):
```http
https://my.meteoblue.com/packages/basic-1h?lat=47.1&lon=8.6&apikey=DEMOKEY&expire=1924948800&sig=<HMAC-SHA256>
```

**Dataset query (curl):**
```bash
curl -L -H "Content-Type: application/json" \
  -d '{"units":{"temperature":"C","velocity":"km/h","length":"metric","energy":"watts"},
       "geometry":{"type":"MultiPoint","coordinates":[[7.57327,47.558399,279]],"locationNames":["Basel"]},
       "format":"json",
       "timeIntervals":["2019-01-01T+00:00/2019-12-31T+00:00"],
       "queries":[{"domain":"NEMSGLOBAL","gapFillDomain":null,"timeResolution":"hourly",
                   "codes":[{"code":11,"level":"2 m above gnd"}]}]}' \
  "https://my.meteoblue.com/dataset/query?apikey=KEY"
```

*Minimal JSON response shape for Forecast API (Basic-1h)*: A nested object with `metadata` (lat/lon/height/timezone/asl/`model_run`), and per-package keys containing parallel arrays of timestamps and value arrays (temperature, precipitation, wind, etc.); the Dataset API returns geoms + `timeIntervals` + per-query `codes` with `data` arrays (timestamps may be a `timestrings` array or a `{start, end, stride}` timerange, which the official Python SDK normalises).

## Notes for Analytics Pipelines

- **Forecast horizon:** 7 days (14 d with `trend`/`trendpro`/`ensemble`); 4 days of progressively-corrected history via `&history_days=`.
- **History depth:** from 1940 (ERA5T, ~8-day lag); up to 30 years per call.
- **Spatial resolution:** Varies by underlying NWP domain (a few km to tens of km); outputs are point forecasts (mLM post-processed), not raw grid cells. Elevation correction is applied via the `asl` parameter or the 80 m DEM.
- **Batch processing:** For batch/long-range pulls, the Dataset API with `runOnJobQueue: true` plus the official `meteoblue-dataset-sdk` Python library (handles job polling and protobuf decoding) is the recommended path.
- **Free Tier Limitations:** The Free Weather API tier (10 M credits, 1 year, non-commercial) covers Basic/Agro/Wind/Clouds/Solar/PV Pro/Air/Trend/Air Quality at 1 h–3 h–daily resolution; History, Dataset, Maps, Measurements, Warnings and Climate APIs require Enterprise.
