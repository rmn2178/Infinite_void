import { useEffect, useRef } from 'react';

interface RiskGaugeProps {
    score: number;
    size?: number;
    label?: string;
}

export default function RiskGauge({ score, size = 200, label = 'Risk Score' }: RiskGaugeProps) {
    const canvasRef = useRef<SVGSVGElement>(null);
    const clampedScore = Math.max(0, Math.min(100, score));

    const getColor = (s: number) => {
        if (s < 30) return '#22c55e';
        if (s < 60) return '#f59e0b';
        return '#ef4444';
    };

    const getRiskLabel = (s: number) => {
        if (s < 30) return 'Low';
        if (s < 60) return 'Medium';
        return 'High';
    };

    const color = getColor(clampedScore);
    const riskLabel = getRiskLabel(clampedScore);

    // SVG semicircle gauge
    const radius = 80;
    const circumference = Math.PI * radius;
    const offset = circumference - (clampedScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center" id="risk-gauge">
            <svg
                ref={canvasRef}
                width={size}
                height={size * 0.65}
                viewBox="0 0 200 130"
            >
                {/* Background arc */}
                <path
                    d="M 20 120 A 80 80 0 0 1 180 120"
                    fill="none"
                    stroke="rgba(148,163,184,0.15)"
                    strokeWidth="16"
                    strokeLinecap="round"
                />
                {/* Filled arc */}
                <path
                    d="M 20 120 A 80 80 0 0 1 180 120"
                    fill="none"
                    stroke={color}
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: 'stroke-dashoffset 1.5s ease-out, stroke 0.5s',
                        filter: `drop-shadow(0 0 8px ${color}40)`,
                    }}
                />
                {/* Score text */}
                <text
                    x="100"
                    y="100"
                    textAnchor="middle"
                    fill={color}
                    fontSize="36"
                    fontWeight="bold"
                    fontFamily="Inter, sans-serif"
                >
                    {clampedScore}
                </text>
                <text
                    x="100"
                    y="122"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="12"
                    fontFamily="Inter, sans-serif"
                >
                    {riskLabel}
                </text>
                {/* Scale labels */}
                <text x="15" y="128" fill="#64748b" fontSize="10" fontFamily="Inter">0</text>
                <text x="180" y="128" fill="#64748b" fontSize="10" fontFamily="Inter">100</text>
            </svg>
            <span className="text-xs text-slate-400 mt-1 font-medium">{label}</span>
        </div>
    );
}
