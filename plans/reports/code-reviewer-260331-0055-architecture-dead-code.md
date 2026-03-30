# Architecture & Dead Code Review

**Reviewer:** code-reviewer
**Date:** 2026-03-31
**Scope:** 8 edge cases — unused files, duplicate types, missing routes, responsive gaps, dead code

---

## CONFIRMED Issues

### 1. [CONFIRMED] Unused file: src/constants/nav.ts
**Severity:** Minor
**File:** `src/constants/nav.ts`
**Evidence:** Grep for `constants/nav` across entire codebase returned zero matches. No file imports it.
**Impact:** Dead file. 9 lines of orphaned code. Also out of sync with Layout.tsx NAV_ITEMS (see #8).
**Fix:** Delete `src/constants/nav.ts`.

---

### 2. [CONFIRMED] Unused file: src/types/index.ts
**Severity:** Minor
**File:** `src/types/index.ts`
**Evidence:** Grep for `from.*types/index` and `from.*src/types` returned zero import matches. The `IpInfo` type is redefined locally in `src/hooks/useIpLookup.ts:4-18`. CLAUDE.md explicitly forbids importing from this file.
**Impact:** Dead file. 15 lines of orphaned code. Creates confusion about where types live.
**Fix:** Delete `src/types/index.ts`. The local definition in `useIpLookup.ts` is the active one.

---

### 3. [CONFIRMED] Duplicate SubnetInfo type
**Severity:** Important
**Files:** `src/utils/subnet.ts:1-13` and `src/pages/SubnetCalc.tsx:10-22`
**Evidence:** Identical type definition (11 fields, same names and types) exists in both files. `SubnetInfo` in `subnet.ts` is NOT exported -- it's module-private. `calculateSubnet()` returns `SubnetInfo | null` but consumers can't reference the type.
**Impact:** If fields change in one place but not the other, TypeScript won't catch the mismatch at the boundary. Maintenance risk.
**Fix:** Export `SubnetInfo` from `subnet.ts`, import in `SubnetCalc.tsx`. Remove local duplicate.

---

### 4. [CONFIRMED] Duplicate HistoryEntry type
**Severity:** Important
**Files:** `src/utils/history.ts:1-7` (exported) and `src/pages/History.tsx:11-17` (local)
**Evidence:** `history.ts` exports `HistoryEntry`. `History.tsx` re-declares identical type locally instead of importing it. `History.tsx` already imports `getHistory, clearHistory, exportToCsv` from `../utils/history` (line 9) but omits the type.
**Impact:** Same drift risk as #3. If a field is added to `history.ts` (e.g., `tags`), `History.tsx` won't see it.
**Fix:** In `History.tsx`, change import to `import { getHistory, clearHistory, exportToCsv, type HistoryEntry } from '../utils/history'` and remove local type.

---

### 5. [CONFIRMED] Missing 404 catch-all route
**Severity:** Important
**File:** `src/main.tsx:42-52`
**Evidence:** Routes defined are: `/` (redirect to `/home`), `/home`, `/dashboard`, `/ip-lookup`, `/dns-lookup`, `/subnet-calc`, `/port-checker`, `/history`. No `<Route path="*">` element exists. Navigating to e.g. `/foo` renders the Layout shell with an empty `<Outlet />`.
**Impact:** Users hitting invalid URLs see a blank content area with no feedback. No way to navigate back without knowing valid paths.
**Fix:** Add `<Route path="*" element={<Navigate to="/home" replace />} />` inside the Layout route, or create a simple NotFound page component.

---

### 6. [CONFIRMED] No responsive mobile handling
**Severity:** Important
**File:** `src/components/Layout.tsx:36`
**Evidence:** `<Drawer variant="permanent">` is hardcoded. No `useMediaQuery` or breakpoint logic. Drawer width is fixed at 220px (or 64px collapsed). On mobile viewports, the sidebar permanently occupies 220px of a ~375px screen, leaving ~155px for content.
**Impact:** App is unusable on mobile/tablet. Content area is severely cramped.
**Fix:** Use MUI's `useMediaQuery(theme.breakpoints.down('md'))` to switch to `variant="temporary"` on small screens. Add a hamburger button in the AppBar to toggle the drawer.

---

### 7. [CONFIRMED] Dead code in IpLookup.tsx handleSubmit
**Severity:** Important
**File:** `src/pages/IpLookup.tsx:14-26`
**Evidence:** `handleSubmit` calls `lookup(ip).then(() => { if (data) { addHistory(...) } })`. The `data` variable is captured from the closure at render time -- it's always `null` on first lookup (initialized as `null` at line 12, and `lookup()` calls `setData(null)` before fetching). Even on subsequent lookups, `data` holds the *previous* result, not the new one. Meanwhile, `useIpLookup.ts:37-42` already calls `addHistory()` inside the hook after successful fetch. **Result: history is saved by the hook; the `.then()` block in IpLookup.tsx never successfully adds history (stale closure) and is pure dead code.**
**Impact:** Confusing double-history logic. If the closure bug were fixed, it would create duplicate history entries.
**Fix:** Remove the `.then()` block entirely. Simplify `handleSubmit` to just call `lookup(ip)`. Also remove the unused `addHistory` import from `IpLookup.tsx:1`.

---

### 8. [CONFIRMED] NAV_ITEMS duplication and desync
**Severity:** Minor
**Files:** `src/components/Layout.tsx:13-21` (7 items) vs `src/constants/nav.ts:1-7` (5 items)
**Evidence:** Layout.tsx has: Home, Dashboard, IP Lookup, DNS Lookup, Subnet Calculator, Port Checker, History. `nav.ts` has: IP Lookup, DNS Lookup, Subnet Calculator, Port Checker, History. Icons also differ (`travel_explore` vs `search` for IP Lookup). Since `nav.ts` is never imported (see #1), the desync is harmless but reinforces that `nav.ts` is dead code.
**Impact:** Confusion for developers. If someone finds `nav.ts` and tries to use it, they get stale data.
**Fix:** Delete `nav.ts` (covered by #1).

---

## Summary

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | Unused `constants/nav.ts` | Minor | CONFIRMED |
| 2 | Unused `types/index.ts` | Minor | CONFIRMED |
| 3 | Duplicate `SubnetInfo` type | Important | CONFIRMED |
| 4 | Duplicate `HistoryEntry` type | Important | CONFIRMED |
| 5 | Missing 404 catch-all route | Important | CONFIRMED |
| 6 | No responsive mobile handling | Important | CONFIRMED |
| 7 | Dead code in `IpLookup.tsx` handleSubmit | Important | CONFIRMED |
| 8 | NAV_ITEMS desync (subset of #1) | Minor | CONFIRMED |

**All 8 edge cases confirmed as real issues. Zero false positives.**

### Recommended Fix Priority

1. **#7** Dead code in IpLookup.tsx -- stale closure bug, confusing logic
2. **#3 + #4** Duplicate types -- export from source, import in consumers
3. **#5** Add 404 catch-all route
4. **#6** Responsive drawer (larger effort, but important for usability)
5. **#1 + #2 + #8** Delete dead files

### Unresolved Questions

- Should the 404 route redirect to `/home` or show a dedicated NotFound page?
- Is mobile support in scope for current phase, or deferred?
