import { fetchCaseStudies } from "@/components/case-page/data";
import { getContentRegistrySafe } from "@/lib/server/i18n-registry";
import { hasLocaleCase, localizePath } from "@/constants/i18n-routes";
import { DEFAULT_LOCALE, type Locale } from "@/constants/locales";
import { loc } from "@/lib/shared/sanity-locale";

import { HeroShowcaseClient, type ResolvedSlide } from "./client";
import type { HeroSlideContent, HeroSlideTheme } from "./types";

/**
 * Server half of the hero: copy comes from the page, photographs come from
 * Sanity by slug. Slides whose case is missing still render — they just lose
 * the picture — so an unpublished case never blanks the first screen.
 */

/** Sampled from each project's own cover so backdrop and photo agree. */
const THEMES: Record<string, HeroSlideTheme> = {
  violet: { wash: "oklch(0.5 0.17 295 / 0.28)", mark: "oklch(0.6 0.16 295 / 0.10)" },
  amber: { wash: "oklch(0.62 0.15 55 / 0.22)", mark: "oklch(0.66 0.14 55 / 0.09)" },
  green: { wash: "oklch(0.5 0.12 150 / 0.22)", mark: "oklch(0.6 0.12 150 / 0.09)" },
  cyan: { wash: "oklch(0.6 0.13 220 / 0.24)", mark: "oklch(0.65 0.13 220 / 0.09)" },
};

export type HeroShowcaseSlide = HeroSlideContent & {
  /** Key into the theme table above. */
  theme: keyof typeof THEMES;
};

export async function HeroShowcase({
  locale,
  slides,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  slideLabelTemplate,
}: {
  locale: Locale;
  slides: HeroShowcaseSlide[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  /** aria-label for a dot; `{n}` is replaced with the 1-based index. */
  slideLabelTemplate: string;
}) {
  const [cases, registry] = await Promise.all([
    fetchCaseStudies(),
    getContentRegistrySafe(),
  ]);

  const resolved: ResolvedSlide[] = slides.map((s) => {
    const c = cases.find((x) => x.slug === s.slug);
    const href = c
      ? locale !== DEFAULT_LOCALE && hasLocaleCase(s.slug, locale, registry)
        ? localizePath(`/portfolio/${s.slug}`, locale)
        : `/portfolio/${s.slug}`
      : null;
    return {
      ...s,
      theme: THEMES[s.theme],
      cover: c?.coverImage ?? undefined,
      coverAlt:
        (c?.coverImage && loc(c.coverImage.alt, locale)) ||
        (c && loc(c.title, locale)) ||
        s.caseLabel,
      caseHref: href,
    };
  });

  return (
    <HeroShowcaseClient
      slides={resolved}
      ctaPrimaryLabel={ctaPrimaryLabel}
      ctaPrimaryHref={ctaPrimaryHref}
      ctaSecondaryLabel={ctaSecondaryLabel}
      ctaSecondaryHref={ctaSecondaryHref}
      slideLabelTemplate={slideLabelTemplate}
    />
  );
}
