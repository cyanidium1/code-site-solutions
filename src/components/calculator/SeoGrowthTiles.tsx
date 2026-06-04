"use client";

import { useTranslations } from "next-intl";
import { H3 } from "@/components/ui";
import { formatEur } from "@/lib/shared/format-eur";
import type { CalculatorConfig } from "@/types/calculator-config";
import type { CalculatorInput, SeoGrowthPlan } from "@/types/pricing";

const NOTE = "text-ink-3 text-[12px] leading-[1.5]";

type SeoGrowthTilesProps = {
  config: CalculatorConfig;
  input: CalculatorInput;
  onChange: (next: CalculatorInput) => void;
};

export function SeoGrowthTiles({ config, input, onChange }: SeoGrowthTilesProps) {
  const t = useTranslations("Calculator");
  const suffix = t("afterLaunch.growth.monthSuffix");
  return (
    <div className="border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] px-5 pt-5 pb-[22px] flex flex-col gap-3">
      <H3 variant="calc-after">{t("afterLaunch.growth.title")}</H3>
      <p className={NOTE}>{t("afterLaunch.growth.note")}</p>
      <div className="grid grid-cols-1 gap-[10px] md-wide:grid-cols-2">
        {config.seoGrowth.map((plan) => {
          const isActive = input.seoGrowthPlan === plan.key;
          return (
            <button
              key={plan.key}
              type="button"
              className={
                "border rounded-[14px] p-[14px] text-left text-ink-dim grid gap-2 cursor-pointer " +
                "transition-[border-color,transform] duration-200 hover:border-line-strong hover:-translate-y-[1px] " +
                "[&_h4]:m-0 [&_h4]:font-sans [&_h4]:text-[22px] [&_h4]:tracking-[-0.01em] [&_h4]:text-ink " +
                "[&_h4>small]:ml-1 [&_h4>small]:text-[12px] [&_h4>small]:text-ink-3 " +
                "[&>p]:m-0 [&>p]:text-[12px] [&>p]:text-ink-3 " +
                "[&>ul]:list-none [&>ul]:m-0 [&>ul]:p-0 [&>ul]:grid [&>ul]:gap-[6px] [&>ul]:text-[12.5px] " +
                "[&>ul>li]:relative [&>ul>li]:pl-[14px] [&>ul>li]:text-ink-dim " +
                "[&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[7px] " +
                "[&>ul>li]:before:w-[5px] [&>ul>li]:before:h-[5px] [&>ul>li]:before:rounded-full [&>ul>li]:before:bg-accent-soft " +
                (plan.badge
                  ? "bg-[linear-gradient(180deg,oklch(0.2_0.03_295),oklch(0.16_0.02_295))] "
                  : "bg-[oklch(0.18_0.008_300)] ") +
                (isActive
                  ? "border-accent-55 shadow-[inset_0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.28)]"
                  : "border-line")
              }
              onClick={() =>
                onChange({ ...input, seoGrowthPlan: plan.key as SeoGrowthPlan })
              }
            >
              <div className="flex justify-between gap-2">
                <strong>{plan.label}</strong>
                {plan.badge ? (
                  <span className="text-[10px] border border-accent-35 text-accent-soft rounded-full px-[7px] py-[3px] uppercase tracking-[0.1em]">
                    {plan.badge}
                  </span>
                ) : null}
              </div>
              <h4>
                {plan.priceLabel ? (
                  plan.priceLabel
                ) : (
                  <>
                    {formatEur(plan.monthlyPrice)}
                    <small>{suffix}</small>
                  </>
                )}
              </h4>
              <p>{plan.bestFor}</p>
              <ul>
                {plan.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
