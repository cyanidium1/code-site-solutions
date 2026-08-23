import type { Metadata } from "next";

import {
  IndustryPageView,
  buildIndustryMetadata,
  fetchIndustryPages,
} from "@/components/industry-page";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await fetchIndustryPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildIndustryMetadata(slug, "en");
}

export default async function IndustryPageEn({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <IndustryPageView slug={slug} locale="en" />;
}
