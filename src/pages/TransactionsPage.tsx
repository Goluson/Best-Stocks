import TransactionsTable from '../components/transactions/TransactionsTable';
import { useFinanceStore } from '../store/useFinanceStore';

export default function TransactionsPage() {
  const transactions = useFinanceStore(s => s.transactions);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">Transactions</h1>
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
