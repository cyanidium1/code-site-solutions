import { Plus } from "lucide-react";

import { renderRich } from "@/lib/shared/rich-text";
import type { FAQItem } from "@/types/faq";

/**
 * One FAQ row, shared by the section block (`./faq.tsx`) and the /faq hub
 * page. Extracted so the two cannot drift: the accordion is pure
 * `<details>` + CSS, so it stays a server component even though the section
 * that uses it is a client one.
 *
 * Native <details> accordion. Open-state styling uses Tailwind's `open:`
 * variant (matches details[open]) and `group-open/faq:` on descendants.
 * Animation: `interpolate-size` + ::details-content transition — Chromium
 * 131+/Safari 18.2+ animate the expand; older browsers toggle instantly.
 */
export const FAQ_ITEM =
  "group/faq border border-line rounded-[14px] bg-[oklch(0.16_0.005_300)] overflow-hidden transition-[border-color] duration-200 open:border-line-strong " +
  "[interpolate-size:allow-keywords] " +
  "[&::details-content]:[transition:height_250ms_ease,content-visibility_250ms_allow-discrete] [&::details-content]:overflow-hidden [&::details-content]:h-0 open:[&::details-content]:h-auto " +
  // Respect prefers-reduced-motion: collapse the expand/collapse to an
  // instant toggle (HeroUI's framer-motion Accordion honored this; the
  // native rewrite must too).
  "motion-reduce:[&::details-content]:[transition:none]";

export const FAQ_ITEM_TRIGGER =
  "flex items-center justify-between gap-3 p-[18px] cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden md:py-[22px] md:px-6 md:gap-4";

export const FAQ_ITEM_TITLE =
  "font-sans text-[13px] font-semibold text-ink leading-[1.35] md:text-[15px]";

// max-w-[520px]: the answer column spans the whole section, so at 1440 a
// 13px answer ran 192 characters per line (design audit 2026-09-07) —
// roughly triple the 60-75 the eye tracks without losing the line.
export const FAQ_ITEM_CONTENT =
  "px-[18px] pt-0 pb-[18px] max-w-[520px] text-[13px] leading-[1.65] text-ink-dim text-pretty " +
  "[&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "[&_.rich-link]:text-accent-soft [&_.rich-link]:font-medium [&_.rich-link]:underline [&_.rich-link]:decoration-[oklch(0.7_0.14_295_/_0.4)] [&_.rich-link]:underline-offset-[3px] [&_.rich-link]:transition-[color,text-decoration-color] [&_.rich-link]:duration-200 [&_.rich-link:hover]:text-ink [&_.rich-link:hover]:decoration-ink " +
  "md:px-6 md:pb-[22px] md:text-[14px]";

// The +/× indicator pill. Sits inside <summary>; hover via the summary's
// group/trigger, open-state via the parent <details>' group/faq — all styled
// in src/app/homepage-cards.css as `.hp-faq-plus` (this 651 B stack repeated
// per FAQ row cost ~6.5 KB of document; see docs/rsc-payload-report.md).
export const FAQ_PLUS = "hp-faq-plus";

export function FaqAccordionItem({
  item,
  className,
}: {
  item: FAQItem;
  className?: string;
}) {
  return (
    <details className={className ? `${FAQ_ITEM} ${className}` : FAQ_ITEM}>
      <summary className={`group/trigger ${FAQ_ITEM_TRIGGER}`}>
        <span className={FAQ_ITEM_TITLE}>{item.q}</span>
        <span className={FAQ_PLUS} aria-hidden="true">
          <Plus size={13} strokeWidth={2.2} />
        </span>
      </summary>
      <div className={FAQ_ITEM_CONTENT}>{renderRich(item.a)}</div>
    </details>
  );
}
