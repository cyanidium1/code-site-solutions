import type { Metadata } from "next";

import {
  CasePageView,
  buildCaseStudyMetadata,
  fetchCaseStudies,
  fetchCaseStudy,
} from "@/components/case-page";
import { hasLocaleContent } from "@/lib/shared/locale-content";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const cases = await fetchCaseStudies();
  // Only emit RU params for cases that actually have RU content.
  const checked = await Promise.all(
    cases.map(async (c) => {
      const doc = await fetchCaseStudy(c.slug);
      return doc && hasLocaleContent(doc, "ru") ? { slug: c.slug } : null;
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
  return buildCaseStudyMetadata(slug, "ru");
}

export default async function PortfolioCasePageRu({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CasePageView slug={slug} locale="ru" />;
}
