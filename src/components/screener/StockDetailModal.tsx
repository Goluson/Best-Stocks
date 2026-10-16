import React, { useState } from 'react';
import { useStockStore } from '../../store/useStockStore';
import { evaluateStock } from '../../utils/screenerEngine';
import { 
  X, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  ShieldCheck, 
  BarChart3, 
  Activity, 
  Sparkles,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';

export default function StockDetailModal() {
  const { 
    selectedStockForDetail, 
    setSelectedStockForDetail, 
    criteria, 
    currentUser, 
    toggleWatchlist,
    lastTickTime
  } = useStockStore();

  const [activeTab, setActiveTab] = useState<'verdict' | 'scorecard' | 'financials' | 'thesis'>('verdict');

  if (!selectedStockForDetail) return null;

  const stock = selectedStockForDetail;
  const evaluation = evaluateStock(stock, criteria);
  const verdict = evaluation.verdict;
  const isBookmarked = currentUser?.watchlist.includes(stock.symbol) || false;
  const isPositive = stock.change >= 0;

  const sparklineData = stock.sparkline.map((price, idx) => ({
    time: `T-${stock.sparkline.length - idx}m`,
    price,
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-emerald-500/20">
              {stock.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">{stock.symbol}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {stock.sector}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  {stock.rating}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">{stock.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWatchlist(stock.symbol)}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Add to Watchlist"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => setSelectedStockForDetail(null)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Price Streaming Banner */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                NSE/BSE Live Price
              </span>
              <span className="text-[10px] text-slate-500 font-mono">({lastTickTime})</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white tracking-tight">
                ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <div
                className={`text-sm font-bold flex items-center gap-1 ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
                <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-300">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">24h High / Low</div>
              <div className="font-semibold text-white">₹{stock.dayHigh} / ₹{stock.dayLow}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">52W High / Low</div>
              <div className="font-semibold text-white">₹{stock.high52w} / ₹{stock.low52w}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">P/E Ratio</div>
              <div className="font-semibold text-white">{stock.peRatio}x</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Market Cap</div>
              <div className="font-semibold text-white">{stock.marketCap}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-slate-900 border-b border-slate-800 flex items-center gap-6 text-xs font-semibold shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('verdict')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'verdict'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Investment Verdict ({verdict.badgeText})</span>
          </button>

          <button
            onClick={() => setActiveTab('scorecard')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'scorecard'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>11 Criteria Scorecard ({evaluation.score}/{evaluation.totalCriteria})</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'financials'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>5-Year Revenue &amp; FCF Trends</span>
          </button>

          <button
            onClick={() => setActiveTab('thesis')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'thesis'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Business Profile &amp; Thesis</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: THE CORE INVESTMENT VERDICT (Is it Best for Investing or Not?) */}
          {activeTab === 'verdict' && (
            <div className="space-y-6">
              
              {/* Giant Decisive Verdict Banner */}
              <div
                className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  verdict.status === 'BEST_FOR_INVESTING'
                    ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border-emerald-500/50 text-emerald-100'
                    : verdict.status === 'POTENTIAL_MONITOR'
                    ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border-amber-500/50 text-amber-100'
                    : 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/40 border-rose-500/50 text-rose-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                      verdict.status === 'BEST_FOR_INVESTING'
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                        : verdict.status === 'POTENTIAL_MONITOR'
                        ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                        : 'bg-rose-500 text-slate-950 shadow-rose-500/30'
                    }`}
                  >
                    {verdict.status === 'BEST_FOR_INVESTING' ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : verdict.status === 'POTENTIAL_MONITOR' ? (
                      <Activity className="w-8 h-8" />
                    ) : (
                      <AlertTriangle className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          verdict.status === 'BEST_FOR_INVESTING'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : verdict.status === 'POTENTIAL_MONITOR'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {verdict.badgeText}
                      </span>
                      <span className="text-xs text-slate-400">Score: {evaluation.score}/11 Passed</span>
                    </div>
                    <h3 className="text-xl font-black text-white">{verdict.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
                      {verdict.summary}
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
                  <div className="text-3xl font-black text-white">{evaluation.scorePercent}%</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Quality Rating
                  </div>
                  <div className="text-xs text-emerald-400 font-bold mt-1">
                    {evaluation.meetsAll ? 'Zero Flaws Detected' : `${evaluation.failedCriteria.length} Rule Warnings`}
                  </div>
                </div>
              </div>

              {/* Strengths & Risks Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Strengths */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Key Investment Strengths
                  </h4>
                  <ul className="space-y-2.5">
                    {verdict.keyStrengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks / Missed Rules */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Bottlenecks &amp; Considerations
                  </h4>
                  <ul className="space-y-2.5">
                    {verdict.keyRisks.map((risk, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Live Intraday Sparkline */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Intraday Live Price Streaming Trend
                </h4>
                <div className="h-44 w-full bg-slate-950/80 rounded-2xl border border-slate-800/80 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData}>
                      <defs>
                        <linearGradient id="colorPriceV" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isPositive ? '#10b981' : '#f43f5e'}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPriceV)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: 11 CRITERIA SCORECARD */}
          {activeTab === 'scorecard' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60">
                <table className="w-full text-left text-xs divide-y divide-slate-800">
                  <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Investment Condition</th>
                      <th className="py-3 px-4">Required Target</th>
                      <th className="py-3 px-4">Company Actual</th>
                      <th className="py-3 px-4 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {evaluation.criteriaResults.map((c) => (
                      <tr key={c.key} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                          {c.label}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono">{c.target}</td>
                        <td className="py-3 px-4 font-bold text-white font-mono">{c.actual}</td>
                        <td className="py-3 px-4 text-right">
                          {c.passed ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                              <CheckCircle2 className="w-3 h-3" /> Met
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/50">
                              <XCircle className="w-3 h-3" /> Failed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  5-Year Revenue, Net Profit &amp; Free Cash Flow (₹ Cr)
                </h4>
                <div className="h-64 w-full bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stock.financialHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="revenueCr" name="Revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="netProfitCr" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="fcfCr" name="Free Cash Flow" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Ratios & Return Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">ROIC</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{stock.roic}%</div>
                  <div className="text-[10px] text-slate-500">WACC: {stock.wacc}%</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">ROE</div>
                  <div className="text-lg font-bold text-white mt-1">{stock.roe}%</div>
                  <div className="text-[10px] text-slate-500">Return on Equity</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">FCF Conversion</div>
                  <div className="text-lg font-bold text-purple-400 mt-1">{stock.fcfConversionRatio}%</div>
                  <div className="text-[10px] text-slate-500">FCF / Net Profit</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Debt to Equity</div>
                  <div className="text-lg font-bold text-white mt-1">{stock.debtToEquity}</div>
                  <div className="text-[10px] text-slate-500">Interest Cov: {stock.interestCoverage}x</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: THESIS */}
          {activeTab === 'thesis' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Company Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {stock.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Core Growth Catalysts &amp; Value Drivers
                </h4>
                <div className="space-y-2">
                  {stock.reasonsToInvest.map((reason, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-slate-200 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Tracked Indices: <span className="text-white font-medium">{stock.indices.join(', ')}</span>
          </div>
          <button
            onClick={() => setSelectedStockForDetail(null)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            Close Analysis
          </button>
        </div>

      </div>
    </div>
  );
}
