import { useId, type ReactNode } from "react";

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
const PHONE_ROWS = 4;

export function StackTable({
  headers,
  rows,
  className,
  /** Index of a column rendered as an accent figure (usually the price). */
  accentCol,
  moreLabel,
}: {
  headers: string[];
  rows: ReactNode[][];
  className?: string;
  accentCol?: number;
  /** When set, phones show the first four rows and the rest open with this
      label (the class below hard-codes the four). */
  moreLabel?: (hidden: number) => string;
}) {
  const id = useId();
  const capped = Boolean(moreLabel) && rows.length > PHONE_ROWS + 1;
  return (
    <div
      className={cn(
        "md:overflow-x-auto md:rounded-card md:border md:border-line",
        capped &&
          "max-md:[&_tbody>tr:nth-child(n+5)]:hidden max-md:[&:has(>input:checked)_tbody>tr]:!block max-md:[&:has(>input:checked)>label]:hidden",
        className,
      )}
    >
      {capped ? <input id={id} type="checkbox" className="peer sr-only" /> : null}
      <table
        className="w-full border-collapse text-left max-md:block md:min-w-[560px]"
      >
        <thead className="max-md:sr-only">
          <tr className="bg-accent-6">
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-line px-5 py-3.5 font-mono text-[12px] font-medium uppercase tracking-[0.06em] text-ink-3"
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
              className="border-b border-line last:border-b-0 max-md:block max-md:rounded-ctl max-md:border max-md:border-line max-md:bg-[oklch(1_0_0_/_0.015)] max-md:px-4 max-md:py-3 max-md:last:border-b"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  data-label={ci === 0 ? undefined : headers[ci]}
                  className={cn(
                    "px-5 py-3.5 align-top font-sans text-[13.5px] leading-[1.5] max-md:block max-md:p-0",
                    ci === 0
                      ? "font-semibold text-ink max-md:mb-1.5 max-md:text-[14.5px]"
                      : "text-ink-dim max-md:mt-1 max-md:before:mr-1.5 max-md:before:font-mono max-md:before:text-[12px] max-md:before:uppercase max-md:before:tracking-[0.06em] max-md:before:text-ink-3 max-md:before:content-[attr(data-label)]",
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
      {capped ? (
        <label
          htmlFor={id}
          className="md:hidden mt-2.5 flex min-h-11 cursor-pointer items-center justify-center rounded-ctl border border-dashed border-line-strong font-sans font-semibold text-[13px] text-accent-soft peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent"
        >
          {moreLabel!(rows.length - PHONE_ROWS)}
        </label>
      ) : null}
    </div>
  );
}
