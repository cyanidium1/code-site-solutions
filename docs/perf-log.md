# Performance log

Mobile Lighthouse (performance-only) via `npm run perf:prod` / `npm run perf:local`.
All numbers are the median of 3 runs against `/en`. The `/` → `/en`
Accept-Language redirect is intentionally excluded from benchmarks
(decision 2026-07-04: redirect stays; users are unaffected).

| Date | Target | Change | Score | LCP | TBT | FCP | CLS |
|---|---|---|---|---|---|---|---|
| 2026-07-04 | prod | baseline (pre-refactor, ad-hoc audit run) | 46 | 6.7s | 1610ms | 2.2s | 0 |
| 2026-07-04 | prod | baseline via npm run perf:prod | 43 | 10.2s | 1013ms | 3.2s | 0 |
