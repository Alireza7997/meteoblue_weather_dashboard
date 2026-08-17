'use client';

import type { WeatherInsight } from '@/lib/utils';
import { useLocale } from '@/hooks/useLocale';

interface WeatherAlertsProps {
  insights: WeatherInsight[];
}

export function WeatherAlerts({ insights }: WeatherAlertsProps) {
  const { t } = useLocale();

  if (!insights.length) return null;

  return (
    <div className="panel">
      <h3 className="section-title mb-4">{t.insights.title}</h3>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              insight.type === 'warning'
                ? 'bg-red-500/10 border border-red-500/20'
                : insight.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : 'bg-blue-500/10 border border-blue-500/20'
            }`}
          >
            <span className="text-xl mt-0.5 flex-shrink-0">{insight.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}