"use client";

import { useCallback, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { btnClass, Select } from "@/components/ui";
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
  // in onSelect when the sentinel key is picked. Trigger/listbox styling is
  // the ui/Select default (same treatment the lead-form uses).
  const items: FilterOption[] = [
    { key: FILTER_ALL_KEY, label: allLabel },
    ...options,
  ];
  return (
    <Select
      label={label}
      placeholder={placeholder}
      options={items}
      value={currentValue}
      onChange={(v) => {
        onSelect(!v || v === FILTER_ALL_KEY ? "" : v);
      }}
    />
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
