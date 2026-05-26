"use client";

import { useTranslations } from "next-intl";
import { CalendarClock, Sparkles } from "lucide-react";
import {
  CMS_UPGRADES,
  CONTENT_OPTIONS,
  DESIGN_COMPLEXITY_OPTIONS,
  FEATURE_OPTIONS,
  LANGUAGE_OPTIONS,
  MAINTENANCE_OPTIONS,
  PRODUCT_COMPLEXITY_OPTIONS,
  PROJECT_TYPE_CONFIG,
  SEO_OPTIONS,
} from "@/constants/calculator-config";
import type {
  CalculatorEstimate,
  CalculatorInput,
  MaintenancePlan,
  ProductComplexity,
} from "@/types/pricing";
import { formatEur } from "@/lib/shared/format-eur";
import { PriceBreakdown } from "./PriceBreakdown";
import { H3 } from "@/components/ui";

// Calc-specific CTA classes. Kept module-local because their gradient
// + uppercase tracking are not part of the global Btn primitive variants.
const CALC_BTN_PRIMARY =
  "inline-flex items-center justify-center w-full border-none rounded-full " +
  "bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.98)] " +
  "px-[18px] py-[14px] font-sans text-[12px] uppercase tracking-[0.1em] font-bold no-underline cursor-pointer " +
  "transition-[transform,filter,box-shadow] duration-200 shadow-[0_6px_18px_oklch(from_var(--color-accent)_l_c_h_/_0.3)] " +
  "hover:-translate-y-[1px] hover:shadow-[0_10px_24px_oklch(from_var(--color-accent)_l_c_h_/_0.4)] " +
  "active:[filter:brightness(0.93)] " +
  "focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2";

const CALC_BTN_GHOST =
  "inline-flex items-center justify-center w-full min-h-11 border border-line rounded-full bg-transparent text-ink-dim " +
  "px-[18px] py-[11px] font-sans text-[12px] uppercase tracking-[0.1em] font-semibold no-underline cursor-pointer mt-[10px] " +
  "transition-[border-color,color] duration-200 hover:border-line-strong hover:text-ink " +
  "focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2";

const SUMMARY_H4 =
  "m-0 mb-2 font-sans text-[13px] font-semibold text-ink tracking-[-0.005em]";

type EstimateSummaryProps = {
  input: CalculatorInput;
  estimate: CalculatorEstimate;
  seoGrowthMonthly: number;
};

