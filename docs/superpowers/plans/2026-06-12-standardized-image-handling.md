# Standardized Image Handling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five ad-hoc image patterns in the app with exactly two standardized primitives — `SanityImg` for Sanity-hosted images and `AppImage` for `/public` + non-Sanity remote images — migrate every call site, enforce via ESLint, and document the standard.

**Architecture:** `SanityImg` renders a plain `<img>` whose resizing happens on **Sanity's image CDN** (`?auto=format&w=&q=&rect=`) — generalizing the proven `related-card` pattern (measured 10.5 KB AVIF vs 209 KB on the current `next/image` path). It gains Studio-crop support (`rect`), LQIP blur-up, and a **mandatory `sizes`** prop. `AppImage` is a thin `next/image` wrapper whose only change is making `sizes` mandatory (the missing-`sizes` failure mode caused every local-image finding in the 2026-06-12 audit). ESLint then bans direct `next/image` imports and raw `<img>` outside the two primitives.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind v4, node:test + tsx for helper tests, ESLint flat config.

**Audit context (why):** Case pages ship ~209 KB AVIF per screenshot regardless of viewport (no `sizes`, double-CDN through `/_next/image`); blog inline images ship raw full-res Sanity originals (one measured at 1.38 MB); Studio crops are fetched by GROQ but silently ignored; ~3.1 MB of dead images sit in `public/`.

**Repo:** `C:\GitHub23\code-site-workspace\Frontend` (its own git repo, clean tree). All paths below are relative to it.

---

## Design summary (the two patterns)

| | `SanityImg` | `AppImage` |
|---|---|---|
| File | `src/lib/shared/sanity-image.tsx` (rewrite) | `src/lib/shared/app-image.tsx` (new) |
| For | Anything hosted on `cdn.sanity.io` (CMS imagery) | `/public` assets, Unsplash, and tiny fixed-size thumbs of mixed origin (e.g. 28px avatars) |
| Renders | raw `<img>` + `srcSet` built by `sanitySrcSet` | `next/image` (Vercel optimizer) |
| `sizes` | **required** | **required** |
| Quality default | 60 (matches proven card pattern) | next/image default 75 (in `qualities` allowlist) |
| Crop/hotspot | Studio **crop** honored via `?rect=` (hotspot: out of scope, YAGNI) | n/a |
| Placeholder | LQIP background blur (object mode auto, string mode via `lqip` prop) | next/image `placeholder="blur"` available as before |
| LCP | `priority` → `loading="eager"` + `fetchPriority="high"` | `priority` (native next/image) |

**Documented exceptions** (raw `<img loading="lazy">` + eslint-disable comment): SVG sources (`/calculator/design/preview-*.svg`, `/partners/tatarka.svg`) because the default Next loader doesn't optimize SVG, and the marquee logo strip (2–12 KB webps rendered twice for the loop — optimizer round-trips would cost more than they save).

`sizes` presets live in `src/lib/shared/image-sizes.ts` so call sites don't invent values.

---

### Task 1: Extend `sanity-cdn.ts` helpers (crop rect, capped srcset) — TDD

**Files:**
- Modify: `src/lib/shared/sanity-cdn.ts`
- Create: `src/lib/shared/sanity-cdn.test.ts`
- Modify: `package.json` (test script)
- Modify: `src/components/blocks/related-card/index.tsx:81` and `src/components/portfolio/nbyg-shared.tsx:96-104` (only the `sanitySrcSet` call signature — full component migration happens in Task 6)

- [ ] **Step 1: Register the new test file in package.json**

In `package.json`, change the `test` script from:

```json
"test": "node --import tsx --test src/lib/shared/calculate-website-estimate.test.ts",
```

to:

```json
"test": "node --import tsx --test src/lib/shared/calculate-website-estimate.test.ts src/lib/shared/sanity-cdn.test.ts",
```

- [ ] **Step 2: Write the failing tests**

Create `src/lib/shared/sanity-cdn.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";

import {
  cropRect,
  croppedDims,
  sanityCdn,
  sanitySrcSet,
} from "./sanity-cdn";

const SANITY_URL =
  "https://cdn.sanity.io/images/4lk0x7o9/production/abc123-2000x1000.png";

test("sanityCdn appends transform params to Sanity URLs", () => {
  const out = sanityCdn(SANITY_URL, { w: 800, q: 60 });
  assert.ok(out.includes("auto=format"));
  assert.ok(out.includes("fit=max"));
  assert.ok(out.includes("w=800"));
  assert.ok(out.includes("q=60"));
});

test("sanityCdn passes non-Sanity URLs through untouched", () => {
  assert.equal(sanityCdn("/blog/cover.webp", { w: 800 }), "/blog/cover.webp");
  assert.equal(sanityCdn(null), "");
  assert.equal(sanityCdn(undefined), "");
});

test("cropRect converts a fractional Studio crop to a pixel rect", () => {
  const rect = cropRect(
    { top: 0.1, bottom: 0.1, left: 0.25, right: 0.25 },
    { width: 2000, height: 1000 },
  );
  assert.equal(rect, "500,100,1000,800");
});

test("cropRect returns undefined for missing or no-op crops", () => {
  assert.equal(cropRect(undefined, { width: 100, height: 100 }), undefined);
  assert.equal(cropRect(null, { width: 100, height: 100 }), undefined);
  assert.equal(
    cropRect({ top: 0, bottom: 0, left: 0, right: 0 }, { width: 100, height: 100 }),
    undefined,
  );
  assert.equal(
    cropRect({ top: 0.1, bottom: 0.1, left: 0.25, right: 0.25 }, undefined),
    undefined,
  );
});

test("croppedDims shrinks intrinsic dimensions by the crop", () => {
  assert.deepEqual(
    croppedDims(
      { top: 0.1, bottom: 0.1, left: 0.25, right: 0.25 },
      { width: 2000, height: 1000 },
    ),
    { width: 1000, height: 800 },
  );
  assert.deepEqual(croppedDims(null, { width: 2000, height: 1000 }), {
    width: 2000,
    height: 1000,
  });
  assert.equal(croppedDims(null, undefined), undefined);
});

test("sanityCdn includes ?rect= when crop+dims provided", () => {
  const out = sanityCdn(SANITY_URL, {
    w: 800,
    crop: { top: 0.1, bottom: 0.1, left: 0.25, right: 0.25 },
    dims: { width: 2000, height: 1000 },
  });
  assert.ok(out.includes("rect=500%2C100%2C1000%2C800"));
});

test("sanitySrcSet caps candidates at the intrinsic (cropped) width", () => {
  const out = sanitySrcSet(SANITY_URL, {
    widths: [400, 800, 1600, 2400],
    dims: { width: 2000, height: 1000 },
  });
  assert.ok(out);
  assert.ok(out.includes("w=400") && out.includes(" 400w"));
  assert.ok(out.includes("w=1600"));
  assert.ok(out.includes(" 2000w")); // capped candidate at intrinsic width
  assert.ok(!out.includes("w=2400")); // upscale candidate dropped
});

test("sanitySrcSet returns undefined for non-Sanity URLs", () => {
  assert.equal(sanitySrcSet("/blog/cover.webp", {}), undefined);
  assert.equal(sanitySrcSet(undefined, {}), undefined);
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `cropRect`/`croppedDims` not exported; `sanitySrcSet` called with object signature it doesn't accept yet.

- [ ] **Step 4: Implement the new helper API**

Replace the full contents of `src/lib/shared/sanity-cdn.ts` with:

```ts
/**
 * Helpers for Sanity's image CDN transform params.
 *
 * Raw `asset.url` values point at the full-resolution original (often a
 * multi-MB PNG screenshot). Appending `?auto=format&fit=max&w=…&q=…` makes the
 * CDN serve a resized, WebP/AVIF, compressed variant instead. These helpers
 * back <SanityImg> (src/lib/shared/sanity-image.tsx) — the canonical component
 * for Sanity imagery. Prefer the component; reach for the helpers directly
 * only for non-<img> uses (og:image URLs, CSS backgrounds).
 *
 * No-op for non-Sanity URLs (Unsplash, local assets), so it's safe to wrap any
 * cover URL.
 */

