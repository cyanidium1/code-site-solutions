import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/components/ui";

/**
 * Server-rendered pagination for listing pages (/blog). Every control is a
 * real `<Link>`, so each page is crawlable and shareable — the reason the
 * blog listing paginates by URL rather than by a client-side "show more"
 * (design audit 2026-09-06, C5).
 *
 * Renders nothing for a single-page listing.
 */
export type PaginationLabels = {
  /** Accessible name for the <nav>, e.g. "Пагінація блогу". */
  ariaLabel: string;
  previous: string;
  next: string;
  /** Accessible name for a numbered link, e.g. (n) => `Сторінка ${n}`. */
  page: (n: number) => string;
};

const ITEM_BASE =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-3.5 " +
  "font-mono text-[12px] tracking-[0.02em] no-underline transition-[color,background-color,border-color] duration-150";
const ITEM_IDLE =
  "border-line bg-[oklch(1_0_0_/_0.02)] text-ink-dim hover:border-line-strong hover:text-ink";
const ITEM_CURRENT =
  "border-accent-55 bg-accent-18 text-ink cursor-default";
const ITEM_DISABLED = "border-line text-ink-3 opacity-50 cursor-default";
const GAP_CLASS = "inline-flex h-11 w-6 items-center justify-center text-ink-3";

/**
 * Page numbers to render: always the first and last page, plus a window
 * around the current one, with `null` marking an elided run.
 */
function pageWindow(page: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const out: (number | null)[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(totalPages - 1, page + 1);
  if (from > 2) out.push(null);
  for (let i = from; i <= to; i++) out.push(i);
  if (to < totalPages - 1) out.push(null);
  out.push(totalPages);
  return out;
}

export function Pagination({
  page,
  totalPages,
  hrefFor,
  labels,
  className,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  labels: PaginationLabels;
  className?: string;
}) {
  if (totalPages <= 1) return null;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label={labels.ariaLabel}
      className={cn("mt-12 flex flex-wrap items-center justify-center gap-2", className)}
    >
      {hasPrev ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={cn(ITEM_BASE, ITEM_IDLE, "gap-1.5")}>
          <ChevronLeft size={14} strokeWidth={1.8} aria-hidden />
          <span className="hidden sm:inline">{labels.previous}</span>
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(ITEM_BASE, ITEM_DISABLED, "gap-1.5")}>
          <ChevronLeft size={14} strokeWidth={1.8} />
          <span className="hidden sm:inline">{labels.previous}</span>
        </span>
      )}

      {pageWindow(page, totalPages).map((n, i) =>
        n === null ? (
          <span key={`gap-${i}`} aria-hidden="true" className={GAP_CLASS}>
            …
          </span>
        ) : n === page ? (
          <span key={n} aria-current="page" className={cn(ITEM_BASE, ITEM_CURRENT)}>
            {n}
          </span>
        ) : (
          <Link
            key={n}
            href={hrefFor(n)}
            aria-label={labels.page(n)}
            className={cn(ITEM_BASE, ITEM_IDLE)}
          >
            {n}
          </Link>
        ),
      )}

      {hasNext ? (
        <Link href={hrefFor(page + 1)} rel="next" className={cn(ITEM_BASE, ITEM_IDLE, "gap-1.5")}>
          <span className="hidden sm:inline">{labels.next}</span>
          <ChevronRight size={14} strokeWidth={1.8} aria-hidden />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(ITEM_BASE, ITEM_DISABLED, "gap-1.5")}>
          <span className="hidden sm:inline">{labels.next}</span>
          <ChevronRight size={14} strokeWidth={1.8} />
        </span>
      )}
    </nav>
  );
}
