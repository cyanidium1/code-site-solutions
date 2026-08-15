import type { TurnkeyItem } from "@/components/blocks/turnkey-list";
import type { BentoCell } from "@/types/homepage";
import type { RichText } from "@/lib/shared/rich-text";

/**
 * Content shape for the site-type page "Landing" (`/landing`, `/en/landing`,
 * `/ru/landing`). Data-only (no JSX) so the per-locale files stay .ts;
 * the view (`components/landing-page`) assembles headings from the
 * `[plain, em]` pairs.
 */
export type LandingPageContent = {
  metaTitle: string;
  metaDescription: string;
  breadcrumbHome: string;
  breadcrumbSelf: string;
  hero: {
    eyebrow: string;
    /** `[plain, em]` — rendered as `{plain} <em>{em}</em>`. */
    headline: [string, string];
    sub: string;
  };
  when: {
    eyebrow: string;
    heading: [string, string];
    sub: string;
    fitTitle: string;
    fit: string[];
    notFitTitle: string;
    notFit: string[];
    foot: string;
  };
  included: {
    eyebrow: string;
    heading: [string, string];
    sub: string;
    items: TurnkeyItem[];
    notIncludedTitle: string;
    notIncluded: string[];
    notIncludedFoot: string;
  };
  price: {
    eyebrow: string;
    heading: [string, string];
    cells: BentoCell[];
  };
  calcCta: {
    heading: [string, string];
    sub: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  examples: {
    eyebrow: string;
    heading: [string, string];
    sub: string;
    /** Portfolio slugs to show, in order. Missing slugs are skipped. */
    slugs: string[];
    allLabel: string;
    allHref: string;
  };
  faq: {
    heading: string;
    items: { q: string; a: RichText }[];
  };
};
