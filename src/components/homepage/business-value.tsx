import type * as React from "react";
import {
  Handshake,
  FileSignature,
  ShieldCheck,
  LayoutDashboard,
  TrendingUp,
  Rocket,
  Headset,
  Check,
  type LucideIcon,
} from "lucide-react";

import type { PriceLocale } from "@/lib/shared/format-price";
import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { ScrollReveal } from "./scroll-reveal";

type BizVisualKind = "deal" | "control" | "cms" | "seo" | "launch" | "support";

type BizCard = {
  icon: LucideIcon;
  /** Oversized low-opacity watermark icon in the card corner. Defaults to `icon`. */
  ghost?: LucideIcon;
  label?: string;
  title: string;
  body: string;
  /** Per-card accent as a raw oklch() colour, assigned to `--card-accent`. */
  tone: string;
  visual: BizVisualKind;
};

type SectionCopy = {
  eyebrow: string;
  heading: React.ReactNode;
  sub: React.ReactNode;
};

// Purple stays dominant (cards 1, 3, 6); blue / green / amber are used sparingly
// as secondary accents so the grid reads as one system, not a rainbow.
const PURPLE = "oklch(0.62 0.16 295)";
const BLUE = "oklch(0.62 0.13 245)";
const GREEN = "oklch(0.66 0.15 150)";
const AMBER = "oklch(0.72 0.14 70)";

const UK_COPY: SectionCopy = {
  eyebrow: "ЧОМУ МИ",
  heading: (
    <>
      Сайт як <em>інструмент</em> бізнесу, не вітрина
    </>
  ),
  sub: "Кожен блок сайту має працювати на швидкість, заявки, довіру та ріст бізнесу.",
};

const EN_COPY: SectionCopy = {
  eyebrow: "WHY US",
  heading: (
    <>
      Your site is a <em>business tool</em>, not a showcase
    </>
  ),
  sub: "Every section of your site should work for speed, leads, trust, and business growth.",
};

const UK_CARDS: BizCard[] = [
  {
    icon: Handshake,
    ghost: FileSignature,
    title: "З нами легко",
    body: "Без брифів і технічних завдань — ми самі ставимо правильні питання й оформлюємо все за вас. Працюємо офіційно, за договором.",
    tone: PURPLE,
    visual: "deal",
  },
  {
    icon: ShieldCheck,
    label: "Власність",
    title: "Контроль",
    body: "Код, домен, хостинг і доступи належать вам. Повний контроль над сайтом, структурою, аналітикою та розвитком — без конструкторів і прив’язки до підрядника.",
    tone: BLUE,
    visual: "control",
  },
  {
    icon: LayoutDashboard,
    label: "Адмінка",
    title: "Управління",
    body: "Зручна адмін-панель для текстів, сторінок, послуг, кейсів, блогу та SEO без технічних знань — прямо з телефону.",
    tone: PURPLE,
    visual: "cms",
  },
  {
    icon: TrendingUp,
    label: "SEO",
    title: "Результат",
    body: "Структура, швидкість, schema.org, redirects і контент готуються під пошук, а не просто «щоб було красиво».",
    tone: GREEN,
    visual: "seo",
  },
  {
    icon: Rocket,
    title: "Швидкий запуск",
    body: "Чіткий процес від брифу до запуску. Без хаосу, нескінченних правок і «давайте ще місяць подумаємо».",
    tone: AMBER,
    visual: "launch",
  },
  {
    icon: Headset,
    label: "Гарантія",
    title: "Підтримка",
    body: "Після запуску ми не зникаємо. Виправляємо технічні проблеми, допомагаємо з розвитком і підтримуємо сайт.",
    tone: PURPLE,
    visual: "support",
  },
];

