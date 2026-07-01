"use client";

import { useTranslations, useLocale } from "next-intl";
import type {
  CalculatorEstimate,
  CalculatorInput,
} from "@/types/pricing";
import type { CalculatorConfig } from "@/types/calculator-config";
import { formatEur as formatEurRaw } from "@/lib/shared/format-eur";
import { PriceBreakdown } from "./PriceBreakdown";
import { H3 } from "@/components/ui";

const CALC_BTN_PRIMARY =
  "inline-flex items-center justify-center w-full border-none rounded-full " +
  "bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.98)] " +
  "px-[18px] py-[14px] font-sans text-[12px] uppercase tracking-[0.1em] font-bold no-underline cursor-pointer " +
  "transition-[transform,filter,box-shadow] duration-200 shadow-[0_6px_18px_oklch(from_var(--color-accent)_l_c_h_/_0.3)] " +
  "hover:-translate-y-[1px] hover:shadow-[0_10px_24px_oklch(from_var(--color-accent)_l_c_h_/_0.4)] " +
  "active:[filter:brightness(0.93)] " +
  "focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2";

const SUMMARY_H4 =
  "m-0 mb-2 font-sans text-[13px] font-semibold text-ink tracking-[-0.005em]";

type EstimateSummaryProps = {
  config: CalculatorConfig;
  input: CalculatorInput;
  estimate: CalculatorEstimate;
};

