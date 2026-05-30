import { useState, useMemo, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Transaction, TransactionCategory } from '../../types/finance';
import Badge from '../ui/Badge';
import Card  from '../ui/Card';
import { useDebounce } from '../../hooks/useDebounce';

const CATEGORY_VARIANT: Record<TransactionCategory, 'green'|'red'|'amber'|'gray'|'indigo'> = {
  income: 'green', food: 'amber', transport: 'indigo',
  housing: 'red', entertainment: 'gray', healthcare: 'green',
  shopping: 'amber', other: 'gray',
};

const ROW_HEIGHT = 52;
const VISIBLE_ROWS = 12;

interface Props { transactions: Transaction[]; }

export default function TransactionsTable({ transactions }: Props) {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState<TransactionCategory | 'all'>('all');

  const debounceSearch = useDebounce(search, 250);

  const scrollRef   = useRef<HTMLDivElement>(null);

  const categories: (TransactionCategory | 'all')[] = [
    'all','food','transport','housing','entertainment',
    'healthcare','shopping','income','other',
  ];

  const filtered = useMemo(() =>
    transactions.filter(tx => {
      const matchSearch = tx.description.toLowerCase().includes(debounceSearch.toLowerCase());
      const matchCat    = category === 'all' || tx.category === category;
      return matchSearch && matchCat;
    }),
  [transactions, debounceSearch, category]);

  const virtualizer = useVirtualizer({
    count:           filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize:    () => ROW_HEIGHT,
    overscan:        5,
  });

  const virtualItems  = virtualizer.getVirtualItems();
  const totalHeight   = virtualizer.getTotalSize();

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search transactions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none
                     focus:border-gray-400 bg-gray-50"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value as TransactionCategory | 'all')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50
                     outline-none focus:border-gray-400 capitalize"
        >
          {categories.map(c => (
            <option key={c} value={c} className="capitalize">{c}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400 whitespace-nowrap">{filtered.length} results</span>
      </div>

      <table className="w-full text-sm table-fixed">
        <colgroup>
          <col className="w-24" />
          <col />
          <col className="w-32" />
          <col className="w-28" />
        </colgroup>
        <thead>
          <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
            <th className="text-left px-5 py-3 font-medium">Date</th>
            <th className="text-left px-5 py-3 font-medium">Description</th>
            <th className="text-left px-5 py-3 font-medium">Category</th>
            <th className="text-right px-5 py-3 font-medium">Amount</th>
          </tr>
        </thead>
      </table>

      <div
        ref={scrollRef}
        style={{ height: ROW_HEIGHT * VISIBLE_ROWS, overflowY: 'auto' }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {virtualItems.map(vItem => {
            const tx = filtered[vItem.index];
            return (
              <div
                key={tx.id}
                style={{
                  position:  'absolute',
                  top:       vItem.start,
                  left:      0,
                  right:     0,
                  height:    ROW_HEIGHT,
                }}
                className="flex items-center border-b border-gray-50 hover:bg-gray-50 transition-colors text-sm"
              >
                <div className="w-24 px-5 text-gray-400 whitespace-nowrap shrink-0">
                  {new Date(tx.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
                </div>
                <div className="flex-1 px-5 text-gray-800 font-medium truncate">
                  {tx.description}
                </div>
                <div className="w-32 px-5 shrink-0">
                  <Badge label={tx.category} variant={CATEGORY_VARIANT[tx.category]} />
                </div>
                <div className={`w-28 px-5 text-right font-medium tabular-nums shrink-0
                  ${tx.amount >= 0 ? 'text-green-600' : 'text-gray-800'}`}
                >
                  {tx.amount >= 0 ? '+' : '−'}${Math.abs(tx.amount).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">{filtered.length} transactions · virtualized</span>
        <span className="text-xs text-gray-300">{virtualItems.length} rows in DOM</span>
      </div>
    </Card>
  );
}
