import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { SectionHead } from "@/components/shared/section-head";
import { MobileFold, READ_MORE_LABEL } from "@/components/shared/mobile-fold";
import { StackTable } from "@/components/shared/stack-table";
import type { Locale } from "@/constants/locales";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import type { ProseSection } from "@/types/prose";

/**
 * Long-form prose block: heading, paragraphs, optional bullet list, optional
 * table, optional closing line and cross-links.
 *
 * The running text is capped at 560px while the table spans the container —
 * a wide measure is unreadable, but a table squeezed into the text column is
 * worse. 760px sounded narrow but holds ~100 characters at 15px; 560px holds
 * ~74, the top of the 60-75 band the eye reads without losing its place
 * (measured, design audit 2026-09-07).
 */
const PARA_CLASS = "m-0 font-sans text-[15px] leading-[1.7] text-ink-dim";

function Section({ section, locale }: { section: ProseSection; locale: Locale }) {
  const bullets = section.bullets?.length ? (
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
  ) : null;
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

        {/* Phones get the lead paragraph and the table; the rest of the
            running text folds behind "Read more" (plan 2026-09-16, П5). */}
        <div className="flex max-w-[560px] flex-col gap-4">
          {section.paragraphs.slice(0, 1).map((p) => (
            <p key={p.slice(0, 32)} className={PARA_CLASS}>
              {p}
            </p>
          ))}
          {section.paragraphs.length > 1 ? (
            <MobileFold
              label={READ_MORE_LABEL[locale]}
              bodyClassName="flex-col gap-4 lg:flex max-lg:peer-checked:flex"
            >
              {section.paragraphs.slice(1).map((p) => (
                <p key={p.slice(0, 32)} className={PARA_CLASS}>
                  {p}
                </p>
              ))}
              {bullets}
            </MobileFold>
          ) : (
            bullets
          )}
        </div>

        {section.table ? (
          <StackTable
            className="mt-8"
            headers={section.table.headers}
            rows={section.table.rows}
          />
        ) : null}

        {section.foot ? (
          <p className="m-0 mt-5 max-w-[520px] text-[13px] italic leading-[1.6] text-ink-3">
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
export function ProseSections({
  items,
  locale = "uk",
}: {
  items: ProseSection[];
  locale?: Locale;
}) {
  return (
    <>
      {items.map((section) => (
        <Section key={section.heading.join(" ")} section={section} locale={locale} />
      ))}
    </>
  );
}
