import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";

import { FAQ } from "@/components/blocks/final";
import { RelatedCard, casesRailClass } from "@/components/blocks/related-card";
import {
  AddonsTable,
  LEAD_FORM_ANCHOR,
  LeadFormCard,
  PaymentTerms,
  UspLine,
} from "@/components/blocks/packages";
import { TestimonialCards } from "@/components/blocks/testimonials";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import {
  ALL_CASES_LINK_CLASS,
  HEADING_EM_CLASS,
  SectionHead,
  SiblingServices,
  em,
} from "@/components/landing-page";
import type { PackagePageContent } from "@/components/landing-page/types";
import { fetchCaseStudies } from "@/components/case-page/data";
import { JsonLd } from "@/components/shared/json-ld";
import { localizePath, resolveRootHref } from "@/constants/i18n-routes";
import type { Locale } from "@/constants/locales";
import { PACKAGES, PACKAGE_ADDONS, packagePrice } from "@/constants/pricing";
import { LOCALE_MARKET } from "@/constants/pricing";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { PACKAGES_UI } from "@/content/packages-ui";
import { getContentRegistrySafe } from "@/lib/server/i18n-registry";
import { fetchTestimonialSlides } from "@/lib/server/fetch-testimonials";
import { buildAlternates } from "@/lib/shared/alternates";
import { caseRefToCardItem } from "@/lib/shared/case-card-item";
import { LOCALE_CURRENCY } from "@/lib/shared/format-price";
import { breadcrumbNode, buildJsonLd, webPageNode } from "@/lib/shared/jsonld";
import { plainRich } from "@/lib/shared/rich-text";

/** "День 1" / "Дні 2–3" / "Days 4–6". */
const DAY_LABEL: Record<Locale, (from: number, to?: number) => string> = {
  uk: (f, t) => (t && t > f ? `Дні ${f}–${t}` : `День ${f}`),
  ru: (f, t) => (t && t > f ? `Дни ${f}–${t}` : `День ${f}`),
  en: (f, t) => (t && t > f ? `Days ${f}–${t}` : `Day ${f}`),
};

const OG_LOCALE: Record<Locale, string> = { uk: "uk_UA", ru: "ru_UA", en: "en_GB" };

const pathFor = (c: PackagePageContent, locale: Locale) => localizePath(c.rootPath, locale);

/** Metadata for a package page — title/description come from the content file. */
export function packagePageMetadata(c: PackagePageContent, locale: Locale): Metadata {
  const url = pageUrl(pathFor(c, locale));
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: buildAlternates({ locale, uaPath: c.rootPath }),
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      type: "website",
      locale: OG_LOCALE[locale],
      url,
      images: [OG_DEFAULT_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: c.metaTitle,
      description: c.metaDescription,
      images: [OG_DEFAULT_IMAGE.url],
    },
  };
}

/** WebPage + Breadcrumb + Service/Offer (price from config) + FAQPage. */
function packagePageJsonLd(c: PackagePageContent, locale: Locale) {
  const path = pathFor(c, locale);
  const url = pageUrl(path);
  return buildJsonLd([
    webPageNode({ path, locale, title: c.metaTitle, description: c.metaDescription }),
    breadcrumbNode([
      { name: c.breadcrumbHome, path: localizePath("/", locale) },
      { name: c.breadcrumbSelf, path },
    ]),
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: c.serviceName,
      description: c.metaDescription,
      provider: { "@id": ORG_ID },
      // Market, not locale: the international market sells across the EU.
      areaServed: LOCALE_MARKET[locale] === "intl" ? ["EU", "GB", "DK"] : ["UA"],
      offers: {
        "@type": "Offer",
        name: c.offerName,
        price: String(packagePrice(c.pkg, locale)),
        priceCurrency: LOCALE_CURRENCY[locale],
        url,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: c.faq.items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
      })),
    },
  ]);
}

