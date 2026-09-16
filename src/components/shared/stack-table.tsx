import type { ReactNode } from "react";

import { cn } from "@/components/ui";

/**
 * A data table that turns into a stack of small cards below `md` (700px).
 *
 * On phones a three- or four-column table either overflowed and got cut at
 * the right edge (/pricing, /corporate-site — simplification plan
 * 2026-09-16, rule П6) or needed a sideways scroll nobody discovers. Here
 * every row becomes a card: the first cell is its title, the rest are
 * "header: value" lines. One DOM for both layouts — the header text is
 * repeated through a `data-label` attribute, not a second copy of the table,
 * so the content is not duplicated for search engines.
 */
export function StackTable({
  headers,
  rows,
  className,
  /** Index of a column rendered as an accent figure (usually the price). */
  accentCol,
}: {
  headers: string[];
  rows: ReactNode[][];
  className?: string;
  accentCol?: number;
}) {
  return (
    <div className={cn("md:overflow-x-auto md:rounded-2xl md:border md:border-line", className)}>
      <table
        className="w-full border-collapse text-left max-md:block md:min-w-[560px]"
      >
        <thead className="max-md:sr-only">
          <tr className="bg-accent-6">
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-line px-5 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="max-md:flex max-md:flex-col max-md:gap-2.5">
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-line last:border-b-0 max-md:block max-md:rounded-xl max-md:border max-md:border-line max-md:bg-[oklch(1_0_0_/_0.015)] max-md:px-4 max-md:py-3 max-md:last:border-b"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  data-label={ci === 0 ? undefined : headers[ci]}
                  className={cn(
                    "px-5 py-3.5 align-top font-sans text-[13.5px] leading-[1.5] max-md:block max-md:p-0",
                    ci === 0
                      ? "font-semibold text-ink max-md:mb-1.5 max-md:text-[14.5px]"
                      : "text-ink-dim max-md:mt-1 max-md:before:mr-1.5 max-md:before:font-mono max-md:before:text-[10.5px] max-md:before:uppercase max-md:before:tracking-[0.08em] max-md:before:text-ink-3 max-md:before:content-[attr(data-label)]",
                    accentCol === ci && "font-mono font-semibold text-accent-soft md:whitespace-nowrap",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
