import type { Metadata } from "next";

import {
  CasePageView,
  buildCaseStudyMetadata,
  fetchCaseStudies,
  fetchCaseStudy,
  hasEnglishCaseContent,
} from "@/components/case-page";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const cases = await fetchCaseStudies();
  // Only emit EN params for cases that actually have EN content.
  const checked = await Promise.all(
    cases.map(async (c) => {
      const doc = await fetchCaseStudy(c.slug);
      return doc && hasEnglishCaseContent(doc) ? { slug: c.slug } : null;
    }),
  );
  return checked.filter((c): c is { slug: string } => c !== null);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildCaseStudyMetadata(slug, "en");
}

export default async function PortfolioCasePageEn({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CasePageView slug={slug} locale="en" />;
}
