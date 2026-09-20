import type { FAQItem } from "@/types/faq";

/**
 * Copy for the Google Ads landing (TZ v2 §4): `/zamovyty-sait` (uk) and
 * `/ru/zakazat-sait` (ru). No en version. Every price and term in the copy
 * is interpolated from `@/constants/pricing` in the content files.
 */
export type AdsLandingContent = {
  metaTitle: string;
  metaDescription: string;
  header: { telegramLabel: string; phoneAria: string };
  hero: {
    eyebrow: string;
    h1: string;
    bullets: [string, string, string];
    sub: string;
  };
  packages: { title: string; sub: string };
  includes: { title: string; sub: string; afterYear: string };
  cases: { title: string; sub: string };
  testimonialsTitle: string;
  comparison: {
    title: string;
    sub: string;
    colUs: string;
    colBuilder: string;
    rows: { label: string; us: string; builder: string }[];
    note: string;
  };
  process: {
    title: string;
    sub: string;
    steps: { days: string; title: string; body: string }[];
  };
  faq: { title: string; items: FAQItem[] };
  finalForm: { title: string; sub: string };
  footer: { contract: string; contractHref: string; rights: string };
};
