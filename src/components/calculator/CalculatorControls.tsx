"use client";

import type { Locale } from "@/constants/locales";
import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Code2, Component, LayoutTemplate, ShoppingCart } from "lucide-react";
import type {
  CalculatorInput,
  DesignComplexity,
  LanguageOption,
  ProjectType,
} from "@/types/pricing";
import type { CalculatorConfig } from "@/types/calculator-config";
import { FEATURE_PACKAGES, type FeaturePackage } from "@/constants/calculator-config";
import { formatEur as formatEurRaw, formatPercent } from "@/lib/shared/format-eur";
import { OptionCard } from "./OptionCard";

// Five questions, radio-only, all open. The previous shape — five collapsed
// <details> holding 10 control groups, 27 checkboxes and a page slider — asked
// for ~48 decisions, and the four price drivers (type, volume, design,
// languages) already explain most of the spread; the rest fits inside the
// the margin the estimate already declares. Everything that used to be a
// checkbox now lives behind FEATURE_PACKAGES or in the brief.
const GROUP_CLASS =
  "border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] overflow-hidden " +
  "[&>h3]:m-0 [&>h3]:px-5 [&>h3]:py-4 " +
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

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={GROUP_CLASS}>
      <h3>{title}</h3>
      <div className={GROUP_CONTENT_CLASS}>{children}</div>
    </section>
  );
}

/** Set equality for the id lists a package applies. Order is irrelevant. */
const sameIds = (a: string[], b: string[]) =>
  a.length === b.length && a.every((id) => b.includes(id));

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
  const locale = useLocale() as Locale;
  const formatEur = (n: number) => formatEurRaw(n, locale);

  // Volume presets replace the range slider: dragging asks the visitor to
  // decide a number, five buttons ask them to recognise themselves. Derived
  // from the live config so a Sanity edit (or a new project type) keeps working.
  const pagePresets = useMemo(() => {
    if (!projectConfig) return [];
    const { min, max, included } = projectConfig.pages;
    const span = Math.max(0, max - included);
    const candidates = [
      min,
      included,
      included + Math.round(span / 3),
      included + Math.round((span * 2) / 3),
      max,
    ];
    return [...new Set(candidates)]
      .filter((n) => n >= min && n <= max)
      .sort((a, b) => a - b);
  }, [projectConfig]);

  const packagePrice = (pkg: FeaturePackage) => {
    const sum = (ids: string[], options: { key: string; price: number }[]) =>
      options.filter((o) => ids.includes(o.key)).reduce((total, o) => total + o.price, 0);
    return (
      sum(pkg.cmsUpgradeIds, config.cmsUpgrades) +
      sum(pkg.seoOptionIds, config.seoOptions) +
      sum(pkg.featureIds, config.features)
    );
  };

  const activePackage =
    FEATURE_PACKAGES.find(
      (pkg) =>
        sameIds(pkg.cmsUpgradeIds, value.cmsUpgradeIds) &&
        sameIds(pkg.seoOptionIds, value.seoOptionIds) &&
        sameIds(pkg.featureIds, value.featureIds),
    )?.key ?? "standard";

  const setProjectType = (projectType: ProjectType) => {
    const defaults = config.projectTypes.find((p) => p.key === projectType);
    if (!defaults) return;
    onChange({ ...value, projectType, pages: defaults.pages.defaultValue });
  };

  const applyPackage = (pkg: FeaturePackage) =>
    onChange({
      ...value,
      cmsUpgradeIds: [...pkg.cmsUpgradeIds],
      seoOptionIds: [...pkg.seoOptionIds],
      featureIds: [...pkg.featureIds],
    });

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
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center min-h-11 border border-line bg-transparent text-ink-dim rounded-full px-3 py-[7px] text-[11px] tracking-[0.08em] uppercase cursor-pointer font-mono transition-[border-color,color,background] duration-200 hover:border-line-strong hover:text-ink"
          onClick={onReset}
        >
          {t("controls.resetBtn")}
        </button>
      </div>

      <Question title={t("controls.q01")}>
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
      </Question>

      <Question title={t("controls.q02")}>
        <div className="flex flex-col gap-[6px] text-[13px] text-ink">
          {pageLabel}
          <span className={NOTE_CLASS}>{pageHelp}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 md-wide:grid-cols-5">
          {pagePresets.map((count) => {
            const extra =
              Math.max(0, count - projectConfig.pages.included) *
              projectConfig.pages.extraPrice;
            return (
              <button
                key={count}
                type="button"
                className={`${SEG_BTN_CLASS} ${value.pages === count ? SEG_BTN_ACTIVE_CLASS : ""}`}
                onClick={() => onChange({ ...value, pages: count })}
              >
                {count}
                <small>{extra > 0 ? `+${formatEur(extra)}` : t("controls.includedLower")}</small>
              </button>
            );
          })}
        </div>
        <p className={NOTE_CLASS}>{includedTpl}</p>
      </Question>

      <Question title={t("controls.q03")}>
        {/*
          Same card as the project types and the packages, deliberately: the
          hint reads as visible copy instead of hiding behind an info tooltip,
          which is what an option has to do to be answerable in one click — and
          an <InfoHint> here would nest a <button> inside a <button>.
        */}
        <div className="grid grid-cols-1 gap-[10px] md-wide:grid-cols-3">
          {config.design.map((option) => (
            <OptionCard
              key={option.key}
              title={option.label}
              description={option.hint}
              priceLabel={formatPercent(option.percent)}
              selected={value.designComplexity === option.key}
              onClick={() =>
                onChange({ ...value, designComplexity: option.key as DesignComplexity })
              }
            />
          ))}
        </div>
      </Question>

      <Question title={t("controls.q04")}>
        <div className="grid grid-cols-1 gap-[10px] md-wide:grid-cols-2">
          {FEATURE_PACKAGES.map((pkg) => {
            const price = packagePrice(pkg);
            return (
              <OptionCard
                key={pkg.key}
                title={t(`controls.packages.${pkg.key}.label` as never)}
                description={t(`controls.packages.${pkg.key}.hint` as never)}
                priceLabel={price > 0 ? `+${formatEur(price)}` : t("controls.includedLower")}
                selected={activePackage === pkg.key}
                onClick={() => applyPackage(pkg)}
              />
            );
          })}
        </div>
        <p className={NOTE_CLASS}>{t("controls.packagesComplexNote")}</p>
      </Question>

      <Question title={t("controls.q05")}>
        <div className="grid grid-cols-2 gap-2 md-wide:grid-cols-4">
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
      </Question>
    </div>
  );
}
