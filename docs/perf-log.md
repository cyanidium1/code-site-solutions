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
