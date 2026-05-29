import type { Metadata } from "next";

import {
  IndustryPageView,
  buildIndustryMetadata,
} from "@/components/industry-page";

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
