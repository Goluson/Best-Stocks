import { create } from 'zustand';
import { Stock, StockIndex, ScreenerCriteria, EvaluationResult, UserProfile } from '../types/stock';
import { ALL_STOCKS } from '../data/stocksData';
import { DEFAULT_CRITERIA, evaluateStock } from '../utils/screenerEngine';

interface StockStore {
  stocks: Stock[];
  selectedIndex: StockIndex;
  searchQuery: string;
  selectedStockForDetail: Stock | null;
  criteria: ScreenerCriteria;
  isCriteriaDrawerOpen: boolean;
  isSignInModalOpen: boolean;
  currentUser: UserProfile | null;
  marketStatus: 'OPEN' | 'CLOSED';
  lastTickTime: string;

  // Actions
  setSelectedIndex: (index: StockIndex) => void;
  setSearchQuery: (query: string) => void;
  setSelectedStockForDetail: (stock: Stock | null) => void;
  updateCriteria: (newCriteria: Partial<ScreenerCriteria>) => void;
  resetCriteria: () => void;
  toggleCriteriaDrawer: () => void;
  setIsSignInModalOpen: (isOpen: boolean) => void;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  toggleWatchlist: (symbol: string) => void;
  tickPrices: () => void;

  // Computed helper
  getEvaluationsForIndex: (index?: StockIndex) => {
    qualifyingStocks: EvaluationResult[];
    nearMissStocks: EvaluationResult[];
    totalInIndex: number;
  };
}

// Load initial user from localStorage if exists
function getInitialUser(): UserProfile | null {
  try {
    const saved = localStorage.getItem('beststocks_user');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // Ignore localStorage access errors
  }
  return null;
}

export const useStockStore = create<StockStore>((set, get) => ({
  stocks: ALL_STOCKS,
  selectedIndex: 'NIFTY 50',
  searchQuery: '',
  selectedStockForDetail: null,
  criteria: DEFAULT_CRITERIA,
  isCriteriaDrawerOpen: false,
  isSignInModalOpen: false,
  currentUser: getInitialUser(),
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

  setIsSignInModalOpen: (isOpen) => set({ isSignInModalOpen: isOpen }),

  signIn: (email, name) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || cleanEmail.split('@')[0];
    const newUser: UserProfile = {
      name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0284c7,059669,7c3aed`,
      watchlist: ['TCS', 'TITAN', 'POLYCAB'],
    };

    try {
      localStorage.setItem('beststocks_user', JSON.stringify(newUser));
    } catch (e) {
      // Ignore localStorage access errors
    }

    set({
      currentUser: newUser,
      isSignInModalOpen: false,
    });
  },

  signOut: () => {
    try {
      localStorage.removeItem('beststocks_user');
    } catch (e) {
      // Ignore
    }
    set({ currentUser: null });
  },

  toggleWatchlist: (symbol) => {
    const user = get().currentUser;
    if (!user) {
      set({ isSignInModalOpen: true });
      return;
    }
    const exists = user.watchlist.includes(symbol);
    const updatedWatchlist = exists
      ? user.watchlist.filter((s) => s !== symbol)
      : [...user.watchlist, symbol];

    const updatedUser = { ...user, watchlist: updatedWatchlist };
    try {
      localStorage.setItem('beststocks_user', JSON.stringify(updatedUser));
    } catch (e) {
      // Ignore
    }

    set({ currentUser: updatedUser });
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

      const currentDetail = state.selectedStockForDetail;
      const updatedDetail = currentDetail
        ? updatedStocks.find((s) => s.id === currentDetail.id) || currentDetail
        : null;

      return {
        stocks: updatedStocks,
        selectedStockForDetail: updatedDetail,
        lastTickTime: new Date().toLocaleTimeString(),
      };
    });
  },

  getEvaluationsForIndex: (targetIndex) => {
    const state = get();
    const indexToUse = targetIndex || state.selectedIndex;
    
    // Filter stocks belonging to index
    const indexStocks = state.stocks.filter((stock) =>
      indexToUse === 'ALL NIFTY' ? true : stock.indices.includes(indexToUse)
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
