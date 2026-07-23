import type * as React from "react";
import Link from "next/link";
import { AppImage } from "@/lib/shared/app-image";
import {
  Stethoscope,
  Scale,
  Calculator,
  ShoppingCart,
  Building,
  Car,
  Home,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

import type { Industry } from "@/types/homepage";
import { SectionHead } from "@/components/shared/section-head";
import { cn } from "@/components/ui";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { industryAccent } from "@/constants/industry-colors";

// All 8 industries have published Sanity pages and live hrefs.
const DEFAULT_INDUSTRIES: Industry[] = [
  {
    icon: Stethoscope,
    title: "Healthcare / Medicine",
    description: "Сайти для клінік, стоматологій, діагностичних центрів",
    tags: ["Helsi", "Medesk", "Online booking"],
    price: "Від $3 500 · 4-10 тижнів",
    href: "/sites-for/medicine",
  },
  {
    icon: Building,
    title: "Construction / Renovation",
    description: "Сайти для будівельних і ремонтних компаній",
    tags: ["CRM", "Calculator", "Local SEO"],
    price: "Від $3 500 · 4-8 тижнів",
    href: "/sites-for/renovation",
  },
  {
    icon: Scale,
    title: "Legal & Attorneys",
    description: "Сайти для юр. фірм, адвокатських бюро, приватних юристів",
    tags: ["Clio", "Diia.Sign", "Online consult"],
    price: "Від $3 500 · 4-8 тижнів",
    href: "/sites-for/legal",
  },
  {
    icon: Calculator,
    title: "Фінанси і бухгалтерія",
    description: "Сайти для бух-фірм, фінансових радників, трейдинг-сервісів",
    tags: ["MEDoc", "Stripe", "1С/BAS"],
    price: "Від $3 500 · 4-8 тижнів",
    href: "/sites-for/finance",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Інтернет-магазини, маркетплейси, B2B-каталоги",
    tags: ["Stripe", "LiqPay", "Нова Пошта"],
    price: "Від $3 000 · 6-10 тижнів",
    href: "/sites-for/ecommerce",
  },
  {
    icon: Car,
    title: "Авто-індустрія",
    description: "Сайти для імпорту авто, автодилерів, СТО і сервісних послуг",
    tags: ["Copart", "PDF-invoice", "Multi-lang"],
    price: "Від $3 000 · 6-10 тижнів",
    href: "/sites-for/auto",
  },
  {
    icon: Home,
    title: "Нерухомість",
    description: "Сайти для агенцій нерухомості, забудовників, private listings",
    tags: ["Multi-lang", "Multi-currency", "Mortgage"],
    price: "Від $4 000 · 6-10 тижнів",
    href: "/sites-for/real-estate",
  },
  {
    icon: GraduationCap,
    title: "Курси і лендинги",
    description: "Сайти для онлайн-курсів, інфо-продуктів, блогерських воронок",
    tags: ["Stripe", "Teachable", "A/B"],
    price: "Від $800 · 4-8 тижнів",
    href: "/sites-for/courses",
  },
];

// Atmospheric background photo per industry, keyed by the trailing href slug
// (e.g. "/sites-for/medicine" and "/en/sites-for/medicine" → "medicine") so the
// UK and EN content arrays resolve the same image without duplication.
// Curated for environments / equipment / documents / systems — no people-posing
// or cliché stock. All get the same dark grade + grain + vignette treatment.
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=60`;

const INDUSTRY_MEDIA: Record<string, string> = {
  medicine: UNSPLASH("photo-1513224502586-d1e602410265"), // patient monitor / ECG
  renovation: UNSPLASH("photo-1721244653693-1d13e68b66c1"), // architectural elevation drawing
  legal: UNSPLASH("photo-1521791055366-0d553872125f"), // signing a document, close-up
  finance: UNSPLASH("photo-1554224154-26032ffc0d07"), // tax forms + calculator flat-lay
  ecommerce: UNSPLASH("photo-1601598704991-eef6114775e0"), // warehouse fulfilment aisle
  auto: "/industries/auto.jpg", // orange 6th-gen Camaro SS (pre-facelift), alpine — local asset
  "real-estate": UNSPLASH("photo-1633449227338-45d2df8c37b7"), // architectural interior
  courses: UNSPLASH("photo-1525373698358-041e3a460346"), // dark laptop, code/landing editor
};

// Per-card treatment overrides for photos that need to read more literally
// (e.g. a specific car) — a brighter image + a lighter scrim. Merged over the
// CardMedia defaults via tailwind-merge, so other cards keep the atmospheric grade.
const MEDIA_TUNE: Record<string, { img?: string; dim?: string }> = {
  auto: {
    img: "opacity-[0.85] saturate-[0.85] object-[64%_62%] group-hover/ind:opacity-[0.95]",
    dim: "bg-[linear-gradient(180deg,oklch(0.12_0_0_/_0.5)_0%,oklch(0.11_0_0_/_0.7)_58%,oklch(0.1_0_0_/_0.92)_100%)]",
  },
};

// Tileable monochrome grain. Inlined SVG turbulence keeps it asset-free and
// avoids the percent-sign escaping that breaks Tailwind arbitrary url() values.
const noiseStyle: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100' height='100' filter='url(%23n)'/></svg>\")",
  backgroundSize: "120px 120px",
};

// Layered atmospheric background: photo → dark grade + accent wash → vignette →
// grain, plus a hover-only accent glow and a subtle image push (parallax feel).
// `aria-hidden` + empty alt: decorative only, content stays the accessible layer.
function CardMedia({ src, imgClass, dimClass }: { src: string; imgClass?: string; dimClass?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[18px]"
    >
      <AppImage
        src={src}
        alt=""
        fill
        loading="lazy"
        sizes="(min-width:1100px) 24vw, (min-width:768px) 48vw, 92vw"
        quality={60}
        className={cn(
          "object-cover opacity-[0.55] saturate-[0.65] scale-[1.04] transition-[scale,opacity] duration-[0.9s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/ind:scale-[1.14] group-hover/ind:opacity-[0.7]",
          imgClass,
        )}
      />
      {/* dark grade for readability — darker toward the bottom where price sits */}
      <div className={cn("absolute inset-0 bg-[linear-gradient(180deg,oklch(0.13_0_0_/_0.58)_0%,oklch(0.12_0_0_/_0.82)_55%,oklch(0.1_0_0_/_0.94)_100%)] transition-opacity duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/ind:opacity-90", dimClass)} />
      {/* merged static scrim: vignette (top) + per-industry accent wash — see homepage-cards.css */}
      <div className="hp-ind-scrim" />
      {/* hover accent glow (replaces the photo-occluded ::before radial) */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] bg-[radial-gradient(420px_220px_at_0%_0%,oklch(from_var(--accent-color,var(--color-accent))_l_c_h_/_0.30),transparent_70%)] group-hover/ind:opacity-100" />
      {/* grain — desktop only, mobile keeps it simpler */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay hidden md:block"
        // eslint-disable-next-line react/forbid-dom-props -- inlined SVG data-uri grain texture
        style={noiseStyle}
      />
    </div>
  );
}

// Card shell + hover pseudo-elements live in src/app/homepage-cards.css as
// `.hp-ind-card` (this 869 B stack repeated 8× cost ~14 KB of document —
// HTML + RSC flight, see docs/rsc-payload-report.md). Hover styles bind to
// `a.hp-ind-card`, so the enabled Link gets them and the disabled <div>
// doesn't. `group/ind` stays as the marker for descendant group-hovers;
// per-industry tint arrives via --accent-color.
const cardBase = "group/ind hp-ind-card";

const cardDisabled = "cursor-default opacity-[0.78]";

export function Industries({
  eyebrow = "РІШЕННЯ",
  heading = (
    <>
      Спеціалізовані рішення під <em>вашу галузь</em>
    </>
  ),
  sub = "Комплексне рішення під вашу галузь — з інтеграціями і compliance.",
  items = DEFAULT_INDUSTRIES,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  items?: Industry[];
} = {}) {
  return (
    <section className={hpSectionClass} id="solutions">
      <div className={hpInnerClass}>
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {items.map((ind, i) => {
            const Icon = ind.icon;
            const inner = (
              <>
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-line bg-[oklch(from_var(--accent-color,var(--color-accent))_l_c_h_/_0.12)] text-[var(--accent-color,var(--color-accent))]">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h3 className="m-0 font-sans text-[17px] font-semibold text-ink">{ind.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.55] text-ink-dim">{ind.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {ind.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex rounded-md border border-line bg-[oklch(1_0_0_/_0.03)] px-2 py-[3px] font-mono text-[10.5px] text-ink-3"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-line pt-5">
                  <span className="font-mono text-[11px] text-ink-3">{ind.price}</span>
                  {ind.href ? (
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.8}
                      className="text-[var(--accent-color,var(--color-accent))] transition-[translate] duration-[0.45s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/ind:translate-x-1 group-hover/ind:-translate-y-1"
                    />
                  ) : null}
                </div>
              </>
            );
            const slug = ind.href?.split("/").pop() ?? "";
            const cardStyle = { "--accent-color": industryAccent(slug) } as React.CSSProperties;
            const mediaSrc = INDUSTRY_MEDIA[slug];
            const mediaTune = MEDIA_TUNE[slug];
            const body = (
              <>
                {mediaSrc ? (
                  <CardMedia src={mediaSrc} imgClass={mediaTune?.img} dimClass={mediaTune?.dim} />
                ) : null}
                <div className="relative z-[1] flex flex-1 flex-col">{inner}</div>
              </>
            );
            if (!ind.href) {
              return (
                <div
                  key={ind.title + i}
                  className={cn(cardBase, cardDisabled)}
                  // eslint-disable-next-line react/forbid-dom-props -- dynamic per-industry accent color
                  style={cardStyle}
                >
                  {body}
                </div>
              );
            }
            return (
              <Link
                key={ind.href}
                href={ind.href}
                className={cardBase}
                style={cardStyle}
              >
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
