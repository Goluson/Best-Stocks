import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinanceStore } from '../../store/useFinanceStore';
import type { TransactionCategory } from '../../types/finance';
import Card from '../ui/Card';

const COLORS: Record<TransactionCategory, string> = {
  food:          '#f59e0b',
  transport:     '#6366f1',
  housing:       '#ef4444',
  entertainment: '#8b5cf6',
  healthcare:    '#10b981',
  shopping:      '#f97316',
  income:        '#22c55e',
  other:         '#9ca3af',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm">
      <p className="capitalize font-medium text-gray-800">{payload[0].name}</p>
      <p className="text-gray-500">${payload[0].value.toFixed(0)}</p>
    </div>
  );
}

export default function ExpenseDonut() {
  const transactions = useFinanceStore(s => s.transactions);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const data = useMemo(() => {
    const totals: Partial<Record<TransactionCategory, number>> = {};

    transactions
      .filter(tx => {
        const d = new Date(tx.date);
        return tx.amount < 0 && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .forEach(tx => {
        totals[tx.category] = (totals[tx.category] ?? 0) + Math.abs(tx.amount);
      });

    return Object.entries(totals)
      .map(([cat, val]) => ({ name: cat, value: +val!.toFixed(2) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, thisMonth, thisYear]);

  const total = data.reduce((s, d) => s + d.value, 0);
  const totalLabel = total > 0 ? `$${total.toFixed(0)} spent this month` : 'No expense data yet';

  return (
    <Card>
      <p className="text-xs text-gray-400 mb-1">Expense breakdown</p>
      <p className="text-sm font-medium text-gray-700 mb-4">{totalLabel}</p>

      <div className="flex items-center gap-4">
        <div className="shrink-0" style={{ width: 140, height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={64}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map(entry => (
                  <Cell key={entry.name} fill={COLORS[entry.name as TransactionCategory] ?? '#9ca3af'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {data.slice(0, 6).map(d => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[d.name as TransactionCategory] ?? '#9ca3af' }} />
              <span className="capitalize text-gray-600 flex-1 truncate">{d.name}</span>
              <span className="text-gray-800 font-medium tabular-nums">${d.value.toFixed(0)}</span>
              <span className="text-gray-400 tabular-nums w-8 text-right">{((d.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
