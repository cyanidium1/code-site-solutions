import type { CalculatorConfig } from "@/types/calculator-config";
import type { CalculatorInput } from "@/types/pricing";

/**
 * Renders a visitor's calculator configuration as human-readable lines, mapping
 * option ids to the labels they saw (sourced from the Sanity config). Used to
 * put a legible "here's what they clicked" block into the lead notification
 * instead of a raw JSON dump. Field labels are Ukrainian (the owner reads the
 * Telegram channel); option values stay in the visitor's locale.
 */
export function formatCalculatorSelections(
  input: CalculatorInput,
  config: CalculatorConfig,
): string {
  const lines: string[] = [];
  const push = (label: string, value: string | undefined) => {
    if (value) lines.push(`• ${label}: ${value}`);
  };

  const projectType = config.projectTypes.find(
    (p) => p.key === input.projectType,
  );
  const hasProductComplexity =
    projectType?.hasProductComplexity ?? input.projectType === "ecommerce";

  push("Тип проєкту", projectType?.label ?? input.projectType);
  push("Сторінок", String(input.pages));

  if (hasProductComplexity) {
    push(
      "Складність продукту",
      config.productComplexity.find((p) => p.key === input.productComplexity)
        ?.label,
    );
  }

  push(
    "Дизайн",
    config.design.find((d) => d.key === input.designComplexity)?.label,
  );
  push(
    "Мови",
    config.languages.find((l) => l.key === input.languages)?.label,
  );

  const labelsFor = (
    ids: string[],
    options: { key: string; label: string }[],
  ) =>
    ids
      .map((id) => options.find((o) => o.key === id)?.label ?? id)
      .join(", ");

  if (input.cmsUpgradeIds.length) {
    push("CMS-апгрейди", labelsFor(input.cmsUpgradeIds, config.cmsUpgrades));
  }
  if (input.seoOptionIds.length) {
    push("SEO-опції", labelsFor(input.seoOptionIds, config.seoOptions));
  }
  if (input.featureIds.length) {
    push("Функції", labelsFor(input.featureIds, config.features));
  }

  push(
    "Контент",
    config.contentOptions.find((c) => c.key === input.contentOption)?.label,
  );
  push(
    "Терміни",
    config.timeline.find((t) => t.key === input.timeline)?.label,
  );

  return lines.join("\n");
}
