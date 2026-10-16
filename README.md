# BestStocks AI — Institutional Stock Screener & Live Index Analysis

An institutional-grade stock screener built for Indian equity markets (NSE & BSE). It evaluates companies against **11 strict fundamental criteria** (Sales Growth, ROE, FCF, ROIC, PEG, low leverage, etc.) across 22 major market and sectoral indices.

![BestStocks Preview](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

### 1. 22 Indian Market & Sectoral Indices
Organized into clean, uncluttered categories:
- **Broad Market**: `NIFTY 50`, `SENSEX`, `NIFTY 100`, `BSE 100`, `ALL NIFTY`
- **Banking & Finance**: `BANK NIFTY`, `NIFTY PRIVATE BANK`, `NIFTY PSU BANK`, `BANKEX`, `FIN NIFTY`
- **Sectoral**: `NIFTY AUTO`, `NIFTY FMCG`, `NIFTY METAL`, `NIFTY REALTY`, `NIFTY COMMODITIES`, `NIFTY IT`, `NIFTY PHARMA`
- **Mid & Small Cap**: `NIFTY MID CAP SELECT`, `NIFTY MID CAP 150`, `NIFTY SMALL CAP`, `BSE MID CAP`, `BSE SMALL CAP`

### 2. Rule-Based Screening Engine (11 Strict Criteria)
1. **Sales Growth (3-5 Years)**: `> 15% - 30%`
2. **Net Profit Growth (3 Years)**: `> 15%`
3. **PEG Ratio**: `< 1.5`
4. **Return on Equity (ROE)**: `> 15% - 20%+`
5. **Debt to Equity (D/E)**: `< 0.5` (or industry norm)
6. **Free Cash Flow (FCF)**: Positive & Growing (`FCF > 0`, `YoY > 0%`)
7. **ROIC**: `> 15%`
8. **FCF Conversion Ratio**: `> 80%` (FCF / Net Profit)
9. **ROIC vs. WACC Spread**: `> 5%`
10. **Interest Coverage Ratio**: `> 5x`
11. **3-Year Revenue CAGR**: `> 10%`

### 3. Investment Verdict & Analysis on Any Listed Stock
- Search across all listed Indian stocks in the top navbar.
- Real-time live prices with instant quality badges in autocomplete.
- Click any stock to open the **AI & Fundamental Investment Verdict**:
  - 🟢 **BEST FOR INVESTING**: 11/11 criteria met, high compounding quality.
  - 🟡 **GOOD CANDIDATE / MONITOR**: 9–10 criteria met, highlighting specific bottlenecks.
  - 🔴 **NOT RECOMMENDED**: Fails core solvency or profitability benchmarks.
  - Detailed breakdown of **Key Strengths**, **Risks**, **11-Point Scorecard Table**, and **5-Year Revenue & FCF Charts**.

### 4. Simple Sign In & Watchlist
- One-click Guest/Demo Investor login or email login.
- Persistent watchlist tracking.

---

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS with custom dark mode & glassmorphism
- **State Management**: Zustand
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React

---

## 🛠️ Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
