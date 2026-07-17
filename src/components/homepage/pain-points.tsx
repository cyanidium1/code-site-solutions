import type * as React from "react";
import { MousePointerBan, EyeOff, TrendingDown, Lock, type LucideIcon } from "lucide-react";

import type { PriceLocale } from "@/lib/shared/format-price";
import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";

type PainCopy = {
  eyebrow: string;
  heading: React.ReactNode;
  pains: { icon: LucideIcon; text: string }[];
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
      icon: TrendingDown,
      text: "You’re spending on ads — but the leads aren’t coming.",
    },
    {
      icon: EyeOff,
      text: "Your site looks like something you’d rather not send a client.",
    },
    {
      icon: MousePointerBan,
      text: "The competitor down the road is weaker than you — yet looks more credible online, so people go to them.",
    },
    {
      icon: Lock,
      text: "Your last developer built a site you can’t even edit the text on yourself.",
    },
  ],
  punch: (
    <>
      Nine times out of ten it’s not the ads or the price.{" "}
      <em>It’s that the site isn’t doing its job — bringing in leads.</em>
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
      icon: TrendingDown,
      text: "Ви витрачаєте на рекламу — а заявок немає.",
    },
    {
      icon: EyeOff,
      text: "Сайт виглядає так, що його соромно надіслати клієнту.",
    },
    {
      icon: MousePointerBan,
      text: "Конкурент поруч слабший за вас — але онлайн виглядає солідніше, і клієнти йдуть до нього.",
    },
    {
      icon: Lock,
      text: "Попередній розробник зробив сайт, у якому ви навіть текст не можете змінити самостійно.",
    },
  ],
  punch: (
    <>
      У дев’яти випадках із десяти справа не в рекламі й не в ціні.{" "}
      <em>Просто сайт не виконує свою роботу — не приводить заявки.</em>
    </>
  ),
};

export function PainPoints({ locale = "uk" }: { locale?: PriceLocale } = {}) {
  const c = locale === "en" ? EN : UK;
  return (
    <section className={hpSectionClass} id="pains">
      <div className={hpInnerClass}>
        <SectionHead eyebrow={c.eyebrow} heading={c.heading} />
        <ScrollReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.pains.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="rounded-2xl border border-line bg-[oklch(1_0_0_/_0.02)] p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-[oklch(1_0_0_/_0.04)] text-ink-dim">
                  <Icon size={20} strokeWidth={1.7} />
                </span>
                <p className="mt-4 text-[15px] leading-[1.6] text-ink-dim [text-wrap:pretty]">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-[62ch] text-center font-actay text-[20px] font-bold uppercase leading-[1.3] tracking-[-0.01em] text-ink md:text-[24px]">
            {c.punch}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
