import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // NOTE: do NOT add "/_next/static/" here. Googlebot renders pages;
        // blocking JS/CSS degrades rendering and goes against Google's
        // guidance. The `_next/static/*.js` rows under "Crawled - currently
        // not indexed" are harmless noise, not a problem to fix.
        disallow: ["/stories/"],
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
