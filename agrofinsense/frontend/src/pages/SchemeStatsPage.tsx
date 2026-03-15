import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store';
import { getSchemeStats } from '../api';

const DISTRICTS = ['Erode', 'Salem', 'Madurai', 'Thanjavur', 'Coimbatore', 'Trichy', 'Vellore', 'Tirunelveli', 'Chennai', 'Tiruppur'];

export default function SchemeStatsPage() {
    const { selectedDistrict, setSelectedDistrict } = useStore();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['schemeStats', selectedDistrict],
        queryFn: () => getSchemeStats(selectedDistrict),
    });

    return (
        <div className="min-h-screen p-6" id="scheme-stats-page">
            <h1 className="text-2xl font-bold text-white mb-2">📊 Scheme Statistics</h1>
            <p className="text-slate-400 text-sm mb-6">Eligible farmer count per scheme by district</p>

            {/* District selector */}
            <div className="flex flex-wrap gap-2 mb-6">
                {DISTRICTS.map((d) => (
                    <button key={d} onClick={() => setSelectedDistrict(d)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedDistrict === d
                                ? 'bg-gov-600 text-white shadow-lg shadow-gov-600/25'
                                : 'bg-slate-800/50 text-slate-400 hover:text-white'
                            }`}>
                        {d}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="glass-card animate-pulse p-8 text-center text-slate-400">Loading scheme stats...</div>
            ) : stats?.length === 0 ? (
                <div className="glass-card p-8 text-center text-slate-400">No scheme data available for {selectedDistrict}. Register farmers first.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats?.map((s: { scheme_name: string; eligible_farmers: number; total_checked: number; total_benefit_inr: number }, i: number) => (
                        <div key={i} className="glass-card">
                            <h3 className="text-white font-semibold mb-3">{s.scheme_name}</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">Eligible</span>
                                        <span className="text-agro-400 font-semibold">{s.eligible_farmers} / {s.total_checked}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-agro-500 rounded-full transition-all duration-500"
                                            style={{ width: `${s.total_checked > 0 ? (s.eligible_farmers / s.total_checked * 100) : 0}%` }} />
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Total Benefit</span>
                                    <span className="text-white font-semibold">₹{s.total_benefit_inr.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
