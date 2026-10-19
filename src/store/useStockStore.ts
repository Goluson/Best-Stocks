import { create } from 'zustand';
import { Stock, StockIndex, ScreenerCriteria, EvaluationResult, IndexLivePrice } from '../types/stock';
import { ALL_STOCKS } from '../data/stocksData';
import { DEFAULT_CRITERIA, evaluateStock } from '../utils/screenerEngine';
import { resolveOrGenerateStock } from '../utils/universalStockResolver';

export const INITIAL_INDEX_PRICES: IndexLivePrice[] = [
  { name: 'NIFTY 50', currentPrice: 24852.15, change: 104.25, changePercent: 0.42 },
  { name: 'SENSEX', currentPrice: 81224.75, change: 308.10, changePercent: 0.38 },
  { name: 'BANK NIFTY', currentPrice: 51980.20, change: 335.60, changePercent: 0.65 },
  { name: 'NIFTY AUTO', currentPrice: 25410.30, change: 321.40, changePercent: 1.28 },
  { name: 'NIFTY IT', currentPrice: 42310.80, change: 468.90, changePercent: 1.12 },
  { name: 'NIFTY PHARMA', currentPrice: 22145.50, change: 154.20, changePercent: 0.70 },
  { name: 'NIFTY FMCG', currentPrice: 61280.40, change: -125.10, changePercent: -0.20 },
  { name: 'NIFTY METAL', currentPrice: 9840.60, change: 86.40, changePercent: 0.89 },
  { name: 'NIFTY MID CAP SELECT', currentPrice: 13120.30, change: 112.50, changePercent: 0.86 },
];

interface StockStore {
  stocks: Stock[];
  selectedIndex: StockIndex;
  searchQuery: string;
  selectedStockForDetail: Stock | null;
  criteria: ScreenerCriteria;
  isCriteriaDrawerOpen: boolean;
  watchlist: string[];
  indexPrices: IndexLivePrice[];
  marketStatus: 'OPEN' | 'CLOSED';
  lastTickTime: string;

  // Actions
  setSelectedIndex: (index: StockIndex) => void;
  setSearchQuery: (query: string) => void;
  setSelectedStockForDetail: (stock: Stock | null) => void;
  updateCriteria: (newCriteria: Partial<ScreenerCriteria>) => void;
  resetCriteria: () => void;
  toggleCriteriaDrawer: () => void;
  toggleWatchlist: (symbol: string) => void;
  tickPrices: () => void;
  analyzeAnyStock: (query: string) => Stock;

  // Computed helper
  getEvaluationsForIndex: (index?: StockIndex) => {
    qualifyingStocks: EvaluationResult[];
    nearMissStocks: EvaluationResult[];
    totalInIndex: number;
  };
}

// Load initial watchlist from localStorage if exists
function getInitialWatchlist(): string[] {
  try {
    const saved = localStorage.getItem('beststocks_watchlist');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // Ignore localStorage access errors
  }
  return ['TCS', 'TITAN', 'POLYCAB'];
}

