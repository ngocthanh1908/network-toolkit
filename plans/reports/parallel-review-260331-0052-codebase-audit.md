# Parallel Codebase Review — Network Toolkit

**Date:** 2026-03-31 | **Branch:** master | **Reviewers:** 3 parallel code-reviewer agents
**Scope:** Full codebase (17 files) | **Edge cases found:** 23 | **Confirmed:** 23 (0 false positives)

---

## Summary

| Severity | Count | Description |
|----------|-------|-------------|
| Critical | 3 | Production-blocking bugs |
| Important | 10 | Bugs, security holes, code quality |
| Minor | 6 | Low-risk, cleanup |
| **Total** | **19 unique** | (some overlap across categories) |

---

## Critical Issues (Fix Immediately)

### C1. Subnet NaN bypass — invalid input produces garbage output
- **File:** `src/utils/subnet.ts:54-57`
- **Bug:** `parseInt` returns NaN for non-numeric input. NaN comparisons (`NaN < 0`, `NaN > 255`, `NaN > 32`) always return false, so NaN passes all validation checks. Input like `"abc.def/xyz"` produces `"NaN.NaN.NaN.NaN"` results.
- **Fix:** Add `isNaN()` guards for prefix and each octet.

### C2. IP API uses HTTP — blocked on HTTPS deployment
- **File:** `src/hooks/useIpLookup.ts:31`
- **Bug:** `http://ip-api.com/json/` — plain HTTP. Browsers block mixed content on HTTPS sites (Vercel). Feature is dead in production.
- **Fix:** ip-api.com free tier is HTTP-only. Options: use HTTPS paid tier, switch to ipapi.co or ip-api.io (free HTTPS), or proxy through backend.

### C3. Port checker hardcoded to localhost:3001
- **File:** `src/hooks/usePortChecker.ts:22`
- **Bug:** `http://localhost:3001/api/port-check` — no env variable, no production URL. Dead in production.
- **Fix:** Use `import.meta.env.VITE_API_URL` or relative URL.

---

## Important Issues (Fix Before Merge)

### I1. Duplicate history entries in IP Lookup
- **Files:** `src/hooks/useIpLookup.ts:38-42` + `src/pages/IpLookup.tsx:17-25`
- **Bug:** Both hook and page call `addHistory()`. On 2nd+ lookups, two entries are created (one correct, one with stale data).
- **Fix:** Remove entire `.then()` block from `IpLookup.tsx`. Hook handles it.

### I2. Stale closure in IpLookup.tsx (same root cause as I1)
- **File:** `src/pages/IpLookup.tsx:18`
- **Bug:** `data` in `.then()` callback captures state from render time, not fetched result. Always null on first lookup.
- **Fix:** Covered by I1 fix.

### I3. Port range not validated — negative ports accepted
- **File:** `src/pages/PortChecker.tsx:25`
- **Bug:** `parseInt("-1")` = -1, `!(-1)` is false, so negative ports pass. No upper bound check (>65535).
- **Fix:** Add `if (p < 1 || p > 65535) return;`

### I4. URL injection in Port Checker
- **File:** `src/hooks/usePortChecker.ts:22`
- **Bug:** `host` interpolated directly into URL without encoding. Host with `&` injects params.
- **Fix:** Use `new URL()` + `URLSearchParams`.

### I5. URL injection in DNS Lookup
- **File:** `src/hooks/useDnsLookup.ts:43`
- **Bug:** Domain interpolated without `encodeURIComponent()`.
- **Fix:** `encodeURIComponent(domain)`.

### I6. CSV formula injection + broken quoting
- **File:** `src/utils/history.ts:36-42`
- **Bug:** Internal double quotes not escaped. Values starting with `=+@-` enable DDE attacks in Excel.
- **Fix:** Escape `"` → `""`, prefix formula triggers with `'`.

### I7. Duplicate SubnetInfo type
- **Files:** `src/utils/subnet.ts:1-13` (not exported) + `src/pages/SubnetCalc.tsx:10-22`
- **Fix:** Export from `subnet.ts`, import in page.

### I8. Duplicate HistoryEntry type
- **Files:** `src/utils/history.ts:1-7` (exported) + `src/pages/History.tsx:11-17` (local copy)
- **Fix:** Import from `history.ts`, delete local copy.

### I9. Missing 404 catch-all route
- **File:** `src/main.tsx:42-52`
- **Bug:** No `<Route path="*">`. Unknown URLs render blank page.
- **Fix:** Add `<Route path="*" element={<Navigate to="/home" replace />} />`

### I10. No responsive mobile handling
- **File:** `src/components/Layout.tsx:36`
- **Bug:** Permanent drawer on all screen sizes. Sidebar overlaps content on mobile.
- **Fix:** Use `useMediaQuery` + responsive drawer (larger effort, may defer).

---

## Minor Issues

### M1. Dark mode table headers
- **Files:** `DnsLookup.tsx:91`, `History.tsx:97`
- `bgcolor: 'grey.100'` — light color on dark theme.
- **Fix:** Use `'action.hover'` or theme-aware color.

### M2. No client-side IP/DNS validation
- APIs handle gracefully, but user gets a network roundtrip for obvious bad input.

### M3. Unused file: `src/constants/nav.ts`
- Zero imports. Delete it.

### M4. Unused file: `src/types/index.ts`
- Zero imports. CLAUDE.md forbids using it. Delete it.

### M5. NAV_ITEMS desync
- Layout.tsx (7 items) vs nav.ts (5 items, different icons). Moot since nav.ts is unused (#M3).

### M6. localStorage unbounded growth
- No limit on history entries. Eventually hits ~5MB limit, writes silently fail.
- **Fix:** Cap at 500 entries, trim oldest on add.

---

## Recommended Fix Priority

| Priority | Issues | Effort |
|----------|--------|--------|
| 1 (Now) | C1, I1+I2, I3 | Small — validation fixes |
| 2 (Now) | I4, I5, I6 | Small — encoding/escaping |
| 3 (Now) | C2, C3 | Medium — API URL strategy |
| 4 (Soon) | I7, I8, I9, M1, M3, M4 | Small — cleanup |
| 5 (Defer) | I10, M6 | Medium — responsive + storage cap |

---

## Unresolved Questions

1. Should 404 redirect to `/home` or show a NotFound page?
2. IP API HTTPS: pay for ip-api.com pro, or switch provider?
3. Port checker backend URL: env var or relative URL?
4. Is mobile responsive in scope for current phase?
