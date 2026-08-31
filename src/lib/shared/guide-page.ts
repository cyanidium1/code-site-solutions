import type { Metadata } from "next";

import { OG_DEFAULT_IMAGE, pageUrl } from "@/constants/site";
import type { GuideContent } from "@/types/guide";

/**
 * Metadata for a service guide under `/guides/*`.
 *
 * Exists because the first guide shipped without it and inherited the root
 * layout's defaults: the Open Graph card advertised the studio ("замовити
 * сайт від $800") and the canonical pointed at the homepage. These pages are
 * sent to a client by direct link — usually pasted into a messenger — so the
 * preview card is the first thing they see, and it has to say what the page
 * is, not sell them a website they already bought.
 *
 * `noindex, nofollow` is set here as well as in the section layout. Open
 * Graph still matters on a noindex page: messengers read og:* regardless of
 * robots, which is the whole point.
 *
 * No hreflang — guides are single-locale by nature, written for one client
 * in the language that client speaks.
 */
export function buildGuideMetadata({
  content,
  path,
}: {
  content: GuideContent;
  /** Absolute site path, e.g. `/guides/google-sheets`. */
  path: string;
}): Metadata {
  const url = pageUrl(path);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: "article",
      locale: "uk_UA",
      url,
      images: [OG_DEFAULT_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
      images: [OG_DEFAULT_IMAGE.url],
    },
  };
}
