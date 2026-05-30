import { create } from 'zustand';
import type { Transaction, AccountBalance, AssetPrice, Budget } from '../types/finance';
import {
  mockTransactions, mockAccounts,
  mockAssetPrices, mockBudgets
} from '../mock/data';

export interface Alert {
  id: string;
  type: 'expense' | 'price';
  message: string;
  timestamp: string;
}

interface FinanceState {
  transactions:  Transaction[];
  accounts:      AccountBalance[];
  assetPrices:   AssetPrice[];
  budgets:       Budget[];
  alerts:        Alert[];
  totalBalance:  number;

  addTransaction:  (tx: Transaction) => void;
  updateAssetPrice:(updated: AssetPrice) => void;
  dismissAlert:    (id: string) => void;
}

function calcTotal(accounts: AccountBalance[]) {
  return accounts.reduce((s, a) => s + a.balance, 0);
}

function recalcBudgets(budgets: Budget[], transactions: Transaction[]): Budget[] {
  const thisMonth = new Date().getMonth();
  const spent: Partial<Record<string, number>> = {};

  transactions
    .filter(tx => tx.amount < 0 && new Date(tx.date).getMonth() === thisMonth)
    .forEach(tx => {
      spent[tx.category] = (spent[tx.category] ?? 0) + Math.abs(tx.amount);
    });

  return budgets.map(b => ({ ...b, spent: +(spent[b.category] ?? 0).toFixed(2) }));
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: mockTransactions,
  accounts:     mockAccounts,
  assetPrices:  mockAssetPrices,
  budgets:      recalcBudgets(mockBudgets, mockTransactions),
  alerts:       [],
  totalBalance: calcTotal(mockAccounts),

  addTransaction(tx) {
    const { transactions, accounts, budgets } = get();
    const newAlerts: Alert[] = [];

    if (tx.amount < 0 && Math.abs(tx.amount) > 300) {
      newAlerts.push({
        id:        `alert-${Date.now()}`,
        type:      'expense',
        message:   `Large expense: ${tx.description} — $${Math.abs(tx.amount).toFixed(2)}`,
        timestamp: new Date().toISOString(),
      });
    }

    const updatedAccounts = accounts.map(acc =>
      acc.id === tx.accountId
        ? { ...acc, balance: +(acc.balance + tx.amount).toFixed(2), lastUpdated: tx.date }
        : acc
    );

    const newTransactions = [tx, ...transactions];
    const newBudgets      = recalcBudgets(budgets, newTransactions);

    set({
      transactions:  newTransactions,
      accounts:      updatedAccounts,
      budgets:       newBudgets,
      totalBalance:  calcTotal(updatedAccounts),
      alerts:        newAlerts.length ? [...get().alerts, ...newAlerts] : get().alerts,
    });
  },

  updateAssetPrice(updated) {
    const { assetPrices } = get();
    const prev    = assetPrices.find(a => a.symbol === updated.symbol);
    const alerts  = [...get().alerts];

    if (prev) {
      const movePct = Math.abs((updated.price - prev.price) / prev.price * 100);
      if (movePct > 3) {
        alerts.push({
          id:        `alert-${Date.now()}`,
          type:      'price',
          message:   `${updated.symbol} moved ${movePct.toFixed(1)}% → $${updated.price.toLocaleString()}`,
          timestamp: new Date().toISOString(),
        });
      }
    }

    set({
      assetPrices: assetPrices.map(a => a.symbol === updated.symbol ? updated : a),
      alerts,
    });
  },

  dismissAlert(id) {
    set({ alerts: get().alerts.filter(a => a.id !== id) });
  },
}));
