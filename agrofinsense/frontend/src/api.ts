import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 30000,
});

// JWT interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('agro_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Auth ---
export const registerFarmer = (data: {
    phone: string;
    name: string;
    district: string;
    land_area_ha: number;
    language: string;
    role: string;
}) => api.post('/farmer/register', data).then((r) => r.data);

// --- Health ---
export const getHealth = () => api.get('/health').then((r) => r.data);

// --- Farmer ---
export const uploadSoil = (farmerId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api
        .post(`/farmer/soil-upload?farmer_id=${farmerId}`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data);
};

export const getRecommendation = (farmerId: number) =>
    api.get(`/farmer/recommendation/${farmerId}`).then((r) => r.data);

export const getPriceHistory = (crop: string, district: string) =>
    api.get(`/farmer/price-history/${crop}/${district}`).then((r) => r.data);

export const getFarmerSchemes = (farmerId: number) =>
    api.get(`/farmer/schemes/${farmerId}`).then((r) => r.data);

export const getStores = (district: string) =>
    api.get(`/farmer/stores/${district}`).then((r) => r.data);

export const getVoiceAdvisory = (farmerId: number) =>
    api.get(`/farmer/voice/${farmerId}`, { responseType: 'blob' }).then((r) => r.data);

// --- Market ---
export const getLivePrice = (crop: string, district: string) =>
    api.get(`/market/live/${crop}/${district}`).then((r) => r.data);

export const getMarketForecast = (crop: string, district: string) =>
    api.get(`/market/forecast/${crop}/${district}`).then((r) => r.data);

export const getAllCropsPrices = (district: string) =>
    api.get(`/market/all-crops/${district}`).then((r) => r.data);

// --- GovTech ---
export const getDistrictSummary = (district: string, season: string) =>
    api.get(`/govtech/district-summary/${district}/${season}`).then((r) => r.data);

export const getHeatmap = (state: string, season: string) =>
    api.get(`/govtech/heatmap/${state}/${season}`).then((r) => r.data);

export const getWarehouseStatus = (district: string) =>
    api.get(`/govtech/warehouse-status/${district}`).then((r) => r.data);

export const getSchemeStats = (district: string) =>
    api.get(`/govtech/scheme-stats/${district}`).then((r) => r.data);

// --- Scheme ---
export const checkSchemeEligibility = (farmerId: number) =>
    api.post(`/scheme/check/${farmerId}`).then((r) => r.data);

export const listSchemes = () =>
    api.get('/scheme/list').then((r) => r.data);

export default api;
