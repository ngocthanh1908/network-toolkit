# Project Overview — Network Toolkit

## Purpose
Personal network utility web app for IT infrastructure professionals. All tools run in browser except Port Checker (backend).

## Target Users
IT professionals, network engineers, sysadmins who need quick network lookups without installing desktop tools.

## Core Features
1. **IP Lookup** — Geolocation, ISP, timezone via ip-api.com
2. **DNS Lookup** — A, AAAA, MX, CNAME, TXT, NS records via Google DNS over HTTPS
3. **Subnet Calculator** — CIDR to network/broadcast/hosts (pure client-side math)
4. **Port Checker** — TCP port open/closed/timeout via Node.js backend
5. **History & Export** — localStorage-based history with CSV export

## Architecture
- **Frontend**: React 19 + TypeScript + Vite 8 + MUI v7
- **Backend**: Express 5 (port checker endpoint only)
- **State**: Local component state (useState), no external state library
- **Routing**: React Router v7 with lazy-loaded pages
- **Persistence**: localStorage for history

## Key Decisions
- No auth — personal tool, no user accounts needed
- No database — localStorage sufficient for history
- Lazy loading — code splitting via React.lazy for each page route
- Dark mode default — toggle via MUI theme + React Context

## External APIs
| API | Used By | Rate Limits |
|-----|---------|-------------|
| ip-api.com | IP Lookup | 45 req/min (free) |
| dns.google/resolve | DNS Lookup | Generous (Google) |

## Non-Functional Requirements
- Works offline (except API-dependent features)
- Responsive design (mobile/tablet/desktop)
- Zero telemetry, no data sent to third parties (except API calls)
