import type { NextRequest } from "next/server";

import { OG_CONTENT_TYPE, renderOgCard } from "@/lib/server/og/card";

/**
 * Stable social-card endpoint.
 *
 * The file-based `[slug]/opengraph-image.tsx` routes cannot be linked from
 * metadata: Next serves them at a build-hashed path (`/opengraph-image-1gevu6`)
 * that changes between deploys, and declaring `openGraph` in metadata
 * suppresses the automatic hand-off that would otherwise fill it in. So pages
 * without their own artwork need a URL we control.
 *
 * Renders the same branded card as those routes, with Cyrillic-capable fonts.
 *
 * Query: `?title=…&eyebrow=…`. Both are clamped — this is a public endpoint
 * and the card is a fixed layout, not a free-form image generator.
 */

export const runtime = "nodejs";
// A card is a pure function of its query string, so it can be cached hard.
export const revalidate = 86400;

const TITLE_MAX = 140;
const EYEBROW_MAX = 40;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const title = (params.get("title") ?? "Code-Site.Art").slice(0, TITLE_MAX);
  const eyebrow = (params.get("eyebrow") ?? "Code-Site.Art").slice(0, EYEBROW_MAX);

  const image = await renderOgCard({ title, eyebrow });
  // renderOgCard returns an ImageResponse; add caching headers for scrapers,
  // which re-fetch the same card every time a link is shared.
  image.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
  );
  image.headers.set("Content-Type", OG_CONTENT_TYPE);
  return image;
}
