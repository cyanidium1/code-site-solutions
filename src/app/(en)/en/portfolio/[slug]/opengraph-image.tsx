import { fetchCaseStudy } from "@/components/case-page";
import { loc } from "@/lib/shared/sanity-locale";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/server/og/card";

export const alt = "Code-Site.Art — case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await fetchCaseStudy(slug);
  const title = loc(doc?.title, "en") || "Case study";
  return renderOgCard({ title, eyebrow: "Case study" });
}
