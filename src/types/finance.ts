export type TransactionCategory =
  | 'food' | 'transport' | 'housing' | 'entertainment'
  | 'healthcare' | 'shopping' | 'income' | 'other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  accountId: string;
}

export interface AccountBalance {
  id: string;
  name: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  spent: number;
}

export interface AssetPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePct24h: number;
  lastUpdated: string;
}

export interface NetWorthDataPoint {
  date: string;
  value: number;
}
