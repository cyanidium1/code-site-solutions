import { cn } from "@/components/ui";

// Background decoration: 2-layer radial gradient + masked vertical-line grid
// overlay. Inlined as arbitrary values so no semantic .reasons-bg class needed.
const REASONS_BG_CLASS = [
  "absolute inset-0 z-0 pointer-events-none",
  "bg-[radial-gradient(ellipse_50%_40%_at_90%_10%,oklch(from_var(--color-accent-2)_l_c_h_/_0.08),transparent_70%),radial-gradient(ellipse_40%_50%_at_5%_80%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%)]",
  "before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,oklch(1_0_0_/_0.02)_1px,transparent_1px)] before:[background-size:80px_80px] before:[mask:radial-gradient(ellipse_70%_80%_at_50%_50%,black,transparent)] before:[-webkit-mask:radial-gradient(ellipse_70%_80%_at_50%_50%,black,transparent)]",
].join(" ");

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
    <section className="relative py-[72px] lg:py-[120px] px-[18px] sm:px-8 xl:px-12 bg-bg overflow-hidden">
      <div className={REASONS_BG_CLASS} />

      <div className="relative z-[2] max-w-container mx-auto">
        <header className="grid grid-cols-1 gap-4 items-start mb-9 pb-5 border-b border-line sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8 sm:items-end sm:mb-14 sm:pb-6 xl:gap-10 xl:mb-[72px] xl:pb-8">
          <div>
            <div className="inline-flex items-center gap-2.5 pl-3 pr-3.5 py-[7px] border border-[var(--color-line-strong)] rounded-full text-[11px] font-medium tracking-[0.12em] text-[var(--color-ink-dim)] bg-[oklch(1_0_0_/_0.025)] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
              <span>{eyebrow}</span>
              <span className="font-mono text-[10px] text-[var(--color-ink-3)]">
                {eyebrowNum}
              </span>
            </div>
            <h2 className="font-display font-bold text-[clamp(28px,9vw,38px)] leading-none tracking-[-0.035em] text-ink max-w-full text-balance sm:text-[clamp(30px,4.2vw,44px)] sm:max-w-[24ch] xl:text-[clamp(34px,4.6vw,60px)] [&_em]:italic [&_em]:font-light [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
              {heading}
            </h2>
          </div>
          <div className="font-mono text-[11px] text-[var(--color-ink-3)] tracking-[0.04em] text-left whitespace-nowrap pb-2 sm:text-right">
            {metaRows.map((row, i) => (
              <div
                className={cn(
                  "flex items-center gap-2 justify-start sm:justify-end",
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
          className="reasons-asymmetric grid grid-cols-1 grid-rows-none gap-4 list-none m-0 p-0 xl:grid-cols-[2fr_1fr] xl:grid-rows-[1fr_1fr] xl:gap-6"
        >
          {items.map((r, i) => {
            const isPrimary = i === 0;
            return (
              <li
                key={r.n}
                className={`reason relative ${
                  isPrimary
                    ? "row-span-1 p-5 sm:p-7 xl:row-span-2 xl:p-9"
                    : "p-5 sm:p-6 xl:p-7"
                } border border-line rounded-[20px] bg-[oklch(1_0_0_/_0.02)] flex flex-col gap-5`}
              >
                <header className="flex items-start justify-between gap-4">
                  <div
                    className={`font-display font-bold leading-[0.85] tracking-[-0.05em] bg-brand-gradient bg-clip-text text-transparent tabular-nums ${
                      isPrimary
                        ? "text-[64px] sm:text-[clamp(64px,8vw,96px)] xl:text-[clamp(72px,9vw,128px)]"
                        : "text-[48px] sm:text-[clamp(48px,5vw,72px)]"
                    }`}
                  >
                    {r.n}
                  </div>
                  <span className="font-mono text-[9px] font-medium text-[var(--color-ink-3)] tracking-[0.08em] px-2.5 py-1 border border-line rounded-full bg-[oklch(1_0_0_/_0.02)] shrink-0 sm:text-[10px]">
                    {r.tag}
                  </span>
                </header>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-display font-bold leading-[1.15] tracking-[-0.02em] text-ink mb-3 [&_em]:italic [&_em]:font-normal [&_em]:text-accent-soft ${
                      isPrimary
                        ? "text-[20px] sm:text-[clamp(22px,2.4vw,32px)]"
                        : "text-[17px] sm:text-[clamp(18px,1.8vw,22px)]"
                    }`}
                  >
                    {r.title}
                  </h3>
                  <p
                    className={`leading-[1.65] text-[var(--color-ink-dim)] text-pretty [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium [&_mark]:bg-accent-18 [&_mark]:text-accent-soft [&_mark]:px-1.5 [&_mark]:py-px [&_mark]:rounded [&_mark]:font-medium ${
                      isPrimary
                        ? "text-[14px] max-w-[58ch] sm:text-[15.5px]"
                        : "text-[13px] max-w-[50ch] sm:text-[13.5px]"
                    }`}
                  >
                    {r.body}
                  </p>
                </div>
                <footer className="flex items-baseline gap-4 pt-4 border-t border-dashed border-line">
                  <div
                    className={`font-display font-bold tracking-[-0.03em] leading-none bg-brand-gradient bg-clip-text text-transparent shrink-0 ${
                      isPrimary ? "text-[26px] sm:text-[32px]" : "text-[20px] sm:text-[24px]"
                    }`}
                  >
                    {r.stat.n}
                  </div>
                  <div className="text-[11.5px] text-[var(--color-ink-3)] leading-[1.4] tracking-[0.02em] flex-1">
                    {r.stat.lbl}
                  </div>
                  {r.stat.src ? (
                    <div className="font-mono text-[9px] text-[var(--color-ink-3)] tracking-[0.06em] uppercase shrink-0 hidden sm:block">
                      {r.stat.src}
                    </div>
                  ) : null}
                </footer>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col items-stretch gap-4 flex-wrap mt-8 p-[18px] border border-line rounded-[18px] bg-[oklch(1_0_0_/_0.02)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:mt-12 sm:py-[22px] sm:px-7 sm:rounded-full">
          <div className="text-[13px] text-[var(--color-ink-dim)] flex items-center justify-center text-center gap-3 [&_strong]:text-ink [&_strong]:font-semibold sm:text-[14px] sm:justify-normal sm:text-start">
            <span className="inline-block w-2 h-2 [border-right:1.5px_solid_var(--color-accent-soft)] [border-bottom:1.5px_solid_var(--color-accent-soft)] rotate-[-45deg]" />
            <span>{footText}</span>
          </div>
          <button
            type="button"
            className="bg-ink text-bg border-0 justify-center min-h-11 px-[18px] py-3.5 rounded-full text-[13px] font-semibold inline-flex items-center gap-2.5 cursor-pointer transition-[transform,box-shadow] duration-200 shadow-[0_4px_16px_oklch(from_var(--color-accent)_l_c_h_/_0.2),0_0_0_1px_oklch(1_0_0_/_0.1)_inset] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_oklch(from_var(--color-accent)_l_c_h_/_0.3),0_0_0_1px_oklch(1_0_0_/_0.1)_inset] sm:justify-normal sm:px-[22px] sm:py-3"
          >
            <span>{footCtaLabel}</span>
            {ARROW_ICON}
          </button>
        </div>
      </div>
    </section>
  );
}
