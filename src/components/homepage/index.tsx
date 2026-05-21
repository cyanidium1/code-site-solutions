import Link from "next/link";
import {
  Stethoscope,
  Scale,
  Calculator,
  ShoppingCart,
  Rocket,
  Building,
  Car,
  Home,
  GraduationCap,
  Gauge,
  Github,
  DollarSign,
  Shield,
  Clock,
  ArrowRightLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MessageCircle,
  Mail,
  Linkedin,
  Layers,
  Check,
  type LucideIcon,
} from "lucide-react";
import "@/components/blocks/buttons/buttons.css";
import "./homepage.css";
import { ScrollReveal } from "./scroll-reveal";
import { fetchCaseStudies } from "@/components/case-page";
import { RelatedCard } from "@/components/blocks/related-card";
import { loc } from "@/lib/sanity/locale";
import { presentationForCase } from "@/lib/case-presentation";
import { hasEnCase } from "@/lib/i18n-routes";
import type { CaseStudyRef, Locale } from "@/lib/sanity/types";
import { formatPrice, type PriceLocale } from "@/lib/formatters/price";
import { TIER_AMOUNTS, TIER_NAMES, TIER_ORDER } from "@/lib/pricing/tiers";

export { HpHeader } from "./hp-header";

/* ═══ Section header (eyebrow + h2 + sub) ═════════════════════════════════ */

