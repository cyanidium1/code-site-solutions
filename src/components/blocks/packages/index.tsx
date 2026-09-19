/**
 * Config-driven package blocks. Every price, term and composition comes from
 * `@/constants/pricing`; labels from `@/content/packages-ui`. Use these
 * instead of typing prices into page copy.
 */

import type { ReactNode } from "react";

import type { Locale } from "@/constants/locales";
import {
  ADDONS,
  ADDON_ORDER,
  ALL_PACKAGES,
  CORE_PACKAGES,
  INDUSTRIES,
  INDUSTRY_ORDER,
  PACKAGES,
  formatAddonPrice,
  formatPackageTerm,
  industryPrice,
  packagePrice,
  showsUahHint,
  uahApprox,
  type AddonId,
  type PackageId,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import { PACKAGES_UI } from "@/content/packages-ui";
import type { TierProps } from "@/types/pricing";
import { Tier, CmpPricingGrid } from "@/components/blocks/comparison";
import { LeadForm, type LeadFormVariant } from "@/components/blocks/lead-form";
import {
  hpH2Class,
  hpInnerClass,
  hpSectionClass,
  hpSectionHeadClass,
  hpSubClass,
} from "@/components/homepage/shared";
import { cn } from "@/components/ui";

/** Anchor every "get a quote" CTA on a page scrolls to. */
export const LEAD_FORM_ANCHOR = "lead-form";

/** TierProps for one package. CTA opens the lead modal with it preselected. */
export function packageTier(
  id: PackageId,
  locale: Locale,
  opts: { source?: string; compact?: boolean } = {},
): TierProps {
  const ui = PACKAGES_UI[locale];
  const p = PACKAGES[id];
  const excludes = p.excludes[locale];
  return {
    name: p.name[locale],
    price: formatPrice(packagePrice(id, locale), { locale }),
    priceLabel: p.fromPrice ? ui.fromLabel : ui.fixedLabel,
    weeks: formatPackageTerm(id, locale),
    popular: Boolean(p.popular),
    popularLabel: ui.popular,
    includes: { heading: ui.includes, items: p.includes[locale] },
    excludes: excludes.length ? { heading: ui.excludes, items: excludes } : undefined,
    ctaLabel: ui.cta,
    ctaGhost: !p.popular,
    ctaSource: opts.source ?? `package-card-${id}`,
    tierKey: id,
  };
}

/** Three core package cards + the "industry / custom" line under them. */
export function PackageCards({
  locale,
  ids = CORE_PACKAGES,
  compact = false,
  source,
  showMoreLine = true,
}: {
  locale: Locale;
  ids?: readonly PackageId[];
  compact?: boolean;
  source?: string;
  showMoreLine?: boolean;
}) {
  const ui = PACKAGES_UI[locale];
  return (
    <>
      <CmpPricingGrid>
        {ids.map((id) => (
          <Tier key={id} {...packageTier(id, locale, { source })} compact={compact} />
        ))}
      </CmpPricingGrid>
      {showMoreLine ? (
        <p className="mt-6 mb-0 text-center font-sans text-[14.5px] text-ink-dim">
          {ui.moreLine(locale)}
        </p>
      ) : null}
    </>
  );
}

/** One-line USP repeated across pages (TZ v2 §6). */
export function UspLine({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <p
      className={cn(
        "m-0 font-mono text-[11.5px] uppercase leading-[1.7] tracking-[0.06em] text-ink-3",
        className,
      )}
    >
      {PACKAGES_UI[locale].usp}
    </p>
  );
}

/** Section with the site-wide lead form; `#lead-form` is the CTA target. */
export function LeadFormSection({
  locale,
  source,
  tier,
  title,
  sub,
  variant = "full",
  id = LEAD_FORM_ANCHOR,
  className,
}: {
  locale: Locale;
  source: string;
  tier?: PackageId;
  title?: ReactNode;
  sub?: ReactNode;
  variant?: LeadFormVariant;
  id?: string;
  className?: string;
}) {
  const ui = PACKAGES_UI[locale];
  return (
    <section id={id} className={cn(hpSectionClass, "scroll-mt-20", className)}>
      <div className={cn(hpInnerClass, "max-w-[760px]")}>
        <h2 className={hpH2Class}>{title ?? ui.formTitle}</h2>
        <p className={cn(hpSubClass, "mb-8")}>{sub ?? ui.formSub}</p>
        <div className="rounded-2xl border border-line-strong bg-[oklch(0.13_0.005_300_/_0.7)] p-5 md:rounded-[22px] md:p-7">
          <LeadForm source={source} locale={locale} tier={tier} variant={variant} />
        </div>
      </div>
    </section>
  );
}

/** Just the form card, for placing inside a hero column. */
export function LeadFormCard({
  locale,
  source,
  tier,
  className,
}: {
  locale: Locale;
  source: string;
  tier?: PackageId;
  className?: string;
}) {
  return (
    <div
      id={LEAD_FORM_ANCHOR}
      className={cn(
        "scroll-mt-20 rounded-2xl border border-line-strong bg-[oklch(0.13_0.005_300_/_0.85)] p-5 backdrop-blur-[8px] md:rounded-[22px] md:p-6",
        className,
      )}
    >
      <LeadForm source={source} locale={locale} tier={tier} variant="compact" />
    </div>
  );
}

const TABLE_WRAP = "overflow-x-auto rounded-2xl border border-line";
const TABLE = "w-full min-w-[560px] border-collapse text-left font-sans text-[14px]";
const TH = "border-b border-line px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-ink-3";
const TD = "border-b border-line px-4 py-3 align-top text-ink-dim";

/** All packages with price, term and composition (for /pricing). */
export function PackagesTable({
  locale,
  ids = ALL_PACKAGES,
}: {
  locale: Locale;
  ids?: readonly PackageId[];
}) {
  const ui = PACKAGES_UI[locale];
  const uah = showsUahHint(locale);
  return (
    <div className={TABLE_WRAP}>
      <table className={TABLE}>
        <thead>
          <tr>
            <th className={TH}>{ui.thPackage}</th>
            <th className={TH}>{ui.thPrice}</th>
            <th className={TH}>{ui.thTerm}</th>
            <th className={TH}>{ui.thIncludes}</th>
          </tr>
        </thead>
        <tbody>
          {ids.map((id) => {
            const p = PACKAGES[id];
            const price = packagePrice(id, locale);
            return (
              <tr key={id}>
                <td className={cn(TD, "font-semibold text-ink")}>
                  {p.name[locale]}
                  {p.popular ? <span className="ml-1 text-accent-soft">★</span> : null}
                </td>
                <td className={cn(TD, "whitespace-nowrap text-ink tabular-nums")}>
                  {formatPrice(price, { locale, withPrefix: p.fromPrice })}
                  {uah ? <span className="block text-[12px] text-ink-3">{uahApprox(price)}</span> : null}
                </td>
                <td className={cn(TD, "whitespace-nowrap")}>{formatPackageTerm(id, locale)}</td>
                <td className={TD}>{p.includes[locale].join(", ")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Industry variants of the `industry` package with their prices. */
export function IndustryPricesTable({ locale }: { locale: Locale }) {
  const ui = PACKAGES_UI[locale];
  return (
    <div className={TABLE_WRAP}>
      <table className={TABLE}>
        <thead>
          <tr>
            <th className={TH}>{PACKAGES.industry.name[locale]}</th>
            <th className={TH}>{ui.thPrice}</th>
            <th className={TH}>{ui.thTerm}</th>
          </tr>
        </thead>
        <tbody>
          {INDUSTRY_ORDER.map((id) => (
            <tr key={id}>
              <td className={cn(TD, "text-ink")}>{INDUSTRIES[id].name[locale]}</td>
              <td className={cn(TD, "whitespace-nowrap text-ink tabular-nums")}>
                {formatPrice(industryPrice(id, locale), { locale })}
              </td>
              <td className={cn(TD, "whitespace-nowrap")}>{formatPackageTerm("industry", locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Fixed-price add-ons (all, or the subset offered with one package). */
export function AddonsTable({
  locale,
  ids = ADDON_ORDER,
}: {
  locale: Locale;
  ids?: readonly AddonId[];
}) {
  const ui = PACKAGES_UI[locale];
  return (
    <div className={TABLE_WRAP}>
      <table className={cn(TABLE, "min-w-0")}>
        <thead>
          <tr>
            <th className={TH}>{ui.thAddon}</th>
            <th className={cn(TH, "text-right")}>{ui.thPrice}</th>
          </tr>
        </thead>
        <tbody>
          {ids.map((id) => (
            <tr key={id}>
              <td className={cn(TD, "text-ink")}>{ADDONS[id].name[locale]}</td>
              <td className={cn(TD, "whitespace-nowrap text-right text-ink tabular-nums")}>
                {formatAddonPrice(id, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Payment terms list, identical everywhere (TZ v2 §2.4). */
export function PaymentTerms({ locale, className }: { locale: Locale; className?: string }) {
  const ui = PACKAGES_UI[locale];
  return (
    <div className={cn("rounded-2xl border border-line p-5 md:p-6", className)}>
      <h3 className="m-0 mb-3 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-accent-soft">
        {ui.paymentTitle}
      </h3>
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[14.5px] leading-[1.55] text-ink-dim">
        {ui.payment(locale).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

/** Standard section wrapper with H2 + optional sub, for page composition. */
export function PackagesSection({
  id,
  title,
  sub,
  children,
  className,
}: {
  id?: string;
  title: ReactNode;
  sub?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn(hpSectionClass, className)}>
      <div className={hpInnerClass}>
        <div className={hpSectionHeadClass}>
          <h2 className={hpH2Class}>{title}</h2>
          {sub ? <p className={hpSubClass}>{sub}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
