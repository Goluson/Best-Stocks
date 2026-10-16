export type StockIndex =
  | 'NIFTY 50'
  | 'SENSEX'
  | 'NIFTY 100'
  | 'BANK NIFTY'
  | 'ALL NIFTY'
  | 'NIFTY PHARMA'
  | 'NIFTY IT'
  | 'BSE 100'
  | 'BSE MID CAP'
  | 'BSE SMALL CAP'
  // Newly Added Indices
  | 'NIFTY METAL'
  | 'NIFTY PRIVATE BANK'
  | 'BANKEX'
  | 'NIFTY MID CAP SELECT'
  | 'NIFTY MID CAP 150'
  | 'NIFTY SMALL CAP'
  | 'FIN NIFTY'
  | 'NIFTY AUTO'
  | 'NIFTY FMCG'
  | 'NIFTY PSU BANK'
  | 'NIFTY REALTY'
  | 'NIFTY COMMODITIES';

export type IndexCategory = 'Broad Market' | 'Banking & Finance' | 'Sectoral' | 'Mid & Small Cap';

export interface IndexMeta {
  name: StockIndex;
  category: IndexCategory;
  description: string;
  countHint: string;
}

export interface ScreenerCriteria {
  salesGrowthMin: number; // e.g. 15%
  salesGrowthMax: number; // e.g. 30%
  netProfitGrowth3YrMin: number; // e.g. 15%
  pegRatioMax: number; // e.g. 1.5
  roeMin: number; // e.g. 15% or 20%
  debtToEquityMax: number; // e.g. 0.5
  fcfPositiveAndGrowing: boolean; // true
  roicMin: number; // e.g. 15%
  fcfConversionRatioMin: number; // e.g. 80%
  roicWaccSpreadMin: number; // e.g. 5%
  interestCoverageMin: number; // e.g. 5x
  revenueCAGR3YrMin: number; // e.g. 10%
}

export interface StockFinancialYear {
  year: string;
  revenueCr: number;
  netProfitCr: number;
  fcfCr: number;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  indices: StockIndex[];
  currentPrice: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: string;
  marketCap: string;
  peRatio: number;
  pbRatio: number;
  divYield: number;
  high52w: number;
  low52w: number;
  sparkline: number[];
  
  // 11 Core Best Stocks Screener Criteria
  salesGrowth3to5Yr: number;
  netProfitGrowth3Yr: number;
  pegRatio: number;
  roe: number;
  debtToEquity: number;
  fcfPositive: boolean;
  fcfGrowth: number;
  fcfAmountCr: number;
  roic: number;
  wacc: number;
  roicWaccSpread: number;
  fcfConversionRatio: number;
  interestCoverage: number;
  revenueCAGR3Yr: number;

  // Deep dive & presentation
  financialHistory: StockFinancialYear[];
  description: string;
  reasonsToInvest: string[];
  rating: 'Strong Buy' | 'Buy' | 'Accumulate' | 'Hold';
}

export interface CriteriaResult {
  key: keyof ScreenerCriteria | string;
  label: string;
  target: string;
  actual: string;
  passed: boolean;
  value: number | boolean;
}

export type VerdictStatus = 'BEST_FOR_INVESTING' | 'POTENTIAL_MONITOR' | 'NOT_RECOMMENDED';

export interface InvestmentVerdict {
  status: VerdictStatus;
  badgeText: string;
  title: string;
  summary: string;
  keyStrengths: string[];
  keyRisks: string[];
}

export interface EvaluationResult {
  stock: Stock;
  meetsAll: boolean;
  score: number;
  totalCriteria: number;
  scorePercent: number;
  criteriaResults: CriteriaResult[];
  failedCriteria: CriteriaResult[];
  verdict: InvestmentVerdict;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  watchlist: string[];
}
