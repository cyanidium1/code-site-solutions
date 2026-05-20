import { cn } from "@/lib/utils";
import "./reasons.css";

export type Reason = {
  n: string;
  tag: string;
  title: React.ReactNode;
  body: React.ReactNode;
  /** `src` (data attribution caption) is optional; omitted to remove
   *  fabricated "BENCHMARK · 2025" / "GLOBAL DATA · 2024" labels. */
  stat: { n: string; lbl: string; src?: string };
};

const ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DEFAULT_REASONS: Reason[] = [
  {
    n: "01",
    tag: "UX · CONVERSION",
    title: (
      <>
        Немає <em>онлайн-запису</em>
      </>
    ),
    body: (
      <>
        Пацієнт мусить телефонувати в робочий час. 60% записів
        втрачається ввечері і у вихідні. Молода аудиторія взагалі не телефонує
        — вона пише в Instagram конкурентам, у яких{" "}
        <mark>онлайн-запис працює</mark>.
      </>
    ),
    stat: {
      n: "60%",
      lbl: "дзвінків поза робочим часом залишаються без відповіді",
    },
  },
  {
    n: "02",
    tag: "TRUST · CONTENT",
    title: (
      <>
        Немає <em>цін</em> і <em>фото лікарів</em>
      </>
    ),
    body: (
      <>
        Пацієнт не розуміє, до кого потрапить і скільки заплатить. Закриває
        ваш сайт, йде на сайт клініки, де це є. У 2026 році
        непрозорість — це <mark>втрачені пацієнти</mark>.
      </>
    ),
    stat: {
      n: "×3.2",
      lbl: "вища конверсія у клінік з прозорим прайсом і командою",
    },
  },
  {
    n: "03",
    tag: "SEO · LOCAL",
    title: (
      <>
        Вас не видно в <em>Google</em>
      </>
    ),
    body: (
      <>
        Конкуренти у вашому районі вищі в пошуку за запитом «стоматолог + район» або «клініка + місто».{" "}
        <mark>80% пацієнтів</mark> не йдуть далі першої сторінки результатів.
      </>
    ),
    stat: {
      n: "80%",
      lbl: "кліків забирають перші 5 результатів локального пошуку",
      src: "GOOGLE · 2025",
    },
  },
];

