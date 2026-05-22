import { sanityFetch } from "@/lib/sanity/fetch";
import { HOMEPAGE_TESTIMONIALS_QUERY } from "@/lib/sanity/queries";
import { loc } from "@/lib/sanity/locale";
import { hasEnCase } from "@/constants/i18n-routes";
import type { Locale, Testimonial } from "@/types/sanity";

export type TestimonialAsset = {
  src: string;
  alt: string;
  lqip?: string;
  width?: number;
  height?: number;
};

export type TestimonialSlide = {
  key: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  linkedinUrl?: string;
  mockupLeft?: TestimonialAsset;
  mockupRight?: TestimonialAsset;
  caseHref?: string;
  caseLabel?: string;
};

/** Up to 2 letters, uppercased, from the first words of authorName. */
function deriveInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function toAsset(
  img: Testimonial["mockupLeft"],
  locale: Locale,
): TestimonialAsset | undefined {
  if (!img?.asset?.url) return undefined;
  return {
    src: img.asset.url,
    alt: loc(img.alt, locale) || "",
    lqip: img.asset.metadata?.lqip,
    width: img.asset.metadata?.dimensions?.width,
    height: img.asset.metadata?.dimensions?.height,
  };
}

/**
 * EN-locale URL guard mirrors `refToCaseItem` in
 * src/components/homepage/index.tsx — if the case doesn't have EN content
 * we fall back to the UA URL rather than bouncing the user to a 404.
 */
function resolveCaseHref(
  slug: string | undefined,
  locale: Locale,
): string | undefined {
  if (!slug) return undefined;
  if (locale === "en") {
    return hasEnCase(slug) ? `/en/portfolio/${slug}` : `/portfolio/${slug}`;
  }
  return `/portfolio/${slug}`;
}

/**
 * Fetches all `featured` testimonials and shapes them into a render-ready
 * payload for the homepage PullQuoteSwiper. Drops entries with empty quotes
 * so an unfilled Sanity row doesn't render a blank slide.
 *
 * 5-minute revalidate matches the conservative pattern used elsewhere in the
 * codebase. Cache tag `homepage-testimonials` lets a future on-demand
 * revalidate hook target this single dataset.
 */
export async function fetchTestimonialSlides(
  locale: Locale,
): Promise<TestimonialSlide[]> {
  // Soft-fail to [] when Sanity is unconfigured (no env) or query fails — the
  // RSC shell then renders `null` and the homepage simply skips the section,
  // matching the established pattern from `fetchCaseStudies` in case-page.
  const docs = await sanityFetch<Testimonial[] | null>({
    query: HOMEPAGE_TESTIMONIALS_QUERY,
    revalidate: 300,
    tags: ["homepage-testimonials"],
  }).catch(() => null);
  if (!docs?.length) return [];

  return docs
    .map<TestimonialSlide>((t) => ({
      key: t._id,
      quote: loc(t.quote, locale) || "",
      authorName: t.authorName || "",
      authorRole: loc(t.authorRole, locale) || "",
      authorInitials: t.authorInitials || deriveInitials(t.authorName),
      linkedinUrl: t.linkedinUrl,
      mockupLeft: toAsset(t.mockupLeft, locale),
      mockupRight: toAsset(t.mockupRight, locale),
      caseHref: resolveCaseHref(t.caseRef?.slug, locale),
      caseLabel: loc(t.caseLabel, locale) || undefined,
    }))
    .filter((s) => s.quote.trim().length > 0);
}
