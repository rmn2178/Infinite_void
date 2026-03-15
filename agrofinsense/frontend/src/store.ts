import { create } from 'zustand';

interface OllamaStatus {
    running: boolean;
    gemma_available: boolean;
    llama_available: boolean;
}

interface Farmer {
    farmer_id: number;
    name: string;
    district: string;
    phone: string;
    land_area_ha: number;
    language: string;
    role: string;
}

interface PriceUpdate {
    mandi: string;
    price: number;
    date: string;
    crop: string;
}

interface AppState {
    farmer: Farmer | null;
    token: string | null;
    role: string;
    selectedCrop: string;
    selectedDistrict: string;
    selectedSeason: string;
    livePrices: PriceUpdate[];
    ollamaStatus: OllamaStatus;

    setFarmer: (farmer: Farmer | null) => void;
    setToken: (token: string | null) => void;
    setRole: (role: string) => void;
    setSelectedCrop: (crop: string) => void;
    setSelectedDistrict: (district: string) => void;
    setSelectedSeason: (season: string) => void;
    setLivePrices: (prices: PriceUpdate[]) => void;
    addLivePrice: (price: PriceUpdate) => void;
    setOllamaStatus: (status: OllamaStatus) => void;
    logout: () => void;
}

export const useStore = create<AppState>((set) => ({
    farmer: null,
    token: localStorage.getItem('agro_token'),
    role: localStorage.getItem('agro_role') || 'farmer',
    selectedCrop: 'Rice',
    selectedDistrict: 'Erode',
    selectedSeason: 'Kharif 2025',
    livePrices: [],
    ollamaStatus: { running: false, gemma_available: false, llama_available: false },

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
    setSelectedCrop: (crop) => set({ selectedCrop: crop }),
    setSelectedDistrict: (district) => set({ selectedDistrict: district }),
    setSelectedSeason: (season) => set({ selectedSeason: season }),
    setLivePrices: (prices) => set({ livePrices: prices }),
    addLivePrice: (price) =>
        set((state) => ({
            livePrices: [...state.livePrices.slice(-59), price],
        })),
    setOllamaStatus: (status) => set({ ollamaStatus: status }),
    logout: () => {
        localStorage.removeItem('agro_token');
        localStorage.removeItem('agro_role');
        set({ farmer: null, token: null, role: 'farmer' });
    },
}));
