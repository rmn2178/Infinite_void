interface WarehouseRow {
    id: number;
    name: string;
    district: string;
    owner_type: string;
    capacity_mt: number;
    current_stock_mt: number;
    cold_storage: boolean;
    utilisation_pct: number;
}

interface WarehouseTableProps {
    warehouses: WarehouseRow[];
}

export default function WarehouseTable({ warehouses }: WarehouseTableProps) {
    const getUtilBadge = (pct: number) => {
        if (pct >= 90) return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Critical' };
        if (pct >= 70) return { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'High' };
        if (pct >= 40) return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Normal' };
        return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Low' };
    };

    return (
        <div className="glass-card overflow-x-auto" id="warehouse-table">
            <h3 className="text-lg font-semibold text-white mb-4">🏭 Warehouse Status</h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-700/50">
                        <th className="text-left py-3 px-2 text-slate-400 font-medium">Name</th>
                        <th className="text-left py-3 px-2 text-slate-400 font-medium">Type</th>
                        <th className="text-right py-3 px-2 text-slate-400 font-medium">Capacity (MT)</th>
                        <th className="text-right py-3 px-2 text-slate-400 font-medium">Stock (MT)</th>
                        <th className="text-right py-3 px-2 text-slate-400 font-medium">Utilisation</th>
                        <th className="text-center py-3 px-2 text-slate-400 font-medium">Status</th>
                        <th className="text-center py-3 px-2 text-slate-400 font-medium">Cold</th>
                    </tr>
                </thead>
                <tbody>
                    {warehouses.map((w) => {
                        const badge = getUtilBadge(w.utilisation_pct);
                        return (
                            <tr key={w.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                <td className="py-3 px-2 text-white font-medium">{w.name}</td>
                                <td className="py-3 px-2 text-slate-300 uppercase text-xs">{w.owner_type}</td>
                                <td className="py-3 px-2 text-right text-slate-300">{w.capacity_mt.toLocaleString('en-IN')}</td>
                                <td className="py-3 px-2 text-right text-slate-300">{w.current_stock_mt.toLocaleString('en-IN')}</td>
                                <td className="py-3 px-2 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(100, w.utilisation_pct)}%`,
                                                    backgroundColor: badge.text.replace('text-', '').includes('red')
                                                        ? '#ef4444' : badge.text.includes('amber')
                                                            ? '#f59e0b' : '#22c55e',
                                                }}
                                            />
                                        </div>
                                        <span className="text-slate-300 text-xs w-12 text-right">{w.utilisation_pct}%</span>
                                    </div>
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                        {badge.label}
                                    </span>
                                </td>
                                <td className="py-3 px-2 text-center">
                                    {w.cold_storage ? '❄️' : '—'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
