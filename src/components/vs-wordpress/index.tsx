import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { HpHeader, HpFooter } from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { HeroEditorial } from "@/components/blocks/hero";
import { Tier, CmpTable, CmpThead, CmpTh, CmpTd, CmpPricingGrid } from "@/components/blocks/comparison";
import { FAQ } from "@/components/blocks/final";
import type { FAQItem } from "@/types/faq";

import { SectionHead } from "@/components/shared/section-head";
import {
  type Content,
  VS_WORDPRESS_UK,
  VS_WORDPRESS_EN,
} from "@/content/comparisons/vs-wordpress";
import { hpInnerClass, hpLinkClass, hpSectionClass } from "@/components/homepage/shared";

export type VsLocale = "uk" | "en";

const CONTENT: Record<VsLocale, Content> = {
  uk: VS_WORDPRESS_UK,
  en: VS_WORDPRESS_EN,
};

export function getVsWordpressContent(locale: VsLocale): Content {
  return CONTENT[locale];
}

/* ─── View ──────────────────────────────────────────────────────────────── */

export function VsWordpressView({ locale }: { locale: VsLocale }) {
  const c = CONTENT[locale];
  return (
    <>
      <HpHeader />

      <main>
      <HeroEditorial
        eyebrow={{ label: c.hero.eyebrowLabel }}
        h1Lines={c.hero.h1Lines}
        lede={c.hero.lede}
        features={c.hero.badges}
        ctaPrimaryLabel={c.hero.ctaPrimary}
        ctaSecondaryLabel={c.hero.ctaSecondary}
        ctaSecondaryShowPlay={false}
        showStats={false}
        showTicker={false}
        deviceTags={[
          { kind: "default", primary: "WordPress", mini: "LCP 4.2s" },
          { kind: "good", primary: "Next.js", mini: "LCP 0.8s" },
          { kind: "good", primary: "0 SEO drops" },
        ]}
        variant="compare"
        deviceMockupSrc="/raw-design/assets/hero-devices.webp"
      />

      {/* 02 — Hidden costs */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.costs.eyebrow}
            heading={c.costs.heading}
            sub={c.costs.sub}
          />
          {/* Top 3 hidden-costs as full cards, remaining as a compact
              secondary row so 6 uniform cards don't read as template. */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {c.costs.items.slice(0, 3).map((it) => {
              const Icon = it.icon;
              return (
                <div
                  key={it.num}
                  className="border border-line rounded-[18px] p-6 bg-[oklch(0.155_0.005_300)] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-bold tracking-[0.18em] text-[var(--color-ink-3)]">
                      {it.num}
                    </span>
                    <span className="w-9 h-9 rounded-full inline-flex items-center justify-center bg-accent-12 text-accent-soft border border-accent-25">
                      <Icon size={16} strokeWidth={1.6} />
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-[18px] tracking-[-0.01em] text-ink">
                    {it.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-[var(--color-ink-dim)]">
                    {it.body}
                  </p>
                  <div className="mt-auto pt-2 border-t border-line text-[12px] font-mono tracking-[0.04em] text-accent-soft">
                    {it.metric}
                  </div>
                </div>
              );
            })}
          </div>
          {c.costs.items.length > 3 ? (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {c.costs.items.slice(3).map((it) => {
                const Icon = it.icon;
                return (
                  <div
                    key={it.num}
                    className="border border-line rounded-[14px] px-4 py-3.5 bg-[oklch(0.155_0.005_300)] flex items-center gap-3.5"
                  >
                    <span className="w-9 h-9 shrink-0 rounded-lg inline-flex items-center justify-center bg-accent-12 text-accent-soft border border-[oklch(from_var(--color-accent)_l_c_h_/_0.22)]">
                      <Icon size={16} strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-bold text-[13px] tracking-[0.04em] uppercase text-ink leading-tight mb-1">
                        {it.title}
                      </div>
                      <div className="text-[12px] font-mono tracking-[0.04em] text-accent-soft">
                        {it.metric}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
          <p className="mt-8 text-center text-[14px] leading-[1.65] text-[var(--color-ink-dim)] max-w-[58ch] mx-auto [&_em]:not-italic [&_em]:font-bold [&_em]:text-ink [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.costs.foot}
          </p>
        </div>
      </section>

      {/* 03 — Side-by-side */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.compare.eyebrow}
            heading={c.compare.heading}
            sub={c.compare.sub}
          />
          <div className="border border-line rounded-[18px] overflow-hidden bg-[oklch(0.155_0.005_300)]">
            <CmpTable>
              <CmpThead>
                <tr>
                  <CmpTh>{c.compare.headers.criterion}</CmpTh>
                  <CmpTh>{c.compare.headers.wp}</CmpTh>
                  <CmpTh good>{c.compare.headers.us}</CmpTh>
                </tr>
              </CmpThead>
              <tbody>
                {c.compare.rows.map((row, i) => (
                  <tr key={i}>
                    <CmpTd kind="param" data-label={c.compare.headers.criterion}>
                      {row.criterion}
                    </CmpTd>
                    <CmpTd kind="bad" data-label={c.compare.headers.wp}>
                      {row.wp}
                    </CmpTd>
                    <CmpTd kind="good" data-label={c.compare.headers.us}>
                      {row.us}
                    </CmpTd>
                  </tr>
                ))}
              </tbody>
            </CmpTable>
          </div>
        </div>
      </section>

      {/* 04 — Real migration case */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.caseStudy.eyebrow}
            heading={c.caseStudy.heading}
          />
          <div className="text-center -mt-8 mb-10 font-mono text-[12px] tracking-[0.14em] uppercase text-[var(--color-ink-3)]">
            {c.caseStudy.subEyebrow}
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="border border-line rounded-[18px] p-7 bg-[oklch(0.13_0.005_300)]">
              <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--color-ink-3)] mb-5">
                {c.caseStudy.beforeLabel}
              </div>
              <ul className="list-none flex flex-col gap-4">
                {c.caseStudy.before.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-baseline justify-between gap-4 text-[13px]"
                  >
                    <span className="text-[var(--color-ink-3)] tracking-[0.02em] uppercase font-mono text-[11px]">
                      {b.label}
                    </span>
                    <span className="text-[var(--color-ink-dim)] text-right">
                      {b.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-accent-40 rounded-[18px] p-7 bg-[linear-gradient(180deg,oklch(0.18_0.04_295)_0%,oklch(0.13_0.03_295)_100%)] shadow-[0_30px_60px_oklch(from_var(--color-accent)_l_c_h_/_0.18)]">
              <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-accent-soft mb-5">
                {c.caseStudy.afterLabel}
              </div>
              <ul className="list-none flex flex-col gap-4">
                {c.caseStudy.after.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-baseline justify-between gap-4 text-[13px]"
                  >
                    <span className="text-[var(--color-ink-3)] tracking-[0.02em] uppercase font-mono text-[11px]">
                      {a.label}
                    </span>
                    <span className="text-right">
                      <span className="text-ink font-semibold">{a.value}</span>
                      {a.lift ? (
                        <span className="block text-[11px] mt-0.5 text-accent-soft font-mono">
                          {a.lift}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <blockquote className="mt-10 border-l-2 border-accent-soft pl-6 text-[18px] leading-[1.55] text-ink max-w-[820px] mx-auto [&_em]:not-italic [&_em]:font-semibold [&_em]:text-accent-soft">
            {c.caseStudy.quote}
            <footer className="mt-4 not-italic text-[13px] text-[var(--color-ink-3)]">
              — {c.caseStudy.quoteAuthor}
            </footer>
          </blockquote>
          <div className="mt-8 text-center">
            <a href={c.caseStudy.ctaHref} className={hpLinkClass}>
              {c.caseStudy.cta}
              <ArrowRight size={14} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </section>

      {/* 05 — SEO myth-buster */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.seo.eyebrow}
            heading={c.seo.heading}
            sub={c.seo.sub}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {c.seo.cards.map((card, i) => (
              <div
                key={i}
                className="border border-line rounded-[18px] p-7 bg-[oklch(0.155_0.005_300)] flex gap-4"
              >
                <span className="w-8 h-8 shrink-0 rounded-full inline-flex items-center justify-center bg-accent-18 text-accent-soft border border-accent-30">
                  <CheckCircle2 size={16} strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="font-display font-bold text-[17px] mb-2 text-ink">
                    {card.title}
                  </h3>
                  <p className="text-[13px] leading-[1.6] text-[var(--color-ink-dim)] [&_strong]:text-accent-soft">
                    {card.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[58ch] mx-auto text-center text-[14px] leading-[1.65] text-[var(--color-ink-dim)]">
            {c.seo.closing}
          </p>
        </div>
      </section>

      {/* 06 — Sanity vs WordPress admin */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.admin.eyebrow}
            heading={c.admin.heading}
            sub={c.admin.sub}
          />
          {/* Mobile-safe table — horizontal scroll wrapper for narrow viewports */}
          <div className="border border-line rounded-[18px] overflow-x-auto bg-[oklch(0.155_0.005_300)] mb-12 md:overflow-hidden">
            <CmpTable className="min-w-[600px]">
              <CmpThead>
                <tr>
                  <CmpTh>{c.admin.compareHeaders.activity}</CmpTh>
                  <CmpTh>{c.admin.compareHeaders.wp}</CmpTh>
                  <CmpTh good>{c.admin.compareHeaders.us}</CmpTh>
                </tr>
              </CmpThead>
              <tbody>
                {c.admin.compareRows.map((row, i) => (
                  <tr key={i}>
                    <CmpTd kind="param" data-label={c.admin.compareHeaders.activity}>
                      {row.activity}
                    </CmpTd>
                    <CmpTd kind="bad" data-label={c.admin.compareHeaders.wp}>
                      {row.wp}
                    </CmpTd>
                    <CmpTd kind="good" data-label={c.admin.compareHeaders.us}>
                      {row.us}
                    </CmpTd>
                  </tr>
                ))}
              </tbody>
            </CmpTable>
          </div>

          <h3 className="font-display font-bold text-[clamp(22px,3vw,30px)] tracking-[-0.02em] text-ink mb-6 text-center">
            {c.admin.capabilitiesHeading}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {c.admin.capabilities.map((cap) => (
              <div
                key={cap.num}
                className="border border-line rounded-[18px] p-6 bg-[oklch(0.155_0.005_300)] flex flex-col gap-3"
              >
                <span className="font-display text-[11px] font-bold tracking-[0.18em] text-[var(--color-ink-3)]">
                  {cap.num}
                </span>
                <h4 className="font-display font-bold text-[17px] tracking-[-0.01em] text-ink">
                  {cap.title}
                </h4>
                <p className="text-[13px] leading-[1.55] text-[var(--color-ink-dim)]">
                  {cap.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-[64ch] mx-auto text-center text-[13px] leading-[1.65] text-[var(--color-ink-dim)] [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.admin.foot}
          </p>
        </div>
      </section>

      {/* 07 — Process */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.process.eyebrow}
            heading={c.process.heading}
          />
          <ol className="list-none grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {c.process.steps.map((s) => (
              <li
                key={s.num}
                className="border border-line rounded-[18px] p-6 bg-[oklch(0.155_0.005_300)] flex flex-col gap-3"
              >
                <span className="font-display text-[28px] font-bold text-accent-soft leading-none">
                  {s.num}
                </span>
                <h3 className="font-display font-bold text-[16px] text-ink">
                  {s.title}
                </h3>
                <span className="font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink-3)]">
                  {s.duration}
                </span>
                <p className="text-[12.5px] leading-[1.55] text-[var(--color-ink-dim)]">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 07 — What we don't do */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.filter.eyebrow}
            heading={c.filter.heading}
            sub={c.filter.sub}
          />
          <ul className="list-none flex flex-col gap-3 max-w-[820px] mx-auto">
            {c.filter.items.map((it, i) => (
              <li
                key={i}
                className="flex gap-4 border border-line rounded-[14px] p-5 bg-[oklch(0.13_0.005_300)]"
              >
                <span className="w-7 h-7 shrink-0 rounded-full inline-flex items-center justify-center bg-[oklch(0.55_0.18_25_/_0.12)] text-[oklch(0.7_0.18_25)] border border-[oklch(0.55_0.18_25_/_0.3)]">
                  <XCircle size={15} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display font-bold text-[15px] text-ink mb-1">
                    {it.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-[var(--color-ink-dim)]">
                    {it.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-7 text-center text-[13px] leading-[1.65] text-[var(--color-ink-3)] max-w-[60ch] mx-auto">
            {c.filter.foot}
          </p>
        </div>
      </section>

      {/* 08 — Pricing */}
      <section className={hpSectionClass} id="pricing">
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.pricing.eyebrow}
            heading={c.pricing.heading}
            sub={c.pricing.sub}
          />
          <CmpPricingGrid>
            {c.pricing.tiers.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </CmpPricingGrid>
          <p className="mt-7 text-center text-[13px] text-[var(--color-ink-3)] max-w-[64ch] mx-auto">
            {c.pricing.foot}
          </p>
        </div>
      </section>

      {/* 09 — FAQ */}
      <FAQ
        heading={
          locale === "en"
            ? "What people ask most"
            : "Що питають найчастіше"
        }
        items={c.faq.items.map<FAQItem>((it) => ({
          q: it.q,
          a: [it.a],
        }))}
      />

      {/* 10 — Final CTA */}
      <LaunchCta locale={locale} />
      </main>
      <HpFooter />
    </>
  );
}
