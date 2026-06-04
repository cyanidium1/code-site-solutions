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
import { CalculatorControls } from "./CalculatorControls";
import { EstimateSummary } from "./EstimateSummary";
import { InfoSection } from "./InfoSection";
import { MaintenanceTiles } from "./MaintenanceTiles";
import { SeoGrowthTiles } from "./SeoGrowthTiles";
import { SocialProof } from "./SocialProof";
import { GetFinalCta } from "./GetFinalCta";
import { FAQ } from "@/components/blocks/final";
import type { FAQItem } from "@/types/faq";
import { H3 } from "@/components/ui";
import type { CalculatorConfig } from "@/types/calculator-config";
import type { CalculatorInput } from "@/types/pricing";

const emChunk = (chunks: React.ReactNode) => <em>{chunks}</em>;

type InfoCard = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  body: string;
};

function InfoCardGrid({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md-wide:grid-cols-2 xl:grid-cols-3">
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

function defaultInput(config: CalculatorConfig): CalculatorInput {
  const defaultProject = config.settings.defaultProjectType;
  const project =
    config.projectTypes.find((p) => p.key === defaultProject) ??
    config.projectTypes[0];
  return {
    projectType: project.key,
    pages: project.pages.defaultValue,
    productComplexity: "simple",
    designComplexity: "simple",
    languages: "one",
    cmsUpgradeIds: [],
    seoOptionIds: [],
    featureIds: [],
    contentOption: "clientProvided",
    timeline: "standard",
    maintenancePlan: "none",
    seoGrowthPlan: "none",
  };
}

type WebsiteCalculatorProps = {
  config: CalculatorConfig;
};

export function WebsiteCalculator({ config }: WebsiteCalculatorProps) {
  const [input, setInput] = useState<CalculatorInput>(() => defaultInput(config));
  const estimate = useMemo(
    () => calculateWebsiteEstimate(input, config),
    [input, config],
  );
  const t = useTranslations("Calculator");

  const seoGrowthMonthly =
    config.seoGrowth.find((p) => p.key === input.seoGrowthPlan)?.monthlyPrice ?? 0;

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
        padding="pt-16 pb-20 md-wide:pt-20 md-wide:pb-24"
      >
        <div className="grid grid-cols-[1fr] gap-6 items-start xl:grid-cols-[minmax(0,1fr)_360px]">
          <CalculatorControls config={config} value={input} onChange={setInput} />
          <EstimateSummary
            config={config}
            input={input}
            estimate={estimate}
            seoGrowthMonthly={seoGrowthMonthly}
          />
        </div>
      </InfoSection>

      <InfoSection
        eyebrow={t("afterLaunch.eyebrow")}
        title={t.rich("afterLaunch.title", { em: emChunk })}
        sub={t("afterLaunch.sub")}
      >
        <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <MaintenanceTiles config={config} input={input} onChange={setInput} />
          <SeoGrowthTiles config={config} input={input} onChange={setInput} />
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

      <GetFinalCta config={config} input={input} estimate={estimate} />
    </>
  );
}
