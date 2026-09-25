import type { Metadata } from "next";

import { ThankYouPage } from "@/components/thank-you-page";
import { THANK_YOU_COPY } from "@/content/thank-you";

const LOC = "uk" as const;

/**
 * Reachable only by submitting a form, and counted by Google Ads as the
 * destination conversion — so it is noindex/nofollow and stays out of the
 * sitemap. Indexing it would put a "thank you" page in the SERP and let
 * organic visitors fire the conversion without ever enquiring.
 */
export const metadata: Metadata = {
  title: THANK_YOU_COPY[LOC].metaTitle,
  description: THANK_YOU_COPY[LOC].metaDescription,
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThankYouPage locale={LOC} />;
}
