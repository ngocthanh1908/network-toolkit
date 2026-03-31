# Codebase Summary

## Stats
- **Total LOC**: ~1,700 (app code, excluding node_modules/dist)
- **Pages**: 7 (Home, Dashboard, IP Lookup, DNS Lookup, Subnet Calc, Port Checker, History)
- **Components**: 4 (Layout, HeroSection, FeaturesSection, DevicePreview)
- **Custom Hooks**: 3 (useIpLookup, useDnsLookup, usePortChecker)
- **Utils**: 2 (subnet.ts, history.ts)
- **Tests**: 2 test files, 10 tests (subnet + history utils)

## File Map

| File | LOC | Purpose |
|------|-----|---------|
| `src/App.tsx` | 60 | Routes, theme, lazy loading |
| `src/main.tsx` | 7 | React root mount |
| `src/context/ColorMode.tsx` | 15 | Dark/light theme context |
| `src/components/Layout.tsx` | 160 | Sidebar + header shell |
| `src/components/HeroSection.tsx` | 45 | Home page hero |
| `src/components/FeaturesSection.tsx` | 75 | Home page feature cards |
| `src/components/DevicePreview.tsx` | 200 | Home page device mockup |
| `src/pages/Home.tsx` | 85 | Landing page (uses above 3 components) |
| `src/pages/Dashboard.tsx` | 131 | Stats + tools + recent activity |
| `src/pages/IpLookup.tsx` | 99 | IP geolocation lookup |
| `src/pages/DnsLookup.tsx` | 125 | DNS record query |
| `src/pages/SubnetCalc.tsx` | 138 | CIDR subnet calculator |
| `src/pages/PortChecker.tsx` | 152 | TCP port check |
| `src/pages/History.tsx` | 121 | History table + CSV export |
| `src/hooks/useIpLookup.ts` | 51 | IP lookup API hook |
| `src/hooks/useDnsLookup.ts` | 71 | DNS lookup API hook |
| `src/hooks/usePortChecker.ts` | 45 | Port check API hook |
| `src/utils/subnet.ts` | 78 | CIDR calculation logic |
| `src/utils/history.ts` | 59 | localStorage CRUD + CSV |
| `server/index.ts` | 48 | Express backend |

## Dependencies (production)
- react, react-dom, react-router-dom
- @mui/material, @mui/icons-material, @emotion/react, @emotion/styled
- express, cors
- date-fns

## Dev Dependencies
- vite, typescript, vitest
- @testing-library/react, @testing-library/jest-dom, jsdom
- eslint + plugins (react-hooks, react-refresh, typescript-eslint)
- tsx (for backend dev)
