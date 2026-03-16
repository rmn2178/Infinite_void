import React, { useEffect, useState } from 'react';
import { THEME } from '../theme';
import { useStore, PriceUpdate } from '../store';
import { useQuery } from '@tanstack/react-query';
import { getRecommendation, getAlerts, getNdvi, getEnergy, getAqi } from '../api';
import { useSimulation } from '../hooks/useSimulation';
import { LightCard, DarkCard, SandalCard } from '../components/Cards';
import { MetricCard } from '../components/MetricCard';
import { AlertBanner } from '../components/AlertBanner';
import { NewsWidget } from '../components/NewsWidget';
import { VoiceAdvisory } from '../components/VoiceAdvisory';
import { LivePriceChart } from '../components/LivePriceChart';
import { ShieldAlert, TrendingUp, Sun, Wind, UploadCloud, LineChart, MapPin, FileText, Droplets, Wheat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FarmerDashboard() {
  const { farmer, selectedCrop, selectedDistrict, livePrices: globalLivePrices, addLivePrice } = useStore();
  const { livePrices } = useSimulation(false); // Local fallback sim
  const navigate = useNavigate();
  const [wsConnected, setWsConnected] = useState(false);

  // Queries
  const { data: rec } = useQuery({ queryKey: ['recommendation', farmer?.farmer_id], queryFn: () => getRecommendation(farmer!.farmer_id), refetchInterval: 5000, enabled: !!farmer });
  const { data: ndvi } = useQuery({ queryKey: ['ndvi', selectedDistrict], queryFn: () => getNdvi(selectedDistrict), staleTime: 300000 });
  const { data: alerts } = useQuery({ queryKey: ['alerts', selectedDistrict], queryFn: () => getAlerts(selectedDistrict), staleTime: 300000 });
  const { data: energy } = useQuery({ queryKey: ['energy', selectedDistrict], queryFn: () => getEnergy(selectedDistrict), staleTime: 300000 });
  const { data: aqi } = useQuery({ queryKey: ['aqi', selectedDistrict], queryFn: () => getAqi(selectedDistrict), staleTime: 300000 });

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/prices/${selectedCrop}/${selectedDistrict}`);
    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') addLivePrice(data as PriceUpdate);
    };
    return () => ws.close();
  }, [selectedCrop, selectedDistrict, addLivePrice]);

  const simPrice = livePrices[`${selectedCrop}_${selectedDistrict}`] || livePrices[`${selectedCrop}_Tamil Nadu`] || { current: 2000, changePct: 0, direction: 'flat' };
  
  const chartData = globalLivePrices.filter(p => p.crop === selectedCrop).map(p => ({ time: new Date(p.date).toLocaleTimeString(), price: p.price }));
  if (chartData.length === 0) {
    chartData.push({ time: new Date().toLocaleTimeString(), price: simPrice.current });
  }

  const quickActions = [
    { label: 'Upload Soil', icon: <UploadCloud size={16}/>, path: '/soil-upload' },
    { label: 'Price Chart', icon: <LineChart size={16}/>, path: '/prices' },
    { label: 'Find Stores', icon: <MapPin size={16}/>, path: '/stores' },
    { label: 'My Schemes', icon: <FileText size={16}/>, path: '/schemes' }
  ];

  const topCrops = rec?.recommended_crops || [
    { name: 'Rice', score: 86, soil_match: 9, weather_match: 8 },
    { name: 'Maize', score: 82, soil_match: 8, weather_match: 8 },
    { name: 'Groundnut', score: 78, soil_match: 7, weather_match: 9 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AlertBanner district={selectedDistrict} />

      {/* METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <MetricCard label="Risk Score" value={(rec?.risk_profile?.risk_score || 45).toString()} unit="/100" trend={rec?.risk_profile?.risk_score < 50 ? 'down' : 'up'} icon={<ShieldAlert size={20}/>} />
        <MetricCard label="Live Price" value={`₹${simPrice.current.toFixed(0)}`} unit="/qtl" trend={simPrice.direction} trendPct={simPrice.changePct.toFixed(1)} icon={<TrendingUp size={20}/>} />
        <MetricCard label="Top Crop" value={topCrops[0]?.name || selectedCrop} icon={<Wheat size={20}/>} />
        <MetricCard label="Active Schemes" value="3" icon={<FileText size={20}/>} />
        <MetricCard label="Crop Health" value={ndvi?.mean_ndvi ? (ndvi.mean_ndvi * 100).toFixed(0) : '85'} unit="%" trend="up" icon={<Droplets size={20}/>} />
        <MetricCard label="Weather Risk" value={alerts?.length ? 'HIGH ⚠️' : 'LOW ✅'} icon={<Sun size={20}/>} />
        <MetricCard label="Solar Potential" value={energy?.avg_ghi ? (energy.avg_ghi * 30).toFixed(0) : '150'} unit="kWh/mo" icon={<Sun size={20}/>} />
        <MetricCard label="Air Quality" value={aqi?.current?.european_aqi || 42} unit="AQI" icon={<Wind size={20}/>} />
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display: 'flex', gap: 16 }}>
        {quickActions.map(a => (
          <button key={a.label} onClick={() => navigate(a.path)} style={{ background: THEME.darkForest, color: THEME.creamWhite, borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 0.2s' }}>
            {a.icon} {a.label}
          </button>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24 }}>
        <div style={{ position: 'relative' }}>
          <LivePriceChart data={chartData} crop={selectedCrop} />
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: wsConnected ? THEME.liveGreen : THEME.warning, animation: wsConnected ? 'pulse-live 2s infinite' : 'none' }} />
            <span style={{ color: THEME.mossDark, fontSize: 11 }}>{wsConnected ? 'Live' : 'Connecting...'}</span>
          </div>
        </div>

        <LightCard style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <span style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700 }}>AI Reasoning</span>
            <span style={{ background: THEME.lightSandal, color: THEME.darkForest, padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>via llama3.2:3b</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: THEME.lightSandal, padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: THEME.mossDark, textTransform: 'uppercase', fontWeight: 600 }}>Yield Prediction</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums' }}>{rec?.yield_prediction?.estimated_yield_kg_per_ha || 4500} <span style={{ fontSize: 12 }}>kg/ha</span></div>
            </div>
            <div style={{ background: THEME.lightSandal, padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: THEME.mossDark, textTransform: 'uppercase', fontWeight: 600 }}>Limiting Factor</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: THEME.danger }}>{rec?.yield_prediction?.limiting_factor || 'Potassium deficiency'}</div>
            </div>
            <div style={{ background: THEME.emeraldDark + '15', borderLeft: `4px solid ${THEME.emeraldDark}`, padding: 12, borderRadius: '0 8px 8px 0', fontSize: 13, color: THEME.darkJungle, lineHeight: 1.5 }}>
              {rec?.yield_prediction?.recommendation || 'Apply 40kg/ha of MOP during basal dose to correct potassium deficiency and improve disease resistance.'}
            </div>
          </div>
          {farmer && (
            <div style={{ marginTop: 16 }}>
              <VoiceAdvisory farmerId={farmer.farmer_id} />
            </div>
          )}
        </LightCard>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 24 }}>
        <LightCard>
          <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Top 3 Crops</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topCrops.map((c: any, i: number) => (
              <SandalCard key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: THEME.creamWhite, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: THEME.jingleGreen }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: THEME.mossDark, display: 'flex', gap: 8 }}>
                    <span>Soil: {c.soil_match}/10</span>
                    <span>Weather: {c.weather_match}/10</span>
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: THEME.emeraldDark, fontVariantNumeric: 'tabular-nums' }}>
                  {c.score}/100
                </div>
              </SandalCard>
            ))}
          </div>
        </LightCard>

        <NewsWidget />
      </div>

    </div>
  );
}
