import { create } from 'zustand';

export interface Farmer {
  farmer_id: number;
  name: string;
  district: string;
  phone: string;
  land_area_ha: number;
  language: string;
  role: string;
}

export interface PriceUpdate {
  mandi: string;
  price: number;
  date: string;
  crop: string;
}

export interface OllamaStatus {
  running: boolean;
  available: boolean;
  gemma_available: boolean;
  llama_available: boolean;
}

interface AppState {
  farmer: Farmer | null;
  token: string | null;
  role: 'farmer' | 'officer';
  selectedCrop: string;
  selectedDistrict: string;
  selectedSeason: string;
  livePrices: PriceUpdate[];
  ollamaStatus: OllamaStatus;

  setFarmer: (farmer: Farmer | null) => void;
  setToken: (token: string | null) => void;
  setRole: (role: 'farmer' | 'officer') => void;
  setSelectedCrop: (crop: string) => void;
  setSelectedDistrict: (district: string) => void;
  setSelectedSeason: (season: string) => void;
  setLivePrices: (prices: PriceUpdate[]) => void;
  addLivePrice: (update: PriceUpdate) => void;
  setOllamaStatus: (status: OllamaStatus) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  farmer: null,
  token: localStorage.getItem('agro_token'),
  role: (localStorage.getItem('agro_role') as 'farmer' | 'officer') || 'farmer',
  selectedCrop: 'Rice',
  selectedDistrict: 'Erode',
  selectedSeason: 'Kharif 2025',
  livePrices: [],
  ollamaStatus: { running: false, available: false, gemma_available: false, llama_available: false },

  setFarmer: (farmer) => set({ farmer }),
  setToken: (token) => {
    if (token) localStorage.setItem('agro_token', token);
    else localStorage.removeItem('agro_token');
    set({ token });
  },
  setRole: (role) => {
    localStorage.setItem('agro_role', role);
    set({ role });
  },
  setSelectedCrop: (selectedCrop) => set({ selectedCrop }),
  setSelectedDistrict: (selectedDistrict) => set({ selectedDistrict }),
  setSelectedSeason: (selectedSeason) => set({ selectedSeason }),
  setLivePrices: (livePrices) => set({ livePrices }),
  addLivePrice: (update) => set((state) => ({ livePrices: [...state.livePrices, update].slice(-60) })),
  setOllamaStatus: (ollamaStatus) => set({ ollamaStatus }),
  logout: () => {
    localStorage.removeItem('agro_token');
    localStorage.removeItem('agro_role');
    set({ farmer: null, token: null, role: 'farmer' });
  },
}));
