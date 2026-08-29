import { fetchCaseStudies, fetchCaseStudy } from "@/components/case-page";
import { loc } from "@/lib/shared/sanity-locale";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/server/og/card";

export const alt = "Code-Site.Art — кейс";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Without generateStaticParams a dynamic-segment opengraph-image route 404s,
// so the card it renders could never actually be linked. Mirrors the params
// of the sibling page.tsx.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const cases = await fetchCaseStudies();
  return cases.map((c) => ({ slug: c.slug }));
}


export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await fetchCaseStudy(slug);
  const title = loc(doc?.title, "uk") || "Кейс";
  return renderOgCard({ title, eyebrow: "Кейс" });
}
