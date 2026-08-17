'use client';

import { LocationSelectionMap } from '@/components/maps/LocationSelectionMap';
import { X } from 'lucide-react';
import type { AppLocation } from '@/lib/types';
import { useScrollLock } from '@/hooks/useScrollLock';

interface MapModalProps {
  selectedLocation: AppLocation | null;
  onLocationSelect: (location: AppLocation) => void;
  onClose: () => void;
}

export function MapModal({ selectedLocation, onLocationSelect, onClose }: MapModalProps) {

  useScrollLock({locked: true})
  return (
    <div className="fixed z-50 w-screen h-screen flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl h-[70vh] glass-strong rounded-2xl overflow-hidden shadow-2xl animate-bounce-in">
        <div className="absolute -top-16 right-4 z-10">
          <button
            onClick={onClose}
            className="btn-icon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <LocationSelectionMap
          selectedLocation={selectedLocation}
          onLocationSelect={(loc) => {
            onLocationSelect(loc);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
