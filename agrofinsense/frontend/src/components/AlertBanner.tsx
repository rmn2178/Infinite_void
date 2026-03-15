interface AlertBannerProps {
    level: 'error' | 'warning' | 'info';
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function AlertBanner({ level, message, actionLabel, onAction }: AlertBannerProps) {
    const styles = {
        error: {
            bg: 'bg-red-500/10',
            border: 'border-l-4 border-red-500',
            icon: '🚨',
            text: 'text-red-300',
        },
        warning: {
            bg: 'bg-amber-500/10',
            border: 'border-l-4 border-amber-500',
            icon: '⚠️',
            text: 'text-amber-300',
        },
        info: {
            bg: 'bg-blue-500/10',
            border: 'border-l-4 border-blue-500',
            icon: 'ℹ️',
            text: 'text-blue-300',
        },
    };

    const s = styles[level];

    return (
        <div className={`${s.bg} ${s.border} rounded-r-xl p-4 flex items-center justify-between animate-slide-up`} id={`alert-${level}`}>
            <div className="flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <span className={`text-sm font-medium ${s.text}`}>{message}</span>
            </div>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
