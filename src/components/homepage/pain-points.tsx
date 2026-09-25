import type { Locale } from "@/constants/locales";
import type * as React from "react";

import type { PriceLocale } from "@/lib/shared/format-price";
import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { cn } from "@/components/ui";

/* «Звучить знайомо?» — the four situations a client recognises, then the
   diagnosis. 2026-09-25 (DESIGN.md): ruled lines, not glass cards with icon
   tiles (the site had four such icon-card grids in a row on the homepage). */

// Punch line — Actay Wide caps, single colour: it closes the list, left-aligned
// under it (it used to float centred between two decorative gradient rules).
const PUNCH_TEXT_CLASS =
  "mt-6 mb-0 max-w-[26ch] font-actay text-[20px] font-bold uppercase leading-[1.25] tracking-[-0.01em] text-ink md:mt-8 md:text-[24px] " +
  "[&_em]:not-italic [&_em]:text-inherit";

type PainCopy = {
  eyebrow: string;
  heading: React.ReactNode;
  pains: { text: string }[];
  punch: React.ReactNode;
};

const EN: PainCopy = {
  eyebrow: "THE PROBLEM",
  heading: (
    <>
      Sound <em>familiar?</em>
    </>
  ),
  pains: [
    {
      text: "You’re spending on ads — but the leads aren’t coming.",
    },
    {
      text: "Your site looks like something you’d rather not send a client.",
    },
    {
      text: "The competitor down the road is weaker than you — yet looks more credible online, so people go to them.",
    },
    {
      text: "Your last developer built a site you can’t even edit the text on yourself.",
    },
  ],
  punch: (
    <>
      Usually the problem isn’t the ads. <em>It’s the site.</em>
    </>
  ),
};


const UK: PainCopy = {
  eyebrow: "ПРОБЛЕМА",
  heading: (
    <>
      Звучить <em>знайомо?</em>
    </>
  ),
  pains: [
    {
      text: "Ви витрачаєте на рекламу — а заявок немає.",
    },
    {
      text: "Сайт виглядає так, що його соромно надіслати клієнту.",
    },
    {
      text: "Конкурент поруч слабший за вас — але онлайн виглядає солідніше, і клієнти йдуть до нього.",
    },
    {
      text: "Попередній розробник зробив сайт, у якому ви навіть текст не можете змінити самостійно.",
    },
  ],
  punch: (
    <>
      Зазвичай проблема не в рекламі, <em>а в сайті.</em>
    </>
  ),
};

const RU: PainCopy = {
  eyebrow: "ПРОБЛЕМА",
  heading: (
    <>
      Звучит <em>знакомо?</em>
    </>
  ),
  pains: [
    {
      text: "Вы тратите на рекламу — а заявок нет.",
    },
    {
      text: "Сайт выглядит так, что его стыдно отправить клиенту.",
    },
    {
      text: "Конкурент слабее вас — но онлайн выглядит убедительнее, и люди идут к нему.",
    },
    {
      text: "Прошлый разработчик сделал сайт, на котором вы даже текст не можете поменять сами.",
    },
  ],
  punch: (
    <>
      Обычно проблема не в рекламе, <em>а в сайте.</em>
    </>
  ),
};

const COPY_BY_LOCALE: Record<Locale, PainCopy> = { uk: UK, en: EN, ru: RU };

export function PainPoints({ locale = "uk" }: { locale?: PriceLocale } = {}) {
  const c = COPY_BY_LOCALE[locale];
  // 2026-09-25 (DESIGN.md): a ruled sheet, not four glass cards with icon
  // tiles. The heading holds the left track, the four situations read as
  // lines on the right, and the punch line closes the list in display type.
  // No flanking glows, gradient rules or scroll reveal — nothing here changes
  // state, so nothing moves.
  return (
    <section className={hpSectionClass} id="pains">
      <div className={cn(hpInnerClass, "grid grid-cols-1 gap-y-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-12")}>
        <SectionHead eyebrow={c.eyebrow} heading={c.heading} />
        <div>
          <ul className="m-0 list-none border-t border-line p-0">
            {c.pains.map(({ text }) => (
              <li
                key={text}
                className="border-b border-line py-4 font-sans text-[16px] leading-[1.5] text-ink [text-wrap:pretty] sm:py-5 md:text-[19px]"
              >
                {text}
              </li>
            ))}
          </ul>
          <p className={PUNCH_TEXT_CLASS}>{c.punch}</p>
        </div>
      </div>
    </section>
  );
}
