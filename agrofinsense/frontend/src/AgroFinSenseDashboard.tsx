import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarRadiusAxis, Cell, ReferenceLine
} from "recharts";
import {
  Leaf, TrendingUp, TrendingDown, Activity, BarChart2, Map, Settings,
  Upload, Camera, AlertCircle, CheckCircle, Clock, Zap, DollarSign,
  Droplets, Thermometer, CloudRain, Wind, Sun, Eye, RefreshCw,
  Bell, Database, Users, Wheat, ChevronDown, X, Play
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// THEME — Agri-Vest Design System
// ═══════════════════════════════════════════════════════════
const THEME = {
  darkForest: '#1B4332', emeraldDark: '#2D6A4F', jingleGreen: '#132A13',
  nearBlack: '#0B1C15', warmSandal: '#E6CCB2', deepSandal: '#DDB892',
  lightSandal: '#EDE0D4', earthSandal: '#B08968', mossDark: '#A0916C',
  creamWhite: '#F5EBE0', success: '#2D6A4F', warning: '#DDB892',
  danger: '#C0392B', liveGreen: '#27AE60', liveRed: '#E74C3C',
};
const CHART_COLORS = ['#1B4332','#2D6A4F','#DDB892','#E6CCB2','#A0916C','#B08968','#27AE60'];

// ═══════════════════════════════════════════════════════════
// DATASETS
// ═══════════════════════════════════════════════════════════
const CROP_YIELD_DATA: Record<string, {avgN:number;avgP:number;avgK:number;avgTemp:number;avgHumidity:number;avgPH:number;avgRain:number;avgYield:number;minY:number;maxY:number}> = {
  Rice:{avgN:82,avgP:48,avgK:40,avgTemp:23,avgHumidity:82,avgPH:6.5,avgRain:236,avgYield:4707,minY:300,maxY:11000},
  Maize:{avgN:78,avgP:48,avgK:40,avgTemp:22,avgHumidity:65,avgPH:6.3,avgRain:68,avgYield:2384,minY:1200,maxY:4000},
  Cotton:{avgN:118,avgP:46,avgK:43,avgTemp:24,avgHumidity:79,avgPH:6.9,avgRain:80,avgYield:1411,minY:600,maxY:2400},
  Banana:{avgN:100,avgP:82,avgK:50,avgTemp:27,avgHumidity:80,avgPH:5.9,avgRain:104,avgYield:2377,minY:1000,maxY:4000},
  Coconut:{avgN:22,avgP:17,avgK:31,avgTemp:27,avgHumidity:95,avgPH:5.9,avgRain:177,avgYield:2551,minY:1200,maxY:4200},
  Coffee:{avgN:101,avgP:28,avgK:29,avgTemp:25,avgHumidity:59,avgPH:6.9,avgRain:158,avgYield:2639,minY:1200,maxY:4100},
  Grapes:{avgN:24,avgP:24,avgK:40,avgTemp:24,avgHumidity:81,avgPH:6.0,avgRain:70,avgYield:2840,minY:1300,maxY:4900},
  Jute:{avgN:78,avgP:46,avgK:40,avgTemp:25,avgHumidity:80,avgPH:6.7,avgRain:175,avgYield:1790,minY:900,maxY:2800},
  Lentil:{avgN:19,avgP:68,avgK:19,avgTemp:24,avgHumidity:65,avgPH:6.9,avgRain:46,avgYield:2029,minY:900,maxY:3300},
  Mango:{avgN:20,avgP:27,avgK:30,avgTemp:31,avgHumidity:50,avgPH:5.7,avgRain:95,avgYield:1750,minY:800,maxY:3000},
  MungBean:{avgN:20,avgP:48,avgK:20,avgTemp:29,avgHumidity:85,avgPH:6.7,avgRain:49,avgYield:2718,minY:1300,maxY:4200},
  Orange:{avgN:20,avgP:16,avgK:10,avgTemp:23,avgHumidity:93,avgPH:7.0,avgRain:113,avgYield:1391,minY:600,maxY:2400},
  Papaya:{avgN:50,avgP:59,avgK:50,avgTemp:34,avgHumidity:92,avgPH:6.7,avgRain:143,avgYield:2081,minY:900,maxY:3500},
  PigeonPeas:{avgN:20,avgP:68,avgK:20,avgTemp:27,avgHumidity:49,avgPH:5.8,avgRain:149,avgYield:5272,minY:2500,maxY:8000},
  Pomegranate:{avgN:18,avgP:18,avgK:40,avgTemp:21,avgHumidity:90,avgPH:6.4,avgRain:108,avgYield:3455,minY:1600,maxY:5500},
  Watermelon:{avgN:100,avgP:10,avgK:50,avgTemp:25,avgHumidity:85,avgPH:6.5,avgRain:50,avgYield:3969,minY:1800,maxY:6500},
  Blackgram:{avgN:40,avgP:67,avgK:19,avgTemp:30,avgHumidity:67,avgPH:7.1,avgRain:68,avgYield:2131,minY:1000,maxY:3500},
  ChickPea:{avgN:40,avgP:68,avgK:80,avgTemp:18,avgHumidity:16,avgPH:7.3,avgRain:84,avgYield:2531,minY:1200,maxY:4100},
  KidneyBeans:{avgN:20,avgP:68,avgK:20,avgTemp:20,avgHumidity:22,avgPH:5.7,avgRain:105,avgYield:3161,minY:1500,maxY:5200},
  MothBeans:{avgN:20,avgP:48,avgK:20,avgTemp:28,avgHumidity:53,avgPH:6.7,avgRain:51,avgYield:3214,minY:1500,maxY:5300},
  Muskmelon:{avgN:100,avgP:18,avgK:50,avgTemp:28,avgHumidity:92,avgPH:6.4,avgRain:25,avgYield:3056,minY:1400,maxY:5000},
  Apple:{avgN:21,avgP:18,avgK:8,avgTemp:9,avgHumidity:92,avgPH:5.9,avgRain:113,avgYield:1704,minY:800,maxY:2800},
};

const MARKET_PRICE_DATA = [
  {state:"Uttar Pradesh",crop:"ARHAR",cost:9794,prod:1941,yield:9.83,temp:28.96,rain:3373,price:19589},
  {state:"Karnataka",crop:"ARHAR",cost:10593,prod:2172,yield:7.47,temp:29.22,rain:3520,price:21187},
  {state:"Gujarat",crop:"ARHAR",cost:13468,prod:1898,yield:9.59,temp:28.47,rain:2957,price:26938},
  {state:"Andhra Pradesh",crop:"ARHAR",cost:17051,prod:3670,yield:6.42,temp:28.49,rain:3079,price:34104},
  {state:"Maharashtra",crop:"ARHAR",cost:17130,prod:2775,yield:8.72,temp:28.30,rain:2566,price:34262},
  {state:"Maharashtra",crop:"COTTON",cost:23711,prod:2539,yield:12.69,temp:28.73,rain:2534,price:47423},
  {state:"Punjab",crop:"COTTON",cost:29047,prod:2003,yield:24.39,temp:28.65,rain:3347,price:58095},
  {state:"Andhra Pradesh",crop:"COTTON",cost:29140,prod:2509,yield:17.83,temp:28.83,rain:3576,price:58282},
  {state:"Gujarat",crop:"COTTON",cost:29616,prod:2179,yield:19.05,temp:28.38,rain:2899,price:59233},
  {state:"Haryana",crop:"COTTON",cost:29918,prod:2127,yield:19.90,temp:28.53,rain:2687,price:59838},
  {state:"Rajasthan",crop:"GRAM",cost:8552,prod:1691,yield:6.83,temp:28.62,rain:2960,price:17106},
  {state:"Madhya Pradesh",crop:"GRAM",cost:9803,prod:1551,yield:10.29,temp:28.95,rain:2365,price:19608},
  {state:"Uttar Pradesh",crop:"GRAM",cost:12833,prod:1882,yield:10.93,temp:28.67,rain:2957,price:25667},
  {state:"Maharashtra",crop:"GRAM",cost:12985,prod:2277,yield:8.05,temp:28.66,rain:2741,price:25972},
  {state:"Andhra Pradesh",crop:"GRAM",cost:14421,prod:1559,yield:16.69,temp:28.94,rain:2937,price:28844},
  {state:"Karnataka",crop:"GROUNDNUT",cost:13647,prod:3484,yield:4.71,temp:28.82,rain:2612,price:27295},
  {state:"Andhra Pradesh",crop:"GROUNDNUT",cost:21229,prod:2554,yield:11.97,temp:28.11,rain:3275,price:42459},
  {state:"Tamil Nadu",crop:"GROUNDNUT",cost:22507,prod:2358,yield:11.98,temp:28.66,rain:2352,price:45016},
  {state:"Gujarat",crop:"GROUNDNUT",cost:22951,prod:1918,yield:13.45,temp:28.66,rain:2943,price:45903},
  {state:"Maharashtra",crop:"GROUNDNUT",cost:26078,prod:3207,yield:9.33,temp:28.76,rain:2606,price:52158},
  {state:"Bihar",crop:"MAIZE",cost:13513,prod:404,yield:42.95,temp:28.86,rain:3554,price:27028},
  {state:"Karnataka",crop:"MAIZE",cost:13792,prod:581,yield:31.10,temp:28.80,rain:2357,price:27586},
  {state:"Rajasthan",crop:"MAIZE",cost:14421,prod:658,yield:23.56,temp:28.74,rain:2442,price:28843},
  {state:"Uttar Pradesh",crop:"MAIZE",cost:15635,prod:1387,yield:13.70,temp:28.80,rain:2480,price:31271},
  {state:"Andhra Pradesh",crop:"MAIZE",cost:25687,prod:840,yield:42.68,temp:28.67,rain:3282,price:51375},
  {state:"Orissa",crop:"MOONG",cost:5483,prod:2614,yield:3.01,temp:28.70,rain:2442,price:10968},
  {state:"Rajasthan",crop:"MOONG",cost:6204,prod:2068,yield:4.05,temp:28.59,rain:2998,price:12409},
  {state:"Karnataka",crop:"MOONG",cost:6440,prod:5777,yield:1.32,temp:28.98,rain:2926,price:12882},
  {state:"Andhra Pradesh",crop:"MOONG",cost:6684,prod:2228,yield:5.90,temp:28.76,rain:3075,price:13369},
  {state:"Maharashtra",crop:"MOONG",cost:10780,prod:2261,yield:6.70,temp:28.65,rain:2357,price:21562},
  {state:"Uttar Pradesh",crop:"PADDY",cost:17022,prod:732,yield:36.61,temp:29.15,rain:3007,price:34045},
  {state:"Orissa",crop:"PADDY",cost:17478,prod:715,yield:32.42,temp:29.09,rain:2987,price:34957},
  {state:"West Bengal",crop:"PADDY",cost:24731,prod:731,yield:39.04,temp:28.49,rain:3722,price:49463},
  {state:"Punjab",crop:"PADDY",cost:25154,prod:669,yield:67.41,temp:29.03,rain:3154,price:50310},
  {state:"Andhra Pradesh",crop:"PADDY",cost:29664,prod:789,yield:56.00,temp:28.76,rain:2987,price:59330},
  {state:"Madhya Pradesh",crop:"MUSTARD",cost:8686,prod:1279,yield:12.94,temp:28.71,rain:3591,price:17373},
  {state:"Rajasthan",crop:"MUSTARD",cost:11385,prod:1341,yield:13.54,temp:28.70,rain:3264,price:22772},
  {state:"Uttar Pradesh",crop:"MUSTARD",cost:12774,prod:1595,yield:13.57,temp:28.70,rain:2782,price:25549},
  {state:"Gujarat",crop:"MUSTARD",cost:13740,prod:1610,yield:11.61,temp:28.85,rain:3007,price:27482},
  {state:"Haryana",crop:"MUSTARD",cost:14715,prod:1251,yield:19.94,temp:28.88,rain:2898,price:29431},
  {state:"Uttar Pradesh",crop:"SUGARCANE",cost:24538,prod:93,yield:448.89,temp:29.46,rain:2782,price:49077},
  {state:"Karnataka",crop:"SUGARCANE",cost:55655,prod:86,yield:986.21,temp:28.98,rain:2791,price:111311},
  {state:"Andhra Pradesh",crop:"SUGARCANE",cost:56621,prod:119,yield:757.92,temp:28.80,rain:3007,price:113243},
  {state:"Maharashtra",crop:"SUGARCANE",cost:57673,prod:107,yield:744.01,temp:28.89,rain:3489,price:115348},
  {state:"Tamil Nadu",crop:"SUGARCANE",cost:66335,prod:85,yield:1015.45,temp:28.97,rain:2422,price:132671},
  {state:"Madhya Pradesh",crop:"WHEAT",cost:12464,prod:810,yield:23.59,temp:29.37,rain:3275,price:24929},
  {state:"Punjab",crop:"WHEAT",cost:17945,prod:804,yield:39.83,temp:28.84,rain:3079,price:35892},
  {state:"Uttar Pradesh",crop:"WHEAT",cost:18979,prod:769,yield:34.99,temp:28.73,rain:2721,price:37959},
  {state:"Rajasthan",crop:"WHEAT",cost:19119,prod:683,yield:37.19,temp:28.89,rain:3449,price:38239},
];

const MARKET_CROPS = [...new Set(MARKET_PRICE_DATA.map(d => d.crop))];
const DISTRICTS_TN = ['Chennai','Coimbatore','Madurai','Salem','Erode','Thanjavur','Tiruchirappalli','Tirunelveli','Vellore','Dindigul'];
const STORIES = [
  {name:"Murugan K",dist:"Erode",text:"Switched to Groundnut based on AI recommendation.",gain:"+₹42,000/ha"},
  {name:"Lakshmi D",dist:"Salem",text:"Sold Maize at peak after price forecast alert.",gain:"Saved ₹18,000"},
  {name:"Rajan V",dist:"Thanjavur",text:"PMFBY claim processed swiftly via platform.",gain:"Received ₹38,500"},
];
const NOTIFICATIONS = [
  "🔔 Alert: Groundnut price in Erode rose 3.2% in last 30 minutes",
  "🌧️ Weather: Below-average rainfall forecast for Salem — consider irrigation",
  "📢 Govt: PM-KISAN installment due in 12 days — 234 farmers eligible",
  "📈 Sugarcane prices in Tamil Nadu hit monthly high",
  "🌾 New MSP for Kharif 2025 announced by Ministry of Agriculture",
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
const fmt = (n: number) => n.toLocaleString('en-IN');
const fmtINR = (n: number) => '₹' + fmt(Math.round(n));
const pct = (v: number) => (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
const ts = () => new Date().toLocaleTimeString('en-IN', {hour12:false});

// ═══════════════════════════════════════════════════════════
// SIMULATION HOOK
// ═══════════════════════════════════════════════════════════
interface LivePrice { current: number; base: number; direction: 'up'|'down'|'flat'; changePct: number; }
interface SimData {
  livePrices: Record<string, LivePrice>;
  liveYields: Record<string, LivePrice>;
  priceHistory: Record<string, number[]>;
  marketOpen: boolean; totalOrders: number; lastUpdate: string;
  flashing: Set<string>; gainers: number; losers: number;
  totalVolume: number;
}
const SimCtx = createContext<SimData & {demoMode:boolean;setDemoMode:(v:boolean)=>void}>({} as any);

function useDataSimulator(demoMode: boolean): SimData {
  const [data, setData] = useState<SimData>(() => {
    const lp: Record<string, LivePrice> = {};
    const ph: Record<string, number[]> = {};
    MARKET_PRICE_DATA.forEach(d => {
      const k = `${d.crop}_${d.state}`;
      lp[k] = { current: d.price, base: d.price, direction: 'flat', changePct: 0 };
    });
    MARKET_CROPS.forEach(c => { ph[c] = [MARKET_PRICE_DATA.find(d=>d.crop===c)!.price]; });
    const ly: Record<string, LivePrice> = {};
    Object.entries(CROP_YIELD_DATA).forEach(([c,v]) => {
      ly[c] = { current: v.avgYield, base: v.avgYield, direction: 'flat', changePct: 0 };
    });
    return { livePrices: lp, liveYields: ly, priceHistory: ph, marketOpen: true, totalOrders: 1247, lastUpdate: ts(), flashing: new Set(), gainers: 0, losers: 0, totalVolume: 0 };
  });

  useEffect(() => {
    const interval = demoMode ? 1000 : 3000;
    const range = demoMode ? 0.15 : 0.08;
    const id = setInterval(() => {
      setData(prev => {
        const np = { ...prev.livePrices };
        const ny = { ...prev.liveYields };
        const nph = { ...prev.priceHistory };
        const flash = new Set<string>();
        let g = 0, l = 0, vol = 0;
        MARKET_PRICE_DATA.forEach(d => {
          const k = `${d.crop}_${d.state}`;
          const factor = 1 + (Math.random() * range * 2 - range);
          const nv = Math.round(d.price * factor);
          const dir = nv > np[k].current ? 'up' : nv < np[k].current ? 'down' : 'flat';
          const ch = ((nv - d.price) / d.price) * 100;
          np[k] = { current: nv, base: d.price, direction: dir as any, changePct: ch };
          if (dir !== 'flat') flash.add(k);
          if (dir === 'up') g++; else if (dir === 'down') l++;
          vol += nv * d.prod;
        });
        MARKET_CROPS.forEach(c => {
          const avg = MARKET_PRICE_DATA.filter(d=>d.crop===c).reduce((s,d)=>s+np[`${d.crop}_${d.state}`].current,0) / MARKET_PRICE_DATA.filter(d=>d.crop===c).length;
          const hist = [...(nph[c] || []), avg].slice(-20);
          nph[c] = hist;
        });
        Object.entries(CROP_YIELD_DATA).forEach(([c, v]) => {
          const factor = 1 + (Math.random() * 0.06 - 0.03);
          const nv = Math.round(v.avgYield * factor);
          const dir = nv > ny[c].current ? 'up' : nv < ny[c].current ? 'down' : 'flat';
          ny[c] = { current: nv, base: v.avgYield, direction: dir as any, changePct: ((nv - v.avgYield) / v.avgYield) * 100 };
        });
        return { livePrices: np, liveYields: ny, priceHistory: nph, marketOpen: true, totalOrders: prev.totalOrders + Math.floor(Math.random() * 12 + 1), lastUpdate: ts(), flashing: flash, gainers: g, losers: l, totalVolume: vol / 1e7 };
      });
    }, interval);
    return () => clearInterval(id);
  }, [demoMode]);
  return data;
}

// ═══════════════════════════════════════════════════════════
// OLLAMA HELPERS
// ═══════════════════════════════════════════════════════════
async function callOllamaText(model: string, prompt: string, temperature = 0.3): Promise<string> {
  try {
    const r = await fetch('http://localhost:11434/api/generate', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ model, prompt, stream: false, options: { temperature, num_predict: 500 } })
    });
    const d = await r.json();
    return d.response || 'No response from model.';
  } catch { return 'AI model offline — Ollama not running. Please start Ollama to enable AI features.'; }
}

