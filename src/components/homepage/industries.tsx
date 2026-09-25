import type * as React from "react";
import Link from "next/link";
import { AppImage } from "@/lib/shared/app-image";
import {
  Stethoscope,
  Scale,
  Calculator,
  Building,
  Car,
  Home,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

import type { Locale } from "@/constants/locales";
import {
  INDUSTRIES,
  INDUSTRY_ORDER,
  formatPackageTerm,
  industryPrice,
  type IndustryId,
} from "@/constants/pricing";
import { localizePath } from "@/constants/i18n-routes";
import { formatPrice } from "@/lib/shared/format-price";

import type { Industry } from "@/types/homepage";
import { cn } from "@/components/ui";
import { hpH2Class, hpInnerClass, hpSectionClass, hpSubClass } from "@/components/homepage/shared";
import { industryAccent } from "@/constants/industry-colors";

/* 2026 redesign restyle (Figma «код сайт арт» #1729:2120; audit:
   docs/home-industries-figma-audit.md). The design was derived from this
   component — cards, accent palette and EN copy already matched — so the
   deltas are the header decor plus small type/padding nudges.

   NOTE: this section carries NO decor of its own. The glow bleeding up from
   below is Ellipse 821 (#1729:2069, abs y4205), a sibling of the NEXT band
   (Why Us) — it ships with that section, not here. */

// Header — Figma #1729:2121. No eyebrow badge in the design.
const HEADER_CLASS = "mb-10";
// Heading row. (The dot-capped gradient rule that filled the track is gone —
// DESIGN.md, 2026-09-25: decoration without information.)
const HEADING_ROW_CLASS = "flex items-center gap-8 2xl:gap-11";
// Sub row under the heading.
const SUB_ROW_CLASS = "mt-5 flex items-end justify-between gap-8";

// Six industry variants of the `industry` package (TZ v2 §3.6). Price and
// term come from the pricing config; only the card copy lives here. Online
// shops and landing pages are packages now, not industries.
type IndustryCopy = { description: string; tags: string[] };

const INDUSTRY_ICONS: Record<IndustryId, LucideIcon> = {
  medicine: Stethoscope,
  renovation: Building,
  legal: Scale,
  finance: Calculator,
  auto: Car,
  "real-estate": Home,
};

const INDUSTRY_COPY: Record<Locale, Record<IndustryId, IndustryCopy>> = {
  uk: {
    medicine: { description: "Сайти для клінік, стоматологій, діагностичних центрів", tags: ["Helsi", "Medesk", "Онлайн-запис"] },
    renovation: { description: "Сайти для будівельних і ремонтних компаній", tags: ["Калькулятор кошторису", "CRM", "Локальне SEO"] },
    legal: { description: "Сайти для юр. фірм, адвокатських бюро, приватних юристів", tags: ["Diia.Sign", "Онлайн-консультація"] },
    finance: { description: "Сайти для бухгалтерських фірм і фінансових радників", tags: ["MEDoc", "BAS", "Онлайн-консультація"] },
    auto: { description: "Сайти для імпорту авто, автодилерів, СТО", tags: ["Copart", "PDF-інвойс", "Мультимовність"] },
    "real-estate": { description: "Сайти для агенцій нерухомості і забудовників", tags: ["Каталог об'єктів", "Мультимовність", "Мультивалютність"] },
  },
  ru: {
    medicine: { description: "Сайты для клиник, стоматологий, диагностических центров", tags: ["Helsi", "Medesk", "Онлайн-запись"] },
    renovation: { description: "Сайты для строительных и ремонтных компаний", tags: ["Калькулятор сметы", "CRM", "Локальное SEO"] },
    legal: { description: "Сайты для юрфирм, адвокатских бюро, частных юристов", tags: ["Diia.Sign", "Онлайн-консультация"] },
    finance: { description: "Сайты для бухгалтерских фирм и финансовых советников", tags: ["MEDoc", "BAS", "Онлайн-консультация"] },
    auto: { description: "Сайты для импорта авто, автодилеров, СТО", tags: ["Copart", "PDF-инвойс", "Мультиязычность"] },
    "real-estate": { description: "Сайты для агентств недвижимости и застройщиков", tags: ["Каталог объектов", "Мультиязычность", "Мультивалютность"] },
  },
  en: {
    medicine: { description: "Sites for clinics, dental practices and diagnostic centres", tags: ["Online booking", "GDPR"] },
    renovation: { description: "Sites for builders and renovation companies", tags: ["Quote calculator", "CRM", "Local SEO"] },
    legal: { description: "Sites for law firms, solicitors and independent lawyers", tags: ["E-signature", "Online consultation"] },
    finance: { description: "Sites for accounting firms and financial advisers", tags: ["Accounting software", "Online consultation"] },
    auto: { description: "Sites for car importers, dealers and garages", tags: ["Auction feeds", "PDF invoices", "Multilingual"] },
    "real-estate": { description: "Sites for estate agents and developers", tags: ["Property catalogue", "Multilingual", "Multi-currency"] },
  },
};

/** The six industry cards, priced from the config. */
export function industryCards(locale: Locale): Industry[] {
  const term = formatPackageTerm("industry", locale);
  return INDUSTRY_ORDER.map((id) => ({
    icon: INDUSTRY_ICONS[id],
    title: INDUSTRIES[id].name[locale],
    description: INDUSTRY_COPY[locale][id].description,
    tags: INDUSTRY_COPY[locale][id].tags,
    price: `${formatPrice(industryPrice(id, locale), { locale, withPrefix: true })} · ${term}`,
    href: localizePath(`/sites-for/${id}`, locale),
  }));
}

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
  auto: "/industries/auto.jpg", // orange 6th-gen Camaro SS (pre-facelift), alpine — local asset
  "real-estate": UNSPLASH("photo-1633449227338-45d2df8c37b7"), // architectural interior
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
// Layered atmospheric background: photo → dark grade + accent wash → vignette →
// grain, plus a hover-only accent glow and a subtle image push (parallax feel).
// `aria-hidden` + empty alt: decorative only, content stays the accessible layer.
function CardMedia({ src, imgClass, dimClass }: { src: string; imgClass?: string; dimClass?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-card"
    >
      <AppImage
        src={src}
        alt=""
        fill
        loading="lazy"
        sizes="(min-width:1100px) 32vw, (min-width:768px) 48vw, 92vw"
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
  heading = (
    <>
      Спеціалізовані рішення під <em>вашу галузь</em>
    </>
  ),
  sub = "Комплексне рішення під вашу галузь — з інтеграціями і compliance.",
  locale = "uk",
  items = industryCards(locale),
}: {
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  locale?: Locale;
  items?: Industry[];
} = {}) {
  return (
    <section className={hpSectionClass} id="solutions">
      <div className={hpInnerClass}>
        <div className={HEADER_CLASS}>
          <div className={HEADING_ROW_CLASS}>
            <h2 className={cn(hpH2Class, "mt-0")}>{heading}</h2>
          </div>
          <div className={SUB_ROW_CLASS}>
            <p className={cn(hpSubClass, "mt-0")}>{sub}</p>
          </div>
        </div>
        {/* Two-up from the smallest screen — see `.hp-ind-card` in
            homepage-cards.css. `sm:grid-cols-1` used to drop tablets to a
            single 300px-tall column: eight tiles = 2 781px on a 744px iPad
            against 1 400px on a 390px phone (design audit 2026-09-07). */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-3">
          {items.map((ind, i) => {
            const inner = (
              <>
                <h3 className="m-0 font-sans text-[13px] font-bold uppercase leading-[1.25] text-ink sm:text-[17px] sm:leading-[25.5px]">{ind.title}</h3>
                {/* Description and stack tags are desktop-only: at a 163px
                    tile they would wrap to six lines and bury the price. */}
                <p className="mt-2 hidden text-[13px] leading-[1.55] text-ink-dim sm:block">{ind.description}</p>
                <div className="mt-4 hidden flex-wrap gap-1.5 sm:flex">
                  {ind.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex rounded-md border border-line bg-[oklch(1_0_0_/_0.03)] px-[9px] py-[3px] font-mono text-[12px] text-ink-3"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3 sm:pt-5">
                  <span className="font-mono text-[12px] leading-[1.3] text-ink-3 sm:text-[12px]">{ind.price}</span>
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
