import type { Metadata } from "next";

import { GuidePage } from "@/components/guide-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { GUIDE_GOOGLE_SHEETS_UK as CONTENT } from "@/content/uk/guides/google-sheets";

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  robots: { index: false, follow: false },
};

export default function GoogleSheetsGuidePage() {
  return (
    <>
      <HpHeader />
      <GuidePage content={CONTENT} />
      <HpFooter />
    </>
  );
}
