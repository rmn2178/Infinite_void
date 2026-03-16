import React from 'react';
import { THEME } from '../theme';

export function RiskGauge({ score, label }: { score: number; label: string }) {
  const getScoreColor = (s: number) => {
    if (s < 40) return THEME.liveGreen;
    if (s < 70) return THEME.warning;
    return THEME.danger;
  };

  const percentage = Math.min(Math.max(score, 0), 100);
  const radius = 80;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ textAlign: 'center', position: 'relative', width: '100%' }}>
      <svg viewBox="0 0 200 120" style={{ width: '100%', maxWidth: 200, display: 'block', margin: '0 auto' }}>
        {/* Background Arc */}
        <path d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`} fill="none" stroke={THEME.warmSandal} strokeWidth="16" strokeLinecap="round" />
        {/* Foreground Arc */}
        <path 
          d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`} 
          fill="none" 
          stroke={getScoreColor(score)} 
          strokeWidth="16" 
          strokeLinecap="round" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 1s ease' }} 
        />
      </svg>
      <div style={{ position: 'absolute', top: 55, left: 0, right: 0 }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {score.toFixed(0)}
        </div>
        <div style={{ fontSize: 12, color: THEME.mossDark, marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}
