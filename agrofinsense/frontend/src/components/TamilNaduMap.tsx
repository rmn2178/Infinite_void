import React, { useState } from 'react';
import { THEME } from '../theme';

export interface HeatmapRow {
  district: string;
  tonnage_mt: number;
  budget_cr: number;
  risk_level: string;
}

const DISTRICT_POSITIONS: Record<string, { cx: number, cy: number }> = {
  Chennai: { cx: 420, cy: 60 }, Vellore: { cx: 320, cy: 80 }, Tiruvallur: { cx: 390, cy: 90 },
  Kancheepuram: { cx: 400, cy: 130 }, Krishnagiri: { cx: 290, cy: 120 }, Dharmapuri: { cx: 260, cy: 150 },
  Salem: { cx: 280, cy: 190 }, Namakkal: { cx: 290, cy: 230 }, Erode: { cx: 230, cy: 210 },
  Coimbatore: { cx: 200, cy: 260 }, Tiruppur: { cx: 240, cy: 265 }, Karur: { cx: 310, cy: 260 },
  Nilgiris: { cx: 190, cy: 220 }, Trichy: { cx: 340, cy: 300 }, Thanjavur: { cx: 390, cy: 310 },
  Dindigul: { cx: 260, cy: 320 }, Madurai: { cx: 300, cy: 360 }, Sivaganga: { cx: 360, cy: 370 },
  Theni: { cx: 250, cy: 370 }, Virudhunagar: { cx: 320, cy: 400 }, Ramanathapuram: { cx: 390, cy: 410 },
  Tirunelveli: { cx: 280, cy: 430 }, Thoothukudi: { cx: 330, cy: 450 }, Kanniyakumari: { cx: 280, cy: 500 },
};

export default function TamilNaduMap({ data, onDistrictClick }: { data: HeatmapRow[], onDistrictClick: (d: string) => void }) {
  const [hovered, setHovered] = useState<HeatmapRow | null>(null);

  const minTonnage = Math.min(...data.map(d => d.tonnage_mt), 0);
  const maxTonnage = Math.max(...data.map(d => d.tonnage_mt), 1);

  const getColor = (tonnage: number) => {
    const ratio = maxTonnage === minTonnage ? 0 : (tonnage - minTonnage) / (maxTonnage - minTonnage);
    if (ratio < 0.5) return THEME.warmSandal;
    if (ratio < 0.8) return THEME.emeraldDark;
    return THEME.darkForest;
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 500, margin: '0 auto', background: THEME.creamWhite, border: `1px solid ${THEME.deepSandal}`, borderRadius: 16, padding: 16 }}>
      <svg viewBox="0 0 500 600" style={{ width: '100%', height: 'auto' }}>
        {Object.entries(DISTRICT_POSITIONS).map(([dist, pos]) => {
          const row = data.find(d => d.district === dist) || { district: dist, tonnage_mt: 0, budget_cr: 0, risk_level: 'Unknown' };
          const color = getColor(row.tonnage_mt);
          return (
            <g 
              key={dist} 
              transform={`translate(${pos.cx}, ${pos.cy})`}
              onMouseEnter={() => setHovered(row)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onDistrictClick(dist)}
              style={{ cursor: 'pointer' }}
            >
              <circle r={22} fill={color} stroke={THEME.creamWhite} strokeWidth={2} style={{ transition: 'fill 0.3s' }} />
              <text y={4} textAnchor="middle" fill={color === THEME.darkForest || color === THEME.emeraldDark ? THEME.creamWhite : THEME.darkJungle} fontSize={9} fontWeight={600} pointerEvents="none">
                {dist.substring(0, 5)}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
        <span style={{ fontSize: 11, color: THEME.mossDark }}>Low Yield</span>
        <div style={{ width: 120, height: 8, background: `linear-gradient(to right, ${THEME.warmSandal}, ${THEME.emeraldDark}, ${THEME.darkForest})`, borderRadius: 4 }} />
        <span style={{ fontSize: 11, color: THEME.mossDark }}>High Yield</span>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 16, left: 16, background: THEME.nearBlack, color: THEME.creamWhite,
          padding: '12px 16px', borderRadius: 8, pointerEvents: 'none', zIndex: 10, border: `1px solid ${THEME.emeraldDark}`
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: THEME.jingleGreen }}>{hovered.district}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Tonnage: <span style={{ color: THEME.warmSandal }}>{hovered.tonnage_mt.toLocaleString()} MT</span></div>
          <div style={{ fontSize: 12 }}>Budget: <span style={{ color: THEME.warmSandal }}>₹{hovered.budget_cr} Cr</span></div>
          <div style={{ fontSize: 12 }}>Risk: <span style={{ color: hovered.risk_level === 'High' ? THEME.liveRed : THEME.liveGreen }}>{hovered.risk_level}</span></div>
        </div>
      )}
    </div>
  );
}
