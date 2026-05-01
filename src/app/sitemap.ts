import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";
import { sanityFetch } from "@/lib/sanity/fetch";
import { INDUSTRY_PAGES_QUERY } from "@/lib/sanity/queries";
import type { IndustryPageRef } from "@/lib/sanity/types";

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
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const industryPages = await sanityFetch<IndustryPageRef[]>({
    query: INDUSTRY_PAGES_QUERY,
    revalidate: 3600,
  }).catch(() => [] as IndustryPageRef[]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_ORIGIN}${path === "/" ? "" : path}`,
      lastModified,
      changeFrequency,
      priority,
    }),
  );

  const industryEntries: MetadataRoute.Sitemap = industryPages.map((p) => ({
    url: `${SITE_ORIGIN}/sites-for/${p.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...industryEntries];
}
