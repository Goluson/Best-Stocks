import { useEffect, useRef } from 'react';
import type { AssetPrice } from '../types/finance';

type FeedCallback = (updated: AssetPrice) => void;

export function useMarketFeed(assets: AssetPrice[], onUpdate: FeedCallback) {
  const assetsRef = useRef(assets);
  assetsRef.current = assets;

  useEffect(() => {
    const interval = setInterval(() => {
      const current = assetsRef.current;
      const target = current[Math.floor(Math.random() * current.length)];

      if (!target) return;

      const tickPct = (Math.random() - 0.5) * 0.01;
      const newPrice = +(target.price * (1 + tickPct)).toFixed(2);
      const newChange = +(target.change24h + (newPrice - target.price)).toFixed(2);
      const newChangePct = +((newChange / newPrice) * 100).toFixed(2);

      onUpdate({
        ...target,
        price: newPrice,
        change24h: newChange,
        changePct24h: newChangePct,
        lastUpdated: new Date().toISOString(),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onUpdate]);
}
