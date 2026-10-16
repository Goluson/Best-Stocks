# BestStocks AI — Institutional Stock Screener & Live Index Analysis

An institutional-grade stock screener built for Indian equity markets (NSE & BSE). It evaluates companies against **11 strict fundamental criteria** (Sales Growth, ROE, FCF, ROIC, PEG, low leverage, etc.) across major market indices.

![BestStocks Preview](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

1. **Rule-Based Screening Engine (11 Strict Criteria)**:
   - **Sales Growth (3-5 Years)**: `> 15% - 30%`
   - **Net Profit Growth (3 Years)**: `> 15%`
   - **PEG Ratio**: `< 1.5`
   - **Return on Equity (ROE)**: `> 15% - 20%+`
   - **Debt to Equity (D/E)**: `< 0.5` (or industry norm)
   - **Free Cash Flow (FCF)**: Positive & Growing
   - **ROIC**: `> 15%`
   - **FCF Conversion Ratio**: `> 80%`
   - **ROIC vs. WACC Spread**: `> 5%`
   - **Interest Coverage Ratio**: `> 5x`
   - **3-Year Revenue CAGR**: `> 10%`

2. **Index Screening & Dynamic Empty State**:
   - Filter by major indices: `NIFTY 50`, `SENSEX`, `NIFTY 100`, `BANK NIFTY`, `ALL NIFTY`, `NIFTY PHARMA`, `NIFTY IT`, `BSE 100`, `BSE MID CAP`, `BSE SMALL CAP`.
   - When no stocks in an index fulfill all 11 conditions (e.g. `BANK NIFTY`), the system intelligently prompts the user to enter or select alternative indices with one-click recommendations.

3. **Live Stock Price Search & Streaming**:
   - Global search in navbar with instant autocomplete.
   - Shows live price ticking and daily fluctuations.
   - Deep-dive stock modal with 11-criteria scorecard table and 5-year financials.

4. **Simple Sign In & Watchlist**:
   - One-click Guest/Demo Investor login or email login.
   - Persistent watchlist.

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
