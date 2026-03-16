import React from 'react';
import { THEME } from '../theme';
import { LightCard } from './Cards';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  trendPct?: string | number;
  icon: React.ReactNode;
}

export function MetricCard({ label, value, unit, trend, trendPct, icon }: MetricCardProps) {
  return (
    <LightCard style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: THEME.mossDark, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: THEME.lightSandal, display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.darkForest }}>
          {icon}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: THEME.mossDark }}>{unit}</span>}
      </div>
      {trend && (
        <div style={{ marginTop: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 700,
            background: trend === 'up' ? THEME.liveGreen + '20' : trend === 'down' ? THEME.liveRed + '20' : THEME.warmSandal,
            color: trend === 'up' ? THEME.liveGreen : trend === 'down' ? THEME.liveRed : THEME.mossDark
          }}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '▬'} {trendPct && `${trendPct}%`}
          </span>
        </div>
      )}
    </LightCard>
  );
}
