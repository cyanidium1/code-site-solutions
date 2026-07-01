"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Code2,
  Component,
  LayoutTemplate,
  ShoppingCart,
  Search,
  Database,
} from "lucide-react";
import type {
  CalculatorInput,
  ContentOption,
  DesignComplexity,
  LanguageOption,
  ProductComplexity,
  ProjectType,
  TimelineOption,
} from "@/types/pricing";
import type { CalculatorConfig } from "@/types/calculator-config";
import { formatEur as formatEurRaw, formatPercent } from "@/lib/shared/format-eur";
import { OptionCard } from "./OptionCard";
import { H3, InfoHint } from "@/components/ui";

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

const SEG_BTN_CLASS =
  "border border-line rounded-[12px] bg-transparent text-ink-dim text-left " +
  "px-[14px] py-[11px] text-[13px] cursor-pointer min-h-[50px] " +
  "transition-[border-color,color,background] duration-200 " +
  "hover:border-line-strong hover:text-ink " +
  "[&_small]:block [&_small]:text-accent-soft [&_small]:mt-1 [&_small]:text-[11px]";

const SEG_BTN_ACTIVE_CLASS =
  "border-accent-55 !bg-accent-12 !text-ink " +
  "shadow-[inset_0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.25)]";

const CHECKBOX_CLASS =
  "flex gap-[10px] items-start border border-line rounded-[12px] px-3 py-[10px] " +
  "transition-[border-color] duration-200 hover:border-line-strong " +
  "[&>input]:mt-[3px] [&>input]:accent-[var(--color-accent)] " +
  "[&>span]:grid [&>span]:gap-1 [&>span]:text-[13px] " +
  "[&_strong]:inline-block [&_strong]:text-accent-soft [&_strong]:text-[12px]";

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
  config: CalculatorConfig;
  value: CalculatorInput;
  onChange: (next: CalculatorInput) => void;
  /** Restores the basic setup and clears the persisted state. */
  onReset: () => void;
};

