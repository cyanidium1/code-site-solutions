import type { Metadata } from "next";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PackagePageView, packagePageMetadata } from "@/components/landing-page/package-page";
import { LANDING_UK as CONTENT } from "@/content/uk/landing";

export const metadata: Metadata = packagePageMetadata(CONTENT, "uk");

export default function LandingPage() {
  return (
    <>
      <HpHeader />
      <PackagePageView locale="uk" content={CONTENT} />
      <HpFooter />
    </>
  );
}
