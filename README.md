# Finance Dashboard
-What's done, in simple words with an example — the heartbeat-style price ticks, the mock transaction feed, and the alert system, explained with a concrete walk-through scenario.
-What's different in how you used each tool — a table comparing the "textbook" use of React, Zustand, TanStack Virtual, Recharts, custom hooks, and TypeScript against how you actually used them
-Most-used technology, deep dive — React by file count, but I focused the deep-dive on Zustand since that's where the real logic lives (budget recalculation, alert generation, balance updates)
-Cross-questions — 8 realistic interviewer questions with prepared, honest answers, including the two riskiest ones: the unused react-query dependency and the month-boundary limitation in recalcBudgets.
Local dev instructions:

1. Install Node.js (v18+ recommended). npm is included with Node.
2. From project root:

```bash
cd "d:\finanve demo"
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

Notes:
- Live data is simulated via `src/mock/*`.
- State is managed with Zustand in `src/store/useFinanceStore.ts`.
- If you get a "command not found" error for `npm`, install Node.js and reopen the terminal.

