import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { registerFarmer } from '../api';

const DISTRICTS = ['Erode', 'Salem', 'Madurai', 'Thanjavur', 'Coimbatore', 'Trichy', 'Vellore', 'Tirunelveli', 'Chennai', 'Tiruppur'];
const LANGUAGES = [
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
];

export default function LoginPage() {
    const [tab, setTab] = useState<'farmer' | 'officer'>('farmer');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [district, setDistrict] = useState('Erode');
    const [language, setLanguage] = useState('ta');
    const [landArea, setLandArea] = useState('1.0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { setFarmer, setToken, setRole, setSelectedDistrict, ollamaStatus } = useStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await registerFarmer({
                phone,
                name: name || (tab === 'farmer' ? 'Farmer' : 'Officer'),
                district,
                land_area_ha: parseFloat(landArea) || 1.0,
                language,
                role: tab === 'officer' ? 'officer' : 'farmer',
            });

            setFarmer(data);
            setToken(data.token);
            setRole(data.role);
            setSelectedDistrict(data.district);
            navigate(data.role === 'officer' ? '/gov' : '/dashboard');
        } catch (err) {
            setError('Login failed. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" id="login-page">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-agro-400 via-emerald-300 to-agro-500 bg-clip-text text-transparent">
                        🌾 AgroFinSense
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        Agriculture + Fintech + GovTech Intelligence Platform
                    </p>

                    {/* Ollama Status */}
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div className={`w-2 h-2 rounded-full ${ollamaStatus.running && ollamaStatus.gemma_available && ollamaStatus.llama_available
                                ? 'bg-green-500' : ollamaStatus.running ? 'bg-amber-500' : 'bg-red-500'
                            }`} />
                        <span className="text-xs text-slate-500">
                            AI: {ollamaStatus.running ? 'Online' : 'Offline'}
                            {ollamaStatus.running && ` (${ollamaStatus.gemma_available ? '✓' : '✗'} gemma3, ${ollamaStatus.llama_available ? '✓' : '✗'} llama3.2)`}
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex mb-6 bg-slate-800/50 rounded-xl p-1">
                    <button
                        onClick={() => setTab('farmer')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'farmer'
                                ? 'bg-agro-600 text-white shadow-lg shadow-agro-600/25'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        🧑‍🌾 Farmer
                    </button>
                    <button
                        onClick={() => setTab('officer')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'officer'
                                ? 'bg-gov-600 text-white shadow-lg shadow-gov-600/25'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        🏛️ Government
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-card space-y-4 animate-slide-up">
                    <div>
                        <label className="text-xs text-slate-400 font-medium block mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={tab === 'farmer' ? '9876543210' : '9988776655'}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-agro-500 focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 font-medium block mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={tab === 'farmer' ? 'Murugan K' : 'Officer Ravi'}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-agro-500 focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 font-medium block mb-1">District</label>
                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-agro-500 focus:outline-none transition-colors"
                        >
                            {DISTRICTS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {tab === 'farmer' && (
                        <>
                            <div>
                                <label className="text-xs text-slate-400 font-medium block mb-1">Land Area (hectares)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={landArea}
                                    onChange={(e) => setLandArea(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:border-agro-500 focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 font-medium block mb-1">Language</label>
                                <div className="flex gap-2">
                                    {LANGUAGES.map((l) => (
                                        <button
                                            key={l.code}
                                            type="button"
                                            onClick={() => setLanguage(l.code)}
                                            className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all ${language === l.code
                                                    ? 'bg-agro-600/30 text-agro-400 border border-agro-500/50'
                                                    : 'bg-slate-800/30 text-slate-400 border border-slate-700/30 hover:border-slate-600'
                                                }`}
                                        >
                                            {l.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {error && (
                        <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !phone}
                        className={`w-full py-3.5 rounded-xl font-bold text-white transition-all ${tab === 'officer'
                                ? 'bg-gradient-to-r from-gov-600 to-gov-700 hover:from-gov-500 hover:to-gov-600 shadow-lg shadow-gov-600/25'
                                : 'bg-gradient-to-r from-agro-600 to-agro-700 hover:from-agro-500 hover:to-agro-600 shadow-lg shadow-agro-600/25'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? 'Connecting...' : tab === 'farmer' ? '🌾 Enter Dashboard' : '🏛️ Enter Control Panel'}
                    </button>
                </form>
            </div>
        </div>
    );
}
