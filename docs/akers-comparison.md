# Why akers-advisory scores ~98 and code-site doesn't — measured comparison

**Date:** 2026-07-09 · Both projects built locally (`C:\GitHub23\akers-advisory`
@ Next 15.5.6 turbopack; Frontend @ master `b0671ac`) and their served
documents measured with the same tools (`classname-audit.mjs`,
`flight-analyze.mjs`). Same core stack: Next 15 App Router, React 19,
Tailwind v4, formik/yup. The scoring gap is **not** the framework — it is
what each page asks a phone to do.

## Measured side-by-side

| Dimension | akers-advisory | code-site Frontend (`/en`) |
|---|---|---|
| Routes | **1 static page** (+robots/sitemap) | ~30+ routes × 2 locales, ISR |
| Data layer | none — all copy hardcoded | Sanity CMS fetches (cases, testimonials, count) |
| i18n | none | next-intl, 32 KB middleware on every request |
| **LCP element** | **`<h1>` text** (preloaded local woff2) | **1700×1674 hero image** via next/image |
| Images rendered | **zero `<img>` on the page**; visuals are SVG/CSS/type; `public/` = 101 KB | hero mockup, partner logos, card imagery |
| Third-party JS | **none** | GTM 114 KiB (56% unused) + Clarity 25 KiB |
| Document | 236.7 KB raw | 433 KB raw |
| `class=` attributes | **139 attrs / 12.4 KB** | 903 attrs / 104 KB |
| RSC flight payload | 136 KB (58% of doc) | 196 KB (45% of doc) |
| CSS | 45 KB raw / **9.5 KB gzip, 1 blocking link** | 205 KB raw / 32.8 KB gzip, 2 blocking links |
| First Load JS | **249 KB — larger than ours** (framer-motion + lottie in shared chunks) | 171 KB |
| Fonts | 2 local preloads + 3 Google (1 preloaded) | 5 subset variable-font preloads |
| DOM scale | few hundred elements | 1,474 elements, body has 97 children |

## The four differences that actually produce the score gap

1. **Text LCP vs image LCP — the big one.** Akers' largest element is a
   headline set in a preloaded local font: LCP == first paint, no resource
   race, no render-delay coin flip. Our LCP is a 1700-px image that must be
   requested, decoded, and painted — every slow-mode PSI run we've analyzed
   is this image racing the hydration burst. A text-LCP page is structurally
   immune to the whole class of problems we've been shaving.
2. **Zero images, zero third parties.** No image bytes compete with the
   critical path, and there is no GTM/Clarity main-thread work at all (ours:
   ~163 ms + 139 KiB, and 63 KiB of it flagged unused).
3. **~6× less page.** One marketing page, 139 class attributes, no CMS, no
   i18n, no ISR. Style/layout/hydration costs scale with this directly.
4. **9.5 KB gzip of CSS in one link** vs our 32.8 KB in two. (Already our
   most-optimized axis — three rounds got us from 44.7; theirs is small
   because the site is small.)

## What is NOT the difference (myths this comparison kills)

- **Not JS discipline:** their First Load JS is 249 KB — 46% *heavier* than
  ours — with framer-motion and Lottie in the shared chunks, and their flight
  share (58%) is worse than ours (45%). A tiny image-free page absorbs this
  without the score noticing.
- **Not build tricks:** their `next.config.ts` webpack `splitChunks` tuning
  is dead code under `build --turbopack` (webpack config isn't executed).
  The score comes from page shape, not config.
- **Not Tailwind usage style:** same v4, same utility approach — just 139
  attributes instead of 903.
- Their **full-screen Lottie loader with a forced 1.5 s minimum** is actively
  user-hostile and only survives scoring because the lab's first paint is the
  loader itself. Do not copy.

## Transferable to code-site (in value order)

1. **Consider a text-first hero on mobile** — the single change that could
   move us toward their bracket. If the H1/lede block outranked the mockup as
   the largest above-fold element (or the mockup moved below the first
   viewport on mobile), LCP becomes a font paint at ~1.4 s and the slow-mode
   race disappears. This is a design decision, not an optimization —
   flagged, not recommended unilaterally.
2. **Drop or slim GTM + Clarity** (their absence is worth real points and
   ~163 ms of main thread; the container audit is already on the backlog).
3. **Trim homepage DOM** — 1,474 elements across many sections; every
   below-fold section costs style/layout/hydration. Marketing decision.
4. Micro: fix `aleko.webp` (served 1014×69 for a 160×11 slot — PSI-flagged),
   `browserslist` modernization (11.5 KiB polyfills).

Bottom line: they are at 98 because their page is a two-font, zero-image,
zero-analytics postcard; we run a CMS-driven bilingual marketing site whose
LCP is a hero image racing hydration. The stack is the same — the *ask* is
10× different. Our remaining distance to their bracket is owned by the hero
image decision, the analytics payload, and homepage scope — all product
decisions, not engineering debt.
