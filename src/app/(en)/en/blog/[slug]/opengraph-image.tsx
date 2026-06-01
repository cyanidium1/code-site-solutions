import { sanityFetch } from "@/lib/server/sanity-fetch";
import { BLOG_POST_BY_EN_SLUG_QUERY } from "@/lib/server/sanity-queries";
import type { BlogPostDoc } from "@/types/sanity";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/server/og/card";

export const alt = "Code-Site.Art — blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<BlogPostDoc | null>({
    query: BLOG_POST_BY_EN_SLUG_QUERY,
    params: { slug },
    revalidate: 300,
    tags: [`blogPost:en:${slug}`],
  });
  const title = post?.metaTitleEn ?? post?.titleEn ?? "Article";
  return renderOgCard({ title, eyebrow: "Article" });
}
