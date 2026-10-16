import { Stock, ScreenerCriteria, EvaluationResult, CriteriaResult } from '../types/stock';

export const DEFAULT_CRITERIA: ScreenerCriteria = {
  salesGrowthMin: 15,
  salesGrowthMax: 35,
  netProfitGrowth3YrMin: 15,
  pegRatioMax: 1.5,
  roeMin: 15,
  debtToEquityMax: 0.5,
  fcfPositiveAndGrowing: true,
  roicMin: 15,
  fcfConversionRatioMin: 80,
  roicWaccSpreadMin: 5,
  interestCoverageMin: 5,
  revenueCAGR3YrMin: 10,
};

export function evaluateStock(stock: Stock, criteria: ScreenerCriteria = DEFAULT_CRITERIA): EvaluationResult {
  const criteriaResults: CriteriaResult[] = [
    {
      key: 'salesGrowth',
      label: 'Sales Growth (3-5Y)',
      target: `> ${criteria.salesGrowthMin}%`,
      actual: `${stock.salesGrowth3to5Yr.toFixed(1)}%`,
      passed: stock.salesGrowth3to5Yr >= criteria.salesGrowthMin,
      value: stock.salesGrowth3to5Yr,
    },
    {
      key: 'netProfitGrowth',
      label: 'Net Profit Growth (3Y)',
      target: `> ${criteria.netProfitGrowth3YrMin}%`,
      actual: `${stock.netProfitGrowth3Yr.toFixed(1)}%`,
      passed: stock.netProfitGrowth3Yr >= criteria.netProfitGrowth3YrMin,
      value: stock.netProfitGrowth3Yr,
    },
    {
      key: 'pegRatio',
      label: 'PEG Ratio',
      target: `< ${criteria.pegRatioMax}`,
      actual: `${stock.pegRatio.toFixed(2)}`,
      passed: stock.pegRatio <= criteria.pegRatioMax && stock.pegRatio > 0,
      value: stock.pegRatio,
    },
    {
      key: 'roe',
      label: 'Return on Equity (ROE)',
      target: `> ${criteria.roeMin}%`,
      actual: `${stock.roe.toFixed(1)}%`,
      passed: stock.roe >= criteria.roeMin,
      value: stock.roe,
    },
    {
      key: 'debtToEquity',
      label: 'Debt to Equity',
      target: `< ${criteria.debtToEquityMax}`,
      actual: `${stock.debtToEquity.toFixed(2)}`,
      passed: stock.debtToEquity <= criteria.debtToEquityMax,
      value: stock.debtToEquity,
    },
    {
      key: 'fcf',
      label: 'Free Cash Flow (FCF)',
      target: 'Positive & Growing',
      actual: stock.fcfPositive && stock.fcfGrowth > 0 ? `+${stock.fcfGrowth.toFixed(1)}% YoY` : 'Negative / Declining',
      passed: stock.fcfPositive && stock.fcfGrowth > 0,
      value: stock.fcfGrowth,
    },
    {
      key: 'roic',
      label: 'ROIC',
      target: `> ${criteria.roicMin}%`,
      actual: `${stock.roic.toFixed(1)}%`,
      passed: stock.roic >= criteria.roicMin,
      value: stock.roic,
    },
    {
      key: 'fcfConversion',
      label: 'FCF Conversion Ratio',
      target: `> ${criteria.fcfConversionRatioMin}%`,
      actual: `${stock.fcfConversionRatio.toFixed(1)}%`,
      passed: stock.fcfConversionRatio >= criteria.fcfConversionRatioMin,
      value: stock.fcfConversionRatio,
    },
    {
      key: 'roicWaccSpread',
      label: 'ROIC vs. WACC Spread',
      target: `> ${criteria.roicWaccSpreadMin}%`,
      actual: `+${stock.roicWaccSpread.toFixed(1)}%`,
      passed: stock.roicWaccSpread >= criteria.roicWaccSpreadMin,
      value: stock.roicWaccSpread,
    },
    {
      key: 'interestCoverage',
      label: 'Interest Coverage Ratio',
      target: `> ${criteria.interestCoverageMin}x`,
      actual: `${stock.interestCoverage.toFixed(1)}x`,
      passed: stock.interestCoverage >= criteria.interestCoverageMin,
      value: stock.interestCoverage,
    },
    {
      key: 'revenueCAGR',
      label: '3-Year Revenue CAGR',
      target: `> ${criteria.revenueCAGR3YrMin}%`,
      actual: `${stock.revenueCAGR3Yr.toFixed(1)}%`,
      passed: stock.revenueCAGR3Yr >= criteria.revenueCAGR3YrMin,
      value: stock.revenueCAGR3Yr,
    },
  ];

  const failedCriteria = criteriaResults.filter(c => !c.passed);
  const score = criteriaResults.length - failedCriteria.length;
  const meetsAll = failedCriteria.length === 0;

  return {
    stock,
    meetsAll,
    score,
    totalCriteria: criteriaResults.length,
    scorePercent: Math.round((score / criteriaResults.length) * 100),
    criteriaResults,
    failedCriteria,
  };
}
