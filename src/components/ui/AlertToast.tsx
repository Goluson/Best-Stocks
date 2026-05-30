import { useEffect } from 'react';
import { useFinanceStore, type Alert } from '../../store/useFinanceStore';

function Toast({ alert }: { alert: Alert }) {
  const dismiss = useFinanceStore(s => s.dismissAlert);

  useEffect(() => {
    const t = setTimeout(() => dismiss(alert.id), 5000);
    return () => clearTimeout(t);
  }, [alert.id, dismiss]);

  const isExpense = alert.type === 'expense';

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm shadow-lg
      bg-white animate-in slide-in-from-right-4 duration-300
      ${isExpense ? 'border-red-200' : 'border-amber-200'}`}
    >
      <span className="text-base mt-0.5">{isExpense ? '⚠️' : '📈'}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 leading-snug">{alert.message}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(alert.timestamp).toLocaleTimeString()}
        </p>
      </div>
      <button
        onClick={() => dismiss(alert.id)}
        className="text-gray-300 hover:text-gray-500 mt-0.5 shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

export default function AlertToast() {
  const alerts = useFinanceStore(s => s.alerts);
  if (!alerts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
      {alerts.slice(-4).map(a => <Toast key={a.id} alert={a} />)}
    </div>
  );
}
