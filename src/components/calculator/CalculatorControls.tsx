"use client";

import { useMemo, useState } from "react";
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
              {option.label}
              <strong>{option.price > 0 ? `+${formatEur(option.price)}` : "Included"}</strong>
              {option.hint ? <small>{option.hint}</small> : null}
            </span>
          </label>
        ))}
      </div>
    </>
  );

  return (
    <div className="calc-controls">
      <div className="calc-top-actions">
        <button type="button" className="calc-reset-btn" onClick={resetToBasicSetup}>
          Use basic setup
        </button>
      </div>

      <section className="calc-group calc-preset-section">
        <h3>Start with a recommended package</h3>
        <div className="calc-group-content">
          <p className="calc-note">Not sure what you need? Choose a preset and adjust it below.</p>
          <div className="calc-preset-grid">
            {PACKAGE_PRESETS.map((preset) => (
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
                  <em>{preset.badge}</em>
                </div>
                <strong>{preset.title}</strong>
                <small>Best for: {preset.bestFor}</small>
                <ul>
                  {preset.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span>{preset.estimatedRange}</span>
                <b>Use this package</b>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="calc-manual-intro">
        <h3>Customize your estimate</h3>
        <p>Use the recommended package as a starting point, or adjust the scope manually below.</p>
      </div>

      <details open className="calc-group">
        <summary>1. Project basics</summary>
        <div className="calc-group-content">
          <div className="calc-grid-3">
            {Object.entries(PROJECT_TYPE_CONFIG).map(([id, item]) => (
              <OptionCard
                key={id}
                title={item.label}
                description={item.hint}
                priceLabel={`from ${formatEur(item.basePrice)}`}
                selected={value.projectType === id}
                onClick={() => setProjectType(id as ProjectType)}
              >
                <span className="calc-project-icon">
                  {id === "landing" ? <LayoutTemplate size={14} /> : id === "multiPage" ? <Code2 size={14} /> : <ShoppingCart size={14} />}
                </span>
              </OptionCard>
            ))}
          </div>

          {value.projectType !== "landing" ? (
            <>
              <label htmlFor="calc-pages">
                {value.projectType === "ecommerce" ? "Content pages" : "Number of pages"}
                <span className="calc-help">
                  {value.projectType === "ecommerce"
                    ? "Product pages are handled by store structure. This counts static pages like Home, About, Contact, Delivery, Terms."
                    : "Not sure how many pages you need? Usually a business website starts with Home, Services, About, Cases, Blog, Contact."}
                </span>
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
              <p className="calc-note">
                Included pages: {projectConfig.pages.included}. Each extra page adds {formatEur(projectConfig.pages.extraPrice)}.
              </p>
            </>
          ) : (
            <>
              <label htmlFor="calc-pages">
                Number of sections
                <span className="calc-help">
                  Typical landing page includes 6-8 sections: hero, benefits, services, process, cases, FAQ, and CTA.
                </span>
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
              <p className="calc-note">
                Included sections: {projectConfig.pages.included}. Each extra section adds{" "}
                {formatEur(projectConfig.pages.extraPrice)}.
              </p>
            </>
          )}

          {value.projectType === "ecommerce" ? (
            <>
              <label>Product structure complexity</label>
              <div className="calc-segment">
                {Object.entries(PRODUCT_COMPLEXITY_OPTIONS).map(([id, option]) => (
                  <button
                    key={id}
                    type="button"
                    className={value.productComplexity === id ? "active" : ""}
                    onClick={() => onChange({ ...value, productComplexity: id as ProductComplexity })}
                  >
                    {option.label}
                    <small>{option.price > 0 ? `+${formatEur(option.price)}` : "included"}</small>
                  </button>
                ))}
              </div>
              <p className="calc-note">{PRODUCT_COMPLEXITY_OPTIONS[value.productComplexity].hint}</p>
            </>
          ) : null}
        </div>
      </details>

      <details open className="calc-group">
        <summary>2. Design & languages</summary>
        <div className="calc-group-content">
          <label>Design complexity</label>
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
                  <span>{option.label}</span>
                  <small>{formatPercent(option.percent)}</small>
                </span>
                <span className="calc-design-description">{option.hint}</span>
                <button
                  type="button"
                  className="calc-design-link"
                  onClick={(event) => {
                    event.stopPropagation();
                    setPreviewDesign(id as DesignComplexity);
                  }}
                >
                  View examples →
                </button>
              </div>
            ))}
          </div>
          <p className="calc-note">{DESIGN_COMPLEXITY_OPTIONS[value.designComplexity].hint}</p>

          <label>Multilingual support</label>
          <div className="calc-segment">
            {Object.entries(LANGUAGE_OPTIONS).map(([id, option]) => (
              <button
                key={id}
                type="button"
                className={value.languages === id ? "active" : ""}
                onClick={() => onChange({ ...value, languages: id as LanguageOption })}
              >
                {option.label}
                <small>{formatPercent(option.percent)}</small>
              </button>
            ))}
          </div>
          <p className="calc-note">
            Each language requires its own SEO structure, content, and CMS setup.
          </p>
          <p className="calc-note">Translations themselves can be handled separately if the client provides content.</p>
        </div>
      </details>

      <details className="calc-group">
        <summary>3. CMS & SEO</summary>
        <div className="calc-group-content">
          <label className="calc-subgroup-title">
            <Database size={14} /> CMS / content management
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
                  {option.label}
                  <strong>{option.price > 0 ? `+${formatEur(option.price)}` : "Included"}</strong>
                  {option.hint ? <small>{option.hint}</small> : null}
                </span>
              </label>
            ))}
          </div>

          <label className="calc-subgroup-title">
            <Search size={14} /> SEO architecture
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
                  {option.label}
                  <strong>{option.price > 0 ? `+${formatEur(option.price)}` : "Included"}</strong>
                  {option.hint ? <small>{option.hint}</small> : null}
                </span>
              </label>
            ))}
          </div>
        </div>
      </details>

      <details className="calc-group">
        <summary>4. Features & integrations</summary>
        <div className="calc-group-content">
          {renderFeatureGroup("Lead capture", leadCaptureFeatures)}
          {renderFeatureGroup("Conversion & tracking", conversionFeatures)}
          {renderFeatureGroup("Product / advanced UX", advancedUxFeatures)}
        </div>
      </details>

      <details className="calc-group">
        <summary>5. Content & timeline</summary>
        <div className="calc-group-content">
          <label>Content / copywriting</label>
          <div className="calc-segment">
            {Object.entries(CONTENT_OPTIONS).map(([id, option]) => (
              <button
                key={id}
                type="button"
                className={value.contentOption === id ? "active" : ""}
                onClick={() => onChange({ ...value, contentOption: id as ContentOption })}
              >
                {option.label}
                <small>{option.price > 0 ? `+${formatEur(option.price)}` : "included"}</small>
              </button>
            ))}
          </div>

          <label>Timeline / urgency</label>
          <div className="calc-segment">
            {Object.entries(TIMELINE_OPTIONS).map(([id, option]) => (
              <button
                key={id}
                type="button"
                className={value.timeline === id ? "active" : ""}
                onClick={() => onChange({ ...value, timeline: id as TimelineOption })}
              >
                {option.label}
                <small>{formatPercent(option.percent)}</small>
              </button>
            ))}
          </div>
          <p className="calc-note">
            Faster launches require parallel delivery, extra coordination, and priority production slots.
          </p>
        </div>
      </details>

      <div className="calc-recommended">
        <h4>Recommended setup for most businesses</h4>
        <p>Multi-page website, 5-8 pages, 2 languages, custom design.</p>
        <strong>Estimated: $4,500 - $7,000</strong>
      </div>

      {previewDesign ? (
        <div
          className="calc-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Design examples"
          onClick={() => setPreviewDesign(null)}
        >
          <div className="calc-modal" onClick={(event) => event.stopPropagation()}>
            <div className="calc-modal-head">
              <h4>{DESIGN_COMPLEXITY_OPTIONS[previewDesign].label} examples</h4>
              <button type="button" className="calc-modal-close" onClick={() => setPreviewDesign(null)} aria-label="Close examples">
                Close
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
