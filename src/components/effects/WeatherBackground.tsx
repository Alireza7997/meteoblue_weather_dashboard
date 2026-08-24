'use client';

import { useMemo } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useDashboardScroll } from '@/hooks/useDashboardScroll';

/**
 * WeatherBackground
 * 
 * A premium, animated background component for weather forecasting apps.
 * Dynamically renders atmospheric effects (rain, snow, clouds, etc.) 
 * and time-of-day gradients based on current conditions.
 */

type WeatherEffect = 'rain' | 'snow' | 'clouds' | 'clear' | 'thunderstorm' | 'fog';
type TimeStage = 'day' | 'evening' | 'night';

interface WeatherBackgroundProps {
  condition?: string;
  hour?: number;
}

// --- Helper Functions ---

function getWeatherType(condition?: string): WeatherEffect {
  if (!condition) return 'clear';
  const lower = condition.toLowerCase();
  if (lower.includes('thunder') || lower.includes('storm')) return 'thunderstorm';
  if (lower.includes('rain') || lower.includes('drizzle')) return 'rain';
  if (lower.includes('snow')) return 'snow';
  if (lower.includes('cloud') || lower.includes('overcast')) return 'clouds';
  if (lower.includes('fog') || lower.includes('mist') || lower.includes('haze')) return 'fog';
  return 'clear';
}

function getTimeStage(hour: number): TimeStage {
  if (hour >= 6 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
}

function getTimeColors(stage: TimeStage): { bg: string; overlay: string } {
  switch (stage) {
    case 'day':
      return {
        bg: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 40%, #5a89c4 100%)',
        overlay: 'linear-gradient(180deg, rgba(10,30,60,0.1) 0%, rgba(15,25,45,0.4) 100%)',
      };
    case 'evening':
      return {
        bg: 'linear-gradient(180deg, #0f0c29 0%, #6f0000 40%, #d97757 90%, #fbbf24 100%)',
        overlay: 'linear-gradient(180deg, rgba(40,20,30,0.2) 0%, rgba(20,20,40,0.5) 100%)',
      };
    case 'night':
      return {
        bg: 'linear-gradient(180deg, #000000 0%, #0f2027 40%, #203a43 100%)',
        overlay: 'linear-gradient(180deg, rgba(5,10,25,0.1) 0%, rgba(5,10,20,0.3) 100%)',
      };
  }
}

// --- Visual Effect Components ---

function SunEffect() {
  return (
    <div className="absolute top-0 left-0 right-0 h-[350px] pointer-events-none">
      <div
        className="absolute top-[-100px] right-[10%] w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.6) 0%, rgba(251,191,36,0.2) 30%, rgba(251,191,36,0.05) 60%, transparent 80%)',
          filter: 'blur(4px)',
          animation: 'sunPulse 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-[-50px] right-[calc(10%+50px)] w-[150px] h-[150px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,220,100,0.8) 0%, rgba(255,200,50,0.4) 40%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}

function MoonEffect() {
  return (
    <div className="absolute top-0 right-0 w-[350px] h-[350px] pointer-events-none">
      {/* Moon Glow */}
      <div
        className="absolute rounded-full"
        style={{
          top: '20px',
          right: 'calc(15% - 20px)',
          width: '140px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(200,220,255,0.2) 0%, transparent 70%)',
          filter: 'blur(15px)',
        }}
      />
      {/* Moon Body */}
      <div
        className="absolute top-[40px] right-[15%] w-[90px] h-[90px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, rgba(200,220,240,0.8) 40%, rgba(150,170,200,0.4) 70%, transparent 85%)',
          boxShadow: '0 0 30px rgba(200,220,255,0.4), 0 0 60px rgba(200,220,255,0.2)',
        }}
      />
    </div>
  );
}

function NightStars() {
  const stars = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.5,
      animationDuration: `${2 + Math.random() * 4}s`,
      animationDelay: `${Math.random() * 4}s`,
    })),
    []
  );

  // Add a couple of shooting stars
  const shootingStars = useMemo(() => 
    Array.from({ length: 2 }, (_, i) => ({
      id: `shooting-${i}`,
      top: `${10 + Math.random() * 30}%`,
      left: `${20 + Math.random() * 50}%`,
      delay: `${i * 7 + Math.random() * 5}s`,
    })), []
  );

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.animationDuration} ease-in-out ${star.animationDelay} infinite`,
          }}
        />
      ))}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute h-[2px] w-[100px] bg-gradient-to-r from-white to-transparent rounded-full"
          style={{
            top: star.top,
            left: star.left,
            transform: 'rotate(-35deg)',
            opacity: 0,
            animation: `shootingStar 4s ease-in ${star.delay} infinite`,
          }}
        />
      ))}
    </>
  );
}

function RainDrops() {
  // Reverted to the original raindrop style
  const drops = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${0.5 + Math.random() * 0.4}s`,
      animationDelay: `${Math.random() * 2}s`,
      opacity: 0.3 + Math.random() * 0.3,
      height: 12 + Math.random() * 15,
    })),
    []
  );

  return (
    <>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-[1px] bg-gradient-to-b from-transparent via-cyan-400/40 to-cyan-400/20"
          style={{
            left: drop.left,
            top: '-15px',
            height: `${drop.height}px`,
            animation: `rainfall ${drop.animationDuration} linear ${drop.animationDelay} infinite`,
            opacity: drop.opacity,
          }}
        />
      ))}
    </>
  );
}

