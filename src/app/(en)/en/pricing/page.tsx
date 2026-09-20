import type { Metadata } from "next";

import { PricingView, pricingMetadata } from "@/components/pricing-page";
import { PRICING_COPY_EN } from "@/content/en/pricing";

export const metadata: Metadata = pricingMetadata("en", PRICING_COPY_EN);

export default function PricingPageEn() {
  return <PricingView locale="en" copy={PRICING_COPY_EN} />;
}
