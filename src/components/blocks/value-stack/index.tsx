import type { Locale } from "@/constants/locales";
import type * as React from "react";
import { AppImage } from "@/lib/shared/app-image";
import {
  TrendingUp,
  Target,
  ShieldCheck,
  Gauge,
  Network,
  BarChart3,
  Rocket,
  LifeBuoy,
  Zap,
  Check,
  type LucideIcon,
} from "lucide-react";

import type { PriceLocale } from "@/lib/shared/format-price";
import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";
import { SparkleTrio } from "@/components/homepage/sparkle-trio";
import { cn } from "@/components/ui";

/* ───────────────────────────────────────────────────────────────────────
   WHAT YOU GET — 2026 redesign of the ValueStack band (Figma «код сайт
   арт» frame #1729:2696; audit: docs/home-wyg-figma-audit.md). This band
   ABSORBS the former PerformanceProof section: its 0.5s/95+ stat panels
   and the "design that sells" checklist are §1.4/§1.5 of the design, so
   their copy lives here now and the standalone component is retired.
   Visual system per the design: uniform violet accents (the old per-card
   GREEN/BLUE/CYAN/AMBER tones are gone), photo fills dimmed to 6%, top
   hairline divider on cards, glass stat/checklist panels, right-edge
   chevron decor + one radial-gradient ellipse (docs/glass-ui-patterns.md
   rules: 0x70 peak alpha, container-anchored stage, overflow-x-clip).
   ─────────────────────────────────────────────────────────────────── */

