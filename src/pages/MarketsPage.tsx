import { useFinanceStore } from '../store/useFinanceStore';
import Card from '../components/ui/Card';

export default function MarketsPage() {
  const prices = useFinanceStore(s => s.assetPrices);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">Markets</h1>

      <div className="grid grid-cols-3 gap-4">
        {prices.map(asset => {
          const isUp = asset.changePct24h >= 0;
          return (
            <Card key={asset.symbol}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">{asset.name}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-0.5">${asset.price.toLocaleString()}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${isUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {isUp ? '↑' : '↓'} {Math.abs(asset.changePct24h).toFixed(2)}%
                </span>
              </div>
              <p className="text-xs text-gray-400">{isUp ? '+' : ''}${asset.change24h.toFixed(2)} today</p>
              <p className="text-xs text-gray-300 mt-1">Updated {new Date(asset.lastUpdated).toLocaleTimeString()}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
