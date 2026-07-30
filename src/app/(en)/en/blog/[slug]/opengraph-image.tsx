import { fetchBlogPost } from "@/components/blog-post-page/data";
import { pickLocalized } from "@/lib/shared/pick-localized";
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
  const post = await fetchBlogPost(slug, "en");
  const title =
    pickLocalized(post?.metaTitle, "en") ??
    pickLocalized(post?.title, "en") ??
    "Article";
  return renderOgCard({ title, eyebrow: "Article" });
}
