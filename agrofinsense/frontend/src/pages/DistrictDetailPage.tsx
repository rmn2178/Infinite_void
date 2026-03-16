import React, { useState, useEffect } from 'react';
import { THEME } from '../theme';
import { useParams } from 'react-router-dom';
import { getWarehouseStatus, getDistrictSummary } from '../api';
import { WarehouseTable, WarehouseRow } from '../components/WarehouseTable';
import { LightCard, AccentCard } from '../components/Cards';
import { MetricCard } from '../components/MetricCard';
import { RiskGauge } from '../components/RiskGauge';
import { Building, Map, ShoppingCart, CloudRain, ThermometerSun, AlertTriangle } from 'lucide-react';

export function DistrictDetailPage() {
  const { districtName } = useParams<{ districtName: string }>();
  const [warehouses, setWarehouses] = useState<WarehouseRow[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (!districtName) return;
    getWarehouseStatus(districtName).then(w => setWarehouses(w || []));
    getDistrictSummary(districtName, 'Kharif 2025').then(s => setSummary(s));
  }, [districtName]);

  const totalCap = warehouses.reduce((sum, w) => sum + w.capacity_mt, 0);
  const totalStock = warehouses.reduce((sum, w) => sum + w.stock_mt, 0);
  const avgUtil = totalCap > 0 ? (totalStock / totalCap) * 100 : 0;

  const getCapacityColor = (pct: number) => {
    if (pct > 85) return THEME.danger;
    if (pct > 60) return THEME.emeraldDark;
    return THEME.mossDark;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: THEME.darkForest, color: THEME.creamWhite, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Map size={24} />
        </div>
        <div>
          <div style={{ color: THEME.jingleGreen, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{districtName} District</div>
          <div style={{ color: THEME.mossDark, fontSize: 13, fontWeight: 600, marginTop: 4 }}>Kharif 2025 Overview</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <AccentCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
          <div style={{ fontSize: 12, color: THEME.creamWhite, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 8 }}>Vulnerability Score</div>
          <RiskGauge score={summary?.risk_score || 42} label="" />
        </AccentCard>

        <MetricCard label="Est. Yield" value={summary?.tonnage_mt?.toLocaleString() || '142,000'} unit="MT" trend="up" icon={<ShoppingCart size={20}/>} />
        <MetricCard label="Rainfall Avg" value="840" unit="mm" trend="down" icon={<CloudRain size={20}/>} />
        <MetricCard label="Temp Avg" value="28" unit="°C" icon={<ThermometerSun size={20}/>} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: THEME.jingleGreen, fontSize: 20, fontWeight: 700 }}>Warehouse Infrastructure</span>
            <span style={{ background: THEME.lightSandal, color: THEME.darkForest, padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building size={16} /> {warehouses.length} Facilities
            </span>
          </div>

          <WarehouseTable warehouses={warehouses} />
        </div>

        <LightCard style={{ display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
          <div style={{ color: THEME.jingleGreen, fontSize: 18, fontWeight: 700, marginBottom: 20 }}>District Capacity</div>
          
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: getCapacityColor(avgUtil), fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{avgUtil.toFixed(1)}<span style={{ fontSize: 24 }}>%</span></div>
            <div style={{ fontSize: 13, color: THEME.mossDark, fontWeight: 600, marginTop: 8 }}>Overall Utilization</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: THEME.mossDark, fontWeight: 600 }}>Total Space</span>
              <span style={{ color: THEME.jingleGreen, fontWeight: 700 }}>{totalCap.toLocaleString()} MT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: THEME.mossDark, fontWeight: 600 }}>Current Stock</span>
              <span style={{ color: THEME.jingleGreen, fontWeight: 700 }}>{totalStock.toLocaleString()} MT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, paddingTop: 12, borderTop: `1px solid ${THEME.deepSandal}` }}>
              <span style={{ color: THEME.mossDark, fontWeight: 600 }}>Available Space</span>
              <span style={{ color: THEME.emeraldDark, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{(totalCap - totalStock).toLocaleString()} MT</span>
            </div>
          </div>

          {avgUtil > 80 && (
            <div style={{ background: THEME.liveRed+'15', borderLeft: `4px solid ${THEME.danger}`, padding: 12, borderRadius: '0 8px 8px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertTriangle size={24} color={THEME.danger} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: THEME.darkJungle, fontWeight: 500, lineHeight: 1.4 }}>
                <strong style={{ color: THEME.danger }}>Critical Action Required:</strong> District storage is nearing max capacity. Route arriving stock to neighboring districts.
              </div>
            </div>
          )}
        </LightCard>
      </div>

    </div>
  );
}
