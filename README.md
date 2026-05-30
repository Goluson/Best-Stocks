# Finance Dashboard

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
