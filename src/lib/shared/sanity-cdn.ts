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
