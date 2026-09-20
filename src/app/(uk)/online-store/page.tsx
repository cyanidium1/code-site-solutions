import type { Metadata } from "next";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PackagePageView, packagePageMetadata } from "@/components/landing-page/package-page";
import { ONLINE_STORE_UK as CONTENT } from "@/content/uk/online-store";

export const metadata: Metadata = packagePageMetadata(CONTENT, "uk");

export default function OnlineStorePage() {
  return (
    <>
      <HpHeader />
      <PackagePageView locale="uk" content={CONTENT} />
      <HpFooter />
    </>
  );
}
