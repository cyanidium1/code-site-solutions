import { hasEnCase } from "@/constants/i18n-routes";
import { loc } from "@/lib/shared/sanity-locale";
import { presentationForCase } from "@/lib/shared/case-presentation";
import type { CaseStudyRef, Locale } from "@/types/sanity";

export type CaseCardItem = {
  name: string;
  industry: string;
  region: string;
  year: string;
  chips: string[];
  metrics: string;
  gradient: string;
  /** `null` renders the card as a coming-soon tile (no link). */
  href: string | null;
  coverImage?: string;
  coverImageAlt?: string;
};

export function caseRefToCardItem(
  c: CaseStudyRef,
  locale: Locale,
): CaseCardItem {
  const pres = presentationForCase(c.industry?.slug ?? c.industrySlug);
  const name = loc(c.title, locale) || c.client || c.slug;
  const industryLabel = loc(c.industry?.title, locale) || pres.label;
  const region = loc(c.region, locale);
  const year = c.year ? String(c.year) : "";
  // EN listing should deep-link into /en/portfolio/<slug> only when the
  // case actually has EN content; otherwise fall back to the UA URL so
  // the user doesn't bounce to a 404 on click.
  const href =
    locale === "en"
      ? hasEnCase(c.slug)
        ? `/en/portfolio/${c.slug}`
        : `/portfolio/${c.slug}`
      : `/portfolio/${c.slug}`;
  return {
    name,
    industry: industryLabel,
    region,
    year,
    chips: [pres.label, pres.tech],
    metrics: loc(c.metricsLine, locale) || "",
    gradient: pres.gradient,
    href,
    coverImage: c.coverImage?.asset?.url,
    coverImageAlt: loc(c.coverImage?.alt, locale) || name,
  };
}

/**
 * Returns the inflected "<adjective> <noun>" fragment for "real case(s)" in
 * Ukrainian. Numeric agreement governs both the adjective and noun:
 *   1, 21, 31…   → nominative singular  ("реальний кейс")
 *   2-4, 22-24…  → nominative plural    ("реальні кейси")
 *   0, 5+, 11-14 → genitive plural      ("реальних кейсів")
 */
export function ukRealCasesPhrase(n: number): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return "реальних кейсів";
  if (mod10 === 1) return "реальний кейс";
  if (mod10 >= 2 && mod10 <= 4) return "реальні кейси";
  return "реальних кейсів";
}

/** "case" when n === 1, otherwise "cases". */
export function enCasesNoun(n: number): string {
  return n === 1 ? "case" : "cases";
}

type UkCountForm = "one" | "few" | "many";

function ukCountForm(n: number): UkCountForm {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return "many";
  if (mod10 === 1) return "one";
  if (mod10 >= 2 && mod10 <= 4) return "few";
  return "many";
}

/** e.g. 9 → { count: "9 проєктів", backed: "підкріплених цифрами" } */
export function ukProjectsBackedHeadline(n: number): {
  count: string;
  backed: string;
} {
  const form = ukCountForm(n);
  const count =
    form === "one"
      ? `${n} проєкт`
      : form === "few"
        ? `${n} проєкти`
        : `${n} проєктів`;
  const backed =
    form === "one"
      ? "підкріплений цифрами"
      : form === "few"
        ? "підкріплені цифрами"
        : "підкріплених цифрами";
  return { count, backed };
}

/** e.g. 9 → { count: "9 projects", backed: "backed by the numbers" } */
export function enProjectsBackedHeadline(n: number): {
  count: string;
  backed: string;
} {
  return {
    count: n === 1 ? `${n} project` : `${n} projects`,
    backed: "backed by the numbers",
  };
}
