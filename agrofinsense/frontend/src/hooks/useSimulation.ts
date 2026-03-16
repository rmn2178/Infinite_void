import { useState, useEffect } from 'react';

const INITIAL_BASE_PRICES: Record<string, number> = {
  Rice: 2300, Wheat: 2275, Maize: 2090, Sugarcane: 315,
  Groundnut: 6377, Cotton: 7020, Banana: 1800, Tomato: 2200
};

const CROPS = Object.keys(INITIAL_BASE_PRICES);
const STATES = ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Maharashtra', 'Punjab', 'Madhya Pradesh'];

export function useSimulation(demoMode: boolean) {
  const [livePrices, setLivePrices] = useState<Record<string, { current: number; base: number; changePct: number; direction: 'up' | 'down' | 'flat' }>>(() => {
    const init: any = {};
    CROPS.forEach(c => STATES.forEach(s => {
      init[`${c}_${s}`] = { current: INITIAL_BASE_PRICES[c], base: INITIAL_BASE_PRICES[c], changePct: 0, direction: 'flat' };
    }));
    return init;
  });

  const [liveYields, setLiveYields] = useState<Record<string, { current: number; base: number; changePct: number }>>(() => {
    const init: any = {};
    CROPS.forEach(c => {
      const base = 2000 + Math.random() * 3000;
      init[c] = { current: base, base, changePct: 0 };
    });
    return init;
  });

  const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>(() => {
    const init: any = {};
    CROPS.forEach(c => STATES.forEach(s => {
      init[`${c}_${s}`] = Array(30).fill(INITIAL_BASE_PRICES[c]);
    }));
    return init;
  });

  const [gainers, setGainers] = useState(0);
  const [losers, setLosers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(1293);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const tickMs = demoMode ? 1000 : 3000;
    const maxFluctuation = demoMode ? 0.15 : 0.02;

    const interval = setInterval(() => {
      setLivePrices(prev => {
        const next: any = {};
        let g = 0, l = 0;
        for (const key in prev) {
          const p = prev[key];
          const fluctuation = (Math.random() * maxFluctuation * 2) - maxFluctuation;
          const newPrice = p.current * (1 + fluctuation);
          const changePct = ((newPrice - p.base) / p.base) * 100;
          const direction = newPrice > p.current ? 'up' : newPrice < p.current ? 'down' : 'flat';
          if (changePct > 0) g++; else if (changePct < 0) l++;
          next[key] = { current: newPrice, base: p.base, changePct, direction };
          
          setPriceHistory(ph => {
            const h = ph[key] || [];
            return { ...ph, [key]: [...h.slice(1), newPrice] };
          });
        }
        setGainers(g);
        setLosers(l);
        return next;
      });
      setLastUpdate(new Date().toLocaleTimeString());
    }, tickMs);

    return () => clearInterval(interval);
  }, [demoMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveYields(prev => {
        const next: any = {};
        for (const key in prev) {
          const fluctuation = (Math.random() * 0.04) - 0.02;
          const ny = prev[key].current * (1 + fluctuation);
          next[key] = { current: ny, base: prev[key].base, changePct: ((ny - prev[key].base) / prev[key].base) * 100 };
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalOrders(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return { livePrices, liveYields, priceHistory, gainers, losers, totalOrders, lastUpdate };
}
