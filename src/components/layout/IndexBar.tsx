import React, { useState } from 'react';
import { useStockStore } from '../../store/useStockStore';
import { StockIndex } from '../../types/stock';
import { POPULAR_INDICES } from '../../data/stocksData';
import { 
  SlidersHorizontal, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  ChevronRight,
  TrendingUp,
  Filter
} from 'lucide-react';

export default function IndexBar() {
  const {
    selectedIndex,
    setSelectedIndex,
    toggleCriteriaDrawer,
    isCriteriaDrawerOpen,
    getEvaluationsForIndex,
  } = useStockStore();

  const [inputIndexText, setInputIndexText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { qualifyingStocks, totalInIndex } = getEvaluationsForIndex(selectedIndex);

  // Match input with indices
  const handleIndexSelect = (indexName: StockIndex) => {
    setSelectedIndex(indexName);
    setInputIndexText('');
    setIsDropdownOpen(false);
  };

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputIndexText.trim()) return;

    // Normalizing text (e.g. handle 'nifty farma' -> 'NIFTY PHARMA', 'bank nifty' -> 'BANK NIFTY')
    const query = inputIndexText.trim().toLowerCase();
    const matched = POPULAR_INDICES.find(idx => {
      const nameLower = idx.name.toLowerCase();
      if (query === 'nifty farma' || query === 'pharma' || query === 'nifty pharma') return idx.name === 'NIFTY PHARMA';
      if (query === 'all' || query === 'all nifty' || query === 'nifty 500') return idx.name === 'ALL NIFTY';
      return nameLower.includes(query) || query.includes(nameLower);
    });

    if (matched) {
      setSelectedIndex(matched.name);
    } else {
      // Default fallback or closest
      setSelectedIndex('ALL NIFTY');
    }
    setInputIndexText('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Section Title & User Input for Index */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-white shrink-0">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  Find the Best Stocks
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal border border-slate-700">
                    Rule-Based AI Filter
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Select or enter an Indian Index to screen strictly qualified stocks</p>
              </div>
            </div>

            {/* User Input to Enter Index Name */}
            <form onSubmit={handleCustomInputSubmit} className="relative sm:w-64">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={inputIndexText}
                  onChange={(e) => {
                    setInputIndexText(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Enter index (e.g. Nifty 50, Sensex)..."
                  className="w-full pl-8 pr-16 py-1.5 bg-slate-950/80 text-xs text-white placeholder-slate-500 rounded-lg border border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-semibold rounded border border-emerald-500/30 transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Index Auto-suggest Dropdown */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl z-30 max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-500">
                    Available Indices
                  </div>
                  {POPULAR_INDICES.filter(idx => 
                    inputIndexText.trim() === '' || 
                    idx.name.toLowerCase().includes(inputIndexText.toLowerCase())
                  ).map((idx) => (
                    <button
                      key={idx.name}
                      type="button"
                      onClick={() => handleIndexSelect(idx.name)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-900 transition-colors ${
                        selectedIndex === idx.name ? 'text-emerald-400 bg-slate-900/50 font-medium' : 'text-slate-300'
                      }`}
                    >
                      <span>{idx.name}</span>
                      <span className="text-[10px] text-slate-500">{idx.countHint}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Quick Filter & Results Counter */}
          <div className="flex items-center gap-3 self-end lg:self-center">
            {/* Qualifying Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-700/40 text-xs text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                <strong className="text-white font-bold">{qualifyingStocks.length}</strong> of {totalInIndex} qualify in <span className="text-emerald-300 underline underline-offset-2">{selectedIndex}</span>
              </span>
            </div>

            {/* Toggle Criteria Customizer */}
            <button
              onClick={toggleCriteriaDrawer}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isCriteriaDrawerOpen
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700/80 text-slate-200 border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>11 Rules & Thresholds</span>
            </button>
          </div>
        </div>

        {/* Index Selector Quick Pills (Bottom Row of Nav) */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-emerald-400" />
            Popular Indices:
          </span>
          {POPULAR_INDICES.map((idx) => {
            const isActive = selectedIndex === idx.name;
            return (
              <button
                key={idx.name}
                onClick={() => setSelectedIndex(idx.name)}
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 font-bold scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 hover:text-white'
                }`}
              >
                {idx.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
