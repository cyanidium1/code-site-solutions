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
      Створений, щоб приводити заявки.
      <br />
      <em>Краса — за замовчуванням.</em>
    </>
  ),
  sub: (
    <>
      Вам не потрібні окремо дизайнери, копірайтери, SEO-фахівці, розробники, хостинг
      і команда підтримки. Усе необхідне, щоб запустити, розвивати й підтримувати сайт,
      уже включено.
    </>
  ),
  featured: [
    {
      icon: TrendingUp,
      title: "Видимість у Google",
      desc: "Побудований на SEO-дружній архітектурі: індексація, метадані й структура контенту, які допомагають вашому бізнесу бути знайденим.",
      tone: GREEN,
      img: IMG.visibility,
    },
    {
      icon: Target,
      title: "Більше заявок",
      desc: "Чіткі меседжі, конверсійний дизайн і mobile-first макети, що перетворюють відвідувачів на заявки.",
      tone: PURPLE,
      img: IMG.enquiries,
    },
    {
      icon: ShieldCheck,
      title: "Сайт належить вам",
      desc: "Ваш контент, сторінки, SEO і бізнес-дані залишаються під вашим контролем. Без прив’язки до платформи.",
      tone: PURPLE,
      img: IMG.control,
    },
  ],
  small: [
    { icon: Gauge, title: "Швидка робота", desc: "Швидке завантаження на мобільному й десктопі — відвідувачі залишаються, а не йдуть.", tone: BLUE, img: IMG.performance },
    { icon: Network, title: "Готовність до росту", desc: "Готовий розширюватися: нові сторінки, інтеграції, локації і SEO.", tone: PURPLE, img: IMG.scalable },
    { icon: BarChart3, title: "Звідки приходять ліди", desc: "Відстежуйте заявки, джерела трафіку й результати бізнесу — аналітика налаштована з запуску.", tone: CYAN, img: IMG.analytics },
    { icon: Rocket, title: "Запуск беремо на себе", desc: "Хостинг, безпека, DNS, деплой і налаштування go-live — усе робимо за вас.", tone: AMBER, img: IMG.launch },
    { icon: LifeBuoy, title: "Підтримка 1 рік", desc: "Технічна підтримка, виправлення й оновлення включені цілий рік після запуску.", tone: PURPLE, img: IMG.support },
  ],
};

const EN: Copy = {
  eyebrow: "WHAT YOU GET",
  heading: (
    <>
      Built to generate leads.
      <br />
      <em>Good looks come standard.</em>
    </>
  ),
  sub: (
    <>
      You don&apos;t need separate designers, copywriters, SEO specialists, developers,
      hosting providers and support teams. Everything required to launch, grow and maintain
      your website is already included.
    </>
  ),
  featured: [
    {
      icon: TrendingUp,
      title: "Google visibility",
      desc: "Built with SEO-friendly architecture, indexing, metadata and content structure that help your business get discovered.",
      tone: GREEN,
      img: IMG.visibility,
    },
    {
      icon: Target,
      title: "More enquiries",
      desc: "Clear messaging, conversion-focused design and mobile-first layouts that turn visitors into enquiries.",
      tone: PURPLE,
      img: IMG.enquiries,
    },
    {
      icon: ShieldCheck,
      title: "Own your website",
      desc: "Your content, pages, SEO and business data remain under your control. No platform lock-in.",
      tone: PURPLE,
      img: IMG.control,
    },
  ],
  small: [
    { icon: Gauge, title: "Fast performance", desc: "Fast loading on mobile and desktop so visitors stay engaged instead of leaving.", tone: BLUE, img: IMG.performance },
    { icon: Network, title: "Scalable foundation", desc: "Built to grow with additional pages, integrations, locations and SEO expansion.", tone: PURPLE, img: IMG.scalable },
    { icon: BarChart3, title: "Know where leads come from", desc: "Track enquiries, traffic sources and business performance with analytics configured from launch.", tone: CYAN, img: IMG.analytics },
    { icon: Rocket, title: "We handle the launch", desc: "Hosting, security, DNS, deployment and go-live configuration are handled for you.", tone: AMBER, img: IMG.launch },
    { icon: LifeBuoy, title: "1 year of support", desc: "Technical support, fixes and updates included for a full year after launch.", tone: PURPLE, img: IMG.support },
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
      {/* dark grade — keeps text readable, darker toward the bottom */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.13_0_0_/_0.74)_0%,oklch(0.11_0_0_/_0.86)_55%,oklch(0.1_0_0_/_0.95)_100%)]" />
      {/* per-card accent wash for identity */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(from_var(--card-accent)_l_c_h_/_0.18),transparent_55%)]" />
      {/* hover accent glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-[0.5s] ease-[cubic-bezier(0.22,1,0.36,1)] bg-[radial-gradient(420px_220px_at_0%_0%,oklch(from_var(--card-accent)_l_c_h_/_0.25),transparent_70%)] group-hover/vs:opacity-100" />
      {/* soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_120%_at_50%_-10%,transparent_45%,oklch(0.07_0_0_/_0.55)_100%)]" />
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
