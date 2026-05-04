import type { Metadata } from "next";

import {
  CasePageView,
  buildCaseStudyMetadata,
  fetchCaseStudies,
} from "@/components/case-page";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const cases = await fetchCaseStudies();
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildCaseStudyMetadata(slug, "uk");
}

export default async function PortfolioCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CasePageView slug={slug} locale="uk" />;
}