async function analyzeSoilWithGemmaVision(imageFile: File) {
  try {
    const base64: string = await new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res((e.target!.result as string).split(',')[1]);
      reader.readAsDataURL(imageFile);
    });
    const r = await fetch('http://localhost:11434/api/generate', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        model: 'gemma3:4b',
        prompt: `You are analyzing an Indian Soil Health Card document. Extract the following soil parameters from this image. Return ONLY a valid JSON object with EXACTLY these keys, using null for missing values: {"nitrogen_ppm": number_or_null, "phosphorus_ppm": number_or_null, "potassium_ppm": number_or_null, "ph_value": number_or_null, "organic_carbon_pct": number_or_null, "district": "string_or_null", "crop_season": "string_or_null"} Do not include any text before or after the JSON.`,
        images: [base64], stream: false, options: { temperature: 0.1, num_predict: 200 }
      })
    });
    const d = await r.json();
    const text = d.response;
    try { return { success: true, data: JSON.parse(text.trim()) }; } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) return { success: true, data: JSON.parse(m[0]) };
      return { success: false, error: 'Could not parse soil data' };
    }
  } catch { return { success: false, error: 'Ollama not available — use Manual Entry' }; }
}

// ═══════════════════════════════════════════════════════════
// CROP SCORING ENGINE
// ═══════════════════════════════════════════════════════════
interface SoilProfile { N: number; P: number; K: number; pH: number; OC: number; }
interface CropScore { crop: string; score: number; grade: string; yieldEstimate: number; revenueEstimate: number; fertilizerGap: { N_deficit: number; P_deficit: number; K_deficit: number; cost_INR: number }; radarData: { subject: string; value: number }[]; }

