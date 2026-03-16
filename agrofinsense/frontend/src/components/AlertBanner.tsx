import React, { useState, useEffect } from 'react';
import { THEME } from '../theme';
import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '../api';
import { X, AlertTriangle } from 'lucide-react';

export function AlertBanner({ district }: { district: string }) {
  const { data: alerts } = useQuery({ queryKey: ['alerts', district], queryFn: () => getAlerts(district), refetchInterval: 300000 });
  const [dismissed, setDismissed] = useState<number[]>([]);

  const activeAlerts = (alerts || []).filter((a: any) => !dismissed.includes(a.id));

  useEffect(() => {
    activeAlerts.forEach((a: any) => {
      if (a.level === 'LOW') {
        const t = setTimeout(() => {
          setDismissed(prev => [...prev, a.id]);
        }, 5000);
        return () => clearTimeout(t);
      }
    });
  }, [activeAlerts]);

  if (!activeAlerts.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
      {activeAlerts.map((a: any) => {
        const isHigh = a.level === 'HIGH';
        const bg = isHigh ? THEME.danger + '15' : a.level === 'MODERATE' ? THEME.warning + '20' : THEME.lightSandal;
        const color = isHigh ? THEME.danger : a.level === 'MODERATE' ? '#B9770E' : THEME.jingleGreen;

        return (
          <div key={a.id} style={{
            background: bg, borderLeft: `4px solid ${color}`, borderRadius: 8, padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'slide-in-right 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertTriangle size={18} color={color} />
              <span style={{ color: THEME.darkJungle, fontSize: 13, fontWeight: 500 }}>{a.message}</span>
            </div>
            <button onClick={() => setDismissed(prev => [...prev, a.id])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: THEME.mossDark, display: 'flex' }}>
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
