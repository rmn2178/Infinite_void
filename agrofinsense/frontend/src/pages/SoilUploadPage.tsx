import React, { useState, useEffect } from 'react';
import { THEME } from '../theme';
import { LightCard, SandalCard, AccentCard } from '../components/Cards';
import { callOllamaText, MODELS } from '../lib/ollama';
import { useStore } from '../store';
import { uploadSoil } from '../api';
import { useSimulation } from '../hooks/useSimulation';
import { Wheat, RefreshCw, UploadCloud, Edit3 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export function SoilUploadPage() {
  const { farmer } = useStore();
  const { livePrices } = useSimulation(false);
  const [method, setMethod] = useState<'scan' | 'manual' | null>(null);
  
  // Soil values
  const [N, setN] = useState(68);
  const [P, setP] = useState(28);
  const [K, setK] = useState(142);
  const [pH, setPh] = useState(6.2);
  const [OC, setOc] = useState(0.8);

  // Scan state
  const [scanStep, setScanStep] = useState(0); // 0=none, 1=uploading, 2=ocr, 3=extract, 4=done
  
  // Results
  const [advisory, setAdvisory] = useState<string | null>(null);
  const [loadingAdvisory, setLoadingAdvisory] = useState(false);
  const [topCrops, setTopCrops] = useState<any[]>([]);

  // Calculate crops based on rules
  useEffect(() => {
    const crops = [
      { name: 'Rice', score: 25 + (N>60?30:0) + (K>100?20:0) + (pH>=5.5&&pH<=7?25:0), emoji: '🌾' },
      { name: 'Sugarcane', score: 20 + (K>120?35:0) + (N>50?20:0) + 20, emoji: '🎋' },
      { name: 'Groundnut', score: 20 + (P>20?30:0) + (pH>=5.5&&pH<=7?25:0) + (K>80?20:0), emoji: '🥜' },
      { name: 'Cotton', score: 20 + (K>150?30:0) + (N>80?25:0) + 10, emoji: '☁️' },
      { name: 'Maize', score: 25 + (N>80?35:0) + (P>30?20:0) + 10, emoji: '🌽' },
      { name: 'Banana', score: 25 + (K>200?35:0) + (N>60?20:0) + 10, emoji: '🍌' }
    ].sort((a,b) => b.score - a.score).slice(0, 3);
    setTopCrops(crops);
  }, [N, P, K, pH]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !farmer) return;
    setMethod('scan');
    setScanStep(1);
    
    // Simulate steps since we don't have the actual vision model hooked up strictly in this UI
    setTimeout(() => setScanStep(2), 1500);
    setTimeout(() => setScanStep(3), 3000);
    
    try {
      const res = await uploadSoil(farmer.farmer_id, file);
      if (res.extracted_data) {
        setN(res.extracted_data.nitrogen || 45);
        setP(res.extracted_data.phosphorus || 20);
        setK(res.extracted_data.potassium || 180);
        setPh(res.extracted_data.ph || 6.5);
        setOc(res.extracted_data.organic_carbon || 0.6);
      }
    } catch {
      // Fallback
      setN(75); setP(30); setK(150); setPh(6.8); setOc(0.9);
    }
    
    setScanStep(4);
  };

  const getAdvisory = async () => {
    setLoadingAdvisory(true);
    const top = topCrops[0];
    const yieldEst = top.score * 50; 
    const prompt = `You are an expert agricultural advisor for Tamil Nadu farmers. Soil: N=${N}kg/ha, P=${P}kg/ha, K=${K}kg/ha, pH=${pH}. Top crop: ${top.name} score ${top.score}/100, estimated yield ${yieldEst}kg/ha. Write 3 paragraphs in English: 1) Why this crop suits this soil. 2) Sowing timing for Kharif 2025. 3) Key fertilizer and water management steps.`;
    const text = await callOllamaText(MODELS.NARRATIVE as 'gemma3:4b' | 'llama3.2:3b', prompt);
    setAdvisory(text);
    setLoadingAdvisory(false);
  };

  const SliderCard = ({ label, value, min, max, step, onChange, unit }: any) => (
    <SandalCard style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ color: THEME.mossDark, fontSize: 12, width: 90, fontWeight: 600 }}>{label}</div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} style={{ flex: 1, accentColor: THEME.darkForest }} />
      <div style={{ color: THEME.jingleGreen, fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums', width: 60, textAlign: 'right' }}>
        {value} <span style={{ fontSize: 10 }}>{unit}</span>
      </div>
    </SandalCard>
  );

  const getNutrientStatus = (val:number, max:number) => {
    const p = val/max;
    if (p > 0.6) return { label: 'High', color: THEME.success };
    if (p > 0.3) return { label: 'Medium', color: THEME.warning };
    return { label: 'Low', color: THEME.danger };
  };

  const nStat = getNutrientStatus(N, 140);
  const pStat = getNutrientStatus(P, 60);
  const kStat = getNutrientStatus(K, 280);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 20 }}>
      {/* LEFT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <LightCard>
          <div style={{ color: THEME.jingleGreen, fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Soil Analysis</div>
          
          <div style={{ background: THEME.lightSandal, border: `2px dashed ${THEME.deepSandal}`, borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 24 }}>
            <Wheat size={48} color={THEME.mossDark} style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: THEME.darkForest }}>Upload Soil Health Card</div>
            <div style={{ fontSize: 12, color: THEME.mossDark, marginTop: 4, marginBottom: 20 }}>Photo or PDF accepted</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <label style={{ background: THEME.darkForest, color: THEME.creamWhite, borderRadius: 12, padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <UploadCloud size={16} /> Scan with Gemma Vision
                <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
              <button onClick={() => setMethod('manual')} style={{ background: 'transparent', border: `1.5px solid ${THEME.darkForest}`, color: THEME.darkForest, borderRadius: 12, padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                <Edit3 size={16} /> Manual Entry
              </button>
            </div>
          </div>

          {method === 'scan' && scanStep < 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { step: 1, text: 'Uploading image...' },
                { step: 2, text: 'Running OCR model...' },
                { step: 3, text: 'Extracting N/P/K/pH...' },
                { step: 4, text: 'Computing crop match...' }
              ].filter(s => s.step <= scanStep + 1).map((s) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {scanStep === s.step ? <RefreshCw size={16} color={THEME.warmSandal} style={{ animation: 'spin 1s linear infinite' }} /> : <div style={{ width: 16, height: 16, borderRadius: '50%', background: scanStep > s.step ? THEME.emeraldDark : THEME.warmSandal }} />}
                  <span style={{ fontSize: 13, color: scanStep >= s.step ? THEME.jingleGreen : THEME.mossDark, fontWeight: scanStep === s.step ? 700 : 500 }}>{s.text}</span>
                </div>
              ))}
            </div>
          )}

          {(method === 'manual' || scanStep === 4) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'slide-up 0.4s ease' }}>
              <SliderCard label="Nitrogen (N)" value={N} min={0} max={140} step={1} onChange={setN} unit="kg/ha" />
              <SliderCard label="Phosphorus (P)" value={P} min={0} max={60} step={1} onChange={setP} unit="kg/ha" />
              <SliderCard label="Potassium (K)" value={K} min={0} max={280} step={1} onChange={setK} unit="kg/ha" />
              <SliderCard label="pH Level" value={pH} min={4.0} max={9.0} step={0.1} onChange={setPh} unit="" />
              <SliderCard label="Organic Carbon" value={OC} min={0.0} max={5.0} step={0.1} onChange={setOc} unit="%" />

               <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                {[ { label: 'N', stat: nStat, val: N, max: 140 }, { label: 'P', stat: pStat, val: P, max: 60 }, { label: 'K', stat: kStat, val: K, max: 280 } ].map(n => (
                  <div key={n.label} style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: THEME.mossDark, fontWeight: 600, marginBottom: 4 }}>{n.label} • {n.stat.label}</div>
                    <div style={{ width: '100%', height: 6, background: THEME.lightSandal, borderRadius: 3 }}>
                      <div style={{ width: `${(n.val/n.max)*100}%`, height: '100%', background: n.stat.color, borderRadius: 3, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </LightCard>
      </div>

      {/* RIGHT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <LightCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ color: THEME.jingleGreen, fontSize: 18, fontWeight: 700 }}>Recommended Crops</span>
            <span style={{ background: THEME.warmSandal, color: THEME.darkForest, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Live Revenue Updates</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {topCrops.map((crop, i) => {
              const liveData = livePrices[`${crop.name}_Tamil Nadu`] || { current: 2000, changePct: 0, direction: 'flat' };
              const yieldEst = Math.round(crop.score * 50);
              const revenue = Math.round(yieldEst * (liveData.current / 100)); // ₹/qtl to ₹/kg equivalent
              
              const CardComponent = i === 0 ? AccentCard : SandalCard;
              const radarData = [
                { subject: 'Soil Fit', A: crop.score }, { subject: 'Market', A: 80 },
                { subject: 'Water', A: 60 }, { subject: 'Season', A: 90 }, { subject: 'Risk', A: 100 - crop.score }
              ];

              return (
                <CardComponent key={crop.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: i===0 ? THEME.emeraldDark : THEME.darkForest, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {crop.emoji}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: i===0 ? THEME.creamWhite : THEME.jingleGreen }}>{crop.name}</div>
                    <div style={{ width: '100%', height: 6, background: i===0 ? THEME.emeraldDark : THEME.warmSandal, borderRadius: 3, margin: '8px 0' }}>
                      <div style={{ width: `${crop.score}%`, height: '100%', background: i===0 ? THEME.warmSandal : THEME.darkForest, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: i===0 ? THEME.lightSandal : THEME.mossDark }}>Score: {crop.score}/100 • Excellent</div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: i===0 ? THEME.creamWhite : THEME.jingleGreen, fontVariantNumeric: 'tabular-nums' }}>{yieldEst.toLocaleString()} kg/ha</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: i===0 ? THEME.warmSandal : THEME.emeraldDark, margin: '2px 0', fontVariantNumeric: 'tabular-nums' }}>₹{revenue.toLocaleString()}/ha</div>
                    <span style={{ 
                      background: liveData.direction==='up'?THEME.liveGreen+'20':liveData.direction==='down'?THEME.liveRed+'20':THEME.warmSandal,
                      color: liveData.direction==='up'?THEME.liveGreen:liveData.direction==='down'?THEME.liveRed:THEME.mossDark,
                      padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 700
                    }}>
                      {liveData.changePct.toFixed(1)}% {liveData.direction==='up'?'▲':liveData.direction==='down'?'▼':'▬'}
                    </span>
                  </div>

                  <div style={{ width: 80, height: 80 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke={i===0 ? THEME.emeraldDark : THEME.warmSandal} />
                        <Radar dataKey="A" stroke={i===0 ? THEME.warmSandal : THEME.darkForest} fill={i===0 ? THEME.warmSandal : THEME.darkForest} fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardComponent>
              );
            })}
          </div>
        </LightCard>

        <LightCard>
          <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Fertilizer Gap Summary</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: THEME.mossDark, borderBottom: `2px solid ${THEME.deepSandal}`, textAlign: 'left' }}>
                <th style={{ padding: '8px 4px' }}>Fertilizer</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Urea (N)', qty: Math.max(0, 100 - N) / 0.46, cost: 5.4 },
                { name: 'DAP (P)', qty: Math.max(0, 40 - P) / 0.46, cost: 27 },
                { name: 'MOP (K)', qty: Math.max(0, 200 - K) / 0.60, cost: 17 }
              ].map((f, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${THEME.deepSandal}` }}>
                  <td style={{ padding: '10px 4px', color: THEME.jingleGreen, fontWeight: 600 }}>{f.name}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right', color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums' }}>{f.qty.toFixed(1)} kg</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right', color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums' }}>₹{(f.qty * f.cost).toFixed(0)}</td>
                </tr>
              ))}
              <tr style={{ background: THEME.nearBlack }}>
                <td style={{ padding: '12px 8px', color: THEME.creamWhite, fontWeight: 700, borderRadius: '8px 0 0 8px' }}>Total Est. Cost</td>
                <td style={{ padding: '12px 8px' }}></td>
                <td style={{ padding: '12px 8px', textAlign: 'right', color: THEME.warmSandal, fontWeight: 700, borderRadius: '0 8px 8px 0', fontVariantNumeric: 'tabular-nums' }}>
                  ₹{(([Math.max(0, 100 - N) / 0.46, Math.max(0, 40 - P) / 0.46, Math.max(0, 200 - K) / 0.60].reduce((a,b,i) => a + b * [5.4, 27, 17][i], 0)).toFixed(0))}
                </td>
              </tr>
            </tbody>
          </table>

          <button onClick={getAdvisory} disabled={loadingAdvisory} style={{ width: '100%', background: THEME.darkForest, color: THEME.creamWhite, border: 'none', borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, cursor: loadingAdvisory ? 'not-allowed' : 'pointer', marginTop: 16 }}>
            {loadingAdvisory ? 'Generating...' : '🌾 Get AI Advisory'}
          </button>
        </LightCard>

        {advisory && (
          <LightCard style={{ borderLeft: `4px solid ${THEME.emeraldDark}`, animation: 'slide-up 0.4s ease' }}>
            <div style={{ color: THEME.jingleGreen, fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{advisory}</div>
            <div style={{ marginTop: 16, fontSize: 11, color: THEME.mossDark, fontStyle: 'italic' }}>Generated by gemma3:4b</div>
          </LightCard>
        )}
      </div>
    </div>
  );
}
