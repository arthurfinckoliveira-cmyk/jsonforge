# ⬢ JSONForge — JSON Formatter & Validator

> Format, validate and explore JSON **entirely in your browser**.
> No server. No database. Your data never leaves the page.

JSONForge is a developer productivity tool built end-to-end with the **Synkra AIOX**
multi-agent workflow (PM → Architect → UX → SM → PO → Dev → QA → DevOps).

## ✨ Features

- **Format** raw JSON with 2 or 4-space indentation
- **Validate** with precise error messages including **line & column**
- **Minify** to a single line
- **Tree-view** — collapsible, syntax-highlighted structure explorer
- **Stats** — keys, nodes, max depth, byte size
- **Copy** to clipboard with one click
- **History** — last 10 valid inputs persisted in `localStorage`
- **100% client-side** — works offline, sends nothing to any server

## 🧱 Stack

| Layer | Choice |
|-------|--------|
| Build | Vite 5 |
| UI | React 18 + TypeScript |
| Styling | Plain CSS + CSS custom properties (no Tailwind — zero deploy risk) |
| Parsing | Native `JSON.parse` + custom error locator |
| Persistence | `localStorage` |
| Tests | Vitest |
| Deploy | Vercel (static) |

## 🚀 Getting Started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run test     # run unit tests (Vitest)
npm run build    # produce static dist/
npm run preview  # preview the production build
```

## 📦 Deploy (Vercel)

The project builds to a static `dist/` directory. Vercel auto-detects Vite.

```bash
npx vercel --prod
```

No environment variables, no serverless functions, no database.

## 📁 Project Structure

```
src/
├── lib/             # pure domain logic (parse, stats, history) — fully tested
│   └── __tests__/
├── components/      # React UI components
├── App.tsx          # state orchestration & layout
└── index.css        # design tokens + responsive layout
docs/                # AIOX artifacts (PRD, architecture, UX spec, stories)
AIOX-LOG.md          # full multi-agent build log
```

## 🤖 Built with AIOX

See [`AIOX-LOG.md`](./AIOX-LOG.md) for the full agent-by-agent build log, and the
[`docs/`](./docs/) folder for the PRD, architecture decision record, UX spec and story.

## License

MIT
