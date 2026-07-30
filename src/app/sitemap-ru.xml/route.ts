// Adding a locale: copy this file as sitemap-<locale>.xml/route.ts, swap the
// destructured locale below, and add the new sitemap to the sitemap.xml index.
import { buildSitemapEntries } from "@/lib/server/sitemap-fetch";
import { renderUrlset } from "@/lib/server/sitemap-xml";

export const revalidate = 3600;

export async function GET() {
  const { ru } = await buildSitemapEntries();
  return new Response(renderUrlset(ru), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
