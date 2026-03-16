import React, { useState, useRef } from 'react';
import { THEME } from '../theme';
import { getVoiceAdvisory, getRecommendation } from '../api';

export function VoiceAdvisory({ farmerId }: { farmerId: number }) {
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startPlaying = async () => {
    if (playing) {
      audioRef.current?.pause();
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    setStatus('Fetching voice...');

    try {
      const blob = await getVoiceAdvisory(farmerId);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);
      setStatus('');
      audio.play();
    } catch {
      setStatus('Fallback to speech synthesis...');
      try {
        const rec = await getRecommendation(farmerId);
        if (rec && rec.why_narrative) {
          const utterance = new SpeechSynthesisUtterance(rec.why_narrative);
          utterance.lang = 'ta-IN';
          utterance.onend = () => setPlaying(false);
          setStatus('');
          window.speechSynthesis.speak(utterance);
        } else {
          setPlaying(false);
          setStatus('🔇 Voice not configured');
        }
      } catch {
        setPlaying(false);
        setStatus('🔇 Voice not configured');
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <button 
        onClick={startPlaying}
        style={{
          background: THEME.darkForest, color: THEME.creamWhite, 
          border: 'none', borderRadius: 12, padding: '10px 20px', 
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8
        }}
      >
        {playing ? '⏸ Stop Advisory' : '▶️ Play Advisory'}
      </button>

      {playing && status === '' && (
        <div style={{ display: 'flex', gap: 4, height: 20, alignItems: 'flex-end' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{
              width: 4, background: THEME.liveGreen, borderRadius: 2,
              animation: `waveform ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random()}s`
            }} />
          ))}
        </div>
      )}

      {status && <span style={{ color: THEME.warning, fontSize: 13, fontWeight: 500 }}>{status}</span>}
    </div>
  );
}
