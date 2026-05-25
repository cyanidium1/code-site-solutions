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
} from "@/constants/calculator-config";
import type {
  CalculatorInput,
  ContentOption,
  DesignComplexity,
  LanguageOption,
  ProductComplexity,
  ProjectType,
  TimelineOption,
} from "@/types/pricing";
import { formatEur, formatPercent } from "@/lib/shared/format-eur";
import { OptionCard } from "./OptionCard";
import { basicSetupInput, inputForPreset } from "./presets";
import { H3 } from "@/components/ui";

// Shared class strings for the controls panel — extracted so each
// <details className="calc-group"> and its summary read short. The
// `+ / −` marker uses [&[open]>summary]:after:content because Tailwind
// has no built-in details-marker handling.
const GROUP_CLASS =
  "border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] overflow-hidden " +
  "[&>summary]:list-none [&>summary]:m-0 [&>summary]:px-5 [&>summary]:py-4 " +
  "[&>summary]:text-[11px] [&>summary]:uppercase [&>summary]:tracking-[0.14em] " +
  "[&>summary]:text-ink-3 [&>summary]:border-b [&>summary]:border-line " +
  "[&>summary]:cursor-pointer [&>summary]:select-none " +
  "[&>summary::-webkit-details-marker]:hidden " +
  "[&>summary]:after:content-['+'] [&>summary]:after:float-right " +
  "[&>summary]:after:text-accent-soft [&>summary]:after:text-sm [&>summary]:after:leading-none " +
  "[&[open]>summary]:after:content-['−'] " +
  "[&>h3]:list-none [&>h3]:m-0 [&>h3]:px-5 [&>h3]:py-4 " +
  "[&>h3]:text-[11px] [&>h3]:uppercase [&>h3]:tracking-[0.14em] " +
  "[&>h3]:text-ink-3 [&>h3]:border-b [&>h3]:border-line [&>h3]:font-normal";

const GROUP_CONTENT_CLASS = "px-5 py-[18px] flex flex-col gap-[14px]";

const NOTE_CLASS = "text-ink-3 text-[12px] leading-[1.5]";

// Segment-button group used 4× in the form. Active state is appended via
// template literal at the call site (legacy `.active` class). Tailwind
// can't address the parent's `.active` modifier directly without a data-
// attribute, so we keep the class string with a sibling override.
const SEG_BTN_CLASS =
  "border border-line rounded-[12px] bg-transparent text-ink-dim text-left " +
  "px-[14px] py-[11px] text-[13px] cursor-pointer min-h-[50px] " +
  "transition-[border-color,color,background] duration-200 " +
  "hover:border-line-strong hover:text-ink " +
  "[&_small]:block [&_small]:text-ink-3 [&_small]:mt-1 [&_small]:text-[11px]";

const SEG_BTN_ACTIVE_CLASS =
  "border-[oklch(from_var(--color-accent)_l_c_h_/_0.55)] bg-accent-12 !text-ink";

// Checkbox-card class used by CMS / SEO / Features groups. Children
// (input, span, strong, small) styled via descendant selectors.
const CHECKBOX_CLASS =
  "flex gap-[10px] items-start border border-line rounded-[12px] px-3 py-[10px] min-h-[88px] " +
  "transition-[border-color] duration-200 hover:border-line-strong " +
  "[&>input]:mt-[3px] [&>input]:accent-[var(--color-accent)] " +
  "[&>span]:grid [&>span]:gap-1 [&>span]:text-[13px] " +
  "[&_strong]:inline-block [&_strong]:text-accent-soft [&_strong]:text-[12px] " +
  "[&_small]:block [&_small]:mt-[3px] [&_small]:text-ink-3 [&_small]:text-[11px]";

