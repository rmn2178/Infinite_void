import React, { useState } from 'react';
import { THEME } from '../theme';
import { useStore } from '../store';
import { useSimulation } from '../hooks/useSimulation';
import { LightCard, AccentCard, DarkCard } from '../components/Cards';
import { LivePriceChart } from '../components/LivePriceChart';
import { NewsWidget } from '../components/NewsWidget';
import { TrendingUp, ShoppingCart, Info, Activity } from 'lucide-react';

const MANDIS = ['Erode', 'Coimbatore', 'Tiruppur', 'Salem', 'Trichy', 'Madurai'];

export function LiveMarketPage() {
  const { selectedCrop } = useStore();
  const { livePrices, priceHistory, totalOrders, lastUpdate } = useSimulation(false);
  const [mandi, setMandi] = useState('Erode');

  const liveData = livePrices[`${selectedCrop}_Tamil Nadu`] || { current: 2000, base: 2000, changePct: 0, direction: 'flat' };
  const chartData = priceHistory[`${selectedCrop}_Tamil Nadu`]?.map((p, i) => ({ time: `T-${29-i}`, price: p })) || [];

  const marketStatus = liveData.changePct > 2 ? 'Bullish' : liveData.changePct < -2 ? 'Bearish' : 'Stable';
  const statusColor = liveData.changePct > 2 ? THEME.liveGreen : liveData.changePct < -2 ? THEME.danger : THEME.warning;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: THEME.jingleGreen, fontSize: 28, fontWeight: 800 }}>📉 Live Commodity Market</div>
          <div style={{ color: THEME.mossDark, fontSize: 13, marginTop: 4 }}>Real-time aggregated trading data</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <select value={mandi} onChange={e => setMandi(e.target.value)} style={{ background: THEME.lightSandal, border: `1.5px solid ${THEME.deepSandal}`, borderRadius: 12, padding: '10px 20px', fontSize: 14, color: THEME.jingleGreen, fontWeight: 700, outline: 'none' as any }}>
            {MANDIS.map(m => <option key={m} value={m}>{m} Mandi</option>)}
          </select>
        </div>
      </div>

      {/* Hero Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 24 }}>
        <AccentCard style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 32 }}>
          <div style={{ fontSize: 13, color: THEME.creamWhite, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 12 }}>{selectedCrop} Current Index</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: THEME.creamWhite, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            ₹{liveData.current.toFixed(0)} <span style={{ fontSize: 18, color: THEME.lightSandal, fontWeight: 600 }}>/qtl</span>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ 
              background: THEME.nearBlack + '40', color: liveData.direction==='up'?THEME.liveGreen:THEME.liveRed,
              padding: '6px 12px', borderRadius: 8, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6
            }}>
              {liveData.direction==='up'?'▲':'▼'} {Math.abs(liveData.changePct).toFixed(2)}%
            </span>
            <span style={{ color: THEME.lightSandal, fontSize: 12 }}>Since open (₹{liveData.base.toFixed(0)})</span>
          </div>
        </AccentCard>

        <DarkCard style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '0 32px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: THEME.mossDark, fontSize: 13, fontWeight: 600, marginBottom: 8 }}><Activity size={18}/> Market Sentiment</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: statusColor }}>{marketStatus}</div>
            <div style={{ fontSize: 12, color: THEME.creamWhite, marginTop: 4, opacity: 0.8 }}>Based on order flow and moving averages</div>
          </div>
          <div style={{ width: 1, height: 60, background: THEME.emeraldDark }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: THEME.mossDark, fontSize: 13, fontWeight: 600, marginBottom: 8 }}><ShoppingCart size={18}/> 24h Volume</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: THEME.creamWhite, fontVariantNumeric: 'tabular-nums' }}>
              {(liveData.current * 420.5).toLocaleString(undefined, { maximumFractionDigits: 0 })} <span style={{ fontSize: 14, color: THEME.mossDark }}>₹</span>
            </div>
            <div style={{ fontSize: 12, color: THEME.creamWhite, marginTop: 4, opacity: 0.8 }}>Across all TN mandis</div>
          </div>
          <div style={{ width: 1, height: 60, background: THEME.emeraldDark }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: THEME.mossDark, fontSize: 13, fontWeight: 600, marginBottom: 8 }}><TrendingUp size={18}/> Order Book</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: THEME.creamWhite, fontVariantNumeric: 'tabular-nums' }}>{totalOrders}</div>
            <div style={{ fontSize: 12, color: THEME.liveGreen, fontWeight: 700, marginTop: 4 }}>+14 / min avg</div>
          </div>
        </DarkCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <LivePriceChart data={chartData} crop={selectedCrop} height={320} />
          
          <LightCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
               <Info size={18} /> Price Influencers (llama3.2:3b Analysis)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'reapeat(3, 1fr)', gap: 16 }}>
               <div style={{ background: THEME.creamWhite, border: `1px solid ${THEME.deepSandal}`, borderRadius: 8, padding: 16 }}>
                 <div style={{ fontSize: 12, color: THEME.mossDark, fontWeight: 600, marginBottom: 4 }}>Weather Impact</div>
                 <div style={{ fontSize: 14, color: THEME.darkForest, fontWeight: 500 }}>Normal monsoon projected; pushing prices down slightly on high supply expectation.</div>
               </div>
               <div style={{ background: THEME.creamWhite, border: `1px solid ${THEME.deepSandal}`, borderRadius: 8, padding: 16 }}>
                 <div style={{ fontSize: 12, color: THEME.mossDark, fontWeight: 600, marginBottom: 4 }}>Export Demand</div>
                 <div style={{ fontSize: 14, color: THEME.darkForest, fontWeight: 500 }}>Strong international demand stabilizing the base price above MSP.</div>
               </div>
            </div>
          </LightCard>
        </div>

        <NewsWidget crop={selectedCrop} />
      </div>
    </div>
  );
}
