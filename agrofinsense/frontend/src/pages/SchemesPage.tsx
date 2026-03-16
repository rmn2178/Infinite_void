import React, { useState, useEffect } from 'react';
import { THEME } from '../theme';
import { useStore } from '../store';
import { checkSchemeEligibility, getFarmerSchemes } from '../api';
import { LightCard, SandalCard } from '../components/Cards';
import { CheckCircle2, XCircle, AlertCircle, FileText, IndianRupee, Clock } from 'lucide-react';

export function SchemesPage() {
  const { farmer } = useStore();
  const [eligibility, setEligibility] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmer) {
      checkSchemeEligibility(farmer.farmer_id)
        .then(res => setEligibility(res.eligible_schemes || []))
        .catch(() => setEligibility([]))
        .finally(() => setLoading(false));
    }
  }, [farmer]);

  const stats = [
    { label: 'Eligible Schemes', val: eligibility.filter(s => s.status === 'Eligible').length, icon: <CheckCircle2 size={20} color={THEME.liveGreen} /> },
    { label: 'Missing Info', val: eligibility.filter(s => s.status === 'Missing Data').length, icon: <AlertCircle size={20} color={THEME.warning} /> },
    { label: 'Not Eligible', val: eligibility.filter(s => s.status === 'Not Eligible').length, icon: <XCircle size={20} color={THEME.danger} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
      <div style={{ color: THEME.jingleGreen, fontSize: 24, fontWeight: 700 }}>📋 Scheme Eligibility Check</div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: THEME.mossDark, fontWeight: 600 }}>Checking eligibility...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {stats.map((s, i) => (
              <LightCard key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: THEME.lightSandal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: THEME.mossDark, fontWeight: 600 }}>{s.label}</div>
                </div>
              </LightCard>
            ))}
          </div>

          <LightCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {eligibility.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, color: THEME.mossDark }}>No schemes found for your profile.</div>
              ) : (
                eligibility.map((s, i) => (
                  <SandalCard key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 20 }}>
                    <div style={{ marginTop: 4 }}>
                      {s.status === 'Eligible' ? <CheckCircle2 size={24} color={THEME.liveGreen} /> :
                       s.status === 'Missing Data' ? <AlertCircle size={24} color={THEME.warning} /> :
                       <XCircle size={24} color={THEME.danger} />}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: THEME.jingleGreen }}>{s.scheme_name}</div>
                        <span style={{ 
                          background: s.status === 'Eligible' ? THEME.liveGreen+'20' : s.status === 'Missing Data' ? THEME.warning+'30' : THEME.liveRed+'20', 
                          color: s.status === 'Eligible' ? THEME.darkForest : s.status === 'Missing Data' ? '#856404' : THEME.danger,
                          padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700
                        }}>
                          {s.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: THEME.mossDark, fontWeight: 500 }}>
                          <IndianRupee size={16} /> Max Benefit: ₹{s.max_benefit_rs.toLocaleString()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: THEME.mossDark, fontWeight: 500 }}>
                          <Clock size={16} /> Est. Process Time: 14 Days
                        </div>
                      </div>

                      {s.reasons && s.reasons.length > 0 && (
                        <div style={{ background: THEME.creamWhite, padding: 12, borderRadius: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: THEME.darkForest, marginBottom: 6 }}>Reasoning:</div>
                          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: THEME.mossDark }}>
                            {s.reasons.map((r: string, idx: number) => <li key={idx} style={{ marginBottom: 4 }}>{r}</li>)}
                          </ul>
                        </div>
                      )}

                      {s.status === 'Eligible' && (
                        <button style={{ background: THEME.darkForest, color: THEME.creamWhite, border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 700, marginTop: 16, cursor: 'pointer' }}>
                          Apply Now (e-Sevai)
                        </button>
                      )}
                      
                      {s.status === 'Missing Data' && (
                        <button style={{ background: THEME.warmSandal, color: THEME.darkForest, border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 700, marginTop: 16, cursor: 'pointer' }}>
                          Upload Missing Docs
                        </button>
                      )}
                    </div>
                  </SandalCard>
                ))
              )}
            </div>
          </LightCard>
        </>
      )}
    </div>
  );
}
