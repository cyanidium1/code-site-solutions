import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

import { SectionHead } from "@/components/shared/section-head";
import { MobileFold, READ_MORE_LABEL } from "@/components/shared/mobile-fold";
import { StackTable } from "@/components/shared/stack-table";
import type { Locale } from "@/constants/locales";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { AppImage } from "@/lib/shared/app-image";
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
const MORE_ROWS: Record<Locale, (n: number) => string> = {
  uk: (n) => `Ще ${n} рядки`,
  ru: (n) => `Ещё ${n} строки`,
  en: (n) => `${n} more rows`,
};

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
        {/* With an image the text and the picture share the container grid:
            the picture always ends on the container's right edge and fills
            its track instead of being capped and centred inside it (owner
            feedback 2026-09-17, "не по сетці"). Landscape shots take half
            the row from lg; portrait shots take a third from md, so a phone
            photo stays phone-sized next to the text. */}
        <div
          className={
            !section.image
              ? undefined
              : section.image.height > section.image.width
                ? "grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10"
                : "grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-10"
          }
        >
        <div className="flex max-w-[640px] flex-col gap-4">
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
          {section.image ? (
            <AppImage
              src={section.image.src}
              alt={section.image.alt}
              width={section.image.width}
              height={section.image.height}
              sizes={section.image.height > section.image.width ? "(min-width: 700px) 33vw, 92vw" : "(min-width: 800px) 50vw, 92vw"}
              className="block h-auto w-full rounded-[22px] border border-line"
            />
          ) : null}
        </div>

        {section.table ? (
          <StackTable
            className="mt-8"
            headers={section.table.headers}
            rows={section.table.rows}
            moreLabel={MORE_ROWS[locale]}
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
