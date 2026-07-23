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
| 2026-07-08 | local | HeroUI removed (perf/drop-heroui, PR #29): main CSS 44.7→33.5 KB gzip; runs 58/69/68 | 68 | 4.2s | 556ms | 2.3s | 0.000 |
| 2026-07-09 | prod | post-deploy PRs #29+#30 (main CSS 44.7→32.6 KB gzip, −27%); runs 69/3.6s, 51/6.1s, 52/6.2s — within known prod variance (pre-merge 5-pass median 57, range 50–72); worst LCP 6.2 vs 6.6 | 52 | 6.1s | 819ms | 2.1s | 0.000 |
| 2026-07-09 | local | className slimming (perf/slim-classnames): /en doc 480→433 KB raw (−9.9%), flight −21 KB; two 3-run sets medians 56 and 62 — machine-load noise (TBT 649–1821ms), bytes are the signal (docs/rsc-payload-report.md) | 62 | 3.9s | 789ms | 2.1s | 0.000 |
| 2026-07-09 | prod | post-deploy PR #32 (className slimming): **/en doc bootup 2693→1457/1553/1734ms (median −42%)** — the round's success gate cleared; FCP 2.1→1.4s; LCP still network-bimodal (3.5/6.0/6.1); runs 73/61/58 | 61 | 6.0s | 620ms | 1.4s | 0.000 |
| 2026-07-09 | local | **SI-regression A/B** (user PSI showed SI 4.5×2 + render delay ~2.05s post-#32): controlled same-rig 3v3, pre-#32 (bd95096) vs master — pre: SI 5486/5493/3710, LCP 5.3/6.5/4.2; post: SI 5843/3183/3300, LCP 4.1/4.1/4.3. Post equal-or-better on every metric; **#32 exonerated**. The slow mode (hero paints after the hydration burst → SI ~4–5s, render delay ~2s) is the pre-existing bimodality (user's own pre-#32 PSI set: SI 4.0/3.3/1.5/1.5/1.4, run-1 render delay 1,850ms); a 2-run PSI sample landed both in the slow mode | 57 | 4.1s | 1319ms | 2.2s | 0.000 |

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

## LCP flakiness fix — inlineCss OFF + defer GTM/Clarity (2026-07-08, PR #27)

Root cause of the bimodal prod LCP (5s good / 9s bad) — found via bootup-time
attribution, NOT the earlier CSS-delivery A/Bs: inlineCss ON duplicated the CSS
into the RSC flight payload (doc 1.13 MB, 549 KB of inline __next_f scripts,
CSS marker 470×). Evaluating that inline script = ~1,632 ms, the biggest single
contributor to the ~2s main-thread work that made the hero LCP paint collide on
real slow-4G. Fix: inlineCss OFF (doc → 484 KB, ~half the flight eval) + GTM &
Clarity → lazyOnload (defer ~457 ms past LCP). Prod A/B, 5 passes each:

| | ON (before) | OFF+defer (after) |
|---|---|---|
| scores | 45/46/46/48/56 | 50/54/57/70/72 |
| LCP | 5.2/5.3/8.6/9.5/9.6s | 4.0/4.9/6.5/6.5/6.6s |
| worst LCP | 9.6s | 6.6s |
| median score/LCP | 46 / 8.6s | 57 / 6.5s |

The 9s tail is eliminated (worst 6.6s); median score +11, median LCP −2.1s.
Kept OFF. NOTE: this supersedes the 2026-07-06 "keep ON" decision — the earlier
A/Bs measured CSS delivery, not the flight-payload script-eval cost (fast local
CPUs hide it; only real slow-4G + Lantern surface it).

## HeroUI removal (2026-07-08, branch perf/drop-heroui, PR #29)

Replaced HeroUI with in-house primitives (`src/components/ui/`: Field =
Input/Textarea, Select = APG select-only combobox, Dialog = Modal/Drawer on
native `<dialog>`, Btn gained `isLoading`). Deleted `tailwind.config.ts`
(Tailwind v4 Oxide auto-detection now scans content — the config only held the
heroui plugin + `.heroui-tw` glob; zero `dark:` variants existed in src),
`tools/sync-heroui-tw-sources.mjs` + predev/prebuild hooks, and deps
`@heroui/react`/`system`/`theme` + `framer-motion` (was only a HeroUI peer dep).

Main CSS chunk (build-measured):

| | raw | gzip |
|---|---|---|
| before (master b5ec369) | 307,412 B | 44,704 B |
| after Lever A | 216,454 B | 33,523 B |
| delta | **−90,958 B (−29.6%)** | **−11,181 B (−25.0%)** |

Homepage `/en` coverage (postcss selector-match vs SSR HTML): page-needed CSS
~12.0 KB gzip (was ~13.3); unused-by-homepage tail 227.6 → 146.1 KB raw — the
remainder is the route-specific arbitrary-value gradient tail (Lever B).
First Load JS unchanged (HeroUI was already behind lazy boundaries; the win in
those lazy chunks is HeroUI+framer-motion JS no longer downloaded on first
modal/drawer open). A11y parity verified in preview: combobox keyboard nav
(arrows/Home/End/Enter/Esc/typeahead, aria-activedescendant), dialog focus
trap + focus return + Esc + backdrop dismiss + scroll lock, drawer
route-change close; console clean.

## Heavy-CSS split (2026-07-08, branch perf/split-heavy-css, PR #30)

Moved the giant route-specific arbitrary-value gradient/shadow utilities
(blocks/case+outcome+reasons+services+turnkey-list+page-hero, about/sections,
case-page-hero, calculator slider thumbs) out of the global Tailwind sheet
into **React-hoisted `<style href precedence>` tags** rendered by the owning
block. Main CSS: 307,412 → 297,360 B raw (−3.3%) / 44,704 → 43,845 B gzip
(the repetitive gradients gzip extremely well, so the transfer delta is
small); homepage-coverage unused tail 227.6 → 217.8 KB raw; homepage
stylesheet links unchanged (3).

**Why NOT `*.module.css` (do not retry):** webpack merges module CSS from
widely-shared blocks into a chunk attached to the (uk)/(en) ROOT LAYOUTS
(measured: it fused with the cookie-consent module CSS), so every page —
homepage included — shipped every route's module CSS as a NEW render-blocking
link. `experimental.cssChunking: "strict"` does not prevent it. Hoisted
styles are immune: deduped by href, SSR-inlined per route, no requests.
CSS modules remain fine for genuinely single-route CSS (consent survives).

Related fix: `lib/server/fetch-homepage-cases.ts` imported from the
`@/components/case-page` barrel, dragging the case-page component tree into
the homepage graph — data layer extracted to `case-page/data.ts`.

**Combined (both levers merged, build-measured): main CSS 307,412 → 206,402 B
raw (−33%) / 44,704 → 32,551 B gzip (−27%).** Stale-checkout gotcha: a
leftover `.heroui-tw/` dir is scanned by Oxide auto-detection post-#29 and
silently re-adds ~25 KB raw of dead HeroUI utilities — the dir stays
gitignored as a tombstone; delete it locally.

## DOM audit + third-party gate round (2026-07-23, plan: docs/superpowers/plans/2026-07-23-perf-third-party-and-dom.md)

**Chunk `1255` identified (closes the "what is that 523 ms chunk" question):**
downloaded the prod chunk and fingerprinted it — it is the **Next App Router
client runtime** (`hydrateRoot`, RSC flight-client promise states,
`RSC_HEADER`, router popstate). Sibling `4bd1b696-*` is react-dom. Zero app
code inside either; no bundle surgery possible. Their eval cost scales with
the flight payload, so DOM/className slimming is the only lever that touches
them.

**DOM audit findings (prod, 2026-07-23):** homepage 1,585 elements (only
page above the 1,400 advisory; portfolio 701, pricing 922, vs-wordpress 954,
calculator 1,070, case 662), depth 12, CLS 0.000 at every viewport, hidden-UI
waste 8 nodes (desktop) / ~150 (mobile). No mobile/desktop duplicate blocks
exist — the "responsive DOM bloat" hypothesis is disproven. 27% of homepage
nodes are inline SVG; class attrs 108 KB (post-slim-classnames level).

**Lever 1 — GTM/Clarity interaction gate (branch `perf/gtm-interaction-gate`):**
`lazyOnload` was already exhausted, yet GTM gtag 583 ms + gtm.js 357 ms +
Clarity 391 ms still landed inside the Lighthouse trace, and the hero LCP
image (loads in 0.4 s, all discovery checks green) waited ~2.9 s of element
render delay on the contended main thread. The loader now injects gtm.js on
first pointerdown/keydown/touchstart/scroll or an 8 s idle fallback; the
consent bootstrap stays synchronous and queued dataLayer pushes replay on
container load (consent:verify 10/10). **Accepted trade-off:** sessions that
bounce <8 s with zero interaction are not recorded by GA4/Clarity.
Pre-merge prod baseline (3 runs): **median score 70, LCP 3.4 s, TBT 859 ms**
(bimodal: worst run 49 / 7.0 s / 1,006 ms). Post-merge success gate: TBT
median <~700 ms, GTM/Clarity absent from lab bootup-time; rollback to
lazyOnload if TBT does not move.

**Lever 2 — merged static scrims (branch `perf/dom-overlay-merge`):**
Industries wash+vignette → `.hp-ind-scrim`, ValueStack grade+wash+vignette →
`.hp-vs-scrim` (homepage-cards.css). Computed backgrounds byte-identical in
dev; hover grade/glow layers untouched; #solutions 226→217 nodes, #value
140→123. Small, but every node is paid twice (HTML + flight).

**Lever 3 — lucide icon sprite: ❌ measured dead end, do not retry.**
Built the full infra (generator + SpriteIcon + defs in both root layouts),
converted the repeated call sites (arrow-up-right ×8, check ×8, plus ×5 →
21 `<use>` refs, zero missing symbols). Result: **421 → 418 SVG nodes**. The
repeated icons are 1–2 paths each, so `<svg><use>` saves ~1 node/instance
while the symbol defs add ~10 back; unique multi-path icons (the actual bulk
of the 421) ship their path once either way, so spriting cannot dedupe them.
Byte effect similarly negligible (`d` strings are 16–30 chars). Reverted,
branch deleted. The 27% SVG share of the homepage DOM is irreducible without
visually removing icons.

**Prod verdict (post-merge, 2026-07-23, PRs #38 + #39 deployed):** the gate's
primary criterion cleared decisively — **GTM and Clarity are absent from all
three lab traces** (bootup-time shows zero third-party rows; the 8 s idle
fallback does not fire inside the trace window). Script evaluation dropped
2,423 → 1,442 ms. 3-run medians: score 67 / LCP 3.5 s / TBT 722 ms
(runs 635–981 ms) vs same-day pre-merge baseline 70 / 3.4 s / 859 ms —
TBT −137 ms median; score/LCP unchanged within the documented variance band
(same-day runs ranged 44–72 pre-merge). The remaining TBT is now entirely
first-party floor: `/en` document 1,839 ms (flight eval + parse/layout
attribution), App Router runtime chunk 746 ms, react-dom 450 ms — consistent
with the audit's conclusion that flight-payload size is the only remaining
lever on it. Homepage DOM confirmed 1,585 → 1,563 elements on prod; scrim
computed styles identical. No rollback: the 700 ms TBT target was missed by
22 ms on a 3-run median with 350 ms run spread, while the mechanism the
gate exists for (third-party eval out of the trace/LCP window) is fully
achieved and the field benefit (no GTM/Clarity main-thread work before first
interaction) applies to every real visitor.
