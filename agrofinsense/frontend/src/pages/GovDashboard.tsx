import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { getHeatmap, getWarehouseStatus } from '../api';
import MetricCard from '../components/MetricCard';
import TamilNaduMap from '../components/TamilNaduMap';
import AlertBanner from '../components/AlertBanner';

export default function GovDashboard() {
    const { selectedSeason, logout, farmer } = useStore();
    const navigate = useNavigate();

    const { data: heatmapData } = useQuery({
        queryKey: ['heatmap', 'TamilNadu', selectedSeason],
        queryFn: () => getHeatmap('TamilNadu', selectedSeason),
    });

    const totalTonnage = heatmapData?.reduce((s: number, d: { tonnage_mt: number }) => s + d.tonnage_mt, 0) || 0;
    const totalBudget = heatmapData?.reduce((s: number, d: { budget_crore: number }) => s + d.budget_crore, 0) || 0;
    const avgRisk = heatmapData?.length
        ? Math.round(heatmapData.reduce((s: number, d: { risk_score: number }) => s + d.risk_score, 0) / heatmapData.length) : 0;
    const highRisk = heatmapData?.filter((d: { risk_score: number }) => d.risk_score > 60) || [];

    return (
        <div className="min-h-screen p-6" id="gov-dashboard">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">🏛️ Government Control Panel</h1>
                    <p className="text-slate-400 text-sm mt-1">Tamil Nadu — {selectedSeason} • {farmer?.name || 'Officer'}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/scheme-stats')} className="text-xs px-4 py-2 bg-gov-600/20 text-gov-400 rounded-full hover:bg-gov-600/30 font-medium transition">📊 Scheme Stats</button>
                    <span className="text-xs px-3 py-1.5 bg-agro-600/20 text-agro-400 rounded-full font-medium">AI: gemma3:4b</span>
                    <button onClick={() => { logout(); navigate('/'); }} className="text-xs px-3 py-1.5 bg-slate-700/50 text-slate-400 rounded-full hover:bg-slate-600/50 transition">Logout</button>
                </div>
            </div>

            {highRisk.length > 0 && (
                <div className="mb-6">
                    <AlertBanner level="warning" message={`${highRisk.length} high-risk district(s): ${highRisk.map((d: { district: string }) => d.district).join(', ')}`}
                        actionLabel="View" onAction={() => navigate(`/district/${highRisk[0].district}`)} />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard label="Total Tonnage" value={Math.round(totalTonnage).toLocaleString()} unit="MT" colour="gov" icon="🌾" />
                <MetricCard label="Budget" value={`₹${totalBudget.toFixed(1)}`} unit="Crore" colour="gov" icon="💰" />
                <MetricCard label="Avg Risk" value={avgRisk} unit="/100" colour="gov" icon="⚡" trend={avgRisk > 50 ? 'up' : 'down'} />
                <MetricCard label="Districts" value={heatmapData?.length || 10} unit="monitored" colour="gov" icon="🗺️" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><TamilNaduMap data={heatmapData || []} /></div>
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">📊 Districts</h3>
                    {heatmapData?.map((d: { district: string; tonnage_mt: number; budget_crore: number; risk_score: number }) => (
                        <div key={d.district} className="glass-card cursor-pointer hover:border-gov-400/50" onClick={() => navigate(`/district/${d.district}`)}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-white font-medium">{d.district}</h4>
                                    <p className="text-xs text-slate-400">{Math.round(d.tonnage_mt).toLocaleString()} MT • ₹{d.budget_crore} Cr</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.risk_score < 30 ? 'bg-green-500/20 text-green-400' : d.risk_score < 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                                    Risk: {d.risk_score}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
