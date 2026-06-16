import { SITE_ORIGIN } from "@/constants/site";
import { buildSitemapEntries } from "@/lib/server/sitemap-fetch";
import { renderSitemapIndex } from "@/lib/server/sitemap-xml";
import type { SitemapEntry } from "@/lib/server/sitemap-data";

export const revalidate = 3600;

/** ISO timestamp of the newest entry, or `fallback` if the list is empty. */
function newestIso(entries: SitemapEntry[], fallback: Date): string {
  if (entries.length === 0) return fallback.toISOString();
  return entries
    .reduce(
      (max, e) => (e.lastModified > max ? e.lastModified : max),
      new Date(0),
    )
    .toISOString();
}

export async function GET() {
  const now = new Date();
  const { uk, en } = await buildSitemapEntries();
  const xml = renderSitemapIndex([
    { loc: `${SITE_ORIGIN}/sitemap-ua.xml`, lastmod: newestIso(uk, now) },
    { loc: `${SITE_ORIGIN}/sitemap-en.xml`, lastmod: newestIso(en, now) },
  ]);
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
