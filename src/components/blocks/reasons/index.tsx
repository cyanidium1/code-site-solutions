import "./reasons.css";

export type Reason = {
  n: string;
  tag: string;
  title: React.ReactNode;
  body: React.ReactNode;
  stat: { n: string; lbl: string; src: string };
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
        Пацієнт мусить телефонувати в робочий час. <em>60% записів</em>{" "}
        втрачається ввечері і у вихідні. Молода аудиторія взагалі не телефонує
        — вона пише в Instagram конкурентам, у яких{" "}
        <mark>онлайн-запис працює</mark>.
      </>
    ),
    stat: {
      n: "60%",
      lbl: "дзвінків поза робочим часом залишаються без відповіді",
      src: "GLOBAL DATA · 2024",
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
        ваш сайт, йде на сайт клініки, де це є. У <em>2026 році</em>{" "}
        непрозорість — це <mark>втрачені пацієнти</mark>.
      </>
    ),
    stat: {
      n: "×2.4",
      lbl: "вища конверсія у клінік з прозорим прайсом і командою",
      src: "BENCHMARK · 2025",
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
        Конкуренти у вашому районі вищі в пошуку за запитом «
        <em>стоматолог + район</em>» або «<em>клініка + місто</em>».{" "}
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
    <section className="reasons">
      <div className="reasons-bg" />

      <div className="reasons-inner">
        <header className="reasons-header">
          <div>
            <div className="reasons-eyebrow">
              <span className="reasons-eyebrow-dot" />
              <span>{eyebrow}</span>
              <span className="reasons-eyebrow-num">{eyebrowNum}</span>
            </div>
            <h2 className="reasons-h2">{heading}</h2>
          </div>
          <div className="reasons-meta">
            {metaRows.map((row, i) => (
              <div className="reasons-meta-row" key={i}>
                <span className="reasons-meta-dash">—</span>
                <span>{row}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="reasons-list">
          {items.map((r) => (
            <article className="reason" key={r.n}>
              <div className="reason-num-col">
                <div className="reason-num">{r.n}</div>
                <span className="reason-num-tag">{r.tag}</span>
              </div>
              <div className="reason-body">
                <h3 className="reason-title">{r.title}</h3>
                <p className="reason-text">{r.body}</p>
              </div>
              <div className="reason-stat">
                <div className="reason-stat-num">{r.stat.n}</div>
                <div className="reason-stat-lbl">{r.stat.lbl}</div>
                <div className="reason-stat-src">{r.stat.src}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="reasons-foot">
          <div className="reasons-foot-text">
            <span className="reasons-foot-arrow" />
            <span>{footText}</span>
          </div>
          <button type="button" className="reasons-foot-cta">
            <span>{footCtaLabel}</span>
            {ARROW_ICON}
          </button>
        </div>
      </div>
    </section>
  );
}
