# Data Validation & State Management Review

## Scope
- Files: `src/utils/subnet.ts`, `src/hooks/useIpLookup.ts`, `src/hooks/useDnsLookup.ts`, `src/hooks/usePortChecker.ts`, `src/pages/IpLookup.tsx`, `src/pages/PortChecker.tsx`, `src/pages/DnsLookup.tsx`, `src/pages/History.tsx`, `src/utils/history.ts`
- Focus: Data validation edge cases, state management bugs, dark mode compatibility

---

### [CONFIRMED] 1. Subnet NaN Bypass
**Severity:** Critical
**File:** `src/utils/subnet.ts:54-57`
**Evidence:**
```typescript
const prefix = parseInt(parts[1]);
if (prefix < 0 || prefix > 32) return null;  // NaN passes — both comparisons false

const ipParts = ip.split('.').map(Number);
if (ipParts.length !== 4 || ipParts.some((p) => p < 0 || p > 255)) return null;  // NaN passes too
```
- `parseInt("abc")` returns `NaN`. `NaN < 0` is `false`, `NaN > 32` is `false` — guard does NOT reject.
- `Number("abc")` returns `NaN`. `NaN < 0` is `false`, `NaN > 255` is `false` — guard does NOT reject.
- Input like `"abc.def.ghi.jkl/xyz"` passes all validation and reaches arithmetic, producing garbage output.

**Impact:** Nonsensical subnet calculations returned to user. `ipToNumber` with NaN octets produces `NaN`, which then propagates through all bitwise ops, yielding `"NaN.NaN.NaN.NaN"` strings in the result object.

**Fix:**
```typescript
const prefix = parseInt(parts[1]);
if (isNaN(prefix) || prefix < 0 || prefix > 32) return null;

const ipParts = ip.split('.').map(Number);
if (ipParts.length !== 4 || ipParts.some((p) => isNaN(p) || p < 0 || p > 255)) return null;
```
Additionally, octets should be integers — add `!Number.isInteger(p)` check or use `Math.floor` comparison.

---

### [CONFIRMED] 2. Duplicate History Entries in IP Lookup
**Severity:** Important
**File:** `src/hooks/useIpLookup.ts:38-42` and `src/pages/IpLookup.tsx:17-24`
**Evidence:**
- **Hook** (`useIpLookup.ts` line 38): calls `addHistory(...)` inside the `else` branch on successful lookup.
- **Page** (`IpLookup.tsx` line 19): calls `addHistory(...)` inside `.then()` after `lookup()` resolves.

Both fire on the same successful lookup. Two `addHistory` calls = two entries in localStorage per single IP lookup.

**Impact:** History page shows duplicate entries for every IP lookup. CSV exports contain duplicates. Over time localStorage fills faster (though the page version has a stale closure issue that mitigates this — see next item).

**Fix:** Remove the `addHistory` call from `IpLookup.tsx` (lines 17-24). The hook should own history recording, matching the pattern used by `useDnsLookup` and `usePortChecker`.
```typescript
// IpLookup.tsx handleSubmit — simplified
function handleSubmit() {
    const ip = input.trim();
    if (!ip) return;
    lookup(ip);
}
```

---

### [CONFIRMED] 3. Stale Closure in IpLookup.tsx handleSubmit
**Severity:** Important
**File:** `src/pages/IpLookup.tsx:14-25`
**Evidence:**
```typescript
function handleSubmit() {
    const ip = input.trim();
    if (!ip) return;
    lookup(ip).then(() => {
        if (data) {          // <-- `data` captured from render-time closure
            addHistory({
                type: 'IP Lookup',
                input: ip,
                result: `${data.city}, ${data.country} — ${data.isp}`,
            });
        }
    });
}
```
- `data` is destructured from `useIpLookup()` at render time. When `handleSubmit` runs, it closes over the `data` value from that render.
- On first lookup, `data` is `null` (initial state) at closure time. Inside `.then()`, `data` is still `null` because `setData(json)` in the hook triggers a re-render, but the `.then()` callback still references the old closure.
- On second lookup, `data` holds the PREVIOUS lookup result, not the current one.

**Impact:**
- First lookup: the `.then()` branch never fires (data is null) — no duplicate history entry on first use.
- Second+ lookup: fires with STALE data from the previous lookup, writing incorrect history entries.
- This partially masks issue #2 on first use but makes it worse on subsequent lookups (wrong data in the duplicate entry).