const EN_CARDS: BizCard[] = [
  {
    icon: Handshake,
    ghost: FileSignature,
    title: "Easy to work with",
    body: "No briefs or specs to write — we ask the right questions and handle the paperwork. And it’s all official, under a contract.",
    tone: PURPLE,
    visual: "deal",
  },
  {
    icon: ShieldCheck,
    label: "Ownership",
    title: "Control",
    body: "The code, domain, hosting, and access all belong to you. Full control over the site, structure, analytics, and growth — no page builders, no vendor lock-in.",
    tone: BLUE,
    visual: "control",
  },
  {
    icon: LayoutDashboard,
    label: "Admin",
    title: "Management",
    body: "A simple admin panel for text, pages, services, cases, blog, and SEO — no technical skills, right from your phone.",
    tone: PURPLE,
    visual: "cms",
  },
  {
    icon: TrendingUp,
    label: "SEO",
    title: "Results",
    body: "Structure, speed, schema.org, redirects, and content are built for search — not just “to look pretty”.",
    tone: GREEN,
    visual: "seo",
  },
  {
    icon: Rocket,
    title: "Fast launch",
    body: "A clear process from brief to launch. No chaos, no endless revisions, no “let’s think about it for another month”.",
    tone: AMBER,
    visual: "launch",
  },
  {
    icon: Headset,
    label: "Warranty",
    title: "Support",
    body: "We don’t disappear after launch. We fix technical issues, help you grow, and keep the site running.",
    tone: PURPLE,
    visual: "support",
  },
];

/* ─── Localised micro-copy for the mini-illustrations ─────────────────────── */

const VIS_COPY = {
  uk: {
    contract: "Договір",
    official: "офіційно",
    dealChips: ["Без брифу", "Без ТЗ"],
    control: ["Домен", "Хостинг", "Аналітика", "Бекапи"],
    top: "ТОП",
    steps: ["Бриф", "Дизайн", "Код", "Запуск"],
    reply: "Відповідь < 4 год",
    warranty: "Гарантія 1 рік",
  },
  en: {
    contract: "Contract",
    official: "official",
    dealChips: ["No brief", "No spec"],
    control: ["Domain", "Hosting", "Analytics", "Backups"],
    top: "TOP",
    steps: ["Brief", "Design", "Code", "Launch"],
    reply: "Reply < 4h",
    warranty: "1-year warranty",
  },
} as const;

/* ─── Mini-illustrations ──────────────────────────────────────────────────
   Restrained, div + icon visuals. Hidden on mobile so small screens get a
   clean icon → title → body stack. All colour comes from `--card-accent`. */

const panel = "rounded-xl border border-line bg-[oklch(1_0_0_/_0.025)] p-3";
const accBg = "bg-[oklch(from_var(--card-accent)_l_c_h_/_0.12)]";
const accBorder = "border-[oklch(from_var(--card-accent)_l_c_h_/_0.3)]";
const accText = "text-[oklch(from_var(--card-accent)_0.85_0.12_h)]";
const bar = "h-1.5 rounded-full bg-[oklch(1_0_0_/_0.1)]";

