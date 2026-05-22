import type * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { fetchCaseStudies } from "@/components/case-page";
import { RelatedCard } from "@/components/blocks/related-card";
import { loc } from "@/lib/shared/sanity-locale";
import { presentationForCase } from "@/lib/shared/case-presentation";
import { hasEnCase } from "@/constants/i18n-routes";
import type { CaseStudyRef, Locale } from "@/types/sanity";
import { SectionHead } from "@/components/shared/section-head";

type CaseItem = {
  name: string;
  industry: string;
  region: string;
  year: string;
  chips: string[];
  metrics: string;
  gradient: string;
  /** `null` рендерить картку як coming-soon (без посилання). */
  href: string | null;
  coverImage?: string;
  coverImageAlt?: string;
};

function refToCaseItem(c: CaseStudyRef, locale: Locale): CaseItem {
  const pres = presentationForCase(c.slug, c.industrySlug);
  const name = loc(c.title, locale) || c.client || c.slug;
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
    industry: pres.label,
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
  items?: CaseItem[];
  /** Used when `items` is not provided — fetches Sanity case studies in
   *  the given locale and maps them into card data. */
  locale?: Locale;
  ctaLabel?: string;
  ctaHref?: string;
} = {}) {
  const finalItems: CaseItem[] =
    items ??
    (await fetchCaseStudies()).slice(0, 3).map((c) => refToCaseItem(c, locale));
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
        <Link href={ctaHref} className="btn-primary hp-section-cta">
          <span>{ctaLabel}</span>
          <ArrowRight size={18} strokeWidth={1.8} />
        </Link>
      </div>
    </section>
  );
}
