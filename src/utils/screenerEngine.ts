import { Stock, ScreenerCriteria, EvaluationResult, CriteriaResult, InvestmentVerdict } from '../types/stock';

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

export function determineInvestmentVerdict(
  stock: Stock,
  score: number,
  totalCriteria: number,
  failedCriteria: CriteriaResult[]
): InvestmentVerdict {
  if (score === totalCriteria) {
    return {
      status: 'BEST_FOR_INVESTING',
      badgeText: 'GOOD TO INVEST',
      recommendation: 'GOOD TO INVEST',
      verdictTagline: '🟢 Excellent Compounder — 11/11 Strict Fundamental Rules Passed',
      title: 'Top-Decile Compounder — Highly Recommended for Investing',
      summary: `${stock.symbol} satisfies all 11 strict fundamental criteria. It combines strong top-line sales growth (${stock.salesGrowth3to5Yr}%), high ROE (${stock.roe}%), pristine balance sheet (D/E ${stock.debtToEquity}), and positive free cash flows.`,
      keyStrengths: [
        `Outstanding Capital Efficiency: ROIC of ${stock.roic}% generating a +${stock.roicWaccSpread}% EVA spread over WACC.`,
        `High Cash Generation: FCF conversion ratio of ${stock.fcfConversionRatio}% ensures profits translate into real liquid cash.`,
        `Healthy Solvency: Ultra-low Debt to Equity of ${stock.debtToEquity} with ${stock.interestCoverage}x interest coverage.`,
      ],
      keyRisks: [
        'Macro-economic slow down or broad market multiple contraction.',
        'Slight growth deceleration if high base effect kicks in.',
      ],
    };
  } else if (score >= 9) {
    return {
      status: 'POTENTIAL_MONITOR',
      badgeText: 'MONITOR ONLY',
      recommendation: 'MONITOR ONLY',
      verdictTagline: '🟡 Quality Business with Minor Bottleneck — Add to Watchlist Only',
      title: 'Quality Business with Minor Bottleneck (Monitor for Entry)',
      summary: `${stock.symbol} passed ${score} of 11 conditions. It has solid market standing and capital strength, but missed on: ${failedCriteria.map(f => f.label).join(', ')}.`,
      keyStrengths: [
        `Strong operational franchise with ${stock.roe}% Return on Equity.`,
        `Healthy interest coverage of ${stock.interestCoverage}x.`,
      ],
      keyRisks: failedCriteria.map(
        (f) => `Criteria Bottleneck: ${f.label} is currently ${f.actual} (Target: ${f.target}).`
      ),
    };
  } else {
    return {
      status: 'NOT_RECOMMENDED',
      badgeText: 'NOT GOOD TO INVEST',
      recommendation: 'NOT GOOD TO INVEST',
      verdictTagline: '🔴 Avoid: High Risk — Fails Core Fundamental Solvency Benchmarks',
      title: 'Not Recommended for Value Investing (Elevated Risk)',
      summary: `${stock.symbol} failed ${failedCriteria.length} criteria. It currently does not qualify as a "Best Stock" due to elevated leverage, weak cash flow conversion, or sub-par return on invested capital.`,
      keyStrengths: stock.reasonsToInvest.slice(0, 2),
      keyRisks: failedCriteria.slice(0, 3).map(
        (f) => `Failed ${f.label}: Actual is ${f.actual} vs required ${f.target}.`
      ),
    };
  }
}

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
  const verdict = determineInvestmentVerdict(stock, score, criteriaResults.length, failedCriteria);

  return {
    stock,
    meetsAll,
    score,
    totalCriteria: criteriaResults.length,
    scorePercent: Math.round((score / criteriaResults.length) * 100),
    criteriaResults,
    failedCriteria,
    verdict,
  };
}