const SANITY_IMG = "cdn.sanity.io/images/";

/** Default srcset ladder. Candidates above the intrinsic width are dropped. */
export const DEFAULT_SRCSET_WIDTHS = [400, 640, 800, 1200, 1600];

export type SanityCrop = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};
export type SanityDims = { width: number; height: number };

type CdnOpts = {
  w?: number;
  h?: number;
  q?: number;
  fit?: "max" | "crop" | "clip";
  /** Studio crop (fractions 0..1) — applied as ?rect= when dims are known. */
  crop?: SanityCrop | null;
  /** Original asset dimensions (from metadata.dimensions). */
  dims?: SanityDims | null;
};

export function isSanityUrl(url: string | null | undefined): url is string {
  return Boolean(url && url.includes(SANITY_IMG));
}

/** `?rect=` value for a Studio crop, or undefined when absent/no-op. */
export function cropRect(
  crop?: SanityCrop | null,
  dims?: SanityDims | null,
): string | undefined {
  if (!crop || !dims) return undefined;
  const left = Math.round(crop.left * dims.width);
  const top = Math.round(crop.top * dims.height);
  const width = Math.round((1 - crop.left - crop.right) * dims.width);
  const height = Math.round((1 - crop.top - crop.bottom) * dims.height);
  if (width <= 0 || height <= 0) return undefined;
  if (left === 0 && top === 0 && width === dims.width && height === dims.height) {
    return undefined;
  }
  return `${left},${top},${width},${height}`;
}

/** Intrinsic dimensions after the Studio crop — feed <img width/height>. */
export function croppedDims(
  crop?: SanityCrop | null,
  dims?: SanityDims | null,
): SanityDims | undefined {
  if (!dims) return undefined;
  if (!crop || !cropRect(crop, dims)) return dims;
  return {
    width: Math.round((1 - crop.left - crop.right) * dims.width),
    height: Math.round((1 - crop.top - crop.bottom) * dims.height),
  };
}

export function sanityCdn(
  url: string | undefined | null,
  { w, h, q = 60, fit = "max", crop, dims }: CdnOpts = {},
): string {
  if (!isSanityUrl(url)) return url ?? "";
  const u = new URL(url);
  const rect = cropRect(crop, dims);
  if (rect) u.searchParams.set("rect", rect);
  u.searchParams.set("auto", "format");
  u.searchParams.set("fit", fit);
  if (w) u.searchParams.set("w", String(w));
  if (h) u.searchParams.set("h", String(h));
  u.searchParams.set("q", String(q));
  return u.toString();
}

type SrcSetOpts = {
  widths?: number[];
  q?: number;
  crop?: SanityCrop | null;
  dims?: SanityDims | null;
};

/** Build a `srcSet` string, or `undefined` for non-Sanity URLs. */
export function sanitySrcSet(
  url: string | undefined | null,
  { widths = DEFAULT_SRCSET_WIDTHS, q = 60, crop, dims }: SrcSetOpts = {},
): string | undefined {
  if (!isSanityUrl(url)) return undefined;
  const max = croppedDims(crop, dims)?.width;
  // Cap candidates at intrinsic width — the CDN won't upscale, so larger
  // candidates would all dedupe to the same bytes under different URLs.
  const capped = max
    ? [...new Set([...widths.filter((w) => w < max), Math.min(max, Math.max(...widths))])]
    : widths;
  return capped
    .sort((a, b) => a - b)
    .map((w) => `${sanityCdn(url, { w, q, crop, dims })} ${w}w`)
    .join(", ");
}
```

- [ ] **Step 5: Fix the two existing `sanitySrcSet` callers (signature only)**

In `src/components/blocks/related-card/index.tsx` line 81, change:

```tsx
          srcSet={sanitySrcSet(coverImage.src, [400, 600, 800, 1200], 60)}
```

to:

```tsx
          srcSet={sanitySrcSet(coverImage.src, { widths: [400, 600, 800, 1200], q: 60 })}
```

In `src/components/portfolio/nbyg-shared.tsx` (line ~98), change:

```tsx
            srcSet={sanitySrcSet(row.coverImage, [400, 600, 800, 1200], 60)}
```

to:

```tsx
            srcSet={sanitySrcSet(row.coverImage, { widths: [400, 600, 800, 1200], q: 60 })}
