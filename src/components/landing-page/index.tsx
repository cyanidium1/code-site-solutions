import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { TurnkeyList } from "@/components/blocks/turnkey-list";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import { ContactSplit } from "@/components/blocks/contact-split";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import { Bento } from "@/components/homepage";
import { H2 } from "@/components/ui";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { fetchCaseStudies } from "@/components/case-page/data";
import { getContentRegistrySafe } from "@/lib/server/i18n-registry";
import { caseRefToCardItem } from "@/lib/shared/case-card-item";
import type { Locale } from "@/constants/locales";
import type { LandingPageContent } from "@/types/landing";

/* Local copies of the eyebrow / em-heading treatments used by turnkey-list —
   those constants are module-private there, so the strings live here too. */
const EYEBROW_CLASS =
  "inline-flex items-center gap-2.5 py-1.5 px-3 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase " +
  "before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent before:shadow-[0_0_8px_oklch(from_var(--color-accent)_l_c_h_/_0.6)]";

const HEADING_EM_CLASS =
  "[&_em]:italic [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:text-transparent";

const CARD_CLASS =
  "p-[22px_26px_24px] border border-line rounded-2xl bg-[oklch(1_0_0_/_0.02)]";

const ALL_CASES_LINK_CLASS =
  "inline-flex items-center gap-2 min-h-11 py-2.5 px-5 border border-line-strong rounded-full font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim no-underline " +
  "transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-accent-40";

function em([plain, emphasized]: [string, string]) {
  return (
    <>
      {plain}
      <em>{emphasized}</em>
    </>
  );
}

/** Fit / not-fit two-card section ("when is a landing page the right tool"). */
function WhenSection({ content }: { content: LandingPageContent["when"] }) {
  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <div className="flex flex-col items-start mb-12 max-w-[840px]">
          <span className={EYEBROW_CLASS}>{content.eyebrow}</span>
          <H2 className={`mt-6 mb-0 text-ink ${HEADING_EM_CLASS}`}>
            {em(content.heading)}
          </H2>
          <p className="mt-5 font-sans text-base leading-[1.6] text-ink-dim max-w-[640px]">
            {content.sub}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
          <div className={CARD_CLASS}>
            <h3 className="font-actay uppercase font-semibold text-[15.5px] text-ink leading-[1.2] m-0 mb-4">
              {content.fitTitle}
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {content.fit.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink-dim"
                >
                  <Check
                    size={16}
                    strokeWidth={2.2}
                    className="mt-0.5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${CARD_CLASS} border-dashed`}>
            <h3 className="font-actay uppercase font-semibold text-[15.5px] text-ink-dim leading-[1.2] m-0 mb-4">
              {content.notFitTitle}
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {content.notFit.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink-3"
                >
                  <Minus
                    size={16}
                    strokeWidth={2.2}
                    className="mt-0.5 shrink-0 text-ink-3"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-[13px] leading-[1.6] text-ink-3 italic max-w-[640px]">
          {content.foot}
        </p>
      </div>
    </section>
  );
}

/** "Not in the base package" footer card for the TurnkeyList block. */
function NotIncludedFooter({
  content,
}: {
  content: LandingPageContent["included"];
}) {
  return (
    <div className="p-[22px_26px_24px] border border-dashed border-line-strong rounded-2xl bg-[oklch(1_0_0_/_0.02)]">
      <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim mb-[14px]">
        {content.notIncludedTitle}
      </div>
      <ul
        className={
          "list-none m-0 p-0 grid grid-cols-1 gap-y-2 gap-x-7 md:grid-cols-2 " +
          "[&_li]:relative [&_li]:pl-[18px] [&_li]:text-[13.5px] [&_li]:leading-[1.5] [&_li]:text-ink-dim " +
          "[&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-0 [&_li]:before:text-ink-3"
        }
      >
        {content.notIncluded.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-4 text-[12.5px] leading-[1.6] text-ink-3 italic">
        {content.notIncludedFoot}
      </p>
    </div>
  );
}

/**
 * Site-type page "Landing" — shared view for /landing, /en/landing,
 * /ru/landing. Server component: fetches the example case studies once per
 * render (ISR-cached by fetchCaseStudies' tags).
 */
export async function LandingPageView({
  locale,
  content,
}: {
  locale: Locale;
  content: LandingPageContent;
}) {
  const [cases, registry] = await Promise.all([
    fetchCaseStudies(),
    getContentRegistrySafe(),
  ]);
  const examples = content.examples.slugs
    .map((slug) => cases.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => caseRefToCardItem(c, locale, registry));

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        breadcrumbs={[
          {
            label: content.breadcrumbHome,
            href: locale === "uk" ? "/" : `/${locale}`,
          },
          { label: content.breadcrumbSelf },
        ]}
        eyebrow={content.hero.eyebrow}
        headline={em(content.hero.headline)}
        sub={content.hero.sub}
      />

      {/* 2 — When a landing page fits / when it doesn't */}
      <WhenSection content={content.when} />

      {/* 3 — Checklist: what the base price includes */}
      <TurnkeyList
        eyebrow={content.included.eyebrow}
        heading={em(content.included.heading)}
        sub={content.included.sub}
        items={content.included.items}
        footer={<NotIncludedFooter content={content.included} />}
      />

      {/* 4 — How the price is built (calculator-style option grid) */}
      <Bento
        eyebrow={content.price.eyebrow}
        heading={em(content.price.heading)}
        cells={content.price.cells}
      />

      {/* 5 — Calculator CTA */}
      <CtaBanner
        heading={em(content.calcCta.heading)}
        sub={content.calcCta.sub}
        ctaPrimary={{
          label: content.calcCta.primaryLabel,
          href: content.calcCta.primaryHref,
        }}
        ctaSecondary={{
          label: content.calcCta.secondaryLabel,
          href: content.calcCta.secondaryHref,
        }}
      />

      {/* 6 — Example landing pages from the portfolio */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <div className="flex flex-col items-start mb-12 max-w-[840px]">
            <span className={EYEBROW_CLASS}>{content.examples.eyebrow}</span>
            <H2 className={`mt-6 mb-0 text-ink ${HEADING_EM_CLASS}`}>
              {em(content.examples.heading)}
            </H2>
            <p className="mt-5 font-sans text-base leading-[1.6] text-ink-dim max-w-[640px]">
              {content.examples.sub}
            </p>
          </div>
          {examples.length > 0 && (
            <div className={casesGridClass}>
              {examples.map((item) => {
                const metaLine = [item.industry, item.region, item.year]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <RelatedCard
                    key={item.href ?? item.name}
                    metrics={item.chips}
                    title={item.name}
                    eyebrow={metaLine || undefined}
                    sub={item.metrics || undefined}
                    coverImage={
                      item.coverImage
                        ? {
                            src: item.coverImage,
                            alt: item.coverImageAlt ?? item.name,
                          }
                        : undefined
                    }
                    gradient={item.gradient}
                    href={item.href}
                  />
                );
              })}
            </div>
          )}
          <Link href={content.examples.allHref} className={ALL_CASES_LINK_CLASS}>
            {content.examples.allLabel}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 7 — FAQ */}
      <section className="bg-bg">
        <FAQ
          heading={content.faq.heading}
          items={content.faq.items}
          locale={locale}
        />
      </section>

      {/* 8 — Lead form */}
      <ContactSplit source="landing-page" variant="full" locale={locale} />
    </>
  );
}
