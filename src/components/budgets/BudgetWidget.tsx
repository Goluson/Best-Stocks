import { useFinanceStore } from '../../store/useFinanceStore';
import type { Budget } from '../../types/finance';
import Card from '../ui/Card';

function BudgetRow({ budget }: { budget: Budget }) {
  const pct     = Math.min((budget.spent / budget.limit) * 100, 100);
  const isOver  = budget.spent > budget.limit;
  const isWarn  = pct >= 80 && !isOver;

  const barColor = isOver  ? 'bg-red-500'
                 : isWarn  ? 'bg-amber-400'
                 :           'bg-indigo-500';

  const textColor = isOver ? 'text-red-600' : isWarn ? 'text-amber-600' : 'text-gray-400';

  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700 capitalize">{budget.category}</span>
        <div className="flex items-center gap-1.5 text-xs">
          <span className={`font-medium ${isOver ? 'text-red-600' : 'text-gray-800'}`}>${budget.spent}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400">${budget.limit}</span>
          {isOver && (
            <span className="bg-red-50 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-medium">over</span>
          )}
        </div>
      </div>

      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>

      <p className={`text-xs mt-1 ${textColor}`}>
        {isOver
          ? `$${(budget.spent - budget.limit)} over limit`
          : `$${budget.limit - budget.spent} remaining`}
      </p>
    </div>
  );
}

export default function BudgetWidget() {
  const budgets = useFinanceStore(s => s.budgets);
  const overCount = budgets.filter(b => b.spent > b.limit).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400">Budget tracking</p>
        {overCount > 0 && (
          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">{overCount} over budget</span>
        )}
      </div>

      <div>
        {budgets.map(b => <BudgetRow key={b.id} budget={b} />)}
      </div>
    </Card>
  );
}
