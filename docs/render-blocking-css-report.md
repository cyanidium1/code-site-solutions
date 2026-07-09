# Render-blocking CSS on `/en` — full report

**Date:** 2026-07-09 · **State analyzed:** master post PRs #29 + #30 (main CSS
206,402 B raw / 32,551 B gzip) · **Data:** five PSI mobile runs supplied by the
owner (FCP 1.4 s stable; LCP 4.1/3.4/3.3/3.3/3.4 s; TBT 40–100 ms; CLS 0;
"Render-blocking requests, est. savings 740–800 ms" on every run).
History and prior measurements: [perf-log.md](./perf-log.md).

## 1. Why a stylesheet blocks rendering at all

A browser will not paint anything until it can build the render tree, which
needs both the DOM **and the CSSOM**. Any `<link rel="stylesheet">` in `<head>`
without a non-matching `media` attribute is *render-blocking by contract*: the
HTML parser keeps parsing, but painting is suspended until every such sheet is
downloaded and parsed. This is deliberate browser behavior — painting before
CSS arrives would flash unstyled content (FOUC) and re-layout everything a few
hundred milliseconds later. Two consequences matter here:

- **The critical path is the *slowest* sheet, not the sum.** All sheets
  download in parallel; first paint waits for the last byte of the laggard.
- **Small files are not cheap.** A 529-byte sheet still pays DNS-free but
  full request-scheduling + RTT latency. In the supplied runs the smallest
  file was frequently the *second-slowest* (450–490 ms).

Lighthouse's "est. savings 740–800 ms" is a Lantern-model answer to "what if
first paint did not wait for CSS at all" under slow-4G throttling (~150 ms
RTT, 1.4 Mbps). It is an upper bound reachable only by inlining everything —
not by loading tricks, because the sheets are already discovered in the first
network round trip (see §3).

## 2. The three blocking stylesheets

| File | What it is | Why it exists | Raw / transfer | Duration (runs 1–5) |
|---|---|---|---|---|
| `a97c0962…css` | **Main Tailwind sheet** — every utility used anywhere on the site, plus `@theme` tokens, keyframes, hero-effects, base styles | Tailwind v4 emits ONE stylesheet from the root `globals.css` import; Next attaches it to the root layouts, so every route ships it | 206,402 B / 32.7 KiB | 750–810 ms |
| `0dd1ad24…css` | **`next/font` `@font-face` rules** — Manrope/JetBrains subsets with `unicode-range` + `font-display: swap` | Generated and attached by `next/font`; not user-controllable | 4,466 B / 1.5 KiB | 150–160 ms |
| `096c6547…css` | **Cookie-consent animations** — two classes + two `@keyframes` (banner slide-up, dialog fade-scale) | `consent.module.css`, imported by the consent banner/dialog, which the root layouts render via `ConsentProvider` — so webpack attaches its chunk to the layouts | 529 B / 1.1 KiB | **450–490 ms** |

Everything else CSS-wise is already off the critical path (swiper vendor,
lightbox, blog styles live in lazy chunks; the July 2026 rounds took the
homepage from 7 blocking links to these 3).

## 3. "Can we eager / parallel load them?" — that budget is already spent

- All three `<link>`s sit in the first kilobytes of the HTML `<head>`; the
  browser's **preload scanner** issues the requests as soon as the first HTML
  chunk arrives, before parsing finishes. There is nothing earlier than that.
- Same origin as the document → the (already-warm) HTTP/2 connection
  multiplexes all three; no DNS/TLS to hide. This is why PSI reports **"no
  preconnect candidates."**
- Run 2's dependency tree confirms parallelism: all three finish within
  ~200 ms of each other at the tail of one throttled window (1,403 / 1,500 /
  1,612 ms). That's concurrent transfer, not a chain.
- `<link rel="preload">` for CSS would change nothing (they're discovered
  instantly anyway). HTTP 103 Early Hints could shave part of one RTT but is a
  host-level feature (not a Next.js config) and only helps the tiny files —
  the main sheet's time is transfer, not discovery.
- The LCP image and fonts are already preloaded with `fetchpriority=high` —
  visible in the served HTML.

**Conclusion: there is no untapped "load earlier/parallel" lever. The only way
to reduce the modeled 740–800 ms is to make render not wait — i.e. inline.**

## 4. Inlining options, analyzed

### 4a. Full inline — `experimental.inlineCss` (❌ settled, do not revisit)

Measured twice in July 2026 (see perf-log entries of 07-05/07-06/07-08): Next
inlines the CSS into a `<style>` **and** duplicates it inside the RSC flight
payload (`__next_f` inline scripts). With the old 307 KB sheet that made the
document 1.13 MB and cost **~1,632 ms of script evaluation** on a throttled
CPU — it *caused* the bimodal 5 s/9 s LCP that PR #27 fixed by turning it off.
The sheet is 33% smaller now, but the mechanism is unchanged: ~2×206 KB raw
added to the document, roughly ~1 s eval on slow devices, paid on **every**
page view with zero cacheability. The current stability (LCP 3.3–3.4 s, TBT
≤100 ms) exists because this is off.