function DealVisual({ t }: { t: (typeof VIS_COPY)[PriceLocale] }) {
  return (
    <div className={panel} aria-hidden="true">
      <div className="flex items-center justify-between border-b border-line pb-2.5">
        <span className="font-mono text-[12px] text-ink-3">{t.contract}</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border ${accBorder} ${accBg} px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] ${accText}`}
        >
          <FileSignature size={11} /> {t.official}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {t.dealChips.map((c) => (
          <span
            key={c}
            className="rounded-lg border border-line bg-[oklch(1_0_0_/_0.03)] px-2 py-1 text-[12px] text-ink-dim"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function ControlVisual({ t }: { t: (typeof VIS_COPY)[PriceLocale] }) {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      {t.control.map((it) => (
        <div key={it} className="flex items-center gap-2.5">
          <span
            className={`inline-flex size-5 items-center justify-center rounded-md border ${accBorder} ${accBg} ${accText}`}
          >
            <Check size={12} strokeWidth={2.5} />
          </span>
          <span className="text-[14px] text-ink-dim">{it}</span>
        </div>
      ))}
    </div>
  );
}

function CmsVisual() {
  return (
    <div className={`flex gap-2.5 ${panel}`} aria-hidden="true">
      <div className="flex w-1/4 flex-col gap-1.5">
        <span className="h-1.5 rounded-full bg-[oklch(from_var(--card-accent)_l_c_h_/_0.45)]" />
        <span className={bar} />
        <span className={bar} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 border-l border-line pl-2.5">
        <span className={`${bar} w-full`} />
        <span className="h-1.5 w-5/6 rounded-full bg-[oklch(1_0_0_/_0.08)]" />
        <span className="h-1.5 w-2/3 rounded-full bg-[oklch(1_0_0_/_0.08)]" />
      </div>
    </div>
  );
}

function SeoVisual({ t }: { t: (typeof VIS_COPY)[PriceLocale] }) {
  const heights = ["h-3", "h-4", "h-3.5", "h-6", "h-8", "h-10"];
  return (
    <div className={panel} aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] text-ink-3">site.com</span>
        <span className={`inline-flex items-center gap-1 font-mono text-[12px] ${accText}`}>
          <TrendingUp size={13} /> {t.top}
        </span>
      </div>
      <div className="mt-3 flex items-end gap-1.5">
        {heights.map((h, i) => (
          <span
            key={h}
            className={`flex-1 rounded-t-[3px] ${h} ${
              i === heights.length - 1
                ? "bg-[oklch(from_var(--card-accent)_l_c_h_/_0.6)]"
                : "bg-[oklch(1_0_0_/_0.1)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function LaunchVisual({ t }: { t: (typeof VIS_COPY)[PriceLocale] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-hidden="true">
      {t.steps.map((s, i) => {
        const last = i === t.steps.length - 1;
        return (
          <span key={s} className="flex items-center gap-1.5">
            <span
              className={`rounded-lg border px-2 py-1 text-[12px] ${
                last
                  ? `${accBorder} ${accBg} ${accText}`
                  : "border-line bg-[oklch(1_0_0_/_0.03)] text-ink-dim"
              }`}
            >
              {s}
            </span>
            {!last ? <span className="text-ink-3">→</span> : null}
          </span>
        );
      })}
    </div>
  );
}

