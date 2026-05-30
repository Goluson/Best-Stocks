import { useFinanceStore } from '../../store/useFinanceStore';
import type { TransactionCategory } from '../../types/finance';
import Card from '../ui/Card';

const CATEGORY_EMOJI: Record<TransactionCategory, string> = {
  food: '🍔', transport: '🚗', housing: '🏠',
  entertainment: '🎬', healthcare: '💊', shopping: '🛍️',
  income: '💰', other: '•',
};

export default function RecentTransactions() {
  const transactions = useFinanceStore(s => s.transactions);
  const recent = transactions.slice(0, 5);

  return (
    <Card>
      <p className="text-xs text-gray-400 mb-3">Recent transactions</p>
      <div className="flex flex-col gap-3">
        {recent.map(tx => (
          <div key={tx.id} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm shrink-0">
              {CATEGORY_EMOJI[tx.category]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{tx.description}</p>
              <p className="text-xs text-gray-400 capitalize">{tx.category}</p>
            </div>
            <span className={`text-sm font-medium tabular-nums ${tx.amount >= 0 ? 'text-green-600' : 'text-gray-800'}`}>
              {tx.amount >= 0 ? '+' : '−'}${Math.abs(tx.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
