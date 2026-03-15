import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import type { Feature, FeatureCollection } from 'geojson';
import L from 'leaflet';

interface DistrictData {
    district: string;
    tonnage_mt: number;
    risk_score: number;
    budget_crore: number;
}

interface TamilNaduMapProps {
    data: DistrictData[];
}

// Simplified district polygons (approximate centroids expanded to small rectangles)
const DISTRICT_FEATURES: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
        { type: 'Feature', properties: { name: 'Erode' }, geometry: { type: 'Polygon', coordinates: [[[77.4, 11.1], [78.0, 11.1], [78.0, 11.6], [77.4, 11.6], [77.4, 11.1]]] } },
        { type: 'Feature', properties: { name: 'Salem' }, geometry: { type: 'Polygon', coordinates: [[[77.8, 11.4], [78.5, 11.4], [78.5, 11.9], [77.8, 11.9], [77.8, 11.4]]] } },
        { type: 'Feature', properties: { name: 'Madurai' }, geometry: { type: 'Polygon', coordinates: [[[77.8, 9.7], [78.4, 9.7], [78.4, 10.2], [77.8, 10.2], [77.8, 9.7]]] } },
        { type: 'Feature', properties: { name: 'Thanjavur' }, geometry: { type: 'Polygon', coordinates: [[[79.0, 10.5], [79.4, 10.5], [79.4, 11.0], [79.0, 11.0], [79.0, 10.5]]] } },
        { type: 'Feature', properties: { name: 'Coimbatore' }, geometry: { type: 'Polygon', coordinates: [[[76.7, 10.8], [77.2, 10.8], [77.2, 11.2], [76.7, 11.2], [76.7, 10.8]]] } },
        { type: 'Feature', properties: { name: 'Trichy' }, geometry: { type: 'Polygon', coordinates: [[[78.4, 10.5], [79.0, 10.5], [79.0, 11.0], [78.4, 11.0], [78.4, 10.5]]] } },
        { type: 'Feature', properties: { name: 'Vellore' }, geometry: { type: 'Polygon', coordinates: [[[78.8, 12.6], [79.4, 12.6], [79.4, 13.1], [78.8, 13.1], [78.8, 12.6]]] } },
        { type: 'Feature', properties: { name: 'Tirunelveli' }, geometry: { type: 'Polygon', coordinates: [[[77.4, 8.4], [78.0, 8.4], [78.0, 8.9], [77.4, 8.9], [77.4, 8.4]]] } },
        { type: 'Feature', properties: { name: 'Chennai' }, geometry: { type: 'Polygon', coordinates: [[[80.0, 12.8], [80.4, 12.8], [80.4, 13.3], [80.0, 13.3], [80.0, 12.8]]] } },
        { type: 'Feature', properties: { name: 'Tiruppur' }, geometry: { type: 'Polygon', coordinates: [[[77.1, 10.9], [77.6, 10.9], [77.6, 11.3], [77.1, 11.3], [77.1, 10.9]]] } },
    ],
};

function getColor(riskScore: number): string {
    if (riskScore < 30) return '#22c55e';  // Green — low risk
    if (riskScore < 60) return '#f59e0b';  // Amber — medium risk
    return '#ef4444';                       // Red — high risk
}

export default function TamilNaduMap({ data }: TamilNaduMapProps) {
    const navigate = useNavigate();

    const dataMap = new Map(data.map((d) => [d.district, d]));

    const style = (feature: Feature | undefined) => {
        const name = feature?.properties?.name || '';
        const d = dataMap.get(name);
        return {
            fillColor: d ? getColor(d.risk_score) : '#64748b',
            weight: 2,
            opacity: 1,
            color: 'rgba(255,255,255,0.3)',
            fillOpacity: 0.6,
        };
    };

    const onEach = (feature: Feature, layer: L.Layer) => {
        const name = feature.properties?.name || '';
        const d = dataMap.get(name);
        const popupContent = d
            ? `<strong>${name}</strong><br/>Tonnage: ${d.tonnage_mt.toLocaleString()} MT<br/>Budget: ₹${d.budget_crore} Cr<br/>Risk: ${d.risk_score}/100`
            : `<strong>${name}</strong>`;

        layer.bindTooltip(popupContent, { sticky: true });
        layer.on('click', () => navigate(`/district/${name}`));
    };

    return (
        <div className="glass-card h-[500px]" id="tamilnadu-map">
            <h3 className="text-lg font-semibold text-white mb-3">🗺️ Tamil Nadu District Map</h3>
            <MapContainer
                center={[11.0, 78.5]}
                zoom={7}
                style={{ height: '420px', borderRadius: '12px' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <GeoJSON
                    data={DISTRICT_FEATURES}
                    style={style}
                    onEachFeature={onEach}
                />
            </MapContainer>
            <div className="flex gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500" /> Low Risk</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500" /> Medium</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> High Risk</span>
            </div>
        </div>
    );
}
