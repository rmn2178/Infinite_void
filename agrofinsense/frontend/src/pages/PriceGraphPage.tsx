import React, { useState, useEffect } from 'react';
import { THEME } from '../theme';
import { useStore } from '../store';
import { useSimulation } from '../hooks/useSimulation';
import { LightCard, DarkCard } from '../components/Cards';
import { ComposedChart, ScatterChart, Scatter, Area, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const CROPS = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Groundnut', 'Cotton', 'Banana', 'Tomato'];
const STATES = ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Maharashtra', 'Punjab', 'Madhya Pradesh'];
const MSP: Record<string, number> = { Rice:2300, Wheat:2275, Maize:2090, Sugarcane:315, Groundnut:6377, Cotton:7020, Banana:1800, Tomato:2200 };
const RAINFALL_YIELD = [
  { crop: 'Rice', rain: 1200, yield: 4500 }, { crop: 'Wheat', rain: 600, yield: 3500 },
  { crop: 'Maize', rain: 800, yield: 4000 }, { crop: 'Sugarcane', rain: 1500, yield: 80000 },
  { crop: 'Groundnut', rain: 500, yield: 2000 }, { crop: 'Cotton', rain: 700, yield: 1500 },
  { crop: 'Banana', rain: 1800, yield: 40000 }, { crop: 'Tomato', rain: 600, yield: 25000 }
];

export function PriceGraphPage() {
  const { selectedCrop, setSelectedCrop } = useStore();
  const [district, setDistrict] = useState('Tamil Nadu');
  const { livePrices, priceHistory, gainers, losers, lastUpdate } = useSimulation(false);
  const [feed, setFeed] = useState<{time:string, text:string, type:'up'|'down'|'flat'}[]>([]);

  // Chart data calculation
  const histData = priceHistory[`${selectedCrop}_${district}`]?.map((p, i) => ({ time: `T-${29-i}`, price: p })) || [];
  const stateData = STATES.map(s => ({ state: s, price: livePrices[`${selectedCrop}_${s}`]?.current || 2000 }));
  const currentPrice = livePrices[`${selectedCrop}_${district}`]?.current || MSP[selectedCrop];

  // Feed simulation
  useEffect(() => {
    const crops = Object.keys(livePrices);
    const pick = crops[Math.floor(Math.random() * crops.length)];
    if (!pick) return;
    const p = livePrices[pick];
    if (p.direction === 'flat') return;
    
    const [c, s] = pick.split('_');
    const entry = {
      time: lastUpdate,
      text: `${c}/${s.substring(0,6)} ₹${p.base.toFixed(0)} ${p.direction==='up'?'▲':'▼'} ₹${p.current.toFixed(0)}`,
      type: p.direction
    };
    
    setFeed(prev => [entry, ...prev].slice(0, 15));
  }, [lastUpdate, livePrices]);

  // Index calculation
  const tnIndex = CROPS.reduce((sum, c) => sum + (livePrices[`${c}_Tamil Nadu`]?.current || 0), 0) / CROPS.length;
  const tnBase = CROPS.reduce((sum, c) => sum + MSP[c], 0) / CROPS.length;
  const tnChange = ((tnIndex - tnBase) / tnBase) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: THEME.jingleGreen, fontSize: 24, fontWeight: 700 }}>📊 Live Market Prices — {district}</div>
        <select value={district} onChange={e => setDistrict(e.target.value)} style={{ background: THEME.lightSandal, border: `1.5px solid ${THEME.deepSandal}`, borderRadius: 12, padding: '10px 16px', fontSize: 14, color: THEME.jingleGreen, fontWeight: 600 }}>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
        {CROPS.map(c => (
          <button key={c} onClick={() => setSelectedCrop(c)} style={{
            background: selectedCrop === c ? THEME.darkForest : THEME.lightSandal,
            color: selectedCrop === c ? THEME.creamWhite : THEME.jingleGreen,
            border: `1px solid ${selectedCrop === c ? THEME.darkForest : THEME.deepSandal}`,
            borderRadius: 20, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
          }}>
            {c}
          </button>
        ))}
      </div>

      {/* Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        <DarkCard style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: THEME.creamWhite, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Live Price Movement — {selectedCrop}</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={histData}>
                <CartesianGrid stroke={THEME.emeraldDark} strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis dataKey="time" tick={{ fill: THEME.mossDark, fontSize: 10 }} stroke={THEME.emeraldDark} />
                <YAxis tick={{ fill: THEME.mossDark, fontSize: 10, fontFamily: 'tabular-nums' }} stroke="transparent" domain={['dataMin - 50', 'dataMax + 50']} tickFormatter={v=>Math.round(v).toString()} />
                <Tooltip contentStyle={{ background: THEME.nearBlack, border: `1px solid ${THEME.emeraldDark}`, borderRadius: 8, color: THEME.creamWhite, fontSize: 12 }} />
                <Area type="monotone" dataKey="price" fill="rgba(221,184,146,0.15)" stroke="transparent" isAnimationActive={false} />
                <Line type="monotone" dataKey="price" stroke={THEME.deepSandal} strokeWidth={2} dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </DarkCard>

        <LightCard style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>State-wise Prices</div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke={THEME.deepSandal} strokeDasharray="3 3" strokeOpacity={0.5} horizontal={false} />
                <XAxis type="number" tick={{ fill: THEME.mossDark, fontSize: 10, fontFamily: 'tabular-nums' }} />
                <YAxis dataKey="state" type="category" tick={{ fill: THEME.mossDark, fontSize: 11 }} />
                <Tooltip cursor={{ fill: THEME.lightSandal }} contentStyle={{ background: THEME.creamWhite, border: `1px solid ${THEME.deepSandal}`, borderRadius: 8, color: THEME.jingleGreen }} />
                <Bar dataKey="price" fill={THEME.darkForest} radius={[0, 4, 4, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </LightCard>
      </div>

      {/* MSP Strip */}
      <LightCard style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: THEME.mossDark, textTransform: 'uppercase' }}>MSP Comparison</div>
        <div style={{ flex: 1, height: 8, background: THEME.lightSandal, borderRadius: 4, position: 'relative' }}>
          {/* Base MSP is center, handle ±30% range */}
          <div style={{ position: 'absolute', left: '50%', top: -4, bottom: -4, width: 2, background: THEME.mossDark }} />
          <div style={{ 
            position: 'absolute', height: '100%', borderRadius: 4,
            background: currentPrice >= MSP[selectedCrop] ? THEME.liveGreen : THEME.danger,
            width: `${Math.min(50, (Math.abs(currentPrice - MSP[selectedCrop]) / MSP[selectedCrop]) * 100 * 2.5)}%`,
            left: currentPrice >= MSP[selectedCrop] ? '50%' : 'auto',
            right: currentPrice < MSP[selectedCrop] ? '50%' : 'auto',
            transition: 'all 0.3s ease'
          }} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: currentPrice >= MSP[selectedCrop] ? THEME.liveGreen : THEME.danger, fontVariantNumeric: 'tabular-nums', display: 'flex', gap: 8, alignItems: 'center' }}>
          ₹{currentPrice.toFixed(0)} <span style={{ fontSize: 12, color: THEME.mossDark, fontWeight: 500 }}>vs MSP ₹{MSP[selectedCrop]}</span>
        </div>
      </LightCard>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        <DarkCard>
          <div style={{ color: THEME.creamWhite, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Yield vs Rainfall</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 10 }}>
                <CartesianGrid stroke={THEME.emeraldDark} strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis dataKey="rain" name="Rainfall" unit="mm" tick={{ fill: THEME.mossDark, fontSize: 10 }} stroke={THEME.emeraldDark} />
                <YAxis dataKey="yield" name="Yield" unit="kg" tick={{ fill: THEME.mossDark, fontSize: 10 }} stroke="transparent" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: THEME.nearBlack, border: `1px solid ${THEME.emeraldDark}`, borderRadius: 8 }} />
                <Scatter data={RAINFALL_YIELD} fill={THEME.deepSandal} isAnimationActive={false} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </DarkCard>

        <LightCard>
          <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Tamil Nadu Index</div>
          <div style={{ display: 'flex', flexDirection: 'column', height: 220, justifyContent: 'center', alignItems: 'center' }}>
            <TrendingUp size={48} color={tnChange >= 0 ? THEME.liveGreen : THEME.danger} style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 40, fontWeight: 800, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums' }}>₹{tnBase.toFixed(0)}</div>
            <div style={{ 
              background: tnChange >= 0 ? THEME.liveGreen+'20' : THEME.liveRed+'20', 
              color: tnChange >= 0 ? THEME.liveGreen : THEME.liveRed,
              padding: '4px 12px', borderRadius: 8, fontSize: 16, fontWeight: 700, marginTop: 12
            }}>
              {tnChange >= 0 ? '▲' : '▼'} {Math.abs(tnChange).toFixed(1)}%
            </div>
          </div>
        </LightCard>

        <div style={{ background: THEME.nearBlack, border: `1px solid ${THEME.emeraldDark}`, borderRadius: 16, padding: 20, fontFamily: "'Courier New', monospace", display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: THEME.liveGreen, fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            ● LIVE MARKET FEED <span style={{ width: 8, height: 16, background: THEME.liveGreen, animation: 'pulse-live 1s infinite' }} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {feed.map((f, i) => (
              <div key={i} style={{ fontSize: 12, display: 'flex', gap: 8, animation: 'slide-up 0.3s ease', opacity: 1 - (i * 0.08) }}>
                <span style={{ color: THEME.emeraldDark }}>[{f.time}]</span>
                <span style={{ color: THEME.creamWhite, flex: 1 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