**Fix:** Same as #2 — remove the entire `.then()` block from `IpLookup.tsx`. The hook handles history correctly with fresh data.

---

### [CONFIRMED] 4. Port Validation Gaps — Negative Ports Pass
**Severity:** Important
**File:** `src/pages/PortChecker.tsx:23-27`
**Evidence:**
```typescript
function handleSubmit() {
    const h = host.trim();
    const p = parseInt(port.trim());
    if (!h || !p) return;     // falsy check only
    checkPort(h, p);
}
```
Analysis of edge cases:
- `parseInt("abc")` = `NaN` -> `!NaN` = `true` -> rejected. OK.
- `parseInt("0")` = `0` -> `!0` = `true` -> rejected. OK (port 0 is not useful).
- `parseInt("-1")` = `-1` -> `!(-1)` = `false` -> **passes validation, sent to backend**.
- `parseInt("99999")` = `99999` -> `!99999` = `false` -> **passes validation, sent to backend**.
- `parseInt("3.14")` = `3` -> passes, truncated silently. Acceptable.

Note: The `<TextField type="number">` on line 79 provides some browser-level protection (prevents typing letters in most browsers), but users can still type negative numbers and numbers > 65535. The HTML `type="number"` does NOT enforce range.

**Impact:** Invalid port numbers (-1, 70000) sent to backend API. Backend may error, return confusing results, or in worst case expose unexpected behavior.

**Fix:**
```typescript
function handleSubmit() {
    const h = host.trim();
    const p = parseInt(port.trim());
    if (!h || isNaN(p) || p < 1 || p > 65535) return;
    checkPort(h, p);
}
```

---

### [CONFIRMED — LOW RISK] 5. No Client-Side Input Validation for IP/DNS
**Severity:** Minor
**Files:** `src/hooks/useIpLookup.ts`, `src/hooks/useDnsLookup.ts`
**Evidence:**
- `useIpLookup` passes user input directly to `http://ip-api.com/json/${ip}` with no regex or format check.
- `useDnsLookup` passes user input directly to `https://dns.google/resolve?name=${domain}&type=${type}` with no validation.
- Neither hook validates input format before making network requests.

**Impact:** Wasted network requests for obviously invalid input (empty-ish strings already handled by pages). The APIs return proper error responses (`status: 'fail'` for ip-api, non-zero `Status` for Google DNS), so this does not cause data corruption or security issues. The `domain` and `ip` values are passed as URL path/query params, not as body — no injection risk beyond unnecessary requests.

**Assessment:** Acceptable for Phase 1-5 of a personal utility. Client-side validation would improve UX (faster feedback, fewer network round-trips) but is not a bug. Low priority enhancement.

---

### [CONFIRMED] 6. Dark Mode Table Header Issue
**Severity:** Minor
**Files:** `src/pages/DnsLookup.tsx:91`, `src/pages/History.tsx:97`
**Evidence:**
```typescript
<TableRow sx={{ bgcolor: 'grey.100' }}>
```
`grey.100` is `#f5f5f5` — a very light gray. In dark mode:
- Text inside `<TableCell>` defaults to MUI's dark mode text color (white/light).
- Background remains light gray (hardcoded, does not respond to theme mode).
- Result: near-invisible light text on light background.

**Impact:** Table headers unreadable in dark mode. Currently the app may not have dark mode enabled, but this is a latent bug that will surface when dark mode is added.

**Fix:** Use theme-aware colors:
```typescript
<TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' }}>
```
Or use MUI's `alpha` utility or `action.hover` token which auto-adapts.

---

## Summary

| # | Edge Case | Verdict | Severity |
|---|-----------|---------|----------|
| 1 | Subnet NaN bypass | CONFIRMED | Critical |
| 2 | Duplicate history entries | CONFIRMED | Important |
| 3 | Stale closure in IpLookup | CONFIRMED | Important |
| 4 | Port validation gaps | CONFIRMED | Important |
| 5 | No client-side IP/DNS validation | Confirmed, low risk | Minor |
| 6 | Dark mode table headers | CONFIRMED (latent) | Minor |

**Recommended fix priority:** 1 > 2+3 (same fix) > 4 > 6 > 5
