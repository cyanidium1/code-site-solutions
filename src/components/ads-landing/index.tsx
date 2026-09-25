import { Check } from "lucide-react";

import type { Locale } from "@/constants/locales";
import { PACKAGES } from "@/constants/pricing";
import type { CaseStudyRef } from "@/types/sanity";
import type { TestimonialSlide } from "@/lib/server/fetch-testimonials";
import { loc } from "@/lib/shared/sanity-locale";
import { renderRich } from "@/lib/shared/rich-text";
import { SanityImg } from "@/lib/shared/sanity-image";
import {
  LeadFormCard,
  LeadFormSection,
  PackageCards,
  UspLine,
} from "@/components/blocks/packages";
import { TestimonialCards } from "@/components/blocks/testimonials";
import {
  hpH2Class,
  hpInnerClass,
  hpSectionClass,
  hpSectionHeadClass,
  hpSubClass,
} from "@/components/homepage/shared";
import { cn } from "@/components/ui";
import { AdsLandingFooter, AdsLandingHeader } from "./header";
import type { AdsLandingContent } from "./types";

export type { AdsLandingContent } from "./types";

/** Cases shown on the Ads landing, in this order (TZ v2 §4). */
export const ADS_LANDING_CASE_SLUGS = [
  "nbyg-kobenhavn",
  "icelab",
  "efedra-clinic",
  "mono-pools",
] as const;

/** Picks the landing's cases out of the portfolio feed, keeping the order. */
export function pickAdsLandingCases(all: CaseStudyRef[]): CaseStudyRef[] {
  return ADS_LANDING_CASE_SLUGS.map((s) => all.find((c) => c.slug === s)).filter(
    (c): c is CaseStudyRef => Boolean(c),
  );
}

const CASE_IMG_SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw";

/**
 * Google Ads landing (TZ v2 §4). Server-rendered; the lead form is the only
 * client island. No site menu, no links out except the contract in the footer.
 */