export function EstimateSummary({
  config,
  input,
  estimate,
}: EstimateSummaryProps) {
  const t = useTranslations("Calculator");
  const locale = useLocale() as "uk" | "en";
  const formatEur = (n: number) => formatEurRaw(n, locale);

  const projectMeta = config.projectTypes.find((p) => p.key === input.projectType);
  const langMeta = config.languages.find((l) => l.key === input.languages);
  const timelineMeta = config.timeline.find((tm) => tm.key === input.timeline);
  const contentMeta = config.contentOptions.find((c) => c.key === input.contentOption);
  const designMeta = config.design.find((d) => d.key === input.designComplexity);
  const productMeta = config.productComplexity.find((p) => p.key === input.productComplexity);

  const selectedFeatureOptions = config.features.filter(
    (feature) => !feature.included && input.featureIds.includes(feature.key),
  );
  const selectedCmsOptions = config.cmsUpgrades.filter((item) =>
    input.cmsUpgradeIds.includes(item.key),
  );
  const selectedSeoOptions = config.seoOptions.filter((item) =>
    input.seoOptionIds.includes(item.key),
  );

  const selectedFeatureLabels = selectedFeatureOptions.map((f) => f.label);
  const selectedCmsLabels = selectedCmsOptions.map((i) => i.label);
  const selectedSeoLabels = selectedSeoOptions.map((i) => i.label);

  const selectedAddonsForBreakdown = [
    ...selectedCmsOptions.map((o) => `${o.label} - +${formatEur(o.price)}`),
    ...selectedSeoOptions.map((o) => `${o.label} - +${formatEur(o.price)}`),
    ...selectedFeatureOptions.map((o) => `${o.label} - +${formatEur(o.price)}`),
  ];

  const pageLabel =
    input.projectType === "landing"
      ? t("summary.pageLabelSections")
      : input.projectType === "ecommerce"
        ? t("summary.pageLabelContentPages")
        : t("summary.pageLabelPages");
  const pageLabelLower = pageLabel.toLowerCase();

  const buildingItems = [
    projectMeta?.label ?? "",
    `${input.pages} ${pageLabelLower}`,
    langMeta?.label ?? "",
    designMeta?.label ?? "",
    ...selectedFeatureLabels,
    ...selectedCmsLabels,
    ...selectedSeoLabels,
  ]
    .filter(Boolean)
    .slice(0, 8);

  const SECTION = "flex flex-col [&+&]:mt-[14px]";
  const DIVIDER = "h-px bg-line my-4";
  const BULLETS =
    "list-none m-0 p-0 grid gap-[7px] " +
    "[&>li]:relative [&>li]:pl-4 [&>li]:text-ink-dim [&>li]:text-[12.5px] [&>li]:leading-[1.5] " +
    "[&>li]:before:content-[''] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-2 " +
    "[&>li]:before:w-[6px] [&>li]:before:h-[6px] [&>li]:before:rounded-full [&>li]:before:bg-accent-soft";
  const SUMMARY_LIST =
    "list-none m-0 p-0 " +
    "[&>li]:flex [&>li]:justify-between [&>li]:gap-[10px] [&>li]:text-[13px] [&>li]:py-[6px] " +
    "[&>li]:border-b [&>li]:border-dashed [&>li]:border-line [&>li:last-child]:border-b-0 " +
    "[&>li>span]:text-ink-3 [&>li>strong]:text-ink [&>li>strong]:font-semibold";

  return (
    <aside
      id="calc-summary"
      className={
        "static self-start border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] " +
        "p-[18px] pb-6 max-h-none overflow-y-auto [scrollbar-width:thin] " +
        "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-line-strong [&::-webkit-scrollbar-thumb]:rounded-full " +
        "md-wide:rounded-[22px] md-wide:p-[22px] xl:sticky xl:top-24 xl:max-h-[calc(100vh-112px)]"
      }
    >
      <div className={SECTION}>
        <H3 variant="calc-summary" className="mb-3">
          {t("summary.title")}
        </H3>
        <ul className={SUMMARY_LIST}>
          <li>
            <span>{t("summary.rowProjectType")}</span>
            <strong>{projectMeta?.label}</strong>
          </li>
          <li>
            <span>{t("summary.rowBasePrice")}</span>
            <strong>{formatEur(projectMeta?.basePrice ?? 0)}</strong>
          </li>
          <li>
            <span>{pageLabel}</span>
            <strong>{input.pages}</strong>
          </li>
          <li>
            <span>{t("summary.rowLanguages")}</span>
            <strong>{langMeta?.label}</strong>
          </li>
          <li>
            <span>{t("summary.rowTimeline")}</span>
            <strong>{timelineMeta?.label}</strong>
          </li>
          <li>
            <span>{t("summary.rowContent")}</span>
            <strong>{contentMeta?.label}</strong>
          </li>
        </ul>
      </div>

      <div className={DIVIDER} />

      <div className={`${SECTION} items-start`}>
        <p className="m-0 mb-1 font-mono text-[11px] tracking-[0.12em] uppercase text-ink-3">
          {t("summary.rangeLabel")}
        </p>
        <h4 className="m-0 font-sans text-[28px] tracking-[-0.02em] font-bold bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent))] bg-clip-text text-transparent">
          {formatEur(estimate.oneTimeEstimate)}
        </h4>
      </div>

      <div className={DIVIDER} />

      <div className={SECTION}>
        <h4 className={SUMMARY_H4}>{t("summary.willInclude")}</h4>
        <ul className={BULLETS}>
          {buildingItems.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
          {productMeta &&
          (projectMeta?.hasProductComplexity ?? projectMeta?.key === "ecommerce") ? (
            <li className="text-ink-3">{productMeta.label}</li>
          ) : null}
        </ul>
      </div>

      <div className={DIVIDER} />

      <div className={SECTION}>
        <PriceBreakdown
          {...estimate.breakdown}
          pageLabel={pageLabel}
          selectedAddonLabels={selectedAddonsForBreakdown}
          oneTimeEstimate={estimate.oneTimeEstimate}
        />
      </div>

      <p className="text-[12px] text-ink-3 leading-[1.45] my-[14px] mb-[10px]">{t("summary.disclaimer")}</p>
      <a href="#calc-lead-form" className={CALC_BTN_PRIMARY}>
        {t("summary.primaryCta")}
      </a>
      <small className="block text-center mt-[6px] text-ink-3 text-[11px]">{t("summary.ctaMeta")}</small>
    </aside>
  );
}
