'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Location } from '@/lib/types';
import { useReverseGeocoding } from '@/hooks/useWeather';

interface LocationSelectionMapProps {
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  className?: string;
}

export function LocationSelectionMap({
  selectedLocation,
  onLocationSelect,
  className = '',
}: LocationSelectionMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const {
    reverseGeocode,
    isLoading: isReverseGeocoding,
  } = useReverseGeocoding();

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const addMarker = useCallback((lat: number, lng: number) => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const markerElement = document.createElement('div');

    markerElement.className = 'w-6 h-6';

    markerElement.innerHTML = `
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="#06b6d4"
          stroke="white"
          stroke-width="3"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="white"
        />
      </svg>
    `;

    markerRef.current = new maplibregl.Marker({
      element: markerElement,
      anchor: 'center',
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
  }, []);

  const handleMapClick = useCallback(
    async (e: maplibregl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;

      if (!isMountedRef.current) return;

      // Immediately update the visual marker/coordinates.
      addMarker(lat, lng);

      setCoordinates({
        lat,
        lng,
      });

      // Reverse geocode the clicked coordinates.
      const reverseResult = await reverseGeocode(lat, lng);

      if (!isMountedRef.current) return;

      if (reverseResult) {
        const namedLocation: Location = {
          latitude: lat,
          longitude: lng,
          name: reverseResult.name,
          country: reverseResult.country,
          state: reverseResult.state,
          localNames: reverseResult.localNames,
        };

        onLocationSelect(namedLocation);

        if (markerRef.current) {
          const locationParts = [
            reverseResult.name,
            reverseResult.state,
            reverseResult.country,
          ].filter(Boolean);

          markerRef.current.setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(`
              <div class="px-2 py-1 text-sm font-medium text-slate-900">
                ${locationParts.join(', ')}
              </div>
            `)
          );
        }
      } else {
        // Fallback if reverse geocoding fails.
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          name: 'Selected Location',
          country: '',
        });
      }
    },
    [addMarker, onLocationSelect, reverseGeocode]
  );

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
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
      zoom: selectedLocation ? 10 : 3,
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    map.addControl(
      new maplibregl.FullscreenControl({
        container: mapContainerRef.current,
      }),
      'top-right'
    );

    mapRef.current = map;

    map.on('load', () => {
      if (selectedLocation) {
        addMarker(
          selectedLocation.latitude,
          selectedLocation.longitude
        );

        setCoordinates({
          lat: selectedLocation.latitude,
          lng: selectedLocation.longitude,
        });
      }
    });

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [addMarker, handleMapClick, selectedLocation]);

  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return;

    mapRef.current.flyTo({
      center: [
        selectedLocation.longitude,
        selectedLocation.latitude,
      ],
      zoom: 10,
      essential: true,
    });

    addMarker(
      selectedLocation.latitude,
      selectedLocation.longitude
    );

    setCoordinates({
      lat: selectedLocation.latitude,
      lng: selectedLocation.longitude,
    });
  }, [selectedLocation, addMarker]);

  return (
    <div
      className={`relative w-full h-full rounded-xl overflow-hidden ${className}`}
    >
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />

      {coordinates && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-72 bg-black/70 rounded-lg p-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Selected Coordinates
          </div>

          <div className="font-mono text-sm text-white space-y-1">
            <div>
              Lat: {coordinates.lat.toFixed(4)}°
            </div>
            <div>
              Lng: {coordinates.lng.toFixed(4)}°
            </div>
          </div>
        </div>
      )}

      {isReverseGeocoding && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-strong rounded-lg px-4 py-2 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            Resolving location...
          </div>
        </div>
      )}
    </div>
  );
}