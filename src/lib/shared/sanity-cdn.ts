/**
 * Helpers for Sanity's image CDN transform params.
 *
 * Raw `asset.url` values point at the full-resolution original (often a
 * multi-MB PNG screenshot). Appending `?auto=format&fit=max&w=…&q=…` makes the
 * CDN serve a resized, WebP/AVIF, compressed variant instead. Use these when an
 * image is rendered with a plain `<img>` (not next/image) — e.g. card covers.
 *
 * No-op for non-Sanity URLs (Unsplash, local assets), so it's safe to wrap any
 * cover URL.
 */

const SANITY_IMG = "cdn.sanity.io/images/";

type CdnOpts = { w?: number; h?: number; q?: number; fit?: "max" | "crop" | "clip" };

export function sanityCdn(
  url: string | undefined | null,
  { w, h, q = 60, fit = "max" }: CdnOpts = {},
): string {
  if (!url || !url.includes(SANITY_IMG)) return url ?? "";
  const u = new URL(url);
  u.searchParams.set("auto", "format");
  u.searchParams.set("fit", fit);
  if (w) u.searchParams.set("w", String(w));
  if (h) u.searchParams.set("h", String(h));
  u.searchParams.set("q", String(q));
  return u.toString();
}

/** Build a `srcSet` string across the given widths, or `undefined` for non-Sanity URLs. */
export function sanitySrcSet(
  url: string | undefined | null,
  widths: number[],
  q = 60,
): string | undefined {
  if (!url || !url.includes(SANITY_IMG)) return undefined;
  return widths.map((w) => `${sanityCdn(url, { w, q })} ${w}w`).join(", ");
}
