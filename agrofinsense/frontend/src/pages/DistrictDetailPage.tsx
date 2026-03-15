import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store';
import { getDistrictSummary, getWarehouseStatus } from '../api';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import RiskGauge from '../components/RiskGauge';
import WarehouseTable from '../components/WarehouseTable';
import AlertBanner from '../components/AlertBanner';

export default function DistrictDetailPage() {
    const { districtName } = useParams<{ districtName: string }>();
    const { selectedSeason } = useStore();
    const district = districtName || 'Erode';

    const { data, isLoading } = useQuery({
        queryKey: ['districtSummary', district, selectedSeason],
        queryFn: () => getDistrictSummary(district, selectedSeason),
    });

    const { data: warehouses } = useQuery({
        queryKey: ['warehouses', district],
        queryFn: () => getWarehouseStatus(district),
    });

    if (isLoading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <span className="text-slate-400 animate-pulse text-lg">Loading district analysis...</span>
            </div>
        );
    }

    const budget = data?.budget_data || {};
    const storage = data?.storage_data || {};
    const yieldData = data?.yield_data || {};
    const riskScore = data?.postharvest_loss?.loss_percentage
        ? Math.round(data.postharvest_loss.loss_percentage * 3) : 45;

    const budgetChartData = [
        { name: 'Procurement', value: Math.round((budget.procurement_cost_inr || 0) / 10000000) },
        { name: 'PMFBY', value: Math.round((budget.pmfby_payout_est_inr || 0) / 10000000) },
        { name: 'Total Scheme', value: Math.round((budget.total_scheme_spend || 0) / 10000000) },
    ];

    return (
        <div className="min-h-screen p-6" id="district-detail-page">
            <h1 className="text-2xl font-bold text-white mb-2">📍 {district} District</h1>
            <p className="text-slate-400 text-sm mb-6">{selectedSeason} • {yieldData.crop || 'Rice'}</p>

            {storage.status === 'overflow' && (
                <div className="mb-6">
                    <AlertBanner level="error"
                        message={`Storage overflow: ${storage.storage_gap_mt?.toLocaleString()} MT gap in ${district}`}
                    />
                </div>
            )}

            {/* Section 1: Yield */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="glass-card">
                    <h3 className="text-lg font-semibold text-white mb-4">📈 Yield Forecast</h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-slate-800/30 rounded-lg">
                            <span className="text-xs text-slate-400">Total Tonnage</span>
                            <p className="text-xl font-bold text-white">{Math.round(yieldData.total_tonnage_mt || 0).toLocaleString()} MT</p>
                        </div>
                        <div className="p-3 bg-slate-800/30 rounded-lg">
                            <span className="text-xs text-slate-400">MSP Used</span>
                            <p className="text-xl font-bold text-agro-400">₹{budget.msp_used || 2300}/q</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={[
                            { month: 'Jun', yield: (yieldData.total_tonnage_mt || 10000) * 0.1 },
                            { month: 'Jul', yield: (yieldData.total_tonnage_mt || 10000) * 0.3 },
                            { month: 'Aug', yield: (yieldData.total_tonnage_mt || 10000) * 0.6 },
                            { month: 'Sep', yield: (yieldData.total_tonnage_mt || 10000) * 0.85 },
                            { month: 'Oct', yield: (yieldData.total_tonnage_mt || 10000) * 1.0 },
                            { month: 'Nov', yield: (yieldData.total_tonnage_mt || 10000) * 0.95 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '12px', color: '#e2e8f0' }} />
                            <Area type="monotone" dataKey="yield" stroke="#22c55e" fill="rgba(34,197,94,0.15)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Section 2: Budget */}
                <div className="glass-card">
                    <h3 className="text-lg font-semibold text-white mb-4">💰 Budget Breakdown (₹ Crore)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={budgetChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '12px', color: '#e2e8f0' }} />
                            <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                        <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                            <span className="text-slate-400 block">Procurement</span>
                            <span className="text-white font-semibold">₹{budgetChartData[0].value} Cr</span>
                        </div>
                        <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                            <span className="text-slate-400 block">PMFBY</span>
                            <span className="text-white font-semibold">₹{budgetChartData[1].value} Cr</span>
                        </div>
                        <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                            <span className="text-slate-400 block">Total</span>
                            <span className="text-white font-semibold">₹{budgetChartData[2].value} Cr</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Warehouses */}
            {warehouses && <div className="mb-6"><WarehouseTable warehouses={warehouses} /></div>}

            {/* Section 4: Risk + AI Briefing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-white mb-4 self-start">⚡ Post-Harvest Risk</h3>
                    <RiskGauge score={riskScore} label="Loss Risk Score" />
                    {data?.postharvest_loss && (
                        <div className="mt-4 w-full space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-slate-400">Loss %</span><span className="text-white">{data.postharvest_loss.loss_percentage}%</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Factor</span><span className="text-amber-400">{data.postharvest_loss.dominant_factor}</span></div>
                            <p className="text-xs text-slate-400 bg-slate-800/30 p-2 rounded-lg">{data.postharvest_loss.recommendation}</p>
                        </div>
                    )}
                </div>

                <div className="glass-card">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">📝 AI District Briefing</h3>
                        <span className="text-xs px-2 py-1 bg-agro-600/20 text-agro-400 rounded-full">via gemma3:4b</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {data?.summary_text || 'Generating briefing...'}
                    </p>
                </div>
            </div>
        </div>
    );
}
