import React from 'react';
import { useStockStore } from '../../store/useStockStore';
import { 
  X, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  Percent, 
  DollarSign, 
  Activity, 
  Info,
  Scale
} from 'lucide-react';

export default function CriteriaPanel() {
  const { 
    criteria, 
    updateCriteria, 
    resetCriteria, 
    isCriteriaDrawerOpen, 
    toggleCriteriaDrawer 
  } = useStockStore();

  if (!isCriteriaDrawerOpen) return null;

  return (
    <div className="bg-slate-900/90 border-b border-emerald-500/30 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                11 Strict Investment Rules Engine
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-normal">
                  Customizable Screener
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Only companies passing all 11 conditions qualify as a "Best Stock"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetCriteria}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={toggleCriteriaDrawer}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 11 Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          
          {/* 1. Sales Growth 3-5Y */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">1. Sales Growth (3-5Y)</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                &gt; {criteria.salesGrowthMin}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Targeting sustainable compounding between 15% – 30%</p>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={criteria.salesGrowthMin}
              onChange={(e) => updateCriteria({ salesGrowthMin: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 2. Net Profit Growth 3Y */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">2. Net Profit Growth (3Y)</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                &gt; {criteria.netProfitGrowth3YrMin}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Ensures earnings expand faster than inflation</p>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={criteria.netProfitGrowth3YrMin}
              onChange={(e) => updateCriteria({ netProfitGrowth3YrMin: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 3. PEG Ratio */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">3. PEG Ratio</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                &lt; {criteria.pegRatioMax}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Price-to-Earnings growth valuation safety margin</p>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              value={criteria.pegRatioMax}
              onChange={(e) => updateCriteria({ pegRatioMax: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 4. Return on Equity (ROE) */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">4. Return on Equity (ROE)</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                &gt; {criteria.roeMin}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Capital efficiency on shareholder equity (15-20%+)</p>
            <input
              type="range"
              min="12"
              max="25"
              step="1"
              value={criteria.roeMin}
              onChange={(e) => updateCriteria({ roeMin: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 5. Debt to Equity */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">5. Debt to Equity (D/E)</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                &lt; {criteria.debtToEquityMax}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Conservative balance sheet / low leverage norm</p>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={criteria.debtToEquityMax}
              onChange={(e) => updateCriteria({ debtToEquityMax: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 6. Free Cash Flow Positive & Growing */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">6. Free Cash Flow (FCF)</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Positive & Growing
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Guarantees real cash generation, not paper profits</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded">
                <Check className="w-3 h-3" /> FCF &gt; 0 and YoY &gt; 0%
              </span>
            </div>
          </div>

          {/* 7. ROIC */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">7. Return on Invested Capital</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                &gt; {criteria.roicMin}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Measures return generated on total capital deployed</p>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={criteria.roicMin}
              onChange={(e) => updateCriteria({ roicMin: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 8. FCF Conversion Ratio */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">8. FCF Conversion Ratio</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                &gt; {criteria.fcfConversionRatioMin}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">FCF / Net Profit conversion quality threshold</p>
            <input
              type="range"
              min="60"
              max="90"
              step="5"
              value={criteria.fcfConversionRatioMin}
              onChange={(e) => updateCriteria({ fcfConversionRatioMin: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 9. ROIC vs WACC Spread */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">9. ROIC vs WACC Spread</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                &gt; {criteria.roicWaccSpreadMin}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Economic Value Added (EVA) spread over cost of capital</p>
            <input
              type="range"
              min="2"
              max="15"
              step="1"
              value={criteria.roicWaccSpreadMin}
              onChange={(e) => updateCriteria({ roicWaccSpreadMin: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 10. Interest Coverage Ratio */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">10. Interest Coverage Ratio</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                &gt; {criteria.interestCoverageMin}x
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Operating profit ability to service debt obligations</p>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={criteria.interestCoverageMin}
              onChange={(e) => updateCriteria({ interestCoverageMin: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 11. 3-Year Revenue CAGR */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-200">11. 3-Year Revenue CAGR</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                &gt; {criteria.revenueCAGR3YrMin}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Consistent compound top-line revenue velocity</p>
            <input
              type="range"
              min="8"
              max="20"
              step="1"
              value={criteria.revenueCAGR3YrMin}
              onChange={(e) => updateCriteria({ revenueCAGR3YrMin: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
