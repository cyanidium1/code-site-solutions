import type * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { fetchCaseStudies } from "@/components/case-page";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import { btnClass } from "@/components/ui";
import {
  caseRefToCardItem,
  type CaseCardItem,
} from "@/lib/shared/case-card-item";
import { getEnRegistrySafe } from "@/lib/server/i18n-registry";
import type { Locale } from "@/types/sanity";
import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";

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
  items?: CaseCardItem[];
  /** Used when `items` is not provided — fetches Sanity case studies in
   *  the given locale and maps them into card data. */
  locale?: Locale;
  ctaLabel?: string;
  ctaHref?: string;
} = {}) {
  const finalItems: CaseCardItem[] = items ?? await (async () => {
    const [cases, registry] = await Promise.all([
      fetchCaseStudies(),
      getEnRegistrySafe(),
    ]);
    return cases.slice(0, 3).map((c) => caseRefToCardItem(c, locale, registry));
  })();
  return (
    <section className={hpSectionClass} id="cases">
      <div className={hpInnerClass}>
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <div className={casesGridClass}>
          {finalItems.map((c) => {
            const metaLine = [c.industry, c.region, c.year]
              .filter(Boolean)
              .join(" · ");
            return (
              <RelatedCard
                key={c.href ?? c.name}
                metrics={c.chips}
                title={c.name}
                eyebrow={metaLine || undefined}
                sub={c.metrics || undefined}
                coverImage={
                  c.coverImage
                    ? { src: c.coverImage, alt: c.coverImageAlt ?? c.name }
                    : undefined
                }
                gradient={c.gradient}
                href={c.href}
              />
            );
          })}
        </div>
        <Link href={ctaHref} className={btnClass("primary", "hp-section-cta")}>
          <span>{ctaLabel}</span>
          <ArrowRight size={18} strokeWidth={1.8} />
        </Link>
      </div>
    </section>
  );
}
