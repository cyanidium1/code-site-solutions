import {
  CMS_UPGRADES,
  CONTENT_OPTIONS,
  FEATURE_OPTIONS,
  LANGUAGE_OPTIONS,
  MAINTENANCE_OPTIONS,
  PRODUCT_COMPLEXITY_OPTIONS,
  PROJECT_TYPE_CONFIG,
  SEO_OPTIONS,
  TIMELINE_OPTIONS,
  type CalculatorEstimate,
  type CalculatorInput,
} from "./pricing-calculator-config";

const roundToNearest50 = (value: number) => Math.round(value / 50) * 50;

const sumSelected = (selectedIds: string[], options: { id: string; price: number }[]) =>
  options.filter((o) => selectedIds.includes(o.id)).reduce((sum, option) => sum + option.price, 0);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function normalizeCalculatorInput(input: CalculatorInput): CalculatorInput {
  const projectConfig = PROJECT_TYPE_CONFIG[input.projectType];
  const pages = clamp(input.pages, projectConfig.pages.min, projectConfig.pages.max);

  return {
    ...input,
    pages,
  };
}

export function calculateWebsiteEstimate(rawInput: CalculatorInput): CalculatorEstimate {
  const input = normalizeCalculatorInput(rawInput);
  const project = PROJECT_TYPE_CONFIG[input.projectType];
  const contentOption = CONTENT_OPTIONS[input.contentOption];
  const design = input.designComplexity;
  const languages = input.languages;
  const timeline = input.timeline;

  const extraPages = Math.max(0, input.pages - project.pages.included);
  const pageCost = extraPages * project.pages.extraPrice;
  const productComplexityCost =
    input.projectType === "ecommerce" ? PRODUCT_COMPLEXITY_OPTIONS[input.productComplexity].price : 0;

  const cmsCost = sumSelected(input.cmsUpgradeIds, CMS_UPGRADES);
  const seoCost = sumSelected(input.seoOptionIds, SEO_OPTIONS);
  const featureCost = sumSelected(input.featureIds, FEATURE_OPTIONS);
  const contentCost = contentOption.price;

  const subtotal = project.basePrice + pageCost + productComplexityCost + cmsCost + seoCost + featureCost + contentCost;
  const designPercent = input.designComplexity ? ({ simple: 0, custom: 0.2, advanced: 0.4 }[design]) : 0;
  const languagePercent = LANGUAGE_OPTIONS[languages].percent;
  const timelinePercent = TIMELINE_OPTIONS[timeline].percent;
  const multiplier = 1 + designPercent + languagePercent + timelinePercent;

  const oneTimeEstimate = roundToNearest50(subtotal * multiplier);
  const lowEstimate = oneTimeEstimate;
  const highEstimate = roundToNearest50(oneTimeEstimate * 1.25);
  const monthlyMaintenance = MAINTENANCE_OPTIONS[input.maintenancePlan].monthlyPrice;

  return {
    breakdown: {
      basePrice: project.basePrice,
      pageCost,
      productComplexityCost,
      cmsCost,
      seoCost,
      featureCost,
      contentCost,
      subtotal,
      multiplier,
      designPercent,
      languagePercent,
      timelinePercent,
    },
    oneTimeEstimate,
    lowEstimate,
    highEstimate,
    monthlyMaintenance,
  };
}
