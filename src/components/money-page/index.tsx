import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { cn, H1 } from "@/components/ui";
import { FAQ } from "@/components/blocks/final";
import { RelatedCard, casesRailClass } from "@/components/blocks/related-card";
import {
  LeadFormCard,
  LeadFormSection,
  PackageCards,
  PackagesSection,
  UspLine,
} from "@/components/blocks/packages";
import { TestimonialCards } from "@/components/blocks/testimonials";
import {
  hpH2Class,
  hpInnerClass,
  hpLinkClass,
  hpSectionClass,
  hpSectionHeadClass,
  hpSubClass,
} from "@/components/homepage/shared";
import { MobileFold, READ_MORE_LABEL } from "@/components/shared/mobile-fold";
import { fetchCaseStudies } from "@/components/case-page/data";
import { fetchTestimonialSlides } from "@/lib/server/fetch-testimonials";
import { getContentRegistrySafe } from "@/lib/server/i18n-registry";
import { caseRefToCardItem } from "@/lib/shared/case-card-item";
import { SanityImg } from "@/lib/shared/sanity-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { loc } from "@/lib/shared/sanity-locale";
import { hasLocaleCase, localizePath } from "@/constants/i18n-routes";
import { DEFAULT_LOCALE, type Locale } from "@/constants/locales";
import type { MoneyPageContent } from "@/types/money-page";

/**
 * View for the Ads-facing service pages: `/rozrobka-saitiv` and the city
 * pages (uk + ru). Form directly under the H1 (TZ v2 §3.4, §3.14), then the
 * config-driven package cards; every price on the page comes from
 * `@/constants/pricing`, through the blocks or the content files.
 */

/** Digit groups separated by a plain space ("$1 000") must never wrap. */
function nb(s: string) {
  return s.replace(/(\d) (\d{3})/g, "$1 $2");
}

function em([plain, emphasized]: [string, string]) {
  return (
    <>
      {plain}
      <em>{emphasized}</em>
    </>
  );
}

function SectionHead({ heading, sub }: { heading: string | [string, string]; sub?: string }) {
  return (
    <div className={hpSectionHeadClass}>
      <h2 className={hpH2Class}>{typeof heading === "string" ? heading : heading.join("")}</h2>
      {sub ? <p className={cn(hpSubClass, "mt-0")}>{sub}</p> : null}
    </div>
  );
}

const CARD = "rounded-[18px] border border-line bg-[oklch(0.16_0.006_300)] p-5 md:p-6";
const LINK_PILL =
  "inline-flex items-center gap-2 min-h-11 py-2.5 px-5 border border-line-strong rounded-full font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim no-underline " +
  "transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-accent-40";

