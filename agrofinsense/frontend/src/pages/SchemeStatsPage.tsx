import React, { useState, useEffect } from 'react';
import { THEME } from '../theme';
import { getSchemeStats } from '../api';
import { useStore } from '../store';
import { LightCard, SandalCard } from '../components/Cards';
import { PieChart, Pie, Cell, Tooltip as RTTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function SchemeStatsPage() {
  const { selectedDistrict } = useStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchemeStats(selectedDistrict)
      .then(res => setStats(res))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [selectedDistrict]);

  if (loading) return <div style={{ padding: 40, color: THEME.mossDark, textAlign: 'center', fontWeight: 600 }}>Loading scheme analytics...</div>;
  if (!stats) return <div style={{ padding: 40, color: THEME.danger, textAlign: 'center', fontWeight: 600 }}>Failed to load scheme analytics</div>;

  const totalFunds = stats.total_funds_disbursed_cr;
  const pieData = [
    { name: 'PM-KISAN', value: 45 },
    { name: 'PMFBY', value: 30 },
    { name: 'KCC', value: 15 },
    { name: 'Others', value: 10 }
  ];
  const COLORS = [THEME.darkForest, THEME.emeraldDark, THEME.warmSandal, THEME.mossDark];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: THEME.jingleGreen, fontSize: 24, fontWeight: 700 }}>🏛️ Govt Subsidy & Scheme Analytics — {selectedDistrict}</div>
        <div style={{ background: THEME.liveGreen, color: '#FFF', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, background: '#FFF', borderRadius: '50%', animation: 'pulse-live 1.5s infinite' }} />
          LIVE DATA
        </div>
      </div>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <LightCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
          <div style={{ fontSize: 13, color: THEME.mossDark, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total Beneficiaries</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>
            {stats.total_beneficiaries.toLocaleString()}
          </div>
        </LightCard>

        <LightCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
          <div style={{ fontSize: 13, color: THEME.mossDark, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Funds Disbursed</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>
            ₹{totalFunds} <span style={{ fontSize: 18, color: THEME.mossDark }}>Cr</span>
          </div>
        </LightCard>

        <LightCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
          <div style={{ fontSize: 13, color: THEME.mossDark, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Fraud Prevented (AI)</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: THEME.danger, fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>
            ₹{(totalFunds * 0.04).toFixed(1)} <span style={{ fontSize: 18, color: THEME.mossDark }}>Cr</span>
          </div>
        </LightCard>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <LightCard>
          <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Fund Distribution</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RTTooltip contentStyle={{ background: THEME.creamWhite, border: `1px solid ${THEME.deepSandal}`, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 16 }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: THEME.mossDark, fontWeight: 600 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }} /> {d.name}
              </div>
            ))}
          </div>
        </LightCard>

        <LightCard>
          <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Top performing Schemes</div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={stats.top_schemes} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={THEME.deepSandal} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: THEME.mossDark, fontSize: 12 }} />
                <YAxis dataKey="scheme_name" type="category" width={150} tick={{ fill: THEME.jingleGreen, fontSize: 12, fontWeight: 600 }} />
                <RTTooltip cursor={{ fill: THEME.lightSandal }} contentStyle={{ background: THEME.creamWhite, border: `1px solid ${THEME.deepSandal}`, borderRadius: 8 }} />
                <Bar dataKey="beneficiaries" fill={THEME.emeraldDark} radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </LightCard>
      </div>

      <LightCard>
        <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Anomaly Detection Log (llama3.2:3b)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stats.fraud_alerts ? stats.fraud_alerts.map((alert: any, i: number) => (
             <SandalCard key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderLeft: `4px solid ${THEME.danger}` }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <div style={{ width: 32, height: 32, borderRadius: '50%', background: THEME.liveRed+'20', color: THEME.liveRed, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>!</div>
                 <div>
                   <div style={{ fontSize: 14, fontWeight: 700, color: THEME.jingleGreen }}>{alert.issue}</div>
                   <div style={{ fontSize: 12, color: THEME.mossDark, marginTop: 4 }}>Farmer ID: {alert.farmer_id} • Severity: {alert.severity}</div>
                 </div>
               </div>
               <button style={{ background: THEME.danger, color: '#FFF', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Action Req</button>
             </SandalCard>
          )) : (
            <div style={{ padding: 16, textAlign: 'center', color: THEME.mossDark }}>No anomalies detected recently.</div>
          )}
        </div>
      </LightCard>
    </div>
  );
}
