import type { Metadata } from "next";

import { PricingView, pricingMetadata } from "@/components/pricing-page";
import { PRICING_COPY_RU } from "@/content/ru/pricing";

export const metadata: Metadata = pricingMetadata("ru", PRICING_COPY_RU);

export default function PricingPageRu() {
  return <PricingView locale="ru" copy={PRICING_COPY_RU} />;
}
