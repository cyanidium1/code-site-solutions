import { fetchBlogPost } from "@/components/blog-post-page/data";
import { pickLocalized } from "@/lib/shared/pick-localized";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/server/og/card";

export const alt = "Code-Site.Art — блог";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug, "uk");
  const title =
    pickLocalized(post?.metaTitle, "uk") ??
    pickLocalized(post?.title, "uk") ??
    "Стаття";
  return renderOgCard({ title, eyebrow: "Блог" });
}
