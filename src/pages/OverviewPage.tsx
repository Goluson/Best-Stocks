import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import MetricCard from '../components/ui/MetricCard';
import NetWorthChart from '../components/charts/NetWorthChart';
import ExpenseDonut from '../components/charts/ExpenseDonut';
import BudgetWidget from '../components/budgets/BudgetWidget';
import RecentTransactions from '../components/transactions/RecentTransactions';

export default function OverviewPage() {
  const accounts     = useFinanceStore(s => s.accounts);
  const transactions = useFinanceStore(s => s.transactions);
  const totalBalance = useFinanceStore(s => s.totalBalance);

  const thisMonth = new Date().getMonth();
  const thisYear  = new Date().getFullYear();

  const { monthlyIncome, monthlyExpenses, savingsRate } = useMemo(() => {
    const monthly = transactions.filter(tx => {
      const d = new Date(tx.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    const income   = monthly.filter(tx => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0);
    const expenses = monthly.filter(tx => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0);
    const savings  = income > 0 ? (income - expenses) / income * 100 : 0;

    return {
      monthlyIncome:   income,
      monthlyExpenses: expenses,
      savingsRate:     savings,
    };
  }, [transactions, thisMonth, thisYear]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Net worth"
          value={`$${totalBalance.toLocaleString()}`}
          sub="↑ 4.2% this month"
          trend="up"
        />
        <MetricCard
          label="Monthly income"
          value={`$${monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          sub="This month"
          trend="neutral"
        />
        <MetricCard
          label="Monthly expenses"
          value={`$${monthlyExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          sub="↑ 12% vs last month"
          trend="down"
        />
        <MetricCard
          label="Savings rate"
          value={`${savingsRate.toFixed(1)}%`}
          sub={savingsRate >= 20 ? '↑ On track' : '↓ Below 20% goal'}
          trend={savingsRate >= 20 ? 'up' : 'down'}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2"><NetWorthChart /></div>
        <ExpenseDonut />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <BudgetWidget />
        <RecentTransactions />
      </div>
    </div>
  );
}
