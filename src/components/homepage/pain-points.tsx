import type { Locale } from "@/constants/locales";
import type * as React from "react";
import { MousePointerBan, EyeOff, TrendingDown, Lock, type LucideIcon } from "lucide-react";

import type { PriceLocale } from "@/lib/shared/format-price";
import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";
import { GradientRule } from "@/components/homepage/gradient-rule";

/* 2026 redesign restyle (Figma «код сайт арт» #1729:2078; audit:
   docs/home-problem-figma-audit.md). Deltas vs the legacy look are local to
   this file — the shared hp* classes serve other pages unchanged. */

// Decor stage — mirrors the content container (hero lesson, job #138) so the
// two flanking glows track the content at every viewport. Sits behind
// hpInnerClass (z-[1]); body-level overflow-x-clip absorbs the horizontal
// bleed, and the upward bleed toward the hero is design intent.
const DECOR_STAGE_CLASS =
  "absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-container pointer-events-none";

// Figma blur-266 ellipses as static radial gradients (job-#135 rule).
// Centers are container-relative px (Figma x − 240 / y − section top ≈880);
// footprint = 558×518 node + blur bleed ≈ 1622×1582. Peak alpha 0x70 (44%):
// a Gaussian blur of a solid ellipse never reaches full saturation, so the
// stand-in starts at partial alpha to match the Figma intensity (job #142).
const ELLIPSE_BASE =
  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full max-w-none w-[1622px] aspect-[1622/1582]";
const ELLIPSE_LEFT_CLASS = // #1729:2075 — deep indigo, left edge
  `${ELLIPSE_BASE} left-[-149px] top-[215px] bg-[radial-gradient(50%_50%_at_50%_50%,#19004D70_0%,transparent_70%)]`;
const ELLIPSE_RIGHT_CLASS = // #1729:2074 — violet, right edge
  `${ELLIPSE_BASE} left-[1736px] top-[327px] bg-[radial-gradient(50%_50%_at_50%_50%,#642DBA70_0%,transparent_70%)]`;

// Card: Figma #1729:2088 — white-2% fill, white-8% border (=border-line),
// rounded-16, px25/pt25/pb49 (deep bottom air). The Figma GLASS effect
// (radius 22) did not survive the code export; pixel-sampling the node
// render (job #143) shows THREE layers on top of the fill+border:
//   1. backdrop blur 22 (12 below lg — blur policy)
//   2. a diagonal sheen: surface lifts to ~white-5% at the top-left,
//      settling to ~2% toward the bottom-right (light from top-left)
//   3. a specular rim: 1px ring highlight concentrated at the top-left
//      corner (sampled ~white-25% there), fading out along top/left —
//      done with the shared `glass-ring` masked-overlay utility
const CARD_CLASS =
  "glass-ring rounded-2xl border border-line px-[25px] pt-[25px] pb-[49px] " +
  "bg-[linear-gradient(135deg,oklch(1_0_0/0.05)_0%,oklch(1_0_0/0.018)_45%,oklch(1_0_0/0.025)_100%)] " +
  "backdrop-blur-[12px] lg:backdrop-blur-[22px] " +
  "[--glass-ring-bg:linear-gradient(135deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0.04)_45%,rgba(255,255,255,0)_70%)]";

// Punch line — Figma #1729:2119: Actay Wide Bold 24/31.2, tracking −0.24px,
// uppercase, Whisper, single colour (the copy's <em> is neutralized).
const PUNCH_ROW_CLASS = "mt-10 lg:mt-[81px] flex items-center justify-center gap-8";
const PUNCH_TEXT_CLASS =
  "max-w-[789px] text-center font-actay text-[20px] font-bold uppercase leading-[1.3] tracking-[-0.01em] text-ink md:text-[24px] " +
  "[&_em]:not-italic [&_em]:text-inherit";

// Flanking rules — Figma #1729:2068, 294px wide. The shared `GradientRule`
// carries the art (dot caps + `#111111 → #7C54CD`); the right side mirrors
// via its `flip` prop.
const PUNCH_RULE_CLASS = "hidden lg:flex w-[294px]";

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

const RU: PainCopy = {
  eyebrow: "ПРОБЛЕМА",
  heading: (
    <>
      Звучит <em>знакомо?</em>
    </>
  ),
  pains: [
    {
      icon: TrendingDown,
      text: "Вы тратите на рекламу — а заявок нет.",
    },
    {
      icon: EyeOff,
      text: "Сайт выглядит так, что его стыдно отправить клиенту.",
    },
    {
      icon: MousePointerBan,
      text: "Конкурент слабее вас — но онлайн выглядит убедительнее, и люди идут к нему.",
    },
    {
      icon: Lock,
      text: "Прошлый разработчик сделал сайт, на котором вы даже текст не можете поменять сами.",
    },
  ],
  punch: (
    <>
      В девяти случаях из десяти дело не в рекламе и не в цене.{" "}
      <em>Дело в том, что сайт не выполняет свою работу — не приводит заявки.</em>
    </>
  ),
};

const COPY_BY_LOCALE: Record<Locale, PainCopy> = { uk: UK, en: EN, ru: RU };

export function PainPoints({ locale = "uk" }: { locale?: PriceLocale } = {}) {
  const c = COPY_BY_LOCALE[locale];
  return (
    // overflow-x-clip: the flanking glows bleed ~1100px past the viewport;
    // body's overflow-x-clip does NOT stop html-level horizontal scroll, so
    // the section clips its own x-axis (y stays visible — clip+visible is a
    // valid Overflow-3 pair; the upward bleed toward the hero survives).
    // z-[2]: the next section's opaque bg-bg (hpSectionClass) was cutting
    // the DOWNWARD bleed; lifting this section lets the glow overlay the
    // neighbor's top — same paint order as the Figma canvas, where these
    // ellipses sit above the surrounding frames (job #142).
    <section className={`${hpSectionClass} overflow-x-clip z-[2]`} id="pains">
      <div className={DECOR_STAGE_CLASS}>
        <div className={ELLIPSE_LEFT_CLASS} aria-hidden="true" />
        <div className={ELLIPSE_RIGHT_CLASS} aria-hidden="true" />
      </div>
      <div className={hpInnerClass}>
        <SectionHead eyebrow={c.eyebrow} heading={c.heading} />
        <ScrollReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.pains.map(({ icon: Icon, text }) => (
              <div key={text} className={CARD_CLASS}>
                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-[oklch(1_0_0_/_0.04)] text-ink-dim">
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <p className="mt-4 text-[15px] leading-[1.6] text-ink-dim [text-wrap:pretty]">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <div className={PUNCH_ROW_CLASS}>
            <GradientRule className={PUNCH_RULE_CLASS} />
            <p className={PUNCH_TEXT_CLASS}>{c.punch}</p>
            <GradientRule className={PUNCH_RULE_CLASS} flip />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
