"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Code2, LayoutTemplate, ShoppingCart, Search, Database, Rocket, Zap, Store } from "lucide-react";
import {
  CMS_UPGRADES,
  CONTENT_OPTIONS,
  DESIGN_COMPLEXITY_OPTIONS,
  DESIGN_PREVIEW_CONFIG,
  FEATURE_OPTIONS,
  LANGUAGE_OPTIONS,
  PACKAGE_PRESETS,
  PRODUCT_COMPLEXITY_OPTIONS,
  PROJECT_TYPE_CONFIG,
  SEO_OPTIONS,
  TIMELINE_OPTIONS,
  type CalculatorInput,
  type ContentOption,
  type DesignComplexity,
  type LanguageOption,
  type ProductComplexity,
  type ProjectType,
  type TimelineOption,
} from "@/lib/pricing-calculator-config";
import { formatEur, formatPercent } from "./formatters";
import { OptionCard } from "./OptionCard";

type CalculatorControlsProps = {
  value: CalculatorInput;
  onChange: (next: CalculatorInput) => void;
};

export function CalculatorControls({ value, onChange }: CalculatorControlsProps) {
  const projectConfig = PROJECT_TYPE_CONFIG[value.projectType];
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [previewDesign, setPreviewDesign] = useState<DesignComplexity | null>(null);
  const t = useTranslations("Calculator");

  const setProjectType = (projectType: ProjectType) => {
    const defaults = PROJECT_TYPE_CONFIG[projectType];
    onChange({
      ...value,
      projectType,
      pages: defaults.pages.defaultValue,
      productComplexity: "simple",
    });
  };

  const toggle = (source: string[], id: string) => (source.includes(id) ? source.filter((v) => v !== id) : [...source, id]);
  const leadCaptureFeatures = useMemo(
    () => FEATURE_OPTIONS.filter((f) => ["contactForm", "leadForm", "email", "telegram", "crm"].includes(f.id)),
    [],
  );
  const conversionFeatures = useMemo(
    () => FEATURE_OPTIONS.filter((f) => ["analytics", "adsTracking", "reviews", "faqSchema"].includes(f.id)),
    [],
  );
  const advancedUxFeatures = useMemo(
    () =>
      FEATURE_OPTIONS.filter((f) =>
        ["payments", "booking", "accounts", "uploads", "search", "mapBasic", "mapInteractive", "cookie"].includes(f.id),
      ),
    [],
  );
  const resetToBasicSetup = () =>
    onChange({
      ...value,
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
    });
  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === "starterLanding") {
      onChange({
        ...value,
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
      });
      return;
    }
    if (presetId === "growthWebsite") {
      onChange({
        ...value,
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
      });
      return;
    }
    onChange({
      ...value,
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
    });
  };

  const cmsLabel = (id: string) => t(`options.cms.${id}.label` as never);
  const cmsHint = (id: string): string | null => {
    const key = `options.cms.${id}.hint` as never;
    return t.has(key) ? t(key) : null;
  };
  const seoLabel = (id: string) => t(`options.seo.${id}.label` as never);
  const seoHint = (id: string): string | null => {
    const key = `options.seo.${id}.hint` as never;
    return t.has(key) ? t(key) : null;
  };
  const featLabel = (id: string) => t(`options.feature.${id}.label` as never);
  const featHint = (id: string): string | null => {
    const key = `options.feature.${id}.hint` as never;
    return t.has(key) ? t(key) : null;
  };

  const renderFeatureGroup = (title: string, items: typeof FEATURE_OPTIONS) => (
    <>
      <label>{title}</label>
      <div className="calc-checkbox-grid calc-checkbox-grid-features">
        {items.map((option) => (
          <label key={option.id} className="calc-checkbox">
            <input
              type="checkbox"
              checked={option.included ? true : value.featureIds.includes(option.id)}
              disabled={option.included}
              onChange={() =>
                onChange({
                  ...value,
                  featureIds: toggle(value.featureIds, option.id),
                })
              }
            />
            <span>
              {featLabel(option.id)}
              <strong>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.included")}</strong>
              {featHint(option.id) ? <small>{featHint(option.id)}</small> : null}
            </span>
          </label>
        ))}
      </div>
    </>
  );

  const pageLabel =
    value.projectType === "landing"
      ? t("controls.sectionsLabel")
      : value.projectType === "ecommerce"
        ? t("controls.contentPagesLabel")
        : t("controls.pagesLabel");

  const pageHelp =
    value.projectType === "landing"
      ? t("controls.sectionsHelp")
      : value.projectType === "ecommerce"
        ? t("controls.ecommercePagesHelp")
        : t("controls.pagesHelp");

  const includedTpl =
    value.projectType === "landing"
      ? t("controls.sectionsIncludedTpl", {
          included: String(projectConfig.pages.included),
          extra: formatEur(projectConfig.pages.extraPrice),
        })
      : t("controls.pagesIncludedTpl", {
          included: String(projectConfig.pages.included),
          extra: formatEur(projectConfig.pages.extraPrice),
        });

  return (
    <div className="calc-controls">
      <section className="calc-group calc-preset-section">
        <h3>{t("controls.presetTitle")}</h3>
        <div className="calc-group-content">
          <p className="calc-note">{t("controls.presetNote")}</p>
          <div className="calc-preset-grid">
            {PACKAGE_PRESETS.map((preset) => {
              const includes = t.raw(`options.presets.${preset.id}.includes`) as string[];
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`calc-preset-card${selectedPreset === preset.id ? " active" : ""}${preset.id === "growthWebsite" ? " is-recommended" : ""}`}
                  onClick={() => applyPreset(preset.id)}
                >
                  <div className="calc-preset-top">
                    <span className="calc-preset-icon">
                      {preset.id === "starterLanding" ? <Zap size={15} /> : preset.id === "growthWebsite" ? <Rocket size={15} /> : <Store size={15} />}
                    </span>
                    <em>{t(`options.presets.${preset.id}.badge` as never)}</em>
                  </div>
                  <strong>{t(`options.presets.${preset.id}.title` as never)}</strong>
                  <small>
                    {t("controls.presetBestForLabel")} {t(`options.presets.${preset.id}.bestFor` as never)}
                  </small>
                  <ul>
                    {includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <span className="calc-preset-price">
                    {t(`options.presets.${preset.id}.estimatedRange` as never)}
                  </span>
                  <p className="calc-preset-anchor">{t(`controls.compareAnchors.${preset.id}` as never)}</p>
                  <b>{t("controls.presetUse")}</b>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="calc-manual-intro">
        <div className="calc-manual-intro-head">
          <h3>{t("controls.customizeTitle")}</h3>
          <button type="button" className="calc-reset-btn" onClick={resetToBasicSetup}>
            {t("controls.resetBtn")}
          </button>
        </div>
        <p>{t("controls.customizeNote")}</p>
      </div>

      <details open className="calc-group">
        <summary>{t("controls.section01")}</summary>
        <div className="calc-group-content">
          <div className="calc-grid-3">
            {Object.entries(PROJECT_TYPE_CONFIG).map(([id, item]) => (
              <OptionCard
                key={id}
                title={t(`options.project.${id}.label` as never)}
                description={t(`options.project.${id}.hint` as never)}
                priceLabel={t("controls.fromPriceTpl", { price: formatEur(item.basePrice) })}
                selected={value.projectType === id}
                onClick={() => setProjectType(id as ProjectType)}
              >
                <span className="calc-project-icon">
                  {id === "landing" ? <LayoutTemplate size={14} /> : id === "multiPage" ? <Code2 size={14} /> : <ShoppingCart size={14} />}
                </span>
              </OptionCard>
            ))}
          </div>

          <label htmlFor="calc-pages">
            {pageLabel}
            <span className="calc-help">{pageHelp}</span>
          </label>
          <div className="calc-range-row">
            <input
              id="calc-pages"
              className="calc-range-input"
              type="range"
              min={projectConfig.pages.min}
              max={projectConfig.pages.max}
              value={value.pages}
              onChange={(e) => onChange({ ...value, pages: Number(e.target.value) })}
            />
            <strong>{value.pages}</strong>
          </div>
          <div className="calc-range-meta">
            <span>{projectConfig.pages.min}</span>
            <span>{projectConfig.pages.max}</span>
          </div>
          <p className="calc-note">{includedTpl}</p>

          {value.projectType === "ecommerce" ? (
            <>
              <label>{t("controls.productStructLabel")}</label>
              <div className="calc-segment">
                {Object.entries(PRODUCT_COMPLEXITY_OPTIONS).map(([id, option]) => (
                  <button
                    key={id}
                    type="button"
                    className={value.productComplexity === id ? "active" : ""}
                    onClick={() => onChange({ ...value, productComplexity: id as ProductComplexity })}
                  >
                    {t(`options.product.${id}.label` as never)}
                    <small>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.includedLower")}</small>
                  </button>
                ))}
              </div>
              <p className="calc-note">{t(`options.product.${value.productComplexity}.hint` as never)}</p>
            </>
          ) : null}
        </div>
      </details>

      <details open className="calc-group">
        <summary>{t("controls.section02")}</summary>
        <div className="calc-group-content">
          <label>{t("controls.designLabel")}</label>
          <div className="calc-design-grid">
            {Object.entries(DESIGN_COMPLEXITY_OPTIONS).map(([id, option]) => (
              <div
                key={id}
                className={`calc-design-card calc-design-${id}${value.designComplexity === id ? " active" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => onChange({ ...value, designComplexity: id as DesignComplexity })}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onChange({ ...value, designComplexity: id as DesignComplexity });
                  }
                }}
              >
                <span className="calc-design-thumb" aria-hidden="true">
                  <img src={DESIGN_PREVIEW_CONFIG[id as DesignComplexity][0].src} alt="" />
                </span>
                <span className="calc-design-head">
                  <span>{t(`options.design.${id}.label` as never)}</span>
                  <small>{formatPercent(option.percent)}</small>
                </span>
                <span className="calc-design-description">
                  {t(`options.design.${id}.hint` as never)}
                </span>
                <button
                  type="button"
                  className="calc-design-link"
                  onClick={(event) => {
                    event.stopPropagation();
                    setPreviewDesign(id as DesignComplexity);
                  }}
                >
                  {t("controls.viewExamples")}
                </button>
              </div>
            ))}
          </div>
          <p className="calc-note">{t(`options.design.${value.designComplexity}.hint` as never)}</p>

          <label>{t("controls.langLabel")}</label>
          <div className="calc-segment">
            {Object.entries(LANGUAGE_OPTIONS).map(([id, option]) => (
              <button
                key={id}
                type="button"
                className={value.languages === id ? "active" : ""}
                onClick={() => onChange({ ...value, languages: id as LanguageOption })}
              >
                {t(`options.language.${id}` as never)}
                <small>{formatPercent(option.percent)}</small>
              </button>
            ))}
          </div>
          <p className="calc-note">{t("controls.langNoteSeo")}</p>
          <p className="calc-note">{t("controls.langNoteTranslations")}</p>
        </div>
      </details>

      <details className="calc-group">
        <summary>{t("controls.section03")}</summary>
        <div className="calc-group-content">
          <label className="calc-subgroup-title">
            <Database size={14} /> {t("controls.cmsSubgroup")}
          </label>
          <div className="calc-checkbox-grid calc-checkbox-grid-cms">
            {CMS_UPGRADES.map((option) => (
              <label key={option.id} className="calc-checkbox">
                <input
                  type="checkbox"
                  checked={option.included ? true : value.cmsUpgradeIds.includes(option.id)}
                  disabled={option.included}
                  onChange={() =>
                    onChange({
                      ...value,
                      cmsUpgradeIds: toggle(value.cmsUpgradeIds, option.id),
                    })
                  }
                />
                <span>
                  {cmsLabel(option.id)}
                  <strong>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.included")}</strong>
                  {cmsHint(option.id) ? <small>{cmsHint(option.id)}</small> : null}
                </span>
              </label>
            ))}
          </div>

          <label className="calc-subgroup-title">
            <Search size={14} /> {t("controls.seoSubgroup")}
          </label>
          <div className="calc-checkbox-grid calc-checkbox-grid-seo">
            {SEO_OPTIONS.map((option) => (
              <label key={option.id} className="calc-checkbox">
                <input
                  type="checkbox"
                  checked={option.included ? true : value.seoOptionIds.includes(option.id)}
                  disabled={option.included}
                  onChange={() =>
                    onChange({
                      ...value,
                      seoOptionIds: toggle(value.seoOptionIds, option.id),
                    })
                  }
                />
                <span>
                  {seoLabel(option.id)}
                  <strong>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.included")}</strong>
                  {seoHint(option.id) ? <small>{seoHint(option.id)}</small> : null}
                </span>
              </label>
            ))}
          </div>
        </div>
      </details>

      <details className="calc-group">
        <summary>{t("controls.section04")}</summary>
        <div className="calc-group-content">
          {renderFeatureGroup(t("controls.leadCaptureLabel"), leadCaptureFeatures)}
          {renderFeatureGroup(t("controls.conversionLabel"), conversionFeatures)}
          {renderFeatureGroup(t("controls.advancedUxLabel"), advancedUxFeatures)}
        </div>
      </details>

      <details className="calc-group">
        <summary>{t("controls.section05")}</summary>
        <div className="calc-group-content">
          <label>{t("controls.contentLabel")}</label>
          <div className="calc-segment">
            {Object.entries(CONTENT_OPTIONS).map(([id, option]) => (
              <button
                key={id}
                type="button"
                className={value.contentOption === id ? "active" : ""}
                onClick={() => onChange({ ...value, contentOption: id as ContentOption })}
              >
                {t(`options.content.${id}` as never)}
                <small>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.includedLower")}</small>
              </button>
            ))}
          </div>

          <label>{t("controls.timelineLabel")}</label>
          <div className="calc-segment">
            {Object.entries(TIMELINE_OPTIONS).map(([id, option]) => (
              <button
                key={id}
                type="button"
                className={value.timeline === id ? "active" : ""}
                onClick={() => onChange({ ...value, timeline: id as TimelineOption })}
              >
                {t(`options.timeline.${id}.label` as never)}
                <small>{formatPercent(option.percent)}</small>
              </button>
            ))}
          </div>
          <p className="calc-note">{t("controls.timelineHint")}</p>
        </div>
      </details>

      {previewDesign ? (
        <div
          className="calc-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={t("controls.designExamplesTitle")}
          onClick={() => setPreviewDesign(null)}
        >
          <div className="calc-modal" onClick={(event) => event.stopPropagation()}>
            <div className="calc-modal-head">
              <h4>{t(`options.design.${previewDesign}.label` as never)}</h4>
              <button
                type="button"
                className="calc-modal-close"
                onClick={() => setPreviewDesign(null)}
                aria-label={t("controls.modalClose")}
              >
                {t("controls.modalClose")}
              </button>
            </div>
            <div className="calc-preview-grid">
              {DESIGN_PREVIEW_CONFIG[previewDesign].map((item) => (
                <figure key={item.src + item.caption} className="calc-preview-card">
                  <img src={item.src} alt={item.caption} />
                  <figcaption>{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
