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
  /**
   * Force an output format instead of content-negotiating via `auto=format`.
   * Needed for og:image: social scrapers send a wildcard Accept header, so
   * `auto=format` hands them the original — a 1.2 MB PNG stays a 900 KB PNG.
   */
  fm?: "jpg" | "png" | "webp";
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
  { w, h, q = 60, fit = "max", crop, dims, fm }: CdnOpts = {},
): string {
  if (!isSanityUrl(url)) return url ?? "";
  const u = new URL(url);
  const rect = cropRect(crop, dims);
  if (rect) u.searchParams.set("rect", rect);
  if (fm) u.searchParams.set("fm", fm);
  else u.searchParams.set("auto", "format");
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
  const ladder = widths.length ? widths : DEFAULT_SRCSET_WIDTHS;
  const max = croppedDims(crop, dims)?.width;
  // Cap candidates at intrinsic width — the CDN won't upscale, so larger
  // candidates would all dedupe to the same bytes under different URLs.
  const capped = max
    ? [...new Set([...ladder.filter((w) => w < max), Math.min(max, Math.max(...ladder))])]
    : ladder;
  return capped
    .sort((a, b) => a - b)
    .map((w) => `${sanityCdn(url, { w, q, crop, dims })} ${w}w`)
    .join(", ");
}

/** Open Graph card size. 1.91:1, the ratio Telegram, Slack and X render large. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * A Sanity URL shaped for og:image / twitter:image.
 *
 * Two things matter to a social scraper and neither is the default:
 *   - explicit `fm=jpg`, because scrapers send a wildcard Accept header and
 *     `auto=format` therefore serves them the original PNG (measured on a case
 *     cover: 1.17 MB original, 897 KB with auto=format, 62 KB with fm=jpg);
 *   - a 1200×630 crop, so the preview renders as a wide card rather than a
 *     near-square thumbnail.
 *
 * Returns undefined for a missing URL so callers can fall back to the site
 * default card.
 */
export function sanityOgImage(
  url: string | null | undefined,
): { url: string; width: number; height: number } | undefined {
  if (!url) return undefined;
  if (!isSanityUrl(url)) return { url, ...OG_IMAGE_SIZE };
  return {
    url: sanityCdn(url, {
      w: OG_IMAGE_SIZE.width,
      h: OG_IMAGE_SIZE.height,
      fit: "crop",
      q: 75,
      fm: "jpg",
    }),
    ...OG_IMAGE_SIZE,
  };
}
