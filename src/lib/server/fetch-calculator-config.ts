import "server-only";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import {
  CALCULATOR_OPTIONS_QUERY,
  CALCULATOR_PRESETS_QUERY,
  CALCULATOR_PROJECT_TYPES_QUERY,
  CALCULATOR_SETTINGS_QUERY,
} from "@/lib/server/sanity-queries";
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
  CalculatorOptionDoc,
  CalculatorPresetDoc,
  CalculatorProjectTypeDoc,
  CalculatorSettingsDoc,
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
 * Fetches the calculator configuration for the active locale. Soft-fails
 * to the constants-derived config when Sanity is unconfigured or returns
 * empty, matching `fetchPricingPlans`.
 */
export async function fetchCalculatorConfig(locale: Locale): Promise<CalculatorConfig> {
  const fallback = buildConfigFromConstants();
  try {
    const [projectTypes, options, presets, settings] = await Promise.all([
      sanityFetch<CalculatorProjectTypeDoc[] | null>({
        query: CALCULATOR_PROJECT_TYPES_QUERY,
        revalidate: 300,
        tags: ["calculator-config"],
      }),
      sanityFetch<CalculatorOptionDoc[] | null>({
        query: CALCULATOR_OPTIONS_QUERY,
        revalidate: 300,
        tags: ["calculator-config"],
      }),
      sanityFetch<CalculatorPresetDoc[] | null>({
        query: CALCULATOR_PRESETS_QUERY,
        revalidate: 300,
        tags: ["calculator-config"],
      }),
      sanityFetch<CalculatorSettingsDoc | null>({
        query: CALCULATOR_SETTINGS_QUERY,
        revalidate: 300,
        tags: ["calculator-config"],
      }),
    ]);

    if (!projectTypes?.length || !options?.length || !presets?.length) {
      return fallback;
    }

    return shapeConfig(locale, projectTypes, options, presets, settings, fallback);
  } catch {
    return fallback;
  }
}

function shapeConfig(
  locale: Locale,
  projectTypes: CalculatorProjectTypeDoc[],
  options: CalculatorOptionDoc[],
  presets: CalculatorPresetDoc[],
  settings: CalculatorSettingsDoc | null,
  fallback: CalculatorConfig,
): CalculatorConfig {
  const byGroup = <T>(
    group: CalculatorOptionDoc["groupKey"],
    map: (doc: CalculatorOptionDoc) => T,
  ): T[] =>
    options
      .filter((o) => o.groupKey === group)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(map);

  const projectTypesShaped: ConfigProjectType[] = projectTypes.map((p) => ({
    key: p.projectKey,
    label: loc(p.label, locale),
    hint: loc(p.hint, locale),
    basePrice: p.basePrice,
    pages: p.pages,
  }));

  const productComplexity: ConfigProductComplexity[] = byGroup("productComplexity", (o) => ({
    key: o.optionKey as ProductComplexity,
    label: loc(o.label, locale),
    hint: loc(o.hint, locale),
    price: o.price ?? 0,
  }));

  const design: ConfigDesign[] = byGroup("design", (o) => ({
    key: o.optionKey as DesignComplexity,
    label: loc(o.label, locale),
    hint: loc(o.hint, locale),
    percent: o.percent ?? 0,
    previews: (o.previews ?? []).map((p) => ({
      src: p.src,
      caption: loc(p.caption, locale),
    })),
  }));

  const languages: ConfigPercentOption<LanguageOption>[] = byGroup("language", (o) => ({
    key: o.optionKey as LanguageOption,
    label: loc(o.label, locale),
    percent: o.percent ?? 0,
  }));

  const cmsUpgrades: ConfigCheckboxOption[] = byGroup("cms", (o) => ({
    key: o.optionKey,
    label: loc(o.label, locale),
    hint: o.hint ? loc(o.hint, locale) : undefined,
    price: o.price ?? 0,
    included: o.included,
  }));

  const seoOptions: ConfigCheckboxOption[] = byGroup("seo", (o) => ({
    key: o.optionKey,
    label: loc(o.label, locale),
    hint: o.hint ? loc(o.hint, locale) : undefined,
    price: o.price ?? 0,
    included: o.included,
  }));

  const features: ConfigFeatureOption[] = byGroup("feature", (o) => ({
    key: o.optionKey,
    label: loc(o.label, locale),
    hint: o.hint ? loc(o.hint, locale) : undefined,
    price: o.price ?? 0,
    included: o.included,
    group: (o.featureGroup as FeatureGroup) ?? "advancedUx",
  }));

  const contentOptions: ConfigPriceOption<ContentOption>[] = byGroup("content", (o) => ({
    key: o.optionKey as ContentOption,
    label: loc(o.label, locale),
    price: o.price ?? 0,
  }));

  const timeline: ConfigPercentOption<TimelineOption>[] = byGroup("timeline", (o) => ({
    key: o.optionKey as TimelineOption,
    label: loc(o.label, locale),
    hint: o.hint ? loc(o.hint, locale) : undefined,
    percent: o.percent ?? 0,
  }));

  const maintenance: ConfigMaintenance[] = byGroup("maintenance", (o) => ({
    key: o.optionKey as MaintenancePlan,
    label: loc(o.label, locale),
    monthlyPrice: o.monthlyPrice ?? 0,
  }));

  const seoGrowth: ConfigSeoGrowth[] = byGroup("seoGrowth", (o) => ({
    key: o.optionKey as SeoGrowthPlan,
    label: loc(o.label, locale),
    bestFor: loc(o.bestFor, locale),
    includes: (o.includes ?? []).map((s) => loc(s, locale)).filter(Boolean),
    badge: loc(o.badge, locale) || undefined,
    monthlyPrice: o.monthlyPrice ?? 0,
    priceLabel: o.priceLabel,
  }));

  const presetsShaped: ConfigPreset[] = presets
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((p) => ({
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
    }));

  return {
    projectTypes: projectTypesShaped,
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
    presets: presetsShaped,
    settings: {
      defaultProjectType: (settings?.defaultProjectType ?? "multiPage") as ProjectType,
      roundStep: settings?.roundStep ?? 50,
      highEstimateFactor: settings?.highEstimateFactor ?? 1.25,
      seoGrowthRecommendedBadge: seoGrowth.find((p) => p.badge)?.badge ?? "Recommended",
    },
  };
}
