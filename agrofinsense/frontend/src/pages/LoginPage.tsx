import React, { useState } from 'react';
import { THEME } from '../theme';
import { LightCard, SandalCard } from '../components/Cards';
import { checkOllamaStatus } from '../lib/ollama';
import { loginFarmer, registerFarmer } from '../api';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Wheat } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const DISTRICTS_TN = ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"];

export function LoginPage() {
  const [activeTab, setActiveTab] = useState<'farmer' | 'officer'>('farmer');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [district, setDistrict] = useState(DISTRICTS_TN[7]); // Erode default
  const [land, setLand] = useState('2');
  const [lang, setLang] = useState('English');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setToken, setFarmer, setRole } = useStore();
  const navigate = useNavigate();
  const { data: ollama } = useQuery({ queryKey: ['ollama'], queryFn: checkOllamaStatus });

  const handleLogin = async (e?: React.FormEvent, forceRole?: 'farmer' | 'officer', forcePhone?: string) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const targetPhone = forcePhone || phone;
    const targetRole = forceRole || activeTab;

    try {
      let res;
      try {
        res = await loginFarmer({ phone: targetPhone });
      } catch (err: any) {
        if (err.response?.status === 404 && targetRole === 'farmer') {
          await registerFarmer({ phone: targetPhone, name: name || 'Demo Farmer', district, land_area_ha: parseFloat(land) || 2, language: lang, role: 'farmer' });
          res = await loginFarmer({ phone: targetPhone });
        } else {
          throw err;
        }
      }

      if (targetRole === 'officer' && res.role !== 'officer') {
        setError('This account is not an officer account.');
        setLoading(false);
        return;
      }

      setToken(res.token);
      setRole(res.role);
      setFarmer({ farmer_id: res.farmer_id, name: res.name || 'User', district: res.district || 'Erode', phone: targetPhone, land_area_ha: res.land_area_ha || 2, language: res.language || 'English', role: res.role });

      navigate(res.role === 'officer' ? '/gov' : '/farmer');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Note: Demo roles only work if backend seeded.');
      // Hack for pure frontend testing if backend fails:
      if (!forcePhone) {
        setToken('dummy_token');
        setRole(targetRole);
        navigate(targetRole === 'officer' ? '/gov' : '/farmer');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: THEME.lightSandal, border: `1.5px solid ${THEME.deepSandal}`, borderRadius: 12, padding: '12px 16px', color: THEME.jingleGreen, width: '100%', outline: 'none' as any, fontSize: 14
  };

  return (
    <div style={{ minHeight: '100vh', background: THEME.lightSandal, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'absolute', top: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Wheat size={40} color={THEME.emeraldDark} />
        <div>
          <div style={{ color: THEME.darkForest, fontSize: 32, fontWeight: 800, lineHeight: 1 }}>AgroFinSense</div>
          <div style={{ color: THEME.mossDark, fontSize: 14, fontWeight: 500, marginTop: 4 }}>Agricultural Intelligence for Tamil Nadu</div>
        </div>
      </div>

      <LightCard style={{ width: '100%', maxWidth: 440, marginTop: 60 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button onClick={() => setActiveTab('farmer')} style={{ flex: 1, background: activeTab === 'farmer' ? THEME.darkForest : THEME.lightSandal, color: activeTab === 'farmer' ? THEME.creamWhite : THEME.mossDark, border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            🧑‍🌾 Farmer Login
          </button>
          <button onClick={() => setActiveTab('officer')} style={{ flex: 1, background: activeTab === 'officer' ? THEME.darkForest : THEME.lightSandal, color: activeTab === 'officer' ? THEME.creamWhite : THEME.mossDark, border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            🏛️ Officer Login
          </button>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} required />
          
          {activeTab === 'farmer' && phone.length === 10 && (
            <SandalCard style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: THEME.mossDark, fontWeight: 600 }}>New Registration Details (Optional)</div>
              <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
              <div style={{ display: 'flex', gap: 12 }}>
                <select value={district} onChange={e => setDistrict(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                  {DISTRICTS_TN.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="number" step="0.1" placeholder="Land (ha)" value={land} onChange={e => setLand(e.target.value)} style={{ ...inputStyle, width: '100px' }} />
              </div>
              <select value={lang} onChange={e => setLang(e.target.value)} style={inputStyle}>
                <option value="English">English</option><option value="Tamil">Tamil</option>
              </select>
            </SandalCard>
          )}

          {error && <div style={{ color: THEME.danger, fontSize: 13, fontWeight: 500, textAlign: 'center' }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ background: THEME.darkForest, color: THEME.creamWhite, border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', width: '100%', marginTop: 8 }}>
            {loading ? 'Processing...' : activeTab === 'farmer' ? 'Login / Register' : 'Officer Login'}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${THEME.deepSandal}` }}>
          <div style={{ fontSize: 11, color: THEME.mossDark, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>Quick Demo Access</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button type="button" onClick={() => handleLogin(undefined, 'farmer', '9876543210')} style={{ background: THEME.warmSandal, color: THEME.darkForest, border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              🧑‍🌾 Demo Farmer (9876543210)
            </button>
            <button type="button" onClick={() => handleLogin(undefined, 'officer', '9988776655')} style={{ background: THEME.warmSandal, color: THEME.darkForest, border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              🏛️ Demo Officer (9988776655)
            </button>
          </div>
        </div>
      </LightCard>

      <div style={{ marginTop: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ color: THEME.mossDark, fontSize: 12, fontWeight: 500 }}>Powered by gemma3:4b + llama3.2:3b running locally on Ollama</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: THEME.creamWhite, padding: '4px 12px', borderRadius: 20, border: `1px solid ${THEME.deepSandal}` }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: ollama?.available ? THEME.liveGreen : THEME.danger, animation: ollama?.available ? 'pulse-live 2s infinite' : 'none' }} />
          <span style={{ color: THEME.darkForest, fontSize: 11, fontWeight: 700 }}>AI {ollama?.available ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    </div>
  );
}
