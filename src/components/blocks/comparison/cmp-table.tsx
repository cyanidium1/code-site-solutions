"use client";

/**
 * Shared comparison-table primitives.
 *
 * Used by:
 *   - `Comparison` block (in this folder)
 *   - `vs-constructors`, `vs-freelancers`, `vs-wordpress` pages
 *
 * Replaces the legacy `.cmp-table` / `.cmp-th-good` / `.cmp-td-good` /
 * `.cmp-td-param` / `.cmp-td-bad` CSS class family. Mobile-first: base
 * styles render a stacked card layout (row = card, cell = stacked block)
 * with a `before:` pseudo-label from `data-label`. At `md:` (700px+) the
 * layout switches back to native table semantics and thead becomes
 * visible.
 */

import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/components/ui";

// Outer `<table>` — full width, border-collapse. Base = stacked-card
// mobile layout (block display, tr is a padded bordered card, td is a
// stacked block). At md: revert to native table semantics.
const TABLE_CLASS =
  "w-full border-collapse " +
  "block md:table " +
  "[&_tbody]:block [&_tbody]:md:table-row-group " +
  "[&_tr]:block [&_tr]:w-full [&_tr]:px-4 [&_tr]:py-3.5 [&_tr]:border-b [&_tr]:border-line " +
  "[&_tr]:md:table-row [&_tr]:md:w-auto [&_tr]:md:px-0 [&_tr]:md:py-0 [&_tr]:md:border-b-0 " +
  "[&_tr:last-child]:border-b-0 " +
  "[&_td]:block [&_td]:md:table-cell";

export function CmpTable({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn(TABLE_CLASS, className)} {...rest}>
      {children}
    </table>
  );
}

// Header row container — hidden by default (cells reflow as cards with
// data-label on mobile), shown at md+ where table layout returns.
export function CmpThead({ children }: { children: ReactNode }) {
  return <thead className="hidden md:table-header-group">{children}</thead>;
}

// Standard <th> for the comparison table.
const TH_BASE =
  "text-left px-4 py-3.5 border-b border-line-strong " +
  "font-sans font-bold text-[10px] tracking-[0.12em] uppercase text-ink-3 " +
  "bg-[oklch(1_0_0_/_0.02)] " +
  "xl:px-6 xl:py-5 xl:text-[11px]";

// Highlighted "good" column header.
const TH_GOOD =
  "bg-accent-10 " +
  "border-l border-r border-l-[oklch(from_var(--color-accent)_l_c_h_/_0.25)] border-r-[oklch(from_var(--color-accent)_l_c_h_/_0.25)] " +
  "border-b-[oklch(from_var(--color-accent)_l_c_h_/_0.35)] " +
  "text-accent-soft";

export function CmpTh({
  good,
  className,
  children,
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement> & { good?: boolean }) {
  return (
    <th className={cn(TH_BASE, good && TH_GOOD, className)} {...rest}>
      {children}
    </th>
  );
}

// Standard <td>. Variants:
//   - kind="param" — parameter-name (first column) — bolder ink.
//   - kind="bad"   — left/right "bad" columns — dimmed ink.
//   - kind="good"  — highlighted "good" column — accent fill + border on
//                    desktop, accent-soft text on mobile.
// `data-label` (passed as a regular attribute) is rendered before the value on
// ≤700px via the `before:content-[attr(data-label)_':_']` utility — except for
// "param" cells which suppress the label (the param IS the label).
// Mobile base = stacked card cell (no padding sides, tiny vertical
// padding, no row border — the wrapping tr supplies the card border).
// At md+ the cell becomes a real <td> with desktop padding/border.
const TD_BASE =
  "text-left px-0 py-1 border-b-0 text-[13px] leading-[1.4] align-middle " +
  "font-sans " +
  "md:px-4 md:py-3.5 md:border-b md:border-line " +
  "xl:px-6 xl:py-[18px] xl:text-[14px]";

const TD_PARAM =
  // Mobile: param row is the card title — uppercase, small, dimmer.
  "font-semibold text-ink-3 text-[11px] tracking-[0.1em] uppercase pb-1.5 " +
  // md+: param is the first column cell — regular size, plain casing.
  "md:font-medium md:text-ink md:text-[12px] md:tracking-normal md:normal-case md:pb-0 " +
  "xl:text-[13px]";

const TD_BAD = "text-ink-3";

const TD_GOOD =
  // Mobile: transparent fill, no side borders, accent-soft text.
  "text-accent-soft font-semibold " +
  // md+: accent-tinted column with accent side borders.
  "md:text-ink md:bg-accent-10 " +
  "md:border-l md:border-r md:border-l-[oklch(from_var(--color-accent)_l_c_h_/_0.25)] md:border-r-[oklch(from_var(--color-accent)_l_c_h_/_0.25)]";

// Mobile data-label pseudo — renders `<data-label>: ` before the cell
// value. Disabled at md+ where the thead row provides labels.
const TD_LABEL_BEFORE =
  "before:content-[attr(data-label)_':_'] before:text-ink-3 before:text-[11px] before:mr-1.5 before:uppercase before:tracking-[0.06em] " +
  "md:before:content-none";

// Last row of tbody: remove desktop border-bottom. At mobile each row
// already has no inner border (tr provides the card border), so this is
// a no-op there.
const TD_LAST_ROW_RESET = "[tr:last-child_&]:border-b-0";
const TD_GOOD_LAST_ROW =
  "[tr:last-child_&]:border-b-[oklch(from_var(--color-accent)_l_c_h_/_0.25)]";

export function CmpTd({
  kind,
  className,
  children,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement> & {
  kind?: "param" | "bad" | "good";
}) {
  const kindClass =
    kind === "param" ? TD_PARAM : kind === "good" ? TD_GOOD : kind === "bad" ? TD_BAD : "";
  // Suppress the mobile data-label pseudo for param cells.
  const labelClass = kind === "param" ? "" : TD_LABEL_BEFORE;
  const lastRowExtra = kind === "good" ? TD_GOOD_LAST_ROW : "";
  return (
    <td
      className={cn(TD_BASE, kindClass, labelClass, TD_LAST_ROW_RESET, lastRowExtra, className)}
      {...rest}
    >
      {children}
    </td>
  );
}

// Outer wrapper around a 3-column pricing grid. Replaces `.cmp-pricing-grid`.
export function CmpPricingGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3.5 items-stretch xl:grid-cols-3 xl:gap-[18px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
