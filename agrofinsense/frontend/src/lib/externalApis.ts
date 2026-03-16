export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
}

export async function fetchWeather(lat: number, lon: number) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weathercode,windspeed_10m&daily=precipitation_sum,temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FKolkata&forecast_days=7`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchAirQuality(lat: number, lon: number) {
  try {
    const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,european_aqi&timezone=Asia%2FKolkata`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchAgriNews(crop: string): Promise<NewsItem[]> {
  try {
    const key = (import.meta as any).env.VITE_NEWSDATA_KEY;
    if (!key) return [];
    const res = await fetch(`https://newsdata.io/api/1/news?apikey=${key}&q=${crop}+agriculture+India&country=in&language=en&category=business`);
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

export const DISTRICT_COORDS: Record<string, { lat: number; lon: number }> = {
  Chennai:{lat:13.0827,lon:80.2707}, Coimbatore:{lat:11.0168,lon:76.9558},
  Madurai:{lat:9.9252,lon:78.1198}, Trichy:{lat:10.7905,lon:78.7047},
  Salem:{lat:11.6643,lon:78.1460}, Erode:{lat:11.3410,lon:77.7172},
  Tiruppur:{lat:11.1085,lon:77.3411}, Vellore:{lat:12.9165,lon:79.1325},
  Thanjavur:{lat:10.7870,lon:79.1378}, Tirunelveli:{lat:8.7139,lon:77.7567},
  Kancheepuram:{lat:12.8185,lon:79.6947}, Tiruvallur:{lat:13.1435,lon:79.9088},
  Cuddalore:{lat:11.7480,lon:79.7714}, Nagapattinam:{lat:10.7672,lon:79.8449},
  Tiruvarur:{lat:10.7731,lon:79.6368}, Pudukkottai:{lat:10.3833,lon:78.8001},
  Sivaganga:{lat:9.8432,lon:78.4803}, Virudhunagar:{lat:9.5851,lon:77.9624},
  Ramanathapuram:{lat:9.3762,lon:78.8308}, Thoothukudi:{lat:8.7642,lon:78.1348},
  Krishnagiri:{lat:12.5186,lon:78.2137}, Dharmapuri:{lat:12.1278,lon:78.1577},
  Namakkal:{lat:11.2189,lon:78.1674}, Karur:{lat:10.9601,lon:78.0766},
  Perambalur:{lat:11.2342,lon:78.8808}, Ariyalur:{lat:11.1401,lon:79.0782},
  Villupuram:{lat:11.9401,lon:79.4861}, Tiruvannamalai:{lat:12.2253,lon:79.0747},
  Nilgiris:{lat:11.4916,lon:76.7337}, Dindigul:{lat:10.3624,lon:77.9695},
  Theni:{lat:10.0104,lon:77.4770}, Kanniyakumari:{lat:8.0883,lon:77.5385},
};
