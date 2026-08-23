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
        //
        // SEO audit Aug 2026: the "/stories/" disallow was dropped — that path
        // does not exist (it 308s to /stories, which 404s) and nothing links
        // to it, so the rule protected nothing.
      },
      // The four AI crawlers that feed *search* answers. `*` already allows
      // them; naming them makes the decision explicit and survives future
      // edits to the wildcard block. Keeping them open is deliberate: the
      // studio sells AI-search visibility, so being citable is the point.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ClaudeBot",
          "PerplexityBot",
        ],
        allow: "/",
      },
      // Training-corpus crawlers are a separate decision from search
      // visibility. Left open for now — blocking them would not affect
      // Google Search or AI Overviews. Flip to `disallow: "/"` here if the
      // studio decides its content should stay out of training sets.
      {
        userAgent: ["CCBot", "anthropic-ai", "Google-Extended"],
        allow: "/",
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