function SectionHead({
  eyebrow,
  heading,
  sub,
}: {
  eyebrow?: string;
  heading: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="hp-section-head">
      {eyebrow ? (
        <div className="hp-eyebrow">
          <span className="hp-eyebrow-dot" />
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <h2 className="hp-h2">{heading}</h2>
      {sub ? <p className="hp-sub">{sub}</p> : null}
    </div>
  );
}

/* ═══ Marquee ══════════════════════════════════════════════════════════════ */

type MarqueeLogo = { src: string; alt: string };

const DEFAULT_MARQUEE: MarqueeLogo[] = [
  { src: "/partners/efedra.webp", alt: "Efedra Clinic" },
  { src: "/partners/tatarka.webp", alt: "Tatarka" },
  { src: "/partners/aleko.webp", alt: "Aleko" },
  { src: "/partners/solid-renovation.webp", alt: "Solid Renovation" },
  { src: "/partners/art-lover.webp", alt: "Art Lover" },
  { src: "/partners/bravo.webp", alt: "Bravo" },
  { src: "/partners/clarion.webp", alt: "Clarion" },
  { src: "/partners/finance-league.webp", alt: "Finance League" },
  { src: "/partners/glimmer.webp", alt: "Glimmer" },
  { src: "/partners/grinchenko.webp", alt: "Grinchenko" },
  { src: "/partners/kondor.webp", alt: "Kondor" },
  { src: "/partners/raul-auto.webp", alt: "Raul Auto" },
  { src: "/partners/sytnykov.webp", alt: "Sytnykov" },
  { src: "/partners/uneed.webp", alt: "Uneed" },
  { src: "/partners/way-to-ireland.webp", alt: "Way to Ireland" },
  { src: "/partners/yangoly.webp", alt: "Yangoly" },
];

export function Marquee({
  label = "47+ КОМПАНІЙ ДОВІРИЛИСЯ · UA · EU · US · DK",
  items = DEFAULT_MARQUEE,
}: {
  label?: string;
  items?: MarqueeLogo[];
}) {
  const repeated = [...items, ...items];
  return (
    <section className="hp-marquee">
      <div className="hp-marquee-label">/ {label}</div>
      <div className="hp-marquee-fade">
        <div className="hp-marquee-track">
          {repeated.map((it, i) => (
            <span key={i} className="hp-marquee-item" title={it.alt}>
              <img
                src={it.src}
                alt={it.alt}
                loading="lazy"
                decoding="async"
                className="hp-marquee-logo"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ Industries (8 cards) ════════════════════════════════════════════════ */

export type Industry = {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
  tags: string[];
  price: string;
  /** `null` rendert die Karte als nicht-klickbar (для EN-локалі, поки не вийшли галузеві лендинги). */
  href: string | null;
};

// All 8 industries have published Sanity pages and live hrefs.
const DEFAULT_INDUSTRIES: Industry[] = [
  {
    icon: Stethoscope,
    color: "#0EA5E9",
    title: "Healthcare / Medicine",
    description: "Сайти для клінік, стоматологій, діагностичних центрів",
    tags: ["Helsi", "Medesk", "Online booking"],
    price: "Від $3 500 · 4-10 тижнів",
    href: "/sites-for/medicine",
  },
  {
    icon: Building,
    color: "#EF4444",
    title: "Construction / Renovation",
    description: "Сайти для будівельних і ремонтних компаній",
    tags: ["CRM", "Calculator", "Local SEO"],
    price: "Від $3 500 · 4-8 тижнів",
    href: "/sites-for/renovation",
  },
  {
    icon: Scale,
    color: "#8B5CF6",
    title: "Legal & Attorneys",
    description: "Сайти для юр. фірм, адвокатських бюро, приватних юристів",
    tags: ["Clio", "Diia.Sign", "Online consult"],
    price: "Від $3 500 · 4-8 тижнів",
    href: "/sites-for/legal",
  },
  {
    icon: Calculator,
    color: "#10B981",
    title: "Фінанси і бухгалтерія",
    description: "Сайти для бух-фірм, фінансових радників, трейдинг-сервісів",
    tags: ["MEDoc", "Stripe", "1С/BAS"],
    price: "Від $3 500 · 4-8 тижнів",
    href: "/sites-for/finance",
  },
  {
    icon: ShoppingCart,
    color: "#F59E0B",
    title: "E-commerce",
    description: "Інтернет-магазини, маркетплейси, B2B-каталоги",
    tags: ["Stripe", "LiqPay", "Нова Пошта"],
    price: "Від $3 000 · 6-10 тижнів",
    href: "/sites-for/ecommerce",
  },
  {
    icon: Car,
    color: "#0070F3",
    title: "Авто-індустрія",
    description: "Сайти для імпорту авто, автодилерів, СТО і сервісних послуг",
    tags: ["Copart", "PDF-invoice", "Multi-lang"],
    price: "Від $3 000 · 6-10 тижнів",
    href: "/sites-for/auto",
  },
  {
    icon: Home,
    color: "#EC4899",
    title: "Нерухомість",
    description: "Сайти для агенцій нерухомості, забудовників, private listings",
    tags: ["Multi-lang", "Multi-currency", "Mortgage"],
    price: "Від $4 000 · 6-10 тижнів",
    href: "/sites-for/real-estate",
  },
  {
    icon: GraduationCap,
    color: "#14B8A6",
    title: "Курси і лендинги",
    description: "Сайти для онлайн-курсів, інфо-продуктів, блогерських воронок",
    tags: ["Stripe", "Teachable", "A/B"],
    price: "Від $800 · 4-8 тижнів",
    href: "/sites-for/courses",
  },
];

export function Industries({
  eyebrow = "РІШЕННЯ",
  heading = (
    <>
      Спеціалізовані рішення під <em>вашу галузь</em>
    </>
  ),
  sub = "Не просто сайт — комплексне рішення з інтеграціями і compliance.",
  items = DEFAULT_INDUSTRIES,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  items?: Industry[];
} = {}) {
  return (
    <section className="hp-section" id="solutions">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        <div className="hp-industries-grid">
          {items.map((ind, i) => {
            const Icon = ind.icon;
            const inner = (
              <>
                <div className="hp-industry-icon">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h3 className="hp-industry-title">{ind.title}</h3>
                <p className="hp-industry-desc">{ind.description}</p>
                <div className="hp-industry-tags">
                  {ind.tags.map((t) => (
                    <span key={t} className="hp-industry-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="hp-industry-foot">
                  <span className="hp-industry-price">{ind.price}</span>
                  {ind.href ? (
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.8}
                      className="hp-industry-arrow"
                    />
                  ) : null}
                </div>
              </>
            );
            const cardStyle = { ["--accent-color" as string]: ind.color };
            if (!ind.href) {
              return (
                <div
                  key={ind.title + i}
                  className="hp-industry-card is-disabled"
                  style={cardStyle}
                >
                  {inner}
                </div>
              );
            }
            return (
              <Link
                key={ind.href}
                href={ind.href}
                className="hp-industry-card"
                style={cardStyle}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ Bento (Why us) ══════════════════════════════════════════════════════ */

function LighthouseVisual() {
  return (
    <div className="hp-lh">
      <div className="hp-lh-arc">
        <svg viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="oklch(1 0 0 / 0.08)"
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="url(#hp-lh-grad)"
            strokeWidth="2.5"
            strokeDasharray="98 100"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="hp-lh-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.7 0.16 145)" />
              <stop offset="100%" stopColor="oklch(0.55 0.18 295)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="hp-lh-num">
          <strong>98</strong>
          <small>score</small>
        </div>
      </div>
    </div>
  );
}

function MigrationVisual() {
  return (
    <div className="hp-mig">
      <div className="hp-mig-pill bad">
        WP <strong>4.2s</strong>
      </div>
      <span className="hp-mig-arrow">→</span>
      <div className="hp-mig-pill good">
        Next <strong>0.8s</strong>
      </div>
    </div>
  );
}

function StackVisual({ locale }: { locale: PriceLocale }) {
  const layers = locale === "en"
    ? ["Copy", "Design", "Code", "SEO + hosting"]
    : ["Тексти", "Дизайн", "Код", "SEO + хостинг"];
  return (
    <div className="hp-bento-vis hp-bento-stack" aria-hidden="true">
      {layers.map((l) => (
        <div key={l} className="hp-bento-stack-row">
          <span className="hp-bento-stack-check">
            <Check size={11} strokeWidth={2.4} />
          </span>
          <span className="hp-bento-stack-label">{l}</span>
        </div>
      ))}
    </div>
  );
}

function CommitLogVisual() {
  const rows = [
    { msg: "initial setup", meta: "2024" },
    { msg: "launch", meta: "+6 wk" },
    { msg: "handover", meta: "you ⤴", accent: true },
  ];
  return (
    <div className="hp-bento-vis hp-bento-commits" aria-hidden="true">
      {rows.map((r) => (
        <div key={r.msg} className="hp-bento-commit-row">
          <span className="hp-bento-commit-tag">feat:</span>
          <span className="hp-bento-commit-msg">{r.msg}</span>
          <span
            className={`hp-bento-commit-meta${r.accent ? " is-accent" : ""}`}
          >
            {r.meta}
          </span>
        </div>
      ))}
    </div>
  );
}

function WeeksProgressVisual({ locale }: { locale: PriceLocale }) {
  const steps = locale === "en"
    ? [
        { name: "Brief", wk: "wk 1" },
        { name: "Design", wk: "wk 2" },
        { name: "Build", wk: "wk 3" },
        { name: "Launch", wk: "wk 4", target: true },
      ]
    : [
        { name: "Бриф", wk: "тижд. 1" },
        { name: "Дизайн", wk: "тижд. 2" },
        { name: "Розробка", wk: "тижд. 3" },
        { name: "Запуск", wk: "тижд. 4", target: true },
      ];
  return (
    <div className="hp-bento-vis hp-bento-weeks" aria-hidden="true">
      {steps.map((s) => (
        <div key={s.name} className="hp-bento-week-row">
          <span className="hp-bento-week-name">{s.name}</span>
          <span
            className={`hp-bento-week-bar${s.target ? " is-target" : ""}`}
          />
          <span
            className={`hp-bento-week-wk${s.target ? " is-target" : ""}`}
          >
            {s.wk}
          </span>
        </div>
      ))}
    </div>
  );
}

function PriceTableVisual({ locale }: { locale: PriceLocale }) {
  // Trailing "+" is a "starting from" shorthand in this Bento visual.
  // formatPrice handles the locale-aware number; we append the suffix.
  const rows = TIER_ORDER.map((key) => ({
    name: TIER_NAMES[key][locale],
    price: `${formatPrice(TIER_AMOUNTS[key], { locale })}+`,
    accent: key === "corporate",
  }));
  return (
    <div className="hp-bento-vis hp-bento-price" aria-hidden="true">
      {rows.map((r) => (
        <div key={r.name} className="hp-bento-price-row">
          <span className="hp-bento-price-name">{r.name}</span>
          <span className="hp-bento-price-dots" />
          <span
            className={`hp-bento-price-num${r.accent ? " is-accent" : ""}`}
          >
            {r.price}
          </span>
        </div>
      ))}
    </div>
  );
}

function WarrantyTimelineVisual({ locale }: { locale: PriceLocale }) {
  const points = locale === "en"
    ? [
        { label: "Start" },
        { label: "Launch", mid: true },
        { label: "+1 year", end: true },
      ]
    : [
        { label: "Старт" },
        { label: "Запуск", mid: true },
        { label: "+1 рік", end: true },
      ];
  const footL = locale === "en" ? "Missed deadline" : "Зрив дедлайну";
  return (
    <div className="hp-bento-vis hp-bento-tl" aria-hidden="true">
      <div className="hp-bento-tl-track">
        <div className="hp-bento-tl-line" />
        <div className="hp-bento-tl-points">
          {points.map((p) => (
            <div key={p.label} className="hp-bento-tl-point">
              <span
                className={`hp-bento-tl-dot${p.mid ? " is-mid" : ""}${p.end ? " is-end" : ""}`}
              />
              <span className="hp-bento-tl-label">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hp-bento-tl-foot">
        <span className="hp-bento-tl-foot-l">{footL}</span>
        <span className="hp-bento-tl-foot-arrow">→</span>
        <span className="hp-bento-tl-foot-r">−30%</span>
      </div>
    </div>
  );
}

function SupportTimerVisual({ locale }: { locale: PriceLocale }) {
  const sub = locale === "en" ? "business-hour SLA" : "робочих годин SLA";
  return (
    <div className="hp-bento-vis hp-bento-timer" aria-hidden="true">
      <div className="hp-bento-timer-row">
        <span className="hp-bento-timer-seg">00</span>
        <span className="hp-bento-timer-sep">:</span>
        <span className="hp-bento-timer-seg is-accent">04</span>
        <span className="hp-bento-timer-sep">:</span>
        <span className="hp-bento-timer-seg">00</span>
      </div>
      <div className="hp-bento-timer-sub">{sub}</div>
    </div>
  );
}

type BentoVisualKind =
  | "lh"
  | "mig"
  | "commits"
  | "weeks"
  | "price"
  | "warranty"
  | "support"
  | "stack";

function BentoVisual({
  kind,
  locale,
}: {
  kind: BentoVisualKind;
  locale: PriceLocale;
}) {
  switch (kind) {
    case "lh":
      return <LighthouseVisual />;
    case "mig":
      return <MigrationVisual />;
    case "commits":
      return <CommitLogVisual />;
    case "weeks":
      return <WeeksProgressVisual locale={locale} />;
    case "price":
      return <PriceTableVisual locale={locale} />;
    case "warranty":
      return <WarrantyTimelineVisual locale={locale} />;
    case "support":
      return <SupportTimerVisual locale={locale} />;
    case "stack":
      return <StackVisual locale={locale} />;
    default:
      return null;
  }
}

export type BentoCell = {
  title: string;
  icon: LucideIcon;
  stat?: string;
  body: React.ReactNode;
  span: "1x1" | "2x1" | "2x2" | "3x1";
  visual?: BentoVisualKind;
};

const DEFAULT_BENTO: BentoCell[] = [
  {
    title: "Завантаження < 1 сек",
    icon: Gauge,
    stat: "98 LH",
    body: "Custom code, нуль плагінів. Перевірено на 3G/4G в Україні.",
    span: "2x1",
    visual: "lh",
  },
  {
    title: "Код у вашому GitHub",
    icon: Github,
    stat: "100%",
    body: "Не у нас. З першого коміту.",
    span: "1x1",
    visual: "commits",
  },
  {
    title: "Запуск за 4 тижні",
    icon: Rocket,
    stat: "4 wk",
    body: "Industry-сайт під ключ.",
    span: "1x1",
    visual: "weeks",
  },
  {
    title: "Прозорий прайс",
    icon: DollarSign,
    stat: "$3.5k+",
    body: "Не «під запит». Цифра в брифі.",
    span: "1x1",
    visual: "price",
  },
  {
    title: "Гарантія + неустойка",
    icon: Shield,
    stat: "1y",
    body: "1 рік. За зрив — повертаємо 30%.",
    span: "1x1",
    visual: "warranty",
  },
  {
    title: "Підтримка за 4 год",
    icon: Clock,
    stat: "4h",
    body: "Зламалось не з нашої вини — фіксимо за 4 робочі години.",
    span: "1x1",
    visual: "support",
  },
  {
    title: "Перенесення без SEO-втрат",
    icon: ArrowRightLeft,
    stat: "0 падінь",
    body: "301-redirects, контент, schema.org. 2 тижні без падіння в Google.",
    span: "1x1",
    visual: "mig",
  },
  {
    title: "Все під ключ",
    icon: Layers,
    stat: "100%",
    body: "Тексти + дизайн + код + інтеграції. Без 5 підрядників.",
    span: "2x1",
    visual: "stack",
  },
];

export function Bento({
  eyebrow = "ЧОМУ МИ",
  heading = (
    <>
      Сайт як <em>інструмент</em> бізнесу, не вітрина
    </>
  ),
  cells = DEFAULT_BENTO,
  locale = "uk",
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  cells?: BentoCell[];
  locale?: PriceLocale;
} = {}) {
  return (
    <section className="hp-section" id="why-us">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <ScrollReveal className="hp-bento-grid">
          {cells.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className={`hp-bento-cell hp-bento-cell--${c.span}`}
                style={{ ["--i" as string]: i }}
              >
                <div className="hp-bento-head">
                  <div className="hp-bento-icon">
                    <Icon size={18} strokeWidth={1.6} />
                  </div>
                  {c.stat ? <span className="hp-bento-stat">{c.stat}</span> : null}
                </div>
                <h3 className="hp-bento-title">{c.title}</h3>
                <div className="hp-bento-body">{typeof c.body === "string" ? <p>{c.body}</p> : c.body}</div>
                {c.visual ? <BentoVisual kind={c.visual} locale={locale} /> : null}
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ═══ Process timeline ════════════════════════════════════════════════════ */

export { Process } from "./process";

/* ═══ Cases preview (3 cards) ═════════════════════════════════════════════ */

type CaseItem = {
  name: string;
  industry: string;
  region: string;
  year: string;
  chips: string[];
  metrics: string;
  gradient: string;
  /** `null` рендерить картку як coming-soon (без посилання). */
  href: string | null;
  coverImage?: string;
  coverImageAlt?: string;
};

function refToCaseItem(c: CaseStudyRef, locale: Locale): CaseItem {
  const pres = presentationForCase(c.slug, c.industrySlug);
  const name = loc(c.title, locale) || c.client || c.slug;
  const region = loc(c.region, locale);
  const year = c.year ? String(c.year) : "";
  // EN listing should deep-link into /en/portfolio/<slug> only when the
  // case actually has EN content; otherwise fall back to the UA URL so
  // the user doesn't bounce to a 404 on click.
  const href =
    locale === "en"
      ? hasEnCase(c.slug)
        ? `/en/portfolio/${c.slug}`
        : `/portfolio/${c.slug}`
      : `/portfolio/${c.slug}`;
  return {
    name,
    industry: pres.label,
    region,
    year,
    chips: [pres.label, pres.tech],
    metrics: loc(c.metricsLine, locale) || "",
    gradient: pres.gradient,
    href,
    coverImage: c.coverImage?.asset?.url,
    coverImageAlt: loc(c.coverImage?.alt, locale) || name,
  };
}

export async function Cases({
  eyebrow = "КЕЙСИ",
  heading = (
    <>
      Реальні кейси з <em>реальними</em> метриками
    </>
  ),
  items,
  locale = "uk",
  ctaLabel = "Всі кейси",
  ctaHref = "/portfolio",
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  items?: CaseItem[];
  /** Used when `items` is not provided — fetches Sanity case studies in
   *  the given locale and maps them into card data. */
  locale?: Locale;
  ctaLabel?: string;
  ctaHref?: string;
} = {}) {
  const finalItems: CaseItem[] =
    items ??
    (await fetchCaseStudies()).slice(0, 3).map((c) => refToCaseItem(c, locale));
  return (
    <section className="hp-section" id="cases">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <div className="hp-cases-grid">
          {finalItems.map((c) => {
            const metaLine = [c.industry, c.region, c.year]
              .filter(Boolean)
              .join(" · ");
            return (
              <RelatedCard
                key={c.href ?? c.name}
                metrics={c.chips}
                title={c.name}
                eyebrow={metaLine || undefined}
                sub={c.metrics || undefined}
                coverImage={
                  c.coverImage
                    ? { src: c.coverImage, alt: c.coverImageAlt ?? c.name }
                    : undefined
                }
                gradient={c.gradient}
                href={c.href}
              />
            );
          })}
        </div>
        <Link href={ctaHref} className="btn-primary hp-section-cta">
          <span>{ctaLabel}</span>
          <ArrowRight size={18} strokeWidth={1.8} />
        </Link>
      </div>
    </section>
  );
}

/* ═══ Tech stack (10 tiles) ═══════════════════════════════════════════════ */

type StackItem = { name: string; cat: string };

const DEFAULT_STACK: StackItem[] = [
  { name: "Next.js", cat: "Framework" },
  { name: "Astro", cat: "Static sites" },
  { name: "React", cat: "UI library" },
  { name: "TypeScript", cat: "Language" },
  { name: "Tailwind", cat: "Styling" },
  { name: "HeroUI", cat: "Components" },
  { name: "Sanity", cat: "CMS" },
  { name: "Strapi", cat: "Headless CMS" },
  { name: "Vercel", cat: "Hosting" },
  { name: "Cloudflare", cat: "CDN + DNS" },
];

export function Stack({
  eyebrow = "СТЕК",
  heading = (
    <>
      Технології, які <em>ми вибрали</em>
    </>
  ),
  sub = "Не пробуємо все підряд. Працюємо з 10 інструментами, які знаємо до глибини.",
  items = DEFAULT_STACK,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  items?: StackItem[];
} = {}) {
  return (
    <section className="hp-section" id="stack">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        <div className="hp-stack">
          <div className="hp-stack-grid">
            {items.map((it) => (
              <div className="hp-stack-tile" key={it.name}>
                <div className="hp-stack-name">{it.name}</div>
                <div className="hp-stack-cat">{it.cat}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ Pull-quote testimonial ═════════════════════════════════════════════ */

export function PullQuote({
  quote = (
    <>
      Перед запуском нового сайту у нас було 3 заявки на місяць. Зараз — 24.
    </>
  ),
  initials = "SH",
  name = "Søren Hansen",
  role = "Owner, NBYG København Aps",
  liHref,
  showAvatar = true,
  caseHref,
  caseLabel,
}: Partial<{
  quote: React.ReactNode;
  initials: string;
  name: string;
  role: string;
  /** Якщо не передано — блок LinkedIn не показується. */
  liHref?: string;
  /** Круг з ініціалами; `false` — лише ім’я та роль (без «фото» клієнта). */
  showAvatar?: boolean;
  /** Якщо передано — під автором рендериться лінк на повний кейс. */
  caseHref?: string;
  caseLabel?: string;
}> = {}) {
  return (
    <section className="hp-section">
      <div className="hp-pull">
        <div className="hp-pull-bg" />
        <div className="hp-pull-inner">
          <p className="hp-pull-quote">«{quote}»</p>
          <div className="hp-pull-author">
            {showAvatar ? (
              <div className="hp-pull-avatar">{initials}</div>
            ) : null}
            <div>
              <div className="hp-pull-name">{name}</div>
              <div className="hp-pull-role">{role}</div>
            </div>
            {liHref ? (
              <a
                href={liHref}
                className="hp-pull-li"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={12} strokeWidth={1.6} /> LinkedIn
              </a>
            ) : null}
          </div>
          {caseHref ? (
            <div className="hp-pull-cta">
              <Link href={caseHref} className="btn-primary">
                <span>{caseLabel ?? "Подивитись повний кейс"}</span>
                <ArrowUpRight size={18} strokeWidth={1.8} />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ═══ Final CTA (3 cards) ════════════════════════════════════════════════ */

type CtaCard = {
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  href: string;
  featured?: boolean;
};

const DEFAULT_CTA: CtaCard[] = [
  {
    icon: Calendar,
    title: "Book a call",
    body: "30-хв Zoom. Покажемо реальні кейси, обговоримо ваш проєкт.",
    cta: "Open Calendly →",
    href: "https://calendly.com/fedirdev",
  },
  {
    icon: MessageCircle,
    title: "Telegram",
    body: "Найшвидший канал. Зазвичай відповідаємо за 30 хв.",
    cta: "Write @fedirdev →",
    href: "https://t.me/fedirdev?text=%D0%94%D0%BE%D0%B1%D1%80%D0%BE%D0%B3%D0%BE+%D0%B4%D0%BD%D1%8F",
    featured: true,
  },
  {
    icon: Mail,
    title: "Send a brief",
    body: "Детальна форма. Опишіть проєкт — повернемось за 4 робочі години.",
    cta: "Open form →",
    href: "/contacts",
  },
];

export function FinalCta3({
  eyebrow = "ЗВ'ЯЗОК",
  heading = (
    <>
      Готові <em>обговорити</em> проєкт?
    </>
  ),
  sub = "Безкоштовна 30-хв консультація. Без зобов'язань. Розуміємо за 15 хв, чи підходимо одне одному.",
  cards = DEFAULT_CTA,
  urgency,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  cards?: CtaCard[];
  urgency?: React.ReactNode;
} = {}) {
  return (
    <section className="hp-section" id="contact">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        {urgency ? (
          <div className="hp-urgency">
            <span className="hp-urgency-dot" aria-hidden="true" />
            <span className="hp-urgency-text">{urgency}</span>
          </div>
        ) : null}
        <div className="hp-finalcta-grid">
          {cards.map((c, i) => {
            const Icon = c.icon;
            const external = c.href.startsWith("http");
            return (
              <a
                key={i}
                href={c.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className={`hp-finalcta-card${c.featured ? " featured" : ""}`}
              >
                <div className="hp-finalcta-icon">
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                <div className="hp-finalcta-title">{c.title}</div>
                <p className="hp-finalcta-body">{c.body}</p>
                <div className="hp-finalcta-cta">{c.cta}</div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ Pull-quote swiper (Sanity-driven testimonials) ═════════════════════ */

export { PullQuoteSwiper } from "./pull-quote-swiper";

/* ═══ Newsletter ═══════════════════════════════════════════════════════════ */

export { Newsletter } from "./newsletter";

/* ═══ Homepage Footer ═════════════════════════════════════════════════════ */

export { HpFooter } from "./hp-footer";
