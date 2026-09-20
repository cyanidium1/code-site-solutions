import type { Metadata } from "next";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PackagePageView, packagePageMetadata } from "@/components/landing-page/package-page";
import { CORPORATE_UK as CONTENT } from "@/content/uk/corporate-site";

export const metadata: Metadata = packagePageMetadata(CONTENT, "uk");

export default function CorporateSitePage() {
  return (
    <>
      <HpHeader />
      <PackagePageView locale="uk" content={CONTENT} />
      <HpFooter />
    </>
  );
}
