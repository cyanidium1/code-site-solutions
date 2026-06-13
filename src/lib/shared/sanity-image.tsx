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
      isOpaque?: boolean;
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
  /**
   * Blur-up placeholder override. In object mode the LQIP is auto-applied from
   * metadata for OPAQUE images only (a CSS background never clears, so it would
   * show through transparent pixels). Use this prop in string mode, or to force
   * a blur where auto-detection can't (e.g. you know the image is opaque).
   */
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

  const meta = obj?.asset?.metadata;
  const dims = meta?.dimensions;
  const crop = obj?.crop;
  const shown = croppedDims(crop, dims);
  // Explicit prop wins; otherwise auto-blur from metadata, but only for images
  // with no actual transparency (isOpaque) — the CSS background can't be cleared
  // and would show through transparent pixels. Note isOpaque ≠ !hasAlpha: most
  // PNG screenshots carry an unused alpha channel yet are isOpaque: true.
  const blur = lqip ?? (meta?.isOpaque ? meta.lqip : undefined);

  const cls =
    [fill ? "absolute inset-0 h-full w-full" : "", className]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    // Raw <img> by design — the canonical Sanity primitive; transforms run on
    // Sanity's CDN, not /_next/image (docs/images.md). The no-img-element rule
    // is switched off for this file in eslint.config.mjs.
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
      // eslint-disable-next-line react/forbid-dom-props -- `color:transparent` hides the alt-text flash during load (mirrors next/image); optional LQIP data-URI paints a blur-up that the real image covers on decode
      style={{
        color: "transparent",
        ...(blur
          ? {
              backgroundImage: `url(${blur})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : null),
      }}
    />
  );
}