function scoreCropForSoil(cropName: string, soil: SoilProfile, liveYields: Record<string, LivePrice>): CropScore {
  const ref = CROP_YIELD_DATA[cropName];
  if (!ref) return { crop: cropName, score: 0, grade: 'Poor', yieldEstimate: 0, revenueEstimate: 0, fertilizerGap: { N_deficit: 0, P_deficit: 0, K_deficit: 0, cost_INR: 0 }, radarData: [] };
  const nScore = Math.max(0, 30 - Math.abs(soil.N - ref.avgN) / ref.avgN * 30);
  const pScore = Math.max(0, 20 - Math.abs(soil.P - ref.avgP) / ref.avgP * 20);
  const kScore = Math.max(0, 20 - Math.abs(soil.K - ref.avgK) / ref.avgK * 20);
  const phScore = Math.abs(soil.pH - ref.avgPH) <= 1 ? 15 : Math.max(0, 15 - Math.abs(soil.pH - ref.avgPH) * 5);
  const rainScore = 15;
  const total = Math.round(nScore + pScore + kScore + phScore + rainScore);
  const grade = total >= 80 ? 'Excellent' : total >= 60 ? 'Good' : total >= 40 ? 'Fair' : 'Poor';
  const yEst = liveYields[cropName]?.current || ref.avgYield;
  const mkt = MARKET_PRICE_DATA.find(d => d.crop.toUpperCase() === cropName.toUpperCase());
  const rev = mkt ? yEst * (mkt.price / 100) : yEst * 20;
  const nDef = Math.max(0, ref.avgN - soil.N);
  const pDef = Math.max(0, ref.avgP - soil.P);
  const kDef = Math.max(0, ref.avgK - soil.K);
  const fertCost = Math.round(nDef * 5.4 / 0.46 + pDef * 27 / 0.46 + kDef * 17 / 0.6);
  const radarData = [
    { subject: 'Nitrogen', value: Math.round(nScore / 30 * 100) },
    { subject: 'Phosphorus', value: Math.round(pScore / 20 * 100) },
    { subject: 'Potassium', value: Math.round(kScore / 20 * 100) },
    { subject: 'pH Match', value: Math.round(phScore / 15 * 100) },
    { subject: 'Rainfall', value: Math.round(rainScore / 15 * 100) },
  ];
  return { crop: cropName, score: total, grade, yieldEstimate: yEst, revenueEstimate: rev, fertilizerGap: { N_deficit: nDef, P_deficit: pDef, K_deficit: kDef, cost_INR: fertCost }, radarData };
}

function rankAllCrops(soil: SoilProfile, liveYields: Record<string, LivePrice>): CropScore[] {
  return Object.keys(CROP_YIELD_DATA).map(c => scoreCropForSoil(c, soil, liveYields)).sort((a, b) => b.score - a.score).slice(0, 5);
}

