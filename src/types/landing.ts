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
    /** Stat chips under the hero sub (rendered only by the miniCalc hero). */
    badges?: { label: string; sub: string }[];
  };
  /** Interactive mini-calculator rendered inside the hero (landing page).
   *  When present, the view swaps PageHero for a two-column hero with the
   *  calculator + inline lead form on the right. */
  miniCalc?: {
    /** pricingPlan tier key sent with the lead (landing / corporate / custom). */
    tier: string;
    title: string;
    baseLabel: string;
    baseNote: string;
    basePrice: number;
    /** Currency symbol prefix, e.g. "$" or "£". */
    currency: string;
    blocks: { label: string; note: string; unitPrice: number; max: number };
    options: { id: string; label: string; price: number }[];
    totalLabel: string;
    totalNote: string;
    form: {
      heading: string;
      namePlaceholder: string;
      contactPlaceholder: string;
      submitLabel: string;
      success: string;
      error: string;
      /** Prefix for the auto-built selection summary sent with the lead. */
      summaryTitle: string;
    };
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
  /** Ready-made configuration price table rendered after the price grid. */
  priceTable?: {
    eyebrow: string;
    heading: [string, string];
    headers: string[];
    rows: string[][];
    foot: string;
  };
  /** Case story blocks (image + narrative + stat), alternating sides. */
  stories?: {
    eyebrow: string;
    heading: [string, string];
    items: {
      /** Portfolio slug — supplies the image and the case link. */
      slug: string;
      kicker: string;
      title: string;
      paragraphs: string[];
      stat: { value: string; label: string };
      ctaLabel: string;
    }[];
  };
  /** Photo gallery of works (replaces the examples card grid when set). */
  gallery?: {
    eyebrow: string;
    heading: [string, string];
    sub: string;
    slugs: string[];
    allLabel: string;
    allHref: string;
  };
  /** Optional prose section (used by /seo: why builder/old-WP sites are
   *  harder to promote). Rendered between the price grid and the CTA. */
  platforms?: {
    eyebrow: string;
    heading: [string, string];
    paragraphs: string[];
    bullets: string[];
    foot: string;
    links: { label: string; href: string }[];
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
