// @ts-nocheck
"use client";

import { useTranslations } from "next-intl";
import { H3 } from "@/components/ui";
import { formatEur } from "@/lib/shared/format-eur";
import type { CalculatorConfig } from "@/types/calculator-config";
import type { CalculatorInput, MaintenancePlan } from "@/types/pricing";

const SEG_BTN =
  "border border-line rounded-[12px] bg-transparent text-ink-dim text-left " +
  "px-[14px] py-[11px] text-[13px] cursor-pointer min-h-[50px] " +
  "transition-[border-color,color,background] duration-200 " +
  "hover:border-line-strong hover:text-ink " +
  "[&_small]:block [&_small]:text-ink-3 [&_small]:mt-1 [&_small]:text-[11px]";
const SEG_BTN_ACTIVE = "border-accent-55 bg-accent-12 !text-ink";
const NOTE = "text-ink-3 text-[12px] leading-[1.5]";

type MaintenanceTilesProps = {
  config: CalculatorConfig;
  input: CalculatorInput;
  onChange: (next: CalculatorInput) => void;
};

export function MaintenanceTiles({ config, input, onChange }: MaintenanceTilesProps) {
  const t = useTranslations("Calculator");
  const suffix = t("afterLaunch.maintenance.monthSuffix");
  return (
    <div className="border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] px-5 pt-5 pb-[22px] flex flex-col gap-3">
      <H3 variant="calc-after">{t("afterLaunch.maintenance.title")}</H3>
      <p className={NOTE}>{t("afterLaunch.maintenance.note")}</p>
      <div className="grid grid-cols-2 gap-2 max-md-wide:grid-cols-1">
        {config.maintenance.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`${SEG_BTN} ${input.maintenancePlan === opt.key ? SEG_BTN_ACTIVE : ""}`}
            onClick={() =>
              onChange({ ...input, maintenancePlan: opt.key as MaintenancePlan })
            }
          >
            {opt.label}
            <small>
              {formatEur(opt.monthlyPrice)}
              {suffix}
            </small>
          </button>
        ))}
      </div>
    </div>
  );
}