export function AdsLandingView({
  locale,
  content: c,
  source,
  cases,
  testimonials,
}: {
  locale: Locale;
  content: AdsLandingContent;
  /** Lead source prefix, e.g. "ads-zamovyty-sait". */
  source: string;
  cases: CaseStudyRef[];
  testimonials: TestimonialSlide[];
}) {
  // Testimonial cards link to case pages; the landing keeps visitors on the offer.
  const slides = testimonials.map((s) => ({ ...s, caseHref: undefined }));

  return (
    <>
      <AdsLandingHeader content={c.header} />
      <main>
        {/* 1. Hero: H1 + bullets + form in the first screen */}
        <section className={cn(hpSectionClass, "pt-8 sm:pt-10 lg:pt-16 lg:pb-20")}>
          <div
            className={cn(
              hpInnerClass,
              "grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12",
            )}
          >
            <div className="flex flex-col gap-5 lg:pt-6">
              <p className="m-0 font-mono text-[12px] uppercase tracking-[0.06em] text-ink-3">
                {c.hero.eyebrow}
              </p>
              <h1 className="m-0 font-actay text-[clamp(28px,7.4vw,40px)] font-bold uppercase leading-[1.05] text-ink lg:text-[clamp(40px,4vw,58px)]">
                {c.hero.h1}
              </h1>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 sm:flex-row sm:flex-wrap sm:gap-x-6">
                {c.hero.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 font-sans text-[16px] font-medium text-ink">
                    <Check size={18} strokeWidth={2.2} className="shrink-0 text-accent-soft" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="m-0 max-w-[560px] font-sans text-[15.5px] leading-[1.6] text-ink-dim">
                {c.hero.sub}
              </p>
              <UspLine locale={locale} className="hidden lg:block" />
            </div>
            <LeadFormCard locale={locale} source={source} tier="business" />
          </div>
        </section>

        {/* 2. Packages */}
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <div className={hpSectionHeadClass}>
              <h2 className={hpH2Class}>{c.packages.title}</h2>
              <p className={cn(hpSubClass, "mt-0")}>{c.packages.sub}</p>
            </div>
            <PackageCards locale={locale} source={`${source}-package`} />
          </div>
        </section>

        {/* 3. What's included (business package) */}
        <section className={hpSectionClass}>
          <div className={cn(hpInnerClass, "max-w-[900px]")}>
            <div className={hpSectionHeadClass}>
              <h2 className={hpH2Class}>{c.includes.title}</h2>
              <p className={cn(hpSubClass, "mt-0")}>{c.includes.sub}</p>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
              {PACKAGES.business.includes[locale].map((item) => (
                <li key={item} className="flex items-start gap-3 font-sans text-[16px] leading-[1.5] text-ink">
                  <Check size={18} strokeWidth={2.2} className="mt-[3px] shrink-0 text-accent-soft" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 mb-0 font-sans text-[14.5px] leading-[1.6] text-ink-dim">
              {c.includes.afterYear}
            </p>
          </div>
        </section>

        {/* 4. Cases with numbers (metricsLine from Sanity only) */}
        {cases.length ? (
          <section className={hpSectionClass}>
            <div className={hpInnerClass}>
              <div className={hpSectionHeadClass}>
                <h2 className={hpH2Class}>{c.cases.title}</h2>
                <p className={cn(hpSubClass, "mt-0")}>{c.cases.sub}</p>
              </div>
              <ul className="-mx-6 my-0 flex list-none snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:w-[80%] [&>*]:shrink-0 [&>*]:snap-start sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:[&>*]:w-auto lg:grid-cols-4">
                {cases.map((cs) => {
                  const name = loc(cs.title, locale) || cs.client || cs.slug;
                  const meta = [loc(cs.industry?.title, locale), loc(cs.region, locale), cs.year]
                    .filter(Boolean)
                    .join(" · ");
                  const metrics = (loc(cs.metricsLine, locale) || "")
                    .split("·")
                    .map((m) => m.trim())
                    .filter(Boolean);
                  return (
                    <li
                      key={cs.slug}
                      className="overflow-hidden rounded-frame border border-line bg-[oklch(1_0_0_/_0.02)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[oklch(0.16_0.006_300)]">
                        {cs.coverImage?.asset?.url ? (
                          <SanityImg
                            image={cs.coverImage.asset.url}
                            alt={loc(cs.coverImage.alt, locale) || name}
                            sizes={CASE_IMG_SIZES}
                            widths={[400, 600, 800]}
                            fill
                            className="object-cover object-top"
                          />
                        ) : null}
                      </div>
                      <div className="px-5 py-5">
                        <h3 className="m-0 font-actay text-lg font-semibold uppercase leading-[1.2] text-ink">
                          {name}
                        </h3>
                        {meta ? (
                          <p className="mt-1 mb-0 font-mono text-[12px] text-ink-3">{meta}</p>
                        ) : null}
                        {metrics.length ? (
                          <ul className="mt-4 mb-0 flex list-none flex-col gap-1.5 p-0">
                            {metrics.map((m) => (
                              <li key={m} className="font-sans text-[13.5px] leading-[1.5] text-ink-dim">
                                {m}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ) : null}

        {/* 5. Testimonials */}
        <TestimonialCards slides={slides} locale={locale} limit={4} title={c.testimonialsTitle} />

        {/* 6. Code vs constructor */}
        <section className={hpSectionClass}>
          <div className={cn(hpInnerClass, "max-w-[900px]")}>
            <div className={hpSectionHeadClass}>
              <h2 className={hpH2Class}>{c.comparison.title}</h2>
              <p className={cn(hpSubClass, "mt-0")}>{c.comparison.sub}</p>
            </div>
            <div className="overflow-x-auto rounded-card border border-line">
              <table className="w-full min-w-[560px] border-collapse text-left font-sans text-[14.5px]">
                <thead>
                  <tr>
                    <th className="border-b border-line px-4 py-3" />
                    <th className="border-b border-line px-4 py-3 font-mono text-[12px] font-normal uppercase tracking-[0.06em] text-accent-soft">
                      {c.comparison.colUs}
                    </th>
                    <th className="border-b border-line px-4 py-3 font-mono text-[12px] font-normal uppercase tracking-[0.06em] text-ink-3">
                      {c.comparison.colBuilder}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {c.comparison.rows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row" className="border-b border-line px-4 py-3 align-top font-medium text-ink">
                        {r.label}
                      </th>
                      <td className="border-b border-line px-4 py-3 align-top text-ink">{r.us}</td>
                      <td className="border-b border-line px-4 py-3 align-top text-ink-dim">{r.builder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 mb-0 font-sans text-[12.5px] text-ink-3">{c.comparison.note}</p>
          </div>
        </section>

        {/* 7. Process by days */}
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <div className={hpSectionHeadClass}>
              <h2 className={hpH2Class}>{c.process.title}</h2>
              <p className={cn(hpSubClass, "mt-0")}>{c.process.sub}</p>
            </div>
            <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {c.process.steps.map((s) => (
                <li key={s.days} className="flex flex-col gap-2 rounded-card border border-line bg-[oklch(0.16_0.006_300)] p-5">
                  <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-accent-soft">
                    {s.days}
                  </span>
                  <h3 className="m-0 font-sans text-[17px] font-semibold text-ink">{s.title}</h3>
                  <p className="m-0 font-sans text-[14.5px] leading-[1.55] text-ink-dim">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 8. FAQ */}
        <section className={hpSectionClass}>
          <div className={cn(hpInnerClass, "max-w-[900px]")}>
            <div className={hpSectionHeadClass}>
              <h2 className={hpH2Class}>{c.faq.title}</h2>
            </div>
            <div className="flex flex-col border-t border-line">
              {c.faq.items.map((it) => (
                <details key={it.q} className="group border-b border-line py-4">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-sans text-[16.5px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {it.q}
                    <span aria-hidden className="shrink-0 text-ink-3 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 mb-0 font-sans text-[15px] leading-[1.6] text-ink-dim">
                    {renderRich(it.a)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Form again */}
        <LeadFormSection
          locale={locale}
          source={`${source}-bottom`}
          tier="business"
          id="lead-form-2"
          title={c.finalForm.title}
          sub={c.finalForm.sub}
        />
      </main>
      <AdsLandingFooter content={c.footer} />
    </>
  );
}
