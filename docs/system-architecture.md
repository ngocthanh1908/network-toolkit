# System Architecture

## High-Level Overview

```
Browser (React SPA)
├── Pages (lazy-loaded)
│   ├── Home          → Landing page with feature cards + device preview
│   ├── Dashboard     → Stats + quick access to tools
│   ├── IP Lookup     → fetch → ip-api.com
│   ├── DNS Lookup    → fetch → dns.google/resolve
│   ├── Subnet Calc   → pure client-side calculation
│   ├── Port Checker  → fetch → localhost:3001/api/port-check
│   └── History       → localStorage read/write
├── Components
│   ├── Layout        → Sidebar nav + header + theme toggle
│   ├── HeroSection   → Home page hero block
│   ├── FeaturesSection → Feature cards grid
│   └── DevicePreview → Responsive preview mockup
├── Hooks
│   ├── useIpLookup   → API call + state management
│   ├── useDnsLookup  → API call + state management
│   └── usePortChecker → API call + state management
├── Utils
│   ├── subnet.ts     → CIDR calculation (pure functions)
│   └── history.ts    → localStorage CRUD + CSV export
└── Context
    └── ColorMode.tsx  → Dark/light theme toggle

Backend (Express 5, port 3001)
└── GET /api/port-check?host=X&port=Y → TCP socket probe
```

## Data Flow

### API-based tools (IP/DNS/Port)
```
User Input → Hook (setState) → fetch(API) → Response → setState → UI render
                                                     → addHistory(localStorage)
```

### Pure tools (Subnet Calc)
```
User Input → calculateSubnet(input) → setState → UI render
                                    → addHistory(localStorage)
```

## Routing
- React Router v7 with nested layout route
- All pages lazy-loaded via `React.lazy()` + `Suspense`
- Root `/` redirects to `/home`
- Unknown routes redirect to `/home`

## State Management
- Component-level `useState` only
- No global state library
- `ColorModeContext` for theme toggle (React Context)
- History persisted in `localStorage` key: `network-toolkit-history`

## Backend
- Express 5 on port 3001
- Single endpoint: `GET /api/port-check`
- Uses Node.js `net.Socket` for TCP connection test
- CORS enabled for frontend dev server
