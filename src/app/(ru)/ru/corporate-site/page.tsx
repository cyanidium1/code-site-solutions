import type { Metadata } from "next";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PackagePageView, packagePageMetadata } from "@/components/landing-page/package-page";
import { CORPORATE_RU as CONTENT } from "@/content/ru/corporate-site";

export const metadata: Metadata = packagePageMetadata(CONTENT, "ru");

export default function RuCorporateSitePage() {
  return (
    <>
      <HpHeader />
      <PackagePageView locale="ru" content={CONTENT} />
      <HpFooter />
    </>
  );
}
