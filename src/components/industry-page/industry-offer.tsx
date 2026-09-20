/**
 * Config-driven offer for the /sites-for/* pages (TZ v2 §3.6): H1 parts,
 * meta title/description, the "what's included" block with the lead form
 * under the hero, and the price tier used in the comparison section.
 *
 * Every figure comes from `@/constants/pricing` — the Sanity industryPage
 * docs still carry the page's story (reasons, case, services, FAQ), but no
 * longer its price or term.
 */

import Link from "next/link";

import type { Locale } from "@/constants/locales";
import {
  INDUSTRIES,
  PACKAGES,
  formatPackageTerm,
  industryPrice,
  showsUahHint,
  uahApprox,
  type IndustryId,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import { resolveRootHref } from "@/constants/i18n-routes";
import { LeadFormCard, UspLine, packageTier } from "@/components/blocks/packages";
import { PACKAGES_UI } from "@/content/packages-ui";
import type { TierProps } from "@/types/pricing";
import {
  hpH2Class,
  hpInnerClass,
  hpSectionClass,
} from "@/components/homepage/shared";

/** Sanity slug → pricing industry id. Retired slugs (ecommerce, courses) map to null. */
export function industryIdForSlug(slug: string): IndustryId | null {
  return slug in INDUSTRIES ? (slug as IndustryId) : null;
}

const WITH: Record<Locale, { brand: string; plain: string }> = {
  uk: { brand: "з інтеграцією", plain: "з" },
  ru: { brand: "с интеграцией", plain: "с" },
  en: { brand: "with", plain: "with" },
};

/** "з інтеграцією Helsi / Medesk" / "з калькулятором кошторису" / "with online booking". */
export function industryWithPhrase(id: IndustryId, locale: Locale): string {
  const integration = INDUSTRIES[id].integration[locale];
  // Product names (Helsi, MEDoc, Diia.Sign, Copart) read "з інтеграцією X";
  // descriptive ones already carry the instrumental case ("калькулятором …").
  const isBrand = /^[A-Z]/.test(integration);
  return `${isBrand ? WITH[locale].brand : WITH[locale].plain} ${integration}`;
}

const SITE_FOR: Record<Locale, string> = {
  uk: "Сайт для",
  ru: "Сайт для",
  en: "Website for",
};

const TERM_JOIN: Record<Locale, string> = { uk: "за", ru: "за", en: "in" };

export function industryPriceLabel(id: IndustryId, locale: Locale): string {
  return formatPrice(industryPrice(id, locale), { locale });
}

/** H1 parts: «Сайт для клініки —» / «$1 800 за 14–21 робочий день,» / «з інтеграцією Helsi / Medesk». */
export function industryH1(id: IndustryId, locale: Locale) {
  const ind = INDUSTRIES[id];
  return {
    lead: `${SITE_FOR[locale]} ${ind.forName[locale]} —`,
    price: industryPriceLabel(id, locale),
    term: `${TERM_JOIN[locale]} ${formatPackageTerm("industry", locale)},`,
    integration: industryWithPhrase(id, locale),
  };
}

/** Plain-text H1, for JSON-LD / alt fallbacks. */
export function industryH1Text(id: IndustryId, locale: Locale): string {
  const h = industryH1(id, locale);
  return `${h.lead} ${h.price} ${h.term} ${h.integration}`;
}

const BRAND = " | Code-Site.Art";

const DESC_TAIL: Record<Locale, string[]> = {
  uk: [
    "Фікс-ціна в договорі.",
    "Хостинг, SSL і гарантія на рік включені.",
    "Код ваш.",
    "Безкоштовний прорахунок за 24 години.",
  ],
  ru: [
    "Фикс-цена в договоре.",
    "Хостинг, SSL и гарантия на год включены.",
    "Код ваш.",
    "Бесплатный расчёт за 24 часа.",
  ],
  en: [
    "Fixed price in the contract.",
    "Hosting, SSL and a one-year warranty included.",
    "You own the code.",
    "Free quote within 24 hours.",
  ],
};

/** Meta title ≤ 60 and description ≤ 155 chars, numbers from the config. */
export function industrySeo(id: IndustryId, locale: Locale): { title: string; description: string } {
  const ind = INDUSTRIES[id];
  const price = industryPriceLabel(id, locale);
  const term = formatPackageTerm("industry", locale);
  const base = `${SITE_FOR[locale]} ${ind.forName[locale]} — ${price}, ${term}`;
  const title = base.length + BRAND.length <= 60 ? base + BRAND : base;

  let description = `${SITE_FOR[locale]} ${ind.forName[locale]} ${industryWithPhrase(id, locale)}: ${price}, ${term}.`;
  for (const s of DESC_TAIL[locale]) {
    if ((description + " " + s).length > 155) break;
    description += " " + s;
  }
  return { title, description };
}

/** "What's included" = business package + the industry integration + compliance. */
export function industryIncludes(id: IndustryId, locale: Locale): string[] {
  const withPhrase = industryWithPhrase(id, locale);
  const compliance = PACKAGES.industry.includes[locale][2];
  return [
    ...PACKAGES.business.includes[locale],
    withPhrase.charAt(0).toUpperCase() + withPhrase.slice(1),
    compliance,
  ].filter(Boolean) as string[];
}

/** One price card for this industry, in the shape the comparison grid expects. */
export function industryTier(id: IndustryId, locale: Locale, source: string): TierProps {
  const ui = PACKAGES_UI[locale];
  const base = packageTier("industry", locale, { source });
  return {
    ...base,
    name: `${PACKAGES.industry.name[locale]}: ${INDUSTRIES[id].name[locale]}`,
    price: industryPriceLabel(id, locale),
    priceLabel: ui.fixedLabel,
    popular: true,
    popularLabel: OFFER_UI[locale].tierBadge,
    includes: { heading: ui.includes, items: industryIncludes(id, locale) },
    excludes: undefined,
    ctaGhost: false,
  };
}

/** Business → this industry → Custom: the three honest options for the niche. */
export function industryTiers(id: IndustryId, locale: Locale, source: string): TierProps[] {
  return [
    { ...packageTier("business", locale, { source }), popular: false, ctaGhost: true },
    industryTier(id, locale, source),
    packageTier("custom", locale, { source }),
  ];
}

const OFFER_UI: Record<
  Locale,
  {
    heading: (price: string) => string;
    pricingHeading: (forName: string) => string;
    tierBadge: string;
    calc: string;
  }
> = {
  uk: {
    heading: (p) => `Що входить у ${p}`,
    pricingHeading: (f) => `Скільки коштує сайт для ${f}`,
    tierBadge: "Для вашої галузі",
    calc: "Порахувати з додатками в калькуляторі",
  },
  ru: {
    heading: (p) => `Что входит в ${p}`,
    pricingHeading: (f) => `Сколько стоит сайт для ${f}`,
    tierBadge: "Для вашей отрасли",
    calc: "Посчитать с дополнениями в калькуляторе",
  },
  en: {
    heading: (p) => `What ${p} includes`,
    pricingHeading: (f) => `What a website for ${f} costs`,
    tierBadge: "For your industry",
    calc: "Price it with add-ons in the calculator",
  },
};

export function industryPricingHeading(id: IndustryId, locale: Locale): string {
  return OFFER_UI[locale].pricingHeading(INDUSTRIES[id].forName[locale]);
}

/**
 * Right under the hero: the lead form (first on phones) beside the price,
 * the term and what the price buys.
 */
export function IndustryOffer({
  id,
  locale,
  source,
}: {
  id: IndustryId;
  locale: Locale;
  source: string;
}) {
  const ui = PACKAGES_UI[locale];
  const t = OFFER_UI[locale];
  const amount = industryPrice(id, locale);
  const price = industryPriceLabel(id, locale);
  return (
    <section className={hpSectionClass}>
      <div className={`${hpInnerClass} grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14`}>
        <LeadFormCard locale={locale} source={source} tier="industry" className="lg:order-last" />
        <div>
          <h2 className={hpH2Class}>{t.heading(price)}</h2>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line pb-5">
            <span className="font-actay text-[clamp(36px,5vw,56px)] font-bold leading-[0.95] tracking-[-0.03em] text-ink">
              {price}
            </span>
            <span className="font-sans text-[14px] font-medium text-ink-dim">
              {ui.fixedLabel} · {formatPackageTerm("industry", locale)}
            </span>
            {showsUahHint(locale) ? (
              <span className="basis-full font-mono text-[12px] text-ink-3">{uahApprox(amount)}</span>
            ) : null}
          </div>
          <ul className="m-0 mt-2 list-none p-0">
            {industryIncludes(id, locale).map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-line py-2.5 font-sans text-[14.5px] leading-[1.45] text-ink-dim last:border-b-0"
              >
                <span aria-hidden="true" className="mt-[2px] shrink-0 text-accent-soft">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <UspLine locale={locale} className="mt-5" />
          <Link
            href={resolveRootHref("/calculator", locale)}
            className="mt-5 inline-flex min-h-11 items-center gap-2 font-sans text-[14px] font-medium text-ink underline-offset-4 hover:underline"
          >
            {t.calc} →
          </Link>
        </div>
      </div>
    </section>
  );
}