```

- [ ] **Step 6: Run tests + typecheck, verify pass**

Run: `npm test` → Expected: all tests PASS.
Run: `npm run typecheck` → Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/lib/shared/sanity-cdn.ts src/lib/shared/sanity-cdn.test.ts package.json "src/components/blocks/related-card/index.tsx" src/components/portfolio/nbyg-shared.tsx
git commit -m "feat(images): crop-aware sanity-cdn helpers with capped srcset"
```

---

### Task 2: `IMG_SIZES` presets

**Files:**
- Create: `src/lib/shared/image-sizes.ts`

- [ ] **Step 1: Create the presets file**

```ts
/**
 * Shared `sizes` presets for <AppImage> and <SanityImg>.
 *
 * `sizes` tells the browser how wide the image renders so it can pick the
 * smallest sufficient srcset candidate. Values mirror the app's layout
 * system: `max-w-container` (~1200px) content column, ImageText 2-col split
 * demoting at 961px, 3-up card grids demoting at 1024px.
 *
 * Pick the preset matching the rendered layout; write a custom media-query
 * string only when none fits (and consider adding it here if reused).
 */
export const IMG_SIZES = {
  /** Spans the content container at every breakpoint (blog covers, banners). */
  container: "(max-width: 1280px) 100vw, 1200px",
  /** One column of a 2-col ImageText split (stacks below 961px). */
  half: "(max-width: 960px) 92vw, 580px",
  /** Centered figure column (ImageText centered max-w-[920px], blog figures). */
  prose: "(max-width: 960px) 92vw, 900px",
  /** One card of a 3-up grid (1-col below 1024px). */
  cardThird: "(min-width: 1024px) 33vw, 100vw",
} as const;
```

- [ ] **Step 2: Typecheck and commit**

Run: `npm run typecheck` → exit 0.

```bash
git add src/lib/shared/image-sizes.ts
git commit -m "feat(images): shared IMG_SIZES presets"
```

---

### Task 3: Rewrite `SanityImg`

**Files:**
- Modify: `src/lib/shared/sanity-image.tsx` (full rewrite)

Note: existing consumers (`case-page`, `industry-page`) keep compiling only after Task 5 — this task intentionally breaks their typecheck because `sizes` becomes required and `fill`/`width` props change. **Do Tasks 3 and 5 in the same sitting; the commit at the end of Task 5 is the first green checkpoint for these files.** (Task 4 is independent and can land between them.)

- [ ] **Step 1: Replace the full contents of `src/lib/shared/sanity-image.tsx`**

```tsx
import {
  DEFAULT_SRCSET_WIDTHS,
  croppedDims,
  sanityCdn,
  sanitySrcSet,
  type SanityCrop,
  type SanityDims,
} from "@/lib/shared/sanity-cdn";

/**
 * Canonical component for Sanity-hosted images (see docs/images.md).
 *
 * Renders a plain <img> whose resizing/format negotiation happens on Sanity's
 * image CDN (?auto=format&w=&q=) — NOT on the Vercel optimizer. This avoids a
 * double-CDN hop and optimizer quota, and honors Studio crops via ?rect=.
 * Measured on /portfolio cards: 10.5 KB AVIF from a 2560px PNG original.
 *
 * Accepts either a full Sanity image object (preferred: enables crop, CLS
 * width/height, LQIP) or a bare URL string (queries that flatten to `src`).
 * Non-Sanity URLs pass through untouched, so string mode is safe for fields
 * that may hold local /public paths (e.g. blog covers).
 */

/** Structural subset of types/sanity.ts SanityImage — also fits blogImage blocks. */
type SanityImageLike = {
  asset?: {
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: SanityDims & { aspectRatio?: number };
    } | null;
  } | null;
  crop?: SanityCrop | null;
};

type SanityImgProps = {
  image: SanityImageLike | string | null | undefined;
  alt: string;
  /** REQUIRED: rendered-width hints for srcset selection. Use IMG_SIZES presets. */
  sizes: string;
  /** srcset candidate widths; capped at the image's intrinsic width. */
  widths?: number[];
  quality?: number;
  /** LCP/above-the-fold: eager + fetchpriority=high. Everything else lazy-loads. */
  priority?: boolean;
  /** Cover a positioned parent (parent needs `relative`/`absolute` + a fixed aspect). */
  fill?: boolean;
  /** Blur-up placeholder; auto-read in object mode, pass explicitly in string mode. */
  lqip?: string;
  className?: string;
  /** Intrinsic-dimension overrides for string mode (CLS guard). */
  width?: number;
  height?: number;
};

export function SanityImg({
  image,
  alt,
  sizes,
  widths = DEFAULT_SRCSET_WIDTHS,
  quality = 60,
  priority = false,
  fill = false,
  lqip,
  className,
  width,
  height,
}: SanityImgProps) {
  const obj = typeof image === "string" ? undefined : (image ?? undefined);
  const url = typeof image === "string" ? image : obj?.asset?.url;
  if (!url) return null;

  const dims = obj?.asset?.metadata?.dimensions;
  const crop = obj?.crop;
  const shown = croppedDims(crop, dims);
  const blur = lqip ?? obj?.asset?.metadata?.lqip;

  const cls =
    [fill ? "absolute inset-0 h-full w-full" : "", className]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- canonical Sanity primitive; transforms run on Sanity's CDN, not /_next/image (docs/images.md)
    <img
      src={sanityCdn(url, { w: 800, q: quality, crop, dims })}
      srcSet={sanitySrcSet(url, { widths, q: quality, crop, dims })}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      width={fill ? undefined : (width ?? shown?.width)}
      height={fill ? undefined : (height ?? shown?.height)}
      className={cls}
      // eslint-disable-next-line react/forbid-dom-props -- dynamic LQIP data-URI blur-up, replaced by the real image on decode
      style={
        blur
          ? { backgroundImage: `url(${blur})`, backgroundSize: "cover" }
          : undefined
      }
    />
  );
}
```

- [ ] **Step 2: Proceed straight to Task 5 (typecheck is expected red until its call sites are migrated). Do not commit yet.**

---

### Task 4: Create `AppImage`

**Files:**
- Create: `src/lib/shared/app-image.tsx`

