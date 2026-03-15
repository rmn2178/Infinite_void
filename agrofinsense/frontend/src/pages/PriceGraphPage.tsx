import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store';
import { getMarketForecast } from '../api';
import {
    ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceDot
} from 'recharts';
import RiskGauge from '../components/RiskGauge';

const CROPS = ['Rice', 'Maize', 'Groundnut', 'Cotton', 'Sugarcane', 'Onion', 'Tomato', 'Banana', 'Turmeric', 'Ragi'];

export default function PriceGraphPage() {
    const { selectedCrop, selectedDistrict, setSelectedCrop } = useStore();
    const [crop, setCrop] = useState(selectedCrop);

    const { data, isLoading } = useQuery({
        queryKey: ['forecast', crop, selectedDistrict],
        queryFn: () => getMarketForecast(crop, selectedDistrict),
    });

    const handleCropSelect = (c: string) => {
        setCrop(c);
        setSelectedCrop(c);
    };

    // Build chart data
    const chartData: { month: string; price: number; type: string; forecast?: number; low?: number; high?: number; driver?: string }[] = [];

    if (data) {
        data.historical?.forEach((h: { month: string; price: number }) => {
            chartData.push({ month: h.month, price: h.price, type: 'historical' });
        });

        if (data.current) {
            chartData.push({
                month: 'Now',
                price: data.current.price,
                type: 'current',
            });
        }

        data.forecast?.forEach((f: { month: string; price: number; direction: string; weather_driver: string; confidence_pct: number }) => {
            chartData.push({
                month: f.month,
                price: f.price,
                type: 'forecast',
                forecast: f.price,
                low: f.price * 0.85,
                high: f.price * 1.15,
                driver: f.weather_driver,
            });
        });
    }

    const currentIdx = chartData.findIndex((d) => d.type === 'current');
    const volatility = data?.weather_risk?.volatility_score || 0;
    const spikeProb = data?.weather_risk?.spike_probability_pct || 0;
    const driverText = data?.weather_risk?.driver_text || '';

    return (
        <div className="min-h-screen p-6" id="price-graph-page">
            <h1 className="text-2xl font-bold text-white mb-6">📊 Price Forecast — {selectedDistrict}</h1>

            {/* Crop pills */}
            <div className="flex flex-wrap gap-2 mb-6">
                {CROPS.map((c) => (
                    <button
                        key={c}
                        onClick={() => handleCropSelect(c)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${crop === c
                                ? 'bg-agro-600 text-white shadow-lg shadow-agro-600/25'
                                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="glass-card flex items-center justify-center h-96">
                    <span className="text-slate-400 animate-pulse">Loading forecast...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart */}
                    <div className="lg:col-span-2 glass-card">
                        <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-lg font-semibold text-white">{crop} — 12 Month View</h3>
                            <div className="flex gap-4 text-xs text-slate-400 ml-auto">
                                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> Historical</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-500 inline-block border-dashed" /> Forecast</span>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15,23,42,0.95)',
                                        border: '1px solid rgba(148,163,184,0.2)',
                                        borderRadius: '12px',
                                        color: '#e2e8f0',
                                    }}
                                    formatter={(value: number, name: string) => [
                                        `₹${value.toLocaleString('en-IN')}`,
                                        name === 'high' ? 'Upper Band' : name === 'low' ? 'Lower Band' : 'Price',
                                    ]}
                                />

                                {/* Confidence band */}
                                <Area type="monotone" dataKey="high" stroke="none" fill="rgba(34,197,94,0.08)" />
                                <Area type="monotone" dataKey="low" stroke="none" fill="rgba(34,197,94,0.08)" />

                                {/* Historical line */}
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={false}
                                    connectNulls
                                />

                                {/* Forecast line */}
                                <Line
                                    type="monotone"
                                    dataKey="forecast"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    strokeDasharray="8 4"
                                    dot={false}
                                />

                                {/* Current price dot */}
                                {currentIdx >= 0 && (
                                    <ReferenceDot
                                        x={chartData[currentIdx]?.month}
                                        y={chartData[currentIdx]?.price}
                                        r={8}
                                        fill="#ef4444"
                                        stroke="#0f172a"
                                        strokeWidth={3}
                                    />
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Weather Risk Panel */}
                    <div className="space-y-4">
                        <div className="glass-card">
                            <h3 className="text-lg font-semibold text-white mb-4">🌦️ Weather Risk</h3>
                            <RiskGauge score={Math.round(volatility * 100)} label="Volatility Score" />
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Spike Probability</span>
                                    <span className="text-white font-semibold">{spikeProb}%</span>
                                </div>
                                <p className="text-xs text-slate-400 bg-slate-800/30 p-3 rounded-lg">{driverText}</p>
                            </div>
                        </div>

                        {data?.current && (
                            <div className="glass-card">
                                <h3 className="text-sm font-medium text-slate-400 mb-2">Current Market</h3>
                                <p className="text-2xl font-bold text-white">₹{data.current.price.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {data.current.mandi} • {data.current.is_live ? '🟢 Live' : '🔴 Cached'}
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`text-sm font-semibold ${data.direction === 'up' ? 'text-green-400' : data.direction === 'down' ? 'text-red-400' : 'text-amber-400'
                                        }`}>
                                        {data.direction === 'up' ? '↑ Bullish' : data.direction === 'down' ? '↓ Bearish' : '→ Stable'}
                                    </span>
                                    <span className="text-xs text-slate-500">({data.confidence_pct}% confidence)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
