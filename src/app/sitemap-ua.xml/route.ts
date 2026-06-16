import { buildSitemapEntries } from "@/lib/server/sitemap-fetch";
import { renderUrlset } from "@/lib/server/sitemap-xml";

export const revalidate = 3600;

export async function GET() {
  const { uk } = await buildSitemapEntries();
  return new Response(renderUrlset(uk), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
