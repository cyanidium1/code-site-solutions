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
      Мінімум вашої участі — <em>повний контроль</em> у ваших руках
    </>
  ),
  sub: "Працюємо офіційно, за договором. Сайт, доступи й результат — ваші.",
};

const EN_COPY: SectionCopy = {
  eyebrow: "WHY US",
  heading: (
    <>
      Minimal involvement from you — <em>full control</em> still in your hands
    </>
  ),
  sub: "We work under contract. The site, the access, and the results are yours.",
};

const UK_CARDS: BizCard[] = [
  {
    icon: Handshake,
    ghost: FileSignature,
    title: "Працюємо за договором",
    body: "Офіційно, з фіксованим обсягом і терміном. Бриф і ТЗ пишемо самі — ставимо правильні питання й беремо папери на себе.",
    tone: PURPLE,
    visual: "deal",
  },
  {
    icon: ShieldCheck,
    label: "Власність",
    title: "Все належить вам",
    body: "Код, домен, хостинг, доступи, адмінка — ваші з першого дня. Вирішите змінити команду? Заберете все з собою.",
    tone: BLUE,
    visual: "control",
  },
  {
    icon: LayoutDashboard,
    label: "Адмінка",
    title: "Керування з телефона",
    body: "Керуєте сайтом самі: тексти, сторінки, послуги, кейси та блог редагуються за хвилину. Розробник не потрібен.",
    tone: PURPLE,
    visual: "cms",
  },
  {
    icon: Rocket,
    label: "Дедлайн",
    title: "Неустойка за зрив терміну",
    body: "Зірвемо дедлайн — платимо ми. Тому вкластися вчасно нам важливо так само, як і вам.",
    tone: AMBER,
    visual: "launch",
  },
  {
    icon: TrendingUp,
    label: "SEO",
    title: "Чесність із першого дня",
    body: "Ніхто не може гарантувати №1 у Google — це довга робота. Ми будуємо сайт за всіма стандартами, які Google та AI-пошук винагороджують позиціями. Решта — контент і час.",
    tone: GREEN,
    visual: "seo",
  },
  {
    icon: Headset,
    label: "Гарантія",
    title: "Не зникаємо після запуску",
    body: "Рік підтримки включено: виправляємо технічні проблеми, допомагаємо з розвитком і підтримуємо сайт.",
    tone: PURPLE,
    visual: "support",
  },
];

const EN_CARDS: BizCard[] = [
  {
    icon: Handshake,
    ghost: FileSignature,
    title: "We work under contract",
    body: "Officially, with a fixed scope and timeline. We write the brief and the spec ourselves — we ask the right questions and handle the paperwork for you.",
    tone: PURPLE,
    visual: "deal",
  },
  {
    icon: ShieldCheck,
    label: "Ownership",
    title: "Everything belongs to you",
    body: "Code, domain, hosting, access, admin panel — yours from day one. Decide to switch teams? You take it all with you.",
    tone: BLUE,
    visual: "control",
  },
  {
    icon: LayoutDashboard,
    label: "Admin",
    title: "Manage it from your phone",
    body: "You manage the site yourself: edit text, pages, services, cases, and the blog in a minute. No developer required.",
    tone: PURPLE,
    visual: "cms",
  },
  {
    icon: Rocket,
    label: "Deadline",
    title: "A penalty if we miss the deadline",
    body: "Miss the deadline, we pay. So hitting it on time matters to us just as much as it does to you.",
    tone: AMBER,
    visual: "launch",
  },
  {
    icon: TrendingUp,
    label: "SEO",
    title: "Honesty from day one",
    body: "No one can guarantee #1 on Google — that’s long-term work. We build the site to every standard Google and AI search reward with rankings. The rest comes down to content and time.",
    tone: GREEN,
    visual: "seo",
  },
  {
    icon: Headset,
    label: "Warranty",
    title: "We don’t disappear after launch",
    body: "A year of support included: we fix technical issues, help you grow, and keep the site running.",
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

// Card shell/entrance/hover/hairline styles live in src/app/homepage-cards.css
// as `.hp-biz-card` — this 1.4 KB stack repeated 6× cost ~17 KB of document
// (HTML + RSC flight, see docs/rsc-payload-report.md). `group/biz-card` stays
// as the marker for the watermark's group-hover.
const cardBase = "group/biz-card hp-biz-card";

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

                <div className="relative mt-auto pt-7 hidden sm:block">
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
