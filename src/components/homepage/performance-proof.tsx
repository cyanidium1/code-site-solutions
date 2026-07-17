import type * as React from "react";
import { Gauge, Zap, Check, type LucideIcon } from "lucide-react";

import type { PriceLocale } from "@/lib/shared/format-price";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";

type ProofCopy = {
  stats: { icon: LucideIcon; num: string; title: string; desc: string }[];
  designHeading: React.ReactNode;
  bullets: string[];
  footnote: React.ReactNode;
};

const EN: ProofCopy = {
  stats: [
    {
      icon: Zap,
      num: "0.5s",
      title: "load time",
      desc: "Faster than a visitor can close the tab. Builder sites take 3–5 seconds, and some people leave before it loads.",
    },
    {
      icon: Gauge,
      num: "95+",
      title: "PageSpeed score",
      desc: "Google ranks fast sites higher. Yours sits in the green zone, where competitors are usually in the red.",
    },
  ],
  designHeading: (
    <>
      “Design that sells” isn’t a word — <em>it’s a decision:</em>
    </>
  ),
  bullets: [
    "The button sits where your thumb reaches without stretching.",
    "The main action is visible at a glance.",
    "Color and type carry your brand’s character.",
    "We ease the hesitation first — then place the button.",
  ],
  footnote: (
    <>
      Custom-coded sites run 3× faster than builder sites. Faster means higher
      conversion and better search rankings.
    </>
  ),
};

const UK: ProofCopy = {
  stats: [
    {
      icon: Zap,
      num: "0,5 с",
      title: "час завантаження",
      desc: "Швидше, ніж відвідувач встигне закрити вкладку. Сайти на конструкторах вантажаться 3–5 секунд — частина людей іде, не дочекавшись.",
    },
    {
      icon: Gauge,
      num: "95+",
      title: "оцінка PageSpeed",
      desc: "Google ранжує швидкі сайти вище. Ваш — у зеленій зоні, де конкуренти зазвичай у червоній.",
    },
  ],
  designHeading: (
    <>
      «Дизайн, що продає» — це не слова, <em>а рішення:</em>
    </>
  ),
  bullets: [
    "Кнопка там, куди великий палець дотягується без зусиль.",
    "Головна дія помітна з першого погляду.",
    "Колір і шрифт передають характер вашого бренду.",
    "Спершу знімаємо сумнів — потім ставимо кнопку.",
  ],
  footnote: (
    <>
      Сайти на чистому коді працюють утричі швидше за конструктори. Швидше —
      це вища конверсія й кращі позиції в пошуку.
    </>
  ),
};

export function PerformanceProof({ locale = "uk" }: { locale?: PriceLocale } = {}) {
  const c = locale === "en" ? EN : UK;
  return (
    <section className={hpSectionClass} id="performance">
      <div className={hpInnerClass}>
        <ScrollReveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {c.stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="rounded-2xl border border-line bg-[oklch(1_0_0_/_0.02)] p-7"
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-[oklch(1_0_0_/_0.04)] text-ink-dim">
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <div className="font-actay text-[34px] font-bold leading-none text-ink">
                      {s.num}{" "}
                      <span className="text-[16px] font-semibold uppercase text-ink-dim">
                        — {s.title}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.6] text-ink-dim [text-wrap:pretty]">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-line bg-[oklch(1_0_0_/_0.02)] p-7">
            <h3 className="font-actay text-[22px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-ink md:text-[26px]">
              {c.designHeading}
            </h3>
            <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {c.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 text-[15px] leading-[1.6] text-ink-dim"
                >
                  <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-md border border-line bg-[oklch(1_0_0_/_0.04)] text-ink-dim">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14px] italic leading-[1.6] text-ink-3">{c.footnote}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
