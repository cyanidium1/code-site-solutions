"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  calculateWebsiteEstimate,
  normalizeCalculatorInput,
} from "@/lib/shared/calculate-website-estimate";
import {
  clearStoredInput,
  loadStoredInput,
  saveStoredInput,
} from "@/lib/shared/calculator-storage";
import { CalculatorControls } from "./CalculatorControls";
import { EstimateSummary } from "./EstimateSummary";
import { InfoSection } from "./InfoSection";
import { MobileEstimateBar } from "./MobileEstimateBar";
import { SocialProof } from "./SocialProof";
import { GetFinalCta } from "./GetFinalCta";
import { FAQ } from "@/components/blocks/final";
import type { FAQItem } from "@/types/faq";
import type { CalculatorConfig } from "@/types/calculator-config";
import type { CalculatorInput } from "@/types/pricing";

const emChunk = (chunks: React.ReactNode) => <em>{chunks}</em>;

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

  // Rehydrate persisted selections after mount (keeps SSR/first paint stable,
  // avoiding a hydration mismatch). Ignores stored data for a project type the
  // current config no longer has.
  useEffect(() => {
    const stored = loadStoredInput();
    if (stored && config.projectTypes.some((p) => p.key === stored.projectType)) {
      setInput(normalizeCalculatorInput(stored, config));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change.
  const handleChange = useCallback((next: CalculatorInput) => {
    setInput(next);
    saveStoredInput(next);
  }, []);

  // Manual reset: restore the basic setup AND drop the persisted state.
  const handleReset = useCallback(() => {
    setInput((prev) => {
      const project = config.projectTypes.find((p) => p.key === prev.projectType);
      return {
        ...prev,
        pages: project?.pages.defaultValue ?? prev.pages,
        productComplexity: "simple",
        designComplexity: "simple",
        languages: "one",
        cmsUpgradeIds: [],
        seoOptionIds: [],
        featureIds: [],
        contentOption: "clientProvided",
        timeline: "standard",
      };
    });
    clearStoredInput();
  }, [config.projectTypes]);

  // After a successful lead submit: drop the persisted state only — leave the
  // on-screen selections intact.
  const handleSubmitted = useCallback(() => clearStoredInput(), []);

  const faqItems: FAQItem[] = (
    t.raw("faq.items") as {
      q: string;
      a: string;
      link?: { href: string; text: string };
    }[]
  ).map((it) => ({ q: it.q, a: it.link ? [it.a + " ", { link: it.link }] : [it.a] }));

  return (
    <>
      <InfoSection
        eyebrow={t("customizer.eyebrow")}
        title={t.rich("customizer.title", { em: emChunk })}
        sub={t("customizer.sub")}
        padding="pt-16 pb-20 md-wide:pt-20 md-wide:pb-24"
      >
        <div className="grid grid-cols-[1fr] gap-6 items-start xl:grid-cols-[minmax(0,1fr)_360px]">
          <CalculatorControls
            config={config}
            value={input}
            onChange={handleChange}
            onReset={handleReset}
          />
          <EstimateSummary config={config} input={input} estimate={estimate} />
        </div>
      </InfoSection>

      <SocialProof />

      <section className="bg-bg">
        <FAQ heading={t("faq.heading")} items={faqItems} />
      </section>

      <GetFinalCta
        config={config}
        input={input}
        estimate={estimate}
        onSubmitted={handleSubmitted}
      />

      <MobileEstimateBar estimate={estimate} />
    </>
  );
}
