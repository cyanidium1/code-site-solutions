import type { Metadata } from "next";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PackagePageView, packagePageMetadata } from "@/components/landing-page/package-page";
import { LANDING_RU as CONTENT } from "@/content/ru/landing";

export const metadata: Metadata = packagePageMetadata(CONTENT, "ru");

export default function RuLandingPage() {
  return (
    <>
      <HpHeader />
      <PackagePageView locale="ru" content={CONTENT} />
      <HpFooter />
    </>
  );
}
