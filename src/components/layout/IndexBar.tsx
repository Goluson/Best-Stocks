import React, { useState, useMemo } from 'react';
import { useStockStore } from '../../store/useStockStore';
import { StockIndex, IndexCategory } from '../../types/stock';
import { ALL_INDICES_META } from '../../data/stocksData';
import { Layers } from 'lucide-react';

const CATEGORIES: ('All' | IndexCategory)[] = [
  'All',
  'Broad Market',
  'Banking & Finance',
  'Sectoral',
  'Mid & Small Cap',
];

export default function IndexBar() {
  const { selectedIndex, setSelectedIndex } = useStockStore();
  const [activeCategory, setActiveCategory] = useState<'All' | IndexCategory>('All');

  // Filter indices based on active category
  const displayedIndices = useMemo(() => {
    return ALL_INDICES_META.filter((idx) => {
      return activeCategory === 'All' || idx.category === activeCategory;
    });
  }, [activeCategory]);

  const handleIndexSelect = (indexName: StockIndex) => {
    setSelectedIndex(indexName);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
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

        {/* Index Selector Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
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
