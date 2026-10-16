import React from 'react';
import { useStockStore } from '../../store/useStockStore';
import StockCard from './StockCard';
import { ALL_INDICES_META } from '../../data/stocksData';
import { StockIndex } from '../../types/stock';
import { 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export default function ScreenerResults() {
  const { 
    selectedIndex, 
    setSelectedIndex, 
    getEvaluationsForIndex, 
    setSelectedStockForDetail,
    toggleCriteriaDrawer
  } = useStockStore();

  const { qualifyingStocks, nearMissStocks, totalInIndex } = getEvaluationsForIndex(selectedIndex);

  // Check alternative indices that DO have qualifying stocks
  const alternativeIndices = ALL_INDICES_META.map(idx => {
    const evalData = getEvaluationsForIndex(idx.name);
    return {
      name: idx.name,
      count: evalData.qualifyingStocks.length,
      category: idx.category,
    };
  }).filter(item => item.name !== selectedIndex && item.count > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Qualifying Stocks Section */}
      {qualifyingStocks.length > 0 ? (
        <div>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Best Stocks in <span className="text-emerald-400">{selectedIndex}</span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Displaying stocks that <strong className="text-emerald-300 font-semibold">100% fulfill all 11 conditions</strong> (Sales Growth, ROE, FCF, ROIC, PEG, D/E, etc.)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                {qualifyingStocks.length} Stocks Passed 11/11 Rules
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualifyingStocks.map((evaluation) => (
              <StockCard
                key={evaluation.stock.id}
                evaluation={evaluation}
                onSelect={() => setSelectedStockForDetail(evaluation.stock)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State: Prompt user to enter or select any other index */
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl backdrop-blur-xl text-center max-w-3xl mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            No Stocks in <span className="text-amber-400">{selectedIndex}</span> Fulfill All 11 Strict Conditions
          </h2>

          <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
            None of the stocks in this index currently satisfy all 11 rigorous filters (e.g., Sales Growth &gt; 15%, Debt/Equity &lt; 0.5, ROIC &gt; 15%, FCF positive &amp; growing).
          </p>

          <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Please Enter or Select Any Other Indices:
            </h4>
            <div className="flex flex-wrap gap-2">
              {alternativeIndices.slice(0, 8).map((alt) => (
                <button
                  key={alt.name}
                  onClick={() => setSelectedIndex(alt.name)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all group"
                >
                  <span>{alt.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 group-hover:bg-slate-900 group-hover:text-emerald-400 text-emerald-300 font-bold">
                    {alt.count} qualify
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setSelectedIndex('ALL NIFTY')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore ALL NIFTY Universe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={toggleCriteriaDrawer}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Adjust Criteria Thresholds</span>
            </button>
          </div>
        </div>
      )}

      {/* Near Miss Stocks (Stocks that passed 8 to 10 criteria) */}
      {nearMissStocks.length > 0 && (
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>Near-Qualifying Candidates in {selectedIndex}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Passed 8–10 of 11 Rules
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Strong performers that missed by just 1 or 2 metrics (e.g. slight leverage or higher valuation)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearMissStocks.map((evaluation) => (
              <StockCard
                key={evaluation.stock.id}
                evaluation={evaluation}
                onSelect={() => setSelectedStockForDetail(evaluation.stock)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
