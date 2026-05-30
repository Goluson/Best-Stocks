import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import OverviewPage from './pages/OverviewPage';
import TransactionsPage from './pages/TransactionsPage';
import MarketsPage from './pages/MarketsPage';
import LiveFeedProvider from './components/LiveFeedProvider';
import AlertToast from './components/ui/AlertToast';

export type Page = 'overview' | 'transactions' | 'budgets' | 'markets';

export default function App() {
  const [page, setPage] = useState<Page>('overview');

  return (
    <>
      <LiveFeedProvider />
      <AlertToast />

      <div className="flex h-screen overflow-hidden">
        <Sidebar activePage={page} onNavigate={setPage} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            {page === 'overview'     && <OverviewPage />}
            {page === 'transactions' && <TransactionsPage />}
            {page === 'budgets'      && <div className="text-gray-400 text-sm">Budgets — Phase 3</div>}
            {page === 'markets'      && <MarketsPage />}
          </main>
        </div>
      </div>
    </>
  );
}