### 4b. Critical-CSS extraction (inline above-the-fold, async-load the rest) — (⛔ blocked by platform)

The textbook fix, and the numbers support it: the homepage *uses* only ~13 KB
gzip of the 32.6 shipped; the true above-the-fold subset (header + hero) is
plausibly 4–6 KB gzip — small enough to inline without the flight-payload
problem *if* it could be done selectively. It can't, cleanly:

- App Router exposes **no API to make its own CSS `<link>`s non-blocking**
  (no `media="print"` swap, no `disabled` toggle, no per-route opt-out).
  `experimental.inlineCss` is all-or-nothing (§4a).
- The workaround is a **post-build HTML transform** (beasties, née critters)
  over the prerendered output. But `/` and `/en` are **ISR pages** (5-minute
  revalidate): the first server-side regeneration replaces the post-processed
  HTML with untransformed HTML, silently reverting the optimization. Pinning
  this would mean disabling ISR for the homepage or moving the transform into
  a CDN edge function — both real architecture changes.

Verdict: park it. Revisit only if the homepage becomes fully static or the
site fronts a CDN layer where an edge transform is maintainable.

### 4c. Hoist the tiny sheets as `<style href precedence>` (✅ recommended — the one concrete action)

The consent stylesheet is the pathological case from §1: **529 bytes paying
450–490 ms of request latency, and first paint waits for it.** PR #30
established exactly the right tool: React 19 hoisted styles (`<style
href="…" precedence="…">{css}</style>`) — deduped by React, SSR-inlined into
`<head>`, zero network requests, immune to the webpack chunk-merging that
plagues module CSS from layout-reachable components (measured in PR #30: this
same consent chunk is what the failed CSS-modules attempt merged into).

Action: convert `src/lib/cookie-consent/styles/consent.module.css` (used by
`consent-banner.tsx` and `primitives/consent-dialog.tsx`) into a hoisted
style, delete the module file. Result: **3 blocking requests → 2**, the
critical path loses its worst small straggler, +~0.5 KB HTML.

> **Done 2026-07-09** (`src/lib/cookie-consent/styles/entry-animations.tsx`).
> Verified: `/en` serves 2 blocking stylesheets; the style injects on banner
> mount (the banner never SSRs — the old chunk blocked every page for a
> client-only component); reduced-motion still honored.

The font CSS (`0dd1ad`) cannot get the same treatment — it is generated by
`next/font` internals. It is also the fastest of the three; leave it.

Expected gain: modest and honest — ~100–300 ms in the Lighthouse model,
real-world tail-trimming rather than a median shift. Cost: ~30 minutes, zero
visual risk (animation-only CSS).

### 4d. Shrink the main sheet further (⚠️ diminishing returns)

What's left in the 206 KB raw is ordinary multi-route utilities: the homepage
needs ~70 KB raw of it, other routes need most of the rest, and Tailwind v4's
single-sheet model has no per-route output. Getting the homepage down to "only
what it uses" would require the wholesale Tailwind→scoped-CSS migration across
1,642 className sites that this project explicitly ruled out. The heavy
arbitrary-value outliers are already gone (PR #30). Remaining micro-cleanups
were audited at 3–6 KB raw in May — YAGNI.

## 5. Perspective: CSS is no longer the top LCP lever

Across the five supplied runs, FCP is a flat 1.4 s and the fast runs (3–5)
show the current floor: **LCP 3.3–3.4 s with element render delay of only
190–320 ms.** The two slower runs lost time elsewhere:

- run 1: element render delay **1,850 ms** (main-thread/hydration scheduling);
- run 2: resource load delay **1,070 ms** (image request queued behind other
  work on the throttled connection).

That jitter is JavaScript-side, matching the report's own biggest items:
**63 KiB unused JS, 12 KiB legacy JS**, 10 KiB third-party cache lifetimes,
3–4 long main-thread tasks. After §4c, the next round of work with real LCP
upside is JS reduction (hydration cost of the homepage islands, GTM/Clarity
payloads), not CSS.

## 6. Recommendation summary

| Action | Modeled gain | Effort | Risk | Verdict |
|---|---|---|---|---|
| Hoist consent CSS (3→2 blocking links) | ~100–300 ms tail | ~30 min | none | **Do** |
| Preload/preconnect/eager tricks | ~0 (already optimal) | — | — | Nothing to do |
| Full `inlineCss` | negative (flight eval) | config flip | high | Never (settled) |
| Critical-CSS post-build transform | up to ~500 ms | days + ongoing fragility | ISR silently reverts it | Park |
| Further main-sheet shrinking | ~1–2 KB gzip | wholesale migration | churn | Ruled out |
| Next round: unused/legacy JS, long tasks | the remaining LCP variance | separate project | — | Queue next |
