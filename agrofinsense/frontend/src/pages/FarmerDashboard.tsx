import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store';
import { getRecommendation, getLivePrice } from '../api';
import MetricCard from '../components/MetricCard';
import LivePriceChart from '../components/LivePriceChart';
import VoiceAdvisory from '../components/VoiceAdvisory';

export default function FarmerDashboard() {
    const { farmer, selectedCrop, selectedDistrict, livePrices, addLivePrice, logout } = useStore();
    const navigate = useNavigate();
    const wsRef = useRef<WebSocket | null>(null);
    const [wsConnected, setWsConnected] = useState(false);

    const farmerId = farmer?.farmer_id || 1;

    const { data: rec } = useQuery({
        queryKey: ['recommendation', farmerId],
        queryFn: () => getRecommendation(farmerId),
        refetchInterval: 5000,
    });

    const { data: priceData } = useQuery({
        queryKey: ['livePrice', selectedCrop, selectedDistrict],
        queryFn: () => getLivePrice(selectedCrop, selectedDistrict),
        refetchInterval: 60000,
    });

    // WebSocket for live prices
    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/prices/${selectedCrop}/${selectedDistrict}`);

        ws.onopen = () => setWsConnected(true);
        ws.onclose = () => setWsConnected(false);
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'update' && data.prices?.length > 0) {
                const p = data.prices[0];
                addLivePrice({
                    mandi: p.mandi,
                    price: p.price,
                    date: new Date().toLocaleTimeString(),
                    crop: p.crop,
                });
            }
        };

        wsRef.current = ws;
        return () => ws.close();
    }, [selectedCrop, selectedDistrict, addLivePrice]);

    const currentPrice = priceData?.prices?.[0]?.price || rec?.price_forecast?.current?.price || 0;
    const riskScore = rec?.yield_prediction?.risk_score || 50;
    const topCrop = rec?.top_crop || selectedCrop;
    const schemeCount = rec?.scheme_eligibility?.filter((s: { eligible: boolean }) => s.eligible)?.length || 0;

    const chartData = livePrices.map((p) => ({
        time: p.date,
        price: p.price,
    }));

    return (
        <div className="min-h-screen p-6" id="farmer-dashboard">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        🌾 Welcome, {farmer?.name || 'Farmer'}
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {selectedDistrict} District • {selectedCrop}
                        {wsConnected && <span className="ml-2 text-green-400">● Live</span>}
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className="text-xs px-3 py-1.5 bg-agro-600/20 text-agro-400 rounded-full font-medium">
                        Powered by gemma3:4b (local)
                    </span>
                    <button onClick={() => { logout(); navigate('/'); }}
                        className="text-xs px-3 py-1.5 bg-slate-700/50 text-slate-400 rounded-full hover:bg-slate-600/50 transition">
                        Logout
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                    label="Risk Score"
                    value={riskScore}
                    unit="/100"
                    trend={riskScore > 60 ? 'up' : riskScore < 30 ? 'down' : 'flat'}
                    icon="⚡"
                />
                <MetricCard
                    label="Live Price"
                    value={`₹${currentPrice.toLocaleString('en-IN')}`}
                    unit="/quintal"
                    trend={rec?.price_forecast?.direction === 'up' ? 'up' : 'down'}
                    trendPct={rec?.price_forecast?.confidence_pct}
                    icon="💰"
                />
                <MetricCard
                    label="Top Crop"
                    value={topCrop}
                    icon="🌿"
                />
                <MetricCard
                    label="Active Schemes"
                    value={schemeCount}
                    unit="eligible"
                    icon="📋"
                />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
                {[
                    { label: '📄 Upload Soil', path: '/soil-upload' },
                    { label: '📊 Price Chart', path: '/prices' },
                    { label: '🏪 Find Stores', path: '/stores' },
                    { label: '📋 My Schemes', path: '/schemes' },
                ].map((action) => (
                    <button
                        key={action.path}
                        onClick={() => navigate(action.path)}
                        className="px-5 py-2.5 glass-card text-sm font-semibold text-white hover:border-agro-400/50 transition-all"
                    >
                        {action.label}
                    </button>
                ))}
            </div>

            {/* Live Price Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <LivePriceChart data={chartData} crop={selectedCrop} />

                {/* Recommendation */}
                <div className="glass-card">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">🎯 Recommendation</h3>
                        {rec?.status === 'processing' && (
                            <span className="text-xs text-amber-400 animate-pulse">⏳ Generating advisory...</span>
                        )}
                    </div>
                    {rec?.status === 'complete' ? (
                        <div className="space-y-3">
                            {rec.top_crops?.map((c: { crop: string; score: number }, i: number) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                                    <span className="text-sm text-white">{i + 1}. {c.crop}</span>
                                    <span className="text-xs font-semibold text-agro-400">{c.score}/10</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm">Upload a soil report to get personalized recommendations</p>
                    )}
                </div>
            </div>

            {/* Why Narrative + Voice */}
            {rec?.why_narrative && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white">📝 Advisory</h3>
                            <span className="text-xs px-2 py-1 bg-agro-600/20 text-agro-400 rounded-full">
                                via gemma3:4b
                            </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {rec.why_narrative}
                        </p>
                    </div>
                    <VoiceAdvisory farmerId={farmerId} narrative={rec.why_narrative} />
                </div>
            )}
        </div>
    );
}
