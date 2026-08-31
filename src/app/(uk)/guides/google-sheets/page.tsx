import type { Metadata } from "next";

import { GuidePage } from "@/components/guide-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { buildGuideMetadata } from "@/lib/shared/guide-page";
import { GUIDE_GOOGLE_SHEETS_UK as CONTENT } from "@/content/uk/guides/google-sheets";

export const metadata: Metadata = buildGuideMetadata({
  content: CONTENT,
  path: "/guides/google-sheets",
});

export default function GoogleSheetsGuidePage() {
  return (
    <>
      <HpHeader />
      <GuidePage content={CONTENT} />
      <HpFooter />
    </>
  );
}
