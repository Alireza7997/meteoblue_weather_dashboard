'use client';

interface AnimatedWeatherIconProps {
  iconCode: string;
  size?: number;
  className?: string;
}

function SunIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g style={{ animation: 'spin-slow 20s linear infinite', transformOrigin: '50px 50px' }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="50" y1="12" x2="50" y2="22"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="18" fill="#fbbf24" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
      <circle cx="50" cy="50" r="12" fill="#fcd34d" />
    </svg>
  );
}

function CloudIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g style={{ animation: 'cloud-float 4s ease-in-out infinite' }}>
        <path
          d="M25 65C16.7 65 10 58.3 10 50C10 41.7 16.7 35 25 35C25.3 35 25.7 35 26 35.1C28.3 29.5 34.1 25 41 25C50.4 25 58 32.6 58 42C58 42.3 58 42.7 57.9 43C64.6 44.3 70 50.1 70 57C70 64.2 64.2 70 57 70H28C21.4 70 16 64.6 16 58"
          fill="#94a3b8"
          opacity="0.9"
        />
        <path
          d="M70 55C70 47.8 64.2 42 57 42C56.7 42 56.3 42 56 42.1C53.7 36.5 47.9 32 41 32C31.6 32 24 39.6 24 49C24 49.3 24 49.7 24.1 50C17.4 51.3 12 57.1 12 64C12 71.2 17.8 77 25 77H62C68.6 77 74 71.6 74 65"
          fill="#cbd5e1"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

function RainIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g style={{ animation: 'cloud-float 4s ease-in-out infinite' }}>
        <path
          d="M25 55C16.7 55 10 48.3 10 40C10 31.7 16.7 25 25 25C25.3 25 25.7 25 26 25.1C28.3 19.5 34.1 15 41 15C50.4 15 58 22.6 58 32C58 32.3 58 32.7 57.9 33C64.6 34.3 70 40.1 70 47C70 54.2 64.2 60 57 60H28C21.4 60 16 54.6 16 48"
          fill="#94a3b8"
        />
      </g>
      {[
        { x: 30, delay: '0s' },
        { x: 42, delay: '0.3s' },
        { x: 54, delay: '0.6s' },
      ].map((drop, i) => (
        <line
          key={i}
          x1={drop.x} y1="65" x2={drop.x - 3} y2="80"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ animation: `weather-rain 1s ease-in-out infinite`, animationDelay: drop.delay }}
        />
      ))}
    </svg>
  );
}

function SnowIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g style={{ animation: 'cloud-float 4s ease-in-out infinite' }}>
        <path
          d="M25 55C16.7 55 10 48.3 10 40C10 31.7 16.7 25 25 25C25.3 25 25.7 25 26 25.1C28.3 19.5 34.1 15 41 15C50.4 15 58 22.6 58 32C58 32.3 58 32.7 57.9 33C64.6 34.3 70 40.1 70 47C70 54.2 64.2 60 57 60H28C21.4 60 16 54.6 16 48"
          fill="#94a3b8"
        />
      </g>
      {[
        { cx: 32, cy: 70, delay: '0s' },
        { cx: 45, cy: 75, delay: '0.4s' },
        { cx: 58, cy: 68, delay: '0.8s' },
      ].map((flake, i) => (
        <circle
          key={i}
          cx={flake.cx} cy={flake.cy} r="3"
          fill="white"
          style={{ animation: `weather-snow 2s ease-in-out infinite`, animationDelay: flake.delay }}
        />
      ))}
    </svg>
  );
}

function ThunderIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g style={{ animation: 'cloud-float 4s ease-in-out infinite' }}>
        <path
          d="M25 50C16.7 50 10 43.3 10 35C10 26.7 16.7 20 25 20C25.3 20 25.7 20 26 20.1C28.3 14.5 34.1 10 41 10C50.4 10 58 17.6 58 27C58 27.3 58 27.7 57.9 28C64.6 29.3 70 35.1 70 42C70 49.2 64.2 55 57 55H28C21.4 55 16 49.6 16 43"
          fill="#64748b"
        />
      </g>
      <polygon
        points="45,55 38,72 46,72 40,90 58,65 48,65 55,55"
        fill="#fbbf24"
        style={{ animation: 'lightning-flash 3s ease-in-out infinite' }}
      />
      {[
        { x: 30, delay: '0.2s' },
        { x: 55, delay: '0.5s' },
      ].map((drop, i) => (
        <line
          key={i}
          x1={drop.x} y1="60" x2={drop.x - 2} y2="72"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ animation: `weather-rain 0.8s ease-in-out infinite`, animationDelay: drop.delay }}
        />
      ))}
    </svg>
  );
}

function FogIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g style={{ animation: 'cloud-float 5s ease-in-out infinite' }}>
        <path
          d="M25 45C16.7 45 10 38.3 10 30C10 21.7 16.7 15 25 15C25.3 15 25.7 15 26 15.1C28.3 9.5 34.1 5 41 5C50.4 5 58 12.6 58 22C58 22.3 58 22.7 57.9 23C64.6 24.3 70 30.1 70 37C70 44.2 64.2 50 57 50H28C21.4 50 16 44.6 16 38"
          fill="#94a3b8"
          opacity="0.6"
        />
      </g>
      {[58, 66, 74].map((y, i) => (
        <line
          key={i}
          x1="20" y1={y} x2="65" y2={y}
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
          style={{
            animation: `fadeIn 2s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </svg>
  );
}

function PartlyCloudyIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g style={{ animation: 'spin-slow 20s linear infinite', transformOrigin: '65px 30px' }}>
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <line
            key={angle}
            x1="65" y1="12" x2="65" y2="18"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${angle} 65 30)`}
          />
        ))}
      </g>
      <circle cx="65" cy="30" r="12" fill="#fbbf24" />
      <g style={{ animation: 'cloud-float 4s ease-in-out infinite' }}>
        <path
          d="M22 70C13.7 70 7 63.3 7 55C7 46.7 13.7 40 22 40C22.3 40 22.7 40 23 40.1C25.3 34.5 31.1 30 38 30C47.4 30 55 37.6 55 47C55 47.3 55 47.7 54.9 48C61.6 49.3 67 55.1 67 62C67 69.2 61.2 75 54 75H25C18.4 75 13 69.6 13 63"
          fill="#cbd5e1"
        />
      </g>
    </svg>
  );
}

export function AnimatedWeatherIcon({ iconCode, size = 48, className = '' }: AnimatedWeatherIconProps) {
  const getCode = () => {
    if (!iconCode) return '01d';
    return iconCode.replace('n', 'd');
  };

  const code = getCode();

  const renderIcon = () => {
    if (code.startsWith('01')) return <SunIcon size={size} />;
    if (code.startsWith('02')) return <PartlyCloudyIcon size={size} />;
    if (code.startsWith('03') || code.startsWith('04')) return <CloudIcon size={size} />;
    if (code.startsWith('09') || code.startsWith('10')) return <RainIcon size={size} />;
    if (code.startsWith('13')) return <SnowIcon size={size} />;
    if (code.startsWith('11')) return <ThunderIcon size={size} />;
    if (code.startsWith('50')) return <FogIcon size={size} />;
    return <SunIcon size={size} />;
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {renderIcon()}
    </div>
  );
}
