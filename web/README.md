# 📅 Shift Manager — React Frontend

React + Tailwind + shadcn/ui frontend for Shift Manager.
Connects to existing Cloudflare Workers API backend.

## Architecture

```
shift-manager-web/          ← React (Cloudflare Pages)
  src/
    components/
      layout/               ← AppLayout (sidebar, header)
      calendar/             ← Calendar components
      shared/               ← Toast, Modal, etc.
    hooks/                  ← useAuth, useToast
    lib/                    ← api.js, constants.js, utils.js
    pages/                  ← CalendarPage, StatsPage, etc.
    styles/                 ← globals.css (Tailwind)

shift-manager/              ← Workers API (existing)
  index.js                  ← Router + Auth
  api.js                    ← API endpoints
  frontend.js               ← Legacy frontend (still works)
```

## Migration Plan

| Phase | Status | Pages |
|-------|--------|-------|
| 1 | ✅ | Layout + Login + Calendar |
| 2 | 🔲 | Calendar modals (Day, Leave, Swap) |
| 3 | 🔲 | Stats + Achievement Board |
| 4 | 🔲 | Pending + KPI + History + Wallet |
| 5 | 🔲 | All Modals + Settings |

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Deploy

```bash
npm run deploy   # → Cloudflare Pages
```
