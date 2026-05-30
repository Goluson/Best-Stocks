import type {
  Transaction, AccountBalance, Budget,
  AssetPrice, NetWorthDataPoint
} from '../types/finance';

export const mockAccounts: AccountBalance[] = [
  { id: 'acc-1', name: 'Checking',  balance: 4820.5,  currency: 'USD', lastUpdated: new Date().toISOString() },
  { id: 'acc-2', name: 'Savings',   balance: 18340.0, currency: 'USD', lastUpdated: new Date().toISOString() },
  { id: 'acc-3', name: 'Investment',balance: 31200.75,currency: 'USD', lastUpdated: new Date().toISOString() },
];

export const mockBudgets: Budget[] = [
  { id: 'b-1', category: 'food',          limit: 600,   spent: 420 },
  { id: 'b-2', category: 'transport',     limit: 200,   spent: 185 },
  { id: 'b-3', category: 'entertainment', limit: 150,   spent: 210 },
  { id: 'b-4', category: 'shopping',      limit: 300,   spent: 95  },
  { id: 'b-5', category: 'healthcare',    limit: 250,   spent: 0   },
];

export const mockAssetPrices: AssetPrice[] = [
  { symbol: 'BTC',  name: 'Bitcoin',  price: 67420, change24h: 1230, changePct24h: 1.86,  lastUpdated: new Date().toISOString() },
  { symbol: 'ETH',  name: 'Ethereum', price: 3510,  change24h: -42,  changePct24h: -1.18, lastUpdated: new Date().toISOString() },
  { symbol: 'AAPL', name: 'Apple',    price: 189.45, change24h: 2.1, changePct24h: 1.12,  lastUpdated: new Date().toISOString() },
];

export const mockNetWorth: NetWorthDataPoint[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (89 - i));
  const trend = 50000 + i * 80;
  const noise = (Math.random() - 0.5) * 2000;
  return { date: date.toISOString().split('T')[0], value: Math.round(trend + noise) };
});

const descriptions: Record<string, string[]> = {
  food:          ['Starbucks', 'Whole Foods', 'Chipotle', 'DoorDash', 'Trader Joes'],
  transport:     ['Uber', 'Shell Gas', 'Metro Card', 'Lyft', 'Parking'],
  housing:       ['Rent', 'Electric Bill', 'Internet', 'Water Bill'],
  entertainment: ['Netflix', 'Spotify', 'Movie Tickets', 'Steam'],
  healthcare:    ['CVS Pharmacy', 'Doctor Visit', 'Gym Membership'],
  shopping:      ['Amazon', 'Target', 'Zara', 'Best Buy'],
  income:        ['Payroll', 'Freelance Payment', 'Dividend'],
  other:         ['ATM Withdrawal', 'Bank Fee', 'Venmo'],
};

const categories = Object.keys(descriptions) as (keyof typeof descriptions)[];

export const mockTransactions: Transaction[] = Array.from({ length: 200 }, (_, i) => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const descList = descriptions[category];
  const isIncome = category === 'income';
  const amount = isIncome
    ? +(Math.random() * 3000 + 500).toFixed(2)
    : -+(Math.random() * 200 + 5).toFixed(2);

  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 90));

  return {
    id: `txn-${i}`,
    date: date.toISOString(),
    description: descList[Math.floor(Math.random() * descList.length)],
    amount,
    category: category as Transaction['category'],
    accountId: `acc-${(i % 3) + 1}`,
  };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
