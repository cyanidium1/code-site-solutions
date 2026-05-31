import type * as React from "react";

/**
 * Stable project-type identifier. Was a fixed union; widened to free-form
 * `string` so editors can add new project types in Sanity (e.g. `webApp`,
 * `portfolio`) without TS errors. The engine treats unknown keys gracefully:
 * looks up by string in `config.projectTypes`, defaults to multi-page-like
 * behaviour for unknown keys (no product-complexity tier, "Pages" label,
 * generic icon). Per-type behaviour knobs live on `ConfigProjectType`.
 */
export type ProjectType = string;
export type DesignComplexity = "simple" | "custom" | "advanced";
export type LanguageOption = "one" | "two" | "three" | "fourPlus";
export type TimelineOption = "standard" | "faster" | "urgent";
export type ContentOption =
  | "clientProvided"
  | "lightPolishing"
  | "fullCopywriting"
  | "seoCopywriting";
export type MaintenancePlan = "none" | "basic" | "growth" | "dedicated";
export type SeoGrowthPlan = "none" | "basicSeo" | "growthSeo" | "contentEngine";
export type ProductComplexity = "simple" | "medium" | "advanced";
export type DesignPreviewItem = { src: string; caption: string };

export type CheckboxOption = {
  id: string;
  label: string;
  price: number;
  hint?: string;
  included?: boolean;
};

export type PackagePreset = {
  id: "starterLanding" | "growthWebsite" | "ecommerceStarter";
  title: string;
  badge: string;
  bestFor: string;
  includes: string[];
  estimatedRange: string;
};

export type CalculatorInput = {
  projectType: ProjectType;
  pages: number;
  productComplexity: ProductComplexity;
  designComplexity: DesignComplexity;
  languages: LanguageOption;
  cmsUpgradeIds: string[];
  seoOptionIds: string[];
  featureIds: string[];
  contentOption: ContentOption;
  timeline: TimelineOption;
  maintenancePlan: MaintenancePlan;
  seoGrowthPlan: SeoGrowthPlan;
};

export type CalculatorEstimate = {
  breakdown: {
    basePrice: number;
    pageCost: number;
    productComplexityCost: number;
    cmsCost: number;
    seoCost: number;
    featureCost: number;
    contentCost: number;
    subtotal: number;
    multiplier: number;
    designPercent: number;
    languagePercent: number;
    timelinePercent: number;
  };
  oneTimeEstimate: number;
  lowEstimate: number;
  highEstimate: number;
  monthlyMaintenance: number;
};

export type TableRowData = {
  param: string;
  wp: string;
  wix: string;
  custom: string;
};

export type TierProps = {
  name: React.ReactNode;
  price: string;
  /** Small label rendered before the price ("від" / "from"). Defaults to "від". */
  priceLabel?: string;
  weeks: string;
  /** Optional one-liner shown between price/weeks and the includes list. */
  bestFor?: React.ReactNode;
  /** Localized label for the "best for" row. Defaults to "Кому підходить:". */
  bestForLabel?: string;
  popular?: boolean;
  popularLabel?: string;
  includes: { heading: string; items: React.ReactNode[] };
  excludes?: { heading?: string; items: React.ReactNode[] };
  ctaLabel: string;
  ctaGhost?: boolean;
  ctaHref?: string;
  /** Optional promo/discount line rendered above the CTA. Future use. */
  discountLine?: React.ReactNode;
};
