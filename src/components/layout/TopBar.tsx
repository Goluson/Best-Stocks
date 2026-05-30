import { useFinanceStore } from '../../store/useFinanceStore';

export default function TopBar() {
  const accounts     = useFinanceStore(s => s.accounts);
  const totalBalance = useFinanceStore(s => s.totalBalance);

  return (
    <header className="h-14 shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="flex items-center gap-1.5 text-sm">
            <span className="text-gray-400">{acc.name}</span>
            <span className="font-medium">${acc.balance.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="text-sm">
        <span className="text-gray-400 mr-1.5">Net worth</span>
        <span className="font-semibold text-gray-900">${totalBalance.toLocaleString()}</span>
      </div>
    </header>
  );
}
