import type * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { fetchCaseStudies } from "@/components/case-page";
import { RelatedCard } from "@/components/blocks/related-card";
import { btnClass } from "@/components/ui";
import {
  caseRefToCardItem,
  type CaseCardItem,
} from "@/lib/shared/case-card-item";
import type { Locale } from "@/types/sanity";
import { SectionHead } from "@/components/shared/section-head";

export async function Cases({
  eyebrow = "КЕЙСИ",
  heading = (
    <>
      Реальні кейси з <em>реальними</em> метриками
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
  const finalItems: CaseCardItem[] =
    items ??
    (await fetchCaseStudies())
      .slice(0, 3)
      .map((c) => caseRefToCardItem(c, locale));
  return (
    <section className="hp-section" id="cases">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <div className="hp-cases-grid">
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
