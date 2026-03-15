import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PricePoint {
    time: string;
    price: number;
}

interface LivePriceChartProps {
    data: PricePoint[];
    crop: string;
}

export default function LivePriceChart({ data, crop }: LivePriceChartProps) {
    return (
        <div className="glass-card" id="live-price-chart">
            <div className="flex items-center gap-3 mb-4">
                <div className="live-dot" />
                <span className="text-sm font-semibold text-white">LIVE — {crop} Market Price</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis
                        dataKey="time"
                        stroke="#64748b"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) => `₹${v}`}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15,23,42,0.95)',
                            border: '1px solid rgba(148,163,184,0.2)',
                            borderRadius: '12px',
                            color: '#e2e8f0',
                        }}
                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Price']}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: '#22c55e', stroke: '#0f172a', strokeWidth: 2 }}
                        animationDuration={300}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
