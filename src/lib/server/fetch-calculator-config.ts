import "server-only";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import { CALCULATOR_CONFIG_QUERY } from "@/lib/server/sanity-queries";
import { loc } from "@/lib/shared/sanity-locale";
import { buildConfigFromConstants } from "@/lib/shared/build-config-from-constants";
import type {
  CalculatorConfig,
  ConfigCheckboxOption,
  ConfigDesign,
  ConfigFeatureOption,
  ConfigMaintenance,
  ConfigPercentOption,
  ConfigPreset,
  ConfigPriceOption,
  ConfigProductComplexity,
  ConfigProjectType,
  ConfigSeoGrowth,
  FeatureGroup,
} from "@/types/calculator-config";
import type {
  CalculatorCheckboxOptionItem,
  CalculatorConfigQueryResult,
  CalculatorDesignOptionItem,
  CalculatorFeatureOptionItem,
  CalculatorMaintenanceOptionItem,
  CalculatorPercentOptionItem,
  CalculatorPresetItem,
  CalculatorPriceOptionItem,
  CalculatorProjectTypeItem,
  CalculatorSeoGrowthOptionItem,
  Locale,
} from "@/types/sanity";
import type {
  ContentOption,
  DesignComplexity,
  LanguageOption,
  MaintenancePlan,
  ProductComplexity,
  ProjectType,
  SeoGrowthPlan,
  TimelineOption,
} from "@/types/pricing";

/**
 * Fetches the calculator configuration for the active locale via the
 * consolidated CALCULATOR_CONFIG_QUERY (1 round trip). Soft-falls to
 * the constants-derived config when Sanity is unconfigured or returns
 * a partial result.
 */
export async function fetchCalculatorConfig(locale: Locale): Promise<CalculatorConfig> {
  const fallback = buildConfigFromConstants();
  try {
    const result = await sanityFetch<CalculatorConfigQueryResult | null>({
      query: CALCULATOR_CONFIG_QUERY,
      revalidate: 300,
      tags: ["calculator-config"],
    });

    if (
      !result ||
      !result.projectTypes?.length ||
      !result.presets?.length ||
      !result.featureOptions?.length
    ) {
      return fallback;
    }

    return shapeConfig(locale, result, fallback);
  } catch {
    return fallback;
  }
}

