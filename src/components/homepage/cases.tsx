import type * as React from "react";

import { fetchHomepageCases } from "@/lib/server/fetch-homepage-cases";
import {
  caseRefToCardItem,
  type CaseCardItem,
} from "@/lib/shared/case-card-item";
import { getEnRegistrySafe } from "@/lib/server/i18n-registry";
import type { Locale } from "@/types/sanity";
import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";

import {
  CasesGridAndFilters,
  type IndustryKey,
} from "./cases-grid-and-filters";

const PILL_LABELS_BY_LOCALE: Record<Locale, Record<IndustryKey, string>> = {
  uk: {
    legal: "Юридичні",
    medicine: "Медицина",
    "real-estate": "Нерухомість",
  },
  ru: {
    legal: "Юридические",
    medicine: "Медицина",
    "real-estate": "Недвижимость",
  },
  en: {
    legal: "Legal",
    medicine: "Medicine",
    "real-estate": "Real estate",
  },
};

export async function Cases({
  eyebrow = "КЕЙСИ",
  heading = (
    <>
      Проєкти, <em>підкріплені цифрами</em>
    </>
  ),
  items,
  locale = "uk",
  ctaLabel = "Всі кейси",
  ctaHref = "/portfolio",
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  /**
   * Optional override — when provided, the section renders these cards
   * verbatim with no industry filters (kept for back-compat with any
   * non-homepage caller; the homepage path uses the CMS fetcher below).
   */
  items?: CaseCardItem[];
  locale?: Locale;
  ctaLabel?: string;
  ctaHref?: string;
} = {}) {
  const [curated, registry] = await Promise.all([
    fetchHomepageCases(),
    getEnRegistrySafe(),
  ]);

  const defaultItems: CaseCardItem[] =
    items ?? curated.default.map((c) => caseRefToCardItem(c, locale, registry));

  const setsByIndustry: Record<IndustryKey, CaseCardItem[]> = items
    ? { legal: [], medicine: [], "real-estate": [] }
    : {
        legal: curated.legal.map((c) => caseRefToCardItem(c, locale, registry)),
        medicine: curated.medicine.map((c) =>
          caseRefToCardItem(c, locale, registry),
        ),
        "real-estate": curated["real-estate"].map((c) =>
          caseRefToCardItem(c, locale, registry),
        ),
      };

  const pillLabels = PILL_LABELS_BY_LOCALE[locale];

  return (
    <section className={hpSectionClass} id="cases">
      <div className={hpInnerClass}>
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <CasesGridAndFilters
          defaultItems={defaultItems}
          setsByIndustry={setsByIndustry}
          pillLabels={pillLabels}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
        />
      </div>
    </section>
  );
}
