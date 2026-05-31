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
import { InfoSection } from "./InfoSection";
import { SocialProof } from "./SocialProof";
import { GetFinalCta } from "./GetFinalCta";
import { formatEur } from "@/lib/shared/format-eur";
import { H3 } from "@/components/ui";

const SEG_BTN =
  "border border-line rounded-[12px] bg-transparent text-ink-dim text-left " +
  "px-[14px] py-[11px] text-[13px] cursor-pointer min-h-[50px] " +
  "transition-[border-color,color,background] duration-200 " +
  "hover:border-line-strong hover:text-ink " +
  "[&_small]:block [&_small]:text-ink-3 [&_small]:mt-1 [&_small]:text-[11px]";
const SEG_BTN_ACTIVE = "border-accent-55 bg-accent-12 !text-ink";
const NOTE = "text-ink-3 text-[12px] leading-[1.5]";

const emChunk = (chunks: React.ReactNode) => <em>{chunks}</em>;

type InfoCard = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  body: string;
};

function InfoCardGrid({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-md-wide:grid-cols-1 xl:grid-cols-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <article
            key={c.title}
            className="border border-line rounded-[22px] bg-[radial-gradient(220px_140px_at_0%_0%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%),oklch(0.16_0.005_300)] px-[22px] py-6 flex flex-col gap-3 transition-[border-color,transform] duration-200"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-[12px] bg-accent-12 text-accent-soft">
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

export function WebsiteCalculator() {
  const [input, setInput] = useState(DEFAULT_CALCULATOR_INPUT);
  const estimate = useMemo(() => calculateWebsiteEstimate(input), [input]);
  const t = useTranslations("Calculator");

  const howItWorks: InfoCard[] = [
    { icon: Layers3, title: t("howItWorks.cards.base.title"), body: t("howItWorks.cards.base.body") },
    { icon: SlidersHorizontal, title: t("howItWorks.cards.scope.title"), body: t("howItWorks.cards.scope.body") },
    { icon: ClipboardCheck, title: t("howItWorks.cards.final.title"), body: t("howItWorks.cards.final.body") },
  ];
  const whyPackages: InfoCard[] = [
    { icon: Rocket, title: t("whyPackages.cards.starter.title"), body: t("whyPackages.cards.starter.body") },
    { icon: SearchCheck, title: t("whyPackages.cards.growth.title"), body: t("whyPackages.cards.growth.body") },
    { icon: Database, title: t("whyPackages.cards.ecommerce.title"), body: t("whyPackages.cards.ecommerce.body") },
  ];
  const whyEstimate: InfoCard[] = [
    { icon: SearchCheck, title: t("underHood.cards.seo.title"), body: t("underHood.cards.seo.body") },
    { icon: Database, title: t("underHood.cards.cms.title"), body: t("underHood.cards.cms.body") },
    { icon: Rocket, title: t("underHood.cards.conversion.title"), body: t("underHood.cards.conversion.body") },
  ];
  const faqItems: FAQItem[] = (t.raw("faq.items") as { q: string; a: string }[])
    .map((it) => ({ q: it.q, a: [it.a] }));
  const monthSuffixMaintenance = t("afterLaunch.maintenance.monthSuffix");
  const monthSuffixGrowth = t("afterLaunch.growth.monthSuffix");

  return (
    <>
      <InfoSection
        eyebrow={t("howItWorks.eyebrow")}
        title={t.rich("howItWorks.title", { em: emChunk })}
        sub={t("howItWorks.sub")}
      >
        <InfoCardGrid cards={howItWorks} />
      </InfoSection>

      <InfoSection
        eyebrow={t("whyPackages.eyebrow")}
        title={t.rich("whyPackages.title", { em: emChunk })}
        sub={t("whyPackages.sub")}
      >
        <InfoCardGrid cards={whyPackages} />
      </InfoSection>

      <InfoSection
        eyebrow={t("customizer.eyebrow")}
        title={t.rich("customizer.title", { em: emChunk })}
        sub={t("customizer.sub")}
        padding="pt-20 pb-24 max-md-wide:pt-16 max-md-wide:pb-20"
      >
        <div className="grid grid-cols-[1fr] gap-6 items-start xl:grid-cols-[minmax(0,1fr)_360px]">
          <CalculatorControls value={input} onChange={setInput} />
          <EstimateSummary
            input={input}
            estimate={estimate}
            seoGrowthMonthly={SEO_GROWTH_OPTIONS[input.seoGrowthPlan].monthlyPrice}
          />
        </div>
      </InfoSection>

      <InfoSection
        eyebrow={t("afterLaunch.eyebrow")}
        title={t.rich("afterLaunch.title", { em: emChunk })}
        sub={t("afterLaunch.sub")}
      >
        <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* Maintenance tiles — inlined for this task; replaced by <MaintenanceTiles/> in Task G3. */}
          <div className="border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] px-5 pt-5 pb-[22px] flex flex-col gap-3">
            <H3 variant="calc-after">{t("afterLaunch.maintenance.title")}</H3>
            <p className={NOTE}>{t("afterLaunch.maintenance.note")}</p>
            <div className="grid grid-cols-2 gap-2 max-md-wide:grid-cols-1">
              {Object.entries(MAINTENANCE_OPTIONS).map(([id, option]) => (
                <button
                  key={id}
                  type="button"
                  className={`${SEG_BTN} ${input.maintenancePlan === id ? SEG_BTN_ACTIVE : ""}`}
                  onClick={() =>
                    setInput((prev) => ({ ...prev, maintenancePlan: id as MaintenancePlan }))
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

          {/* SEO/Growth tiles — inlined for this task; replaced by <SeoGrowthTiles/> in Task G3. */}
          <div className="border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] px-5 pt-5 pb-[22px] flex flex-col gap-3">
            <H3 variant="calc-after">{t("afterLaunch.growth.title")}</H3>
            <p className={NOTE}>{t("afterLaunch.growth.note")}</p>
            <div className="grid grid-cols-2 gap-[10px] max-md-wide:grid-cols-1">
              {Object.entries(SEO_GROWTH_OPTIONS).map(([id, plan]) => {
                const includes = t.raw(`options.seoGrowth.${id}.includes`) as string[];
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
                        ? "border-accent-55 shadow-[inset_0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.28)]"
                        : "border-line")
                    }
                    onClick={() =>
                      setInput((prev) => ({ ...prev, seoGrowthPlan: id as SeoGrowthPlan }))
                    }
                  >
                    <div className="flex justify-between gap-2">
                      <strong>
                        {t(`options.seoGrowth.${id}.label` as `options.seoGrowth.${SeoGrowthPlan}.label`)}
                      </strong>
                      {plan.badge ? (
                        <span className="text-[10px] border border-accent-35 text-accent-soft rounded-full px-[7px] py-[3px] uppercase tracking-[0.1em]">
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
      </InfoSection>

      <InfoSection
        eyebrow={t("underHood.eyebrow")}
        title={t.rich("underHood.title", { em: emChunk })}
        sub={t("underHood.sub")}
      >
        <InfoCardGrid cards={whyEstimate} />
      </InfoSection>

      <SocialProof />

      <section className="bg-bg">
        <FAQ heading={t("faq.heading")} items={faqItems} />
      </section>

      <GetFinalCta input={input} estimate={estimate} />
    </>
  );
}