export function EstimateSummary({ input, estimate, seoGrowthMonthly }: EstimateSummaryProps) {
  const t = useTranslations("Calculator");

  // Avoid using the static CMS/SEO/FEATURE option `.label` (English source) in
  // user-facing strings — translate by id instead.
  const selectedFeatureOptions = FEATURE_OPTIONS.filter(
    (feature) => !feature.included && input.featureIds.includes(feature.id),
  );
  const selectedCmsOptions = CMS_UPGRADES.filter((item) => input.cmsUpgradeIds.includes(item.id));
  const selectedSeoOptions = SEO_OPTIONS.filter((item) => input.seoOptionIds.includes(item.id));

  const cmsLabel = (id: string) => t(`options.cms.${id}.label` as never);
  const seoLabel = (id: string) => t(`options.seo.${id}.label` as never);
  const featLabel = (id: string) => t(`options.feature.${id}.label` as never);

  const selectedFeatureLabels = selectedFeatureOptions.map((f) => featLabel(f.id));
  const selectedCmsLabels = selectedCmsOptions.map((i) => cmsLabel(i.id));
  const selectedSeoLabels = selectedSeoOptions.map((i) => seoLabel(i.id));

  const selectedAddonsForBreakdown = [
    ...selectedCmsOptions.map((o) => `${cmsLabel(o.id)} - +${formatEur(o.price)}`),
    ...selectedSeoOptions.map((o) => `${seoLabel(o.id)} - +${formatEur(o.price)}`),
    ...selectedFeatureOptions.map((o) => `${featLabel(o.id)} - +${formatEur(o.price)}`),
  ];

  const pageLabel =
    input.projectType === "landing"
      ? t("summary.pageLabelSections")
      : input.projectType === "ecommerce"
        ? t("summary.pageLabelContentPages")
        : t("summary.pageLabelPages");
  const pageLabelLower = pageLabel.toLowerCase();

  const projectTypeLabel = t(`options.project.${input.projectType}.label` as never);
  const languageLabel = t(`options.language.${input.languages}` as never);
  const timelineLabel = t(`options.timeline.${input.timeline}.label` as never);
  const contentLabel = t(`options.content.${input.contentOption}` as never);
  const designLabel = t(`options.design.${input.designComplexity}.label` as never);
  const productLabel = t(`options.product.${input.productComplexity}.label` as never);
  const maintenanceLabel = t(`options.maintenance.${input.maintenancePlan}` as never);

  const buildingItems = [
    projectTypeLabel,
    `${input.pages} ${pageLabelLower}`,
    languageLabel,
    designLabel,
    ...selectedFeatureLabels,
    ...selectedCmsLabels,
    ...selectedSeoLabels,
  ].slice(0, 8);

  const whatYouGet = t.raw("summary.whatYouGetItems") as string[];
  const whyChanges = t.raw("summary.whyChangesItems") as string[];

  // Bind generic Maintenance/Product types for next-intl's `as never` cast site.
  void (PROJECT_TYPE_CONFIG[input.projectType] as { basePrice: number });
  void (MAINTENANCE_OPTIONS[input.maintenancePlan as MaintenancePlan]);
  void (PRODUCT_COMPLEXITY_OPTIONS[input.productComplexity as ProductComplexity]);
  void DESIGN_COMPLEXITY_OPTIONS;
  void CONTENT_OPTIONS;
  void LANGUAGE_OPTIONS;

  // Repeated chrome strings for summary section blocks.
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
      className={
        "static self-start border border-line rounded-[22px] bg-[oklch(0.16_0.005_300)] " +
        "p-[22px] pb-6 max-h-none overflow-y-auto [scrollbar-width:thin] " +
        "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-line-strong [&::-webkit-scrollbar-thumb]:rounded-full " +
        "max-md-wide:rounded-[18px] max-md-wide:p-[18px] xl:sticky xl:top-24 xl:max-h-[calc(100vh-112px)]"
      }
    >
      <div className={SECTION}>
        <H3 variant="calc-summary" className="mb-3">{t("summary.title")}</H3>
        <ul className={SUMMARY_LIST}>
          <li>
            <span>{t("summary.rowProjectType")}</span>
            <strong>{projectTypeLabel}</strong>
          </li>
          <li>
            <span>{t("summary.rowBasePrice")}</span>
            <strong>{formatEur(PROJECT_TYPE_CONFIG[input.projectType].basePrice)}</strong>
          </li>
          <li>
            <span>{pageLabel}</span>
            <strong>{input.pages}</strong>
          </li>
          <li>
            <span>{t("summary.rowLanguages")}</span>
            <strong>{languageLabel}</strong>
          </li>
          <li>
            <span>{t("summary.rowTimeline")}</span>
            <strong>{timelineLabel}</strong>
          </li>
          <li>
            <span>{t("summary.rowContent")}</span>
            <strong>{contentLabel}</strong>
          </li>
        </ul>
      </div>

      <div className={DIVIDER} />

      <div className={`${SECTION} items-start`}>
        <p className="m-0 mb-1 font-mono text-[11px] tracking-[0.12em] uppercase text-ink-3">{t("summary.rangeLabel")}</p>
        <h4 className="m-0 font-sans text-[28px] tracking-[-0.02em] font-bold bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent))] bg-clip-text text-transparent">
          {formatEur(estimate.lowEstimate)} – {formatEur(estimate.highEstimate)}
        </h4>
        <small className="block mt-[6px] text-ink-3 text-[11px]">{t("summary.rangeNote")}</small>
      </div>

      <div className={DIVIDER} />

      <div className={SECTION}>
        <h4 className={SUMMARY_H4}>{t("summary.whatYouGet")}</h4>
        <ul className={BULLETS}>
          {whatYouGet.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={DIVIDER} />

      <div className={SECTION}>
        <h4 className={SUMMARY_H4}>{t("summary.willInclude")}</h4>
        <ul className={BULLETS}>
          {buildingItems.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
          {input.projectType === "ecommerce" ? (
            <li className="text-ink-3">{productLabel}</li>
          ) : null}
        </ul>
      </div>

      <div className={DIVIDER} />

      <details
        className={
          "text-[13px] " +
          "[&>summary]:cursor-pointer [&>summary]:list-none [&>summary]:min-h-11 [&>summary]:text-[13px] " +
          "[&>summary]:text-ink [&>summary]:font-medium [&>summary]:flex [&>summary]:items-center [&>summary]:justify-between " +
          "[&>summary::-webkit-details-marker]:hidden " +
          "[&>summary]:after:content-['+'] [&>summary]:after:text-accent-soft [&>summary]:after:text-[13px] " +
          "[&[open]>summary]:after:content-['−']"
        }
      >
        <summary>{t("summary.whyChanges")}</summary>
        <ul className={`${BULLETS} mt-[10px]`}>
          {whyChanges.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>

      <div className={DIVIDER} />

      <div className={`${SECTION} gap-[6px]`}>
        <div className="flex items-baseline justify-between gap-[10px]">
          <span className="text-[12.5px] text-ink-3">{t("summary.maintenanceMonth")}</span>
          <strong className="font-sans text-[16px] font-bold text-ink">{formatEur(estimate.monthlyMaintenance)}</strong>
        </div>
        <small className="text-[11px] text-ink-3">{maintenanceLabel}</small>
        {seoGrowthMonthly > 0 ? (
          <div className="flex items-baseline justify-between gap-[10px] mt-2 pt-2 border-t border-dashed border-line">
            <span className="text-[12.5px] text-ink-3">{t.rich("summary.seoGrowthMonth")}</span>
            <strong className="font-sans text-[16px] font-bold text-ink">{formatEur(seoGrowthMonthly)}</strong>
          </div>
        ) : null}
      </div>

      <div className={DIVIDER} />

      <div className={SECTION}>
        <PriceBreakdown
          {...estimate.breakdown}
          pageLabel={pageLabel}
          selectedAddonLabels={selectedAddonsForBreakdown}
          lowEstimate={estimate.lowEstimate}
          highEstimate={estimate.highEstimate}
        />
      </div>

      <div className={DIVIDER} />

      {/* ROI: turn cost into investment */}
      <div
        className={
          `${SECTION} gap-2 relative p-[14px] rounded-[14px] ` +
          "bg-accent-8 border border-accent-22"
        }
      >
        <span className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-lg bg-accent-18 text-accent-soft">
          <Sparkles size={14} strokeWidth={1.7} />
        </span>
        <h4 className={SUMMARY_H4}>{t("summary.roiTitle")}</h4>
        <p className="m-0 text-ink-dim text-[12.5px] leading-[1.55] [&>strong]:text-accent-soft [&>strong]:font-bold">
          {t.rich("summary.roiBody", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>

      <div className={DIVIDER} />

      {/* Scarcity */}
      <div
        className={
          `${SECTION} flex-row items-center gap-2 px-3 py-[10px] rounded-[12px] ` +
          "border border-dashed border-line-strong bg-[oklch(0.18_0.008_300)] text-ink-dim text-[12px] leading-[1.4] " +
          "[&_svg]:text-accent-soft [&_svg]:shrink-0 [&_strong]:text-ink [&_strong]:font-semibold"
        }
      >
        <CalendarClock size={13} strokeWidth={1.7} />
        <span>
          {t.rich("summary.scarcity", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </span>
      </div>

      <p className="text-[12px] text-ink-3 leading-[1.45] my-[14px] mb-[10px]">{t("summary.disclaimer")}</p>
      <a href="#calc-lead-form" className={CALC_BTN_PRIMARY}>
        {t("summary.primaryCta")}
      </a>
      <small className="block text-center mt-[6px] text-ink-3 text-[11px]">{t("summary.ctaMeta")}</small>

      <a
        href="https://calendly.com/fedirdev"
        className={CALC_BTN_GHOST}
        target="_blank"
        rel="noreferrer"
      >
        {t("summary.ghostCta")}
      </a>
    </aside>
  );
}
