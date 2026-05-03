import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";
import { sanityFetch } from "@/lib/sanity/fetch";
import { INDUSTRY_PAGES_QUERY } from "@/lib/sanity/queries";
import type { IndustryPageRef } from "@/lib/sanity/types";
import { EN_INDUSTRY_SLUGS } from "@/lib/i18n-routes";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.8 },
  { path: "/portfolio/efedra-clinic", changeFrequency: "monthly", priority: 0.7 },
  { path: "/calculator", changeFrequency: "monthly", priority: 0.7 },
  { path: "/vs-wordpress", changeFrequency: "monthly", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const industryPages = await sanityFetch<IndustryPageRef[]>({
    query: INDUSTRY_PAGES_QUERY,
    revalidate: 3600,
  }).catch(() => [] as IndustryPageRef[]);

  // Routes that are also published under /en. Used to attach hreflang
  // alternates and emit the EN counterpart in the sitemap.
  const EN_LOCALIZED_PATHS = new Set<string>(["/", "/vs-wordpress"]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(
    ({ path, changeFrequency, priority }) => {
      const url = `${SITE_ORIGIN}${path === "/" ? "" : path}`;
      if (!EN_LOCALIZED_PATHS.has(path)) {
        return [{ url, lastModified, changeFrequency, priority }];
      }
      const enUrl = `${SITE_ORIGIN}/en${path === "/" ? "" : path}`;
      const languages = {
        uk: url,
        en: enUrl,
        "x-default": url,
      };
      return [
        {
          url,
          lastModified,
          changeFrequency,
          priority,
          alternates: { languages },
        },
        {
          url: enUrl,
          lastModified,
          changeFrequency,
          priority,
          alternates: { languages },
        },
      ];
    },
  );

  // EN_INDUSTRY_SLUGS is imported from @/lib/i18n-routes — single source of
  // truth shared with the locale switcher + header dropdown.
  const industryEntries: MetadataRoute.Sitemap = industryPages.flatMap((p) => {
    const ukUrl = `${SITE_ORIGIN}/sites-for/${p.slug}`;
    const hasEn = EN_INDUSTRY_SLUGS.has(p.slug);
    const ukEntry: MetadataRoute.Sitemap[number] = {
      url: ukUrl,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
    if (hasEn) {
      const enUrl = `${SITE_ORIGIN}/en/sites-for/${p.slug}`;
      const languages = {
        uk: ukUrl,
        en: enUrl,
        "x-default": ukUrl,
      };
      ukEntry.alternates = { languages };
      const enEntry: MetadataRoute.Sitemap[number] = {
        url: enUrl,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: { languages },
      };
      return [ukEntry, enEntry];
    }
    return [ukEntry];
  });

  return [...staticEntries, ...industryEntries];
}
