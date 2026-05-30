import type { Page } from '../../App';

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'overview',     label: 'Overview',     icon: '▦' },
  { id: 'transactions', label: 'Transactions', icon: '↕' },
  { id: 'budgets',      label: 'Budgets',      icon: '◎' },
  { id: 'markets',      label: 'Markets',      icon: '↗' },
];

interface Props {
  activePage: Page;
  onNavigate: (p: Page) => void;
}

export default function Sidebar({ activePage, onNavigate }: Props) {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white flex flex-col py-6 px-3">
      <div className="px-3 mb-8">
        <span className="text-base font-semibold tracking-tight">FinanceOS</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left
              ${activePage === id
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-3">
        <div className="flex items-center gap-2 py-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center">
            JD
          </div>
          <div>
            <p className="text-xs font-medium text-gray-800">John Doe</p>
            <p className="text-xs text-gray-400">Pro plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