function shapeConfig(
  locale: Locale,
  result: CalculatorConfigQueryResult,
  fallback: CalculatorConfig,
): CalculatorConfig {
  const projectTypes: ConfigProjectType[] = (result.projectTypes ?? []).map(
    (p: CalculatorProjectTypeItem) => ({
      key: p.projectKey,
      label: loc(p.label, locale),
      hint: loc(p.hint, locale),
      basePrice: p.basePrice,
      // Default unknown → legacy ecommerce rule, so a missing flag from
      // Sanity drafts doesn't quietly disable the product-complexity tier.
      hasProductComplexity: p.hasProductComplexity ?? p.projectKey === "ecommerce",
      pages: p.pages,
    }),
  );

  const productComplexity: ConfigProductComplexity[] = (
    result.productComplexityOptions ?? []
  ).map((o: CalculatorPriceOptionItem) => ({
    key: o.optionKey as ProductComplexity,
    label: loc(o.label, locale),
    hint: loc(o.hint, locale),
    price: o.price ?? 0,
  }));

  const design: ConfigDesign[] = (result.designOptions ?? []).map(
    (o: CalculatorDesignOptionItem) => ({
      key: o.optionKey as DesignComplexity,
      label: loc(o.label, locale),
      hint: loc(o.hint, locale),
      percent: o.percent ?? 0,
      previews: (o.previews ?? []).map((p) => ({
        src: p.src,
        caption: loc(p.caption, locale),
      })),
    }),
  );

  const languages: ConfigPercentOption<LanguageOption>[] = (
    result.languageOptions ?? []
  ).map((o: CalculatorPercentOptionItem) => ({
    key: o.optionKey as LanguageOption,
    label: loc(o.label, locale),
    percent: o.percent ?? 0,
  }));

  const cmsUpgrades: ConfigCheckboxOption[] = (result.cmsOptions ?? []).map(
    (o: CalculatorCheckboxOptionItem) => ({
      key: o.optionKey,
      label: loc(o.label, locale),
      hint: o.hint ? loc(o.hint, locale) : undefined,
      price: o.price ?? 0,
      included: o.included,
    }),
  );

  const seoOptions: ConfigCheckboxOption[] = (result.seoOptions ?? []).map(
    (o: CalculatorCheckboxOptionItem) => ({
      key: o.optionKey,
      label: loc(o.label, locale),
      hint: o.hint ? loc(o.hint, locale) : undefined,
      price: o.price ?? 0,
      included: o.included,
    }),
  );

  const features: ConfigFeatureOption[] = (result.featureOptions ?? []).map(
    (o: CalculatorFeatureOptionItem) => ({
      key: o.optionKey,
      label: loc(o.label, locale),
      hint: o.hint ? loc(o.hint, locale) : undefined,
      price: o.price ?? 0,
      included: o.included,
      group: (o.featureGroup as FeatureGroup) ?? "advancedUx",
    }),
  );

  const contentOptions: ConfigPriceOption<ContentOption>[] = (
    result.contentOptions ?? []
  ).map((o: CalculatorPriceOptionItem) => ({
    key: o.optionKey as ContentOption,
    label: loc(o.label, locale),
    price: o.price ?? 0,
  }));

  const timeline: ConfigPercentOption<TimelineOption>[] = (
    result.timelineOptions ?? []
  ).map((o: CalculatorPercentOptionItem) => ({
    key: o.optionKey as TimelineOption,
    label: loc(o.label, locale),
    hint: o.hint ? loc(o.hint, locale) : undefined,
    percent: o.percent ?? 0,
  }));

  const maintenance: ConfigMaintenance[] = (result.maintenanceOptions ?? []).map(
    (o: CalculatorMaintenanceOptionItem) => ({
      key: o.optionKey as MaintenancePlan,
      label: loc(o.label, locale),
      monthlyPrice: o.monthlyPrice ?? 0,
    }),
  );

  const seoGrowth: ConfigSeoGrowth[] = (result.seoGrowthOptions ?? []).map(
    (o: CalculatorSeoGrowthOptionItem) => ({
      key: o.optionKey as SeoGrowthPlan,
      label: loc(o.label, locale),
      bestFor: loc(o.bestFor, locale),
      includes: (o.includes ?? []).map((s) => loc(s, locale)).filter(Boolean),
      badge: loc(o.badge, locale) || undefined,
      monthlyPrice: o.monthlyPrice ?? 0,
      priceLabel: o.priceLabel,
    }),
  );

  const presets: ConfigPreset[] = (result.presets ?? []).map(
    (p: CalculatorPresetItem) => ({
      key: p.presetKey,
      title: loc(p.title, locale),
      badge: loc(p.badge, locale),
      bestFor: loc(p.bestFor, locale),
      includes: (p.includes ?? []).map((s) => loc(s, locale)).filter(Boolean),
      estimatedRange: loc(p.estimatedRange, locale),
      compareAnchor: loc(p.compareAnchor, locale),
      appliedInput: p.appliedInput
        ? {
            ...p.appliedInput,
            cmsUpgradeIds: p.appliedInput.cmsUpgradeIds ?? [],
            seoOptionIds: p.appliedInput.seoOptionIds ?? [],
            featureIds: p.appliedInput.featureIds ?? [],
          }
        : fallback.presets.find((f) => f.key === p.presetKey)?.appliedInput ??
          fallback.presets[0].appliedInput,
    }),
  );

  return {
    projectTypes,
    productComplexity,
    design,
    languages,
    cmsUpgrades,
    seoOptions,
    features,
    contentOptions,
    timeline,
    maintenance,
    seoGrowth,
    presets,
    settings: {
      defaultProjectType: (result.settings?.defaultProjectType ?? "multiPage") as ProjectType,
      roundStep: result.settings?.roundStep ?? 50,
      highEstimateFactor: result.settings?.highEstimateFactor ?? 1.25,
      seoGrowthRecommendedBadge: seoGrowth.find((p) => p.badge)?.badge ?? "Recommended",
    },
  };
}
