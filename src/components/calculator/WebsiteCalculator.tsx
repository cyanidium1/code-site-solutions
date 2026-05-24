"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Database,
  SearchCheck,
  Layers3,
  SlidersHorizontal,
  ClipboardCheck,
  Rocket,
  Mail,
  PhoneCall,
  CalendarCheck,
  Quote,
} from "lucide-react";
import { calculateWebsiteEstimate } from "@/lib/shared/calculate-website-estimate";
import {
  DEFAULT_CALCULATOR_INPUT,
  MAINTENANCE_OPTIONS,
  SEO_GROWTH_OPTIONS,
} from "@/constants/calculator-config";
import type { MaintenancePlan, SeoGrowthPlan } from "@/types/pricing";
import { FAQ } from "@/components/blocks/final";
import type { FAQItem } from "@/types/faq";
import { CalculatorControls } from "./CalculatorControls";
import { EstimateSummary } from "./EstimateSummary";
import { LeadForm } from "./LeadForm";
import { formatEur } from "@/lib/shared/format-eur";
import { H3 } from "@/components/ui";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpSectionClass, hpSubClass } from "@/components/homepage/shared";

// Reused segment button (same pattern as CalculatorControls.tsx). Kept
// local here so this file does not couple to a sibling component file.
const SEG_BTN =
  "border border-line rounded-[12px] bg-transparent text-ink-dim text-left " +
  "px-[14px] py-[11px] text-[13px] cursor-pointer min-h-[50px] " +
  "transition-[border-color,color,background] duration-200 " +
  "hover:border-line-strong hover:text-ink " +
  "[&_small]:block [&_small]:text-ink-3 [&_small]:mt-1 [&_small]:text-[11px]";
const SEG_BTN_ACTIVE =
  "border-[oklch(from_var(--accent)_l_c_h_/_0.55)] bg-[oklch(from_var(--accent)_l_c_h_/_0.12)] !text-ink";
const NOTE = "text-ink-3 text-[12px] leading-[1.5]";

// Renders <em>…</em> chunks inside next-intl rich messages. Reused for every
// section heading on the calculator that uses italic emphasis on one phrase.
const emChunk = (chunks: React.ReactNode) => <em>{chunks}</em>;

/* ─── Reusable info-card grid (no outer border, matches /about VALUES) ──── */

type InfoCard = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  body: string;
};