// Range slider — vendor-prefixed thumb pseudo-elements use Tailwind 4
// arbitrary variants. The gradient track + glowing thumb match
// legacy .calc-range-input from calculator.css.
const RANGE_INPUT_CLASS =
  "appearance-none w-full h-[6px] rounded-full bg-[linear-gradient(90deg,var(--color-accent-soft),var(--color-accent))] outline-none cursor-pointer " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[oklch(0.99_0.01_290)] " +
  "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[oklch(from_var(--color-accent)_l_c_h_/_0.6)] " +
  "[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_oklch(from_var(--color-accent)_l_c_h_/_0.12),0_0_14px_oklch(from_var(--color-accent)_l_c_h_/_0.4)] " +
  "[&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:transition-[box-shadow,transform] [&::-webkit-slider-thumb]:duration-[180ms] " +
  "hover:[&::-webkit-slider-thumb]:shadow-[0_0_0_6px_oklch(from_var(--color-accent)_l_c_h_/_0.18),0_0_22px_oklch(from_var(--color-accent)_l_c_h_/_0.55)] " +
  "hover:[&::-webkit-slider-thumb]:scale-[1.06] " +
  "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full " +
  "[&::-moz-range-thumb]:bg-[oklch(0.99_0.01_290)] [&::-moz-range-thumb]:border-2 " +
  "[&::-moz-range-thumb]:border-[oklch(from_var(--color-accent)_l_c_h_/_0.6)] " +
  "[&::-moz-range-thumb]:shadow-[0_0_0_4px_oklch(from_var(--color-accent)_l_c_h_/_0.12),0_0_14px_oklch(from_var(--color-accent)_l_c_h_/_0.4)] " +
  "[&::-moz-range-thumb]:cursor-grab";

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
  const resetToBasicSetup = () => onChange(basicSetupInput(value));
  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const next = inputForPreset(value, presetId);
    if (next) onChange(next);
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
      <label className="flex flex-col gap-[6px] text-[13px] text-ink">{title}</label>
      <div className="grid gap-[10px] grid-cols-2 max-[760px]:grid-cols-1 xl:grid-cols-3">
        {items.map((option) => (
          <label key={option.id} className={CHECKBOX_CLASS}>
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
    <div className="flex flex-col gap-[14px]">
      <section className={`${GROUP_CLASS} overflow-hidden`}>
        <h3 className="font-display">{t("controls.presetTitle")}</h3>
        <div className={GROUP_CONTENT_CLASS}>
          <p className={NOTE_CLASS}>{t("controls.presetNote")}</p>
          <div className="grid grid-cols-1 gap-[14px] xl:grid-cols-3">
            {PACKAGE_PRESETS.map((preset) => {
              const includes = t.raw(`options.presets.${preset.id}.includes`) as string[];
              const isActive = selectedPreset === preset.id;
              const isRecommended = preset.id === "growthWebsite";
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={
                    "border rounded-[18px] p-[22px_22px_20px] text-left text-ink-dim cursor-pointer flex flex-col gap-3 min-h-[360px] " +
                    "transition-[border-color,transform,box-shadow] duration-[250ms] hover:border-line-strong hover:-translate-y-[2px] " +
                    "[&>strong]:text-ink [&>strong]:font-actay [&>strong]:text-[18px] [&>strong]:font-bold [&>strong]:tracking-[-0.01em] " +
                    "[&>small]:text-ink-3 [&>small]:text-[12.5px] [&>small]:leading-[1.5] " +
                    "[&>ul]:list-none [&>ul]:m-0 [&>ul]:p-0 [&>ul]:grid [&>ul]:gap-[6px] [&>ul]:text-[12.5px] [&>ul]:text-ink-dim " +
                    "[&>ul>li]:relative [&>ul>li]:pl-4 [&>ul>li]:leading-[1.45] " +
                    "[&>ul>li]:before:content-[''] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:top-[7px] " +
                    "[&>ul>li]:before:w-[6px] [&>ul>li]:before:h-[6px] [&>ul>li]:before:rounded-full [&>ul>li]:before:bg-accent-soft " +
                    "[&>b]:mt-1 [&>b]:border [&>b]:border-line [&>b]:rounded-full [&>b]:px-3 [&>b]:py-2 [&>b]:w-fit " +
                    "[&>b]:text-[10px] [&>b]:tracking-[0.1em] [&>b]:uppercase [&>b]:text-ink [&>b]:font-semibold " +
                    (isRecommended
                      ? "border-accent-40 bg-[linear-gradient(180deg,oklch(0.18_0.04_295)_0%,oklch(0.13_0.03_295)_100%)] shadow-[0_30px_60px_oklch(from_var(--color-accent)_l_c_h_/_0.18)] translate-y-0 hover:-translate-y-[2px] xl:-translate-y-[6px] xl:hover:-translate-y-[8px] [&>b]:bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] [&>b]:border-transparent [&>b]:text-[oklch(1_0_0_/_0.98)] "
                      : "bg-[oklch(0.16_0.005_300)] ") +
                    (isActive
                      ? "border-[oklch(from_var(--color-accent)_l_c_h_/_0.55)] shadow-[inset_0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.22)]"
                      : isRecommended
                        ? ""
                        : "border-line")
                  }
                  onClick={() => applyPreset(preset.id)}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] bg-accent-12 text-accent-soft">
                      {preset.id === "starterLanding" ? <Zap size={15} /> : preset.id === "growthWebsite" ? <Rocket size={15} /> : <Store size={15} />}
                    </span>
                    <em className="not-italic text-[10px] tracking-[0.1em] uppercase border border-line rounded-full px-[9px] py-1 text-ink-dim">
                      {t(`options.presets.${preset.id}.badge` as never)}
                    </em>
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
                  <span className="font-actay text-[22px] font-bold tracking-[-0.02em] bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent))] bg-clip-text text-transparent mt-auto">
                    {t(`options.presets.${preset.id}.estimatedRange` as never)}
                  </span>
                  <p className="m-0 px-3 py-[10px] border border-dashed border-line-strong rounded-[10px] bg-[oklch(0.14_0.005_300_/_0.6)] text-ink-3 text-[11.5px] leading-[1.45] italic">
                    {t(`controls.compareAnchors.${preset.id}` as never)}
                  </p>
                  <b>{t("controls.presetUse")}</b>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mt-2 mb-1">
        <div className="flex items-center justify-between gap-3 max-[760px]:flex-wrap max-[760px]:gap-2">
          <H3 variant="calc-intro">{t("controls.customizeTitle")}</H3>
          <button
            type="button"
            className="inline-flex items-center min-h-11 border border-line bg-transparent text-ink-dim rounded-full px-3 py-[7px] text-[11px] tracking-[0.08em] uppercase cursor-pointer font-mono transition-[border-color,color,background] duration-200 hover:border-line-strong hover:text-ink"
            onClick={resetToBasicSetup}
          >
            {t("controls.resetBtn")}
          </button>
        </div>
        <p className="m-0 mt-[6px] text-ink-3 text-[13px] leading-[1.5]">{t("controls.customizeNote")}</p>
      </div>

      <details open className={GROUP_CLASS}>
        <summary>{t("controls.section01")}</summary>
        <div className={GROUP_CONTENT_CLASS}>
          <div className="grid grid-cols-3 gap-[10px] max-[760px]:grid-cols-1">
            {Object.entries(PROJECT_TYPE_CONFIG).map(([id, item]) => (
              <OptionCard
                key={id}
                title={t(`options.project.${id}.label` as never)}
                description={t(`options.project.${id}.hint` as never)}
                priceLabel={t("controls.fromPriceTpl", { price: formatEur(item.basePrice) })}
                selected={value.projectType === id}
                onClick={() => setProjectType(id as ProjectType)}
              >
                <span className="inline-flex mt-2 text-accent-soft">
                  {id === "landing" ? <LayoutTemplate size={14} /> : id === "multiPage" ? <Code2 size={14} /> : <ShoppingCart size={14} />}
                </span>
              </OptionCard>
            ))}
          </div>

          <label htmlFor="calc-pages" className="flex flex-col gap-[6px] text-[13px] text-ink">
            {pageLabel}
            <span className={NOTE_CLASS}>{pageHelp}</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="calc-pages"
              className={RANGE_INPUT_CLASS}
              type="range"
              min={projectConfig.pages.min}
              max={projectConfig.pages.max}
              value={value.pages}
              onChange={(e) => onChange({ ...value, pages: Number(e.target.value) })}
            />
            <strong className="min-w-[36px] text-right text-accent-soft font-mono">{value.pages}</strong>
          </div>
          <div className="flex justify-between text-ink-3 text-[11px] -mt-[6px]">
            <span>{projectConfig.pages.min}</span>
            <span>{projectConfig.pages.max}</span>
          </div>
          <p className={NOTE_CLASS}>{includedTpl}</p>

          {value.projectType === "ecommerce" ? (
            <>
              <label className="flex flex-col gap-[6px] text-[13px] text-ink">{t("controls.productStructLabel")}</label>
              <div className="grid grid-cols-2 gap-2 max-[760px]:grid-cols-1">
                {Object.entries(PRODUCT_COMPLEXITY_OPTIONS).map(([id, option]) => (
                  <button
                    key={id}
                    type="button"
                    className={`${SEG_BTN_CLASS} ${value.productComplexity === id ? SEG_BTN_ACTIVE_CLASS : ""}`}
                    onClick={() => onChange({ ...value, productComplexity: id as ProductComplexity })}
                  >
                    {t(`options.product.${id}.label` as never)}
                    <small>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.includedLower")}</small>
                  </button>
                ))}
              </div>
              <p className={NOTE_CLASS}>{t(`options.product.${value.productComplexity}.hint` as never)}</p>
            </>
          ) : null}
        </div>
      </details>

      <details open className={GROUP_CLASS}>
        <summary>{t("controls.section02")}</summary>
        <div className={GROUP_CONTENT_CLASS}>
          <label className="flex flex-col gap-[6px] text-[13px] text-ink">{t("controls.designLabel")}</label>
          <div className="grid grid-cols-2 gap-2 max-[760px]:grid-cols-1 xl:grid-cols-3">
            {Object.entries(DESIGN_COMPLEXITY_OPTIONS).map(([id, option]) => {
              const isActive = value.designComplexity === id;
              return (
                <div
                  key={id}
                  className={
                    "group relative border rounded-[12px] bg-[oklch(0.18_0.008_300)] px-3 py-[11px] grid gap-[7px] cursor-pointer " +
                    "transition-[border-color,background,box-shadow] duration-200 overflow-hidden " +
                    "hover:border-line-strong hover:bg-[oklch(0.19_0.01_300)] " +
                    (isActive
                      ? "border-[oklch(from_var(--color-accent)_l_c_h_/_0.55)] shadow-[inset_0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.25)]"
                      : "border-line")
                  }
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
                  <span
                    className="absolute -right-2 -bottom-2 w-[82px] h-[56px] opacity-[0.16] [filter:blur(0.2px)_saturate(0.8)] transition-[opacity,transform] duration-200 group-hover:opacity-[0.28] group-hover:-translate-y-[2px]"
                    aria-hidden="true"
                  >
                    <img src={DESIGN_PREVIEW_CONFIG[id as DesignComplexity][0].src} alt="" className="w-full h-full object-cover rounded-lg" />
                  </span>
                  <span className="relative z-10 flex justify-between gap-2 items-center">
                    <span className="text-ink text-[13px] font-semibold">{t(`options.design.${id}.label` as never)}</span>
                    <small className="text-accent-soft text-[11px]">{formatPercent(option.percent)}</small>
                  </span>
                  <span className="relative z-10 text-ink-3 text-[11px] leading-[1.4]">
                    {t(`options.design.${id}.hint` as never)}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center min-h-11 border-none bg-transparent text-ink-3 p-0 text-[11px] text-left underline underline-offset-2 cursor-pointer w-fit relative z-10 hover:text-ink"
                    onClick={(event) => {
                      event.stopPropagation();
                      setPreviewDesign(id as DesignComplexity);
                    }}
                  >
                    {t("controls.viewExamples")}
                  </button>
                </div>
              );
            })}
          </div>
          <p className={NOTE_CLASS}>{t(`options.design.${value.designComplexity}.hint` as never)}</p>

          <label className="flex flex-col gap-[6px] text-[13px] text-ink">{t("controls.langLabel")}</label>
          <div className="grid grid-cols-2 gap-2 max-[760px]:grid-cols-1">
            {Object.entries(LANGUAGE_OPTIONS).map(([id, option]) => (
              <button
                key={id}
                type="button"
                className={`${SEG_BTN_CLASS} ${value.languages === id ? SEG_BTN_ACTIVE_CLASS : ""}`}
                onClick={() => onChange({ ...value, languages: id as LanguageOption })}
              >
                {t(`options.language.${id}` as never)}
                <small>{formatPercent(option.percent)}</small>
              </button>
            ))}
          </div>
          <p className={NOTE_CLASS}>{t("controls.langNoteSeo")}</p>
          <p className={NOTE_CLASS}>{t("controls.langNoteTranslations")}</p>
        </div>
      </details>

      <details className={GROUP_CLASS}>
        <summary>{t("controls.section03")}</summary>
        <div className={GROUP_CONTENT_CLASS}>
          <label className="inline-flex items-center gap-[6px] text-[12px] text-ink-dim">
            <Database size={14} /> {t("controls.cmsSubgroup")}
          </label>
          <div className="grid gap-[10px] grid-cols-2 max-[760px]:grid-cols-1 xl:grid-cols-3">
            {CMS_UPGRADES.map((option) => (
              <label key={option.id} className={CHECKBOX_CLASS}>
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

          <label className="inline-flex items-center gap-[6px] text-[12px] text-ink-dim">
            <Search size={14} /> {t("controls.seoSubgroup")}
          </label>
          <div className="grid gap-[10px] grid-cols-2 max-[760px]:grid-cols-1 xl:grid-cols-3">
            {SEO_OPTIONS.map((option) => (
              <label key={option.id} className={CHECKBOX_CLASS}>
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

      <details className={GROUP_CLASS}>
        <summary>{t("controls.section04")}</summary>
        <div className={GROUP_CONTENT_CLASS}>
          {renderFeatureGroup(t("controls.leadCaptureLabel"), leadCaptureFeatures)}
          {renderFeatureGroup(t("controls.conversionLabel"), conversionFeatures)}
          {renderFeatureGroup(t("controls.advancedUxLabel"), advancedUxFeatures)}
        </div>
      </details>

      <details className={GROUP_CLASS}>
        <summary>{t("controls.section05")}</summary>
        <div className={GROUP_CONTENT_CLASS}>
          <label className="flex flex-col gap-[6px] text-[13px] text-ink">{t("controls.contentLabel")}</label>
          <div className="grid grid-cols-2 gap-2 max-[760px]:grid-cols-1">
            {Object.entries(CONTENT_OPTIONS).map(([id, option]) => (
              <button
                key={id}
                type="button"
                className={`${SEG_BTN_CLASS} ${value.contentOption === id ? SEG_BTN_ACTIVE_CLASS : ""}`}
                onClick={() => onChange({ ...value, contentOption: id as ContentOption })}
              >
                {t(`options.content.${id}` as never)}
                <small>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.includedLower")}</small>
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-[6px] text-[13px] text-ink">{t("controls.timelineLabel")}</label>
          <div className="grid grid-cols-2 gap-2 max-[760px]:grid-cols-1">
            {Object.entries(TIMELINE_OPTIONS).map(([id, option]) => (
              <button
                key={id}
                type="button"
                className={`${SEG_BTN_CLASS} ${value.timeline === id ? SEG_BTN_ACTIVE_CLASS : ""}`}
                onClick={() => onChange({ ...value, timeline: id as TimelineOption })}
              >
                {t(`options.timeline.${id}.label` as never)}
                <small>{formatPercent(option.percent)}</small>
              </button>
            ))}
          </div>
          <p className={NOTE_CLASS}>{t("controls.timelineHint")}</p>
        </div>
      </details>

      {previewDesign ? (
        <div
          className="fixed inset-0 z-[120] bg-[oklch(0_0_0_/_0.58)] backdrop-blur-[3px] flex items-center justify-center p-[18px]"
          role="dialog"
          aria-modal="true"
          aria-label={t("controls.designExamplesTitle")}
          onClick={() => setPreviewDesign(null)}
        >
          <div
            className="w-[min(980px,100%)] border border-line rounded-2xl bg-[oklch(0.15_0.005_300)] p-[14px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 mb-[10px]">
              <h4 className="m-0 text-[14px]">{t(`options.design.${previewDesign}.label` as never)}</h4>
              <button
                type="button"
                className="inline-flex items-center min-h-11 border border-line rounded-full bg-transparent text-ink-dim px-3 py-[7px] cursor-pointer"
                onClick={() => setPreviewDesign(null)}
                aria-label={t("controls.modalClose")}
              >
                {t("controls.modalClose")}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-[10px] max-[760px]:grid-cols-1">
              {DESIGN_PREVIEW_CONFIG[previewDesign].map((item) => (
                <figure
                  key={item.src + item.caption}
                  className="m-0 border border-line rounded-[12px] overflow-hidden bg-[oklch(0.18_0.008_300)]"
                >
                  <img src={item.src} alt={item.caption} className="block w-full h-auto" />
                  <figcaption className="px-[10px] py-2 text-[12px] text-ink-3">{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