function SupportVisual({ t }: { t: (typeof VIS_COPY)[PriceLocale] }) {
  return (
    <div className={`flex items-center gap-3 ${panel}`} aria-hidden="true">
      <span
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg border ${accBorder} ${accBg} ${accText}`}
      >
        <Headset size={17} />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-[14px] font-semibold text-ink">{t.reply}</span>
        <span className="text-[12px] text-ink-3">{t.warranty}</span>
      </div>
    </div>
  );
}

function BizVisual({ kind, locale }: { kind: BizVisualKind; locale: PriceLocale }) {
  const t = VIS_COPY[locale];
  switch (kind) {
    case "deal":
      return <DealVisual t={t} />;
    case "control":
      return <ControlVisual t={t} />;
    case "cms":
      return <CmsVisual />;
    case "seo":
      return <SeoVisual t={t} />;
    case "launch":
      return <LaunchVisual t={t} />;
    case "support":
      return <SupportVisual t={t} />;
    default:
      return null;
  }
}

const cardBase =
  "group/biz-card relative flex flex-col overflow-hidden rounded-[24px] border border-line p-7 lg:p-9 " +
  "[background:radial-gradient(440px_240px_at_0%_0%,oklch(from_var(--card-accent)_l_c_h_/_0.10),transparent_70%),oklch(1_0_0_/_0.02)] " +
  "z-[1] " +
  // entrance: staggered settle once the grid reaches the viewport.
  "opacity-0 translate-y-6 scale-[0.98] blur-[6px] " +
  "[transition:opacity_0.8s_var(--ease-out-soft),transform_0.8s_var(--ease-out-soft),filter_0.8s_var(--ease-out-soft),border-color_0.3s,box-shadow_0.3s] " +
  "[transition-delay:calc(var(--i,0)*0.08s)] " +
  "group-data-[visible=true]/biz-reveal:opacity-100 group-data-[visible=true]/biz-reveal:translate-y-0 group-data-[visible=true]/biz-reveal:scale-100 group-data-[visible=true]/biz-reveal:blur-none " +
  "motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:blur-none motion-reduce:transition-none " +
  // restrained hover: accent border + soft lifted glow.
  "hover:border-[oklch(from_var(--card-accent)_l_c_h_/_0.4)] hover:[box-shadow:0_0_0_1px_oklch(from_var(--card-accent)_l_c_h_/_0.15),0_24px_60px_-32px_oklch(from_var(--card-accent)_l_c_h_/_0.55)] " +
  // top accent hairline that fades in after the entrance settles.
  "before:pointer-events-none before:absolute before:inset-x-7 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,oklch(from_var(--card-accent)_l_c_h_/_0.5),transparent)] before:opacity-0 before:transition-opacity before:duration-[600ms] before:[transition-delay:calc(var(--i,0)*0.08s+0.4s)] " +
  "group-data-[visible=true]/biz-reveal:before:opacity-100 motion-reduce:before:opacity-100 motion-reduce:before:transition-none";

export function BusinessValue({
  locale = "uk",
  eyebrow,
  heading,
  sub,
  cards,
}: {
  locale?: PriceLocale;
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  cards?: BizCard[];
} = {}) {
  const copy = locale === "en" ? EN_COPY : UK_COPY;
  const resolvedCards = cards ?? (locale === "en" ? EN_CARDS : UK_CARDS);

  return (
    <section className={hpSectionClass} id="why-us">
      <div className={hpInnerClass}>
        <SectionHead
          eyebrow={eyebrow ?? copy.eyebrow}
          heading={heading ?? copy.heading}
          sub={sub ?? copy.sub}
        />
        <ScrollReveal className="group/biz-reveal grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resolvedCards.map((c, i) => {
            const Icon = c.icon;
            const Ghost = c.ghost ?? c.icon;
            return (
              <div
                key={i}
                className={cardBase}
                // eslint-disable-next-line react/forbid-dom-props -- per-card accent + stagger-index CSS vars
                style={{ "--card-accent": c.tone, "--i": i } as React.CSSProperties}
              >
                <Ghost
                  size={120}
                  strokeWidth={1.1}
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-5 -bottom-6 text-[var(--card-accent)] opacity-[0.05] transition-[opacity,transform] duration-500 group-hover/biz-card:-translate-y-1 group-hover/biz-card:opacity-[0.09]"
                />

                <div className="relative flex items-center gap-3">
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl border border-[oklch(from_var(--card-accent)_l_c_h_/_0.3)] bg-[oklch(from_var(--card-accent)_l_c_h_/_0.12)] text-[oklch(from_var(--card-accent)_0.85_0.12_h)] [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.06)]">
                    <Icon size={26} strokeWidth={1.6} />
                  </span>
                  {c.label ? (
                    <span className="ml-auto rounded-full border border-[oklch(from_var(--card-accent)_l_c_h_/_0.3)] bg-[oklch(from_var(--card-accent)_l_c_h_/_0.1)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[oklch(from_var(--card-accent)_0.85_0.1_h)]">
                      {c.label}
                    </span>
                  ) : null}
                </div>

                <h3 className="relative mt-6 font-actay text-[22px] font-bold uppercase leading-[1.1] tracking-[-0.01em] text-ink lg:text-[26px]">
                  {c.title}
                </h3>
                <p className="relative mt-3 max-w-[42ch] text-[15px] leading-[1.6] text-ink-dim [text-wrap:pretty]">
                  {c.body}
                </p>

                <div className="relative mt-auto pt-7 max-sm:hidden">
                  <BizVisual kind={c.visual} locale={locale} />
                </div>
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
