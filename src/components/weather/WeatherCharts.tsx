'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useMemo } from 'react';
import type { HourlyForecastItem, DailyForecastItem } from '@/lib/utils';
import { useWeatherStore } from '@/lib/store';

interface WeatherChartsProps {
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  timezoneOffset: number;
}

const CHART_COLORS = {
  temp: '#06d6a0',
  feelsLike: '#fbbf24',
  precipitation: '#38bdf8',
  pop: '#0ea5e9',
  wind: '#a78bfa',
  gust: '#c084fc',
  humidity: '#fbbf24',
  pressure: '#fb7185',
  grid: 'rgba(255,255,255,0.03)',
  text: '#a8b8c8',
  axis: 'rgba(255,255,255,0.06)',
};

const tooltipStyle = {
  backgroundColor: 'rgba(13, 21, 37, 0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(6,214,160,0.1)',
  backdropFilter: 'blur(20px)',
  padding: '12px 16px',
};

export function WeatherCharts({ hourly, daily, timezoneOffset }: WeatherChartsProps) {
  const { selectedHour } = useWeatherStore();

  const temperatureData = useMemo(() => hourly.map((h) => ({
    time: h.time,
    temp: h.temp,
    hour: parseInt(h.time),
  })), [hourly]);

  const precipitationData = useMemo(() => hourly.map((h) => ({
    time: h.time,
    precipitation: h.precipitation,
    pop: h.pop,
    hour: parseInt(h.time),
  })), [hourly]);

  const windData = useMemo(() => hourly.map((h) => ({
    time: h.time,
    speed: h.windSpeed,
    gust: h.windSpeed * 1.5,
    hour: parseInt(h.time),
  })), [hourly]);

  const humidityPressureData = useMemo(() => hourly.map((h) => ({
    time: h.time,
    humidity: h.humidity,
    pressure: ((h.pressure || 1013) - 1000).toFixed(2),
    hour: parseInt(h.time),
  })), [hourly]);

  const dailyTempData = useMemo(() => daily.slice(0, 7).map((d) => ({
    date: d.dateShort,
    max: d.tempMax,
    min: d.tempMin,
  })), [daily]);

  return (
    <div className="panel">
      <h3 className="section-title mb-6">Analytics</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Temperature" subtitle="Hourly & Daily" icon="🌡">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart
              data={temperatureData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.temp} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.temp} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis
                dataKey="time"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.axis }}
              />
              <YAxis
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}°`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`${value}°C`, 'Temperature']}
                labelFormatter={(label) => `${label}:00`}
              />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="temp"
                name="Temperature"
                stroke={CHART_COLORS.temp}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 7, strokeWidth: 2, stroke: CHART_COLORS.temp }}
                strokeLinecap="round"
              />
              <ReferenceLine
                x={selectedHour.toString()}
                stroke="rgba(6, 214, 160, 0.3)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Precipitation" subtitle="Probability & Amount" icon="🌧">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart
              data={precipitationData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.precipitation} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.precipitation} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis
                dataKey="time"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.axis }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}mm`}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(label) => `${label}:00`}
              />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                yAxisId="left"
                dataKey="pop"
                name="Probability"
                fill={CHART_COLORS.pop}
                fillOpacity={0.6}
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="precipitation"
                name="Amount (mm)"
                stroke={CHART_COLORS.precipitation}
                strokeWidth={2}
                fill="url(#precipGradient)"
                connectNulls={true}
              />
              <ReferenceLine
                yAxisId="left"
                x={selectedHour.toString()}
                stroke="rgba(6, 214, 160, 0.3)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Wind" subtitle="Speed & Gusts" icon="💨">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart
              data={windData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.wind} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.wind} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis
                dataKey="time"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.axis }}
              />
              <YAxis
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v} km/h`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`${value} km/h`, 'Wind']}
                labelFormatter={(label) => `${label}:00`}
              />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="speed"
                name="Speed"
                stroke={CHART_COLORS.wind}
                strokeWidth={2}
                fill="url(#windGradient)"
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="gust"
                name="Gusts"
                stroke={CHART_COLORS.gust}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 7, strokeWidth: 2 }}
                strokeLinecap="round"
              />
              <ReferenceLine
                x={selectedHour.toString()}
                stroke="rgba(6, 214, 160, 0.3)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Humidity & Pressure" subtitle="Trends" icon="💧">
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart
              data={humidityPressureData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis
                dataKey="time"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.axis }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v + 1000}hPa`}
                domain={[0, 50]}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(label) => `${label}:00`}
              />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
                iconSize={8}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke={CHART_COLORS.humidity}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 7, strokeWidth: 2 }}
                strokeLinecap="round"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="pressure"
                name="Pressure"
                stroke={CHART_COLORS.pressure}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 7, strokeWidth: 2 }}
                strokeLinecap="round"
              />
              <ReferenceLine
                yAxisId="left"
                x={selectedHour.toString()}
                stroke="rgba(6, 214, 160, 0.3)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily High/Low" subtitle="7-Day Outlook" icon="📊">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={dailyTempData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
              <XAxis
                type="number"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}°`}
              />
              <YAxis
                type="category"
                dataKey="date"
                stroke={CHART_COLORS.axis}
                tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`${value}°C`, 'Temperature']}
              />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="max"
                name="High"
                fill={CHART_COLORS.temp}
                fillOpacity={0.6}
                radius={[0, 4, 4, 0]}
                barSize={14}
              >
                {dailyTempData.map((_, index) => (
                  <Cell key={`max-${index}`} fill={CHART_COLORS.temp} fillOpacity={0.6} />
                ))}
              </Bar>
              <Bar
                dataKey="min"
                name="Low"
                fill={CHART_COLORS.precipitation}
                fillOpacity={0.4}
                radius={[0, 4, 4, 0]}
                barSize={14}
              >
                {dailyTempData.map((_, index) => (
                  <Cell key={`min-${index}`} fill={CHART_COLORS.precipitation} fillOpacity={0.4} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: string;
  children: React.ReactNode;
}

function ChartCard({ title, subtitle, icon, children }: ChartCardProps) {
  return (
    <div className="glass-vibrant rounded-2xl p-6 glow-hover transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <div className="font-semibold text-white">{title}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <div className="h-full">{children}</div>
    </div>
  );
}
