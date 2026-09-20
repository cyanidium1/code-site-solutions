import type { Metadata } from "next";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PackagePageView, packagePageMetadata } from "@/components/landing-page/package-page";
import { LANDING_EN as CONTENT } from "@/content/en/landing";

export const metadata: Metadata = packagePageMetadata(CONTENT, "en");

export default function EnLandingPage() {
  return (
    <>
      <HpHeader />
      <PackagePageView locale="en" content={CONTENT} />
      <HpFooter />
    </>
  );
}
