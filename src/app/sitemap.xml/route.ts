import { SITE_ORIGIN } from "@/constants/site";
import { buildSitemapEntries } from "@/lib/server/sitemap-fetch";
import { renderSitemapIndex } from "@/lib/server/sitemap-xml";
import type { SitemapEntry } from "@/lib/server/sitemap-data";

export const revalidate = 3600;

/**
 * ISO timestamp of the newest dated entry (static routes carry no
 * lastModified), or `fallback` when no entry has a real date.
 */
function newestIso(entries: SitemapEntry[], fallback: Date): string {
  const newest = entries.reduce<Date | null>(
    (max, e) =>
      e.lastModified && (!max || e.lastModified > max) ? e.lastModified : max,
    null,
  );
  return (newest ?? fallback).toISOString();
}

export async function GET() {
  const now = new Date();
  const { uk, en, ru } = await buildSitemapEntries();
  const xml = renderSitemapIndex([
    { loc: `${SITE_ORIGIN}/sitemap-ua.xml`, lastmod: newestIso(uk, now) },
    { loc: `${SITE_ORIGIN}/sitemap-en.xml`, lastmod: newestIso(en, now) },
    { loc: `${SITE_ORIGIN}/sitemap-ru.xml`, lastmod: newestIso(ru, now) },
  ]);
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