const LIST_CLASS = "m-0 flex list-none flex-col gap-3 p-0";
const LI_CLASS = "flex items-start gap-2.5 font-sans text-[15px] leading-[1.55]";
const CARD_CLASS = "rounded-2xl border border-line p-5 md:rounded-[22px] md:p-7";

function Bullets({ items, tone }: { items: string[]; tone: "yes" | "no" }) {
  const Icon = tone === "yes" ? Check : Minus;
  return (
    <ul className={LIST_CLASS}>
      {items.map((t) => (
        <li key={t} className={`${LI_CLASS} ${tone === "yes" ? "text-ink" : "text-ink-dim"}`}>
          <Icon
            size={17}
            strokeWidth={2.2}
            className={`mt-[3px] shrink-0 ${tone === "yes" ? "text-accent-soft" : "text-ink-3"}`}
            aria-hidden="true"
          />
          {t}
        </li>
      ))}
    </ul>
  );
}

/**
 * Package page (TZ v2 §3.5): one package — H1 with price and term, the lead
 * form right under it, composition, add-ons, process by days, cases,
 * testimonials, FAQ. Every price/term comes from `@/constants/pricing`.
 */
export async function PackagePageView({
  locale,
  content: c,
}: {
  locale: Locale;
  content: PackagePageContent;
}) {
  const [cases, registry, testimonials] = await Promise.all([
    fetchCaseStudies(),
    getContentRegistrySafe(),
    fetchTestimonialSlides(locale),
  ]);
  const pkg = PACKAGES[c.pkg];
  const selfPath = c.rootPath;
  const source = `${selfPath.slice(1)}-page`;

  const caseItems = c.cases.slugs
    .map((slug) => cases.find((x) => x.slug === slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .slice(0, 3)
    .map((x) => caseRefToCardItem(x, locale, registry));

  return (
    <>
      <JsonLd data={packagePageJsonLd(c, locale)} />

      {/* 1 — Hero: H1 with price + term, the form right under it on phones,
          beside it on desktop. */}
      <section className="relative overflow-hidden bg-bg px-6 pt-10 pb-10 sm:px-8 lg:px-12 lg:pt-16 lg:pb-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 [background:radial-gradient(ellipse_50%_44%_at_74%_26%,var(--color-accent-15),transparent_68%),radial-gradient(ellipse_56%_44%_at_8%_108%,oklch(from_var(--color-accent-2)_l_c_h_/_0.12),transparent_72%)]" />
        </div>
        <div className="relative mx-auto grid max-w-container grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_0.92fr] lg:gap-12 xl:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          <div>
            <nav aria-label="breadcrumb" className="mb-5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
              <Link href={localizePath("/", locale)} className="text-ink-3 no-underline hover:text-ink">
                {c.breadcrumbHome}
              </Link>
              <span aria-hidden> / </span>
              <span>{c.breadcrumbSelf}</span>
            </nav>
            <p className="m-0 mb-4 font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent-soft">
              {c.eyebrow}
            </p>
            <h1 className="m-0 font-actay text-[clamp(28px,4.2vw,50px)] font-bold uppercase leading-[1.08] text-ink [text-wrap:balance]">
              {c.h1}
            </h1>
            <p className="mt-5 mb-0 max-w-[540px] font-sans text-[15.5px] leading-[1.65] text-ink-dim">
              {c.sub}
            </p>
            <UspLine locale={locale} className="mt-5 max-w-[540px]" />
            <div className="mt-8 grid max-w-[520px] grid-cols-2 gap-x-7 gap-y-6 max-lg:hidden">
              {c.badges.map((b, i) => (
                <div key={b.label} className={i % 2 === 1 ? "border-l border-line pl-7" : ""}>
                  <div className="font-actay text-[15px] font-bold uppercase leading-[1.15] text-ink">
                    {b.label}
                  </div>
                  <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-3">
                    {b.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <LeadFormCard locale={locale} source={source} tier={c.pkg} />
        </div>
      </section>

      {/* 2 — Composition: what's in, what's not */}
      <section className={hpSectionClass} id="composition">
        <div className={hpInnerClass}>
          <SectionHead heading={c.composition.heading} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
            <div className={CARD_CLASS}>
              <h3 className="m-0 mb-5 font-mono text-[12px] font-normal uppercase tracking-[0.1em] text-ink-3">
                {c.composition.includesTitle}
              </h3>
              <Bullets items={pkg.includes[locale]} tone="yes" />
            </div>
            <div className={CARD_CLASS}>
              <h3 className="m-0 mb-5 font-mono text-[12px] font-normal uppercase tracking-[0.1em] text-ink-3">
                {c.composition.excludesTitle}
              </h3>
              <Bullets items={pkg.excludes[locale]} tone="no" />
              <p className="m-0 mt-5 font-sans text-[14px] leading-[1.6] text-ink-dim">
                {c.composition.excludesFoot}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — When this package fits */}
      {c.when ? (
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <SectionHead heading={c.when.heading} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
              <div className={CARD_CLASS}>
                <h3 className="m-0 mb-5 font-actay text-[17px] font-bold uppercase text-ink">
                  {c.when.fitTitle}
                </h3>
                <Bullets items={c.when.fit} tone="yes" />
              </div>
              <div className={CARD_CLASS}>
                <h3 className="m-0 mb-5 font-actay text-[17px] font-bold uppercase text-ink">
                  {c.when.notFitTitle}
                </h3>
                <Bullets items={c.when.notFit} tone="no" />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 4 — Process by days */}
      <section className={hpSectionClass} id="process">
        <div className={hpInnerClass}>
          <SectionHead heading={c.process.heading} sub={c.process.sub} />
          <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 xl:grid-cols-4">
            {c.process.steps.map((s) => (
              <li key={s.from} className={CARD_CLASS}>
                <div className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-accent-soft">
                  {DAY_LABEL[locale](s.from, s.to)}
                </div>
                <h3 className="m-0 mt-3 font-actay text-[17px] font-bold uppercase leading-[1.2] text-ink">
                  {s.title}
                </h3>
                <p className="m-0 mt-3 font-sans text-[14.5px] leading-[1.6] text-ink-dim">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 — Subscription-builder comparison (/online-store) */}
      {c.compare ? (
        <section className={hpSectionClass} id="compare">
          <div className={hpInnerClass}>
            <SectionHead heading={c.compare.heading} sub={c.compare.sub} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
              <div className={CARD_CLASS}>
                <h3 className="m-0 font-mono text-[12px] font-normal uppercase tracking-[0.1em] text-ink-3">
                  {c.compare.theirsTitle}
                </h3>
                <p className="m-0 mt-4 font-actay text-[clamp(18px,1.8vw,22px)] font-bold uppercase leading-[1.25] text-ink">
                  {c.compare.theirsLine}
                </p>
                <ul className="m-0 mt-5 flex list-none flex-col gap-2 p-0">
                  {c.compare.theirsRows.map((r) => (
                    <li
                      key={r.name}
                      className="flex flex-wrap justify-between gap-x-4 border-b border-line pb-2 font-sans text-[14px] text-ink-dim"
                    >
                      <span className="text-ink">{r.name}</span>
                      <span className="tabular-nums">{r.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Bullets items={c.compare.theirsPoints} tone="no" />
                </div>
              </div>
              <div className={`${CARD_CLASS} border-accent-40`}>
                <h3 className="m-0 font-mono text-[12px] font-normal uppercase tracking-[0.1em] text-accent-soft">
                  {c.compare.oursTitle}
                </h3>
                <p className="m-0 mt-4 font-actay text-[clamp(18px,1.8vw,22px)] font-bold uppercase leading-[1.25] text-ink">
                  {c.compare.oursLine}
                </p>
                <div className="mt-5">
                  <Bullets items={c.compare.oursPoints} tone="yes" />
                </div>
              </div>
            </div>
            <p className="m-0 mt-5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
              {c.compare.checked}
            </p>
          </div>
        </section>
      ) : null}

      {/* 6 — Add-ons offered with this package */}
      <section className={hpSectionClass} id="addons">
        <div className={hpInnerClass}>
          <SectionHead heading={c.addons.heading} sub={c.addons.sub} />
          <div className="max-w-[760px]">
            <AddonsTable locale={locale} ids={PACKAGE_ADDONS[c.pkg]} />
            <Link href={c.addons.calcHref} className={`${ALL_CASES_LINK_CLASS} mt-6`}>
              {c.addons.calcLabel}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7 — Cases (numbers only from the case data) */}
      {caseItems.length ? (
        <section className={hpSectionClass} id="cases">
          <div className={hpInnerClass}>
            <SectionHead heading={c.cases.heading} sub={c.cases.sub} />
            <div className={casesRailClass}>
              {caseItems.map((item) => (
                <RelatedCard
                  key={item.href ?? item.name}
                  metrics={item.chips}
                  title={item.name}
                  eyebrow={[item.industry, item.region, item.year].filter(Boolean).join(" · ") || undefined}
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
            <Link href={c.cases.allHref} className={ALL_CASES_LINK_CLASS}>
              {c.cases.allLabel}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : null}

      {/* 8 — Testimonials */}
      <TestimonialCards slides={testimonials} locale={locale} limit={3} />

      {/* 9 — Payment terms */}
      <section className={hpSectionClass}>
        <div className={`${hpInnerClass} max-w-[760px]`}>
          <SectionHead heading={c.payment.heading} />
          <PaymentTerms locale={locale} />
        </div>
      </section>

      {/* 10 — FAQ */}
      <section className="bg-bg">
        <FAQ heading={c.faq.heading} items={c.faq.items} locale={locale} />
      </section>

      {/* 11 — Final CTA + after-launch SEO upsell */}
      <section className={hpSectionClass}>
        <div className={`${hpInnerClass} max-w-[840px]`}>
          <h2 className={`m-0 font-actay text-[clamp(24px,3vw,38px)] font-bold uppercase leading-[1.12] text-ink ${HEADING_EM_CLASS}`}>
            {em(c.cta.heading)}
          </h2>
          <p className="mt-4 mb-0 max-w-[640px] font-sans text-base leading-[1.6] text-ink-dim">{c.cta.sub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`#${LEAD_FORM_ANCHOR}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[oklch(0.98_0.005_300)] px-6 font-sans text-[14px] font-semibold text-[oklch(0.22_0.06_295)] no-underline"
            >
              {c.cta.formLabel}
            </a>
            <Link
              href={c.cta.calcHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong px-6 font-sans text-[14px] font-medium text-ink no-underline"
            >
              {c.cta.calcLabel}
            </Link>
          </div>
          <p className="m-0 mt-8 font-sans text-[14.5px] leading-[1.6] text-ink-dim">
            {c.seo.line ?? PACKAGES_UI[locale].afterLaunchSeo(locale)}.{" "}
            <Link href={resolveRootHref(c.seo.href, locale)} className="rich-link">
              {c.seo.linkLabel}
            </Link>
          </p>
        </div>
      </section>

      {/* 12 — Niche articles + sibling services */}
      {c.related ? (
        <section className="bg-bg px-6 pt-8 sm:px-8 lg:px-12 lg:pt-12">
          <div className="mx-auto max-w-container">
            <h2 className="m-0 font-actay text-[clamp(20px,2.2vw,28px)] font-bold uppercase leading-[1.15] text-ink">
              {c.related.heading}
            </h2>
            {c.related.sub ? (
              <p className="mt-3 mb-0 max-w-[640px] font-sans text-[14.5px] leading-[1.6] text-ink-dim">
                {c.related.sub}
              </p>
            ) : null}
            <ul className="mt-4 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 lg:mt-5 lg:gap-x-7">
              {c.related.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="rich-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      <SiblingServices locale={locale} self={selfPath} />
    </>
  );
}
