import type { Metadata } from "next";

import { ProposalView, buildProposalMetadata } from "@/components/proposal";

/**
 * `generateStaticParams` тут навмисно немає: інакше в збірку потрапив би
 * перелік адрес усіх чинних КП, а вони приватні. Сторінки рендеряться на
 * запит і кешуються на годину — див. `fetchProposal`.
 */
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildProposalMetadata(slug);
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProposalView slug={slug} />;
}
