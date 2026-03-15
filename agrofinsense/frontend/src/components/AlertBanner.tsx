import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store';
import { getAlerts } from '../api';

interface Alert {
    type: 'FLOOD' | 'DROUGHT' | 'HEATWAVE';
    level: 'HIGH' | 'MODERATE' | 'LOW';
    message: string;
    date: string;
}

export default function AlertBanner() {
    const { selectedDistrict } = useStore();
    const [hiddenAlerts, setHiddenAlerts] = useState<Set<string>>(new Set());

    const { data } = useQuery({
        queryKey: ['alerts', selectedDistrict],
        queryFn: () => getAlerts(selectedDistrict),
        refetchInterval: 5 * 60 * 1000,
    });

    const getStyles = (level: string) => {
        switch (level) {
            case 'HIGH':
                return { bg: 'bg-red-500/10', border: 'border-l-4 border-red-500', text: 'text-red-300' };
            case 'MODERATE':
                return { bg: 'bg-amber-500/10', border: 'border-l-4 border-amber-500', text: 'text-amber-300' };
            default:
                return { bg: 'bg-yellow-500/10', border: 'border-l-4 border-yellow-500', text: 'text-yellow-300' };
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'FLOOD': return '🌊';
            case 'DROUGHT': return '🌵';
            case 'HEATWAVE': return '🌡️';
            default: return '⚠️';
        }
    };

    const alerts = data?.alerts || [];

    // Auto-dismiss LOW alerts after 5 seconds
    useEffect(() => {
        const timeouts: number[] = [];
        alerts.forEach((alert: Alert, i: number) => {
            const id = `${alert.type}-${i}`;
            if (alert.level === 'LOW' && !hiddenAlerts.has(id)) {
                const t = window.setTimeout(() => {
                    setHiddenAlerts(prev => new Set(prev).add(id));
                }, 5000);
                timeouts.push(t);
            }
        });
        return () => timeouts.forEach(clearTimeout);
    }, [alerts, hiddenAlerts]);

    if (!alerts.length) return null;

    return (
        <div className="flex flex-col gap-2 w-full mb-6">
            {alerts.map((alert: Alert, i: number) => {
                const id = `${alert.type}-${i}`;
                if (hiddenAlerts.has(id)) return null;
                const s = getStyles(alert.level);
                return (
                    <div key={id} className={`${s.bg} ${s.border} rounded-r-xl p-4 flex items-center justify-between animate-slide-up`} id={`alert-${alert.level.toLowerCase()}`}>
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{getIcon(alert.type)}</span>
                            <span className={`text-sm font-medium ${s.text}`}>
                                <strong>{alert.type} Alert:</strong> {alert.message} ({alert.date})
                            </span>
                        </div>
                        <button
                            onClick={() => setHiddenAlerts(prev => new Set(prev).add(id))}
                            className="px-3 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

