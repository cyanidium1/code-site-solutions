"use client";

/**
 * Shared comparison-table primitives.
 *
 * Used by:
 *   - `Comparison` block (in this folder)
 *   - `vs-constructors`, `vs-freelancers`, `vs-wordpress` pages
 *
 * Replaces the legacy `.cmp-table` / `.cmp-th-good` / `.cmp-td-good` /
 * `.cmp-td-param` / `.cmp-td-bad` CSS class family. The mobile data-label
 * reflow at ≤700px is implemented per-cell via `before:content-[attr(data-label)_':_']`
 * arbitrary-value utilities; thead is hidden via the `max-md:hidden` class
 * on the wrapping `<thead>`.
 */

import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/shared/cn";

// Outer `<table>` — full width, border-collapse, plus tr-level resets for ≤700px reflow.
const TABLE_CLASS =
  "w-full border-collapse " +
  // Mobile: each row becomes a stacked card; cells flow vertically.
  "max-md:block " +
  "[&_tbody]:max-md:block " +
  "[&_tr]:max-md:block [&_tr]:max-md:w-full [&_tr]:max-md:px-4 [&_tr]:max-md:py-3.5 [&_tr]:max-md:border-b [&_tr]:max-md:border-line " +
  "[&_tr:last-child]:max-md:border-b-0 " +
  "[&_td]:max-md:block [&_td]:max-md:w-full [&_td]:max-md:border-b-0 [&_td]:max-md:px-0 [&_td]:max-md:py-1";

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

// Header row container — hides on ≤700px (cells reflow as cards with data-label).
export function CmpThead({ children }: { children: ReactNode }) {
  return <thead className="max-md:hidden">{children}</thead>;
}

// Standard <th> for the comparison table.
const TH_BASE =
  "text-left px-6 py-5 border-b border-line-strong " +
  "font-sans font-bold text-[11px] tracking-[0.12em] uppercase text-ink-3 " +
  "bg-[oklch(1_0_0_/_0.02)] " +
  "max-xl:px-4 max-xl:py-3.5 max-xl:text-[10px]";

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
const TD_BASE =
  "text-left px-6 py-[18px] border-b border-line text-[14px] leading-[1.4] align-middle " +
  "font-sans " +
  "[&:last-child]:[&]: " +
  "max-xl:px-4 max-xl:py-3.5 max-xl:text-[13px] " +
  "max-md:text-[13px]";

const TD_PARAM =
  "font-medium text-ink text-[13px] " +
  "max-xl:text-[12px] " +
  // On mobile, the parameter row becomes the "card title" — uppercase, smaller.
  "max-md:text-[11px] max-md:tracking-[0.1em] max-md:uppercase max-md:text-ink-3 max-md:font-semibold max-md:pb-1.5";

const TD_BAD = "text-ink-3";

const TD_GOOD =
  "text-ink font-semibold " +
  "bg-accent-10 " +
  "border-l border-r border-l-[oklch(from_var(--color-accent)_l_c_h_/_0.25)] border-r-[oklch(from_var(--color-accent)_l_c_h_/_0.25)] " +
  // On mobile: transparent + accent-soft text (no side borders).
  "max-md:bg-transparent max-md:border-l-0 max-md:border-r-0 max-md:text-accent-soft max-md:font-semibold";

// Mobile data-label pseudo. Applied via `before:` arbitrary content utility.
// Not applied for "param" cells.
const TD_LABEL_BEFORE =
  "max-md:before:content-[attr(data-label)_':_'] max-md:before:text-ink-3 max-md:before:text-[11px] max-md:before:mr-1.5 max-md:before:uppercase max-md:before:tracking-[0.06em]";

// Last row of tbody: remove desktop border-bottom.
// Applied via [&]: a parent selector via tr:last-child td (Tailwind needs custom; we use a class wrapper below).
const TD_LAST_ROW_RESET = "[tr:last-child_&]:border-b-0 [tr:last-child_&]:max-md:border-b-0";
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
        "grid grid-cols-3 gap-[18px] items-stretch max-xl:grid-cols-1 max-xl:gap-3.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
