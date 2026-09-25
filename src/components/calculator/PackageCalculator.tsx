"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Minus, Plus } from "lucide-react";

import type { Locale } from "@/constants/locales";
import { localizePath } from "@/constants/i18n-routes";
import {
  ADDONS,
  INDUSTRIES,
  INDUSTRY_ORDER,
  PACKAGE_ADDONS,
  PACKAGES,
  estimate,
  formatAddonPrice,
  formatDays,
  formatPackageTerm,
  industryPrice,
  packagePrice,
  showsUahHint,
  uahApprox,
  type AddonId,
  type EstimateInput,
  type EstimateResult,
  type IndustryId,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import { CALCULATOR_UI, type CalculatorUi } from "@/content/calculator-ui";
import { LeadForm } from "@/components/blocks/lead-form";
import {
  hpH2Class,
  hpInnerClass,
  hpSectionClass,
  hpSubClass,
} from "@/components/homepage/shared";
import { cn } from "@/components/ui";
import { OptionCard } from "./OptionCard";

type Pkg = EstimateInput["pkg"];
const PACKAGE_CHOICES: Pkg[] = ["landing", "business", "shop", "industry"];

const STEP_LABEL =
  "m-0 mb-1 font-mono text-[12px] uppercase tracking-[0.06em] text-accent-soft";
const STEP_HINT = "m-0 mb-4 text-[13px] leading-[1.5] text-ink-3";

const CHIP =
  "inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-ink-dim cursor-pointer " +
  "transition-[border-color,background-color,color] duration-200 hover:border-line-strong";
const CHIP_ON = "border-accent-55 bg-accent-12 text-ink";

const BTN_PRIMARY =
  "inline-flex w-full items-center justify-center rounded-full border-none " +
  "bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.98)] " +
  "px-[18px] py-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.06em] no-underline cursor-pointer " +
  "shadow-[0_6px_18px_oklch(from_var(--color-accent)_l_c_h_/_0.3)] transition-[transform,box-shadow] duration-200 " +
  "hover:-translate-y-[1px] hover:shadow-[0_10px_24px_oklch(from_var(--color-accent)_l_c_h_/_0.4)] " +
  "focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2";

const FORM_ID = "calc-lead-form";

/** Plain-text configuration for the lead form's hidden `config` field. */
function buildConfigText(
  input: EstimateInput,
  result: EstimateResult,
  locale: Locale,
  ui: CalculatorUi,
): string {
  const f = (n: number) => formatPrice(n, { locale });
  const pkgName =
    input.pkg === "industry"
      ? `${PACKAGES.industry.name[locale]} · ${INDUSTRIES[input.industry ?? "medicine"].name[locale]}`
      : PACKAGES[input.pkg].name[locale];
  const lines = [`${ui.configPackage}: ${pkgName} — ${f(result.packagePrice)}`];
  for (const l of result.lines) {
    const qty = l.qty > 1 ? ` ×${l.qty}` : "";
    lines.push(`+ ${ADDONS[l.id].name[locale]}${qty} — ${f(l.amount)}`);
  }
  if (result.rushFee) lines.push(`+ ${ADDONS.rush.name[locale]} — ${f(result.rushFee)}`);
  lines.push(`${ui.configTotal}: ${f(result.total)} · ${formatDays(result.days, locale)}`);
  return lines.join("\n");
}

export function PackageCalculator({
  locale,
  initialPkg = "business",
}: {
  locale: Locale;
  initialPkg?: Pkg;
}) {
  const ui = CALCULATOR_UI[locale];
  const [pkg, setPkg] = useState<Pkg>(initialPkg);
  const [industry, setIndustry] = useState<IndustryId>("medicine");
  const [addons, setAddons] = useState<Partial<Record<AddonId, number>>>({});
  const [barVisible, setBarVisible] = useState(false);

  // Preselect from ?tier= so package cards elsewhere can deep-link here.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tier");
    if (t && (PACKAGE_CHOICES as string[]).includes(t)) setPkg(t as Pkg);
  }, []);

  const input: EstimateInput = { pkg, industry, addons };
  const result = useMemo(
    () => estimate({ pkg, industry, addons }, locale),
    [pkg, industry, addons, locale],
  );
  const f = (n: number) => formatPrice(n, { locale });
  const available = PACKAGE_ADDONS[pkg];

  const toggle = (id: AddonId) =>
    setAddons((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = 1;
        for (const x of ADDONS[id].excludes ?? []) delete next[x];
      }
      return next;
    });
  const setQty = (id: AddonId, qty: number) =>
    setAddons((prev) => {
      const max = ADDONS[id].maxQty ?? 1;
      const q = Math.max(0, Math.min(max, qty));
      const next = { ...prev };
      if (q === 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const lockPrice = () =>
    document.getElementById(FORM_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // The phone bar shows only while the controls are on screen and the
  // summary is not — so it never covers the form or the footer.
  useEffect(() => {
    const controls = document.getElementById("calc-controls");
    const summaryEl = document.getElementById("calc-summary");
    if (!controls || !summaryEl) return;
    let controlsIn = false;
    let summaryIn = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === controls) controlsIn = e.isIntersecting;
        if (e.target === summaryEl) summaryIn = e.isIntersecting;
      }
      setBarVisible(controlsIn && !summaryIn);
    });
    io.observe(controls);
    io.observe(summaryEl);
    return () => io.disconnect();
  }, []);

  const summary = (
    <aside
      id="calc-summary"
      className="xl:sticky xl:top-24 flex flex-col gap-4 rounded-card border border-line-strong bg-[oklch(0.15_0.006_300)] p-5 md:p-6"
    >
      <p className={STEP_LABEL}>{ui.step3}</p>
      <dl className="m-0 flex flex-col gap-2 text-[13.5px]">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-dim">
            {ui.packageLine}:{" "}
            {pkg === "industry"
              ? INDUSTRIES[industry].name[locale]
              : PACKAGES[pkg].name[locale]}
          </dt>
          <dd className="m-0 text-ink tabular-nums">{f(result.packagePrice)}</dd>
        </div>
        {result.lines.map((l) => (
          <div key={l.id} className="flex justify-between gap-3">
            <dt className="text-ink-dim">
              {ADDONS[l.id].name[locale]}
              {l.qty > 1 ? ` ×${l.qty}` : ""}
            </dt>
            <dd className="m-0 text-ink tabular-nums">+{f(l.amount)}</dd>
          </div>
        ))}
        {result.rushFee ? (
          <div className="flex justify-between gap-3">
            <dt className="text-ink-dim">{ui.rushNote}</dt>
            <dd className="m-0 text-ink tabular-nums">+{f(result.rushFee)}</dd>
          </div>
        ) : null}
      </dl>
      <div className="border-t border-line pt-4">
        <div className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-3">{ui.total}</div>
        <div className="font-sans text-[34px] font-bold leading-none tracking-[-0.02em] tabular-nums bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent))] bg-clip-text text-transparent">
          {f(result.total)}
        </div>
        {showsUahHint(locale) ? (
          <div className="mt-1 text-[13px] text-ink-3 tabular-nums">{uahApprox(result.total)}</div>
        ) : null}
        <div className="mt-3 text-[14px] text-ink">
          <span className="text-ink-3">{ui.term}: </span>
          {formatDays(result.days, locale)}
        </div>
      </div>
      <button type="button" onClick={lockPrice} className={BTN_PRIMARY}>
        {ui.fix}
      </button>
      <p className="m-0 text-[12px] leading-[1.5] text-ink-3">{ui.fixNote}</p>
    </aside>
  );

  return (
    <>
      <section className={`${hpSectionClass} pt-12 pb-16 md-wide:pt-16 md-wide:pb-20`}>
        <div className={hpInnerClass}>
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div id="calc-controls" className="flex flex-col gap-10">
              <div>
                <p className={STEP_LABEL}>{ui.step1}</p>
                <p className={STEP_HINT}>{ui.step1Hint}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {PACKAGE_CHOICES.map((id) => (
                    <OptionCard
                      key={id}
                      title={PACKAGES[id].name[locale]}
                      priceLabel={formatPrice(packagePrice(id, locale), {
                        locale,
                        withPrefix: PACKAGES[id].fromPrice,
                      })}
                      description={formatPackageTerm(id, locale)}
                      selected={pkg === id}
                      onClick={() => setPkg(id)}
                    />
                  ))}
                </div>
                {pkg === "industry" ? (
                  <fieldset className="m-0 mt-4 border-0 p-0">
                    <legend className="mb-2 text-[13px] text-ink-dim">{ui.industryLabel}</legend>
                    <div className="flex flex-wrap gap-2">
                      {INDUSTRY_ORDER.map((id) => (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={industry === id}
                          onClick={() => setIndustry(id)}
                          className={cn(CHIP, industry === id && CHIP_ON)}
                        >
                          {INDUSTRIES[id].name[locale]}
                          <span className="text-accent-soft tabular-nums">
                            {f(industryPrice(id, locale))}
                          </span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ) : null}
              </div>

              <div>
                <p className={STEP_LABEL}>{ui.step2}</p>
                <p className={STEP_HINT}>{ui.step2Hint}</p>
                <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2">
                  {available.map((id) => {
                    const a = ADDONS[id];
                    const qty = addons[id] ?? 0;
                    const on = qty > 0;
                    return (
                      <li key={id}>
                        <label
                          className={cn(
                            "flex min-h-[52px] cursor-pointer items-center gap-3 rounded-card border border-line bg-[oklch(0.18_0.008_300)] px-[14px] py-[10px] transition-[border-color] duration-200 hover:border-line-strong",
                            on && "border-accent-55 bg-accent-12",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggle(id)}
                            className="h-4 w-4 shrink-0 accent-[var(--color-accent)]"
                          />
                          <span className="flex-1 text-[13.5px] leading-[1.35] text-ink">
                            {a.name[locale]}
                            <span className="block text-[12px] text-accent-soft">
                              {formatAddonPrice(id, locale)}
                            </span>
                          </span>
                          {on && a.kind === "perUnit" ? (
                            <span className="flex items-center gap-1">
                              <button
                                type="button"
                                aria-label={ui.qtyMinus}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setQty(id, qty - 1);
                                }}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-dim"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-5 text-center text-[13px] tabular-nums text-ink">{qty}</span>
                              <button
                                type="button"
                                aria-label={ui.qtyPlus}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setQty(id, qty + 1);
                                }}
                                disabled={qty >= (a.maxQty ?? 1)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-dim disabled:opacity-40"
                              >
                                <Plus size={14} />
                              </button>
                            </span>
                          ) : null}
                        </label>
                      </li>
                    );
                  })}
                </ul>
                {Object.keys(addons).length ? (
                  <button
                    type="button"
                    onClick={() => setAddons({})}
                    className="mt-3 border-0 bg-transparent p-0 text-[12.5px] text-ink-3 underline underline-offset-[3px] cursor-pointer hover:text-ink-dim"
                  >
                    {ui.reset}
                  </button>
                ) : null}
                <p className="mt-6 mb-0 text-[13.5px] text-ink-dim">
                  {ui.pricingLink}{" "}
                  <Link
                    href={localizePath("/pricing", locale)}
                    className="text-ink underline underline-offset-[3px]"
                  >
                    {ui.pricingLinkText}
                  </Link>
                </p>
              </div>
            </div>
            {summary}
          </div>
        </div>
      </section>

      <section id={FORM_ID} className={`${hpSectionClass} scroll-mt-20 pt-12 pb-20`}>
        <div className={`${hpInnerClass} max-w-[760px]`}>
          <h2 className={hpH2Class}>{ui.formTitle}</h2>
          <p className={`${hpSubClass} mb-8`}>{ui.formSub}</p>
          <LeadForm
            source={`calculator-${locale}`}
            locale={locale}
            tier={pkg}
            config={buildConfigText(input, result, locale, ui)}
          />
        </div>
      </section>

      {/* Phones: the total follows the visitor while they tick add-ons. */}
      <button
        type="button"
        onClick={lockPrice}
        aria-hidden={!barVisible}
        tabIndex={barVisible ? 0 : -1}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-0 border-t border-line bg-[oklch(0.14_0.005_300_/_0.92)] px-4 py-[10px] pb-[calc(10px+env(safe-area-inset-bottom))] text-left backdrop-blur-md transition-transform duration-300 xl:hidden",
          barVisible ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
      >
        <span className="flex flex-col leading-tight">
          <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-3">
            {ui.mobileTotal} · {formatDays(result.days, locale)}
          </span>
          <strong className="font-sans text-[19px] font-bold tabular-nums text-ink">{f(result.total)}</strong>
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-accent-soft">
          {ui.fix}
          <ChevronRight size={16} />
        </span>
      </button>
    </>
  );
}