// Design accent — rgba(121,80,201) from the card icon chips (#1729:2741).
const VIOLET = "#7950c9";

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=55`;

type Card = {
  icon: LucideIcon;
  title: string;
  desc: string;
  img: string;
};

type Stat = { icon: LucideIcon; num: string; title: string; desc: string };

type Copy = {
  eyebrow: string;
  heading: React.ReactNode;
  sub: React.ReactNode;
  featured: Card[];
  small: Card[];
  stats: Stat[];
  designHeading: React.ReactNode;
  bullets: string[];
  footnote: React.ReactNode;
};

// Shared image set (locale-independent) so UK + EN stay in sync. The design
// uses its own photo fills at 6% opacity — these read equivalently dimmed.
const IMG = {
  visibility: UNSPLASH("photo-1518773553398-650c184e0bb3"),
  enquiries: UNSPLASH("photo-1480694313141-fce5e697ee25"),
  control: UNSPLASH("photo-1562034475-0292da13283a"),
  performance: UNSPLASH("photo-1501290301209-7a0323622985"),
  scalable: UNSPLASH("photo-1518112166137-85f9979a43aa"),
  analytics: UNSPLASH("photo-1551288049-bebda4e38f71"),
  launch: UNSPLASH("photo-1680992046626-418f7e910589"),
  support: UNSPLASH("photo-1655204903983-73007f15cb3e"),
};

const UK: Copy = {
  eyebrow: "ЩО ВИ ОТРИМУЄТЕ",
  heading: (
    <>
      Наші сайти створені, щоб приводити заявки.
      <br />
      <em>Краса — за замовчуванням.</em>
    </>
  ),
  sub: (
    <>
      Не потрібно окремо наймати дизайнера, копірайтера, SEO-фахівця,
      розробника, хостинг і команду підтримки. Усе необхідне для запуску й
      розвитку сайту вже включено.
    </>
  ),
  featured: [
    {
      icon: TrendingUp,
      title: "Вас знаходять у Google",
      desc: "Побудований так, як любить пошук: структура, швидкість, метадані. Щоб люди, які вже шукають вашу послугу, знаходили саме вас.",
      img: IMG.visibility,
    },
    {
      icon: Target,
      title: "Відвідувачі стають заявками",
      desc: "Чіткі меседжі, шлях до дії за 1–2 кроки та mobile-first верстка — бо саме звідти приходить більшість ваших клієнтів.",
      img: IMG.enquiries,
    },
    {
      icon: ShieldCheck,
      title: "Сайт належить вам",
      desc: "Код, домен, хостинг, доступи, аналітика — все ваше. Вирішите змінити команду? Заберете сайт із собою.",
      img: IMG.control,
    },
  ],
  small: [
    { icon: Gauge, title: "Відкривається за 0,5 с", desc: "0,5 секунди проти 3–5 у типового сайту на конструкторі. Поки їхній ще вантажиться, ваш уже показав форму заявки.", img: IMG.performance },
    { icon: Network, title: "Готовий рости разом із вами", desc: "Нові сторінки, локації та інтеграції додаються поверх наявного — без переробки з нуля.", img: IMG.scalable },
    { icon: BarChart3, title: "Звідки приходять гроші", desc: "Аналітика з першого дня: джерела трафіку, заявки, результати.", img: IMG.analytics },
    { icon: Rocket, title: "Запуск — на нас", desc: "Хостинг, безпека, DNS, деплой — усю технічну частину робимо ми. Ви просто отримуєте ключі.", img: IMG.launch },
    { icon: LifeBuoy, title: "Рік підтримки після запуску", desc: "Виправлення, оновлення й відповіді до 4 годин. Ми поруч цілий рік.", img: IMG.support },
  ],
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

const EN: Copy = {
  eyebrow: "WHAT YOU GET",
  heading: (
    <>
      Our sites are built to bring in leads.
      <br />
      <em>Good looks come as standard.</em>
    </>
  ),
  sub: (
    <>
      No need to separately hire a designer, copywriter, SEO specialist,
      developer, hosting, or a support team. Everything you need to launch
      and grow the site is already included.
    </>
  ),
  featured: [
    {
      icon: TrendingUp,
      title: "You get found on Google",
      desc: "Built the way search likes it: structure, speed, metadata. So the people already searching for your service find you right now.",
      img: IMG.visibility,
    },
    {
      icon: Target,
      title: "Visitors turn into leads",
      desc: "Clear messaging, a path to action in 1–2 steps, and a mobile-first layout — because that’s where most of your clients come from.",
      img: IMG.enquiries,
    },
    {
      icon: ShieldCheck,
      title: "The site is yours",
      desc: "Code, domain, hosting, access, analytics — all yours. Decide to switch teams? You take the site with you.",
      img: IMG.control,
    },
  ],
  small: [
    { icon: Gauge, title: "Opens in 0.5 seconds", desc: "0.5 seconds versus 3–5 on a typical builder-made site. While theirs is still loading, yours has already shown the contact form.", img: IMG.performance },
    { icon: Network, title: "Ready to grow with you", desc: "New pages, locations, and integrations are added on top of what’s there — no rebuild from scratch.", img: IMG.scalable },
    { icon: BarChart3, title: "You see where the money comes from", desc: "Analytics set up from day one: traffic sources, leads, results.", img: IMG.analytics },
    { icon: Rocket, title: "Launch is on us", desc: "Hosting, security, DNS, deployment — we handle all the technical side. You just pick up the keys.", img: IMG.launch },
    { icon: LifeBuoy, title: "A year of support after launch", desc: "Fixes, updates, and replies in under 4 hours. We’re with you the whole year.", img: IMG.support },
  ],
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

const RU: Copy = {
  eyebrow: "ЧТО ВЫ ПОЛУЧАЕТЕ",
  heading: (
    <>
      Наши сайты созданы, чтобы приводить заявки.
      <br />
      <em>Красота — по умолчанию.</em>
    </>
  ),
  sub: (
    <>
      Не нужно отдельно нанимать дизайнера, копирайтера, SEO-специалиста,
      разработчика, хостинг и команду поддержки. Всё необходимое для запуска и
      развития сайта уже включено.
    </>
  ),
  featured: [
    {
      icon: TrendingUp,
      title: "Вас находят в Google",
      desc: "Построен так, как любит поиск: структура, скорость, метаданные. Чтобы люди, которые уже ищут вашу услугу, находили именно вас.",
      img: IMG.visibility,
    },
    {
      icon: Target,
      title: "Посетители становятся заявками",
      desc: "Чёткие сообщения, путь к действию за 1–2 шага и mobile-first вёрстка — ведь именно оттуда приходит большинство ваших клиентов.",
      img: IMG.enquiries,
    },
    {
      icon: ShieldCheck,
      title: "Сайт принадлежит вам",
      desc: "Код, домен, хостинг, доступы, аналитика — всё ваше. Решите сменить команду? Заберёте сайт с собой.",
      img: IMG.control,
    },
  ],
  small: [
    { icon: Gauge, title: "Открывается за 0,5 с", desc: "0,5 секунды против 3–5 у типичного сайта на конструкторе. Пока их ещё грузится, ваш уже показал форму заявки.", img: IMG.performance },
    { icon: Network, title: "Готов расти вместе с вами", desc: "Новые страницы, локации и интеграции добавляются поверх существующего — без переделки с нуля.", img: IMG.scalable },
    { icon: BarChart3, title: "Откуда приходят деньги", desc: "Аналитика с первого дня: источники трафика, заявки, результаты.", img: IMG.analytics },
    { icon: Rocket, title: "Запуск — на нас", desc: "Хостинг, безопасность, DNS, деплой — всю техническую часть делаем мы. Вы просто получаете ключи.", img: IMG.launch },
    { icon: LifeBuoy, title: "Год поддержки после запуска", desc: "Исправления, обновления и ответы до 4 часов. Мы рядом целый год.", img: IMG.support },
  ],
  stats: [
    {
      icon: Zap,
      num: "0,5 с",
      title: "время загрузки",
      desc: "Быстрее, чем посетитель успеет закрыть вкладку. Сайты на конструкторах грузятся 3–5 секунд — часть людей уходит, не дождавшись.",
    },
    {
      icon: Gauge,
      num: "95+",
      title: "оценка PageSpeed",
      desc: "Google ранжирует быстрые сайты выше. Ваш — в зелёной зоне, где конкуренты обычно в красной.",
    },
  ],
  designHeading: (
    <>
      «Дизайн, который продаёт» — это не слова, <em>а решение:</em>
    </>
  ),
  bullets: [
    "Кнопка там, куда большой палец дотягивается без усилий.",
    "Главное действие заметно с первого взгляда.",
    "Цвет и шрифт передают характер вашего бренда.",
    "Сначала снимаем сомнение — потом ставим кнопку.",
  ],
  footnote: (
    <>
      Сайты на чистом коде работают втрое быстрее конструкторов. Быстрее —
      это выше конверсия и лучшие позиции в поиске.
    </>
  ),
};

// Tileable grain (inlined SVG turbulence — asset-free, no percent escaping).
const noiseStyle: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100' height='100' filter='url(%23n)'/></svg>\")",
  backgroundSize: "120px 120px",
};

// Consistent treatment for every card: photo (dimmed to the design's 6%) →
// scrim → hover glow → grain. Uniform violet accent per the redesign.
function CardMedia({ src, sizes }: { src: string; sizes: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <AppImage
        src={src}
        alt=""
        fill
        loading="lazy"
        sizes={sizes}
        quality={55}
        className="object-cover opacity-[0.06] saturate-[0.7] scale-[1.05] transition-[scale,opacity] duration-[0.9s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/vs:scale-[1.1] group-hover/vs:opacity-[0.12]"
      />
      {/* merged static scrim: vignette (top) + accent wash + dark grade — see homepage-cards.css */}
      <div className="hp-vs-scrim" />
      {/* hover accent glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-[0.5s] ease-[cubic-bezier(0.22,1,0.36,1)] bg-[radial-gradient(420px_220px_at_0%_0%,oklch(from_var(--card-accent)_l_c_h_/_0.25),transparent_70%)] group-hover/vs:opacity-100" />
      {/* grain — desktop only */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay hidden md:block"
        // eslint-disable-next-line react/forbid-dom-props -- inlined SVG data-uri grain texture
        style={noiseStyle}
      />
    </div>
  );
}

// Top hairline divider inside each card (Figma "Horizontal Divider": 1px,
// inset 29px, just below the border).
const CARD_DIVIDER = (
  <span aria-hidden="true" className="absolute left-[29px] right-[29px] top-px z-[1] h-px bg-[oklch(1_0_0/0.08)]" />
);

// Card shells/entrance/hover live in src/app/homepage-cards.css as
// `.hp-vs-card` (r26) / `.hp-vs-card-sm` (r20) — both already match the
// design radii. `group/vs` stays as the marker for descendant group-hovers.
const featuredBase = "group/vs hp-vs-card";
const smallBase = "group/vs hp-vs-card-sm";

const accentIconBox =
  "relative z-[1] inline-flex items-center justify-center rounded-2xl border border-[oklch(from_var(--card-accent)_l_c_h_/_0.35)] bg-[oklch(from_var(--card-accent)_l_c_h_/_0.14)] text-[oklch(from_var(--card-accent)_0.85_0.12_h)] [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.06)]";

// ─── Glass panels (stats band #1729:2890/2900 + checklist #1729:2911) ──

const GLASS_PANEL_CLASS =
  "relative rounded-2xl border border-line bg-[oklch(1_0_0/0.02)] p-[29px]";
const STAT_CHIP_CLASS =
  "inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-[oklch(1_0_0/0.04)] text-ink-dim";
const STAT_NUM_CLASS = "font-actay text-[28px] font-bold leading-none text-ink lg:text-[34px]";
const STAT_SUFFIX_CLASS = "text-[15px] lg:text-[16px] text-ink-dim";
const STAT_DESC_CLASS = "mt-4 text-[15px] leading-[1.6] text-ink-dim [text-wrap:pretty]";
const CHECK_CHIP_CLASS =
  "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border border-line bg-[oklch(1_0_0/0.04)] text-ink-dim";

// ─── Decor (container-anchored stage, pattern-doc rules) ───────────────

const DECOR_STAGE_CLASS =
  "absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-container pointer-events-none";
// CS-monogram vectors (#1729:2697): the export strips the placement
// rotation (workflow-doc trap — node box 615×396 vs art 579×326 solves to
// ≈7.2°; sign resolved visually per the candidate-render protocol: the
// design's bars RISE to the right ⇒ rotate(-7.2deg)). Wrapper sits at the
// node box (container-relative 1215,1034), art centered inside at its
// natural 579×326 and rotated — the rotated bbox reproduces the node box.
const CHEVRONS_WRAP_CLASS =
  "hidden lg:flex absolute left-[1215px] top-[1034px] w-[615px] h-[396px] items-center justify-center select-none";
const CHEVRONS_IMG_CLASS = "w-[579px] max-w-none -rotate-[7.2deg]";
// Ellipse 822 (#1729:2458): #642DBA blur-266 → radial, 0x70 peak alpha,
// center container-relative (258, ~1109), footprint 1622×1582.
const E822_CLASS =
  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full max-w-none left-[258px] top-[1109px] w-[1622px] aspect-[1622/1582] bg-[radial-gradient(50%_50%_at_50%_50%,#642DBA70_0%,transparent_70%)]";

const COPY_BY_LOCALE: Record<Locale, Copy> = { uk: UK, en: EN, ru: RU };

export function ValueStack({
  locale = "uk",
  eyebrow,
  heading,
  sub,
}: {
  locale?: PriceLocale;
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
} = {}) {
  const c = COPY_BY_LOCALE[locale];

  return (
    // overflow-x-clip + z-[2]: chevrons/ellipse bleed past the viewport and
    // below the section — pattern-doc rules (h-scroll guard + Figma paint
    // order over the next section's opaque bg).
    <section className={`${hpSectionClass} overflow-x-clip z-[2]`} id="value">
      <div className={DECOR_STAGE_CLASS}>
        <div className={E822_CLASS} aria-hidden="true" />
        <span className={CHEVRONS_WRAP_CLASS} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG decor, no optimizer round-trip */}
          <img src="/wyg/chevrons.svg" alt="" width={579} height={326} loading="lazy" className={CHEVRONS_IMG_CLASS} />
        </span>
      </div>
      <div className={hpInnerClass}>
        {/* Header row: heading left (880), support paragraph + sparkles right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,880px)_minmax(0,1fr)] lg:gap-12 lg:items-start">
          <SectionHead eyebrow={eyebrow ?? c.eyebrow} heading={heading ?? c.heading} />
          <div className="hidden lg:flex flex-col self-stretch pt-[70px]">
            <p className="max-w-[508px] text-[16px] leading-[1.6] text-ink-dim">{sub ?? c.sub}</p>
            {/* Figma: trio bottom-aligned with the header block, sitting 46px
                clear of the cards (sparkles end y299.75, cards start y346.19).
                The column stretches into SectionHead's 40px bottom margin, so
                mt-auto alone pins the trio flush to the cards — pb-[46px]
                restores the design gap; pt-14 keeps air on shorter locales. */}
            <SparkleTrio className="mt-auto flex justify-end pt-14 pb-[46px]" />
          </div>
          {/* Mobile: support paragraph in flow (sparkles are desktop decor) */}
          <p className="lg:hidden -mt-4 mb-2 text-[15px] leading-[1.6] text-ink-dim">{sub ?? c.sub}</p>
        </div>

        <ScrollReveal className="group/vs-reveal">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {c.featured.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={featuredBase}
                  // eslint-disable-next-line react/forbid-dom-props -- per-card accent + stagger CSS vars
                  style={{ "--card-accent": VIOLET, "--i": i } as React.CSSProperties}
                >
                  {CARD_DIVIDER}
                  <CardMedia src={card.img} sizes="(min-width:1100px) 33vw, (min-width:768px) 50vw, 92vw" />
                  <div className="relative z-[1] flex flex-1 flex-col">
                    <span className={cn(accentIconBox, "size-12")}>
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <h3 className="mt-auto pt-10 font-actay text-[24px] font-bold uppercase leading-[1.1] tracking-[-0.01em] text-ink lg:text-[28px]">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-[42ch] text-[14.5px] leading-[1.6] text-ink-dim [text-wrap:pretty]">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {c.small.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={smallBase}
                  // eslint-disable-next-line react/forbid-dom-props -- per-card accent + stagger CSS vars
                  style={{ "--card-accent": VIOLET, "--i": i } as React.CSSProperties}
                >
                  {CARD_DIVIDER}
                  <CardMedia src={card.img} sizes="(min-width:1100px) 20vw, (min-width:768px) 33vw, (min-width:640px) 50vw, 92vw" />
                  <span className={cn(accentIconBox, "size-10")}>
                    <Icon size={18} strokeWidth={1.7} />
                  </span>
                  <h4 className="relative z-[1] mt-4 font-actay text-[15.5px] font-semibold uppercase leading-[1.2] tracking-[0.01em] text-ink">
                    {card.title}
                  </h4>
                  <p className="relative z-[1] mt-1.5 text-[13px] leading-[1.5] text-ink-dim [text-wrap:pretty]">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Stats band — the former PerformanceProof panels (Figma §1.4) */}
          <div className="mt-16 grid grid-cols-1 gap-4 lg:mt-[90px] lg:grid-cols-2">
            {c.stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num + s.title} className={GLASS_PANEL_CLASS}>
                  <div className="flex items-center gap-4">
                    <span className={STAT_CHIP_CLASS}>
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <p className="m-0 flex items-baseline gap-2.5">
                      <span className={STAT_NUM_CLASS}>{s.num}</span>
                      <span className={STAT_SUFFIX_CLASS}>— {s.title}</span>
                    </p>
                  </div>
                  <p className={STAT_DESC_CLASS}>{s.desc}</p>
                </div>
              );
            })}
          </div>

          {/* "Design that sells" checklist panel (Figma §1.5) */}
          <div className={cn(GLASS_PANEL_CLASS, "mt-4")}>
            <h3 className="m-0 font-actay text-[20px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-ink lg:text-[26px] [&_em]:not-italic [&_em]:text-inherit">
              {c.designHeading}
            </h3>
            <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-x-6 gap-y-3 p-0 lg:grid-cols-2">
              {c.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className={CHECK_CHIP_CLASS}>
                    <Check size={12} strokeWidth={2.4} />
                  </span>
                  <span className="text-[15px] leading-[1.6] text-ink-dim">{b}</span>
                </li>
              ))}
            </ul>
            <p className="m-0 mt-6 text-[13.9px] leading-[1.5] text-ink-3">{c.footnote}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
