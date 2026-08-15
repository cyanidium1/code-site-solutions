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
import { MiniCalc } from "@/components/landing-page/mini-calc";
import { SanityImg } from "@/lib/shared/sanity-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { loc } from "@/lib/shared/sanity-locale";
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
      {/* 1 — Hero (two-column with the mini-calculator when configured) */}
      {content.miniCalc ? (
        <section className="relative pt-10 pb-14 lg:pt-16 lg:pb-[72px] px-6 sm:px-8 lg:px-12 bg-bg overflow-hidden">
          <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_46%_38%_at_78%_8%,oklch(from_var(--color-accent)_l_c_h_/_0.08),transparent_70%),radial-gradient(ellipse_44%_44%_at_6%_92%,oklch(from_var(--color-accent-2)_l_c_h_/_0.05),transparent_70%)]" />
          <div className="relative max-w-container mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 items-center">
            <div>
              <span className={EYEBROW_CLASS}>{content.hero.eyebrow}</span>
              <h1 className={`mt-6 mb-0 font-actay uppercase font-bold text-[clamp(28px,4.4vw,52px)] leading-[1.12] text-ink ${HEADING_EM_CLASS}`}>
                {em(content.hero.headline)}
              </h1>
              <p className="mt-5 font-sans text-[15.5px] leading-[1.65] text-ink-dim max-w-[540px]">
                {content.hero.sub}
              </p>
              {content.hero.badges?.length ? (
                <div className="mt-7 grid grid-cols-2 gap-[10px] max-w-[460px]">
                  {content.hero.badges.map((b) => (
                    <div
                      key={b.label}
                      className="py-3 px-4 border border-line rounded-2xl bg-[oklch(1_0_0_/_0.02)]"
                    >
                      <div className="font-actay uppercase font-semibold text-[14px] text-ink leading-[1.2]">
                        {b.label}
                      </div>
                      <div className="mt-1 font-mono text-[10.5px] tracking-[0.04em] text-ink-3">
                        {b.sub}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <MiniCalc content={content.miniCalc} locale={locale} />
          </div>
        </section>
      ) : (
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
      )}

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

      {/* 4.2 — Ready-made configuration price table */}
      {content.priceTable && (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <div className="flex flex-col items-start mb-10 max-w-[840px]">
              <span className={EYEBROW_CLASS}>{content.priceTable.eyebrow}</span>
              <H2 className={`mt-6 mb-0 text-ink ${HEADING_EM_CLASS}`}>
                {em(content.priceTable.heading)}
              </H2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="bg-[oklch(1_0_0_/_0.03)]">
                    {content.priceTable.headers.map((h) => (
                      <th
                        key={h}
                        className="py-3.5 px-5 font-mono text-[11px] tracking-[0.12em] uppercase text-ink-3 font-medium border-b border-line"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.priceTable.rows.map((row) => (
                    <tr
                      key={row[0]}
                      className="border-b border-line last:border-b-0 transition-colors duration-150 hover:bg-[oklch(1_0_0_/_0.02)]"
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={
                            "py-3.5 px-5 font-sans text-[13.5px] leading-[1.5] " +
                            (ci === 0
                              ? "font-semibold text-ink"
                              : ci === row.length - 2
                                ? "font-mono text-[13px] text-accent-soft whitespace-nowrap"
                                : "text-ink-dim")
                          }
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12.5px] leading-[1.6] text-ink-3 italic max-w-[640px]">
              {content.priceTable.foot}
            </p>
          </div>
        </section>
      )}

      {/* 4.3 — Case stories with photos */}
      {content.stories && (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <div className="flex flex-col items-start mb-12 max-w-[840px]">
              <span className={EYEBROW_CLASS}>{content.stories.eyebrow}</span>
              <H2 className={`mt-6 mb-0 text-ink ${HEADING_EM_CLASS}`}>
                {em(content.stories.heading)}
              </H2>
            </div>
            <div className="flex flex-col gap-12 lg:gap-16">
              {content.stories.items.map((story, i) => {
                const c = cases.find((x) => x.slug === story.slug);
                const image = c?.coverImage?.asset?.url ? c.coverImage : null;
                return (
                  <div
                    key={story.slug}
                    className={`grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-12 items-center ${
                      i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    {image ? (
                      <Link
                        href={`/portfolio/${story.slug}`}
                        className="block relative aspect-[4/3] overflow-hidden rounded-[22px] border border-line group"
                      >
                        <SanityImg
                          image={image}
                          alt={loc(image.alt, locale) || story.title}
                          sizes={IMG_SIZES.half}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </Link>
                    ) : (
                      <div className="aspect-[4/3] rounded-[22px] border border-line bg-[oklch(1_0_0_/_0.02)]" />
                    )}
                    <div>
                      <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3">
                        {story.kicker}
                      </div>
                      <h3 className="mt-3 mb-0 font-actay uppercase font-bold text-[clamp(20px,2.2vw,28px)] leading-[1.2] text-ink">
                        {story.title}
                      </h3>
                      {story.paragraphs.map((p) => (
                        <p
                          key={p.slice(0, 24)}
                          className="mt-4 mb-0 font-sans text-[14.5px] leading-[1.65] text-ink-dim"
                        >
                          {p}
                        </p>
                      ))}
                      <div className="mt-6 flex items-end gap-5 flex-wrap">
                        <div>
                          <div className="font-actay font-bold text-[34px] leading-none bg-[linear-gradient(90deg,oklch(0.72_0.16_250),oklch(0.72_0.16_295),oklch(0.66_0.18_320))] bg-clip-text text-transparent">
                            {story.stat.value}
                          </div>
                          <div className="mt-1.5 font-mono text-[11px] tracking-[0.06em] text-ink-3">
                            {story.stat.label}
                          </div>
                        </div>
                        <Link
                          href={`/portfolio/${story.slug}`}
                          className={ALL_CASES_LINK_CLASS}
                        >
                          {story.ctaLabel}
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4.5 — Optional platform-limitations prose section */}
      {content.platforms && (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <div className="flex flex-col items-start mb-10 max-w-[840px]">
              <span className={EYEBROW_CLASS}>{content.platforms.eyebrow}</span>
              <H2 className={`mt-6 mb-0 text-ink ${HEADING_EM_CLASS}`}>
                {em(content.platforms.heading)}
              </H2>
            </div>
            <div className="max-w-[760px] flex flex-col gap-4">
              {content.platforms.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="m-0 font-sans text-[15px] leading-[1.65] text-ink-dim"
                >
                  {p}
                </p>
              ))}
              <ul className="list-none m-0 mt-2 p-0 flex flex-col gap-2.5">
                {content.platforms.bullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink-dim"
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
              <p className="m-0 mt-2 text-[13px] leading-[1.6] text-ink-3 italic">
                {content.platforms.foot}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {content.platforms.links.map((l) => (
                  <Link key={l.href} href={l.href} className={ALL_CASES_LINK_CLASS}>
                    {l.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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

      {/* 5.5 — Photo gallery of works */}
      {content.gallery && (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <div className="flex flex-col items-start mb-12 max-w-[840px]">
              <span className={EYEBROW_CLASS}>{content.gallery.eyebrow}</span>
              <H2 className={`mt-6 mb-0 text-ink ${HEADING_EM_CLASS}`}>
                {em(content.gallery.heading)}
              </H2>
              <p className="mt-5 font-sans text-base leading-[1.6] text-ink-dim max-w-[640px]">
                {content.gallery.sub}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {content.gallery.slugs
                .map((slug) => cases.find((c) => c.slug === slug))
                .filter((c): c is NonNullable<typeof c> =>
                  Boolean(c?.coverImage?.asset?.url),
                )
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/portfolio/${c.slug}`}
                    className="group block overflow-hidden rounded-[18px] border border-line no-underline transition-[transform,border-color] duration-[0.25s] hover:-translate-y-0.5 hover:border-line-strong"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <SanityImg
                        image={c.coverImage!}
                        alt={loc(c.coverImage!.alt, locale) || loc(c.title, locale) || c.slug}
                        sizes={IMG_SIZES.cardThird}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 py-3 px-4">
                      <span className="font-actay uppercase font-semibold text-[13.5px] text-ink truncate">
                        {loc(c.title, locale) || c.client || c.slug}
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-ink-3 transition-[transform,color] duration-[0.25s] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                ))}
            </div>
            <Link href={content.gallery.allHref} className={ALL_CASES_LINK_CLASS}>
              {content.gallery.allLabel}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* 6 — Example landing pages from the portfolio (hidden when the
          gallery replaces it) */}
      {!content.gallery && (
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
      )}

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
