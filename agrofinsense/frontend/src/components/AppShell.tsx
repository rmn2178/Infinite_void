import React, { useState, useEffect } from 'react';
import { THEME } from '../theme';
import { useStore } from '../store';
import { useSimulation } from '../hooks/useSimulation';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wheat, Bell, LogOut, X } from 'lucide-react';

const STORIES = [
  { name:'Murugan K', dist:'Erode', text:'Switched to Finger Millet on AI advice', gain:'+₹28,000 income' },
  { name:'Kavitha S', dist:'Thanjavur', text:'Avoided storage loss with early sale alert', gain:'₹15,000 saved' },
  { name:'Rajan P', dist:'Madurai', text:'PMFBY claim processed in 3 days', gain:'₹42,000 insured' },
  { name:'Selvi M', dist:'Coimbatore', text:'Soil scan showed K deficiency — fixed with MOP', gain:'+22% yield' },
  { name:'Arumugam V', dist:'Salem', text:'Used price forecast to delay sale by 2 weeks', gain:'+₹8,200 profit' }
];

const NOTIFICATIONS = [
  "🌧️ Heavy rainfall expected in Trichy — check drainage",
  "📦 Rice prices up 3.2% at Trichy mandi",
  "🌾 New PM-KISAN installment released for Erode farmers",
  "⚠️ Soil moisture critically low in Tirunelveli — irrigation advised",
  "💰 Cotton MSP revised upward for Kharif 2025",
  "🚜 Harvest advisory: Rice ready for cutting in Thanjavur"
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { role, logout, ollamaStatus } = useStore();
  const [demoMode, setDemoMode] = useState(false);
  const { livePrices, totalOrders, lastUpdate } = useSimulation(demoMode);
  const navigate = useNavigate();
  const location = useLocation();

  const [storyIdx, setStoryIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setStoryIdx(p => (p + 1) % STORIES.length), 8000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setToast(NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)]);
      setTimeout(() => setToast(null), 5000);
    }, 18000);
    return () => clearInterval(id);
  }, []);

  const navLinks = role === 'officer' 
    ? [ { label: 'Gov Dashboard', path: '/gov' }, { label: 'Market', path: '/market' }, { label: 'Districts', path: '/district/Erode' }, { label: 'Schemes', path: '/scheme-stats' } ]
    : [ { label: 'Dashboard', path: '/farmer' }, { label: 'Market', path: '/market' }, { label: 'Soil Upload', path: '/soil-upload' }, { label: 'Prices', path: '/prices' }, { label: 'Schemes', path: '/schemes' }, { label: 'Find Stores', path: '/stores' } ];

  const tickerItems = Object.entries(livePrices).slice(0, 8); // Display first 8
  const story = STORIES[storyIdx];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* TOP NAVBAR */}
      <div style={{ height: 64, background: THEME.darkForest, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Wheat size={24} color={THEME.deepSandal} />
          <div>
            <div style={{ color: THEME.creamWhite, fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>AgroFinSense</div>
            <div style={{ color: THEME.mossDark, fontSize: 11 }}>Growing Your Yield.</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {navLinks.map(l => {
            const active = location.pathname.startsWith(l.path) && l.path !== '/' || (l.path === '/' && location.pathname === '/');
            return (
              <button key={l.path} onClick={() => navigate(l.path)} style={{
                background: active ? THEME.darkForest : 'transparent',
                color: active ? THEME.creamWhite : THEME.mossDark,
                border: active ? `1px solid ${THEME.emeraldDark}` : '1px solid transparent',
                borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}>
                {l.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ollamaStatus.available ? THEME.liveGreen : THEME.deepSandal, animation: ollamaStatus.available ? 'pulse-live 2s infinite' : 'none' }} />
            <span style={{ color: THEME.mossDark, fontSize: 12 }}>AI: {ollamaStatus.available ? 'Online' : 'Offline'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: THEME.liveGreen, color: '#FFF', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
            <div style={{ width: 6, height: 6, background: '#FFF', borderRadius: '50%', animation: 'pulse-live 1.5s infinite' }} />
            LIVE
          </div>
          <span style={{ color: THEME.mossDark, fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{lastUpdate}</span>
          <Bell size={20} color={THEME.warmSandal} style={{ cursor: 'pointer' }} />
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: THEME.mossDark, display: 'flex' }}><LogOut size={20} /></button>
        </div>
      </div>

      {/* PRICE TICKER */}
      <div style={{ height: 36, background: THEME.jingleGreen, display: 'flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 32, animation: 'ticker-scroll 20s linear infinite', whiteSpace: 'nowrap' }}>
          {[...tickerItems, ...tickerItems].map(([k, p], i) => (
            <span key={i} style={{ color: THEME.warmSandal, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              {k.split('_')[0]} <span style={{ fontVariantNumeric: 'tabular-nums' }}>₹{p.current.toFixed(0)}</span>
              <span style={{ color: p.direction === 'up' ? THEME.liveGreen : p.direction === 'down' ? THEME.liveRed : THEME.mossDark }}>
                {p.direction === 'up' ? '▲' : p.direction === 'down' ? '▼' : '▬'}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* IMPACT STRIP */}
      <div style={{ height: 40, background: THEME.jingleGreen, borderBottom: `1px solid ${THEME.emeraldDark}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 32, flexShrink: 0 }}>
        <span style={{ color: THEME.warmSandal, fontSize: 13, fontWeight: 600 }}>🌾 {47234 + Math.floor(totalOrders / 10)} Farmers Helped</span>
        <span style={{ color: THEME.warmSandal, fontSize: 13, fontWeight: 600 }}>📦 ₹2.3Cr Waste Prevented</span>
        <span style={{ color: THEME.warmSandal, fontSize: 13, fontWeight: 600 }}>📈 +18.4% Avg Income</span>
        <span style={{ color: THEME.warmSandal, fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>🏦 {totalOrders} Transactions</span>
        <div style={{ flex: 1 }} />
        <button 
          onClick={() => setDemoMode(!demoMode)} 
          style={{ background: demoMode ? THEME.warmSandal : THEME.emeraldDark, color: demoMode ? THEME.darkJungle : THEME.creamWhite, border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          ⚡ Demo {demoMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: 24, position: 'relative' }}>
        {children}
      </div>

      {/* STORY CARD */}
      <div style={{ position: 'fixed', bottom: 64, left: 24, zIndex: 50, width: 320 }}>
        <div style={{ background: THEME.lightSandal, border: `1px solid ${THEME.warmSandal}`, borderRadius: 12, padding: 16, boxShadow: '0 4px 12px rgba(27,67,50,0.15)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: THEME.emeraldDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🧑‍🌾</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: THEME.jingleGreen }}>{story.name}, {story.dist}</div>
              <div style={{ fontSize: 12, color: THEME.darkForest, fontStyle: 'italic', margin: '2px 0' }}>{story.text}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: THEME.emeraldDark }}>{story.gain}</div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATION TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60, width: 360, animation: 'slide-in-right 0.3s ease' }}>
          <div style={{ background: THEME.creamWhite, borderLeft: `4px solid ${THEME.liveGreen}`, borderRadius: 8, padding: '16px 20px', boxShadow: '0 8px 24px rgba(27,67,50,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: THEME.jingleGreen, lineHeight: 1.4 }}>{toast}</div>
            <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: THEME.mossDark, marginLeft: 12, display: 'flex' }}><X size={16} /></button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ background: THEME.jingleGreen, padding: '12px 24px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ color: THEME.mossDark, fontSize: 11 }}>Powered by gemma3:4b + llama3.2:3b (Local Ollama) | Dataset: ICAR + Agmarknet</div>
        <div style={{ color: THEME.mossDark, fontSize: 11, marginTop: 4 }}>Real-time simulation: ±{demoMode ? '15' : '8'}% price fluctuation engine active</div>
      </div>
    </div>
  );
}
