import React, { useState, useRef, useEffect } from 'react';
import { useStockStore } from '../../store/useStockStore';
import { Stock } from '../../types/stock';
import { 
  Search, 
  TrendingUp, 
  User, 
  LogIn, 
  Bookmark, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  X,
  ExternalLink
} from 'lucide-react';

export default function Navbar() {
  const {
    stocks,
    searchQuery,
    setSearchQuery,
    setSelectedStockForDetail,
    currentUser,
    setIsSignInModalOpen,
    signOut,
    lastTickTime,
  } = useStockStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
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
          s.sector.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSelectStock = (stock: Stock) => {
    setSelectedStockForDetail(stock);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Ticker Ribbon */}
      <div className="bg-slate-950 px-4 py-1 text-xs border-b border-slate-800/60 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-300">NSE / BSE LIVE</span>
            <span className="text-slate-500 text-[10px]">Updated {lastTickTime}</span>
          </div>
          <div className="flex items-center gap-4 text-xs shrink-0">
            <span className="text-slate-400">NIFTY 50: <span className="text-emerald-400 font-medium">24,852.15 (+0.42%)</span></span>
            <span className="text-slate-400">SENSEX: <span className="text-emerald-400 font-medium">81,224.75 (+0.38%)</span></span>
            <span className="text-slate-400">BANK NIFTY: <span className="text-emerald-400 font-medium">51,980.20 (+0.65%)</span></span>
            <span className="text-slate-400">NIFTY IT: <span className="text-emerald-400 font-medium">42,310.80 (+1.12%)</span></span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400 font-medium shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rule-Based Screener Active</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            <TrendingUp className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                Best<span className="text-emerald-400">Stocks</span>
              </span>
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                PRO Screener
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Find High Quality Compounders</p>
          </div>
        </div>

        {/* Search Any Stock with Live Price Dropdown */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
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
              placeholder="Search any stock (e.g. TCS, Titan, Polycab) to see live price..."
              className="w-full pl-10 pr-10 py-2 bg-slate-800/90 text-sm text-white placeholder-slate-400 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 transition-all shadow-inner"
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

          {/* Autocomplete Dropdown with Live Prices */}
          {isSearchOpen && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 bg-slate-950/80 text-[11px] text-slate-400 font-medium flex justify-between items-center">
                <span>STOCK SEARCH RESULTS (SHOWING LIVE PRICE)</span>
                <span>{filteredStocks.length} Found</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filteredStocks.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No stocks matching "{searchQuery}"
                  </div>
                ) : (
                  filteredStocks.map((stock) => {
                    const isPositive = stock.change >= 0;
                    return (
                      <div
                        key={stock.id}
                        onClick={() => handleSelectStock(stock)}
                        className="px-4 py-3 hover:bg-slate-800/70 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {stock.symbol}
                            </span>
                            <span className="text-xs text-slate-400 truncate max-w-[160px] sm:max-w-[200px]">
                              {stock.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-slate-500">{stock.sector}</span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                              {stock.indices[0]}
                            </span>
                          </div>
                        </div>

                        {/* Live Price Column */}
                        <div className="text-right">
                          <div className="text-sm font-semibold text-white tracking-tight">
                            ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div
                            className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                              isPositive ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
                            <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
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

        {/* User / Sign In Button */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-sm"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg ring-1 ring-emerald-500/40 object-cover"
                />
                <span className="font-medium text-slate-200 hidden sm:inline">{currentUser.name}</span>
                <span className="flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                  <Bookmark className="w-3 h-3" />
                  {currentUser.watchlist.length}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs text-slate-400">
                      Watchlist: <span className="text-emerald-400 font-semibold">{currentUser.watchlist.join(', ')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-sm rounded-xl shadow-md shadow-emerald-500/20 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