export async function MoneyPageView({
  locale,
  content,
  source,
}: {
  locale: Locale;
  content: MoneyPageContent;
  /** Lead-source tag, e.g. "web-development-page" / "city-page-kyiv". */
  source: string;
}) {
  const [cases, registry, slides] = await Promise.all([
    fetchCaseStudies(),
    getContentRegistrySafe(),
    fetchTestimonialSlides(locale),
  ]);

  const casePath = (slug: string) =>
    locale !== DEFAULT_LOCALE && hasLocaleCase(slug, locale, registry)
      ? localizePath(`/portfolio/${slug}`, locale)
      : `/portfolio/${slug}`;

  const caseCards = content.cases.slugs
    .map((slug) => cases.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => caseRefToCardItem(c, locale, registry));

  const crumbs = [
    { label: content.breadcrumbHome, href: localizePath("/", locale) },
    ...(content.breadcrumbParent ? [content.breadcrumbParent] : []),
    { label: content.breadcrumbSelf },
  ];

  return (
    <>
      {/* 1 — H1 + the lead form right under it (first screen on phones) */}
      <section className="relative overflow-hidden bg-bg px-6 pt-10 pb-12 sm:px-8 lg:px-12 lg:pt-16 lg:pb-16">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_50%_44%_at_74%_26%,var(--color-accent-15),transparent_68%),radial-gradient(ellipse_56%_44%_at_8%_108%,oklch(from_var(--color-accent-2)_l_c_h_/_0.12),transparent_72%)]"
        />
        <div className="relative max-w-container mx-auto grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16 lg:items-center">
          <div>
            <nav
              aria-label="Breadcrumbs"
              className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim [&_a]:text-ink-dim [&_a]:no-underline [&_a:hover]:text-ink"
            >
              {crumbs.map((c, i) => (
                <span key={c.label} className="contents">
                  {i > 0 && <span className="text-ink-3 opacity-60">/</span>}
                  {"href" in c && c.href && i < crumbs.length - 1 ? (
                    <Link href={c.href}>{c.label}</Link>
                  ) : (
                    <span className="text-ink-3">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
            <H1
              variant="page-hero"
              className="mt-0 text-ink [text-wrap:balance] [&_em]:not-italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent"
            >
              {em([nb(content.hero.headline[0]), nb(content.hero.headline[1])])}
            </H1>
            <p className="mt-5 mb-0 max-w-[560px] font-sans text-[15px] leading-[1.6] text-ink-dim lg:text-[16.5px]">
              {nb(content.hero.sub)}
            </p>
            <UspLine locale={locale} className="mt-5 max-w-[560px]" />
          </div>
          <LeadFormCard locale={locale} source={source} />
        </div>
      </section>

      {/* 2 — Three packages from the pricing config */}
      <PackagesSection id="packages" title={content.packages.heading} sub={content.packages.sub}>
        <PackageCards locale={locale} source={`${source}-package`} />
      </PackagesSection>

      {/* 3 — What you get */}
      {content.included ? (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead heading={content.included.heading} sub={content.included.sub} />
            <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-5 p-0 md:grid-cols-2">
              {content.included.items.map((it) => (
                <li key={it.title} className="flex items-start gap-3">
                  <Check size={18} strokeWidth={2.4} className="mt-0.5 shrink-0 text-accent-soft" aria-hidden="true" />
                  <span className="font-sans text-[15px] leading-[1.55] text-ink-dim">
                    <strong className="font-semibold text-ink">{it.title}</strong> — {nb(it.line)}
                  </span>
                </li>
              ))}
            </ul>
            {content.included.foot ? (
              <p className="m-0 mt-8 max-w-[720px] font-sans text-[14px] leading-[1.6] text-ink-3">
                {nb(content.included.foot)}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 4 — Process by days */}
      {content.process ? (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead heading={content.process.heading} sub={content.process.sub} />
            <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 xl:grid-cols-4">
              {content.process.steps.map((s) => (
                <li key={s.when} className={CARD}>
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-soft">{s.when}</div>
                  <h3 className="mt-3 mb-0 font-actay text-[17px] font-bold uppercase leading-[1.2] text-ink">{s.title}</h3>
                  <p className="mt-3 mb-0 font-sans text-[14.5px] leading-[1.6] text-ink-dim">{nb(s.body)}</p>
                </li>
              ))}
            </ol>
            {content.process.foot ? (
              <p className="m-0 mt-6 max-w-[720px] font-sans text-[14px] leading-[1.6] text-ink-dim">
                {nb(content.process.foot)}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 5 — Why code, not a builder */}
      {content.why ? (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead heading={content.why.heading} sub={content.why.sub} />
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
              {content.why.items.map((it) => (
                <li key={it.title} className={CARD}>
                  <h3 className="m-0 font-actay text-[17px] font-bold uppercase leading-[1.2] text-ink">{it.title}</h3>
                  <p className="mt-3 mb-0 font-sans text-[14.5px] leading-[1.6] text-ink-dim">{nb(it.body)}</p>
                </li>
              ))}
            </ul>
            {content.why.links?.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {content.why.links.map((l) => (
                  <Link key={l.href} href={l.href} className={LINK_PILL}>
                    {l.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 6 — City angle (city pages only) */}
      {content.local ? (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead heading={content.local.heading} />
            <div className="flex max-w-[640px] flex-col gap-4">
              <p className="m-0 font-sans text-[15px] leading-[1.7] text-ink-dim">{nb(content.local.paragraphs[0] ?? "")}</p>
              {content.local.paragraphs.length > 1 || content.local.bullets?.length ? (
                <MobileFold
                  label={READ_MORE_LABEL[locale]}
                  bodyClassName="flex-col gap-4 lg:flex max-lg:peer-checked:flex"
                >
                  {content.local.paragraphs.slice(1).map((p) => (
                    <p key={p.slice(0, 32)} className="m-0 font-sans text-[15px] leading-[1.7] text-ink-dim">
                      {nb(p)}
                    </p>
                  ))}
                  {content.local.bullets?.length ? (
                    <ul className="m-0 mt-2 flex list-none flex-col gap-2.5 p-0">
                      {content.local.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-ink-dim">
                          <Check size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
                          {nb(b)}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {content.local.foot ? (
                    <p className="m-0 mt-2 font-sans text-[14px] leading-[1.6] text-ink-3">{nb(content.local.foot)}</p>
                  ) : null}
                </MobileFold>
              ) : null}
              {content.local.links?.length ? (
                <div className="mt-3 flex flex-wrap gap-3">
                  {content.local.links.map((l) => (
                    <Link key={l.href} href={l.href} className={LINK_PILL}>
                      {l.label}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* 7 — Case stories (city pages) */}
      {content.stories ? (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead heading={content.stories.heading} />
            <div className="flex flex-col gap-12 lg:gap-16">
              {content.stories.items.map((story, i) => {
                const c = cases.find((x) => x.slug === story.slug);
                const image = c?.coverImage?.asset?.url ? c.coverImage : null;
                return (
                  <div
                    key={story.slug}
                    className={cn(
                      "grid grid-cols-1 items-center gap-7 lg:grid-cols-2 lg:gap-12",
                      i % 2 === 1 && "lg:[&>*:first-child]:order-2",
                    )}
                  >
                    <Link
                      href={casePath(story.slug)}
                      className="relative block overflow-hidden rounded-2xl border border-line-strong bg-surface"
                    >
                      {image ? (
                        <div className="relative aspect-[16/10]">
                          <SanityImg
                            image={image}
                            alt={loc(image.alt, locale) || story.title}
                            sizes={IMG_SIZES.half}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] bg-[oklch(1_0_0_/_0.02)]" />
                      )}
                    </Link>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{story.kicker}</div>
                      <h3 className="mt-3 mb-0 font-actay text-[clamp(20px,2.2vw,28px)] font-bold uppercase leading-[1.2] text-ink">
                        {story.title}
                      </h3>
                      <p className="mt-4 mb-0 font-sans text-[15px] leading-[1.7] text-ink-dim">{nb(story.paragraphs[0] ?? "")}</p>
                      {story.paragraphs.length > 1 ? (
                        <MobileFold label={READ_MORE_LABEL[locale]} className="max-lg:mt-2">
                          {story.paragraphs.slice(1).map((p) => (
                            <p key={p.slice(0, 32)} className="mt-4 mb-0 font-sans text-[15px] leading-[1.7] text-ink-dim">
                              {nb(p)}
                            </p>
                          ))}
                        </MobileFold>
                      ) : null}
                      <div className="mt-6 flex flex-wrap items-end gap-5">
                        <div>
                          <div className="font-actay text-[34px] font-bold leading-none text-ink">{story.stat.value}</div>
                          <div className="mt-1.5 font-mono text-[11px] tracking-[0.06em] text-ink-3">{story.stat.label}</div>
                        </div>
                        <Link href={casePath(story.slug)} className={LINK_PILL}>
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
      ) : null}

      {/* 8 — Cases with numbers (metrics line straight from the case data) */}
      {caseCards.length ? (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead heading={content.cases.heading} sub={content.cases.sub} />
            <div className={casesRailClass}>
              {caseCards.map((item) => (
                <RelatedCard
                  key={item.href ?? item.name}
                  metrics={item.chips}
                  title={item.name}
                  eyebrow={[item.industry, item.region, item.year].filter(Boolean).join(" · ") || undefined}
                  sub={item.metrics || undefined}
                  coverImage={
                    item.coverImage ? { src: item.coverImage, alt: item.coverImageAlt ?? item.name } : undefined
                  }
                  gradient={item.gradient}
                  href={item.href}
                />
              ))}
            </div>
            <Link href={content.cases.allHref} className={hpLinkClass}>
              {content.cases.allLabel}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : null}

      {/* 9 — Testimonials */}
      <TestimonialCards slides={slides} locale={locale} title={content.testimonialsHeading} />

      {/* 10 — FAQ */}
      <section className="bg-bg">
        <FAQ heading={content.faq.heading} items={content.faq.items} locale={locale} />
      </section>

      {/* 11 — Where to go next: types, industries, cities */}
      {content.hub ? (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead heading={content.hub.heading} sub={content.hub.sub} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
              {content.hub.groups.map((g) => (
                <div key={g.title}>
                  <h3 className="m-0 mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-3">
                    {g.title}
                  </h3>
                  <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="group flex items-start justify-between gap-4 rounded-xl border border-line px-4 py-3 no-underline transition-colors duration-200 hover:border-accent-40"
                        >
                          <span>
                            <span className="block font-sans text-[14.5px] font-semibold leading-[1.35] text-ink">
                              {nb(l.label)}
                            </span>
                            {l.note ? (
                              <span className="mt-0.5 block font-sans text-[12.5px] leading-[1.5] text-ink-dim">
                                {nb(l.note)}
                              </span>
                            ) : null}
                          </span>
                          <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-ink-3" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {content.related ? (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead heading={content.related.heading} sub={content.related.sub} />
            <div className="flex flex-wrap gap-3">
              {content.related.links.map((l) => (
                <Link key={l.href} href={l.href} className={LINK_PILL}>
                  {l.label}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 12 — The same form once more for those who read to the end */}
      <LeadFormSection
        locale={locale}
        source={`${source}-bottom`}
        id="lead-form-bottom"
        title={content.bottomForm.heading}
        sub={content.bottomForm.sub}
      />
    </>
  );
}
