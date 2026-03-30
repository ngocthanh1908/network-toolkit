## Security Edge Case Verification Report

**Date:** 2026-03-31
**Scope:** 4 files, 6 reported edge cases
**Verdict:** All 6 confirmed as real issues (0 false positives)

---

### [CONFIRMED] 1. IP API uses HTTP not HTTPS
**Severity:** Critical
**File:** `src/hooks/useIpLookup.ts:31`
**Evidence:** `fetch(`http://ip-api.com/json/${ip}`)` — plain HTTP protocol.
**Impact:**
- Mixed content blocked by browsers when served over HTTPS (Vercel). Feature will silently fail in production.
- IP lookup data (user's query IP, geolocation, ISP) transmitted in plaintext — susceptible to MITM interception.
**Recommendation:** ip-api.com free tier does not support HTTPS. Options:
1. Switch to a free HTTPS-capable API (e.g., `https://ipapi.co/{ip}/json/`, `https://ipwho.is/{ip}`)
2. Use ip-api.com Pro (paid) which supports HTTPS
3. Proxy through own backend (Phase 5 backend already exists)

---

### [CONFIRMED] 2. URL Injection in Port Checker
**Severity:** Important
**File:** `src/hooks/usePortChecker.ts:22`
**Evidence:** `http://localhost:3001/api/port-check?host=${host}&port=${port}` — raw string interpolation, no encoding.
**Impact:** A host value like `evil.com&callback=steal` injects extra query params into the backend request. Depending on backend parsing, this could trigger SSRF or unintended behavior. While `port` is typed as `number` (safe), `host` is an unencoded `string`.
**Recommendation:**
```ts
const params = new URLSearchParams({ host, port: String(port) });
const res = await fetch(`${API_URL}/api/port-check?${params}`);
```

---

### [CONFIRMED] 3. URL Injection in DNS Lookup
**Severity:** Important
**File:** `src/hooks/useDnsLookup.ts:43`
**Evidence:** `https://dns.google/resolve?name=${domain}&type=${type}` — raw interpolation.
**Impact:** A domain like `evil.com&cd=1&do=1` injects extra params into the Google DNS API request. `cd=1` disables DNSSEC validation. While Google's API likely ignores unexpected params, this is a defense-in-depth failure and bad practice.
**Recommendation:**
```ts
const params = new URLSearchParams({ name: domain, type });
const url = `https://dns.google/resolve?${params}`;
```

---

### [CONFIRMED] 4. CSV Formula Injection (DDE Attack)
**Severity:** Important
**File:** `src/utils/history.ts:34-51`
**Evidence:** Lines 38-39 wrap `input` and `result` in double quotes but:
1. Internal double quotes are NOT escaped. Input `he said "hello"` produces `"he said "hello""` — broken CSV.
2. No sanitization of formula prefixes. If a user looks up domain `=CMD|'/C calc'!A0`, the exported CSV cell starts with `=` — Excel/LibreOffice will execute it as a formula.
3. `e.type` and date columns are not quoted at all.
**Impact:** Opening exported CSV in Excel could execute arbitrary commands via DDE injection. Broken quoting corrupts data.
**Recommendation:**
```ts
function sanitizeCsvField(value: string): string {
  // Escape internal double quotes
  let safe = value.replace(/"/g, '""');
  // Prefix formula-triggering characters with a tab
  if (/^[=+\-@\t\r]/.test(safe)) {
    safe = "'" + safe;
  }
  return `"${safe}"`;
}
```

---

### [CONFIRMED] 5. localStorage Unbounded Growth
**Severity:** Minor
**File:** `src/utils/history.ts:27`
**Evidence:** `addHistory` prepends new entries with `[newEntry, ...history]` — no cap, no trim. Searched entire codebase for `MAX_HISTORY`, `limit`, or any `slice`/`splice` on the history array at write time — none found. The only `slice` is in `Dashboard.tsx:19` for display purposes (read-only).
**Impact:** After prolonged use, localStorage fills up (~5MB). `setItem` will throw a `QuotaExceededError` silently (caught by the outer try/catch in `getHistory`, but `addHistory` has NO try/catch — it will throw unhandled).
**Recommendation:**
```ts
const MAX_HISTORY = 500;
const trimmed = [newEntry, ...history].slice(0, MAX_HISTORY);
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
} catch {
  // QuotaExceeded — trim more aggressively or notify user
}
```

---

### [CONFIRMED] 6. Port Checker Hardcoded localhost Backend
**Severity:** Critical
**File:** `src/hooks/usePortChecker.ts:22`
**Evidence:** `http://localhost:3001/api/port-check` — hardcoded. Searched for `VITE_`, `API_URL`, `BACKEND` across `src/` — no env var configuration found.
**Impact:** Port Checker feature is completely non-functional in any deployed environment. Only works during local development.
**Recommendation:**
```ts
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
// then: fetch(`${API_URL}/api/port-check?${params}`)
```
Add `VITE_API_URL` to `.env.production` and Vercel environment variables.

---

## Summary

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | HTTP IP API (mixed content) | Critical | Confirmed |
| 2 | URL injection — Port Checker | Important | Confirmed |
| 3 | URL injection — DNS Lookup | Important | Confirmed |
| 4 | CSV formula injection | Important | Confirmed |
| 5 | localStorage unbounded | Minor | Confirmed |
| 6 | Hardcoded localhost backend | Critical | Confirmed |

**Recommended fix order:** #1 and #6 (blocking production), then #2/#3/#4 (injection vectors), then #5 (quality of life).
