import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useStore } from '../store';
import { getStores } from '../api';

// Custom marker icon
const storeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const DISTRICT_COORDS: Record<string, [number, number]> = {
    Erode: [11.341, 77.726],
    Salem: [11.664, 78.145],
    Madurai: [9.925, 78.119],
    Thanjavur: [10.787, 79.138],
    Coimbatore: [11.017, 76.971],
    Trichy: [10.805, 78.686],
    Vellore: [12.916, 79.132],
    Tirunelveli: [8.727, 77.695],
    Chennai: [13.083, 80.270],
    Tiruppur: [11.108, 77.341],
};

export default function StoreMapPage() {
    const { selectedDistrict } = useStore();

    const { data: stores, isLoading } = useQuery({
        queryKey: ['stores', selectedDistrict],
        queryFn: () => getStores(selectedDistrict),
    });

    const center = DISTRICT_COORDS[selectedDistrict] || [11.0, 78.0];

    return (
        <div className="min-h-screen p-6" id="store-map-page">
            <h1 className="text-2xl font-bold text-white mb-6">
                🏪 Agri Stores Near {selectedDistrict}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card" style={{ height: '600px' }}>
                    <MapContainer
                        center={center}
                        zoom={12}
                        style={{ height: '100%', borderRadius: '12px' }}
                    >
                        <TileLayer
                            attribution='&copy; OSM'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        {stores?.map((store: { id: number; name: string; lat: number; lng: number; store_type: string; address: string }) => (
                            <Marker key={store.id} position={[store.lat, store.lng]} icon={storeIcon}>
                                <Popup>
                                    <div className="text-sm">
                                        <strong>{store.name}</strong>
                                        <br />
                                        {store.store_type} • {store.address}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Store List */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">📍 {stores?.length || 0} Stores Found</h3>
                    {isLoading ? (
                        <div className="glass-card animate-pulse">Loading stores...</div>
                    ) : (
                        stores?.map((store: { id: number; name: string; store_type: string; address: string; district: string }) => (
                            <div key={store.id} className="glass-card">
                                <h4 className="text-white font-medium text-sm">{store.name}</h4>
                                <p className="text-xs text-slate-400 mt-1">
                                    <span className="px-2 py-0.5 bg-agro-600/20 text-agro-400 rounded-full mr-2 capitalize">
                                        {store.store_type}
                                    </span>
                                    {store.address}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