function InfoCardGrid({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <article
            key={c.title}
            className="border border-line rounded-[22px] bg-[radial-gradient(220px_140px_at_0%_0%,oklch(from_var(--accent)_l_c_h_/_0.06),transparent_70%),oklch(0.16_0.005_300)] px-[22px] py-6 flex flex-col gap-3 transition-[border-color,transform] duration-200"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-[12px] bg-[oklch(from_var(--accent)_l_c_h_/_0.12)] text-accent-soft">
              <Icon size={18} strokeWidth={1.6} />
            </span>
            <H3 variant="calc-card">{c.title}</H3>
            <p className="m-0 text-ink-dim text-[14px] leading-[1.55]">{c.body}</p>
          </article>
        );
      })}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export function WebsiteCalculator() {
  const [input, setInput] = useState(DEFAULT_CALCULATOR_INPUT);
  const estimate = useMemo(() => calculateWebsiteEstimate(input), [input]);
  const t = useTranslations("Calculator");

  const howItWorks: InfoCard[] = [
    {
      icon: Layers3,
      title: t("howItWorks.cards.base.title"),
      body: t("howItWorks.cards.base.body"),
    },
    {
      icon: SlidersHorizontal,
      title: t("howItWorks.cards.scope.title"),
      body: t("howItWorks.cards.scope.body"),
    },
    {
      icon: ClipboardCheck,
      title: t("howItWorks.cards.final.title"),
      body: t("howItWorks.cards.final.body"),
    },
  ];

  const whyPackages: InfoCard[] = [
    {
      icon: Rocket,
      title: t("whyPackages.cards.starter.title"),
      body: t("whyPackages.cards.starter.body"),
    },
    {
      icon: SearchCheck,
      title: t("whyPackages.cards.growth.title"),
      body: t("whyPackages.cards.growth.body"),
    },
    {
      icon: Database,
      title: t("whyPackages.cards.ecommerce.title"),
      body: t("whyPackages.cards.ecommerce.body"),
    },
  ];

  const whyEstimate: InfoCard[] = [
    {
      icon: SearchCheck,
      title: t("underHood.cards.seo.title"),
      body: t("underHood.cards.seo.body"),
    },
    {
      icon: Database,
      title: t("underHood.cards.cms.title"),
      body: t("underHood.cards.cms.body"),
    },
    {
      icon: Rocket,
      title: t("underHood.cards.conversion.title"),
      body: t("underHood.cards.conversion.body"),
    },
  ];

  const faqItems: FAQItem[] = (t.raw("faq.items") as { q: string; a: string }[]).map(
    (it) => ({ q: it.q, a: [it.a] }),
  );

  const socialLogos = t.raw("social.logos") as string[];

  const monthSuffixMaintenance = t("afterLaunch.maintenance.monthSuffix");
  const monthSuffixGrowth = t("afterLaunch.growth.monthSuffix");

  return (
    <>
      {/* Section: How this estimate works */}
      <section className={`${hpSectionClass} py-24 max-[760px]:py-16`}>
        <div className={hpInnerClass}>
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8">
            <span className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>{t("howItWorks.eyebrow")}</span>
            </span>
            <h2 className={hpH2Class}>{t.rich("howItWorks.title", { em: emChunk })}</h2>
            <p className={hpSubClass}>{t("howItWorks.sub")}</p>
          </div>
          <InfoCardGrid cards={howItWorks} />
        </div>
      </section>

      {/* Section: Why these packages */}
      <section className={`${hpSectionClass} py-24 max-[760px]:py-16`}>
        <div className={hpInnerClass}>
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8">
            <span className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>{t("whyPackages.eyebrow")}</span>
            </span>
            <h2 className={hpH2Class}>{t.rich("whyPackages.title", { em: emChunk })}</h2>
            <p className={hpSubClass}>{t("whyPackages.sub")}</p>
          </div>
          <InfoCardGrid cards={whyPackages} />
        </div>
      </section>

      {/* Section: Calculator (controls + sticky summary) */}
      <section className={`${hpSectionClass} pt-20 pb-24 max-[760px]:pt-16 max-[760px]:pb-20`}>
        <div className={hpInnerClass}>
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8">
            <span className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>{t("customizer.eyebrow")}</span>
            </span>
            <h2 className={hpH2Class}>{t.rich("customizer.title", { em: emChunk })}</h2>
            <p className={hpSubClass}>{t("customizer.sub")}</p>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-6 items-start max-[1100px]:grid-cols-[1fr]">
            <CalculatorControls value={input} onChange={setInput} />
            <EstimateSummary
              input={input}
              estimate={estimate}
              seoGrowthMonthly={SEO_GROWTH_OPTIONS[input.seoGrowthPlan].monthlyPrice}
            />
          </div>
        </div>
      </section>

      {/* Section: After-launch (Maintenance + SEO/Growth) */}
      <section className={`${hpSectionClass} py-24 max-[760px]:py-16`}>
        <div className={hpInnerClass}>
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8">
            <span className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>{t("afterLaunch.eyebrow")}</span>
            </span>
            <h2 className={hpH2Class}>{t.rich("afterLaunch.title", { em: emChunk })}</h2>
            <p className={hpSubClass}>{t("afterLaunch.sub")}</p>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-[18px] max-[1100px]:grid-cols-1">
            <div className="border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] px-5 pt-5 pb-[22px] flex flex-col gap-3">
              <H3 variant="calc-after">{t("afterLaunch.maintenance.title")}</H3>
              <p className={NOTE}>{t("afterLaunch.maintenance.note")}</p>
              <div className="grid grid-cols-2 gap-2 max-[760px]:grid-cols-1">
                {Object.entries(MAINTENANCE_OPTIONS).map(([id, option]) => (
                  <button
                    key={id}
                    type="button"
                    className={`${SEG_BTN} ${input.maintenancePlan === id ? SEG_BTN_ACTIVE : ""}`}
                    onClick={() =>
                      setInput((prev) => ({
                        ...prev,
                        maintenancePlan: id as MaintenancePlan,
                      }))
                    }
                  >
                    {t(`options.maintenance.${id}` as `options.maintenance.${MaintenancePlan}`)}
                    <small>
                      {formatEur(option.monthlyPrice)}
                      {monthSuffixMaintenance}
                    </small>
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] px-5 pt-5 pb-[22px] flex flex-col gap-3">
              <H3 variant="calc-after">{t("afterLaunch.growth.title")}</H3>
              <p className={NOTE}>{t("afterLaunch.growth.note")}</p>
              <div className="grid grid-cols-2 gap-[10px] max-[760px]:grid-cols-1">
                {Object.entries(SEO_GROWTH_OPTIONS).map(([id, plan]) => {
                  const includes = t.raw(
                    `options.seoGrowth.${id}.includes`,
                  ) as string[];
                  const priceLabel =
                    id === "contentEngine"
                      ? t("options.seoGrowth.contentEngine.priceLabel")
                      : undefined;
                  const isActive = input.seoGrowthPlan === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={
                        "border rounded-[14px] p-[14px] text-left text-ink-dim grid gap-2 cursor-pointer " +
                        "transition-[border-color,transform] duration-200 hover:border-line-strong hover:-translate-y-[1px] " +
                        "[&_h4]:m-0 [&_h4]:font-sans [&_h4]:text-[22px] [&_h4]:tracking-[-0.01em] [&_h4]:text-ink " +
                        "[&_h4>small]:ml-1 [&_h4>small]:text-[12px] [&_h4>small]:text-ink-3 " +
                        "[&>p]:m-0 [&>p]:text-[12px] [&>p]:text-ink-3 " +
                        "[&>ul]:list-none [&>ul]:m-0 [&>ul]:p-0 [&>ul]:grid [&>ul]:gap-[6px] [&>ul]:text-[12.5px] " +
                        "[&>ul>li]:relative [&>ul>li]:pl-[14px] [&>ul>li]:text-ink-dim " +
                        "[&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[7px] " +
                        "[&>ul>li]:before:w-[5px] [&>ul>li]:before:h-[5px] [&>ul>li]:before:rounded-full [&>ul>li]:before:bg-accent-soft " +
                        (plan.badge
                          ? "bg-[linear-gradient(180deg,oklch(0.2_0.03_295),oklch(0.16_0.02_295))] "
                          : "bg-[oklch(0.18_0.008_300)] ") +
                        (isActive
                          ? "border-[oklch(from_var(--accent)_l_c_h_/_0.55)] shadow-[inset_0_0_0_1px_oklch(from_var(--accent)_l_c_h_/_0.28)]"
                          : "border-line")
                      }
                      onClick={() =>
                        setInput((prev) => ({
                          ...prev,
                          seoGrowthPlan: id as SeoGrowthPlan,
                        }))
                      }
                    >
                      <div className="flex justify-between gap-2">
                        <strong>
                          {t(`options.seoGrowth.${id}.label` as `options.seoGrowth.${SeoGrowthPlan}.label`)}
                        </strong>
                        {plan.badge ? (
                          <span className="text-[10px] border border-[oklch(from_var(--accent)_l_c_h_/_0.35)] text-accent-soft rounded-full px-[7px] py-[3px] uppercase tracking-[0.1em]">
                            {t("options.seoGrowth.badgeRecommended")}
                          </span>
                        ) : null}
                      </div>
                      <h4>
                        {priceLabel ? (
                          priceLabel
                        ) : (
                          <>
                            {formatEur(plan.monthlyPrice)}
                            <small>{monthSuffixGrowth}</small>
                          </>
                        )}
                      </h4>
                      <p>
                        {t(`options.seoGrowth.${id}.bestFor` as `options.seoGrowth.${SeoGrowthPlan}.bestFor`)}
                      </p>
                      <ul>
                        {includes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why we estimate this way */}
      <section className={`${hpSectionClass} py-24 max-[760px]:py-16`}>
        <div className={hpInnerClass}>
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8">
            <span className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>{t("underHood.eyebrow")}</span>
            </span>
            <h2 className={hpH2Class}>{t.rich("underHood.title", { em: emChunk })}</h2>
            <p className={hpSubClass}>{t("underHood.sub")}</p>
          </div>
          <InfoCardGrid cards={whyEstimate} />
        </div>
      </section>

      {/* Section: Social proof */}
      <section className={`${hpSectionClass} py-10`}>
        <div className={hpInnerClass}>
          <div
            className={
              "border border-line rounded-[22px] " +
              "bg-[radial-gradient(380px_220px_at_80%_20%,oklch(from_var(--accent)_l_c_h_/_0.07),transparent_70%),oklch(0.16_0.005_300)] " +
              "px-7 py-8 flex flex-col gap-[18px] items-center text-center"
            }
          >
            <p className="m-0 text-[14px] text-ink-dim [&>strong]:text-ink [&>strong]:font-bold">
              {t.rich("social.line", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <div className="inline-flex flex-wrap justify-center gap-3">
              {socialLogos.map((logo) => (
                <span
                  key={logo}
                  className="font-sans font-bold text-[13px] tracking-[0.04em] uppercase px-[14px] py-2 border border-line rounded-[10px] text-ink-dim bg-[oklch(1_0_0_/_0.02)]"
                >
                  {logo}
                </span>
              ))}
            </div>
            <figure className="mt-[6px] max-w-[720px] flex flex-col items-center gap-[14px] px-[22px] pt-[18px] pb-[22px] border border-line rounded-2xl bg-[oklch(0.18_0.008_300)]">
              <Quote size={18} strokeWidth={1.6} className="text-accent-soft" />
              <blockquote className="m-0 font-sans text-[18px] leading-[1.5] text-ink font-medium italic [&>strong]:text-accent-soft [&>strong]:font-bold [&>strong]:not-italic">
                {t.rich("social.testimonialQuote", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </blockquote>
              <figcaption className="flex flex-col gap-[2px]">
                <span className="text-[13px] text-ink font-semibold">{t("social.testimonialName")}</span>
                <span className="text-[11px] text-ink-3 tracking-[0.04em] uppercase">{t("social.testimonialRole")}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Section: FAQ — HeroUI accordion via shared component */}
      <section className="bg-bg">
        <FAQ heading={t("faq.heading")} items={faqItems} />
      </section>

      {/* Section: Lead form + after-submit + alt CTA */}
      <section className={`${hpSectionClass} pt-20 pb-30 max-[760px]:pt-16 max-[760px]:pb-20`} id="calc-lead-form">
        <div className={hpInnerClass}>
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8">
            <span className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>{t("getFinal.eyebrow")}</span>
            </span>
            <h2 className={hpH2Class}>{t.rich("getFinal.title", { em: emChunk })}</h2>
            <p className={hpSubClass}>{t("getFinal.sub")}</p>
          </div>
          <LeadForm input={input} estimate={estimate} />

          <div
            className={
              "mt-[22px] flex flex-wrap gap-y-[10px] gap-x-[14px] items-center justify-center " +
              "px-[18px] py-[14px] border border-dashed border-line-strong rounded-full max-[760px]:rounded-[18px] " +
              "text-[13px] text-ink-3"
            }
          >
            <span className="font-medium text-ink-dim">{t("getFinal.altReady")}</span>
            <a
              href="https://calendly.com/fedirdev"
              className="inline-flex items-center gap-[6px] text-ink no-underline font-medium border-b border-transparent transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-b-accent-soft [&_svg]:text-accent-soft"
              target="_blank"
              rel="noreferrer"
            >
              <CalendarCheck size={14} strokeWidth={1.7} />
              {t("getFinal.altCalendly")}
            </a>
            <span className="text-ink-3 opacity-60">{t("getFinal.altOr")}</span>
            <a
              href="https://t.me/fedirdev"
              className="inline-flex items-center gap-[6px] text-ink no-underline font-medium border-b border-transparent transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-b-accent-soft [&_svg]:text-accent-soft"
              target="_blank"
              rel="noreferrer"
            >
              <PhoneCall size={14} strokeWidth={1.7} />
              {t("getFinal.altTelegram")}
            </a>
            <span className="text-ink-3 opacity-60">{t("getFinal.altOrSep")}</span>
            <a
              href="mailto:hi@code-site.art"
              className="inline-flex items-center gap-[6px] text-ink no-underline font-medium border-b border-transparent transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-b-accent-soft [&_svg]:text-accent-soft"
            >
              <Mail size={14} strokeWidth={1.7} />
              {t("getFinal.altEmail")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
