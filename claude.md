# Network Toolkit — Claude Context

## Project Overview
Personal network utility web app for IT infrastructure professionals.
Single-page app, browser-only, no backend (Phase 1-4), Node.js backend added in Phase 5.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript + Vite |
| UI | Material UI (MUI) v5 |
| Routing | React Router v6 |
| HTTP | fetch API (no axios) |
| Dates | date-fns |
| Hosting | Vercel (free) |

## Folder Structure
```
src/
├── components/       # Reusable UI components
├── pages/            # One file per route/page
├── hooks/            # Custom React hooks
├── utils/            # Pure functions (no UI)
├── types/            # TypeScript interfaces & types
└── constants/        # App-wide constants
```

## Commands
- `npm run dev`        — start dev server (localhost:5173)
- `npm run build`      — build for production
- `npm run preview`    — preview production build
- `npm run lint`       — check code style

## Coding Conventions
- Components: **PascalCase** (e.g. `IpLookup.tsx`)
- Files & folders: **kebab-case** (e.g. `ip-lookup/`)
- Hooks: prefix `use` (e.g. `useIpLookup.ts`)
- Types/Interfaces: prefix `I` for interfaces (e.g. `IpInfo`)
- Always use TypeScript — no `any` type
- Always handle loading & error states in UI
- Use MUI components only — no custom CSS unless necessary

## State Management
- Local component state: `useState`
- Shared UI state: React Context
- No Redux, no Zustand, no external state library

## API Calls
- Use `fetch` with `async/await`
- Always wrap in try/catch
- Show loading spinner while fetching
- Show error message on failure

## Phases
| # | Feature | Status |
|---|---------|--------|
| 1 | Project setup & layout shell | ✅ Done |
| 2 | IP Lookup | Pending |
| 3 | DNS Lookup | Pending |
| 4 | Subnet Calculator | Pending |
| 5 | Ping / Port Checker (backend) | Pending |
| 6 | History & Export | Pending |

## DO NOT
- Install Redux or any state management library
- Use `any` TypeScript type
- Write inline styles — use MUI `sx` prop instead
- Change folder structure without confirming first
- Install new npm packages without asking me first