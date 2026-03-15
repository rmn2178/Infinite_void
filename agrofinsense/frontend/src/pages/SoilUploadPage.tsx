import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../store';
import { uploadSoil, getRecommendation } from '../api';

const STEPS = ['Upload', 'OCR', 'Yield Model', 'Crop Match', 'AI Advisory', 'Done'];

export default function SoilUploadPage() {
    const { farmer } = useStore();
    const farmerId = farmer?.farmer_id || 1;

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [soilData, setSoilData] = useState<Record<string, number> | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [started, setStarted] = useState(false);

    const { data: rec } = useQuery({
        queryKey: ['recommendation', farmerId],
        queryFn: () => getRecommendation(farmerId),
        refetchInterval: started ? 3000 : false,
        enabled: started,
    });

    // Update step based on recommendation status
    if (rec) {
        if (rec.status === 'complete' && currentStep < 5) setCurrentStep(5);
        else if (rec.top_crops?.length > 0 && currentStep < 3) setCurrentStep(3);
        else if (rec.yield_prediction?.estimated_yield_kg_per_ha && currentStep < 2) setCurrentStep(2);
    }

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setCurrentStep(0);

        try {
            const result = await uploadSoil(farmerId, file);
            setSoilData(result);
            setCurrentStep(1);
            setStarted(true);

            // Simulate progression
            setTimeout(() => setCurrentStep(2), 2000);
            setTimeout(() => setCurrentStep(3), 5000);
            setTimeout(() => setCurrentStep(4), 8000);
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf'))) {
            setFile(f);
        }
    }, []);

    return (
        <div className="min-h-screen p-6" id="soil-upload-page">
            <h1 className="text-2xl font-bold text-white mb-6">📄 Soil Report Upload</h1>

            {/* Progress Stepper */}
            <div className="glass-card mb-6">
                <div className="flex items-center justify-between">
                    {STEPS.map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-500 ${i < currentStep ? 'bg-agro-600 text-white' :
                                    i === currentStep ? 'bg-agro-500/30 text-agro-400 ring-2 ring-agro-500 animate-pulse' :
                                        'bg-slate-700/50 text-slate-500'
                                }`}>
                                {i < currentStep ? '✓' : i + 1}
                            </div>
                            <span className={`ml-2 text-xs font-medium ${i <= currentStep ? 'text-white' : 'text-slate-500'
                                }`}>{step}</span>
                            {i < STEPS.length - 1 && (
                                <div className={`w-8 lg:w-16 h-0.5 mx-2 transition-all duration-500 ${i < currentStep ? 'bg-agro-600' : 'bg-slate-700'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Zone */}
                <div
                    className={`glass-card border-2 border-dashed transition-all cursor-pointer ${dragOver ? 'border-agro-500 bg-agro-500/5' : 'border-slate-700/50 hover:border-agro-500/50'
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input')?.click()}
                >
                    <input
                        id="file-input"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div className="text-center py-12">
                        <span className="text-5xl mb-4 block">📋</span>
                        <p className="text-white font-semibold mb-1">
                            {file ? file.name : 'Drop your Soil Health Card PDF here'}
                        </p>
                        <p className="text-slate-400 text-xs">Or click to browse</p>
                    </div>

                    {file && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                            disabled={uploading}
                            className="w-full mt-4 py-3 bg-gradient-to-r from-agro-600 to-agro-700 rounded-xl text-white font-bold hover:from-agro-500 hover:to-agro-600 disabled:opacity-50 transition-all"
                        >
                            {uploading ? '⏳ Processing...' : '🔬 Analyze Soil Report'}
                        </button>
                    )}
                </div>

                {/* Extracted Data */}
                <div className="space-y-4">
                    {soilData && (
                        <div className="glass-card animate-slide-up">
                            <h3 className="text-lg font-semibold text-white mb-4">🧪 Extracted NPK Profile</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Nitrogen', value: soilData.nitrogen_ppm, unit: 'kg/ha', color: 'text-blue-400' },
                                    { label: 'Phosphorus', value: soilData.phosphorus_ppm, unit: 'kg/ha', color: 'text-purple-400' },
                                    { label: 'Potassium', value: soilData.potassium_ppm, unit: 'kg/ha', color: 'text-orange-400' },
                                    { label: 'pH', value: soilData.ph_value, unit: '', color: 'text-emerald-400' },
                                    { label: 'Organic Carbon', value: soilData.organic_carbon_pct, unit: '%', color: 'text-amber-400' },
                                    { label: 'Confidence', value: (soilData.confidence_score * 100).toFixed(0), unit: '%', color: 'text-cyan-400' },
                                ].map((item) => (
                                    <div key={item.label} className="p-3 bg-slate-800/30 rounded-lg">
                                        <span className="text-xs text-slate-400 block">{item.label}</span>
                                        <span className={`text-xl font-bold ${item.color}`}>
                                            {item.value} <span className="text-xs text-slate-500">{item.unit}</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Reasoning */}
                    {rec?.yield_prediction?.estimated_yield_kg_per_ha && (
                        <div className="glass-card animate-slide-up">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-white">🤖 AI Yield Reasoning</h3>
                                <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full">
                                    via llama3.2:3b
                                </span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Predicted Yield</span>
                                    <span className="text-white font-semibold">{rec.yield_prediction.estimated_yield_kg_per_ha} kg/ha</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Confidence</span>
                                    <span className="text-white font-semibold">{rec.yield_prediction.confidence}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Limiting Factor</span>
                                    <span className="text-amber-400 font-medium">{rec.yield_prediction.limiting_factor}</span>
                                </div>
                                <p className="text-xs text-slate-400 bg-slate-800/30 p-3 rounded-lg mt-2">
                                    💡 {rec.yield_prediction.recommendation}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Top Crops */}
                    {rec?.top_crops?.length > 0 && (
                        <div className="glass-card animate-slide-up">
                            <h3 className="text-lg font-semibold text-white mb-3">🌿 Top 3 Crops</h3>
                            {rec.top_crops.map((c: { crop: string; score: number; soil_match: number; weather_match: number }, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg mb-2">
                                    <span className="text-lg">{['🥇', '🥈', '🥉'][i]}</span>
                                    <div className="flex-1">
                                        <span className="text-white font-medium">{c.crop}</span>
                                        <span className="text-xs text-slate-400 ml-2">Soil: {c.soil_match}/10 • Weather: {c.weather_match}/10</span>
                                    </div>
                                    <span className="text-agro-400 font-bold">{c.score}/10</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
