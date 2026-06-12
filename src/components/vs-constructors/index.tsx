import { AlertTriangle, CheckCircle2, Target, XCircle } from "lucide-react";
import { HpHeader, HpFooter } from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { HeroEditorial } from "@/components/blocks/hero";
import { Tier, CmpTable, CmpThead, CmpTh, CmpTd, CmpPricingGrid } from "@/components/blocks/comparison";
import { FAQ } from "@/components/blocks/final";
import type { FAQItem } from "@/types/faq";

import { SectionHead } from "@/components/shared/section-head";
import { AppImage } from "@/lib/shared/app-image";
import {
  type Content,
  VS_CONSTRUCTORS_UK,
  VS_CONSTRUCTORS_EN,
} from "@/content/comparisons/vs-constructors";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { localizePath } from "@/constants/i18n-routes";

export type VcLocale = "uk" | "en";

const CONTENT: Record<VcLocale, Content> = {
  uk: VS_CONSTRUCTORS_UK,
  en: VS_CONSTRUCTORS_EN,
};

export function getVsConstructorsContent(locale: VcLocale): Content {
  return CONTENT[locale];
}

/* ─── View ──────────────────────────────────────────────────────────────── */

export function VsConstructorsView({ locale }: { locale: VcLocale }) {
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
        ctaSecondaryHref={localizePath("/contacts", isEn)}
        ctaSecondaryShowPlay={false}
        showStats={false}
        showTicker={false}
        deviceTags={[
          { kind: "default", primary: "Tilda · Webflow · Wix" },
          { kind: "default", primary: "→" },
          { kind: "good", primary: "Next.js", mini: "LCP 0.8s" },
        ]}
        variant="compare"
        deviceMockupSrc="/raw-design/assets/hero-devices.webp"
      />

      {/* 02 — 5 outgrew signs */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.outgrew.eyebrow}
            heading={c.outgrew.heading}
            sub={c.outgrew.sub}
          />
          {/* Top 3 outgrew-reasons as full cards, rest compact. */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {c.outgrew.items.slice(0, 3).map((it) => {
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
          {c.outgrew.items.length > 3 ? (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {c.outgrew.items.slice(3).map((it) => {
                const Icon = it.icon;
                return (
                  <div
                    key={it.num}
                    className="border border-line rounded-[14px] px-4 py-3.5 bg-[oklch(0.155_0.005_300)] flex items-center gap-3.5"
                  >
                    <span className="w-9 h-9 shrink-0 rounded-lg inline-flex items-center justify-center bg-accent-12 text-accent-soft border border-accent-22">
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
          <p className="mt-8 text-center text-[14px] leading-[1.65] text-ink-dim max-w-[60ch] mx-auto">
            {c.outgrew.foot}
          </p>
        </div>
      </section>

      {/* 03 — Hidden costs */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.costs.eyebrow}
            heading={c.costs.heading}
            sub={c.costs.sub}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {c.costs.items.map((it) => {
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
                  <h3 className="font-display font-bold text-[18px] tracking-[-0.01em] text-ink">
                    {it.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-ink-dim">
                    {it.body}
                  </p>
                  <div className="mt-auto pt-2 border-t border-line text-[12px] font-mono tracking-[0.04em] text-accent-soft">
                    {it.metric}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-center text-[14px] leading-[1.65] text-ink-dim max-w-[60ch] mx-auto [&_em]:not-italic [&_em]:font-bold [&_em]:text-ink [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.costs.foot}
          </p>
        </div>
      </section>

      {/* 04 — Wide side-by-side comparison (7 cols, horizontal scroll on mobile) */}
      <section className={hpSectionClass} id="compare-table">
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.compare.eyebrow}
            heading={c.compare.heading}
            sub={c.compare.sub}
          />
          <div
            className="border border-line rounded-[18px] bg-[oklch(0.155_0.005_300)] overflow-x-auto"
            role="region"
            aria-label={c.compare.criterionHeader}
          >
            <table className="w-full min-w-[720px] text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-ink-3 px-4 py-4 sticky left-0 bg-[oklch(0.155_0.005_300)] z-[1]">
                    {c.compare.criterionHeader}
                  </th>
                  {c.compare.builderHeaders.map((b) => (
                    <th
                      key={b}
                      className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-ink-3 px-4 py-4 whitespace-nowrap"
                    >
                      {b}
                    </th>
                  ))}
                  <th className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-accent-soft px-4 py-4 whitespace-nowrap bg-accent-6">
                    {c.compare.usHeader}
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.compare.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-line last:border-b-0"
                  >
                    <td className="text-[12px] text-ink-3 tracking-[0.02em] uppercase font-medium px-4 py-3.5 sticky left-0 bg-[oklch(0.155_0.005_300)] z-[1]">
                      {row.criterion}
                    </td>
                    {row.values.map((v, j) => (
                      <td
                        key={j}
                        className="text-[13px] text-ink-3 px-4 py-3.5"
                      >
                        {v}
                      </td>
                    ))}
                    <td className="text-[13px] text-accent-soft font-semibold px-4 py-3.5 bg-accent-6">
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 05 — Each builder honest */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.builders.eyebrow}
            heading={c.builders.heading}
            sub={c.builders.sub}
          />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {c.builders.items.map((b) => (
              <div
                key={b.name}
                className="border border-line rounded-[18px] p-7 bg-[oklch(0.155_0.005_300)] flex flex-col gap-4"
              >
                <h3 className="font-display font-bold text-[24px] tracking-[-0.02em] text-ink">
                  {b.name}
                </h3>
                <ul className="list-none flex flex-col gap-3">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 shrink-0 rounded-full inline-flex items-center justify-center text-accent-soft bg-accent-15 border border-accent-30">
                      <CheckCircle2 size={13} strokeWidth={1.8} />
                    </span>
                    <span className="text-[13px] leading-[1.55] text-ink-dim">
                      <strong className="text-ink font-semibold">
                        {c.builders.goodLabel}.
                      </strong>{" "}
                      {b.good}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 shrink-0 rounded-full inline-flex items-center justify-center text-[oklch(0.7_0.15_25)] bg-[oklch(0.55_0.18_25_/_0.12)] border border-[oklch(0.55_0.18_25_/_0.3)]">
                      <XCircle size={13} strokeWidth={1.8} />
                    </span>
                    <span className="text-[13px] leading-[1.55] text-ink-dim">
                      <strong className="text-ink font-semibold">
                        {c.builders.capLabel}.
                      </strong>{" "}
                      {b.cap}
                    </span>
                  </li>
                  {b.note ? (
                    <li className="flex gap-3">
                      <span className="w-6 h-6 shrink-0 rounded-full inline-flex items-center justify-center text-[oklch(0.78_0.15_75)] bg-[oklch(0.55_0.18_75_/_0.12)] border border-[oklch(0.55_0.18_75_/_0.3)]">
                        <AlertTriangle size={13} strokeWidth={1.8} />
                      </span>
                      <span className="text-[13px] leading-[1.55] text-ink-dim">
                        <strong className="text-ink font-semibold">
                          {c.builders.noteLabel}.
                        </strong>{" "}
                        {b.note}
                      </span>
                    </li>
                  ) : null}
                  <li className="flex gap-3">
                    <span className="w-6 h-6 shrink-0 rounded-full inline-flex items-center justify-center text-accent-soft bg-accent-15 border border-accent-30">
                      <Target size={13} strokeWidth={1.8} />
                    </span>
                    <span className="text-[13px] leading-[1.55] text-ink-dim">
                      <strong className="text-ink font-semibold">
                        {c.builders.whenLabel}.
                      </strong>{" "}
                      {b.when}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Admin after migration (Sanity Studio reassurance) */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.admin.eyebrow}
            heading={c.admin.heading}
            sub={c.admin.sub}
          />

          <div className="grid grid-cols-1 gap-6 mb-12 min-[901px]:grid-cols-[1.5fr_1fr]">
            <figure className="m-0 flex flex-col">
              <div className="relative border border-line rounded-[14px] overflow-hidden bg-[oklch(0.13_0.005_300)] aspect-[16/9]">
                <AppImage
                  src="/sanity-studio/admin-desktop.png"
                  alt={c.admin.desktopAlt}
                  fill
                  sizes="(min-width: 901px) 55vw, 92vw"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 text-[12px] leading-[1.5] text-ink-3 text-center">
                {c.admin.desktopCaption}
              </figcaption>
            </figure>
            <figure className="m-0 flex flex-col">
              <div className="relative border border-line rounded-[14px] overflow-hidden bg-[oklch(0.13_0.005_300)] aspect-[9/16] max-w-[280px] mx-auto w-full">
                <AppImage
                  src="/sanity-studio/admin-mobile.png"
                  alt={c.admin.mobileAlt}
                  fill
                  sizes="280px"
                  className="object-cover object-top"
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

          <p className="mt-8 max-w-[64ch] mx-auto text-center text-[13px] leading-[1.65] text-ink-dim [&_em]:not-italic [&_em]:font-bold [&_em]:text-ink [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.admin.foot}
          </p>
        </div>
      </section>

      {/* 07 — Migration patterns */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.patterns.eyebrow}
            heading={c.patterns.heading}
            sub={c.patterns.sub}
          />
          <div className="border border-line rounded-[18px] overflow-hidden bg-[oklch(0.155_0.005_300)]">
            <CmpTable>
              <CmpThead>
                <tr>
                  <CmpTh>{c.patterns.headers.metric}</CmpTh>
                  <CmpTh>{c.patterns.headers.before}</CmpTh>
                  <CmpTh good>{c.patterns.headers.after}</CmpTh>
                </tr>
              </CmpThead>
              <tbody>
                {c.patterns.rows.map((row, i) => (
                  <tr key={i}>
                    <CmpTd kind="param" data-label={c.patterns.headers.metric}>
                      {row.metric}
                    </CmpTd>
                    <CmpTd kind="bad" data-label={c.patterns.headers.before}>
                      {row.before}
                    </CmpTd>
                    <CmpTd kind="good" data-label={c.patterns.headers.after}>
                      {row.after}
                    </CmpTd>
                  </tr>
                ))}
              </tbody>
            </CmpTable>
          </div>
          <p className="mt-8 max-w-[60ch] mx-auto text-center text-[13px] leading-[1.65] text-ink-3">
            {c.patterns.foot}
          </p>
        </div>
      </section>

      {/* 08 — What we don't do */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow={c.filter.eyebrow}
            heading={c.filter.heading}
            sub={c.filter.sub}
          />
          <ul className="list-none flex flex-col gap-3 max-w-[840px] mx-auto">
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

      {/* 09 — Pricing */}
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
          <p className="mt-7 text-center text-[13px] leading-[1.65] text-ink-dim max-w-[68ch] mx-auto [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.pricing.foot}
          </p>
        </div>
      </section>

      {/* 10 — FAQ */}
      <FAQ
        locale={locale}
        heading={
          locale === "en" ? "What people ask most" : "Що питають найчастіше"
        }
        items={c.faq.items.map<FAQItem>((it) => ({
          q: it.q,
          a: [it.a],
        }))}
      />

      {/* 11 — Final CTA */}
      <LaunchCta locale={locale} />
      </main>
      <HpFooter />
    </>
  );
}
