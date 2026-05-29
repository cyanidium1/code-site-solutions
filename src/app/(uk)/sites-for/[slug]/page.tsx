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
  return buildIndustryMetadata(slug, "uk");
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <IndustryPageView slug={slug} locale="uk" />;
}
