import { fetchCaseStudies } from "@/components/case-page/data";
import { getContentRegistrySafe } from "@/lib/server/i18n-registry";
import { caseRefToCardItem } from "@/lib/shared/case-card-item";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { resolveRootHref } from "@/constants/i18n-routes";
import type { Locale } from "@/constants/locales";

/**
 * A row of real portfolio cases, picked by slug.
 *
 * The comparison pages (`/vs-*`) carried one to three images across
 * 11 000–14 000px, with unbroken text stretches of 5 000–9 400px — the worst
 * image-to-copy ratio on the site (design audit 2026-09-07). They already
 * argue from cases in prose; this puts the actual work on the page and adds
 * six links into `/portfolio` on the way.
 *
 * Async server component: parents stay synchronous and just render it.
 * Covers and metrics come from Sanity, so nothing here needs new assets.
 */
const LABELS: Record<Locale, { eyebrow: string; heading: string; all: string }> = {
  uk: {
    eyebrow: "ПОРТФОЛІО",
    heading: "Зроблено на власному коді",
    all: "Всі кейси",
  },
  ru: {
    eyebrow: "ПОРТФОЛИО",
    heading: "Сделано на собственном коде",
    all: "Все кейсы",
  },
  en: {
    eyebrow: "PORTFOLIO",
    heading: "Built on custom code",
    all: "All case studies",
  },
};

export async function CaseStrip({
  locale,
  slugs,
  sub,
}: {
  locale: Locale;
  /** Portfolio slugs, in order. Missing slugs are skipped. */
  slugs: string[];
  sub?: string;
}) {
  const [cases, registry] = await Promise.all([
    fetchCaseStudies(),
    getContentRegistrySafe(),
  ]);

  const items = slugs
    .map((slug) => cases.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => caseRefToCardItem(c, locale, registry));

  if (items.length === 0) return null;

  const l = LABELS[locale];

  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <SectionHead eyebrow={l.eyebrow} heading={l.heading} sub={sub} />
        <div className={casesGridClass}>
          {items.map((item) => (
            <RelatedCard
              key={item.href}
              metrics={item.chips}
              title={item.name}
              eyebrow={
                [item.industry, item.region, item.year].filter(Boolean).join(" · ") ||
                undefined
              }
              sub={item.metrics || undefined}
              coverImage={
                item.coverImage
                  ? { src: item.coverImage, alt: item.coverImageAlt ?? item.name }
                  : undefined
              }
              gradient={item.gradient}
              href={item.href}
            />
          ))}
        </div>
        <a
          href={resolveRootHref("/portfolio", locale)}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim no-underline transition-[color,border-color] duration-200 hover:border-accent-40 hover:text-accent-soft"
        >
          {l.all}
        </a>
      </div>
    </section>
  );
}
