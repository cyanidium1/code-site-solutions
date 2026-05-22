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
  type CalculatorEstimate,
  type CalculatorInput,
  type MaintenancePlan,
  type ProductComplexity,
} from "@/constants/calculator-config";
import { formatEur } from "./formatters";
import { PriceBreakdown } from "./PriceBreakdown";

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

  return (
    <aside className="calc-summary">
      <div className="calc-summary-section">
        <h3 className="calc-summary-h3">{t("summary.title")}</h3>
        <ul className="calc-summary-list">
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

      <div className="calc-summary-divider" />

      <div className="calc-summary-section calc-summary-range">
        <p className="calc-summary-label">{t("summary.rangeLabel")}</p>
        <h4 className="calc-summary-price">
          {formatEur(estimate.lowEstimate)} – {formatEur(estimate.highEstimate)}
        </h4>
        <small className="calc-summary-meta">{t("summary.rangeNote")}</small>
      </div>

      <div className="calc-summary-divider" />

      <div className="calc-summary-section">
        <h4 className="calc-summary-h4">{t("summary.whatYouGet")}</h4>
        <ul className="calc-summary-bullets">
          {whatYouGet.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="calc-summary-divider" />

      <div className="calc-summary-section">
        <h4 className="calc-summary-h4">{t("summary.willInclude")}</h4>
        <ul className="calc-summary-bullets">
          {buildingItems.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
          {input.projectType === "ecommerce" ? (
            <li className="calc-building-note">{productLabel}</li>
          ) : null}
        </ul>
      </div>

      <div className="calc-summary-divider" />

      <details className="calc-summary-collapse">
        <summary>{t("summary.whyChanges")}</summary>
        <ul className="calc-summary-bullets">
          {whyChanges.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>

      <div className="calc-summary-divider" />

      <div className="calc-summary-section calc-summary-monthly">
        <div className="calc-monthly-row">
          <span className="calc-monthly-label">{t("summary.maintenanceMonth")}</span>
          <strong className="calc-monthly-value">{formatEur(estimate.monthlyMaintenance)}</strong>
        </div>
        <small className="calc-monthly-meta">{maintenanceLabel}</small>
        {seoGrowthMonthly > 0 ? (
          <div className="calc-monthly-row calc-monthly-row-secondary">
            <span className="calc-monthly-label">{t.rich("summary.seoGrowthMonth")}</span>
            <strong className="calc-monthly-value">{formatEur(seoGrowthMonthly)}</strong>
          </div>
        ) : null}
      </div>

      <div className="calc-summary-divider" />

      <div className="calc-summary-section">
        <PriceBreakdown
          {...estimate.breakdown}
          pageLabel={pageLabel}
          selectedAddonLabels={selectedAddonsForBreakdown}
          lowEstimate={estimate.lowEstimate}
          highEstimate={estimate.highEstimate}
        />
      </div>

      <div className="calc-summary-divider" />

      {/* ROI: turn cost into investment */}
      <div className="calc-summary-section calc-roi-block">
        <span className="calc-roi-icon">
          <Sparkles size={14} strokeWidth={1.7} />
        </span>
        <h4 className="calc-summary-h4">{t("summary.roiTitle")}</h4>
        <p>
          {t.rich("summary.roiBody", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>

      <div className="calc-summary-divider" />

      {/* Scarcity */}
      <div className="calc-summary-section calc-scarcity">
        <CalendarClock size={13} strokeWidth={1.7} />
        <span>
          {t.rich("summary.scarcity", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </span>
      </div>

      <p className="calc-disclaimer">{t("summary.disclaimer")}</p>
      <a href="#calc-lead-form" className="calc-btn-primary">
        {t("summary.primaryCta")}
      </a>
      <small className="calc-cta-meta">{t("summary.ctaMeta")}</small>

      <a
        href="https://calendly.com/fedirdev"
        className="calc-btn-ghost"
        target="_blank"
        rel="noreferrer"
      >
        {t("summary.ghostCta")}
      </a>
    </aside>
  );
}
