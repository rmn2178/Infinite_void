interface MetricCardProps {
    label: string;
    value: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'flat';
    trendPct?: number;
    colour?: string;
    icon?: string;
}

export default function MetricCard({ label, value, unit, trend, trendPct, colour = 'agro', icon }: MetricCardProps) {
    const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
    const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-yellow-400';

    const borderColor = colour === 'gov' ? 'border-gov-500/30 hover:border-gov-400/50' : 'border-agro-500/30 hover:border-agro-400/50';
    const glowColor = colour === 'gov' ? 'hover:shadow-gov-500/10' : 'hover:shadow-agro-500/10';

    return (
        <div className={`glass-card ${borderColor} ${glowColor} group cursor-default`} id={`metric-${label.toLowerCase().replace(/\s/g, '-')}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
                {icon && <span className="text-xl">{icon}</span>}
            </div>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white group-hover:text-agro-300 transition-colors">
                    {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
                </span>
                {unit && <span className="text-sm text-slate-400 mb-1">{unit}</span>}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${trendColor}`}>
                    <span className="font-semibold">{trendIcon}</span>
                    {trendPct !== undefined && <span>{trendPct}%</span>}
                </div>
            )}
        </div>
    );
}
