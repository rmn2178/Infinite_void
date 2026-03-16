import React, { useState, useEffect } from 'react';
import { THEME } from '../theme';
import { getHeatmap } from '../api';
import TamilNaduMap, { HeatmapRow } from '../components/TamilNaduMap';
import { LightCard, AccentCard, DarkCard } from '../components/Cards';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Map, Leaf, TrendingUp, AlertTriangle, Building, Box } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTTooltip } from 'recharts';

export function GovDashboard() {
  const [season, setSeason] = useState('Kharif 2025');
  const navigate = useNavigate();

  const { data: heatmapData, isLoading } = useQuery({
    queryKey: ['heatmap', 'Tamil Nadu', season],
    queryFn: () => getHeatmap('Tamil Nadu', season)
  });

  const totalTonnage = heatmapData?.reduce((sum: number, r: HeatmapRow) => sum + r.tonnage_mt, 0) || 1245000;
  const totalBudget = heatmapData?.reduce((sum: number, r: HeatmapRow) => sum + r.budget_cr, 0) || 342;
  const highRiskCount = heatmapData?.filter((r: HeatmapRow) => r.risk_level === 'High').length || 4;

  const mspData = [
    { name: 'Rice (Paddy)', pct: 45 }, { name: 'Groundnut', pct: 25 },
    { name: 'Maize', pct: 20 }, { name: 'Others', pct: 10 }
  ];
  const COLORS = [THEME.darkForest, THEME.emeraldDark, THEME.warmSandal, THEME.mossDark];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: THEME.jingleGreen, fontSize: 24, fontWeight: 700 }}>🏛️ State Command Center</div>
          <div style={{ color: THEME.mossDark, fontSize: 13, marginTop: 4 }}>Tamil Nadu Agriculture & Farmer Welfare</div>
        </div>
        <select value={season} onChange={e => setSeason(e.target.value)} style={{ background: THEME.lightSandal, border: `1.5px solid ${THEME.deepSandal}`, borderRadius: 12, padding: '10px 20px', fontSize: 14, color: THEME.jingleGreen, fontWeight: 700, outline: 'none' as any }}>
          <option>Kharif 2025</option><option>Rabi 2024</option><option>Zaid 2024</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <AccentCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Map size={24} color={THEME.warmSandal} />
            <span style={{ color: THEME.creamWhite, fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>Total Districts</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: THEME.creamWhite, fontVariantNumeric: 'tabular-nums' }}>38</div>
          <div style={{ fontSize: 12, color: THEME.lightSandal, marginTop: 4 }}>Active coverage</div>
        </AccentCard>

        <LightCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Leaf size={24} color={THEME.emeraldDark} />
            <span style={{ color: THEME.mossDark, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. State Yield</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {(totalTonnage / 100000).toFixed(1)} <span style={{ fontSize: 14, color: THEME.mossDark, fontWeight: 600 }}>Lakh MT</span>
          </div>
          <div style={{ fontSize: 12, color: THEME.liveGreen, fontWeight: 700, marginTop: 4 }}>▲ 2.4% vs last year</div>
        </LightCard>

        <LightCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <TrendingUp size={24} color={THEME.emeraldDark} />
            <span style={{ color: THEME.mossDark, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheme Budget</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 4 }}>
            ₹{totalBudget} <span style={{ fontSize: 14, color: THEME.mossDark, fontWeight: 600 }}>Cr</span>
          </div>
          <div style={{ width: '100%', height: 4, background: THEME.lightSandal, borderRadius: 2, marginTop: 8 }}>
            <div style={{ width: '65%', height: '100%', background: THEME.emeraldDark, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 11, color: THEME.mossDark, marginTop: 4 }}>65% Disbursed</div>
        </LightCard>

        <DarkCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <AlertTriangle size={24} color={THEME.liveRed} />
            <span style={{ color: THEME.creamWhite, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Districts at Risk</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: THEME.danger, fontVariantNumeric: 'tabular-nums' }}>{highRiskCount}</div>
          <div style={{ fontSize: 12, color: THEME.warmSandal, marginTop: 4 }}>Action required</div>
        </DarkCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.5fr) 1fr', gap: 24 }}>
        <LightCard style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span style={{ color: THEME.jingleGreen, fontSize: 18, fontWeight: 700 }}>Yield & Risk Heatmap</span>
            <span style={{ fontSize: 12, color: THEME.mossDark, background: THEME.lightSandal, padding: '4px 12px', borderRadius: 12, fontWeight: 600 }}>Click district for details</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isLoading ? <span style={{ color: THEME.mossDark }}>Loading map...</span> : 
              <TamilNaduMap data={heatmapData || []} onDistrictClick={(d) => navigate(`/district/${d}`)} />
            }
          </div>
        </LightCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <LightCard>
            <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Procurement Distribution</div>
            <div style={{ height: 180, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mspData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="pct" stroke="none">
                    {mspData.map((e, index) => <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RTTooltip contentStyle={{ background: THEME.creamWhite, border: `1px solid ${THEME.deepSandal}`, borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: THEME.jingleGreen }}>1.2M</div>
                  <div style={{ fontSize: 10, color: THEME.mossDark, fontWeight: 700 }}>TONNES</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 8 }}>
              {mspData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: THEME.mossDark, fontWeight: 700 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i] }} /> {d.name}
                </div>
              ))}
            </div>
          </LightCard>

          <DarkCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: THEME.creamWhite, fontSize: 16, fontWeight: 700 }}>High Risk Districts</span>
              <button style={{ background: 'transparent', color: THEME.warmSandal, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {heatmapData?.filter((r: HeatmapRow) => r.risk_level === 'High').slice(0, 3).map((r: HeatmapRow) => (
                <div key={r.district} onClick={() => navigate(`/district/${r.district}`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: THEME.nearBlack, border: `1px solid ${THEME.liveRed}30`, borderRadius: 8, padding: '12px 16px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = THEME.liveRed+'15'} onMouseLeave={e => e.currentTarget.style.background = THEME.nearBlack}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <AlertTriangle size={18} color={THEME.liveRed} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: THEME.creamWhite }}>{r.district}</div>
                      <div style={{ fontSize: 11, color: THEME.mossDark, marginTop: 2 }}>{r.tonnage_mt.toLocaleString()} MT expected</div>
                    </div>
                  </div>
                  <span style={{ background: THEME.liveRed+'20', color: THEME.liveRed, padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Critical</span>
                </div>
              ))}
            </div>
          </DarkCard>
        </div>
      </div>
    </div>
  );
}
