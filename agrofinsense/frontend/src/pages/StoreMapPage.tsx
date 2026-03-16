import React, { useState, useEffect } from 'react';
import { THEME } from '../theme';
import { getStores } from '../api';
import { useStore } from '../store';
import { DISTRICT_COORDS } from '../lib/externalApis';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LightCard, AccentCard, SandalCard } from '../components/Cards';
import { CheckCircle2, Box, Info, Map as MapIcon } from 'lucide-react';

const icons = {
  green: new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] }),
  gold: new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] })
};

export function StoreMapPage() {
  const { selectedDistrict } = useStore();
  const coords = DISTRICT_COORDS[selectedDistrict] || DISTRICT_COORDS['Erode'];
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStores(selectedDistrict)
      .then(res => setStores(res.stores || []))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, [selectedDistrict]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: 24, padding: 24, height: 'calc(100vh - 140px)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', paddingRight: 8 }}>
        <div>
          <div style={{ color: THEME.jingleGreen, fontSize: 24, fontWeight: 700 }}>🏪 Nearby Stores</div>
          <div style={{ color: THEME.mossDark, fontSize: 13, marginTop: 4 }}>Fertilizers, Seeds & Equipment</div>
        </div>

        {loading ? <div style={{ color: THEME.mossDark }}>Loading stores...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {stores.map((s, i) => (
              <LightCard key={i} style={{ padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: THEME.jingleGreen, marginBottom: 8 }}>{s.store_name}</div>
                <div style={{ fontSize: 12, color: THEME.mossDark, marginBottom: 12 }}>{s.address}</div>
                
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                   <span style={{ 
                     background: s.stock_status.ure_stock === 'High' ? THEME.liveGreen+'20' : THEME.warning+'20',
                     color: s.stock_status.ure_stock === 'High' ? THEME.darkForest : '#856404',
                     padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600
                   }}>Urea: {s.stock_status.ure_stock}</span>
                   <span style={{ 
                     background: s.stock_status.dap_stock === 'High' ? THEME.liveGreen+'20' : THEME.danger+'20',
                     color: s.stock_status.dap_stock === 'High' ? THEME.darkForest : THEME.danger,
                     padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600
                   }}>DAP: {s.stock_status.dap_stock}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', borderTop: `1px solid ${THEME.deepSandal}`, paddingTop: 12 }}>
                  <div style={{ fontSize: 12, color: THEME.emeraldDark, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={16} /> Verified POS
                  </div>
                  <button style={{ background: THEME.darkForest, color: THEME.creamWhite, border: 'none', borderRadius: 6, padding: '6px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Directions
                  </button>
                </div>
              </LightCard>
            ))}
            {stores.length === 0 && <div style={{ color: THEME.mossDark }}>No stores found in this district.</div>}
          </div>
        )}
      </div>

      <LightCard style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div style={{ padding: 16, borderBottom: `1px solid ${THEME.deepSandal}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: THEME.creamWhite }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: THEME.jingleGreen, fontWeight: 700 }}>
            <MapIcon size={20} /> Store Map: {selectedDistrict}
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, fontWeight: 600, color: THEME.mossDark }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><img src={icons.green.options.iconUrl} alt="marker" style={{ height: 20 }} /> Retailer</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><img src={icons.gold.options.iconUrl} alt="marker" style={{ height: 20 }} /> Wholesale</div>
          </div>
        </div>
        
        <div style={{ flex: 1, zIndex: 0 }}>
          <MapContainer key={`${coords.lat}-${coords.lon}`} center={[coords.lat, coords.lon]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
            {stores.map((s, i) => (
              <Marker key={i} position={[s.latitude, s.longitude]} icon={i % 3 === 0 ? icons.gold : icons.green}>
                <Popup>
                  <div style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div style={{ fontWeight: 700, color: THEME.jingleGreen, fontSize: 14 }}>{s.store_name}</div>
                    <div style={{ fontSize: 12, color: THEME.mossDark, margin: '4px 0 8px' }}>{s.address}</div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>Urea: <span style={{ color: s.stock_status.ure_stock==='High'?THEME.liveGreen:THEME.warning }}>{s.stock_status.ure_stock}</span></div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>DAP: <span style={{ color: s.stock_status.dap_stock==='High'?THEME.liveGreen:THEME.danger }}>{s.stock_status.dap_stock}</span></div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </LightCard>
    </div>
  );
}
