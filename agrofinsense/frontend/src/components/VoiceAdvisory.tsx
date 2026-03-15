import { useState, useRef } from 'react';
import { getVoiceAdvisory } from '../api';

interface VoiceAdvisoryProps {
    farmerId: number;
    narrative?: string;
}

export default function VoiceAdvisory({ farmerId, narrative }: VoiceAdvisoryProps) {
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [textOnly, setTextOnly] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = async () => {
        if (playing && audioRef.current) {
            audioRef.current.pause();
            setPlaying(false);
            return;
        }

        setLoading(true);
        try {
            const blob = await getVoiceAdvisory(farmerId);
            if (blob instanceof Blob && blob.type.includes('audio')) {
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audioRef.current = audio;
                audio.onended = () => setPlaying(false);
                await audio.play();
                setPlaying(true);
            } else {
                setTextOnly(true);
            }
        } catch {
            setTextOnly(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card" id="voice-advisory">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">🔊 Voice Advisory</h3>
                <span className="text-xs px-2 py-1 bg-agro-600/20 text-agro-400 rounded-full">
                    Powered by gemma3:4b (local)
                </span>
            </div>

            <button
                onClick={handlePlay}
                disabled={loading}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${playing
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-agro-600/20 text-agro-400 hover:bg-agro-600/30'
                    }`}
            >
                {loading ? (
                    <span className="animate-spin">⏳</span>
                ) : playing ? (
                    <>
                        <span>⏸</span>
                        <span>Stop</span>
                    </>
                ) : (
                    <>
                        <span>▶️</span>
                        <span>Play Advisory</span>
                    </>
                )}
            </button>

            {/* Waveform animation */}
            {playing && (
                <div className="flex items-end gap-1 h-6 mt-3">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-agro-500 rounded-full"
                            style={{
                                animation: `waveform 0.5s ease-in-out ${i * 0.05}s infinite alternate`,
                                height: '4px',
                            }}
                        />
                    ))}
                </div>
            )}

            {textOnly && (
                <div className="mt-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <p className="text-xs text-amber-400 mb-2">
                        🔇 Voice not configured — showing text advisory
                    </p>
                </div>
            )}

            {narrative && (
                <div className="mt-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap border-t border-slate-700/50 pt-3">
                    {narrative}
                </div>
            )}
        </div>
    );
}
