import type { Metadata } from "next";

import { PricingView, pricingMetadata } from "@/components/pricing-page";
import { PRICING_COPY_UK } from "@/content/uk/pricing";

export const metadata: Metadata = pricingMetadata("uk", PRICING_COPY_UK);

export default function PricingPage() {
  return <PricingView locale="uk" copy={PRICING_COPY_UK} />;
}
