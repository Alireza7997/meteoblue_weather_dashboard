'use client';

import { useMemo } from 'react';

type WeatherEffect = 'rain' | 'snow' | 'clouds' | 'clear' | 'thunderstorm' | 'fog';

interface WeatherBackgroundProps {
  condition?: string;
}

function getEffectFromCondition(condition?: string): WeatherEffect {
  if (!condition) return 'clear';
  const lower = condition.toLowerCase();
  if (lower.includes('thunder') || lower.includes('storm')) return 'thunderstorm';
  if (lower.includes('rain') || lower.includes('drizzle')) return 'rain';
  if (lower.includes('snow')) return 'snow';
  if (lower.includes('cloud') || lower.includes('overcast')) return 'clouds';
  if (lower.includes('fog') || lower.includes('mist') || lower.includes('haze')) return 'fog';
  return 'clear';
}

function RainEffect() {
  const drops = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${0.8 + Math.random() * 0.4}s`,
      animationDelay: `${Math.random() * 2}s`,
      opacity: 0.3 + Math.random() * 0.3,
    })),
    []
  );

  return (
    <>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-[1px] h-[15px] bg-gradient-to-b from-transparent via-cyan-glow/40 to-transparent"
          style={{
            left: drop.left,
            top: '-15px',
            animation: `rainfall ${drop.animationDuration} linear ${drop.animationDelay} infinite`,
            opacity: drop.opacity,
          }}
        />
      ))}
    </>
  );
}

function SnowEffect() {
  const flakes = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      animationDuration: `${8 + Math.random() * 7}s`,
      animationDelay: `${Math.random() * 10}s`,
      opacity: 0.4 + Math.random() * 0.4,
    })),
    []
  );

  return (
    <>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white/60"
          style={{
            left: flake.left,
            top: '-10px',
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animation: `snowfall ${flake.animationDuration} linear ${flake.animationDelay} infinite`,
            opacity: flake.opacity,
          }}
        />
      ))}
    </>
  );
}

function CloudsEffect() {
  const clouds = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      width: 200 + Math.random() * 200,
      height: 60 + Math.random() * 40,
      top: `${10 + i * 20}%`,
      left: `${-10 + Math.random() * 30}%`,
      animationDuration: `${25 + Math.random() * 15}s`,
      animationDelay: `${i * 3}s`,
    })),
    []
  );

  return (
    <>
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute rounded-full bg-white/[0.03] blur-sm"
          style={{
            width: `${cloud.width}px`,
            height: `${cloud.height}px`,
            top: cloud.top,
            left: cloud.left,
            animation: `cloudDrift ${cloud.animationDuration} ease-in-out ${cloud.animationDelay} infinite`,
          }}
        />
      ))}
    </>
  );
}

function ClearEffect() {
  return (
    <div
      className="absolute top-0 right-0 w-[600px] h-[600px]"
      style={{
        background: 'radial-gradient(ellipse at 80% 0%, rgba(250,204,21,0.08) 0%, rgba(6,214,160,0.04) 30%, transparent 60%)',
        animation: 'sunPulse 8s ease-in-out infinite',
      }}
    />
  );
}

function ThunderstormEffect() {
  return (
    <>
      <RainEffect />
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{
          animation: 'lightningFlash 4s ease-in-out infinite',
        }}
      />
    </>
  );
}

function FogEffect() {
  const bands = useMemo(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      top: `${20 + i * 25}%`,
      animationDuration: `${18 + i * 5}s`,
      animationDelay: `${i * 2}s`,
    })),
    []
  );

  return (
    <>
      {bands.map((band) => (
        <div
          key={band.id}
          className="absolute left-0 right-0 h-[200px] bg-gradient-to-b from-transparent via-white/[0.03] to-transparent"
          style={{
            top: band.top,
            animation: `fogDrift ${band.animationDuration} ease-in-out ${band.animationDelay} infinite`,
          }}
        />
      ))}
    </>
  );
}

export function WeatherBackground({ condition }: WeatherBackgroundProps) {
  const effect = getEffectFromCondition(condition);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {effect === 'rain' && <RainEffect />}
      {effect === 'snow' && <SnowEffect />}
      {effect === 'clouds' && <CloudsEffect />}
      {effect === 'clear' && <ClearEffect />}
      {effect === 'thunderstorm' && <ThunderstormEffect />}
      {effect === 'fog' && <FogEffect />}
    </div>
  );
}
