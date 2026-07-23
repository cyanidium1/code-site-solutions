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
  type LucideIcon,
} from "lucide-react";

import type { PriceLocale } from "@/lib/shared/format-price";
import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";
import { cn } from "@/components/ui";

// Per-card accent (raw oklch → assigned to --card-accent). Purple dominant,
// with green / blue / cyan / amber used per the card's meaning.
const PURPLE = "oklch(0.62 0.16 295)";
const GREEN = "oklch(0.66 0.15 150)";
const BLUE = "oklch(0.62 0.13 245)";
const CYAN = "oklch(0.7 0.12 200)";
const AMBER = "oklch(0.72 0.14 70)";

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=55`;

type Card = {
  icon: LucideIcon;
  title: string;
  desc: string;
  tone: string;
  img: string;
};

type Copy = {
  eyebrow: string;
  heading: React.ReactNode;
  sub: React.ReactNode;
  featured: Card[];
  small: Card[];
};

// Shared image set (locale-independent) so UK + EN stay in sync.
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
      tone: GREEN,
      img: IMG.visibility,
    },
    {
      icon: Target,
      title: "Відвідувачі стають заявками",
      desc: "Чіткі меседжі, шлях до дії за 1–2 кроки та mobile-first верстка — бо саме звідти приходить більшість ваших клієнтів.",
      tone: PURPLE,
      img: IMG.enquiries,
    },
    {
      icon: ShieldCheck,
      title: "Сайт належить вам",
      desc: "Код, домен, хостинг, доступи, аналітика — все ваше. Вирішите змінити команду? Заберете сайт із собою.",
      tone: PURPLE,
      img: IMG.control,
    },
  ],
  small: [
    { icon: Gauge, title: "Відкривається за 0,5 с", desc: "0,5 секунди проти 3–5 у типового сайту на конструкторі. Поки їхній ще вантажиться, ваш уже показав форму заявки.", tone: BLUE, img: IMG.performance },
    { icon: Network, title: "Готовий рости разом із вами", desc: "Нові сторінки, локації та інтеграції додаються поверх наявного — без переробки з нуля.", tone: PURPLE, img: IMG.scalable },
    { icon: BarChart3, title: "Звідки приходять гроші", desc: "Аналітика з першого дня: джерела трафіку, заявки, результати.", tone: CYAN, img: IMG.analytics },
    { icon: Rocket, title: "Запуск — на нас", desc: "Хостинг, безпека, DNS, деплой — усю технічну частину робимо ми. Ви просто отримуєте ключі.", tone: AMBER, img: IMG.launch },
    { icon: LifeBuoy, title: "Рік підтримки після запуску", desc: "Виправлення, оновлення й відповіді до 4 годин. Ми поруч цілий рік.", tone: PURPLE, img: IMG.support },
  ],
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
      tone: GREEN,
      img: IMG.visibility,
    },
    {
      icon: Target,
      title: "Visitors turn into leads",
      desc: "Clear messaging, a path to action in 1–2 steps, and a mobile-first layout — because that’s where most of your clients come from.",
      tone: PURPLE,
      img: IMG.enquiries,
    },
    {
      icon: ShieldCheck,
      title: "The site is yours",
      desc: "Code, domain, hosting, access, analytics — all yours. Decide to switch teams? You take the site with you.",
      tone: PURPLE,
      img: IMG.control,
    },
  ],
  small: [
    { icon: Gauge, title: "Opens in 0.5 seconds", desc: "0.5 seconds versus 3–5 on a typical builder-made site. While theirs is still loading, yours has already shown the contact form.", tone: BLUE, img: IMG.performance },
    { icon: Network, title: "Ready to grow with you", desc: "New pages, locations, and integrations are added on top of what’s there — no rebuild from scratch.", tone: PURPLE, img: IMG.scalable },
    { icon: BarChart3, title: "You see where the money comes from", desc: "Analytics set up from day one: traffic sources, leads, results.", tone: CYAN, img: IMG.analytics },
    { icon: Rocket, title: "Launch is on us", desc: "Hosting, security, DNS, deployment — we handle all the technical side. You just pick up the keys.", tone: AMBER, img: IMG.launch },
    { icon: LifeBuoy, title: "A year of support after launch", desc: "Fixes, updates, and replies in under 4 hours. We’re with you the whole year.", tone: PURPLE, img: IMG.support },
  ],
};

// Tileable grain (inlined SVG turbulence — asset-free, no percent escaping).
const noiseStyle: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100' height='100' filter='url(%23n)'/></svg>\")",
  backgroundSize: "120px 120px",
};

// Consistent treatment for every card: photo → dark grade → accent wash →
// vignette → grain. Same recipe across all cards so the section reads as one
// system; only --card-accent and the source image differ.
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
        className="object-cover opacity-[0.22] saturate-[0.7] scale-[1.05] transition-[scale,opacity] duration-[0.9s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/vs:scale-[1.1] group-hover/vs:opacity-[0.3]"
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

// Card shells/entrance/hover live in src/app/homepage-cards.css as
// `.hp-vs-card` / `.hp-vs-card-sm` (these 1.2 KB ×3 + 660 B ×5 stacks cost
// ~13 KB of document — HTML + RSC flight, see docs/rsc-payload-report.md).
// `group/vs` stays as the marker for descendant group-hovers; the reveal
// state comes from ScrollReveal's data-visible on the group container.
const featuredBase = "group/vs hp-vs-card";

const smallBase = "group/vs hp-vs-card-sm";

const accentIconBox =
  "relative z-[1] inline-flex items-center justify-center rounded-2xl border border-[oklch(from_var(--card-accent)_l_c_h_/_0.35)] bg-[oklch(from_var(--card-accent)_l_c_h_/_0.14)] text-[oklch(from_var(--card-accent)_0.85_0.12_h)] [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.06)]";

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
  const c = locale === "en" ? EN : UK;

  return (
    <section className={hpSectionClass} id="value">
      <div className={hpInnerClass}>
        <SectionHead eyebrow={eyebrow ?? c.eyebrow} heading={heading ?? c.heading} sub={sub ?? c.sub} />

        <ScrollReveal className="group/vs-reveal">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {c.featured.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={featuredBase}
                  // eslint-disable-next-line react/forbid-dom-props -- per-card accent + stagger CSS vars
                  style={{ "--card-accent": card.tone, "--i": i } as React.CSSProperties}
                >
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
                  style={{ "--card-accent": card.tone, "--i": i } as React.CSSProperties}
                >
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
        </ScrollReveal>
      </div>
    </section>
  );
}
