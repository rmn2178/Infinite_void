import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store';
import { getNews } from '../api';

export default function NewsWidget() {
    const { selectedCrop } = useStore();

    const { data: news, isLoading } = useQuery({
        queryKey: ['news', selectedCrop],
        queryFn: () => getNews(selectedCrop),
        refetchInterval: 15 * 60 * 1000,
    });

    return (
        <div className="glass-card mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">📰 {selectedCrop} Market News</h3>
            
            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-slate-800/50 rounded-lg"></div>
                    ))}
                </div>
            ) : !news || news.length === 0 ? (
                <p className="text-slate-400 text-sm">No recent news for {selectedCrop}. Check back later.</p>
            ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {news.map((item: any, i: number) => (
                        <a 
                            key={i} 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block p-3 bg-slate-800/30 rounded-lg hover:bg-slate-700/40 transition-colors border border-transparent hover:border-slate-600/50"
                        >
                            <h4 className="text-sm font-bold text-agro-100 mb-1 leading-tight">{item.title}</h4>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] uppercase font-bold text-agro-500">{item.source}</span>
                                <span className="text-[10px] text-slate-400">
                                    {new Date(item.published).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 line-clamp-2">{item.summary}</p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
