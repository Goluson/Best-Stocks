import React, { useState, useMemo } from 'react';
import { useStockStore } from '../../store/useStockStore';
import { StockIndex, IndexCategory } from '../../types/stock';
import { ALL_INDICES_META } from '../../data/stocksData';
import { 
  SlidersHorizontal, 
  Search, 
  CheckCircle2, 
  Compass, 
  Filter,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';

const CATEGORIES: ('All' | IndexCategory)[] = [
  'All',
  'Broad Market',
  'Banking & Finance',
  'Sectoral',
  'Mid & Small Cap',
];

export default function IndexBar() {
  const {
    selectedIndex,
    setSelectedIndex,
    toggleCriteriaDrawer,
    isCriteriaDrawerOpen,
    getEvaluationsForIndex,
  } = useStockStore();

  const [inputIndexText, setInputIndexText] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | IndexCategory>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { qualifyingStocks, totalInIndex } = getEvaluationsForIndex(selectedIndex);

  // Filter indices based on category and search text
  const displayedIndices = useMemo(() => {
    return ALL_INDICES_META.filter((idx) => {
      const matchesCategory = activeCategory === 'All' || idx.category === activeCategory;
      const matchesQuery = inputIndexText.trim() === '' || 
        idx.name.toLowerCase().includes(inputIndexText.toLowerCase()) ||
        idx.description.toLowerCase().includes(inputIndexText.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, inputIndexText]);

  const handleIndexSelect = (indexName: StockIndex) => {
    setSelectedIndex(indexName);
    setInputIndexText('');
    setIsDropdownOpen(false);
  };

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputIndexText.trim()) return;

    const query = inputIndexText.trim().toLowerCase();
    const matched = ALL_INDICES_META.find(idx => {
      const nameLower = idx.name.toLowerCase();
      // Handle conversational aliases
      if (query.includes('metal')) return idx.name === 'NIFTY METAL';
      if (query.includes('private bank')) return idx.name === 'NIFTY PRIVATE BANK';
      if (query.includes('psu bank')) return idx.name === 'NIFTY PSU BANK';
      if (query.includes('realty') || query.includes('real estate')) return idx.name === 'NIFTY REALTY';
      if (query.includes('commodity') || query.includes('commodities')) return idx.name === 'NIFTY COMMODITIES';
      if (query.includes('auto')) return idx.name === 'NIFTY AUTO';
      if (query.includes('fmcg')) return idx.name === 'NIFTY FMCG';
      if (query.includes('fin nifty') || query.includes('finnifty')) return idx.name === 'FIN NIFTY';
      if (query.includes('bankex')) return idx.name === 'BANKEX';
      if (query.includes('small cap') || query.includes('smallcap')) return idx.name === 'NIFTY SMALL CAP';
      if (query.includes('mid cap 150') || query.includes('midcap 150')) return idx.name === 'NIFTY MID CAP 150';
      if (query.includes('mid cap select') || query.includes('midcap select')) return idx.name === 'NIFTY MID CAP SELECT';
      return nameLower.includes(query) || query.includes(nameLower);
    });

    if (matched) {
      setSelectedIndex(matched.name);
    } else {
      setSelectedIndex('ALL NIFTY');
    }
    setInputIndexText('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        
        {/* Top Row: Title, Index Search, and Status Counters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Title & Index Search Form */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2.5 text-white shrink-0">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  Find the Best Stocks
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                    22 Indian Indices
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Select an index to analyze strictly qualified compounders
                </p>
              </div>
            </div>

            {/* User Input to Enter Any Index Name */}
            <form onSubmit={handleCustomInputSubmit} className="relative sm:w-72">
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
                  placeholder="Enter index (e.g. Nifty Metal, Fin Nifty)..."
                  className="w-full pl-8 pr-16 py-1.5 bg-slate-950 text-xs text-white placeholder-slate-500 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-semibold rounded-lg border border-emerald-500/30 transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Index Auto-suggest Dropdown */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-40 max-h-72 overflow-y-auto divide-y divide-slate-800">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 bg-slate-900/80 flex justify-between">
                    <span>MATCHING INDICES</span>
                    <span>{displayedIndices.length} Available</span>
                  </div>
                  {displayedIndices.map((idx) => (
                    <button
                      key={idx.name}
                      type="button"
                      onClick={() => handleIndexSelect(idx.name)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-900 transition-colors ${
                        selectedIndex === idx.name ? 'text-emerald-400 bg-slate-900/60 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-white">{idx.name}</div>
                        <div className="text-[10px] text-slate-500">{idx.category} • {idx.description}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {idx.countHint}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-3 self-end lg:self-center">
            {/* Qualifying Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-xs text-emerald-300 font-medium shadow-inner">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white font-bold">{qualifyingStocks.length}</strong> of {totalInIndex} qualify in <span className="text-emerald-300 font-semibold underline underline-offset-2">{selectedIndex}</span>
              </span>
            </div>

            {/* Toggle 11 Rules Drawer */}
            <button
              onClick={toggleCriteriaDrawer}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isCriteriaDrawerOpen
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>11 Rules &amp; Thresholds</span>
            </button>
          </div>
        </div>

        {/* Category Tabs (Keeps UI clean and NOT messy) */}
        <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Layers className="w-3 h-3 text-emerald-400" />
            Category:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Index Selector Quick Pills (Bottom Row) */}
        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {displayedIndices.map((idx) => {
            const isActive = selectedIndex === idx.name;
            return (
              <button
                key={idx.name}
                onClick={() => handleIndexSelect(idx.name)}
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 font-bold scale-[1.02]'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white'
                }`}
              >
                <span>{idx.name}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded-full ${isActive ? 'bg-slate-950/20 text-slate-900 font-bold' : 'text-slate-500'}`}>
                  {idx.countHint.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
