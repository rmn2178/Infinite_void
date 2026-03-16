import React from 'react';
import { THEME } from '../theme';
import { DarkCard } from './Cards';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  data: { time: string; price: number }[];
  crop: string;
  height?: number;
}

export function LivePriceChart({ data, crop, height = 260 }: Props) {
  return (
    <DarkCard style={{ height, display: 'flex', flexDirection: 'column' }}>
      <div style={{ color: THEME.creamWhite, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        Live Price Movement — {crop}
      </div>
      <div style={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={THEME.emeraldDark} strokeDasharray="3 3" strokeOpacity={0.4} />
            <XAxis dataKey="time" tick={{ fill: THEME.mossDark, fontSize: 10 }} stroke={THEME.emeraldDark} />
            <YAxis tick={{ fill: THEME.mossDark, fontSize: 10 }} stroke="transparent" domain={['dataMin - 50', 'dataMax + 50']} tickFormatter={v => Math.round(v).toString()} />
            <Tooltip contentStyle={{ background: THEME.nearBlack, border: '1px solid ' + THEME.emeraldDark, borderRadius: 8, color: THEME.creamWhite, fontSize: 12 }} />
            <Area type="monotone" dataKey="price" fill="rgba(221,184,146,0.15)" stroke="transparent" isAnimationActive={false} />
            <Line type="monotone" dataKey="price" stroke={THEME.deepSandal} strokeWidth={2} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </DarkCard>
  );
}
