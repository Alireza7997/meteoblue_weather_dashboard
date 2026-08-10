'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Location, WeatherMapLayer } from '@/lib/types';
import type { HourlyForecastItem } from '@/lib/utils';
import { LAYER_CONFIG } from '@/lib/constants';
import { generateWeatherGrid, interpolateWeatherGrid } from '@/lib/api';
import { useWeatherStore } from '@/lib/store';

interface WeatherVisualizationMapProps {
  selectedLocation: Location | null;
  weatherData: HourlyForecastItem[] | null;
  className?: string;
}

interface GridPoint {
  lat: number;
  lon: number;
  value: number;
}

export function WeatherVisualizationMap({
  selectedLocation,
  weatherData,
  className = '',
}: WeatherVisualizationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const gridDataRef = useRef<GridPoint[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const { mapLayer, selectedHour, selectedDate } = useWeatherStore();
  const [hoverInfo, setHoverInfo] = useState<{ lat: number; lon: number; value: number } | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const layerConfig = LAYER_CONFIG[mapLayer];

  const generateGridData = useCallback(() => {
    if (!selectedLocation || !weatherData) return;

    const hourData = weatherData[selectedHour];
    if (!hourData) return;

    const points = generateWeatherGrid(
      selectedLocation.latitude,
      selectedLocation.longitude,
      300,
      25
    );

    const baseValue = (() => {
      switch (mapLayer) {
        case 'temperature':
          return hourData.temp;
        case 'precipitation':
          return hourData.precipitation;
        case 'wind':
          return hourData.windSpeed / 3.6;
        case 'humidity':
          return hourData.humidity;
        case 'clouds':
          return hourData.clouds;
        case 'uv':
          return hourData.uvi;
        default:
          return hourData.temp;
      }
    })();

    gridDataRef.current = points.map((point) => {
      const distance = Math.sqrt(
        Math.pow((point.lat - selectedLocation.latitude) * 111, 2) +
        Math.pow((point.lon - selectedLocation.longitude) * 111 * Math.cos((selectedLocation.latitude * Math.PI) / 180), 2)
      );

      const variation = (Math.sin(point.lat * 10) + Math.cos(point.lon * 10)) * 3;
      const distanceFactor = Math.max(0, 1 - distance / 300);
      const value = baseValue + variation * distanceFactor + (Math.random() - 0.5) * 2;

      return { ...point, value: Math.max(layerConfig.min, Math.min(layerConfig.max, value)) };
    });
  }, [selectedLocation, weatherData, selectedHour, mapLayer, layerConfig.min, layerConfig.max]);

  useEffect(() => {
    generateGridData();
  }, [generateGridData]);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: selectedLocation
        ? [selectedLocation.longitude, selectedLocation.latitude]
        : [-0.1278, 51.5074],
      zoom: selectedLocation ? 7 : 3,
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(
      new maplibregl.FullscreenControl({ container: mapContainerRef.current }),
      'top-right'
    );

    mapRef.current = map;

    map.on('load', () => {
      setIsMapLoaded(true);
      addWeatherLayer();
      if (selectedLocation) {
        addLocationMarker();
      }
    });

    map.on('mousemove', handleMouseMove);
    map.on('mouseleave', handleMouseLeave);
    map.on('click', handleMapClick);

    return () => {
      map.off('mousemove', handleMouseMove);
      map.off('mouseleave', handleMouseLeave);
      map.off('click', handleMapClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      popupRef.current?.remove();
    };
  }, [selectedLocation]);

  const addWeatherLayer = () => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    if (map.getSource('weather-grid')) {
      map.removeLayer('weather-heatmap');
      map.removeSource('weather-grid');
    }

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: gridDataRef.current.map((point) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.lon, point.lat],
        },
        properties: {
          value: point.value,
        },
      })),
    };

    map.addSource('weather-grid', {
      type: 'geojson',
      data: geojson,
    });

    map.addLayer({
      id: 'weather-heatmap',
      type: 'circle',
      source: 'weather-grid',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          3, 2,
          7, 4,
          12, 8,
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'value'],
          layerConfig.min, layerConfig.colors[0].color,
          ...layerConfig.colors.slice(1).flatMap((stop) => [stop.value, stop.color]),
        ],
        'circle-opacity': 0.7,
        'circle-blur': 0.5,
      },
    });
  };

  const addLocationMarker = () => {
    if (!selectedLocation || !mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const markerElement = document.createElement('div');
    markerElement.className = 'w-8 h-8';
    markerElement.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="#22d3ee" stroke="white" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `;

    markerRef.current = new maplibregl.Marker({ element: markerElement, anchor: 'center' })
      .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
      .addTo(mapRef.current);
  };

  const handleMouseMove = useCallback((e: maplibregl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    const value = interpolateWeatherGrid(gridDataRef.current, lat, lng, 50);

    setHoverInfo({ lat, lon: lng, value });

    if (popupRef.current) {
      popupRef.current.setLngLat(e.lngLat).setHTML(
        `<div class="weather-tooltip">
          <div class="font-medium text-white mb-1">${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E</div>
          <div class="text-sm text-slate-300">${layerConfig.icon} ${layerConfig.label}: <span class="text-white font-medium">${value.toFixed(1)}${layerConfig.unit}</span></div>
        </div>`
      );
    } else {
      popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, anchor: 'top' })
        .setLngLat(e.lngLat)
        .setHTML(
          `<div class="weather-tooltip">
            <div class="font-medium text-white mb-1">${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E</div>
            <div class="text-sm text-slate-300">${layerConfig.icon} ${layerConfig.label}: <span class="text-white font-medium">${value.toFixed(1)}${layerConfig.unit}</span></div>
          </div>`
        )
        .addTo(mapRef.current!);
    }
  }, [layerConfig]);

  const handleMouseLeave = useCallback(() => {
    setHoverInfo(null);
    popupRef.current?.remove();
    popupRef.current = null;
  }, []);

  const handleMapClick = useCallback((e: maplibregl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    const value = interpolateWeatherGrid(gridDataRef.current, lat, lng, 50);

    if (popupRef.current) {
      popupRef.current.setLngLat(e.lngLat).setHTML(
        `<div class="weather-tooltip">
          <div class="font-medium text-white mb-1">${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E</div>
          <div class="text-sm text-slate-300">${layerConfig.icon} ${layerConfig.label}: <span class="text-white font-medium">${value.toFixed(1)}${layerConfig.unit}</span></div>
          <div class="text-xs text-slate-400 mt-2">Click to inspect</div>
        </div>`
      );
    }
  }, [layerConfig]);

  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      mapRef.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 7,
        essential: true,
      });
      addLocationMarker();
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (isMapLoaded) {
      addWeatherLayer();
    }
  }, [mapLayer, selectedHour, isMapLoaded]);

  const legendColors = useMemo(() => layerConfig.colors, [layerConfig.colors]);

  return (
    <div className={`relative w-full h-full rounded-xl overflow-hidden ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      <div className="absolute top-4 right-4 z-10">
        <div className="glass-strong rounded-lg p-3 shadow-xl min-w-[160px] animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{layerConfig.icon}</span>
            <span className="font-semibold text-white">{layerConfig.label}</span>
          </div>
          <div className="space-y-1.5">
            {legendColors.map((stop, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div
                  className="w-5 h-3 rounded"
                  style={{ backgroundColor: stop.color }}
                />
                <span className="text-slate-300">
                  {index === 0 ? '≤' : index === legendColors.length - 1 ? '≥' : ''}
                  {stop.value}{layerConfig.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hoverInfo && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-64 glass-strong rounded-lg p-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Hover Values
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-slate-400">Lat / Lng</div>
            <div className="text-white font-mono">{hoverInfo.lat.toFixed(2)}° / {hoverInfo.lon.toFixed(2)}°</div>
            <div className="text-slate-400">{layerConfig.label}</div>
            <div className="text-white font-medium">{hoverInfo.value.toFixed(1)}{layerConfig.unit}</div>
          </div>
        </div>
      )}

      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/90 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400">Loading weather map...</p>
          </div>
        </div>
      )}
    </div>
  );
}