export function CalculatorControls({ config, value, onChange, onReset }: CalculatorControlsProps) {
  const projectConfig = config.projectTypes.find((p) => p.key === value.projectType);
  const t = useTranslations("Calculator");
  const locale = useLocale() as "uk" | "en";
  const formatEur = (n: number) => formatEurRaw(n, locale);

  const leadCaptureFeatures = useMemo(
    () => config.features.filter((f) => f.group === "leadCapture"),
    [config.features],
  );
  const conversionFeatures = useMemo(
    () => config.features.filter((f) => f.group === "conversion"),
    [config.features],
  );
  const advancedUxFeatures = useMemo(
    () => config.features.filter((f) => f.group === "advancedUx"),
    [config.features],
  );

  const setProjectType = (projectType: ProjectType) => {
    const defaults = config.projectTypes.find((p) => p.key === projectType);
    if (!defaults) return;
    onChange({
      ...value,
      projectType,
      pages: defaults.pages.defaultValue,
      productComplexity: "simple",
    });
  };

  const toggle = (source: string[], id: string) =>
    source.includes(id) ? source.filter((v) => v !== id) : [...source, id];

  const renderFeatureGroup = (title: string, items: typeof config.features) => (
    <>
      <label className="flex flex-col gap-[6px] text-[13px] text-ink">{title}</label>
      <div className="grid gap-[10px] grid-cols-1 md-wide:grid-cols-2 xl:grid-cols-3">
        {items.map((option) => (
          <label key={option.key} className={CHECKBOX_CLASS}>
            <input
              type="checkbox"
              checked={option.included ? true : value.featureIds.includes(option.key)}
              disabled={option.included}
              onChange={() =>
                onChange({ ...value, featureIds: toggle(value.featureIds, option.key) })
              }
            />
            <span>
              <span className="inline-flex items-center gap-[5px]">
                {option.label}
                <InfoHint text={option.hint} />
              </span>
              <strong>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.included")}</strong>
            </span>
          </label>
        ))}
      </div>
    </>
  );

  if (!projectConfig) return null;

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
    <div id="calc-controls" className="flex flex-col gap-[14px]">
      <div className="mt-2 mb-1">
        <div className="flex flex-wrap items-center justify-between gap-2 md-wide:flex-nowrap md-wide:gap-3">
          <H3 variant="calc-intro">{t("controls.customizeTitle")}</H3>
          <button
            type="button"
            className="inline-flex items-center min-h-11 border border-line bg-transparent text-ink-dim rounded-full px-3 py-[7px] text-[11px] tracking-[0.08em] uppercase cursor-pointer font-mono transition-[border-color,color,background] duration-200 hover:border-line-strong hover:text-ink"
            onClick={onReset}
          >
            {t("controls.resetBtn")}
          </button>
        </div>
        <p className="m-0 mt-[6px] text-ink-3 text-[13px] leading-[1.5]">{t("controls.customizeNote")}</p>
      </div>

      <details open className={GROUP_CLASS}>
        <summary>{t("controls.section01")}</summary>
        <div className={GROUP_CONTENT_CLASS}>
          <div className="grid grid-cols-1 gap-[10px] md-wide:grid-cols-3">
            {config.projectTypes.map((item) => (
              <OptionCard
                key={item.key}
                title={item.label}
                description={item.hint}
                priceLabel={t("controls.fromPriceTpl", { price: formatEur(item.basePrice) })}
                selected={value.projectType === item.key}
                onClick={() => setProjectType(item.key)}
              >
                <span className="inline-flex mt-2 text-accent-soft">
                  {item.key === "landing" ? (
                    <LayoutTemplate size={14} />
                  ) : item.key === "multiPage" ? (
                    <Code2 size={14} />
                  ) : item.key === "ecommerce" ? (
                    <ShoppingCart size={14} />
                  ) : (
                    <Component size={14} />
                  )}
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

          {(projectConfig.hasProductComplexity ?? projectConfig.key === "ecommerce") ? (
            <>
              <label className="flex flex-col gap-[6px] text-[13px] text-ink">{t("controls.productStructLabel")}</label>
              <div className="grid grid-cols-1 gap-2 md-wide:grid-cols-2">
                {config.productComplexity.map((option) => (
                  <div
                    key={option.key}
                    role="button"
                    tabIndex={0}
                    className={`${SEG_BTN_CLASS} ${value.productComplexity === option.key ? SEG_BTN_ACTIVE_CLASS : ""}`}
                    onClick={() => onChange({ ...value, productComplexity: option.key as ProductComplexity })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onChange({ ...value, productComplexity: option.key as ProductComplexity });
                      }
                    }}
                  >
                    <span className="inline-flex items-center gap-[5px]">
                      {option.label}
                      <InfoHint text={option.hint} />
                    </span>
                    <small>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.includedLower")}</small>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </details>

      <details open className={GROUP_CLASS}>
        <summary>{t("controls.section02")}</summary>
        <div className={GROUP_CONTENT_CLASS}>
          <label className="flex flex-col gap-[6px] text-[13px] text-ink">{t("controls.designLabel")}</label>
          <div className="grid grid-cols-1 gap-2 md-wide:grid-cols-2 xl:grid-cols-3">
            {config.design.map((option) => {
              const isActive = value.designComplexity === option.key;
              return (
                <div
                  key={option.key}
                  className={
                    "relative border rounded-[12px] px-3 py-[11px] grid gap-[7px] cursor-pointer " +
                    "transition-[border-color,background,box-shadow] duration-200 " +
                    (isActive
                      ? "border-accent-55 !bg-accent-12 shadow-[inset_0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.25)]"
                      : "border-line bg-[oklch(0.18_0.008_300)] hover:border-line-strong hover:bg-[oklch(0.19_0.01_300)]")
                  }
                  role="button"
                  tabIndex={0}
                  onClick={() => onChange({ ...value, designComplexity: option.key as DesignComplexity })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onChange({ ...value, designComplexity: option.key as DesignComplexity });
                    }
                  }}
                >
                  <span className="flex justify-between gap-2 items-center">
                    <span className="inline-flex items-center gap-[5px] text-ink text-[13px] font-semibold">
                      {option.label}
                      <InfoHint text={option.hint} />
                    </span>
                    <small className="text-accent-soft text-[11px]">{formatPercent(option.percent)}</small>
                  </span>
                </div>
              );
            })}
          </div>

          <label className="flex flex-col gap-[6px] text-[13px] text-ink">{t("controls.langLabel")}</label>
          <div className="grid grid-cols-1 gap-2 md-wide:grid-cols-2">
            {config.languages.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`${SEG_BTN_CLASS} ${value.languages === option.key ? SEG_BTN_ACTIVE_CLASS : ""}`}
                onClick={() => onChange({ ...value, languages: option.key as LanguageOption })}
              >
                {option.label}
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
          <div className="grid gap-[10px] grid-cols-1 md-wide:grid-cols-2 xl:grid-cols-3">
            {config.cmsUpgrades.map((option) => (
              <label key={option.key} className={CHECKBOX_CLASS}>
                <input
                  type="checkbox"
                  checked={option.included ? true : value.cmsUpgradeIds.includes(option.key)}
                  disabled={option.included}
                  onChange={() =>
                    onChange({
                      ...value,
                      cmsUpgradeIds: toggle(value.cmsUpgradeIds, option.key),
                    })
                  }
                />
                <span>
                  <span className="inline-flex items-center gap-[5px]">
                    {option.label}
                    <InfoHint text={option.hint} />
                  </span>
                  <strong>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.included")}</strong>
                </span>
              </label>
            ))}
          </div>

          <label className="inline-flex items-center gap-[6px] text-[12px] text-ink-dim">
            <Search size={14} /> {t("controls.seoSubgroup")}
          </label>
          <div className="grid gap-[10px] grid-cols-1 md-wide:grid-cols-2 xl:grid-cols-3">
            {config.seoOptions.map((option) => (
              <label key={option.key} className={CHECKBOX_CLASS}>
                <input
                  type="checkbox"
                  checked={option.included ? true : value.seoOptionIds.includes(option.key)}
                  disabled={option.included}
                  onChange={() =>
                    onChange({
                      ...value,
                      seoOptionIds: toggle(value.seoOptionIds, option.key),
                    })
                  }
                />
                <span>
                  <span className="inline-flex items-center gap-[5px]">
                    {option.label}
                    <InfoHint text={option.hint} />
                  </span>
                  <strong>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.included")}</strong>
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
          <div className="grid grid-cols-1 gap-2 md-wide:grid-cols-2">
            {config.contentOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`${SEG_BTN_CLASS} ${value.contentOption === option.key ? SEG_BTN_ACTIVE_CLASS : ""}`}
                onClick={() => onChange({ ...value, contentOption: option.key as ContentOption })}
              >
                {option.label}
                <small>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.includedLower")}</small>
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-[6px] text-[13px] text-ink">{t("controls.timelineLabel")}</label>
          <div className="grid grid-cols-1 gap-2 md-wide:grid-cols-2">
            {config.timeline.map((option) => (
              <div
                key={option.key}
                role="button"
                tabIndex={0}
                className={`${SEG_BTN_CLASS} ${value.timeline === option.key ? SEG_BTN_ACTIVE_CLASS : ""}`}
                onClick={() => onChange({ ...value, timeline: option.key as TimelineOption })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange({ ...value, timeline: option.key as TimelineOption });
                  }
                }}
              >
                <span className="inline-flex items-center gap-[5px]">
                  {option.label}
                  <InfoHint text={option.hint} />
                </span>
                <small>{option.price > 0 ? `+${formatEur(option.price)}` : t("controls.includedLower")}</small>
              </div>
            ))}
          </div>
          <p className={NOTE_CLASS}>{t("controls.timelineHint")}</p>
        </div>
      </details>
    </div>
  );
}
