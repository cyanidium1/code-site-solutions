# Images — the standard

Two components handle every image in the app. ESLint enforces this
(`eslint.config.mjs`): direct `next/image` imports and raw `<img>` are errors
outside the primitives and the documented exceptions.

## Which component?

| Source | Component | Why |
|---|---|---|
| Sanity CMS (`cdn.sanity.io`) | `<SanityImg>` from `@/lib/shared/sanity-image` | Transforms run on Sanity's CDN (`?auto=format&w=&q=&rect=`) — free, honors Studio crops, no Vercel optimizer quota, no double-CDN hop. |
| `/public` assets, Unsplash | `<AppImage>` from `@/lib/shared/app-image` | next/image → Vercel optimizer (AVIF/WebP + resize). |
| Mixed/unknown origin at tiny fixed size (e.g. 28px avatar) | `<AppImage width={28} height={28} sizes="28px">` | Optimizer downsizes both origins; at thumb sizes the double-hop cost is irrelevant. |
| URL string that *might* be Sanity (e.g. blog cover fields) | `<SanityImg image={url}>` (string mode) | Non-Sanity URLs pass through untouched, Sanity URLs get srcset+transforms. |

## Rules

1. **`sizes` is mandatory** on both components (TypeScript enforces it). It
   must describe the *rendered* width — prefer `IMG_SIZES` presets from
   `@/lib/shared/image-sizes` (`container`, `half`, `prose`, `cardThird`).
   Background: every finding in the 2026-06 audit traced to missing `sizes`
   (browser assumes 100vw → a 209 KB case screenshot where ~30 KB suffices).
2. **Quality:** SanityImg defaults to 60 (proven on portfolio cards). Override
   only with a reason; LCP heroes may use up to 82. AppImage uses next/image's
   default 75. New quality values must be added to `images.qualities` in
   `next.config.ts`.
3. **LCP / above-the-fold:** pass `priority` (both components). Everything
   else lazy-loads automatically.
4. **Object mode beats string mode** for SanityImg: pass the full
   `{ asset, crop, alt }` object when the GROQ query provides it — that's what
   enables Studio crops (`?rect=`), CLS-safe `width`/`height`, and automatic
   LQIP blur-up. When adding new GROQ image projections, fetch
   `asset->{ _id, url, metadata { lqip, dimensions, isOpaque } }` plus `crop`
   (see `IMAGE_WITH_ALT` in `src/lib/server/sanity-queries.ts`).
5. **Loading state:** SanityImg always sets `color: transparent`, so the
   `alt` text never flashes during load (same trick next/image uses; the `alt`
   attribute stays intact for a11y/SEO). In object mode it then auto-paints the
   LQIP as a blur-up background — but **only when `metadata.isOpaque` is true**,
   because a CSS background is never cleared and would show through transparent
   pixels forever. Gate on `isOpaque`, **not** `hasAlpha`: most PNG screenshots
   carry an unused alpha channel (`hasAlpha: true`) yet are fully opaque, and we
   want those blurred. The genuinely transparent device-mockups in the
   pull-quote swiper are `isOpaque: false`, so they correctly get no blur.
   String mode has no metadata: pass `lqip={...}` explicitly when you know the
   image is opaque.
6. **og:image:** social crawlers don't read srcset — wrap Sanity URLs in
   `sanityCdn(url, { w: 1200, q: 70 })` (see blog `[slug]` pages).
7. **`fill` needs a positioned parent** (`relative`/`absolute`) with a fixed
   aspect (`aspect-*`). Non-fill SanityImg gets `width`/`height` from asset
   metadata automatically; in string mode pass them explicitly when known.

## Exceptions (raw `<img>` allowed, disable comment required)

- **SVG sources** — the default next/image loader doesn't optimize SVG
  (`CalculatorControls` design previews).
- **Marquee logo strip** — 2–12 KB webps rendered twice for the loop;
  optimizer round-trips cost more than they save (`homepage/marquee.tsx`).

Each exception carries
`// eslint-disable-next-line @next/next/no-img-element -- exception per docs/images.md: <reason>`.

## Adding a new /public asset

- Pre-compress: webp (or AVIF), source file ≤ ~300 KB, dimensions ≤ 2× the
  largest rendered width. The optimizer resizes at runtime, but the repo and
  deployment carry the source bytes.
- Before deleting an asset, grep `src/` for its filename — and remember
  filenames are sometimes built from constants (e.g. `` `${EFEDRA}/…` ``), so
  grep the directory name too.

## History

Standardized 2026-06-12 from an image audit: case pages shipped ~209 KB AVIF
per screenshot (no `sizes`, double-CDN), blog figures shipped raw full-res
originals (1.38 MB measured), Studio crops were fetched but ignored, ~3.1 MB
of dead assets sat in `public/`. Plan:
`docs/superpowers/plans/2026-06-12-standardized-image-handling.md`.
