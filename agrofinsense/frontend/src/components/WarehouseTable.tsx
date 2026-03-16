import React from 'react';
import { THEME } from '../theme';
import { LightCard } from './Cards';

export interface WarehouseRow {
  name: string;
  type: string;
  capacity_mt: number;
  stock_mt: number;
  status: string;
  utilisation: number;
  temperature?: number;
}

export function WarehouseTable({ warehouses }: { warehouses: WarehouseRow[] }) {
  const getUtilBg = (u: number) => {
    if (u < 60) return '#D4EDDA';
    if (u < 80) return '#FFF3CD';
    return '#F8D7DA';
  };

  const getUtilText = (u: number) => {
    if (u < 60) return '#155724';
    if (u < 80) return '#856404';
    return '#721C24';
  };

  return (
    <LightCard>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
          <thead>
            <tr style={{ color: THEME.mossDark, borderBottom: `2px solid ${THEME.deepSandal}` }}>
              <th style={{ padding: '12px 8px' }}>Name</th>
              <th style={{ padding: '12px 8px' }}>Type</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Capacity MT</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Stock MT</th>
              <th style={{ padding: '12px 8px' }}>Utilisation %</th>
              <th style={{ padding: '12px 8px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px 8px', textAlign: 'center' }}>Cold ❄️</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${THEME.deepSandal}`, background: i % 2 === 0 ? THEME.creamWhite : THEME.lightSandal }}>
                <td style={{ padding: '12px 8px', color: THEME.jingleGreen, fontWeight: 600 }}>{w.name}</td>
                <td style={{ padding: '12px 8px', color: THEME.mossDark }}>{w.type}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums' }}>{w.capacity_mt.toLocaleString()}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums' }}>{w.stock_mt.toLocaleString()}</td>
                <td style={{ padding: '12px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: THEME.warmSandal, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${w.utilisation}%`, height: '100%', background: w.utilisation > 85 ? THEME.danger : THEME.darkForest }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: THEME.jingleGreen, minWidth: 32 }}>{w.utilisation.toFixed(0)}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                  <span style={{ 
                    background: getUtilBg(w.utilisation), color: getUtilText(w.utilisation), 
                    padding: '4px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700, textTransform: 'uppercase'
                  }}>
                    {w.status}
                  </span>
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center', color: THEME.mossDark }}>
                  {w.temperature ? `${w.temperature}°C` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LightCard>
  );
}
