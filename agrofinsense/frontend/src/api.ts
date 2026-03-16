import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agro_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getHealth = () => api.get('/health').then(r => r.data);

export const registerFarmer = (data: any) => api.post('/farmer/register', data).then(r => r.data);
export const loginFarmer = (data: { phone: string }) => api.post('/farmer/login', data).then(r => r.data);
export const uploadSoil = (farmerId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/farmer/soil-upload?farmer_id=${farmerId}`, formData).then(r => r.data);
};

export const getRecommendation = (farmerId: number) => api.get(`/farmer/recommendation/${farmerId}`).then(r => r.data);
export const getPriceHistory = (crop: string, district: string) => api.get(`/farmer/price-history/${crop}/${district}`).then(r => r.data);
export const getFarmerSchemes = (farmerId: number) => api.get(`/farmer/schemes/${farmerId}`).then(r => r.data);
export const getStores = (district: string) => api.get(`/farmer/stores/${district}`).then(r => r.data);
export const getVoiceAdvisory = (farmerId: number) => api.get(`/farmer/voice/${farmerId}`, { responseType: 'blob' }).then(r => r.data);
export const getAlerts = (district: string) => api.get(`/farmer/alerts/${district}`).then(r => r.data);
export const getNdvi = (district: string) => api.get(`/farmer/ndvi/${district}`).then(r => r.data);
export const getEnergy = (district: string) => api.get(`/farmer/energy/${district}`).then(r => r.data);
export const getAqi = (district: string) => api.get(`/farmer/aqi/${district}`).then(r => r.data);

export const getLivePrice = (crop: string, district: string) => api.get(`/market/live/${crop}/${district}`).then(r => r.data);
export const getMarketForecast = (crop: string, district: string) => api.get(`/market/forecast/${crop}/${district}`).then(r => r.data);
export const getAllCropsPrices = (district: string) => api.get(`/market/all-crops/${district}`).then(r => r.data);
export const getNews = (crop: string) => api.get(`/market/news/${crop}`).then(r => r.data);

export const getDistrictSummary = (district: string, season: string) => api.get(`/govtech/district-summary/${district}/${season}`).then(r => r.data);
export const getHeatmap = (state: string, season: string) => api.get(`/govtech/heatmap/${state}/${season}`).then(r => r.data);
export const getWarehouseStatus = (district: string) => api.get(`/govtech/warehouse-status/${district}`).then(r => r.data);
export const getSchemeStats = (district: string) => api.get(`/govtech/scheme-stats/${district}`).then(r => r.data);

export const checkSchemeEligibility = (farmerId: number) => api.post(`/scheme/check/${farmerId}`).then(r => r.data);
export const listSchemes = () => api.get(`/scheme/list`).then(r => r.data);

export default api;
