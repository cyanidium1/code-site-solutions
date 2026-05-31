/**
 * Calculator preset helpers — pure functions that produce a complete
 * `CalculatorInput` for a preset or for the "basic" reset state, given
 * a CalculatorConfig.
 */
import type { CalculatorConfig } from "@/types/calculator-config";
import type { CalculatorInput } from "@/types/pricing";

export function basicSetupInput(
  current: CalculatorInput,
  config: CalculatorConfig,
): CalculatorInput {
  const project = config.projectTypes.find((p) => p.key === current.projectType);
  return {
    ...current,
    pages: project?.pages.min ?? current.pages,
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

export function inputForPreset(
  current: CalculatorInput,
  presetKey: string,
  config: CalculatorConfig,
): CalculatorInput | null {
  const preset = config.presets.find((p) => p.key === presetKey);
  if (!preset) return null;
  return { ...current, ...preset.appliedInput };
}