export const useStockStore = create<StockStore>((set, get) => ({
  stocks: ALL_STOCKS,
  selectedIndex: 'ALL STOCKS',
  searchQuery: '',
  selectedStockForDetail: null,
  criteria: DEFAULT_CRITERIA,
  isCriteriaDrawerOpen: false,
  watchlist: getInitialWatchlist(),
  indexPrices: INITIAL_INDEX_PRICES,
  marketStatus: 'OPEN',
  lastTickTime: new Date().toLocaleTimeString(),

  setSelectedIndex: (index) => set({ selectedIndex: index }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedStockForDetail: (stock) => set({ selectedStockForDetail: stock }),
  
  updateCriteria: (newCriteria) =>
    set((state) => ({ criteria: { ...state.criteria, ...newCriteria } })),

  resetCriteria: () => set({ criteria: DEFAULT_CRITERIA }),

  toggleCriteriaDrawer: () =>
    set((state) => ({ isCriteriaDrawerOpen: !state.isCriteriaDrawerOpen })),

  toggleWatchlist: (symbol) => {
    set((state) => {
      const exists = state.watchlist.includes(symbol);
      const updatedWatchlist = exists
        ? state.watchlist.filter((s) => s !== symbol)
        : [...state.watchlist, symbol];

      try {
        localStorage.setItem('beststocks_watchlist', JSON.stringify(updatedWatchlist));
      } catch (e) {
        // Ignore
      }

      return { watchlist: updatedWatchlist };
    });
  },

  analyzeAnyStock: (query: string) => {
    const currentStocks = get().stocks;
    const resolvedStock = resolveOrGenerateStock(query, currentStocks);

    const exists = currentStocks.some((s) => s.id === resolvedStock.id || s.symbol.toUpperCase() === resolvedStock.symbol.toUpperCase());
    if (!exists) {
      set((state) => ({
        stocks: [resolvedStock, ...state.stocks],
        selectedStockForDetail: resolvedStock,
        searchQuery: '',
      }));
    } else {
      set({
        selectedStockForDetail: resolvedStock,
        searchQuery: '',
      });
    }

    return resolvedStock;
  },

  tickPrices: () => {
    set((state) => {
      const updatedStocks = state.stocks.map((stock) => {
        // 40% chance of price tick per stock
        if (Math.random() > 0.4) return stock;
        
        // Random micro tick between -0.4% and +0.4%
        const deltaPct = (Math.random() - 0.49) * 0.008;
        const newPrice = Math.round((stock.currentPrice * (1 + deltaPct)) * 100) / 100;
        const newChange = Math.round((stock.change + (newPrice - stock.currentPrice)) * 100) / 100;
        const newChangePct = Math.round(((newChange / (newPrice - newChange)) * 100) * 100) / 100;
        const newSparkline = [...stock.sparkline.slice(1), newPrice];

        return {
          ...stock,
          currentPrice: newPrice,
          change: newChange,
          changePercent: newChangePct,
          dayHigh: Math.max(stock.dayHigh, newPrice),
          dayLow: Math.min(stock.dayLow, newPrice),
          sparkline: newSparkline,
        };
      });

      const updatedIndexPrices = state.indexPrices.map((idx) => {
        // 50% chance of price tick per index
        if (Math.random() > 0.5) return idx;
        const deltaPct = (Math.random() - 0.49) * 0.003;
        const newPrice = Math.round((idx.currentPrice * (1 + deltaPct)) * 100) / 100;
        const newChange = Math.round((idx.change + (newPrice - idx.currentPrice)) * 100) / 100;
        const newChangePct = Math.round(((newChange / (newPrice - newChange)) * 100) * 100) / 100;
        return {
          ...idx,
          currentPrice: newPrice,
          change: newChange,
          changePercent: newChangePct,
        };
      });

      const currentDetail = state.selectedStockForDetail;
      const updatedDetail = currentDetail
        ? updatedStocks.find((s) => s.id === currentDetail.id) || currentDetail
        : null;

      return {
        stocks: updatedStocks,
        indexPrices: updatedIndexPrices,
        selectedStockForDetail: updatedDetail,
        lastTickTime: new Date().toLocaleTimeString(),
      };
    });
  },

  getEvaluationsForIndex: (targetIndex) => {
    const state = get();
    const indexToUse = targetIndex || state.selectedIndex;
    
    // Filter stocks belonging to index (or all Indian stocks)
    const indexStocks = state.stocks.filter((stock) =>
      indexToUse === 'ALL STOCKS' || indexToUse === 'ALL NIFTY' ? true : stock.indices.includes(indexToUse)
    );

    const evaluated = indexStocks.map((stock) => evaluateStock(stock, state.criteria));
    
    const qualifyingStocks = evaluated
      .filter((res) => res.meetsAll)
      .sort((a, b) => b.score - a.score || b.stock.roe - a.stock.roe);

    const nearMissStocks = evaluated
      .filter((res) => !res.meetsAll && res.score >= 8)
      .sort((a, b) => b.score - a.score || b.stock.roe - a.stock.roe);

    return {
      qualifyingStocks,
      nearMissStocks,
      totalInIndex: indexStocks.length,
    };
  },
}));
