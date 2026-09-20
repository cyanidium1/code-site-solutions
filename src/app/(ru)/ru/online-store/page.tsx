import type { Metadata } from "next";

import { HpFooter, HpHeader } from "@/components/homepage";
import { PackagePageView, packagePageMetadata } from "@/components/landing-page/package-page";
import { ONLINE_STORE_RU as CONTENT } from "@/content/ru/online-store";

export const metadata: Metadata = packagePageMetadata(CONTENT, "ru");

export default function RuOnlineStorePage() {
  return (
    <>
      <HpHeader />
      <PackagePageView locale="ru" content={CONTENT} />
      <HpFooter />
    </>
  );
}
