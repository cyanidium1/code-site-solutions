import { CheckCircle2, XCircle } from "lucide-react";
import { HpHeader, HpFooter } from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { HeroEditorial } from "@/components/blocks/hero";
import { CmpTable, CmpThead, CmpTh, CmpTd } from "@/components/blocks/comparison";
import { FAQ } from "@/components/blocks/final";
import type { FAQItem } from "@/types/faq";

import { SectionHead } from "@/components/shared/section-head";
import {
  type Content,
  VS_FREELANCERS_UK,
  VS_FREELANCERS_EN,
} from "@/content/comparisons/vs-freelancers";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { localizePath } from "@/constants/i18n-routes";

export type VfLocale = "uk" | "en";

const CONTENT: Record<VfLocale, Content> = {
  uk: VS_FREELANCERS_UK,
  en: VS_FREELANCERS_EN,
};

export function getVsFreelancersContent(locale: VfLocale): Content {
  return CONTENT[locale];
}

/* ─── View ──────────────────────────────────────────────────────────────── */

export function VsFreelancersView({ locale }: { locale: VfLocale }) {
  const c = CONTENT[locale];
  const isEn = locale === "en";

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
        ctaPrimaryHref={localizePath("/calculator", isEn)}
        ctaSecondaryLabel={c.hero.ctaSecondary}
        ctaSecondaryHref={localizePath("/process", isEn)}
        ctaSecondaryShowPlay={false}
        showStats={false}
        showTicker={false}
        deviceTags={[
          { kind: "default", primary: "1 freelancer" },
          { kind: "default", primary: "→" },
          { kind: "good", primary: "12 people", mini: "0 ghost" },
        ]}
        variant="compare"
        deviceMockupSrc="/raw-design/assets/hero-devices.webp"
      />

      {/* 02 — 6 freelancer horror stories */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.horrorStories.eyebrow}
            heading={c.horrorStories.heading}
            sub={c.horrorStories.sub}
          />
          {/* Top 3 horror-stories as full cards, rest compact. */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {c.horrorStories.items.slice(0, 3).map((it) => {
              const Icon = it.icon;
              return (
                <div
                  key={it.num}
                  className="border border-line rounded-[18px] p-6 bg-[oklch(0.155_0.005_300)] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-bold tracking-[0.18em] text-ink-3">
                      {it.num}
                    </span>
                    <span className="w-9 h-9 rounded-full inline-flex items-center justify-center bg-[oklch(0.55_0.18_25_/_0.12)] text-[oklch(0.78_0.15_25)] border border-[oklch(0.55_0.18_25_/_0.3)]">
                      <Icon size={16} strokeWidth={1.6} />
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-[17px] tracking-[-0.01em] text-ink">
                    {it.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-ink-dim">
                    {it.body}
                  </p>
                </div>
              );
            })}
          </div>
          {c.horrorStories.items.length > 3 ? (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {c.horrorStories.items.slice(3).map((it) => {
                const Icon = it.icon;
                return (
                  <div
                    key={it.num}
                    className="border border-line rounded-[14px] px-4 py-3.5 bg-[oklch(0.155_0.005_300)] flex items-center gap-3.5"
                  >
                    <span className="w-9 h-9 shrink-0 rounded-lg inline-flex items-center justify-center bg-[oklch(0.55_0.18_25_/_0.12)] text-[oklch(0.78_0.15_25)] border border-[oklch(0.55_0.18_25_/_0.3)]">
                      <Icon size={16} strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0 flex-1 font-display font-bold text-[13px] tracking-[0.04em] uppercase text-ink leading-tight">
                      {it.title}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
          <p className="mt-8 max-w-[68ch] mx-auto text-center text-[14px] leading-[1.65] text-ink-dim [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.horrorStories.foot}
          </p>
        </div>
      </section>

      {/* 03 — When a freelancer is the right choice */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.rightChoice.eyebrow}
            heading={c.rightChoice.heading}
            sub={c.rightChoice.sub}
          />
          <ul className="list-none flex flex-col gap-3 max-w-[820px] mx-auto">
            {c.rightChoice.items.map((it, i) => (
              <li
                key={i}
                className="flex gap-4 border border-line rounded-[14px] p-5 bg-[oklch(0.13_0.005_300)]"
              >
                <span className="w-7 h-7 shrink-0 rounded-full inline-flex items-center justify-center bg-accent-15 text-accent-soft border border-accent-30">
                  <CheckCircle2 size={15} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display font-bold text-[15px] text-ink mb-1">
                    {it.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-ink-dim">
                    {it.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-7 text-center text-[13px] leading-[1.65] text-ink-3 max-w-[60ch] mx-auto">
            {c.rightChoice.foot}
          </p>
        </div>
      </section>

      {/* 04 — Side-by-side comparison table */}
      <section className={hpSectionClass} id="compare-table">
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
                  <CmpTh>{c.compare.headers.freelancer}</CmpTh>
                  <CmpTh good>{c.compare.headers.us}</CmpTh>
                </tr>
              </CmpThead>
              <tbody>
                {c.compare.rows.map((row, i) => (
                  <tr key={i}>
                    <CmpTd kind="param" data-label={c.compare.headers.criterion}>
                      {row.criterion}
                    </CmpTd>
                    <CmpTd kind="bad" data-label={c.compare.headers.freelancer}>
                      {row.freelancer}
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

      {/* 05 — 12 people on your project */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.team.eyebrow}
            heading={c.team.heading}
            sub={c.team.sub}
          />

          <h3 className="font-display text-[12px] font-bold tracking-[0.16em] uppercase text-accent-soft mb-4 text-center">
            {c.team.coreHeading}
          </h3>
          <div className="grid grid-cols-1 gap-4 mb-12 md:grid-cols-2">
            {c.team.core.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.role}
                  className="border border-line rounded-[18px] p-6 bg-[oklch(0.155_0.005_300)] flex gap-4 items-start"
                >
                  <span className="w-10 h-10 shrink-0 rounded-full inline-flex items-center justify-center bg-accent-12 text-accent-soft border border-accent-25">
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-[16px] tracking-[-0.01em] text-ink mb-1">
                      {p.role}
                    </h4>
                    <p className="text-[13px] leading-[1.55] text-ink-dim">
                      {p.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="font-display text-[12px] font-bold tracking-[0.16em] uppercase text-ink-3 mb-4 text-center max-w-[64ch] mx-auto">
            {c.team.partnersHeading}
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {c.team.partners.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.role}
                  className="border border-line rounded-[14px] p-5 bg-[oklch(0.13_0.005_300)] flex flex-col gap-2"
                >
                  <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-[oklch(0.18_0.005_300)] text-ink-dim border border-line">
                    <Icon size={15} strokeWidth={1.6} />
                  </span>
                  <h4 className="font-display font-bold text-[14px] tracking-[-0.01em] text-ink">
                    {p.role}
                  </h4>
                  <p className="text-[12px] leading-[1.5] text-ink-3">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-[13px] leading-[1.65] text-ink-dim max-w-[60ch] mx-auto">
            {c.team.foot}
          </p>
        </div>
      </section>

      {/* 06 — What you actually pay for */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.payFor.eyebrow}
            heading={c.payFor.heading}
            sub={c.payFor.sub}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {c.payFor.items.map((it) => {
              const Icon = it.icon;
              return (
                <div
                  key={it.num}
                  className="border border-line rounded-[18px] p-6 bg-[oklch(0.155_0.005_300)] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-bold tracking-[0.18em] text-ink-3">
                      {it.num}
                    </span>
                    <span className="w-9 h-9 rounded-full inline-flex items-center justify-center bg-accent-12 text-accent-soft border border-accent-25">
                      <Icon size={16} strokeWidth={1.6} />
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-[16px] tracking-[-0.01em] text-ink">
                    {it.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-ink-dim">
                    {it.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 07 — After launch (Sanity Studio) */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.admin.eyebrow}
            heading={c.admin.heading}
            sub={c.admin.sub}
          />

          <div className="grid grid-cols-[1.5fr_1fr] gap-6 mb-12 max-[900px]:grid-cols-1">
            <figure className="m-0 flex flex-col">
              <div className="relative border border-line rounded-[14px] overflow-hidden bg-[oklch(0.13_0.005_300)] aspect-[16/9]">
                <img
                  src="/sanity-studio/admin-desktop.png"
                  alt={c.admin.desktopAlt}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 text-[12px] leading-[1.5] text-ink-3 text-center">
                {c.admin.desktopCaption}
              </figcaption>
            </figure>
            <figure className="m-0 flex flex-col">
              <div className="relative border border-line rounded-[14px] overflow-hidden bg-[oklch(0.13_0.005_300)] aspect-[9/16] max-w-[280px] mx-auto w-full">
                <img
                  src="/sanity-studio/admin-mobile.png"
                  alt={c.admin.mobileAlt}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 text-[12px] leading-[1.5] text-ink-3 text-center">
                {c.admin.mobileCaption}
              </figcaption>
            </figure>
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
                <span className="font-display text-[11px] font-bold tracking-[0.18em] text-ink-3">
                  {cap.num}
                </span>
                <h4 className="font-display font-bold text-[17px] tracking-[-0.01em] text-ink">
                  {cap.title}
                </h4>
                <p className="text-[13px] leading-[1.55] text-ink-dim">
                  {cap.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-[68ch] mx-auto text-center text-[13px] leading-[1.65] text-ink-dim [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.admin.foot}
          </p>
        </div>
      </section>

      {/* 08 — Real case (rescue pattern) */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.caseStudy.eyebrow}
            heading={c.caseStudy.heading}
            sub={c.caseStudy.sub}
          />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {[
              { heading: c.caseStudy.situationHeading, items: c.caseStudy.situation, tone: "bad" as const },
              { heading: c.caseStudy.actionHeading, items: c.caseStudy.action, tone: "neutral" as const },
              { heading: c.caseStudy.outcomeHeading, items: c.caseStudy.outcome, tone: "good" as const },
            ].map((col, i) => (
              <div
                key={i}
                className={`border rounded-[18px] p-6 flex flex-col gap-4 ${
                  col.tone === "good"
                    ? "border-accent-30 bg-accent-6"
                    : "border-line bg-[oklch(0.155_0.005_300)]"
                }`}
              >
                <h3
                  className={`font-display text-[12px] font-bold tracking-[0.16em] uppercase ${
                    col.tone === "good" ? "text-accent-soft" : "text-ink-3"
                  }`}
                >
                  {col.heading}
                </h3>
                <ul className="list-none flex flex-col gap-2.5">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex gap-2.5 text-[13px] leading-[1.55] text-ink-dim">
                      <span
                        className={`mt-[6px] w-1.5 h-1.5 shrink-0 rounded-full ${
                          col.tone === "good"
                            ? "bg-accent-soft"
                            : col.tone === "bad"
                              ? "bg-[oklch(0.65_0.18_25)]"
                              : "bg-ink-3"
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[68ch] mx-auto text-center text-[14px] leading-[1.65] text-ink-dim [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.caseStudy.foot}
          </p>
        </div>
      </section>

      {/* 09 — What we don't do */}
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
                  <p className="text-[13px] leading-[1.55] text-ink-dim">
                    {it.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-7 text-center text-[13px] leading-[1.65] text-ink-3 max-w-[60ch] mx-auto">
            {c.filter.foot}
          </p>
        </div>
      </section>

      {/* 10 — TCO comparison (two scenarios) */}
      <section className={hpSectionClass} id="pricing">
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.pricing.eyebrow}
            heading={c.pricing.heading}
            sub={c.pricing.sub}
          />

          {[
            {
              title: c.pricing.s1Title,
              rows: c.pricing.s1Rows,
              total: c.pricing.s1Total,
              verdict: c.pricing.s1Verdict,
            },
            {
              title: c.pricing.s2Title,
              rows: c.pricing.s2Rows,
              total: c.pricing.s2Total,
              verdict: c.pricing.s2Verdict,
            },
          ].map((scenario, idx) => (
            <div key={idx} className={idx === 0 ? "mb-12" : undefined}>
              <h3 className="font-display font-bold text-[clamp(18px,2.4vw,22px)] tracking-[-0.01em] text-ink mb-4">
                {scenario.title}
              </h3>
              <div className="border border-line rounded-[18px] overflow-hidden bg-[oklch(0.155_0.005_300)]">
                <CmpTable>
                  <CmpThead>
                    <tr>
                      <CmpTh>{c.pricing.headers.item}</CmpTh>
                      <CmpTh>{c.pricing.headers.freelancer}</CmpTh>
                      <CmpTh good>{c.pricing.headers.us}</CmpTh>
                    </tr>
                  </CmpThead>
                  <tbody>
                    {scenario.rows.map((row, i) => (
                      <tr key={i}>
                        <CmpTd kind="param" data-label={c.pricing.headers.item}>
                          {row.item}
                        </CmpTd>
                        <CmpTd kind="bad" data-label={c.pricing.headers.freelancer}>
                          {row.freelancer}
                        </CmpTd>
                        <CmpTd kind="good" data-label={c.pricing.headers.us}>
                          {row.us}
                        </CmpTd>
                      </tr>
                    ))}
                    <tr>
                      <CmpTd
                        kind="param"
                        className="font-semibold text-ink"
                        data-label={c.pricing.headers.item}
                      >
                        <strong>{c.pricing.totalLabel}</strong>
                      </CmpTd>
                      <CmpTd kind="bad" className="font-semibold" data-label={c.pricing.headers.freelancer}>
                        <strong>{scenario.total.freelancer}</strong>
                      </CmpTd>
                      <CmpTd kind="good" className="font-bold" data-label={c.pricing.headers.us}>
                        <strong>{scenario.total.us}</strong>
                      </CmpTd>
                    </tr>
                  </tbody>
                </CmpTable>
              </div>
              <p className="mt-4 text-[13px] leading-[1.65] text-ink-dim max-w-[68ch] [&_strong]:text-accent-soft [&_strong]:font-semibold">
                {scenario.verdict}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 11 — FAQ (schema.org FAQPage emitted at the route level) */}
      <FAQ
        heading={
          locale === "en" ? "What people ask most" : "Що питають найчастіше"
        }
        items={c.faq.items.map<FAQItem>((it) => ({
          q: it.q,
          a: [it.a],
        }))}
      />

      {/* 12 — Final CTA */}
      <LaunchCta locale={locale} />
      </main>
      <HpFooter />
    </>
  );
}
