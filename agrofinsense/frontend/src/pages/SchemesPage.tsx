import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store';
import { getFarmerSchemes, listSchemes } from '../api';

export default function SchemesPage() {
    const { farmer } = useStore();
    const farmerId = farmer?.farmer_id || 1;

    const { data: eligibility } = useQuery({
        queryKey: ['farmerSchemes', farmerId],
        queryFn: () => getFarmerSchemes(farmerId),
    });

    const { data: allSchemes } = useQuery({
        queryKey: ['allSchemes'],
        queryFn: () => listSchemes(),
    });

    const eligible = eligibility?.filter((s: { eligible: boolean }) => s.eligible) || [];
    const totalBenefit = eligible.reduce((sum: number, s: { benefit_amount: number }) => sum + s.benefit_amount, 0);

    return (
        <div className="min-h-screen p-6" id="schemes-page">
            <h1 className="text-2xl font-bold text-white mb-2">📋 Government Schemes</h1>
            <p className="text-slate-400 text-sm mb-6">
                You are eligible for <span className="text-agro-400 font-semibold">{eligible.length} schemes</span> with total benefit of{' '}
                <span className="text-agro-400 font-semibold">₹{totalBenefit.toLocaleString('en-IN')}</span>
            </p>

            {/* Eligibility Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {eligibility?.map((scheme: { scheme_name: string; eligible: boolean; benefit_amount: number; reason: string }, i: number) => (
                    <div key={i} className={`glass-card border ${scheme.eligible ? 'border-agro-500/30' : 'border-slate-700/30 opacity-60'
                        }`}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold">{scheme.scheme_name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${scheme.eligible
                                    ? 'bg-agro-600/20 text-agro-400'
                                    : 'bg-red-600/20 text-red-400'
                                }`}>
                                {scheme.eligible ? '✓ Eligible' : '✗ Not Eligible'}
                            </span>
                        </div>
                        {scheme.eligible && (
                            <p className="text-2xl font-bold text-agro-400 mb-2">
                                ₹{scheme.benefit_amount.toLocaleString('en-IN')}
                            </p>
                        )}
                        <p className="text-xs text-slate-400">{scheme.reason}</p>
                    </div>
                ))}
            </div>

            {/* All Schemes Reference */}
            <h2 className="text-xl font-bold text-white mb-4">📚 All Available Schemes</h2>
            <div className="space-y-3">
                {allSchemes?.map((scheme: { name: string; description: string; criteria: string; benefit: string; ministry: string }, i: number) => (
                    <div key={i} className="glass-card">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold">{scheme.name}</h3>
                            <span className="text-xs px-2 py-1 bg-gov-600/20 text-gov-400 rounded-full">{scheme.ministry}</span>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{scheme.description}</p>
                        <div className="flex gap-4 text-xs">
                            <span className="text-slate-400">Criteria: <span className="text-slate-300">{scheme.criteria}</span></span>
                            <span className="text-agro-400 font-semibold">Benefit: {scheme.benefit}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
