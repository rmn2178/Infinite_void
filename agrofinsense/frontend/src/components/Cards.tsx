import React from 'react';
import { THEME } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const circleStyle: React.CSSProperties = {
  position: 'absolute',
  width: 180,
  height: 180,
  borderRadius: '50%',
  background: THEME.emeraldDark,
  top: -40,
  right: -40,
  pointerEvents: 'none',
};

export function AccentCard({ children, style }: CardProps) {
  return (
    <div style={{ background: THEME.darkForest, borderRadius: 16, padding: '20px 24px', position: 'relative', overflow: 'hidden', ...style }}>
      <div style={{ ...circleStyle, opacity: 0.15 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

export function DarkCard({ children, style }: CardProps) {
  return (
    <div style={{ background: THEME.nearBlack, border: '1px solid ' + THEME.emeraldDark, borderRadius: 16, padding: '16px 20px', position: 'relative', overflow: 'hidden', ...style }}>
      <div style={{ ...circleStyle, opacity: 0.08 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

export function LightCard({ children, style }: CardProps) {
  const baseShadow = '0 2px 8px rgba(27,67,50,0.06)';
  const hoverShadow = '0 6px 16px rgba(27,67,50,0.1)';
  return (
    <div 
      style={{ background: THEME.creamWhite, border: '1.5px solid ' + THEME.deepSandal, borderRadius: 16, padding: '20px 24px', boxShadow: baseShadow, transition: 'all 0.2s', ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = hoverShadow; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = baseShadow; }}
    >
      {children}
    </div>
  );
}

export function SandalCard({ children, style }: CardProps) {
  return (
    <div style={{ background: THEME.lightSandal, border: '1px solid ' + THEME.warmSandal, borderRadius: 12, padding: '16px 20px', ...style }}>
      {children}
    </div>
  );
}
