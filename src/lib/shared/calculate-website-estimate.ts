import { buildConfigFromConstants } from "./build-config-from-constants";
import type { CalculatorConfig } from "@/types/calculator-config";
import type { CalculatorEstimate, CalculatorInput } from "@/types/pricing";

const sumSelected = (
  selectedIds: string[],
  options: { key: string; price: number }[],
) =>
  options
    .filter((o) => selectedIds.includes(o.key))
    .reduce((sum, option) => sum + option.price, 0);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

let cachedDefaultConfig: CalculatorConfig | null = null;
function defaultConfig(): CalculatorConfig {
  if (!cachedDefaultConfig) cachedDefaultConfig = buildConfigFromConstants();
  return cachedDefaultConfig;
}

export function normalizeCalculatorInput(
  input: CalculatorInput,
  config: CalculatorConfig = defaultConfig(),
): CalculatorInput {
  const project = config.projectTypes.find((p) => p.key === input.projectType);
  if (!project) return input;
  return {
    ...input,
    pages: clamp(input.pages, project.pages.min, project.pages.max),
  };
}

export function calculateWebsiteEstimate(
  rawInput: CalculatorInput,
  config: CalculatorConfig = defaultConfig(),
): CalculatorEstimate {
  const input = normalizeCalculatorInput(rawInput, config);
  const project = config.projectTypes.find((p) => p.key === input.projectType)!;
  const productCx = config.productComplexity.find(
    (p) => p.key === input.productComplexity,
  )!;
  const design = config.design.find((d) => d.key === input.designComplexity)!;
  const language = config.languages.find((l) => l.key === input.languages)!;
  const timeline = config.timeline.find((t) => t.key === input.timeline)!;
  const contentOpt = config.contentOptions.find(
    (c) => c.key === input.contentOption,
  )!;
  const maintenance = config.maintenance.find(
    (m) => m.key === input.maintenancePlan,
  )!;

  const roundStep = config.settings.roundStep || 50;
  const round = (n: number) => Math.round(n / roundStep) * roundStep;

  const extraPages = Math.max(0, input.pages - project.pages.included);
  const pageCost = extraPages * project.pages.extraPrice;
  const productComplexityCost =
    input.projectType === "ecommerce" ? productCx.price : 0;

  const cmsCost = sumSelected(input.cmsUpgradeIds, config.cmsUpgrades);
  const seoCost = sumSelected(input.seoOptionIds, config.seoOptions);
  const featureCost = sumSelected(input.featureIds, config.features);
  const contentCost = contentOpt.price;

  const subtotal =
    project.basePrice +
    pageCost +
    productComplexityCost +
    cmsCost +
    seoCost +
    featureCost +
    contentCost;

  const designPercent = design.percent;
  const languagePercent = language.percent;
  const timelinePercent = timeline.percent;
  // Round to 4 decimal places to absorb IEEE-754 drift (e.g. 0.2 + 0.15
  // produces 0.35000000000000003). Prevents downstream round-to-50 from
  // landing on the wrong $50 step.
  const multiplier =
    Math.round((1 + designPercent + languagePercent + timelinePercent) * 10000) /
    10000;

  const oneTimeEstimate = round(subtotal * multiplier);
  const lowEstimate = oneTimeEstimate;
  const highEstimate = round(oneTimeEstimate * config.settings.highEstimateFactor);
  const monthlyMaintenance = maintenance.monthlyPrice;

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
