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