- [ ] **Step 1: Create the component**

```tsx
// eslint-disable-next-line no-restricted-imports -- the one sanctioned next/image entry point (docs/images.md)
import Image from "next/image";

/**
 * Canonical component for images served from /public and non-Sanity remotes
 * (Unsplash). Thin wrapper over next/image — the Vercel optimizer resizes and
 * AVIF/WebP-encodes. The only difference vs next/image: `sizes` is mandatory,
 * because every local-image finding in the 2026-06 image audit traced back to
 * a missing `sizes` (next/image then assumes 100vw and over-fetches).
 *
 * Sanity-hosted content imagery belongs in <SanityImg> instead — it must not
 * round-trip through /_next/image.
 */
type AppImageProps = Omit<React.ComponentProps<typeof Image>, "sizes"> & {
  /** REQUIRED: rendered-width hints. Use IMG_SIZES presets where one fits. */
  sizes: string;
};

export function AppImage(props: AppImageProps) {
  return <Image {...props} />;
}
```

(The eslint-disable comment is inert until Task 11 adds the rule — harmless now, required then.)

- [ ] **Step 2: Typecheck and commit**

Run: `npm run typecheck` → expect errors ONLY in `case-page`/`industry-page` from Task 3 (if doing tasks in order). If Task 3 hasn't been applied yet, expect exit 0.

```bash
git add src/lib/shared/app-image.tsx
git commit -m "feat(images): AppImage wrapper with mandatory sizes"
```

---

### Task 5: Migrate `SanityImg` object-mode consumers (case-page, industry-page)

**Files:**
- Modify: `src/components/case-page/index.tsx` (lines ~340-359, ~397-408, ~514-521)
- Modify: `src/components/industry-page/index.tsx` (lines ~300-309)

- [ ] **Step 1: case-page centered images — add `sizes`**

In `src/components/case-page/index.tsx` (~line 340), change:

```tsx
        const img1 = hasImage ? (
          <SanityImg
            image={section.image}
            alt={
              loc(section.image?.alt, locale) ||
              loc(section.heading, locale) ||
              loc(doc.title, locale)
            }
          />
        ) : null;
        const img2 = hasImage2 ? (
          <SanityImg
            image={section.image2}
            alt={
              loc(section.image2?.alt, locale) ||
              loc(section.heading, locale) ||
              loc(doc.title, locale)
            }
          />
        ) : null;
```

to:

```tsx
        const img1 = hasImage ? (
          <SanityImg
            image={section.image}
            alt={
              loc(section.image?.alt, locale) ||
              loc(section.heading, locale) ||
              loc(doc.title, locale)
            }
            sizes={IMG_SIZES.prose}
          />
        ) : null;
        const img2 = hasImage2 ? (
          <SanityImg
            image={section.image2}
            alt={
              loc(section.image2?.alt, locale) ||
              loc(section.heading, locale) ||
              loc(doc.title, locale)
            }
            sizes={IMG_SIZES.prose}
          />
        ) : null;
```

- [ ] **Step 2: case-page side image — add `sizes` to the `fill` usage (~line 397)**

```tsx
      const imageNode: React.ReactNode = hasImage ? (
        <SanityImg
          image={section.image}
          alt={
            loc(section.image?.alt, locale) ||
            loc(section.heading, locale) ||
            loc(doc.title, locale)
          }
          fill
          sizes={IMG_SIZES.half}
          className="object-cover"
        />
      ) : null;
```

- [ ] **Step 3: case-page hero (~line 514) — already has `sizes` + `priority`; no change needed. Verify it reads:**

```tsx
  const heroImageNode = doc.hero?.heroImage?.asset?.url ? (
    <SanityImg
      image={doc.hero.heroImage}
      alt={loc(doc.hero.heroImage.alt, locale) || title}
      sizes="(max-width: 960px) 90vw, 40vw"
      priority
    />
  ) : null;
```

- [ ] **Step 4: Add the import to case-page**

At the top of `src/components/case-page/index.tsx`, next to the existing `SanityImg` import:

```tsx
import { IMG_SIZES } from "@/lib/shared/image-sizes";
```

- [ ] **Step 5: industry-page side image (~line 300)**

In `src/components/industry-page/index.tsx`, change:

```tsx
          image={
            section.image?.asset ? (
              <SanityImg
                image={section.image}
                alt={loc(section.heading, locale)}
                fill
                className="object-cover"
              />
            ) : null
          }
```

to:

```tsx
          image={
            section.image?.asset ? (
              <SanityImg
                image={section.image}
                alt={loc(section.heading, locale)}
                fill
                sizes={IMG_SIZES.half}
                className="object-cover"
              />
            ) : null
          }
```

and add the import:

```tsx
import { IMG_SIZES } from "@/lib/shared/image-sizes";
```

- [ ] **Step 6: Typecheck, verify green**

