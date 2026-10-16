import React, { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import IndexBar from './components/layout/IndexBar';
import CriteriaPanel from './components/screener/CriteriaPanel';
import ScreenerResults from './components/screener/ScreenerResults';
import StockDetailModal from './components/screener/StockDetailModal';
import SignInModal from './components/auth/SignInModal';
import { useStockStore } from './store/useStockStore';

export default function App() {
  const { tickPrices } = useStockStore();

  // Simulate live market ticks every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      tickPrices();
    }, 2500);
    return () => clearInterval(interval);
  }, [tickPrices]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Top Navbar: Global Stock Search & Live Price + Sign In */}
      <Navbar />

      {/* 2. Sub-Navbar: Find Best Stocks & Indices Selector */}
      <IndexBar />

      {/* 3. 11 Criteria Configuration Panel (Toggleable) */}
      <CriteriaPanel />

      {/* 4. Main Screener Results (Qualifying Stocks or Enter Other Indices State) */}
      <main className="flex-1">
        <ScreenerResults />
      </main>

      {/* 5. Live Stock Price & Financial Analysis Modal (Triggered by Search or Card Click) */}
      <StockDetailModal />

      {/* 6. Simple Sign In Modal */}
      <SignInModal />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">BestStocks AI</span>
            <span>— Institutional Grade Stock Screening Engine</span>
          </div>
          <div>
            11 Strict Criteria: Sales Growth &gt; 15-30% • Profit &gt; 15% • PEG &lt; 1.5 • ROE &gt; 15-20% • D/E &lt; 0.5 • FCF &gt; 0 • ROIC &gt; 15% • FCF Conv &gt; 80% • ROIC-WACC Spread &gt; 5% • Int. Cov &gt; 5x • 3Y CAGR &gt; 10%
          </div>
        </div>
      </footer>
    </div>
  );
}