function SnowParticles() {
  const flakes = useMemo(() =>
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 5,
      animationDuration: `${8 + Math.random() * 12}s`,
      animationDelay: `${Math.random() * 10}s`,
      opacity: 0.4 + Math.random() * 0.5,
      drift: `${Math.random() * 40 - 20}px`, 
    })),
    []
  );

  return (
    <>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white/90 shadow-sm"
          style={{
            left: flake.left,
            top: '-10px',
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animation: `snowfall ${flake.animationDuration} linear ${flake.animationDelay} infinite`,
            opacity: flake.opacity,
            ['--drift' as string]: flake.drift, 
          }}
        />
      ))}
    </>
  );
}

function CloudParticles() {
  // Enhanced for much higher visibility, scale, and softness
  const clouds = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      width: 350 + Math.random() * 300, // Much larger clouds
      height: 120 + Math.random() * 80,
      top: `${Math.random() * 40}%`, // Spread around the top 40%
      left: `${-20 + Math.random() * 20}%`, 
      animationDuration: `${40 + Math.random() * 20}s`, // Slower, more majestic drift
      animationDelay: `${i * 5}s`,
      opacity: 0.15 + Math.random() * 0.2, // Dramatically increased from 0.03
    })),
    []
  );

  return (
    <>
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${cloud.width}px`,
            height: `${cloud.height}px`,
            top: cloud.top,
            left: cloud.left,
            animation: `cloudDrift ${cloud.animationDuration} linear ${cloud.animationDelay} infinite`,
            opacity: cloud.opacity,
            filter: 'blur(50px)', // Heavy blur to look like real atmospheric clouds
          }}
        />
      ))}
    </>
  );
}

function LightningFlash() {
  return (
    <div
      className="absolute inset-0 bg-white pointer-events-none"
      style={{ animation: 'lightningFlash 6s ease-in-out infinite' }}
    />
  );
}

function FogBands() {
  const bands = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      top: `${15 + i * 20}%`,
      animationDuration: `${25 + i * 5}s`,
      animationDelay: `${i * 3}s`,
      opacity: 0.04 + Math.random() * 0.03,
    })),
    []
  );

  return (
    <>
      {bands.map((band) => (
        <div
          key={band.id}
          className="absolute left-0 right-0 h-[250px] bg-gradient-to-b from-transparent via-white/20 to-transparent"
          style={{
            top: band.top,
            animation: `fogDrift ${band.animationDuration} ease-in-out ${band.animationDelay} infinite`,
            opacity: band.opacity,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </>
  );
}

// --- Main Component ---

export function WeatherBackground({ condition, hour }: WeatherBackgroundProps) {
  // Hydration-safe default hour calculation
  const currentHour = hour ?? (typeof window !== 'undefined' ? new Date().getHours() : 12);
  
  const weatherType = getWeatherType(condition);
  const timeStage = getTimeStage(currentHour);
  const timeColors = getTimeColors(timeStage);

  const isClear = weatherType === 'clear';
  const showStars = timeStage === 'night' || timeStage === 'evening';
  const showSun = isClear && timeStage === 'day';
  const showMoon = isClear && (timeStage === 'night' || timeStage === 'evening');

  // Parallax depth: celestial layer lags far behind the scroll (feels
  // distant), precipitation/clouds lag less (feel nearer). Values are fed
  // by the springed dashboard scroll progress, so sudden scrolls glide.
  const { progress } = useDashboardScroll();
  const celestialY = useTransform(progress, [0, 1], [0, 90]);
  const particlesY = useTransform(progress, [0, 1], [0, 35]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Standardized Keyframes */}
      <style>{`
        @keyframes sunPulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes shootingStar { 0% { transform: rotate(-35deg) translateX(0); opacity: 0; } 5% { opacity: 1; } 15% { transform: rotate(-35deg) translateX(-400px); opacity: 0; } 100% { opacity: 0; } }
        @keyframes rainfall { 0% { transform: translateY(-15px); } 100% { transform: translateY(100vh); } }
        @keyframes snowfall { 0% { transform: translateY(-10px) translateX(0); } 50% { transform: translateY(50vh) translateX(var(--drift, 10px)); } 100% { transform: translateY(100vh) translateX(0); } }
        @keyframes cloudDrift { 0% { transform: translateX(-150px); } 100% { transform: translateX(calc(100vw + 150px)); } }
        @keyframes fogDrift { 0% { transform: translateX(-50px); } 50% { transform: translateX(50px); } 100% { transform: translateX(-50px); } }
        @keyframes lightningFlash { 0%, 95%, 100% { opacity: 0; } 96%, 98% { opacity: 0.6; background: rgba(255,255,255,0.8); } 97% { opacity: 0.2; background: rgba(200,200,255,0.4); } }
      `}</style>

      {/* Base time-stage gradient */}
      <div className="absolute inset-0" style={{ background: timeColors.bg }} />

      {/* Top-to-bottom overlay for reduced contrast */}
      <div className="absolute inset-0" style={{ background: timeColors.overlay }} />

      {/* Celestial layer (stars / sun / moon) — slowest, most distant */}
      <motion.div className="absolute inset-0" style={{ y: celestialY }}>
        {showStars && <NightStars />}
        {showSun && <SunEffect />}
        {showMoon && <MoonEffect />}
      </motion.div>

      {/* Atmospheric particles — nearer layer */}
      <motion.div className="absolute inset-0" style={{ y: particlesY }}>
        {weatherType === 'clouds' && <CloudParticles />}

        {weatherType === 'rain' && <RainDrops />}

        {weatherType === 'snow' && <SnowParticles />}

        {weatherType === 'thunderstorm' && (
          <>
            <RainDrops />
            <LightningFlash />
          </>
        )}

        {weatherType === 'fog' && <FogBands />}
      </motion.div>
    </div>
  );
}