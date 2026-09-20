import type { Metadata } from "next";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PackagePageView, packagePageMetadata } from "@/components/landing-page/package-page";
import { ONLINE_STORE_EN as CONTENT } from "@/content/en/online-store";

export const metadata: Metadata = packagePageMetadata(CONTENT, "en");

export default function EnOnlineStorePage() {
  return (
    <>
      <HpHeader />
      <PackagePageView locale="en" content={CONTENT} />
      <HpFooter />
    </>
  );
}
