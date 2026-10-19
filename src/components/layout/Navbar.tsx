import React, { useState, useRef, useEffect } from 'react';
import { useStockStore } from '../../store/useStockStore';
import { Stock } from '../../types/stock';
import { evaluateStock } from '../../utils/screenerEngine';
import { 
  Search, 
  TrendingUp, 
  Bookmark, 
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const {
    stocks,
    searchQuery,
    setSearchQuery,
    setSelectedStockForDetail,
    watchlist,
    selectedIndex,
    setSelectedIndex,
    indexPrices,
    analyzeAnyStock,
    lastTickTime,
    criteria,
  } = useStockStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const watchlistRef = useRef<HTMLDivElement>(null);

  // Close search & watchlist dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (watchlistRef.current && !watchlistRef.current.contains(event.target as Node)) {
        setIsWatchlistOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStocks = searchQuery.trim() === ''
    ? []
    : stocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.indices.some(idx => idx.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const handleSelectStock = (stock: Stock) => {
    setSelectedStockForDetail(stock);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (filteredStocks.length > 0) {
        handleSelectStock(filteredStocks[0]);
      } else if (searchQuery.trim() !== '') {
        analyzeAnyStock(searchQuery);
        setIsSearchOpen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Ticker Ribbon */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/60 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-0.5 w-full">
          <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-800">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-300">NSE / BSE LIVE</span>
            <span className="text-slate-500 text-[10px] hidden sm:inline">({lastTickTime})</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs shrink-0">
            {indexPrices.map((idx) => {
              const isSelected = selectedIndex === idx.name;
              const isPositive = idx.change >= 0;
              return (
                <button
                  key={idx.name}
                  type="button"
                  onClick={() => setSelectedIndex(idx.name)}
                  title={`Click to filter screener by ${idx.name}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 shadow-sm font-bold ring-1 ring-emerald-500/30'
                      : 'hover:bg-slate-800/90 text-slate-300 hover:text-white border border-transparent hover:border-slate-700/80'
                  }`}
                >
                  <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'}>
                    {idx.name}:
                  </span>
                  <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {idx.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`text-[10px] font-medium ${isPositive ? 'text-emerald-400/90' : 'text-rose-400/90'}`}>
                    ({isPositive ? '+' : ''}{idx.changePercent.toFixed(2)}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            <TrendingUp className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white">
              Best<span className="text-emerald-400">Stocks</span>
            </span>
          </div>
        </div>

        {/* Search Any Stock with Live Price & Instant Verdict Dropdown */}
        <div className="flex-1 max-w-lg relative" ref={searchRef}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search ANY Indian listed stock (e.g. Reliance, HDFC, Zomato, Suzlon)..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 text-sm text-white placeholder-slate-400 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown with Live Prices & Instant Investment Verdict */}
          {isSearchOpen && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 bg-slate-950/90 text-[11px] text-slate-400 font-semibold flex justify-between items-center">
                <span>ALL LISTED STOCKS (NSE &amp; BSE) &middot; CLICK FOR INVESTING VERDICT</span>
                <span>{filteredStocks.length} Results</span>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60">
                {filteredStocks.length === 0 ? (
                  <div className="p-6 text-center text-slate-300 text-sm">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-white text-base mb-1">Analyze "{searchQuery}" on NSE / BSE</h4>
                    <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                      Our institutional screener will compute all 11 fundamental metrics (Sales Growth, ROE, FCF, ROIC, Debt/Equity) and tell you if it's good to invest or not.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        analyzeAnyStock(searchQuery);
                        setIsSearchOpen(false);
                      }}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Run Full Fundamental Analysis on "{searchQuery}" &rarr;</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {filteredStocks.map((stock) => {
                      const isPositive = stock.change >= 0;
                      const evaluation = evaluateStock(stock, criteria);
                      const verdict = evaluation.verdict;

                      return (
                        <div
                          key={stock.id}
                          onClick={() => handleSelectStock(stock)}
                          className="px-4 py-3 hover:bg-slate-800/70 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="min-w-0 pr-3">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                                {stock.symbol}
                              </span>
                              <span className="text-xs text-slate-400 truncate max-w-[150px] sm:max-w-[220px]">
                                {stock.name}
                              </span>
                            </div>
                            
                            {/* Sector & Instant Verdict Pill */}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                {stock.sector}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  verdict.status === 'BEST_FOR_INVESTING'
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                                    : verdict.status === 'POTENTIAL_MONITOR'
                                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                                    : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                                }`}
                              >
                                {verdict.recommendation === 'GOOD TO INVEST'
                                  ? '🟢 GOOD TO INVEST'
                                  : verdict.recommendation === 'MONITOR ONLY'
                                  ? '🟡 MONITOR ONLY'
                                  : '🔴 NOT GOOD TO INVEST'} ({evaluation.score}/11)
                              </span>
                            </div>
                          </div>

                          {/* Live Price Column */}
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold text-white tracking-tight">
                              ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                            <div
                              className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                                isPositive ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
                              <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-medium group-hover:underline">
                              Click for AI Analysis →
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Instant AI Deep Dive Option for Any Search Query */}
                    <div
                      onClick={() => {
                        analyzeAnyStock(searchQuery);
                        setIsSearchOpen(false);
                      }}
                      className="p-3 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 hover:bg-emerald-900/50 cursor-pointer flex items-center justify-between border-t border-slate-700/80 transition-colors text-xs font-semibold text-emerald-300 group"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 group-hover:animate-spin" />
                        <span className="truncate">
                          Don't see your stock? Analyze <strong>"{searchQuery}"</strong> on NSE &amp; BSE
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-lg font-black transition-all">
                        Deep-Dive Verdict &rarr;
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Watchlist Quick Access */}
        <div className="relative" ref={watchlistRef}>
          <button
            onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-xs font-semibold text-slate-200 shadow-sm"
          >
            <Bookmark className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
            <span className="hidden sm:inline">Watchlist</span>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[11px] font-bold">
              {watchlist.length}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isWatchlistOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Your Watchlist</span>
                <span className="text-[11px] text-emerald-400 font-semibold">{watchlist.length} Saved</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 py-1">
                {watchlist.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No bookmarked stocks yet. Click the bookmark icon on any stock card to save.
                  </div>
                ) : (
                  watchlist.map((symbol) => {
                    const stock = stocks.find((s) => s.symbol === symbol);
                    if (!stock) return null;
                    const isPositive = stock.change >= 0;
                    return (
                      <div
                        key={stock.symbol}
                        onClick={() => {
                          setSelectedStockForDetail(stock);
                          setIsWatchlistOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-slate-800/70 rounded-lg cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {stock.symbol}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {stock.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-white">
                            ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div className={`text-[10px] font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
