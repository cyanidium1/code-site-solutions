import type { SitemapEntry } from "./sitemap-data";

const XML_DECL = '<?xml version="1.0" encoding="UTF-8"?>';
const STYLESHEET = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';
const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
const XHTML_NS = "http://www.w3.org/1999/xhtml";

/** Escape the five XML predefined entities. Applied to every loc/href. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Serialize sitemap entries into a `<urlset>` document (with stylesheet PI). */
export function renderUrlset(entries: SitemapEntry[]): string {
  const urls = entries.map((e) => {
    const alts = e.alternates
      ? Object.entries(e.alternates.languages).map(
          ([lang, href]) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}"/>`,
        )
      : [];
    return [
      "  <url>",
      `    <loc>${escapeXml(e.url)}</loc>`,
      `    <lastmod>${e.lastModified.toISOString()}</lastmod>`,
      `    <changefreq>${e.changeFrequency}</changefreq>`,
      `    <priority>${e.priority.toFixed(1)}</priority>`,
      ...alts,
      "  </url>",
    ].join("\n");
  });
  return [
    XML_DECL,
    STYLESHEET,
    `<urlset xmlns="${SITEMAP_NS}" xmlns:xhtml="${XHTML_NS}">`,
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

/** Serialize a list of child sitemaps into a `<sitemapindex>` document. */
export function renderSitemapIndex(
  items: { loc: string; lastmod: string }[],
): string {
  const sitemaps = items.map((s) =>
    [
      "  <sitemap>",
      `    <loc>${escapeXml(s.loc)}</loc>`,
      `    <lastmod>${escapeXml(s.lastmod)}</lastmod>`,
      "  </sitemap>",
    ].join("\n"),
  );
  return [
    XML_DECL,
    STYLESHEET,
    `<sitemapindex xmlns="${SITEMAP_NS}">`,
    ...sitemaps,
    "</sitemapindex>",
    "",
  ].join("\n");
}
