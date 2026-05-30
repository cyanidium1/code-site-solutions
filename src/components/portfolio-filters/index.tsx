"use client";

import { useCallback, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectItem } from "@heroui/react";
import { ArrowUpRight } from "lucide-react";

import { btnClass } from "@/components/ui";
import {
  FILTER_ALL_KEY,
  FILTER_ALL_LABEL_BY_LOCALE,
  FILTER_LABELS_BY_LOCALE,
  FILTER_PLACEHOLDER_BY_LOCALE,
  INDUSTRY_CTA_LABEL_BY_LOCALE,
  type FilterOption,
  type PortfolioFilterKey,
} from "@/constants/portfolio-filters";
import { updateSearchParams } from "@/lib/shared/update-search-params";

type FormLocale = "uk" | "en";

export type PortfolioFiltersProps = {
  locale: FormLocale;
  /**
   * Available options per filter. Caller passes only options that have at
   * least one matching case — empty dropdowns are not rendered.
   */
  industryOptions: FilterOption[];
  countryOptions: FilterOption[];
  budgetOptions: FilterOption[];
  /**
   * Locale-aware deep-link map: industry slug → "/sites-for/<slug>" or
   * "/en/sites-for/<slug>". Caller supplies the href so this component
   * doesn't need the EN-registry import.
   */
  industryCtaHrefBySlug: Record<string, string>;
};

// Reuse the slot classes used by the lead-form Select so dropdowns look
// consistent across the site. Kept inline (not extracted) because no other
// surface uses them yet — DRY would be premature.
const LABEL_CLASS =
  "!text-ink-dim font-medium !text-[13px] tracking-[0.005em]";

const SELECT_TRIGGER_CLASS =
  "border border-line-strong !bg-[oklch(0.16_0.005_300_/_0.7)] !shadow-none transition-[border-color,background-color] duration-200 " +
  "hover:!border-ink-3 hover:!bg-[oklch(0.16_0.005_300_/_0.9)] " +
  "data-[focus=true]:!border-accent-soft data-[focus=true]:!bg-[oklch(0.18_0.01_300_/_0.95)] " +
  "data-[open=true]:!border-accent-soft data-[open=true]:!bg-[oklch(0.18_0.01_300_/_0.95)]";

const SELECT_VALUE_CLASS =
  "!text-ink !font-sans !text-[14px] tracking-[0.005em]";

const SELECT_POPOVER_CLASS =
  "!bg-[oklch(0.13_0.005_300_/_0.98)] border border-line-strong " +
  "!shadow-[0_18px_48px_oklch(0_0_0_/_0.5),0_0_0_1px_oklch(1_0_0_/_0.04)_inset] " +
  "backdrop-blur-[16px]";

const SELECT_ITEM_CLASS =
  "!text-ink-dim rounded-lg transition-[background-color,color] duration-150 " +
  "data-[hover=true]:!bg-[rgba(255,255,255,0.06)] data-[hover=true]:!text-ink " +
  "data-[focus=true]:!bg-[rgba(255,255,255,0.06)] data-[focus=true]:!text-ink " +
  "data-[selected=true]:!bg-accent-20 data-[selected=true]:!text-ink";

const SELECT_CLASSNAMES = {
  label: LABEL_CLASS,
  trigger: SELECT_TRIGGER_CLASS,
  value: SELECT_VALUE_CLASS,
  popoverContent: SELECT_POPOVER_CLASS,
} as const;

function FilterSelect({
  label,
  placeholder,
  options,
  allLabel,
  currentValue,
  onSelect,
}: {
  label: string;
  placeholder: string;
  options: FilterOption[];
  allLabel: string;
  currentValue: string;
  onSelect: (value: string) => void;
}) {
  // Prepend an explicit "All" reset row. The empty-string param removal happens
  // in onSelect when the sentinel key is picked.
  const items: FilterOption[] = [
    { key: FILTER_ALL_KEY, label: allLabel },
    ...options,
  ];
  return (
    <Select
      label={label}
      labelPlacement="outside"
      placeholder={placeholder}
      selectedKeys={currentValue ? [currentValue] : []}
      onSelectionChange={(keys) => {
        const k = Array.from(keys)[0];
        const next = !k || String(k) === FILTER_ALL_KEY ? "" : String(k);
        onSelect(next);
      }}
      variant="bordered"
      radius="lg"
      classNames={SELECT_CLASSNAMES}
    >
      {items.map((o) => (
        <SelectItem key={o.key} className={SELECT_ITEM_CLASS}>
          {o.label}
        </SelectItem>
      ))}
    </Select>
  );
}

export function PortfolioFilters({
  locale,
  industryOptions,
  countryOptions,
  budgetOptions,
  industryCtaHrefBySlug,
}: PortfolioFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const labels = FILTER_LABELS_BY_LOCALE[locale];
  const placeholder = FILTER_PLACEHOLDER_BY_LOCALE[locale];
  const allLabel = FILTER_ALL_LABEL_BY_LOCALE[locale];

  const currentIndustry = searchParams?.get("industry") ?? "";
  const currentCountry = searchParams?.get("country") ?? "";
  const currentBudget = searchParams?.get("budget") ?? "";

  const onChange = useCallback(
    (key: PortfolioFilterKey, value: string) => {
      const qs = updateSearchParams(searchParams, { [key]: value || null });
      const href = qs ? `${pathname}?${qs}` : pathname;
      startTransition(() => {
        // replace + scroll:false → soft nav, no scroll jump, no history pollution.
        router.replace(href, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const industryCtaHref = currentIndustry
    ? industryCtaHrefBySlug[currentIndustry]
    : undefined;
  const industryLabel = currentIndustry
    ? industryOptions.find((o) => o.key === currentIndustry)?.label
    : undefined;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FilterSelect
          label={labels.industry}
          placeholder={placeholder}
          options={industryOptions}
          allLabel={allLabel}
          currentValue={currentIndustry}
          onSelect={(v) => onChange("industry", v)}
        />
        <FilterSelect
          label={labels.country}
          placeholder={placeholder}
          options={countryOptions}
          allLabel={allLabel}
          currentValue={currentCountry}
          onSelect={(v) => onChange("country", v)}
        />
        <FilterSelect
          label={labels.budget}
          placeholder={placeholder}
          options={budgetOptions}
          allLabel={allLabel}
          currentValue={currentBudget}
          onSelect={(v) => onChange("budget", v)}
        />
      </div>

      {industryCtaHref && industryLabel ? (
        <Link
          href={industryCtaHref}
          className={btnClass("primary", "self-start")}
        >
          <span>{INDUSTRY_CTA_LABEL_BY_LOCALE[locale](industryLabel)}</span>
          <ArrowUpRight size={18} strokeWidth={1.8} />
        </Link>
      ) : null}
    </div>
  );
}
