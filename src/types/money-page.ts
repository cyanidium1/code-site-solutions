import type { RichText } from "@/lib/shared/rich-text";
import type { LandingPageContent } from "@/types/landing";

/**
 * Content shape for the Ads-facing service pages: `/rozrobka-saitiv` and the
 * city pages `/rozrobka-saitiv-{city}` (uk + ru). Rendered by
 * `components/money-page`. Prices and terms never live here as literals —
 * content files interpolate `@/constants/pricing` helpers.
 *
 * Order on the page (TZ v2 §3.4): hero + lead form → packages → what you get
 * → process by days → why code → (city angle, city stories) → cases →
 * testimonials → FAQ → links.
 */
export type MoneyPageContent = {
  metaTitle: string;
  metaDescription: string;
  breadcrumbHome: string;
  breadcrumbSelf: string;
  /** Extra crumb between home and self (city pages: the parent service). */
  breadcrumbParent?: { label: string; href: string };
  hero: {
    eyebrow?: string;
    /** `[plain, em]` — rendered as `{plain} <em>{em}</em>`. */
    headline: [string, string];
    sub: string;
  };
  packages: { heading: string; sub?: string };
  included?: {
    heading: string;
    sub?: string;
    items: { title: string; line: string }[];
    foot?: string;
  };
  process?: {
    heading: string;
    sub?: string;
    steps: { when: string; title: string; body: string }[];
    foot?: string;
  };
  why?: {
    heading: string;
    sub?: string;
    items: { title: string; body: string }[];
    links?: { label: string; href: string }[];
  };
  /** City-specific angle (anti-doorway): why this city's search works so. */
  local?: {
    eyebrow?: string;
    heading: string | [string, string];
    paragraphs: string[];
    bullets?: string[];
    /** Closing line under the bullets. */
    foot?: string;
    links?: { label: string; href: string }[];
  };
  stories?: NonNullable<LandingPageContent["stories"]>;
  cases: {
    eyebrow?: string;
    heading: string | [string, string];
    sub?: string;
    /** Portfolio slugs, in order. Missing slugs are skipped. */
    slugs: string[];
    allLabel: string;
    allHref: string;
  };
  testimonialsHeading?: string;
  faq: {
    heading: string;
    items: { q: string; a: RichText }[];
  };
  /** Navigation to child pages (types, industries, cities). */
  hub?: NonNullable<LandingPageContent["hub"]>;
  related?: {
    heading: string;
    sub?: string;
    links: { label: string; href: string }[];
  };
  bottomForm: { heading: string; sub: string };
};
