# Network Toolkit

A personal network utility web app for IT infrastructure professionals.
Built with React + TypeScript + MUI. Runs entirely in the browser (except Port Checker which needs a backend).

## Features

- **IP Lookup** — get geolocation & ISP info for any IP
- **DNS Lookup** — query A, MX, CNAME records for any domain
- **Subnet Calculator** — calculate hosts, range from CIDR notation
- **Port Checker** — check if a port is open (requires backend)
- **History** — view & export past lookups as CSV

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript + Vite 8 |
| UI | Material UI (MUI) v7 |
| Routing | React Router v7 |
| Testing | Vitest + Testing Library |
| Backend | Express 5 (port checker only) |
| Hosting | Vercel (free) |

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run
```bash
git clone https://github.com/YOUR_USERNAME/network-toolkit.git
cd network-toolkit
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Backend (for Port Checker)
```bash
npm run dev:server
```

### Commands
```bash
npm run dev          # start dev server (localhost:5173)
npm run dev:server   # start backend (localhost:3001)
npm run dev:all      # start both frontend + backend
npm run build        # build for production
npm run lint         # check code style
npm run test         # run tests
npm run test:watch   # run tests in watch mode
```

## Project Structure
```
src/
├── components/    # Reusable UI components
├── context/       # React contexts (color mode)
├── pages/         # One component per route
├── hooks/         # Custom React hooks
├── utils/         # Pure functions (no UI)
└── App.tsx        # Routes + theme + lazy loading
server/
└── index.ts       # Express backend for port checker
```

## Roadmap
- [x] Phase 1 — Project setup & layout
- [x] Phase 2 — IP Lookup
- [x] Phase 3 — DNS Lookup
- [x] Phase 4 — Subnet Calculator
- [x] Phase 5 — Port Checker (backend)
- [x] Phase 6 — History & Export

## License
MIT
