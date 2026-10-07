'use client';

import { useRef } from 'react';
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion';
import { useLocale } from '@/hooks/useLocale';
import { useDashboardScroll } from '@/hooks/useDashboardScroll';
import { normalizeUvCategory, type HeroWeather } from '@/lib/utils';

interface CurrentWeatherPanelProps {
  locationName: string;
  /** Live conditions, or a preview of the day picked in the 7-day forecast. */
  current: HeroWeather | null;
  isLoading?: boolean;
}

interface StatItemProps {
  icon: string;
  label: string;
  value: string;
  color: string;
  delay: number;
  highlight?: boolean;
  className?: string;
}

function StatItem({ icon, label, value, color, delay, highlight, className = '' }: StatItemProps) {
  // Deliberately no `w-full`: as a grid item the card stretches to its cell on
  // its own, which keeps `w-*` overrides (the centred lone UV tile) conflict-free.
  return (
    <div
      className={`group relative rounded-2xl cursor-default animate-fade-in transition-all duration-300 min-w-0 ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        transformStyle: 'preserve-3d',
        perspective: '600px',
      }}
    >
        <div
          className="relative glass rounded-2xl p-3 sm:p-4 h-full transition-all duration-300 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_30px_var(--glow-color)]"
        style={{
          ['--glow-color' as string]: `${color}30`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
        }}
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) translateZ(10px)`;
          e.currentTarget.style.background = `linear-gradient(135deg, ${color}15, ${color}05)`;
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) translateZ(10px)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
          e.currentTarget.style.background = '';
        }}
      >
        {/* Border glow */}
        <div
          className="absolute inset-0 rounded-2xl border border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ borderColor: `${color}40` }}
        />

        <div className="relative flex flex-col items-center gap-1.5">
          <span className="text-2xl transition-transform duration-300 group-hover:scale-125 drop-shadow-lg">
            {icon}
          </span>
          <div className="text-center">
            <div className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">{label}</div>
            <div className="text-sm font-semibold text-white mt-0.5">{value}</div>
          </div>
        </div>

        {highlight && (
          <div className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        )}
      </div>
    </div>
  );
}

export function CurrentWeatherPanel({ locationName, current, isLoading }: CurrentWeatherPanelProps) {
  const { t } = useLocale();
  const { containerRef } = useDashboardScroll();
  const panelRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: panelRef,
    offset: ['start start', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const y = useTransform(smoothProgress, [0, 1], ['0%', '-18%']);
  const scale = useTransform(smoothProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(smoothProgress, [0, 0.85], [1, 0]);
  const blurPx = useTransform(smoothProgress, [0, 1], [0, 6]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  if (isLoading || !current) {
    return (
      <motion.div ref={panelRef} className="relative py-8" style={{ y, opacity }}>
        <div className="animate-pulse-slow">
          <div className="h-6 w-48 max-w-full mx-auto bg-white/5 rounded-full mb-8"></div>
          <div className="h-16 w-40 max-w-full mx-auto bg-white/5 rounded mb-4"></div>
          <div className="h-6 w-32 max-w-full mx-auto bg-white/5 rounded mb-10"></div>
          <div className="grid grid-cols-2 sm:flex gap-3 justify-center">
            <div className="h-20 bg-white/5 rounded-xl"></div>
            <div className="h-20 bg-white/5 rounded-xl"></div>
            <div className="h-20 bg-white/5 rounded-xl hidden sm:block sm:w-16"></div>
            <div className="h-20 bg-white/5 rounded-xl hidden sm:block sm:w-16"></div>
            <div className="h-20 bg-white/5 rounded-xl hidden sm:block sm:w-16"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  const uvCategory = normalizeUvCategory(current.uv);
  const uvLabel = t.uv[uvCategory.toLowerCase() as 'low' | 'moderate' | 'high'];
  // Tiles are humidity, wind and UV, plus pressure (live only) and rain chance.
  const statCount = 3 + (current.pressure ? 1 : 0) + (current.precipChance ? 1 : 0);
  // Columns match the tile count so every row is full — a short last row would
  // leave the grid visually off-centre. Literal class strings keep Tailwind's
  // scanner happy.
  const statCols =
    statCount >= 5
      ? 'grid-cols-2 sm:grid-cols-5'
      : statCount === 4
        ? 'grid-cols-2 sm:grid-cols-4'
        : statCount === 3
          ? 'grid-cols-2 sm:grid-cols-3'
          : 'grid-cols-2';
  // UV renders last, so with an odd tile count it would be left on its own in
  // the final mobile row — span that row and centre itself inside it instead.
  const uvClassName =
    statCount % 2 === 1 ? 'col-span-2 justify-self-center w-1/2 sm:col-span-1 sm:w-full' : '';

  return (
    <motion.div ref={panelRef} className="relative py-6" style={{ y, scale, opacity, filter }}>
      {/* Location name — opaque backdrop so the sun/moon glow behind it can't wash out the text */}
      <div className="text-center mb-4 z-10 px-2">
        <div
          className="inline-block glass rounded-full px-4 py-1.5 max-w-full shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
          style={{
            backgroundColor: 'rgba(6, 11, 24, 0.65)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <span
            className="text-sm font-medium text-slate-100 break-words"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
          >
            {locationName}
          </span>
        </div>
      </div>

      {/* Temperature + condition */}
      <div className="text-center mb-6 sm:mb-8 z-10" style={{ perspective: '1000px' }}>
        {current.dayLabel && (
          <div className="mb-3 inline-block glass rounded-full px-3 py-1 text-xs sm:text-sm text-slate-200">
            {current.dayLabel}
          </div>
        )}
        <div
          className="text-6xl sm:text-7xl md:text-8xl font-thin text-white tracking-tighter mb-2 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
          style={{ textShadow: '0 0 60px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.5)' }}
        >
          {current.temp}
          {current.tempMin && (
            <span className="text-[0.4em] font-light text-white/60"> / {current.tempMin}</span>
          )}
        </div>
        <div className="text-lg sm:text-xl md:text-2xl text-white/80 drop-shadow-lg px-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
          {current.icon} {current.condition}
        </div>
      </div>

      {/* Stat items row — pressure only exists for live conditions */}
      <div
        className={`grid ${statCols} gap-3 mx-auto w-full max-w-4xl z-10`}
        style={{ perspective: '1000px' }}
      >
        <StatItem icon="💧" label={t.stats.humidity} value={current.humidity} color="#38bdf8" delay={100} />
        <StatItem
          icon="💨"
          label={t.stats.wind}
          value={current.windDir ? `${current.wind} ${current.windDir}` : current.wind}
          color="#a78bfa"
          delay={150}
        />
        {current.pressure && (
          <StatItem icon="📊" label={t.stats.pressure} value={current.pressure} color="#f472b6" delay={200} />
        )}
        {current.precipChance && (
          <StatItem icon="🌧" label={t.stats.precipChance} value={current.precipChance} color="#60a5fa" delay={250} />
        )}
        <StatItem
          icon="🔆"
          label={t.stats.uv}
          value={uvLabel}
          color={uvCategory === 'Low' ? '#4ade80' : uvCategory === 'Moderate' ? '#fbbf24' : '#ef4444'}
          delay={300}
          highlight={uvCategory === 'High'}
          className={uvClassName}
        />
      </div>
    </motion.div>
  );
}
