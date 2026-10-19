import React from 'react';
import { EvaluationResult } from '../../types/stock';
import { useStockStore } from '../../store/useStockStore';
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Bookmark, 
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface StockCardProps {
  evaluation: EvaluationResult;
  onSelect: () => void;
}

export default function StockCard({ evaluation, onSelect }: StockCardProps) {
  const { stock, score, totalCriteria, meetsAll, criteriaResults, verdict } = evaluation;
  const { watchlist, toggleWatchlist } = useStockStore();

  const isBookmarked = watchlist.includes(stock.symbol);
  const isPositive = stock.change >= 0;

  return (
    <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Header Card Info */}
      <div className="p-5">
        
        {/* Verdict Banner on Card */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1 ${
              verdict.status === 'BEST_FOR_INVESTING'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 ring-1 ring-emerald-500/20'
                : verdict.status === 'POTENTIAL_MONITOR'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
            }`}
          >
            {verdict.status === 'BEST_FOR_INVESTING' ? (
              <Sparkles className="w-3 h-3" />
            ) : (
              <Activity className="w-3 h-3" />
            )}
            <span>{verdict.badgeText}</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">
              {score}/{totalCriteria} Rules
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(stock.symbol);
              }}
              title={isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Company Identity */}
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
              {stock.symbol}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80">
              {stock.sector}
            </span>
          </div>
          <h3 className="text-xs text-slate-400 font-medium line-clamp-1">
            {stock.name}
          </h3>
        </div>

        {/* Live Price Row */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Live NSE/BSE Price
            </div>
            <div className="text-xl font-bold text-white tracking-tight flex items-baseline gap-2">
              <span>₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              <span
                className={`text-xs font-semibold flex items-center ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Mini Sparkline Chart */}
          <div className="w-24 h-9 flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 35">
              <path
                d={`M ${stock.sparkline
                  .map((val, idx) => {
                    const min = Math.min(...stock.sparkline);
                    const max = Math.max(...stock.sparkline);
                    const range = max - min || 1;
                    const x = (idx / (stock.sparkline.length - 1)) * 100;
                    const y = 35 - ((val - min) / range) * 30;
                    return `${x},${y}`;
                  })
                  .join(' L ')}`}
                fill="none"
                stroke={isPositive ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* 11 Criteria Snapshot Grid */}
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Fundamental Check</span>
            <span className="text-emerald-400 text-[10px]">11 Rules Verified</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {criteriaResults.slice(0, 4).map((c) => (
              <div
                key={c.key}
                className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 flex items-center justify-between"
              >
                <div className="truncate mr-1">
                  <div className="text-[10px] text-slate-400 truncate">{c.label}</div>
                  <div className="font-semibold text-slate-200">{c.actual}</div>
                </div>
                {c.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            {criteriaResults.slice(4, 8).map((c) => (
              <div
                key={c.key}
                className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 flex items-center justify-between"
              >
                <div className="truncate mr-1">
                  <div className="text-[10px] text-slate-400 truncate">{c.label}</div>
                  <div className="font-semibold text-slate-200">{c.actual}</div>
                </div>
                {c.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
        <div className="text-[11px] text-slate-400">
          M-Cap: <span className="text-white font-medium">{stock.marketCap}</span>
        </div>
        <button
          onClick={onSelect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all group-hover:scale-105"
        >
          <span>Analyze Investment</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
