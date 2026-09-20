import type { Metadata } from "next";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PackagePageView, packagePageMetadata } from "@/components/landing-page/package-page";
import { CORPORATE_EN as CONTENT } from "@/content/en/corporate-site";

export const metadata: Metadata = packagePageMetadata(CONTENT, "en");

export default function EnCorporateSitePage() {
  return (
    <>
      <HpHeader />
      <PackagePageView locale="en" content={CONTENT} />
      <HpFooter />
    </>
  );
}
