import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import type { ProseSection } from "@/types/prose";

/**
 * Long-form prose block: heading, paragraphs, optional bullet list, optional
 * table, optional closing line and cross-links.
 *
 * Deliberately narrow (`max-w-[760px]`) for the running text while the table
 * spans the container — a wide measure is unreadable, but a table squeezed
 * into 760px is worse.
 */
function Section({ section }: { section: ProseSection }) {
  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <SectionHead
          eyebrow={section.eyebrow}
          heading={
            <>
              {section.heading[0]}
              <em>{section.heading[1]}</em>
            </>
          }
          sub={section.sub}
        />

        <div className="max-w-[760px] flex flex-col gap-4">
          {section.paragraphs.map((p) => (
            <p
              key={p.slice(0, 32)}
              className="m-0 font-sans text-[15px] leading-[1.7] text-ink-dim"
            >
              {p}
            </p>
          ))}

          {section.bullets?.length ? (
            <ul className="m-0 mt-2 flex list-none flex-col gap-2.5 p-0">
              {section.bullets.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[14px] leading-[1.6] text-ink-dim"
                >
                  <Check size={15} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {section.table ? (
          // Wide content scrolls inside its own box so the page body never does.
          <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] border-collapse overflow-hidden rounded-[14px] border border-line text-left">
              <thead>
                <tr>
                  {section.table.headers.map((h) => (
                    <th
                      key={h}
                      className="border-b border-line bg-surface px-3 py-2.5 text-[13px] font-semibold uppercase tracking-wide text-ink"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row) => (
                  <tr key={row.join("|")}>
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className="border-b border-line px-3 py-2.5 align-top text-[14px] leading-[1.5] text-ink-dim last:border-b-0"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {section.foot ? (
          <p className="m-0 mt-5 max-w-[760px] text-[13px] italic leading-[1.6] text-ink-3">
            {section.foot}
          </p>
        ) : null}

        {section.links?.length ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {section.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1 text-[14px] text-accent underline underline-offset-4"
              >
                {l.label}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Renders a run of prose sections in order. */
export function ProseSections({ items }: { items: ProseSection[] }) {
  return (
    <>
      {items.map((section) => (
        <Section key={section.heading.join(" ")} section={section} />
      ))}
    </>
  );
}
