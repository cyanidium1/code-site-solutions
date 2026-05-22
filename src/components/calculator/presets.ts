/**
 * Calculator preset helpers — pure functions that produce a complete
 * `CalculatorInput` for each package preset or the "basic" reset state.
 *
 * Centralizing the state shape here keeps `CalculatorControls.tsx` focused
 * on JSX and removes ~70 lines of state-mutation logic from that file.
 */

import { PROJECT_TYPE_CONFIG } from "@/constants/calculator-config";
import type { CalculatorInput } from "@/types/pricing";

/** Reset the form to the cheapest viable scope for the current project type. */
export function basicSetupInput(current: CalculatorInput): CalculatorInput {
  const projectConfig = PROJECT_TYPE_CONFIG[current.projectType];
  return {
    ...current,
    pages: projectConfig.pages.min,
    designComplexity: "simple",
    languages: "one",
    cmsUpgradeIds: [],
    seoOptionIds: [],
    featureIds: [],
    contentOption: "clientProvided",
    timeline: "standard",
    maintenancePlan: "none",
    seoGrowthPlan: "none",
    productComplexity: "simple",
  };
}

/**
 * Apply a package preset by id. Returns `null` for unknown ids so the
 * caller can decide what to do (the existing UI never raises this).
 */
export function inputForPreset(
  current: CalculatorInput,
  presetId: string,
): CalculatorInput | null {
  if (presetId === "starterLanding") {
    return {
      ...current,
      projectType: "landing",
      pages: 7,
      designComplexity: "simple",
      languages: "one",
      cmsUpgradeIds: [],
      seoOptionIds: [],
      featureIds: [],
      contentOption: "clientProvided",
      timeline: "standard",
      maintenancePlan: "none",
      seoGrowthPlan: "none",
      productComplexity: "simple",
    };
  }
  if (presetId === "growthWebsite") {
    return {
      ...current,
      projectType: "multiPage",
      pages: 6,
      designComplexity: "custom",
      languages: "two",
      cmsUpgradeIds: [],
      seoOptionIds: [],
      featureIds: ["leadForm", "analytics"],
      contentOption: "clientProvided",
      timeline: "standard",
      maintenancePlan: "none",
      seoGrowthPlan: "none",
      productComplexity: "simple",
    };
  }
  if (presetId === "ecommerceStarter") {
    return {
      ...current,
      projectType: "ecommerce",
      pages: 5,
      productComplexity: "medium",
      designComplexity: "custom",
      languages: "one",
      cmsUpgradeIds: [],
      seoOptionIds: [],
      featureIds: ["search", "payments", "analytics"],
      contentOption: "clientProvided",
      timeline: "standard",
      maintenancePlan: "none",
      seoGrowthPlan: "none",
    };
  }
  return null;
}
