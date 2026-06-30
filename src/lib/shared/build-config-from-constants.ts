/**
 * Builds a CalculatorConfig from the legacy constants. Used both as the
 * runtime fallback when Sanity returns nothing AND as the engine's default
 * config so existing call sites keep working without modification.
 *
 * Labels come from a `t` accessor (next-intl). When called without one
 * (e.g. inside the engine's default), labels are empty strings — that's
 * fine because the engine does not read labels.
 */
import {
  CMS_UPGRADES,
  CONTENT_OPTIONS,
  DESIGN_COMPLEXITY_OPTIONS,
  DESIGN_PREVIEW_CONFIG,
  FEATURE_OPTIONS,
  LANGUAGE_OPTIONS,
  PRODUCT_COMPLEXITY_OPTIONS,
  PROJECT_TYPE_CONFIG,
  SEO_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/constants/calculator-config";
import type {
  CalculatorConfig,
  FeatureGroup,
} from "@/types/calculator-config";
import type {
  ContentOption,
  DesignComplexity,
  LanguageOption,
  ProductComplexity,
  ProjectType,
  TimelineOption,
} from "@/types/pricing";

const FEATURE_GROUP_BY_ID: Record<string, FeatureGroup> = {
  contactForm: "leadCapture",
  leadForm: "leadCapture",
  email: "leadCapture",
  telegram: "leadCapture",
  crm: "leadCapture",
  analytics: "conversion",
  adsTracking: "conversion",
  reviews: "conversion",
  faqSchema: "conversion",
  payments: "advancedUx",
  booking: "advancedUx",
  accounts: "advancedUx",
  uploads: "advancedUx",
  search: "advancedUx",
  mapBasic: "advancedUx",
  mapInteractive: "advancedUx",
  cookie: "advancedUx",
};

type LabelFn = (key: string, fallback?: string) => string;

const passthrough: LabelFn = (_key, fallback) => fallback ?? "";

export function buildConfigFromConstants(
  t: LabelFn = passthrough,
): CalculatorConfig {
  return {
    projectTypes: (
      Object.entries(PROJECT_TYPE_CONFIG) as [
        ProjectType,
        (typeof PROJECT_TYPE_CONFIG)[ProjectType],
      ][]
    ).map(([key, v]) => ({
      key,
      label: t(`options.project.${key}.label`, v.label),
      hint: t(`options.project.${key}.hint`, v.hint),
      basePrice: v.basePrice,
      hasProductComplexity: key === "ecommerce",
      pages: v.pages,
    })),
    productComplexity: (
      Object.entries(PRODUCT_COMPLEXITY_OPTIONS) as [
        ProductComplexity,
        (typeof PRODUCT_COMPLEXITY_OPTIONS)[ProductComplexity],
      ][]
    ).map(([key, v]) => ({
      key,
      label: t(`options.product.${key}.label`, v.label),
      hint: t(`options.product.${key}.hint`, v.hint),
      price: v.price,
    })),
    design: (
      Object.entries(DESIGN_COMPLEXITY_OPTIONS) as [
        DesignComplexity,
        (typeof DESIGN_COMPLEXITY_OPTIONS)[DesignComplexity],
      ][]
    ).map(([key, v]) => ({
      key,
      label: t(`options.design.${key}.label`, v.label),
      hint: t(`options.design.${key}.hint`, v.hint),
      percent: v.percent,
      previews: DESIGN_PREVIEW_CONFIG[key],
    })),
    languages: (
      Object.entries(LANGUAGE_OPTIONS) as [
        LanguageOption,
        (typeof LANGUAGE_OPTIONS)[LanguageOption],
      ][]
    ).map(([key, v]) => ({
      key,
      label: t(`options.language.${key}`, v.label),
      percent: v.percent,
    })),
    cmsUpgrades: CMS_UPGRADES.map((o) => ({
      key: o.id,
      label: t(`options.cms.${o.id}.label`, o.label),
      hint: o.hint ? t(`options.cms.${o.id}.hint`, o.hint) : undefined,
      price: o.price,
      included: o.included,
    })),
    seoOptions: SEO_OPTIONS.map((o) => ({
      key: o.id,
      label: t(`options.seo.${o.id}.label`, o.label),
      hint: o.hint ? t(`options.seo.${o.id}.hint`, o.hint) : undefined,
      price: o.price,
      included: o.included,
    })),
    features: FEATURE_OPTIONS.map((o) => ({
      key: o.id,
      label: t(`options.feature.${o.id}.label`, o.label),
      hint: o.hint ? t(`options.feature.${o.id}.hint`, o.hint) : undefined,
      price: o.price,
      included: o.included,
      group: FEATURE_GROUP_BY_ID[o.id] ?? "advancedUx",
    })),
    contentOptions: (
      Object.entries(CONTENT_OPTIONS) as [
        ContentOption,
        (typeof CONTENT_OPTIONS)[ContentOption],
      ][]
    ).map(([key, v]) => ({
      key,
      label: t(`options.content.${key}`, v.label),
      price: v.price,
    })),
    timeline: (
      Object.entries(TIMELINE_OPTIONS) as [
        TimelineOption,
        (typeof TIMELINE_OPTIONS)[TimelineOption],
      ][]
    ).map(([key, v]) => ({
      key,
      label: t(`options.timeline.${key}.label`, v.label),
      hint: t(`options.timeline.${key}.hint`, v.hint),
      price: v.price,
    })),
    settings: {
      defaultProjectType: "multiPage",
      roundStep: 50,
    },
  };
}
