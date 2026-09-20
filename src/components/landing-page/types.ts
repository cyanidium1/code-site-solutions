import type { PackageId } from "@/constants/pricing";
import type { FAQItem } from "@/types/faq";

/** Packages that have their own page (TZ v2 §3.5). */
export type PagePackageId = Extract<PackageId, "landing" | "business" | "shop">;

/** One step of the "process by days" block; `to` omitted = a single day. */
export type ProcessStep = { from: number; to?: number; title: string; body: string };

/** Subscription-builder comparison (/online-store only). */
export type CompareBlock = {
  heading: [string, string];
  sub: string;
  theirsTitle: string;
  /** e.g. «Підписка $30–80/міс × 36 міс = $1 080–2 880 і магазин не ваш». */
  theirsLine: string;
  theirsRows: { name: string; price: string }[];
  theirsPoints: string[];
  oursTitle: string;
  oursLine: string;
  oursPoints: string[];
  /** «Тарифи перевірено 20.09.2026 на сайтах платформ». */
  checked: string;
};

/**
 * Package page content (/landing, /corporate-site, /online-store in every
 * locale). Prices and terms are interpolated from `@/constants/pricing` in
 * the content files — never typed by hand.
 */
export type PackagePageContent = {
  pkg: PagePackageId;
  /** UA root path of the page ("/landing"); locale prefix is added per locale. */
  rootPath: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumbHome: string;
  breadcrumbSelf: string;
  /** Schema.org Service / Offer names. */
  serviceName: string;
  offerName: string;
  eyebrow: string;
  h1: string;
  sub: string;
  badges: { label: string; sub: string }[];
  composition: {
    heading: [string, string];
    includesTitle: string;
    excludesTitle: string;
    excludesFoot: string;
  };
  when?: {
    heading: [string, string];
    fitTitle: string;
    fit: string[];
    notFitTitle: string;
    notFit: string[];
  };
  process: { heading: [string, string]; sub: string; steps: ProcessStep[] };
  compare?: CompareBlock;
  addons: { heading: [string, string]; sub: string; calcLabel: string; calcHref: string };
  payment: { heading: [string, string] };
  cases: { heading: [string, string]; sub: string; slugs: string[]; allLabel: string; allHref: string };
  faq: { heading: string; items: FAQItem[] };
  /** `line` overrides the default «Після запуску: просування від …/міс» (shop SEO is priced separately). */
  seo: { href: string; linkLabel: string; line?: string };
  cta: { heading: [string, string]; sub: string; formLabel: string; calcLabel: string; calcHref: string };
  related?: { heading: string; sub?: string; links: { label: string; href: string }[] };
};