Run: `npm run typecheck` → Expected: exit 0 (Task 3's breakage is now resolved).

- [ ] **Step 7: Commit Tasks 3+5 together**

```bash
git add src/lib/shared/sanity-image.tsx src/components/case-page/index.tsx src/components/industry-page/index.tsx
git commit -m "feat(images): SanityImg v2 — Sanity CDN transforms, required sizes, crop support"
```

---

### Task 6: Migrate string-URL Sanity consumers (related-card, nbyg-shared, services, efedra gallery)

**Files:**
- Modify: `src/components/blocks/related-card/index.tsx` (lines ~78-87)
- Modify: `src/components/portfolio/nbyg-shared.tsx` (lines ~96-104)
- Modify: `src/components/blocks/services/index.tsx` (lines ~244-252)
- Modify: `src/components/portfolio/efedra-case-gallery.tsx` (lines ~63-69)

- [ ] **Step 1: related-card — replace the raw `<img>` block**

In `src/components/blocks/related-card/index.tsx`, replace:

```tsx
        <img
          src={sanityCdn(coverImage.src, { w: 800, q: 60 })}
          srcSet={sanitySrcSet(coverImage.src, { widths: [400, 600, 800, 1200], q: 60 })}
          sizes="(min-width: 1024px) 33vw, 100vw"
          alt={coverImage.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 block h-full w-full object-cover object-top"
        />
```

with:

```tsx
        <SanityImg
          image={coverImage.src}
          alt={coverImage.alt}
          sizes={IMG_SIZES.cardThird}
          widths={[400, 600, 800, 1200]}
          fill
          className="object-cover object-top"
        />
```

Replace the helper import at the top:

```tsx
import { sanityCdn, sanitySrcSet } from "@/lib/shared/sanity-cdn";
```

with:

```tsx
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { SanityImg } from "@/lib/shared/sanity-image";
```

- [ ] **Step 2: nbyg-shared — same replacement**

In `src/components/portfolio/nbyg-shared.tsx`, replace the `<img …sanityCdn…>` block (lines ~96-104) with:

```tsx
          <SanityImg
            image={row.coverImage}
            alt={row.coverImageAlt ?? row.name}
            sizes={IMG_SIZES.cardThird}
            widths={[400, 600, 800, 1200]}
            fill
            className="object-cover object-top"
          />
```

and swap imports the same way as Step 1.

- [ ] **Step 3: services testimonial visual (~line 246)**

In `src/components/blocks/services/index.tsx`, replace:

```tsx
              <img
                src={testimonialVisualSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
```

with:

```tsx
              <SanityImg
                image={testimonialVisualSrc}
                alt=""
                sizes="(min-width: 1280px) 45vw, 92vw"
                fill
                className="object-cover"
              />
```

and add `import { SanityImg } from "@/lib/shared/sanity-image";` to the imports.

- [ ] **Step 4: efedra-case-gallery (~line 63)**

This is a client component using `next/image` with `fill` for Sanity URLs. Replace the `<Image …>` usage (currently `src={t.src}`, `fill`, `sizes="(max-width: 768px) 50vw, 600px"`) with:

```tsx
            <SanityImg
              image={t.src}
              alt={t.alt}
              sizes="(max-width: 768px) 50vw, 600px"
              fill
              className="object-cover"
            />
```

Remove the `next/image` import; add the `SanityImg` import. Keep all lightbox logic untouched. (Read the file first — preserve the exact `alt` expression and any className it currently passes.)

- [ ] **Step 5: Typecheck + visual check + commit**

Run: `npm run typecheck` → exit 0.
Run: `npm run dev`, open `http://localhost:3000/en/portfolio` and `http://localhost:3000/portfolio/efedra-clinic` — covers render, srcset URLs point at `cdn.sanity.io` with `auto=format&w=`.

```bash
git add "src/components/blocks/related-card/index.tsx" src/components/portfolio/nbyg-shared.tsx "src/components/blocks/services/index.tsx" src/components/portfolio/efedra-case-gallery.tsx
git commit -m "refactor(images): string-mode SanityImg for card covers, services visual, efedra gallery"
```

---

### Task 7: Migrate blog images (covers, avatars, portable-text figures, og:image)

**Files:**
- Modify: `src/app/(en)/en/blog/[slug]/page.tsx` (cover ~line 247, avatar ~line 273, og ~lines 66+128)
- Modify: `src/app/(uk)/blog/[slug]/page.tsx` (cover ~line 254, avatar ~line 281, og ~lines 66+~130)
- Modify: `src/lib/shared/sanity-portable.tsx` (renderBlogImage, lines ~331-353)

- [ ] **Step 1: EN cover — replace raw `<img>`**

In `src/app/(en)/en/blog/[slug]/page.tsx`, replace:

```tsx
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage.src}
                alt={post.coverImage.alt ?? post.titleEn ?? ""}
                className="w-full h-auto rounded-2xl border border-line block"
              />
```

with:

```tsx
              <SanityImg
                image={post.coverImage.src}
                alt={post.coverImage.alt ?? post.titleEn ?? ""}
                sizes={IMG_SIZES.container}
                priority
                className="w-full h-auto rounded-2xl border border-line block"
              />
```

(The cover is the above-fold LCP element on posts that have one → `priority`. String mode: local `/blog/*.webp` paths pass through untouched; a future Sanity-hosted cover gets srcset+transforms automatically.)

- [ ] **Step 2: EN author avatar — use AppImage (mixed-origin 28px thumb)**

Replace:

```tsx
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={post.author.photoUrl}
                    alt={post.author.name}
                    width={28}
                    height={28}
                    className="rounded-full border border-line block"
                  />
```

with:

```tsx
                  <AppImage
                    src={post.author.photoUrl}
                    alt={post.author.name}
                    width={28}
                    height={28}
                    sizes="28px"
                    className="rounded-full border border-line block"
                  />
```

- [ ] **Step 3: EN og:image — downscale Sanity originals**

Line ~66, change:

```tsx
  const ogUrl = post.ogImage?.url ?? post.coverImage?.src;
```

to:

```tsx
  const ogUrl = post.ogImage?.url
    ? sanityCdn(post.ogImage.url, { w: 1200, q: 70 })
    : post.coverImage?.src;
```

Line ~128, change:

```tsx
  const imageUrl = post.ogImage?.url ?? coverAbs ?? undefined;
```

to:

```tsx
  const imageUrl = post.ogImage?.url
    ? sanityCdn(post.ogImage.url, { w: 1200, q: 70 })
    : (coverAbs ?? undefined);
```

- [ ] **Step 4: Add EN imports**

```tsx
import { sanityCdn } from "@/lib/shared/sanity-cdn";
import { AppImage } from "@/lib/shared/app-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { SanityImg } from "@/lib/shared/sanity-image";
```

- [ ] **Step 5: Repeat Steps 1–4 in the UK page**

`src/app/(uk)/blog/[slug]/page.tsx` mirrors the EN page (cover at ~254 uses `post.title` instead of `post.titleEn`; same avatar and og blocks). Apply identical changes, preserving the UK alt/fallback expressions exactly as found.

- [ ] **Step 6: renderBlogImage — route through SanityImg**

In `src/lib/shared/sanity-portable.tsx`, replace the `<img …>` inside `renderBlogImage` (~lines 343-349):

```tsx
      <img
        src={block.asset.url}
        alt={block.alt}
        loading="lazy"
        width={block.asset.metadata?.dimensions?.width}
        height={block.asset.metadata?.dimensions?.height}
      />
```

with:

```tsx
      <SanityImg
        image={{ asset: block.asset }}
        alt={block.alt}
        sizes={IMG_SIZES.prose}
      />
```

Add imports at the top of the file:

```tsx
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { SanityImg } from "@/lib/shared/sanity-image";
```

(If `block.asset`'s type lacks fields vs `SanityImageLike`, the structural type accepts it — `url` + optional `metadata` is all it needs. Do NOT cast; if it errors, fix the `SanityImageLike` type, not the call site.)

- [ ] **Step 7: Typecheck + verify + commit**

Run: `npm run typecheck` → exit 0.
Run: `npm run dev`, open `http://localhost:3000/en/blog/website-cost-2026-breakdown` — cover renders, avatar goes through `/_next/image?…w=32`, page HTML contains no raw full-res `cdn.sanity.io` URLs without `?auto=format`.

```bash
git add "src/app/(en)/en/blog/[slug]/page.tsx" "src/app/(uk)/blog/[slug]/page.tsx" src/lib/shared/sanity-portable.tsx
git commit -m "refactor(images): blog covers/avatars/figures through standardized primitives; downscale og:image"
```

---

### Task 8: Migrate pull-quote swiper (Sanity mockups with LQIP)

**Files:**
- Modify: `src/components/homepage/pull-quote-swiper/client.tsx` (two `<Image>` usages, ~lines 44-52 and ~92-101)

- [ ] **Step 1: Replace both `next/image` usages with string-mode `SanityImg`**

Current shape (left mockup; right is analogous with `300px/380px` sizes and `800×500` fallbacks):

```tsx
<Image
  src={slide.mockupLeft.src}
  ...
  sizes="(max-width: 900px) 0px, (max-width: 1100px) 220px, 280px"
  width={slide.mockupLeft.width ?? 400}
  height={slide.mockupLeft.height ?? 800}
  placeholder={slide.mockupLeft.lqip ? "blur" : undefined}
  blurDataURL={slide.mockupLeft.lqip}
/>
```

Replace with (preserve each usage's exact `sizes`, `alt`, `className`, and fallback dims as found in the file):

```tsx
<SanityImg
  image={slide.mockupLeft.src}
  alt={slide.mockupLeft.alt ?? ""}
  sizes="(max-width: 900px) 0px, (max-width: 1100px) 220px, 280px"
  width={slide.mockupLeft.width ?? 400}
  height={slide.mockupLeft.height ?? 800}
  lqip={slide.mockupLeft.lqip}
  widths={[280, 400, 560, 800]}
/>
```

(If the current code has no `alt` field on the slide type, keep whatever alt expression exists today — read the file first.) Remove the `next/image` import; add `import { SanityImg } from "@/lib/shared/sanity-image";`.

- [ ] **Step 2: Typecheck + verify + commit**

Run: `npm run typecheck` → exit 0. Dev-check the homepage swiper renders with blur-up.

```bash
git add src/components/homepage/pull-quote-swiper/client.tsx
git commit -m "refactor(images): pull-quote mockups via SanityImg with LQIP"
```

---

### Task 9: Migrate local `next/image` call sites to `AppImage`

**Files:**
- Modify: `src/app/(en)/en/pricing/page.tsx` (3 images, lines ~207, ~239, ~281)
- Modify: `src/app/(uk)/pricing/page.tsx` (3 images, lines ~194, ~225, ~267)
- Modify: `src/app/(en)/en/process/page.tsx` (~line 128)
- Modify: `src/app/(uk)/process/page.tsx` (~line 152)
- Modify: `src/components/blocks/hero/index.tsx` (~line 306)
- Modify: `src/components/blocks/launch-cta/index.tsx` (~line 60)
- Modify: `src/components/calculator/SocialProof.tsx` (~lines 19, 59)
- Modify: `src/components/homepage/industries.tsx` (~line 136)
- Modify: `src/components/blocks/value-stack/index.tsx` (~lines 169, 276)
- Modify: `src/components/about/sections.tsx` (~lines 193, 578)

For every file: replace `import Image from "next/image";` with `import { AppImage } from "@/lib/shared/app-image";` and rename the JSX tag `Image` → `AppImage`. Where `sizes` already exists, keep it verbatim. The specific additions:

- [ ] **Step 1: Pricing pages (EN + UK) — add `sizes`**

Each of the six images follows this pattern; apply to all (included/not-included/payment, both locales):

```tsx
          <AppImage
            src="/included.webp"
            alt="What is included in all Code-Site.Art packages"
            width={1600}
            height={1124}
            sizes={IMG_SIZES.half}
          />
```

Add `import { IMG_SIZES } from "@/lib/shared/image-sizes";` to both pages.

- [ ] **Step 2: Process pages (EN + UK) — same pattern**

```tsx
          <AppImage
            src="/communication.webp"
            alt={/* keep existing alt */}
            width={1600}
            height={1289}
            sizes={IMG_SIZES.half}
          />
```

(+ `IMG_SIZES` import in both.)

- [ ] **Step 3: hero, SocialProof, industries, value-stack, about portrait — mechanical swap**

These already have correct `sizes`/`priority`/`quality` props. Swap import + tag name only. `about/sections.tsx` portrait keeps `fill`, `priority`, `fetchPriority="high"`, `sizes="(max-width: 960px) 92vw, 440px"`.

- [ ] **Step 4: launch-cta — swap + tighten `sizes`**

The CSS caps the rendered width near 720px while `sizes` claims `60vw` on desktop. Change to:

```tsx
          <AppImage
            src="/home/launch-cta-devices.webp"
            alt="Website mockup on a laptop and smartphone"
            width={2074}
            height={1355}
            sizes="(max-width: 1024px) 90vw, 720px"
            {/* keep remaining existing props (priority={false} can be dropped — lazy is the default) */}
          />
```

- [ ] **Step 5: about CMS screenshot (~line 578) — add `sizes`**

```tsx
                <AppImage
                  src={c.cms.src}
                  alt={c.cms.alt}
                  width={1600}
                  height={1000}
                  sizes={IMG_SIZES.half}
                />
```

(Keep the actual current width/height values found in the file; add `IMG_SIZES` import.)

- [ ] **Step 6: Typecheck + build + commit**

Run: `npm run typecheck` → exit 0.
Run: `npm run build` → succeeds (catches any route-level regression).

```bash
git add "src/app/(en)/en/pricing/page.tsx" "src/app/(uk)/pricing/page.tsx" "src/app/(en)/en/process/page.tsx" "src/app/(uk)/process/page.tsx" src/components/blocks/hero/index.tsx src/components/blocks/launch-cta/index.tsx src/components/calculator/SocialProof.tsx src/components/homepage/industries.tsx src/components/blocks/value-stack/index.tsx src/components/about/sections.tsx
git commit -m "refactor(images): local next/image call sites to AppImage with explicit sizes"
```

---

### Task 10: Migrate raw local `<img>` call sites + mark exceptions

**Files:**
- Modify: `src/components/about/team-section.tsx` (~lines 189, 210)
- Modify: `src/components/blocks/team-cards/index.tsx` (~line 117)
- Modify: `src/components/vs-constructors/index.tsx` (~lines 307, 321)
- Modify: `src/components/vs-freelancers/index.tsx` (~lines 309, 323)
- Modify: `src/components/blocks/case/index.tsx` (~line 256)
- Modify: `src/components/homepage/marquee.tsx` (~line 43 — exception comment only)
- Modify: `src/components/calculator/CalculatorControls.tsx` (~line 383 — exception comment + lazy)

- [ ] **Step 1: team-section card photo (~line 189)**

```tsx
              <AppImage
                src={member.image}
                alt={member.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw"
                className="object-cover object-top"
                onError={() => setHasError(true)}
              />
```

Parent must be positioned: the wrapping div already has `aspect-square`; add `relative` to its className if not present. Modal variant (~line 210): same swap with `sizes="(max-width: 640px) 92vw, 420px"`, keep `onError`.

- [ ] **Step 2: team-cards (~line 117)**

```tsx
        {m.photo ? (
          <AppImage
            src={m.photo}
            alt={m.name}
            fill
            sizes="(min-width: 1024px) 25vw, 65vw"
            className="object-cover"
          />
        ) : (
```

The parent div (line 115) already has `relative` and `aspect-square` — fill works as-is. The `[&>img]` utility selectors keep applying; remove them from the parent className if they conflict visually (check in dev).

- [ ] **Step 3: vs-constructors + vs-freelancers admin screenshots (4 usages)**

Each becomes (parents have `aspect-[16/9]` / `aspect-[9/16]`; add `relative` if missing):

```tsx
                <AppImage
                  src="/sanity-studio/admin-desktop.png"
                  alt={c.admin.desktopAlt}
                  fill
                  sizes="(min-width: 961px) 50vw, 92vw"
                  className="object-cover object-top"
                />
```

(Mobile variant: same with `admin-mobile.png` / `mobileAlt`.)

- [ ] **Step 4: case block shot (~line 256)**

The wrapper (`SHOT_IMG_WRAP_CLASS`) is absolutely positioned, so `fill` works:

```tsx
        {src ? (
          <AppImage
            src={src}
            alt={alt}
            fill
            sizes={IMG_SIZES.cardThird}
            className="object-cover object-top"
          />
        ) : (
```

(+ imports for `AppImage` and `IMG_SIZES`.)

- [ ] **Step 5: marquee — documented exception**

Above the `<img` in `src/components/homepage/marquee.tsx` add:

```tsx
            // eslint-disable-next-line @next/next/no-img-element -- exception per docs/images.md: 2–12 KB logo strip rendered twice for the loop; optimizer round-trips cost more than they save
```

(Keep `loading="lazy" decoding="async"` as-is.)

- [ ] **Step 6: CalculatorControls preview — documented exception + lazy**

```tsx
                      {/* eslint-disable-next-line @next/next/no-img-element -- exception per docs/images.md: SVG preview, default loader doesn't optimize SVG */}
                      <img
                        src={firstPreview.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded-lg"
                      />
```

- [ ] **Step 7: Typecheck + dev visual check + commit**

Run: `npm run typecheck` → exit 0. Dev-check `/about` (team grid + modal), homepage (marquee, case cards), `/en/vs-constructors`, calculator.

```bash
git add src/components/about/team-section.tsx "src/components/blocks/team-cards/index.tsx" src/components/vs-constructors/index.tsx src/components/vs-freelancers/index.tsx "src/components/blocks/case/index.tsx" src/components/homepage/marquee.tsx src/components/calculator/CalculatorControls.tsx
git commit -m "refactor(images): raw img call sites to AppImage; mark SVG/marquee exceptions"
```

---

### Task 11: ESLint enforcement

**Files:**
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Add the guard blocks**

Append to the `config` array (before `export default config;`):

```js
  {
    // Standardized image handling (docs/images.md): every image goes through
    // AppImage (/public + non-Sanity remotes, via next/image) or SanityImg
    // (Sanity CDN transforms). Raw <img> needs an inline disable comment with
    // a reason; direct next/image imports are only allowed in app-image.tsx.
    rules: {
      "@next/next/no-img-element": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/image",
              message:
                "Use AppImage (@/lib/shared/app-image) for /public+remote images or SanityImg (@/lib/shared/sanity-image) for Sanity images. See docs/images.md.",
            },
          ],
        },
      ],
    },
  },
  {
    // The two canonical image primitives + Satori image-generation files
    // (next/og renders <img> to a bitmap, not the DOM).
    files: [
      "src/lib/shared/app-image.tsx",
      "src/lib/shared/sanity-image.tsx",
      "src/app/**/opengraph-image.tsx",
      "src/app/apple-icon.tsx",
      "src/app/icon.tsx",
      "src/app/logo-512.png/route.tsx",
      "src/lib/server/og/**",
    ],
    rules: {
      "no-restricted-imports": "off",
      "@next/next/no-img-element": "off",
    },
  },
```

- [ ] **Step 2: Run lint, fix stragglers**

Run: `npm run lint`
Expected: clean. If any `<img>`/`next/image` usages surface that earlier tasks missed (e.g. the disabled `_efedra-clinic` draft, deleted in Task 12 — if lint flags it now, add a file-level disable comment and note it for Task 12), migrate them by the same rules: Sanity URL → `SanityImg`, local → `AppImage`, SVG/tiny-logo → disable comment with reason.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.mjs
git commit -m "chore(lint): enforce AppImage/SanityImg as the only image entry points"
```

---

### Task 12: Delete dead image assets + superseded draft route

**Context:** `/portfolio/efedra-clinic` is live from Sanity (verified on the deployed site); the local draft `src/app/(uk)/portfolio/_efedra-clinic/` and its `public/EfedraCaseCreenshots/` assets (~2.3 MB) are superseded. `public/about/{hero,differences,values-logo}.webp` (~830 KB) have zero references in `src/`.

- [ ] **Step 1: Re-verify zero references (guard against drift since the audit)**

```bash
grep -rn "EfedraCaseCreenshots" src/ | grep -v "_efedra-clinic" | grep -v "_nbyg-kobenhavn"
grep -rn "about/hero.webp\|differences.webp\|values-logo.webp" src/
```

Expected: no output from either. If anything matches, STOP and migrate that call site first.

- [ ] **Step 2: Drop the stale cover reference from the nbyg drafts**

In both `src/app/(uk)/portfolio/_nbyg-kobenhavn/page.tsx` and `src/app/(en)/en/portfolio/_nbyg-kobenhavn/page.tsx` (line ~74), delete the line:

```tsx
    coverImage: "/EfedraCaseCreenshots/efedra-main-after.png",
```

(`coverImage` is optional — the card falls back to its gradient.)

- [ ] **Step 3: Delete the superseded draft route and dead assets**

```bash
git rm -r "src/app/(uk)/portfolio/_efedra-clinic"
git rm -r public/EfedraCaseCreenshots
git rm public/about/hero.webp public/about/differences.webp public/about/values-logo.webp
```

- [ ] **Step 4: Typecheck + build + commit**

Run: `npm run typecheck && npm run build` → both succeed.

```bash
git add -A
git commit -m "chore(assets): remove superseded efedra draft route and ~3.1MB of unreferenced images"
```

---

### Task 13: Documentation (docs/images.md + CLAUDE.md)

**Files:**
- Create: `docs/images.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Create `docs/images.md`**

```markdown
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
   enables Studio crops (`?rect=`), CLS-safe `width`/`height`, and LQIP.
   When adding new GROQ image projections, fetch
   `asset->{ _id, url, metadata { lqip, dimensions } }` plus `crop` (see
   `IMAGE_WITH_ALT` in `src/lib/server/sanity-queries.ts`).
5. **og:image:** social crawlers don't read srcset — wrap Sanity URLs in
   `sanityCdn(url, { w: 1200, q: 70 })` (see blog `[slug]` pages).
6. **`fill` needs a positioned parent** (`relative`/`absolute`) with a fixed
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
```

- [ ] **Step 2: Add an Images section to `CLAUDE.md`**

Insert after the `## Layout conventions` section:

```markdown
## Images (read before adding/changing any image)

**Required:** [`docs/images.md`](docs/images.md)

- Sanity-hosted → `<SanityImg>` (`@/lib/shared/sanity-image`) — Sanity CDN transforms; never route Sanity images through `/_next/image`.
- `/public` or non-Sanity remote → `<AppImage>` (`@/lib/shared/app-image`).
- `sizes` is mandatory on both — use `IMG_SIZES` presets (`@/lib/shared/image-sizes`).
- No direct `next/image` imports, no raw `<img>` (ESLint errors). Exceptions (SVG, marquee logos) need a disable comment citing docs/images.md.
- og:image URLs from Sanity: wrap in `sanityCdn(url, { w: 1200, q: 70 })`.
```

- [ ] **Step 3: Commit**

```bash
git add docs/images.md CLAUDE.md
git commit -m "docs(images): image-handling standard + CLAUDE.md pointer"
```

---

### Task 14: Final verification

- [ ] **Step 1: Full gates**

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

Expected: all pass.

- [ ] **Step 2: Guard greps — no strays**

```bash
grep -rln "from \"next/image\"" src/ --include=*.tsx
```

Expected output: exactly `src/lib/shared/app-image.tsx`.

```bash
grep -rln "<img" src/ --include=*.tsx
```

Expected output: only `src/lib/shared/sanity-image.tsx`, `src/components/homepage/marquee.tsx`, `src/components/calculator/CalculatorControls.tsx` (+ Satori og files if they use `<img>`).

- [ ] **Step 3: Runtime spot checks (`npm run dev`)**

For each page, view source / devtools network and confirm:

| Page | Check |
|---|---|
| `/` (homepage) | hero via `/_next/image` with `fetchpriority=high`; case cards via `cdn.sanity.io/...auto=format&w=` with 4-width srcset |
| `/portfolio/efedra-clinic` | screenshots load from `cdn.sanity.io` (NOT `/_next/image`), srcset capped at intrinsic width, network tab shows ≤ ~60 KB per screenshot at desktop width |
| `/en/blog/website-cost-2026-breakdown` | cover eager+priority, avatar via `/_next/image?…w=32` |
| `/en/pricing` | included/not-included/payment images request ≤ `w=828` candidates at 1440px viewport (was `w=1920`) |
| `/about` | portrait LCP eager; team grid lazy via `/_next/image` |

- [ ] **Step 4: Compare against production**

The deployed reference is https://code-site-solution.vercel.app. After this ships, re-measure the two audit numbers: case-page screenshot payload (was 209 KB → expect ≤ ~60 KB at desktop) and confirm `?rect=` appears for any CMS image with a Studio crop.

---

## Self-review notes

- **Out of scope (deliberate):** Sanity hotspot support (needs `fit=crop` + aspect plumbing; YAGNI until a design needs fixed-aspect CMS crops — `cropRect` is the extension point); migrating `case-card-item.ts` from flattened `coverImage.src` strings to full image objects (would enable crops on cards; follow-up); component-level visual regression tests (no component test infra in repo — helpers are unit-tested, components verified by build + runtime checks).
- **Known judgment calls:** blog covers use `priority` even though some posts lack covers (the conditional render already guards this); `launch-cta` keeps its 2074px source asset (570 KB on disk, but runtime serves 74 KB AVIF via optimizer — disk-only cost, not worth a re-export task).
- **Line numbers** are as of commit `534438c`; they drift — always locate by the quoted code, not the number.
