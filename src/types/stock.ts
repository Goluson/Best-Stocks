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
  | 'BSE SMALL CAP';

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
  salesGrowth3to5Yr: number; // e.g. 21.5%
  netProfitGrowth3Yr: number; // e.g. 24.2%
  pegRatio: number; // e.g. 1.15
  roe: number; // e.g. 28.4%
  debtToEquity: number; // e.g. 0.08
  fcfPositive: boolean; // e.g. true
  fcfGrowth: number; // e.g. 18.2%
  fcfAmountCr: number; // e.g. 14500
  roic: number; // e.g. 26.5%
  wacc: number; // e.g. 10.5%
  roicWaccSpread: number; // e.g. 16.0% (ROIC - WACC)
  fcfConversionRatio: number; // e.g. 88.5% (FCF / Net Profit)
  interestCoverage: number; // e.g. 24.5x
  revenueCAGR3Yr: number; // e.g. 16.8%

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

export interface EvaluationResult {
  stock: Stock;
  meetsAll: boolean;
  score: number; // e.g. 11
  totalCriteria: number; // e.g. 11
  scorePercent: number;
  criteriaResults: CriteriaResult[];
  failedCriteria: CriteriaResult[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  watchlist: string[]; // stock symbols
}
