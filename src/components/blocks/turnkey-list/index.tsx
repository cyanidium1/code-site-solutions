import {
  FileText,
  Palette,
  Smartphone,
  Code,
  LayoutDashboard,
  Lock,
  Cloud,
  Rocket,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

import { H2 } from "@/components/ui";

export type TurnkeyItem = {
  icon: LucideIcon;
  title: string;
  line: string;
};

const DEFAULT_ITEMS: TurnkeyItem[] = [
  {
    icon: FileText,
    title: "Копірайтинг",
    line: "стартові кейси, SEO-статті, тексти головної",
  },
  {
    icon: Palette,
    title: "Дизайн",
    line: "2 раунди правок включено",
  },
  {
    icon: Smartphone,
    title: "Верстка",
    line: "адаптив mobile / tablet / desktop",
  },
  {
    icon: Code,
    title: "Програмування",
    line: "Next.js, всі інтеграції",
  },
  {
    icon: LayoutDashboard,
    title: "Адмінка",
    line: "Sanity, ви додаєте контент з телефону",
  },
  {
    icon: Lock,
    title: "Домен і SSL",
    line: "налаштовуємо самі",
  },
  {
    icon: Cloud,
    title: "Хостинг",
    line: "Vercel або Cloudflare на ваш акаунт",
  },
  {
    icon: Rocket,
    title: "Запуск",
    line: "Search Console, Analytics, 301-редиректи",
  },
  {
    icon: LifeBuoy,
    title: "1 рік підтримки",
    line: "баги, оновлення, консультації",
  },
];

const DEFAULT_NOT_DOING: string[] = [
  "Фотозйомка об'єктів",
  "Платна реклама (Google Ads / Facebook)",
  "Підтримка стороннього коду / WordPress-сайтів",
];

// Layered radial accent + accent-2 gradients — `oklch(from var(--color-accent) l c h / 0.06)`
// pattern preserved as in Session 2 conversions. Uses @theme tokens.
const TURNKEY_BG =
  "bg-[radial-gradient(ellipse_50%_40%_at_80%_10%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%),radial-gradient(ellipse_50%_50%_at_10%_90%,oklch(from_var(--color-accent-2)_l_c_h_/_0.04),transparent_70%)]";

const EYEBROW_CLASS =
  "inline-flex items-center gap-2.5 py-1.5 px-3 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] text-[var(--color-ink-3)] uppercase " +
  "before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent before:shadow-[0_0_8px_oklch(from_var(--color-accent)_l_c_h_/_0.6)]";

// Brand-gradient italic em inside the H2 (cool→warm vertical sweep with text clip).
const HEADING_EM_CLASS =
  "[&_em]:italic [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:text-transparent";

const CELL_CLASS =
  "relative flex items-start gap-4 pt-[22px] pr-[22px] pb-6 pl-[22px] border border-line rounded-2xl bg-[oklch(1_0_0_/_0.02)] " +
  "transition-[transform,border-color,background-color,box-shadow] duration-200";

const ICON_BOX_CLASS =
  "flex-shrink-0 w-10 h-10 inline-flex items-center justify-center border border-[oklch(from_var(--color-accent)_l_c_h_/_0.25)] rounded-xl bg-[oklch(from_var(--color-accent)_l_c_h_/_0.08)] text-accent";

const NOT_LIST_CLASS =
  "list-none m-0 p-0 grid grid-cols-1 gap-y-2 gap-x-7 md:grid-cols-2 " +
  "[&_li]:relative [&_li]:pl-[18px] [&_li]:text-[13.5px] [&_li]:leading-[1.5] [&_li]:text-[var(--color-ink-dim)] " +
  "[&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-0 [&_li]:before:text-[var(--color-ink-3)]";

const DEFAULT_FOOTER = (
  <div className="p-[22px_26px_24px] border border-dashed border-line-strong rounded-2xl bg-[oklch(1_0_0_/_0.02)]">
    <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-ink-dim)] mb-[14px]">
      Чого ми не робимо
    </div>
    <ul className={NOT_LIST_CLASS}>
      {DEFAULT_NOT_DOING.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <p className="mt-4 text-[12.5px] leading-[1.6] text-[var(--color-ink-3)] italic">
      Якщо потрібне — порадимо перевірених партнерів. Не накручуємо ціну за
      чужу роботу.
    </p>
  </div>
);

export function TurnkeyList({
  eyebrow = "ПІД КЛЮЧ",
  heading = (
    <>
      Все, <em>що ми робимо за вас</em>
    </>
  ),
  sub = "Ви платите фіксовану суму і отримуєте готовий сайт. Не пишете ТЗ. Не шукаєте референси. Не ловите фотографа. Ось що входить у проєкт без додаткової плати:",
  items = DEFAULT_ITEMS,
  footer = DEFAULT_FOOTER,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  items?: TurnkeyItem[];
  footer?: React.ReactNode;
} = {}) {
  return (
    <section
      className="relative py-9 lg:py-14 px-6 sm:px-8 lg:px-12 bg-bg overflow-hidden"
      id="turnkey"
    >
      <div
        className={`absolute inset-0 z-0 pointer-events-none ${TURNKEY_BG}`}
      />
      <div className="relative z-[1] max-w-container mx-auto">
        <div className="flex flex-col items-start mb-14 max-w-[820px]">
          <span className={EYEBROW_CLASS}>{eyebrow}</span>
          <H2
            variant="turnkey"
            className={`mt-6 mb-0 text-ink ${HEADING_EM_CLASS}`}
          >
            {heading}
          </H2>
          {sub ? (
            <p className="mt-5 font-sans text-base leading-[1.6] text-[var(--color-ink-dim)] max-w-[640px]">
              {sub}
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-3 gap-[14px] max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1">
          {items.map((it, i) => {
            const Icon = it.icon;
            const num = String(i + 1).padStart(2, "0");
            return (
              <div className={CELL_CLASS} key={`${it.title}-${i}`}>
                <span className="absolute top-[14px] right-4 font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-3)]">
                  {num}
                </span>
                <div className={ICON_BOX_CLASS} aria-hidden="true">
                  <Icon size={18} strokeWidth={1.7} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  {/* Small card label (15.5px) — intentionally NOT using H3
                      variant: card-tile titles at this size don't merit a
                      shared variant; the global h1/h2/h3 selector still
                      applies font-actay during Phase C. */}
                  <h3 className="font-actay font-semibold text-[15.5px] tracking-[-0.01em] text-ink leading-[1.2] m-0">
                    {it.title}
                  </h3>
                  <p className="text-[13.5px] leading-[1.5] text-[var(--color-ink-dim)] m-0">
                    {it.line}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {footer ? <div className="mt-8 font-sans">{footer}</div> : null}
      </div>
    </section>
  );
}
