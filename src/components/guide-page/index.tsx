import { ChevronRight, Info } from "lucide-react";

import { AppImage } from "@/lib/shared/app-image";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import type { GuideBlock, GuideContent } from "@/types/guide";

/**
 * Renderer for service guides under `/guides/*`.
 *
 * Deliberately plainer than the marketing pages: someone is following this
 * with a Google Cloud tab open next to it, so the job is legibility, not
 * atmosphere. Button labels are rendered to look like the control they name,
 * because the reader is hunting for that exact word on their own screen.
 */

const CARD = "rounded-[14px] border border-line bg-[oklch(1_0_0_/_0.02)]";

function Blocks({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "p":
            return (
              <p key={i} className="text-[14.5px] leading-[1.65] text-ink-dim">
                {b.text}
              </p>
            );

          case "ul":
            return (
              <ul key={i} className="m-0 flex list-none flex-col gap-2 p-0">
                {b.items.map((it) => (
                  <li
                    key={it}
                    className="relative pl-5 text-[14.5px] leading-[1.6] text-ink-dim before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent-soft"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            );

          case "path":
            return (
              <div
                key={i}
                className={`${CARD} inline-flex flex-wrap items-center gap-1.5 px-3.5 py-2.5`}
              >
                {b.items.map((seg, j) => (
                  <span key={seg} className="inline-flex items-center gap-1.5">
                    {j > 0 ? (
                      <ChevronRight
                        size={13}
                        strokeWidth={2}
                        className="shrink-0 text-ink-3"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="font-mono text-[12.5px] text-ink">{seg}</span>
                  </span>
                ))}
              </div>
            );

          case "action":
            return (
              <div key={i} className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center rounded-[9px] border border-accent-30 bg-accent-15 px-3 py-1.5 font-sans text-[13px] font-semibold text-ink">
                  {b.label}
                </span>
                {b.note ? (
                  <span className="font-mono text-[12px] text-ink-3">— {b.note}</span>
                ) : null}
              </div>
            );

          case "value":
            return (
              <div
                key={i}
                className={`${CARD} flex flex-wrap items-baseline justify-between gap-3 px-3.5 py-2.5`}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
                  {b.label}
                </span>
                <code className="font-mono text-[13px] text-ink">{b.value}</code>
              </div>
            );

          case "link":
            return (
              <a
                key={i}
                href={b.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-line bg-[oklch(1_0_0_/_0.03)] px-3.5 py-2.5 font-mono text-[13px] text-ink no-underline transition-colors duration-200 hover:border-accent-40"
              >
                {b.label}
                <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
              </a>
            );

          case "note":
            return (
              <div
                key={i}
                className="flex gap-3 rounded-[12px] border border-line bg-[oklch(1_0_0_/_0.03)] px-4 py-3"
              >
                <Info
                  size={15}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0 text-accent-soft"
                  aria-hidden="true"
                />
                <p className="m-0 text-[13.5px] leading-[1.6] text-ink-3">{b.text}</p>
              </div>
            );

          case "image":
            return (
              <figure key={i} className="m-0">
                <div className="relative overflow-hidden rounded-[14px] border border-line bg-[oklch(0_0_0/0.4)]">
                  <AppImage
                    src={b.src}
                    alt={b.alt}
                    width={1600}
                    height={900}
                    sizes="(max-width: 900px) 92vw, 860px"
                    className="h-auto w-full"
                  />
                  {b.highlight ? (
                    // Обведення малюється поверх зображення у відсотках, а не
                    // вшивається в PNG: лишається різким на будь-якому екрані
                    // і правиться числами, без переекспорту картинки.
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute rounded-[8px] border-2 border-[oklch(0.75_0.19_25)] shadow-[0_0_0_4px_oklch(0.75_0.19_25/0.25)]"
                      style={{
                        left: `${b.highlight.x}%`,
                        top: `${b.highlight.y}%`,
                        width: `${b.highlight.w}%`,
                        height: `${b.highlight.h}%`,
                      }}
                    />
                  ) : null}
                </div>
                {b.caption ? (
                  <figcaption className="mt-2 font-mono text-[11.5px] leading-[1.5] text-ink-3">
                    {b.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
        }
      })}
    </div>
  );
}

export function GuidePage({ content }: { content: GuideContent }) {
  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <div className="mx-auto max-w-[860px]">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-soft">
            {content.eyebrow}
          </div>
          <h1 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
            {content.heading}
          </h1>
          {content.timeNote ? (
            <p className="mt-3 font-mono text-[12px] text-ink-3">{content.timeNote}</p>
          ) : null}
          <p className="mt-5 text-[15.5px] leading-[1.65] text-ink-dim">{content.lead}</p>

          <ol className="mt-11 flex list-none flex-col gap-11 p-0">
            {content.steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-30 bg-accent-15 font-mono text-[13px] font-bold text-ink"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="mb-4 font-display text-[19px] font-bold leading-[1.3] text-ink">
                    {step.title}
                  </h2>
                  <Blocks blocks={step.blocks} />
                </div>
              </li>
            ))}
          </ol>

          {content.sections?.map((s) => (
            <div key={s.heading} className="mt-14 border-t border-line pt-9">
              <h2 className="mb-4 font-display text-[19px] font-bold leading-[1.3] text-ink">
                {s.heading}
              </h2>
              <Blocks blocks={s.blocks} />
            </div>
          ))}

          {content.footNote ? (
            <p className="mt-12 border-t border-line pt-6 text-[13.5px] leading-[1.6] text-ink-3">
              {content.footNote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
