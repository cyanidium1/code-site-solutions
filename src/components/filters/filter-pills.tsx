"use client";

import type * as React from "react";
import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/components/ui";
import type { FilterOption } from "@/lib/shared/filters/types";
import { updateSearchParams } from "@/lib/shared/update-search-params";
import { PILL_ACTIVE, PILL_BASE, PILL_INACTIVE } from "./pill-classes";

/**
 * Single-select pill row used by /blog filtering. Each pill represents one
 * value of `paramKey`; the active pill is highlighted using the optional
 * per-pill `color` (interpreted as a CSS color string — hex or oklch — set
 * as `--pill-accent` and consumed by Tailwind classes via the CSS-var trick).
 *
 * Selecting a pill replaces the URL param; selecting the active pill or the
 * "all" pill clears it. Navigation is soft (`router.replace`, no scroll).
 */
export type FilterPillItem = FilterOption & {
  /** Optional accent color (hex/oklch). When set, the pill is tinted when active. */
  color?: string;
};

export type FilterPillsProps = {
  /** URL search-param key to read/write (e.g. "category"). */
  paramKey: string;
  /** Pills to render, in display order. */
  items: FilterPillItem[];
  /** Label for the implicit "all" reset pill (locale-resolved by caller). */
  allLabel: string;
  /**
   * Accessible label for the toolbar — passed to `aria-label`. Caller
   * supplies it (locale-aware), e.g. "Фільтр за галуззю".
   */
  ariaLabel: string;
};

export function FilterPills({
  paramKey,
  items,
  allLabel,
  ariaLabel,
}: FilterPillsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const current = searchParams?.get(paramKey) ?? "";

  const onSelect = useCallback(
    (next: string) => {
      const qs = updateSearchParams(searchParams, {
        [paramKey]: next || null,
      });
      const href = qs ? `${pathname}?${qs}` : pathname;
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [paramKey, pathname, router, searchParams],
  );

  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className="flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        className={cn(PILL_BASE, current === "" ? PILL_ACTIVE : PILL_INACTIVE)}
        aria-pressed={current === ""}
        onClick={() => onSelect("")}
      >
        {allLabel}
      </button>
      {items.map((it) => {
        const active = current === it.key;
        const style = it.color
          ? ({ "--pill-accent": it.color } as React.CSSProperties)
          : undefined;
        return (
          <button
            key={it.key}
            type="button"
            className={cn(PILL_BASE, active ? PILL_ACTIVE : PILL_INACTIVE)}
            aria-pressed={active}
            // Toggle off when the active pill is clicked again — friendly UX.
            onClick={() => onSelect(active ? "" : it.key)}
            // eslint-disable-next-line react/forbid-dom-props -- dynamic per-pill accent
            style={style}
          >
            {it.color ? (
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full"
                // eslint-disable-next-line react/forbid-dom-props -- decorative dot
                style={{ backgroundColor: it.color }}
              />
            ) : null}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
