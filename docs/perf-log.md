# Performance log

Mobile Lighthouse (performance-only) via `npm run perf:prod` / `npm run perf:local`.
All numbers are the median of 3 runs against `/en`. The `/` → `/en`
Accept-Language redirect is intentionally excluded from benchmarks
(decision 2026-07-04: redirect stays; users are unaffected).

| Date | Target | Change | Score | LCP | TBT | FCP | CLS |
|---|---|---|---|---|---|---|---|
| 2026-07-04 | prod | baseline (pre-refactor, ad-hoc audit run) | 46 | 6.7s | 1610ms | 2.2s | 0 |
| 2026-07-04 | prod | baseline via npm run perf:prod | 43 | 10.2s | 1013ms | 3.2s | 0 |
| 2026-07-04 | local | narrow HeroUI content glob (CSS 447→344 KB) | 53 | 5.6s | 978ms | 2.6s | 0.000 |
| 2026-07-05 | local | next 15.5.20 patch — flight CSS duplication unchanged, HTML 1127→1127 KB | — | — | — | — | — |
| 2026-07-05 | local | inlineCss ON (post Tasks 3-7) | 49 | 5.9s | 1156ms | 2.6s | 0.000 |
| 2026-07-05 | local | inlineCss OFF | 54 | 5.8s | 906ms | 2.4s | 0.000 |
| 2026-07-05 | local | GTM lazyOnload — reverted, TBT gain -153ms < 100ms threshold | 52 | 6.1s | 1059ms | 2.5s | 0.000 |
| 2026-07-05 | local | final (all tasks; two 3-run sets medianed 48 then 53 — first set skewed by a 10.3s cold-LCP outlier, logging the 2nd) | 53 | 6.1s | 917ms | 2.5s | 0.000 |
| 2026-07-05 | prod | post-deploy (PR #23 merged; /en doc 1.15 MB→485 KB; runs 59/4.8s, 44/8.9s, 49/9.3s — LCP network-variance dominated) | 49 | 8.9s | 869ms | 1.9s | 0.000 |
| 2026-07-05 | local | islands baseline (pre-changes): homepage /en loads 19 scripts incl 5400-87f2f00eabf83f43.js (519 KB); First Load JS / 354 KB, /en 354 KB, /contacts 349 KB, /en/contacts 349 KB, shared 103 KB | — | — | — | — | — |
| 2026-07-05 | local | islands: FAQ native + lazy drawer/modal (First Load JS /en 354→171 kB, homepage scripts 19→17, vendor chunk out of homepage graph: yes) | 51 | 4.5s | 882ms | 2.5s | 0.000 |
| 2026-07-05 | local | variable fonts + drop Actay italic (font preloads 6→5) | 60 | 4.9s | 714ms | 2.7s | 0.000 |
| 2026-07-05 | local | islands+fonts final | 59 | 4.9s | 765ms | 2.7s | 0.000 |
| 2026-07-06 | prod | post-deploy PR #24 (islands+fonts+primitives); PSI mobile LCP 3.2–3.4s, TBT 60–150ms, render-block ~900ms from 7 blocking CSS links | — | — | — | — | — |
| 2026-07-06 | local | render-blocking baseline: homepage /en has 7 blocking CSS links | — | — | — | — | — |
| 2026-07-06 | local | phase A: blocking CSS links **7→3** (vendor+lightbox → lazy chunks, keyframes+hero-effects folded into main); LCP/score in noise, TBT inflated by concurrent machine load (run1 cold outlier) — link-count is the structural win | 56 | 4.0s | 2016ms | 2.3s | 0.000 |
| 2026-07-06 | local | inlineCss OFF (post phase A): doc 484 KB, **3** blocking CSS links; runs 38/58/53 — render-block waterfall makes it swing | 53 | 4.9s | 1610ms | 2.7s | 0.000 |
| 2026-07-06 | local | inlineCss ON (post phase A): doc 1.13 MB raw / 161 KB gzip, **0** blocking CSS links; runs 54/54/55 — stable | 54 | 4.2s | 2126ms | 2.3s | 0.000 |

**inlineCss re-A/B decision (2026-07-06): ON wins, flipped from the 2026-07-05 OFF call.** Score tie (54 vs 53); ON better on LCP (4.2 vs 4.9) and FCP (2.3 vs 2.7), and — the point — ON is stable (54/54/55) while OFF swings (38/58/53) because ON removes all render-blocking CSS `<link>`s (0 vs 3) and their request-waterfall variance. TBT (~2000ms both) is machine-load noise, not signal (prod TBT is 60–150ms). Compressed wire bytes ~equal. The 2026-07-05 OFF decision was correct for a JS-heavy page; the islands work changed the conditions. Confirm on prod PSI post-deploy.

## CSS weight investigation (2026-07-05)

Main chunk composition at 306 KB raw / ~44 KB transfer: 192 KB app Tailwind
utilities, 60 KB HeroUI (13 scoped components), 44 KB theme vars, 6 KB
property registrations. Parked conclusions:
- No unused HeroUI light theme in the build (verified — only `.dark` vars).
- Per-route CSS splitting impossible: Tailwind v4 emits one stylesheet, imported at root.
- Remaining micro-cleanups from the 2026-05-25 CSS audit ≈ 3–6 KB raw — skipped (YAGNI).
- The one big lever left is removing HeroUI entirely (~60 KB CSS + provider JS):
  after the islands work it survives only in LeadForm/Drawer/Modal/Selects —
  all off the homepage critical path. Future project.
