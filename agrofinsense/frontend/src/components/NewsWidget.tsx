import React, { useState, useEffect } from 'react';
import { THEME } from '../theme';
import { LightCard, SandalCard } from './Cards';
import { useStore } from '../store';
import { fetchAgriNews, NewsItem } from '../lib/externalApis';

const MOCK_NEWS: NewsItem[] = [
  { title: 'New MSP announced for Kharif crops', description: 'Govt increased MSP for major crops.', link: '#', pubDate: new Date().toISOString(), source: 'AgriNews India' },
  { title: 'Monsoon expected to be normal this year', description: 'IMD forecasts above average rainfall.', link: '#', pubDate: new Date().toISOString(), source: 'Weather Today' },
  { title: 'Fertilizer subsidies extended', description: 'DAP and Urea prices to remain stable.', link: '#', pubDate: new Date().toISOString(), source: 'Finance Daily' },
  { title: 'Export ban on non-basmati rice lifted', description: 'Farmers cheer as prices expected to rise.', link: '#', pubDate: new Date().toISOString(), source: 'Trade News' }
];

export function NewsWidget({ crop }: { crop?: string }) {
  const selectedCrop = useStore(s => s.selectedCrop);
  const targetCrop = crop || selectedCrop;
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);

  useEffect(() => {
    fetchAgriNews(targetCrop).then(res => {
      if (res && res.length > 0) setNews(res.slice(0, 4));
    });
  }, [targetCrop]);

  return (
    <LightCard>
      <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
        📰 Agri News — {targetCrop}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {news.map((n, i) => (
          <SandalCard key={i} style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: THEME.jingleGreen, marginBottom: 4 }}>{n.title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 11, color: THEME.mossDark }}>{n.source} • {new Date(n.pubDate).toLocaleDateString()}</span>
              <a href={n.link} target="_blank" rel="noreferrer" style={{ color: THEME.emeraldDark, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>Read →</a>
            </div>
          </SandalCard>
        ))}
      </div>
    </LightCard>
  );
}