// ═══════════════════════════════════════════════════════════
// SVG WATERMARK
// ═══════════════════════════════════════════════════════════
const WheatWatermark = ({ dark = false }: { dark?: boolean }) => (
  <svg viewBox="0 0 24 24" width="72" height="72" style={{ position: 'absolute', bottom: 12, right: 12, opacity: dark ? 0.08 : 0.06, color: dark ? THEME.creamWhite : THEME.darkForest, pointerEvents: 'none', zIndex: 0 }}>
    <path d="M12 2L12 22M12 6C12 6 16 4 18 7C18 7 14 8 12 6ZM12 10C12 10 16 8 18 11C18 11 14 12 12 10ZM12 6C12 6 8 4 6 7C6 7 10 8 12 6ZM12 10C12 10 8 8 6 11C6 11 10 12 12 10Z" fill="currentColor" stroke="none"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════
// CARD COMPONENTS
// ═══════════════════════════════════════════════════════════
const LightCard = ({ children, style, className = '' }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
  <div className={className} style={{ background: THEME.creamWhite, border: `1px solid ${THEME.deepSandal}`, borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 8px rgba(27,67,50,0.08)', position: 'relative', overflow: 'hidden', transition: 'all 0.2s ease', ...style }}>
    {children}<WheatWatermark />
  </div>
);

const DarkCard = ({ children, style, className = '' }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
  <div className={className} style={{ background: THEME.darkForest, border: `1px solid ${THEME.emeraldDark}`, borderRadius: 16, padding: '20px 24px', boxShadow: '0 4px 16px rgba(11,28,21,0.20)', position: 'relative', overflow: 'hidden', transition: 'all 0.2s ease', ...style }}>
    {children}<WheatWatermark dark />
  </div>
);

const AccentCard = ({ children, style, className = '' }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
  <div className={className} style={{ background: `linear-gradient(135deg, ${THEME.emeraldDark} 0%, ${THEME.darkForest} 100%)`, border: 'none', borderRadius: 20, padding: '24px 28px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s ease', ...style }}>
    {children}<WheatWatermark dark />
  </div>
);

const SandalCard = ({ children, style, className = '' }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
  <div className={className} style={{ background: THEME.warmSandal, border: `1px solid ${THEME.earthSandal}`, borderRadius: 14, padding: '16px 20px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s ease', ...style }}>
    {children}<WheatWatermark />
  </div>
);

const ChangeBadge = ({ value, dark = false }: { value: number; dark?: boolean }) => {
  const up = value >= 0;
  if (dark) return <span style={{ background: up ? 'rgba(39,174,96,0.2)' : 'rgba(231,76,60,0.2)', color: up ? THEME.liveGreen : THEME.liveRed, borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{pct(value)} {up ? '▲' : '▼'}</span>;
  return <span style={{ background: up ? '#D4EDDA' : '#F8D7DA', color: up ? '#155724' : '#721C24', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{pct(value)} {up ? '▲' : '▼'}</span>;
};

// ═══════════════════════════════════════════════════════════
// VIEW 1 — LIVE MARKET DASHBOARD
// ═══════════════════════════════════════════════════════════
function LiveMarketView() {
  const sim = useContext(SimCtx);
  const [selectedCrop, setSelectedCrop] = useState(MARKET_CROPS[0]);

  const chartData = useMemo(() => {
    const hist = sim.priceHistory[selectedCrop] || [];
    return hist.map((v, i) => ({ time: `T-${hist.length - i}`, price: Math.round(v) }));
  }, [sim.priceHistory, selectedCrop]);

  const stateData = useMemo(() => {
    return MARKET_PRICE_DATA.filter(d => d.crop === selectedCrop).map(d => {
      const k = `${d.crop}_${d.state}`;
      return { state: d.state.substring(0, 10), price: sim.livePrices[k]?.current || d.price, dir: sim.livePrices[k]?.direction || 'flat' };
    });
  }, [sim.livePrices, selectedCrop]);

  const bestYield = useMemo(() => {
    let best = { crop: '', yield: 0 };
    Object.entries(sim.liveYields).forEach(([c, v]) => { if (v.current > best.yield) best = { crop: c, yield: v.current }; });
    return best;
  }, [sim.liveYields]);

  const tnIndex = useMemo(() => {
    const tn = MARKET_PRICE_DATA.filter(d => d.state === 'Tamil Nadu');
    if (!tn.length) return { value: 0, change: 0 };
    const avg = tn.reduce((s, d) => s + (sim.livePrices[`${d.crop}_${d.state}`]?.current || d.price), 0) / tn.length;
    const baseAvg = tn.reduce((s, d) => s + d.price, 0) / tn.length;
    return { value: Math.round(avg), change: ((avg - baseAvg) / baseAvg * 100) };
  }, [sim.livePrices]);

  const profitData = useMemo(() => {
    const crops = [...new Set(MARKET_PRICE_DATA.map(d => d.crop))];
    return crops.map(c => {
      const items = MARKET_PRICE_DATA.filter(d => d.crop === c);
      const avgPrice = items.reduce((s, d) => s + (sim.livePrices[`${d.crop}_${d.state}`]?.current || d.price), 0) / items.length;
      const avgCost = items.reduce((s, d) => s + d.cost, 0) / items.length;
      return { crop: c, margin: Math.round(((avgPrice - avgCost) / avgCost) * 100) };
    }).sort((a, b) => b.margin - a.margin);
  }, [sim.livePrices]);

  const feedRef = useRef<HTMLDivElement>(null);
  const [feedEntries, setFeedEntries] = useState<{time:string;crop:string;state:string;from:number;to:number;dir:string}[]>([]);
  useEffect(() => {
    const keys = Object.keys(sim.livePrices);
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    const p = sim.livePrices[randKey];
    if (p && p.direction !== 'flat') {
      const [crop, ...rest] = randKey.split('_');
      setFeedEntries(prev => [{ time: sim.lastUpdate, crop, state: rest.join(' '), from: p.base, to: p.current, dir: p.direction }, ...prev].slice(0, 12));
    }
  }, [sim.lastUpdate]);

  const scatterData = useMemo(() =>
    Object.entries(CROP_YIELD_DATA).map(([c, v]) => ({
      name: c, rain: v.avgRain, yield: sim.liveYields[c]?.current || v.avgYield
    }))
  , [sim.liveYields]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <AccentCard>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ color: THEME.warmSandal, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Market Volume</div>
            <div style={{ color: THEME.creamWhite, fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>₹{(sim.totalVolume).toFixed(0)} Cr</div>
            <div style={{ marginTop: 8 }}><ChangeBadge value={3.2} dark /></div>
            <div style={{ height: 40, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData.slice(-10)}><Line type="monotone" dataKey="price" stroke={THEME.deepSandal} strokeWidth={2} dot={false} isAnimationActive animationDuration={400}/></LineChart></ResponsiveContainer>
            </div>
          </div>
        </AccentCard>
        <LightCard>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: THEME.mossDark, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Best Yield Crop</span>
              <div style={{ background: THEME.lightSandal, borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Leaf size={16} color={THEME.darkForest}/></div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{bestYield.crop}</div>
            <div style={{ fontSize: 14, color: THEME.mossDark }}>{fmt(bestYield.yield)} kg/ha</div>
          </div>
        </LightCard>
        <LightCard>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: THEME.mossDark, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tamil Nadu Index</span>
              <div style={{ background: THEME.lightSandal, borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={16} color={THEME.darkForest}/></div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{fmtINR(tnIndex.value)}</div>
            <ChangeBadge value={tnIndex.change} />
          </div>
        </LightCard>
        <LightCard>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: THEME.mossDark, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Market Sentiment</span>
              <div style={{ background: THEME.lightSandal, borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={16} color={THEME.darkForest}/></div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: sim.gainers > sim.losers ? THEME.success : THEME.danger, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{sim.gainers > sim.losers ? '🐂 Bullish' : '🐻 Bearish'}</div>
            <div style={{ fontSize: 12, color: THEME.mossDark, marginTop: 4 }}>▲ {sim.gainers} | ▼ {sim.losers}</div>
          </div>
        </LightCard>
      </div>

      {/* Row 2: Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <DarkCard>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: THEME.creamWhite, fontSize: 16, fontWeight: 600 }}>Live Price Movement</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {MARKET_CROPS.map(c => (
                  <button key={c} onClick={() => setSelectedCrop(c)} style={{ background: c === selectedCrop ? THEME.darkForest : THEME.warmSandal, color: c === selectedCrop ? THEME.creamWhite : THEME.jingleGreen, border: `1px solid ${c === selectedCrop ? THEME.darkForest : THEME.deepSandal}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid stroke={THEME.emeraldDark} strokeDasharray="3 3" strokeOpacity={0.4}/>
                  <XAxis dataKey="time" tick={{fill:THEME.mossDark,fontSize:11}} stroke={THEME.emeraldDark}/>
                  <YAxis tick={{fill:THEME.mossDark,fontSize:11}} stroke="transparent"/>
                  <Tooltip contentStyle={{background:THEME.nearBlack,border:`1px solid ${THEME.emeraldDark}`,borderRadius:10,color:THEME.creamWhite,fontSize:13}} labelStyle={{color:THEME.warmSandal,fontWeight:600}}/>
                  <Area type="monotone" dataKey="price" fill="rgba(221,184,146,0.15)" stroke="transparent" isAnimationActive animationDuration={400}/>
                  <Line type="monotone" dataKey="price" stroke={THEME.deepSandal} strokeWidth={2} dot={false} isAnimationActive animationDuration={400}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DarkCard>
        <LightCard>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 600 }}>State-wise Prices</span>
            <div style={{ height: 280, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateData} layout="vertical">
                  <CartesianGrid stroke={THEME.deepSandal} strokeDasharray="3 3" strokeOpacity={0.5}/>
                  <XAxis type="number" tick={{fill:THEME.mossDark,fontSize:11}}/>
                  <YAxis dataKey="state" type="category" tick={{fill:THEME.mossDark,fontSize:10}} width={80}/>
                  <Tooltip contentStyle={{background:THEME.creamWhite,border:`1px solid ${THEME.deepSandal}`,borderRadius:10,color:THEME.jingleGreen,fontSize:13}}/>
                  <Bar dataKey="price" fill={THEME.darkForest} radius={[0,4,4,0]} isAnimationActive animationDuration={400}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </LightCard>
      </div>

      {/* Row 3: Three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <DarkCard>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ color: THEME.creamWhite, fontSize: 16, fontWeight: 600 }}>Yield vs Rainfall</span>
            <div style={{ height: 220, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid stroke={THEME.emeraldDark} strokeDasharray="3 3" strokeOpacity={0.4}/>
                  <XAxis dataKey="rain" name="Rainfall" tick={{fill:THEME.mossDark,fontSize:10}} stroke={THEME.emeraldDark}/>
                  <YAxis dataKey="yield" name="Yield" tick={{fill:THEME.mossDark,fontSize:10}} stroke="transparent"/>
                  <Tooltip contentStyle={{background:THEME.nearBlack,border:`1px solid ${THEME.emeraldDark}`,borderRadius:10,color:THEME.creamWhite,fontSize:12}}/>
                  <Scatter data={scatterData} fill={THEME.deepSandal} isAnimationActive animationDuration={400}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DarkCard>
        <LightCard>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 600 }}>Profitability Index</span>
            <div style={{ height: 220, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitData}>
                  <CartesianGrid stroke={THEME.deepSandal} strokeDasharray="3 3" strokeOpacity={0.5}/>
                  <XAxis dataKey="crop" tick={{fill:THEME.mossDark,fontSize:9}} angle={-30} textAnchor="end" height={50}/>
                  <YAxis tick={{fill:THEME.mossDark,fontSize:10}}/>
                  <Tooltip contentStyle={{background:THEME.creamWhite,border:`1px solid ${THEME.deepSandal}`,borderRadius:10,color:THEME.jingleGreen,fontSize:12}}/>
                  <Bar dataKey="margin" fill={THEME.darkForest} radius={[4,4,0,0]} isAnimationActive animationDuration={400}>
                    {profitData.map((e, i) => <Cell key={i} fill={e.margin > 80 ? THEME.emeraldDark : THEME.darkForest}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </LightCard>
        <div style={{ background: THEME.nearBlack, border: `1px solid ${THEME.emeraldDark}`, borderRadius: 16, padding: '16px 20px', fontFamily: "'Courier New', monospace", overflow: 'hidden', position: 'relative' }}>
          <div style={{ color: THEME.liveGreen, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>● LIVE MARKET FEED</div>
          <div ref={feedRef} style={{ height: 200, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {feedEntries.map((e, i) => (
              <div key={i} style={{ fontSize: 11, animation: 'slide-up 0.3s ease', color: THEME.warmSandal }}>
                <span style={{ color: THEME.emeraldDark }}>[{e.time}]</span> {e.crop}/{e.state.substring(0, 8)} {fmtINR(e.from)} <span style={{ color: e.dir === 'up' ? THEME.liveGreen : THEME.liveRed }}>{e.dir === 'up' ? '▲' : '▼'}</span> <span style={{ color: e.dir === 'up' ? THEME.liveGreen : THEME.liveRed }}>{fmtINR(e.to)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// VIEW 2 — FARMER INTELLIGENCE
// ═══════════════════════════════════════════════════════════
function FarmerIntelView() {
  const sim = useContext(SimCtx);
  const [soil, setSoil] = useState<SoilProfile>({ N: 60, P: 40, K: 35, pH: 6.5, OC: 1.2 });
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showManual, setShowManual] = useState(true);
  const [advisory, setAdvisory] = useState('');
  const [loadingAdvisory, setLoadingAdvisory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const topCrops = useMemo(() => rankAllCrops(soil, sim.liveYields), [soil, sim.liveYields]);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true); setScanStep(0); setShowManual(false);
    const steps = [0, 1, 2, 3];
    for (const s of steps) {
      setScanStep(s);
      await new Promise(r => setTimeout(r, 800));
    }
    const result = await analyzeSoilWithGemmaVision(file);
    if (result.success && result.data) {
      const d = result.data;
      setSoil({ N: d.nitrogen_ppm ?? soil.N, P: d.phosphorus_ppm ?? soil.P, K: d.potassium_ppm ?? soil.K, pH: d.ph_value ?? soil.pH, OC: d.organic_carbon_pct ?? soil.OC });
    } else { setShowManual(true); }
    setScanning(false);
  };

  const getAdvisory = async () => {
    setLoadingAdvisory(true);
    const prompt = `You are an expert agricultural advisor for Tamil Nadu farmers. Given soil profile: Nitrogen=${soil.N}kg/ha, Phosphorus=${soil.P}kg/ha, Potassium=${soil.K}kg/ha, pH=${soil.pH}. The top recommended crop is ${topCrops[0]?.crop} with score ${topCrops[0]?.score}/100 and estimated yield ${topCrops[0]?.yieldEstimate}kg/ha. Write a 3-paragraph advisory in English: Paragraph 1 - Why this crop suits the soil. Paragraph 2 - Sowing timing based on current market trends. Paragraph 3 - Key fertilizer and water management actions.`;
    const text = await callOllamaText('gemma3:4b', prompt, 0.4);
    setAdvisory(text);
    setLoadingAdvisory(false);
  };

  const soilParams = [
    { label: 'Nitrogen (N)', key: 'N' as const, max: 140, unit: 'kg/ha', status: soil.N > 60 ? 'Adequate' : 'Low' },
    { label: 'Phosphorus (P)', key: 'P' as const, max: 145, unit: 'kg/ha', status: soil.P > 40 ? 'Good' : 'Low — needs DAP' },
    { label: 'Potassium (K)', key: 'K' as const, max: 205, unit: 'kg/ha', status: soil.K > 50 ? 'Good' : 'Moderate' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 20 }}>
      {/* LEFT — Soil Analysis */}
      <LightCard>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ color: THEME.jingleGreen, fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Soil Analysis</h2>
          {scanning ? (
            <div style={{ background: THEME.lightSandal, borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
              <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Gemma3 Vision Analyzing...</div>
              {['Uploading image', 'Running OCR model', 'Extracting N/P/K/pH', 'Computing crop match'].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: i <= scanStep ? THEME.emeraldDark : THEME.warmSandal, transition: 'all 0.3s' }}/>
                  <span style={{ fontSize: 12, color: i <= scanStep ? THEME.jingleGreen : THEME.mossDark }}>{step}</span>
                  {i === scanStep && <RefreshCw size={12} color={THEME.emeraldDark} style={{ animation: 'spin 1s linear infinite' }}/>}
                </div>
              ))}
            </div>
          ) : !showManual ? null : (
            <>
              <div style={{ background: THEME.lightSandal, border: `2px dashed ${THEME.deepSandal}`, borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 16 }}>
                <Wheat size={48} color={THEME.emeraldDark} style={{ marginBottom: 8 }}/>
                <div style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 500 }}>Upload Soil Health Card</div>
                <div style={{ color: THEME.mossDark, fontSize: 13, marginBottom: 16 }}>Photo or PDF accepted</div>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleScan}/>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button onClick={() => fileInputRef.current?.click()} style={{ background: THEME.darkForest, color: THEME.creamWhite, border: 'none', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>📷 Scan with Gemma Vision</button>
                  <button onClick={() => setShowManual(true)} style={{ background: 'transparent', color: THEME.darkForest, border: `1.5px solid ${THEME.darkForest}`, borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>✏️ Manual Entry</button>
                </div>
              </div>
              {/* Manual sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {soilParams.map(p => (
                  <SandalCard key={p.key} style={{ padding: '12px 16px' }}>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: THEME.mossDark, fontSize: 12, width: 90 }}>{p.label}</span>
                      <input type="range" min="0" max={p.max} value={soil[p.key]} onChange={e => setSoil({...soil, [p.key]: +e.target.value})} style={{ flex: 1, accentColor: THEME.darkForest }}/>
                      <span style={{ color: THEME.jingleGreen, fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums', width: 60, textAlign: 'right' }}>{soil[p.key]} {p.unit}</span>
                    </div>
                  </SandalCard>
                ))}
                <SandalCard style={{ padding: '12px 16px' }}>
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: THEME.mossDark, fontSize: 12, width: 90 }}>pH Value</span>
                    <input type="range" min="4" max="9" step="0.1" value={soil.pH} onChange={e => setSoil({...soil, pH: +e.target.value})} style={{ flex: 1, accentColor: THEME.darkForest }}/>
                    <span style={{ color: THEME.jingleGreen, fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums', width: 60, textAlign: 'right' }}>{soil.pH.toFixed(1)}</span>
                  </div>
                </SandalCard>
                <SandalCard style={{ padding: '12px 16px' }}>
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: THEME.mossDark, fontSize: 12, width: 90 }}>Organic Carbon</span>
                    <input type="range" min="0" max="5" step="0.1" value={soil.OC} onChange={e => setSoil({...soil, OC: +e.target.value})} style={{ flex: 1, accentColor: THEME.darkForest }}/>
                    <span style={{ color: THEME.jingleGreen, fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums', width: 60, textAlign: 'right' }}>{soil.OC.toFixed(1)}%</span>
                  </div>
                </SandalCard>
              </div>
              {/* Soil health bars */}
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {soilParams.map(p => (
                  <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: THEME.mossDark, fontSize: 11, width: 70 }}>{p.label}</span>
                    <div style={{ flex: 1, background: THEME.warmSandal, borderRadius: 6, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${(soil[p.key] / p.max) * 100}%`, background: soil[p.key] / p.max > 0.5 ? THEME.darkForest : soil[p.key] / p.max > 0.3 ? THEME.deepSandal : THEME.danger, height: '100%', borderRadius: 6, transition: 'width 0.4s ease' }}/>
                    </div>
                    <span style={{ fontSize: 11, color: THEME.jingleGreen, fontWeight: 600, width: 50, textAlign: 'right' }}>{soil[p.key]}/{p.max}</span>
                    <span style={{ fontSize: 10, color: p.status.includes('Low') ? THEME.danger : THEME.success, fontWeight: 500, width: 80 }}>{p.status}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </LightCard>

      {/* RIGHT — Crop Recommendations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <LightCard>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ color: THEME.jingleGreen, fontSize: 20, fontWeight: 700 }}>Recommended Crops</h2>
              <span style={{ background: THEME.deepSandal, color: THEME.jingleGreen, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Live Revenue Updates</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topCrops.map((crop, i) => {
                const CardC = i === 0 ? AccentCard : SandalCard;
                const isDark = i === 0;
                return (
                  <CardC key={crop.crop} style={{ padding: '14px 18px' }}>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: isDark ? THEME.emeraldDark : THEME.emeraldDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌾</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: isDark ? THEME.creamWhite : THEME.jingleGreen, fontSize: 15, fontWeight: 700 }}>{crop.crop}</div>
                        <div style={{ background: isDark ? 'rgba(221,184,146,0.3)' : THEME.warmSandal, borderRadius: 4, height: 6, overflow: 'hidden', marginTop: 4, width: '70%' }}>
                          <div style={{ width: `${crop.score}%`, background: isDark ? THEME.deepSandal : THEME.emeraldDark, height: '100%', borderRadius: 4, transition: 'width 0.4s' }}/>
                        </div>
                        <span style={{ fontSize: 11, color: isDark ? THEME.warmSandal : THEME.mossDark }}>Score: {crop.score}/100 · {crop.grade}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: isDark ? THEME.creamWhite : THEME.jingleGreen, fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt(crop.yieldEstimate)} kg/ha</div>
                        <div style={{ color: isDark ? THEME.deepSandal : THEME.emeraldDark, fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtINR(crop.revenueEstimate)}/ha</div>
                        <ChangeBadge value={sim.liveYields[crop.crop]?.changePct || 0} dark={isDark}/>
                      </div>
                      <div style={{ width: 80, height: 80 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={crop.radarData}>
                            <PolarGrid stroke={isDark ? THEME.emeraldDark : THEME.deepSandal} strokeOpacity={0.4}/>
                            <PolarAngleAxis dataKey="subject" tick={false}/>
                            <Radar dataKey="value" stroke={THEME.emeraldDark} fill="rgba(45,106,79,0.25)" strokeWidth={2} isAnimationActive animationDuration={400}/>
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardC>
                );
              })}
            </div>
          </div>
        </LightCard>

        {/* Fertilizer Gap */}
        {topCrops[0] && (
          <LightCard>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ color: THEME.darkForest, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Fertilizer Gap Summary</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr style={{ color: THEME.mossDark, fontSize: 11, textTransform: 'uppercase' as const }}>
                  <th style={{ textAlign: 'left', padding: 6 }}>Fertilizer</th><th style={{ textAlign: 'right', padding: 6 }}>Amount</th><th style={{ textAlign: 'right', padding: 6 }}>Cost</th>
                </tr></thead>
                <tbody>
                  {[
                    { name: 'Urea (N)', amount: `${Math.round(topCrops[0].fertilizerGap.N_deficit / 0.46)} kg`, cost: Math.round(topCrops[0].fertilizerGap.N_deficit * 5.4 / 0.46) },
                    { name: 'DAP (P)', amount: `${Math.round(topCrops[0].fertilizerGap.P_deficit / 0.46)} kg`, cost: Math.round(topCrops[0].fertilizerGap.P_deficit * 27 / 0.46) },
                    { name: 'MOP (K)', amount: `${Math.round(topCrops[0].fertilizerGap.K_deficit / 0.6)} kg`, cost: Math.round(topCrops[0].fertilizerGap.K_deficit * 17 / 0.6) },
                  ].map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? THEME.creamWhite : THEME.lightSandal }}>
                      <td style={{ padding: 6, color: THEME.jingleGreen }}>{r.name}</td>
                      <td style={{ padding: 6, textAlign: 'right', color: THEME.jingleGreen }}>{r.amount}</td>
                      <td style={{ padding: 6, textAlign: 'right', color: THEME.jingleGreen }}>{fmtINR(r.cost)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: THEME.darkForest, color: THEME.creamWhite, fontWeight: 700 }}>
                    <td style={{ padding: 6 }}>Total</td><td></td>
                    <td style={{ padding: 6, textAlign: 'right' }}>{fmtINR(topCrops[0].fertilizerGap.cost_INR)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </LightCard>
        )}

        <button onClick={getAdvisory} disabled={loadingAdvisory} style={{ background: THEME.darkForest, color: THEME.creamWhite, border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%', transition: 'background 0.2s' }}>
          {loadingAdvisory ? 'Generating Advisory...' : '🌾 Get AI Advisory'}
        </button>

        {advisory && (
          <LightCard style={{ borderLeft: `4px solid ${THEME.emeraldDark}` }}>
            <div style={{ position: 'relative', zIndex: 1, animation: 'slide-up 0.5s ease' }}>
              <div style={{ whiteSpace: 'pre-wrap', color: THEME.jingleGreen, fontSize: 14, lineHeight: 1.8 }}>{advisory}</div>
              <div style={{ color: THEME.mossDark, fontSize: 11, marginTop: 8 }}>Generated by gemma3:4b</div>
            </div>
          </LightCard>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// VIEW 3 — GOVERNMENT DASHBOARD
// ═══════════════════════════════════════════════════════════
function GovDashboardView() {
  const sim = useContext(SimCtx);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [briefing, setBriefing] = useState('');
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  const govStats = useMemo(() => {
    const tonnage = Object.values(sim.liveYields).reduce((s, v) => s + v.current, 0) * 0.8;
    const budget = tonnage * 2.5;
    const warehouse = 65 + Math.random() * 20;
    return { tonnage: Math.round(tonnage), budget: (budget / 10000).toFixed(1), warehouse: warehouse.toFixed(1), pmfby: sim.totalOrders + 3200 };
  }, [sim.liveYields, sim.totalOrders]);

  const districtData = useMemo(() =>
    DISTRICTS_TN.map(d => ({
      district: d.substring(0, 8),
      yield: Math.round(2000 + Math.random() * 3000),
      budget: Math.round(50 + Math.random() * 150),
      utilisation: Math.round(40 + Math.random() * 50),
    }))
  , [sim.lastUpdate]);

  const budgetTrend = useMemo(() =>
    ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => ({
      month: m,
      budget: Math.round(80 + Math.sin(i / 2) * 30 + Math.random() * 10),
      actual: Math.round(70 + Math.sin(i / 2) * 25 + Math.random() * 15),
    }))
  , []);

  const warehouseData = useMemo(() =>
    DISTRICTS_TN.map(d => ({
      name: `WH-${d.substring(0, 4)}`,
      district: d,
      capacity: Math.round(5000 + Math.random() * 10000),
      used: Math.round(40 + Math.random() * 55),
      status: Math.random() > 0.8 ? 'Overflow' : Math.random() > 0.5 ? 'OK' : 'Warning',
    }))
  , []);

  const generateBriefing = async () => {
    setLoadingBriefing(true);
    const prompt = `You are a government procurement officer in Tamil Nadu. Write a 2-paragraph official briefing for district ${selectedDistrict === 'All' ? 'Tamil Nadu state-wide' : selectedDistrict}. Include forecast tonnage of ${govStats.tonnage} MT, budget allocation of ₹${govStats.budget} Cr, warehouse utilization at ${govStats.warehouse}%, and ${govStats.pmfby} PMFBY eligible farmers. Be specific with procurement recommendations for Kharif 2025 season.`;
    const text = await callOllamaText('gemma3:4b', prompt, 0.2);
    setBriefing(text);
    setLoadingBriefing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Filter bar */}
      <div style={{ background: THEME.creamWhite, borderBottom: `1px solid ${THEME.deepSandal}`, padding: '12px 24px', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} style={{ background: THEME.lightSandal, border: `1.5px solid ${THEME.darkForest}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: THEME.jingleGreen }}>
          <option value="All">All Districts</option>
          {DISTRICTS_TN.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select style={{ background: THEME.lightSandal, border: `1.5px solid ${THEME.darkForest}`, borderRadius: 10, padding: '10px 14px', fontSize: 14, color: THEME.jingleGreen }}>
          <option>Kharif 2025</option><option>Rabi 2025-26</option>
        </select>
        <div style={{ flex: 1 }}/>
        <button onClick={generateBriefing} disabled={loadingBriefing} style={{ background: THEME.darkForest, color: THEME.creamWhite, border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {loadingBriefing ? 'Generating...' : 'Generate Briefing'}
        </button>
      </div>

      {/* 4 stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <AccentCard>
          <div style={{ position:'relative',zIndex:1 }}>
            <div style={{ color: THEME.warmSandal, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Forecast Tonnage</div>
            <div style={{ color: THEME.creamWhite, fontSize: 36, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>{fmt(govStats.tonnage)} MT</div>
          </div>
        </AccentCard>
        {[
          { label: 'Budget', value: `₹${govStats.budget} Cr`, icon: <DollarSign size={16}/> },
          { label: 'Warehouse Util.', value: `${govStats.warehouse}%`, icon: <Database size={16}/> },
          { label: 'PMFBY Count', value: fmt(govStats.pmfby), icon: <Users size={16}/> },
        ].map(s => (
          <LightCard key={s.label}>
            <div style={{ position:'relative',zIndex:1 }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <span style={{ color: THEME.mossDark, fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
                <div style={{ background: THEME.lightSandal, borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.darkForest }}>{s.icon}</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: THEME.jingleGreen, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{s.value}</div>
            </div>
          </LightCard>
        ))}
      </div>

      {/* District comparison chart */}
      <LightCard>
        <div style={{ position:'relative',zIndex:1 }}>
          <span style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 600 }}>District Comparison — Tamil Nadu</span>
          <div style={{ height: 280, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <CartesianGrid stroke={THEME.deepSandal} strokeDasharray="3 3" strokeOpacity={0.5}/>
                <XAxis dataKey="district" tick={{fill:THEME.mossDark,fontSize:10}}/>
                <YAxis tick={{fill:THEME.mossDark,fontSize:10}}/>
                <Tooltip contentStyle={{background:THEME.creamWhite,border:`1px solid ${THEME.deepSandal}`,borderRadius:10,color:THEME.jingleGreen,fontSize:13}}/>
                <Legend/>
                <Bar dataKey="yield" name="Yield (MT)" fill={THEME.darkForest} radius={[4,4,0,0]} isAnimationActive animationDuration={400}/>
                <Bar dataKey="budget" name="Budget (₹Cr)" fill={THEME.deepSandal} radius={[4,4,0,0]} isAnimationActive animationDuration={400}/>
                <Bar dataKey="utilisation" name="Utilisation %" fill={THEME.mossDark} radius={[4,4,0,0]} isAnimationActive animationDuration={400}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </LightCard>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DarkCard>
          <div style={{ position:'relative',zIndex:1 }}>
            <span style={{ color: THEME.creamWhite, fontSize: 16, fontWeight: 600 }}>Budget Trend (12M)</span>
            <div style={{ height: 240, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={budgetTrend}>
                  <CartesianGrid stroke={THEME.emeraldDark} strokeDasharray="3 3" strokeOpacity={0.4}/>
                  <XAxis dataKey="month" tick={{fill:THEME.mossDark,fontSize:11}} stroke={THEME.emeraldDark}/>
                  <YAxis tick={{fill:THEME.mossDark,fontSize:11}} stroke="transparent"/>
                  <Tooltip contentStyle={{background:THEME.nearBlack,border:`1px solid ${THEME.emeraldDark}`,borderRadius:10,color:THEME.creamWhite,fontSize:13}}/>
                  <Area type="monotone" dataKey="budget" fill="rgba(221,184,146,0.1)" stroke="transparent" isAnimationActive animationDuration={400}/>
                  <Line type="monotone" dataKey="budget" stroke={THEME.deepSandal} strokeWidth={2} dot={false} name="Budget" isAnimationActive animationDuration={400}/>
                  <Line type="monotone" dataKey="actual" stroke={THEME.liveGreen} strokeWidth={2} dot={false} name="Actual" isAnimationActive animationDuration={400}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DarkCard>
        <LightCard>
          <div style={{ position:'relative',zIndex:1 }}>
            <span style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 600 }}>Warehouse Status</span>
            <div style={{ marginTop: 8, maxHeight: 260, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead><tr style={{ color: THEME.mossDark, fontSize: 10, textTransform: 'uppercase' as const }}>
                  <th style={{textAlign:'left',padding:4}}>Name</th><th style={{textAlign:'left',padding:4}}>District</th><th style={{textAlign:'right',padding:4}}>Cap.</th><th style={{padding:4}}>Used%</th><th style={{padding:4}}>Status</th>
                </tr></thead>
                <tbody>
                  {warehouseData.map((w, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? THEME.creamWhite : THEME.lightSandal }}>
                      <td style={{ padding: 4, color: THEME.jingleGreen }}>{w.name}</td>
                      <td style={{ padding: 4, color: THEME.mossDark }}>{w.district.substring(0,8)}</td>
                      <td style={{ padding: 4, textAlign: 'right', color: THEME.jingleGreen }}>{fmt(w.capacity)}</td>
                      <td style={{ padding: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ flex: 1, background: THEME.warmSandal, borderRadius: 4, height: 6, overflow: 'hidden' }}>
                            <div style={{ width: `${w.used}%`, background: w.used > 85 ? THEME.danger : THEME.darkForest, height: '100%', borderRadius: 4, transition: 'width 0.3s' }}/>
                          </div>
                          <span style={{ fontSize: 10, color: THEME.jingleGreen, width: 30 }}>{w.used}%</span>
                        </div>
                      </td>
                      <td style={{ padding: 4, textAlign: 'center' }}>
                        <span style={{ background: w.status === 'OK' ? '#D4EDDA' : w.status === 'Warning' ? '#FFF3CD' : '#F8D7DA', color: w.status === 'OK' ? '#155724' : w.status === 'Warning' ? '#856404' : '#721C24', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>{w.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </LightCard>
      </div>

      {/* AI Briefing */}
      {briefing && (
        <LightCard style={{ borderLeft: `4px solid ${THEME.deepSandal}` }}>
          <div style={{ position:'relative',zIndex:1 }}>
            <div style={{ background: THEME.darkForest, margin: '-20px -24px 16px -24px', padding: '12px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: THEME.creamWhite, fontSize: 16, fontWeight: 600 }}>AI District Briefing</span>
              <span style={{ background: THEME.emeraldDark, color: THEME.warmSandal, padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>gemma3:4b</span>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', color: THEME.jingleGreen, fontSize: 16, lineHeight: 1.8, animation: 'slide-up 0.5s ease' }}>{briefing}</div>
          </div>
        </LightCard>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// VIEW 4 — DATA EXPLORER
// ═══════════════════════════════════════════════════════════
function DataExplorerView() {
  const sim = useContext(SimCtx);
  const [impactFarmers, setImpactFarmers] = useState(47234);
  const [impactWaste, setImpactWaste] = useState(2.3);

  useEffect(() => {
    const id = setInterval(() => {
      setImpactFarmers(p => p + Math.floor(Math.random() * 3));
      setImpactWaste(p => +(p + 0.001).toFixed(3));
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const yieldDistribution = useMemo(() =>
    Object.entries(sim.liveYields).map(([c, v]) => ({ crop: c, yield: v.current })).sort((a, b) => b.yield - a.yield)
  , [sim.liveYields]);

  const npkScatter = useMemo(() =>
    Object.entries(CROP_YIELD_DATA).map(([c, v]) => ({
      name: c, nitrogen: v.avgN, yield: sim.liveYields[c]?.current || v.avgYield, potassium: v.avgK
    }))
  , [sim.liveYields]);

  const priceScatter = useMemo(() =>
    MARKET_PRICE_DATA.map(d => ({
      name: `${d.crop}/${d.state.substring(0, 4)}`,
      production: d.prod,
      price: sim.livePrices[`${d.crop}_${d.state}`]?.current || d.price,
      cost: d.cost
    }))
  , [sim.livePrices]);

  const [feedEntries, setFeedEntries] = useState<{time:string;commodity:string;state:string;from:number;to:number;pct:number;dir:string}[]>([]);
  useEffect(() => {
    const keys = Object.keys(sim.livePrices);
    const picks = Array.from({length:2}, () => keys[Math.floor(Math.random() * keys.length)]);
    const newEntries = picks.map(k => {
      const p = sim.livePrices[k];
      const [crop, ...rest] = k.split('_');
      return { time: sim.lastUpdate, commodity: crop, state: rest.join(' '), from: p.base, to: p.current, pct: p.changePct, dir: p.direction };
    }).filter(e => e.dir !== 'flat');
    if (newEntries.length) setFeedEntries(prev => [...newEntries, ...prev].slice(0, 12));
  }, [sim.lastUpdate]);

  const cropCategories: Record<string, string> = { Rice: THEME.darkForest, Maize: THEME.darkForest, Wheat: THEME.darkForest, Cotton: THEME.darkForest, Jute: THEME.darkForest, Banana: THEME.deepSandal, Mango: THEME.deepSandal, Orange: THEME.deepSandal, Apple: THEME.deepSandal, Grapes: THEME.deepSandal, Papaya: THEME.deepSandal, Watermelon: THEME.emeraldDark, Muskmelon: THEME.emeraldDark, Pomegranate: THEME.emeraldDark, Coconut: THEME.emeraldDark, Lentil: THEME.mossDark, MungBean: THEME.mossDark, Blackgram: THEME.mossDark, ChickPea: THEME.mossDark, KidneyBeans: THEME.mossDark, MothBeans: THEME.mossDark, PigeonPeas: THEME.mossDark, Coffee: THEME.earthSandal };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Impact counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Data Points Processed', value: '2,200+' },
          { label: 'Live Updates/Min', value: `${Math.floor(8 + Math.random() * 7)}` },
          { label: 'Farmers Served', value: fmt(impactFarmers) },
          { label: 'Waste Prevented', value: `₹${impactWaste.toFixed(1)} Cr` },
        ].map(s => (
          <AccentCard key={s.label}>
            <div style={{ position:'relative',zIndex:1,textAlign:'center' }}>
              <div style={{ color: THEME.warmSandal, fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              <div style={{ color: THEME.creamWhite, fontSize: 32, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{s.value}</div>
            </div>
          </AccentCard>
        ))}
      </div>

      {/* Crop yield distribution */}
      <LightCard>
        <div style={{ position:'relative',zIndex:1 }}>
          <span style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 600 }}>Crop Yield Distribution (22 Crops)</span>
          <div style={{ height: 280, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldDistribution}>
                <CartesianGrid stroke={THEME.deepSandal} strokeDasharray="3 3" strokeOpacity={0.5}/>
                <XAxis dataKey="crop" tick={{fill:THEME.mossDark,fontSize:8}} angle={-45} textAnchor="end" height={70}/>
                <YAxis tick={{fill:THEME.mossDark,fontSize:10}}/>
                <Tooltip contentStyle={{background:THEME.creamWhite,border:`1px solid ${THEME.deepSandal}`,borderRadius:10,color:THEME.jingleGreen,fontSize:13}}/>
                <Bar dataKey="yield" radius={[4,4,0,0]} isAnimationActive animationDuration={400}>
                  {yieldDistribution.map((e, i) => <Cell key={i} fill={cropCategories[e.crop] || THEME.darkForest}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </LightCard>

      {/* Two charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DarkCard>
          <div style={{ position:'relative',zIndex:1 }}>
            <span style={{ color: THEME.creamWhite, fontSize: 16, fontWeight: 600 }}>N-P-K Correlation Scatter</span>
            <div style={{ height: 250, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid stroke={THEME.emeraldDark} strokeDasharray="3 3" strokeOpacity={0.4}/>
                  <XAxis dataKey="nitrogen" name="Nitrogen" tick={{fill:THEME.mossDark,fontSize:10}} stroke={THEME.emeraldDark}/>
                  <YAxis dataKey="yield" name="Yield" tick={{fill:THEME.mossDark,fontSize:10}} stroke="transparent"/>
                  <Tooltip contentStyle={{background:THEME.nearBlack,border:`1px solid ${THEME.emeraldDark}`,borderRadius:10,color:THEME.creamWhite,fontSize:12}} cursor={{strokeDasharray:'3 3'}}/>
                  <Scatter data={npkScatter} fill={THEME.deepSandal} isAnimationActive animationDuration={400}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DarkCard>
        <LightCard>
          <div style={{ position:'relative',zIndex:1 }}>
            <span style={{ color: THEME.jingleGreen, fontSize: 16, fontWeight: 600 }}>Price vs Production</span>
            <div style={{ height: 250, marginTop: 8 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid stroke={THEME.deepSandal} strokeDasharray="3 3" strokeOpacity={0.5}/>
                  <XAxis dataKey="production" name="Production" tick={{fill:THEME.mossDark,fontSize:10}}/>
                  <YAxis dataKey="price" name="Price ₹" tick={{fill:THEME.mossDark,fontSize:10}}/>
                  <Tooltip contentStyle={{background:THEME.creamWhite,border:`1px solid ${THEME.deepSandal}`,borderRadius:10,color:THEME.jingleGreen,fontSize:12}}/>
                  <Scatter data={priceScatter} fill={THEME.darkForest} isAnimationActive animationDuration={400}/>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </LightCard>
      </div>

      {/* Market Terminal */}
      <div style={{ background: THEME.nearBlack, border: `1px solid ${THEME.emeraldDark}`, borderRadius: 16, padding: 20, fontFamily: "'Courier New', monospace" }}>
        <div style={{ color: THEME.liveGreen, fontSize: 14, fontWeight: 700, marginBottom: 12 }}>● LIVE MARKET FEED <span style={{ animation: 'pulse-live 1.8s infinite', display: 'inline-block' }}>█</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 260, overflow: 'hidden' }}>
          {feedEntries.map((e, i) => (
            <div key={i} style={{ fontSize: 12, animation: 'slide-up 0.3s ease', display: 'flex', gap: 8 }}>
              <span style={{ color: THEME.emeraldDark }}>[{e.time}]</span>
              <span style={{ color: THEME.warmSandal, minWidth: 140 }}>{e.commodity}/{e.state.substring(0, 10)}</span>
              <span style={{ color: THEME.mossDark }}>{fmtINR(e.from)}</span>
              <span style={{ color: e.dir === 'up' ? THEME.liveGreen : THEME.liveRed }}>{e.dir === 'up' ? '▲' : '▼'}</span>
              <span style={{ color: e.dir === 'up' ? THEME.liveGreen : THEME.liveRed, fontWeight: 700 }}>{fmtINR(e.to)} {pct(e.pct)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
const TABS = [
  { key: 'market', label: 'Live Market', icon: <Activity size={16}/> },
  { key: 'farmer', label: 'Farmer Intel', icon: <Leaf size={16}/> },
  { key: 'gov', label: 'Gov Dashboard', icon: <Database size={16}/> },
  { key: 'data', label: 'Data Explorer', icon: <BarChart2 size={16}/> },
];

export default function AgroFinSenseDashboard() {
  const [activeTab, setActiveTab] = useState('market');
  const [demoMode, setDemoMode] = useState(false);
  const simData = useDataSimulator(demoMode);
  const [storyIdx, setStoryIdx] = useState(0);
  const [notification, setNotification] = useState<string|null>(null);
  const [ollamaStatus, setOllamaStatus] = useState<{available:boolean;models:string[]}>({available:false,models:[]});

  // Inject CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-live { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.15)} }
      @keyframes flash-up { 0%,100%{background-color:transparent} 30%{background-color:rgba(39,174,96,0.20)} }
      @keyframes flash-down { 0%,100%{background-color:transparent} 30%{background-color:rgba(231,76,60,0.18)} }
      @keyframes slide-up { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
      @keyframes slide-in-right { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
      @keyframes ticker-scroll { from{transform:translateX(100%)} to{transform:translateX(-200%)} }
      @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      .skeleton { background:linear-gradient(90deg,#EDE0D4 25%,#F5EBE0 50%,#EDE0D4 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:6px; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #EDE0D4; }
      ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #EDE0D4; } ::-webkit-scrollbar-thumb { background: #B08968; border-radius: 3px; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Story rotation
  useEffect(() => {
    const id = setInterval(() => setStoryIdx(p => (p + 1) % STORIES.length), 8000);
    return () => clearInterval(id);
  }, []);

  // Notification toast
  useEffect(() => {
    const id = setInterval(() => {
      setNotification(NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)]);
      setTimeout(() => setNotification(null), 5000);
    }, 15000 + Math.random() * 5000);
    return () => clearInterval(id);
  }, []);

  // Check Ollama
  useEffect(() => {
    fetch('http://localhost:11434/api/tags').then(r => r.json()).then(d => {
      const models = d.models?.map((m: any) => m.name) || [];
      setOllamaStatus({ available: true, models });
    }).catch(() => setOllamaStatus({ available: false, models: [] }));
  }, []);

  // Ticker data
  const tickerItems = useMemo(() => {
    return MARKET_CROPS.map(c => {
      const items = MARKET_PRICE_DATA.filter(d => d.crop === c);
      const avg = items.reduce((s, d) => s + (simData.livePrices[`${d.crop}_${d.state}`]?.current || d.price), 0) / items.length;
      const base = items.reduce((s, d) => s + d.price, 0) / items.length;
      const change = ((avg - base) / base) * 100;
      return { crop: c, price: Math.round(avg), change, dir: change >= 0 ? 'up' : 'down' };
    });
  }, [simData.livePrices]);

  const story = STORIES[storyIdx];

  return (
    <SimCtx.Provider value={{ ...simData, demoMode, setDemoMode }}>
      <div style={{ background: THEME.lightSandal, minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        {/* HEADER */}
        <div style={{ background: THEME.darkForest, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wheat size={24} color={THEME.deepSandal}/>
            <div>
              <div style={{ color: THEME.creamWhite, fontSize: 20, fontWeight: 700 }}>AgroFinSense</div>
              <div style={{ color: THEME.mossDark, fontSize: 11 }}>Growing Your Yield.</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display:'flex',alignItems:'center',gap:4 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background: ollamaStatus.available ? THEME.liveGreen : THEME.deepSandal, animation: ollamaStatus.available ? 'pulse-live 1.8s infinite' : 'none' }}/>
              <span style={{ color: THEME.mossDark, fontSize: 11 }}>AI: {ollamaStatus.available ? 'Online' : 'Offline'}</span>
            </div>
            <div style={{ background: THEME.liveGreen, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700, display:'flex',alignItems:'center',gap:4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'pulse-live 1.8s infinite' }}/>LIVE
            </div>
            <span style={{ color: THEME.mossDark, fontSize: 12 }}>{simData.lastUpdate}</span>
            <Bell size={18} color={THEME.warmSandal} style={{ cursor:'pointer' }}/>
          </div>
        </div>

        {/* PRICE TICKER */}
        <div style={{ background: THEME.jingleGreen, height: 36, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 24, animation: 'ticker-scroll 30s linear infinite', whiteSpace: 'nowrap' }}>
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', color: THEME.warmSandal }}>
                {t.crop} {fmtINR(t.price)} <span style={{ color: t.dir === 'up' ? THEME.liveGreen : THEME.liveRed }}>{t.dir === 'up' ? '▲' : '▼'} {pct(t.change)}</span>
                <span style={{ color: THEME.emeraldDark, margin: '0 8px' }}>|</span>
              </span>
            ))}
          </div>
        </div>

        {/* IMPACT STRIP */}
        <div style={{ background: THEME.jingleGreen, height: 40, display: 'flex', alignItems: 'center', gap: 32, padding: '0 24px', borderBottom: `1px solid ${THEME.emeraldDark}` }}>
          {[
            `🌾 ${fmt(47234 + Math.floor(simData.totalOrders / 10))} Farmers Helped`,
            `📦 ₹2.3Cr Waste Prevented`,
            `📈 +18.4% Avg Income`,
            `🏦 ${fmt(simData.totalOrders)} Transactions`,
          ].map((item, i) => (
            <span key={i} style={{ color: THEME.warmSandal, fontSize: 12, fontWeight: 500 }}>{item}</span>
          ))}
          <div style={{ flex: 1 }}/>
          <button onClick={() => setDemoMode(!demoMode)} style={{ background: demoMode ? THEME.warmSandal : THEME.deepSandal, color: THEME.jingleGreen, border: 'none', borderRadius: 8, padding: '4px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
            ⚡ {demoMode ? 'Demo ON' : 'Boost Demo'}
          </button>
        </div>

        {/* NAV TABS */}
        <div style={{ background: THEME.lightSandal, padding: '8px 24px', display: 'flex', gap: 8 }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              background: activeTab === tab.key ? THEME.darkForest : 'transparent',
              color: activeTab === tab.key ? THEME.creamWhite : THEME.mossDark,
              border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div style={{ padding: '20px 24px' }}>
          {activeTab === 'market' && <LiveMarketView />}
          {activeTab === 'farmer' && <FarmerIntelView />}
          {activeTab === 'gov' && <GovDashboardView />}
          {activeTab === 'data' && <DataExplorerView />}
        </div>

        {/* STORY CARD */}
        <div style={{ position: 'fixed', bottom: 80, left: 24, zIndex: 50, maxWidth: 340 }}>
          <SandalCard style={{ boxShadow: '0 4px 16px rgba(27,67,50,0.15)' }}>
            <div style={{ position:'relative',zIndex:1,display:'flex',gap:12,alignItems:'center',transition:'opacity 0.5s' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: THEME.emeraldDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🧑‍🌾</div>
              <div>
                <div style={{ color: THEME.jingleGreen, fontSize: 14, fontWeight: 700 }}>{story.name}, {story.dist}</div>
                <div style={{ color: THEME.darkForest, fontSize: 13, fontStyle: 'italic' }}>{story.text}</div>
                <div style={{ color: THEME.emeraldDark, fontSize: 15, fontWeight: 700, marginTop: 2 }}>{story.gain}</div>
              </div>
            </div>
          </SandalCard>
        </div>

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60, maxWidth: 380, animation: 'slide-in-right 0.4s ease' }}>
            <LightCard style={{ boxShadow: '0 8px 24px rgba(27,67,50,0.15)', borderLeft: `4px solid ${THEME.emeraldDark}` }}>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ color: THEME.jingleGreen, fontSize: 13 }}>{notification}</div>
                <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: THEME.mossDark, padding: 0, marginLeft: 8 }}><X size={14}/></button>
              </div>
            </LightCard>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ background: THEME.jingleGreen, padding: '12px 24px', textAlign: 'center', marginTop: 20 }}>
          <div style={{ color: THEME.mossDark, fontSize: 11 }}>Powered by gemma3:4b + llama3.2:3b (Local Ollama) | Dataset: ICAR + Agmarknet Historical</div>
          <div style={{ color: THEME.mossDark, fontSize: 11, marginTop: 2 }}>Real-time simulation: ±{demoMode ? '15' : '8'}% price fluctuation engine active</div>
        </div>
      </div>
    </SimCtx.Provider>
  );
}