export function Reasons({
  eyebrow = "ДІАГНОСТИКА",
  eyebrowNum = "/ 03 ПУНКТИ",
  heading = (
    <>
      3 причини, чому пацієнти
      <br />
      <em>не записуються</em> з вашого сайту
    </>
  ),
  metaRows = ["аналіз 47 клінік · 2024–25", "розділ 02 / 06"],
  items = DEFAULT_REASONS,
  footText = (
    <>
      Виправляємо <strong>всі три</strong> на запуску — без вашої участі.
    </>
  ),
  footCtaLabel = "Перевірити мій сайт",
}: {
  eyebrow?: string;
  eyebrowNum?: string;
  heading?: React.ReactNode;
  metaRows?: string[];
  items?: Reason[];
  footText?: React.ReactNode;
  footCtaLabel?: string;
}) {
  return (
    <section className="relative py-[var(--section-y-lg)] px-12 bg-bg overflow-hidden max-[1100px]:px-8 max-[640px]:px-[18px]">
      <div className="reasons-bg absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-[2] max-w-container mx-auto">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] gap-10 items-end mb-[72px] pb-8 border-b border-line max-[1100px]:mb-14 max-[1100px]:pb-6 max-[1100px]:gap-8 max-[640px]:grid-cols-1 max-[640px]:items-start max-[640px]:gap-4 max-[640px]:mb-9 max-[640px]:pb-5">
          <div>
            <div className="inline-flex items-center gap-2.5 pl-3 pr-3.5 py-[7px] border border-[var(--line-2)] rounded-full text-[11px] font-medium tracking-[0.12em] text-[var(--ink-2)] bg-[oklch(1_0_0_/_0.025)] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
              <span>{eyebrow}</span>
              <span className="font-mono text-[10px] text-[var(--ink-3)]">
                {eyebrowNum}
              </span>
            </div>
            <h2 className="font-display font-bold text-[clamp(34px,4.6vw,60px)] leading-none tracking-[-0.035em] text-ink max-w-[24ch] text-balance max-[1100px]:text-[clamp(30px,4.2vw,44px)] max-[640px]:text-[clamp(28px,9vw,38px)] max-[640px]:max-w-full [&_em]:italic [&_em]:font-light [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
              {heading}
            </h2>
          </div>
          <div className="font-mono text-[11px] text-[var(--ink-3)] tracking-[0.04em] text-right whitespace-nowrap pb-2 max-[640px]:text-left">
            {metaRows.map((row, i) => (
              <div
                className={cn(
                  "flex items-center gap-2 justify-end max-[640px]:justify-start",
                  i > 0 && "mt-1.5"
                )}
                key={i}
              >
                <span className="text-accent-soft">—</span>
                <span>{row}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Asymmetric layout: first reason as a large hero card on the
            left (spans both rows), remaining reasons stacked compact on
            the right. Collapses to single column ≤1100. */}
        <ol
          className="reasons-asymmetric grid grid-cols-[2fr_1fr] grid-rows-[1fr_1fr] gap-6 list-none m-0 p-0 max-[1100px]:grid-cols-1 max-[1100px]:grid-rows-none max-[1100px]:gap-4"
        >
          {items.map((r, i) => {
            const isPrimary = i === 0;
            return (
              <li
                key={r.n}
                className={`reason relative ${
                  isPrimary
                    ? "row-span-2 p-9 max-[1100px]:row-span-1 max-[1100px]:p-7 max-[640px]:p-5"
                    : "p-7 max-[1100px]:p-6 max-[640px]:p-5"
                } border border-line rounded-[20px] bg-[oklch(1_0_0_/_0.02)] flex flex-col gap-5`}
              >
                <header className="flex items-start justify-between gap-4">
                  <div
                    className={`font-display font-bold leading-[0.85] tracking-[-0.05em] bg-brand-gradient bg-clip-text text-transparent tabular-nums ${
                      isPrimary
                        ? "text-[clamp(72px,9vw,128px)] max-[1100px]:text-[clamp(64px,8vw,96px)] max-[640px]:text-[64px]"
                        : "text-[clamp(48px,5vw,72px)] max-[640px]:text-[48px]"
                    }`}
                  >
                    {r.n}
                  </div>
                  <span className="font-mono text-[10px] font-medium text-[var(--ink-3)] tracking-[0.08em] px-2.5 py-1 border border-line rounded-full bg-[oklch(1_0_0_/_0.02)] shrink-0 max-[640px]:text-[9px]">
                    {r.tag}
                  </span>
                </header>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-display font-bold leading-[1.15] tracking-[-0.02em] text-ink mb-3 [&_em]:italic [&_em]:font-normal [&_em]:text-accent-soft ${
                      isPrimary
                        ? "text-[clamp(22px,2.4vw,32px)] max-[640px]:text-[20px]"
                        : "text-[clamp(18px,1.8vw,22px)] max-[640px]:text-[17px]"
                    }`}
                  >
                    {r.title}
                  </h3>
                  <p
                    className={`leading-[1.65] text-[var(--ink-2)] text-pretty [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium [&_mark]:bg-[oklch(from_var(--accent)_l_c_h_/_0.18)] [&_mark]:text-accent-soft [&_mark]:px-1.5 [&_mark]:py-px [&_mark]:rounded [&_mark]:font-medium ${
                      isPrimary
                        ? "text-[15.5px] max-w-[58ch] max-[640px]:text-[14px]"
                        : "text-[13.5px] max-w-[50ch] max-[640px]:text-[13px]"
                    }`}
                  >
                    {r.body}
                  </p>
                </div>
                <footer className="flex items-baseline gap-4 pt-4 border-t border-dashed border-line">
                  <div
                    className={`font-display font-bold tracking-[-0.03em] leading-none bg-brand-gradient bg-clip-text text-transparent shrink-0 ${
                      isPrimary ? "text-[32px] max-[640px]:text-[26px]" : "text-[24px] max-[640px]:text-[20px]"
                    }`}
                  >
                    {r.stat.n}
                  </div>
                  <div className="text-[11.5px] text-[var(--ink-3)] leading-[1.4] tracking-[0.02em] flex-1">
                    {r.stat.lbl}
                  </div>
                  {r.stat.src ? (
                    <div className="font-mono text-[9px] text-[var(--ink-3)] tracking-[0.06em] uppercase shrink-0 max-[640px]:hidden">
                      {r.stat.src}
                    </div>
                  ) : null}
                </footer>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center justify-between gap-6 flex-wrap mt-12 py-[22px] px-7 border border-line rounded-full bg-[oklch(1_0_0_/_0.02)] max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:rounded-[18px] max-[640px]:p-[18px] max-[640px]:gap-4 max-[640px]:mt-8">
          <div className="text-[14px] text-[var(--ink-2)] flex items-center gap-3 [&_strong]:text-ink [&_strong]:font-semibold max-[640px]:text-[13px] max-[640px]:justify-center max-[640px]:text-center">
            <span className="inline-block w-2 h-2 [border-right:1.5px_solid_var(--accent-soft)] [border-bottom:1.5px_solid_var(--accent-soft)] rotate-[-45deg]" />
            <span>{footText}</span>
          </div>
          <button
            type="button"
            className="bg-ink text-bg border-0 px-[22px] py-3 rounded-full text-[13px] font-semibold inline-flex items-center gap-2.5 cursor-pointer transition-[transform,box-shadow] duration-200 shadow-[0_4px_16px_oklch(from_var(--accent)_l_c_h_/_0.2),0_0_0_1px_oklch(1_0_0_/_0.1)_inset] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_oklch(from_var(--accent)_l_c_h_/_0.3),0_0_0_1px_oklch(1_0_0_/_0.1)_inset] max-[640px]:justify-center max-[640px]:px-[18px] max-[640px]:py-3.5"
          >
            <span>{footCtaLabel}</span>
            {ARROW_ICON}
          </button>
        </div>
      </div>
    </section>
  );
}
