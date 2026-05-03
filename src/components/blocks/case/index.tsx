import "./case.css";

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

export function CrossIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CaseShot({
  src,
  url,
  alt,
}: {
  src?: string;
  url: string;
  alt: string;
}) {
  return (
    <div className="case-shot">
      <div className="case-shot-bar">
        <span className="case-shot-dot" />
        <span className="case-shot-dot" />
        <span className="case-shot-dot" />
        <span className="case-shot-url">{url}</span>
      </div>
      <div className="case-shot-img">
        {src ? (
          <img src={src} alt={alt} />
        ) : (
          <div className="case-shot-placeholder" aria-hidden="true">
            <div className="case-shot-placeholder-line" />
            <div className="case-shot-placeholder-line case-shot-placeholder-line-short" />
            <div className="case-shot-placeholder-grid">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const DEFAULT_BEFORE_LIST: React.ReactNode[] = [
  <>заплутана структура сайту, користувачі не розуміли куди натискати</>,
  <>
    застарілий дизайн, який не викликав <em>довіри</em>
  </>,
  <>низька швидкість завантаження</>,
  <>некоректна мультимовність (російська/українська)</>,
  <>
    незручна адмінка — будь-які зміни через розробника <em>за гроші</em>
  </>,
  <>сайт періодично падав</>,
  <>не було нормальної системи запису/бронювання</>,
];

const DEFAULT_AFTER_LIST: React.ReactNode[] = [
  <>
    зрозуміла структура сайту <em>під користувача</em>
  </>,
  <>сучасний дизайн, що підвищує довіру</>,
  <>
    швидке завантаження <em>&lt;1.5 c</em>
  </>,
  <>коректна мультимовність (RU/UA)</>,
  <>
    зручна адмінка <em>без розробника</em>
  </>,
  <>стабільна робота без падінь</>,
  <>онлайн-запис та форми заявок</>,
];

const DEFAULT_RESULTS = [
  { n: "×3.2", lbl: "більше заявок з сайту", tag: "CONVERSION" },
  { n: "<1.5c", lbl: "час завантаження сторінки", tag: "PERFORMANCE" },
  { n: "98", lbl: "Lighthouse · Performance", tag: "CORE WEB VITALS" },
  { n: "×4", lbl: "органічного трафіку Google", tag: "SEO · 6 МІС." },
];

export function Case({
  eyebrow = "РЕАЛЬНИЙ КЕЙС",
  eyebrowEm = "КЛІНІКА «ЕФЕДРА», ОДЕСА",
  heading = (
    <>
      До / Після на прикладі
      <br />
      <em>реального</em> клієнта
    </>
  ),
  lede = (
    <>
      До нас звернулася клініка <em>«Ефедра»</em> з Одеси — із застарілим сайтом,
      який не приносив заявок. Завдання було не просте: переробити структуру,
      дизайн і логіку під <em>два напрямки</em> бізнесу клініки — стоматологію
      і студію краси.
    </>
  ),
  meta = [
    { strong: "4 тижні", text: "від брифу до релізу" },
    { strong: "2 напрямки", text: "стоматологія + естетика" },
    { strong: "UA + RU", text: "локалізація під SEO" },
  ],
  beforeNum = "EFEDRA · v1 · 2022",
  beforeShotSrc,
  beforeShotUrl = "efedraclinic.com.ua",
  beforeShotAlt = "Старий сайт клініки Ефедра",
  beforeTagline = "Сайт, що не продає",
  beforeList = DEFAULT_BEFORE_LIST,
  beforeFoot = (
    <>
      <strong>Примітка:</strong> російську мову залишено як основну для SEO,
      оскільки в Одесі значна частина пошукових запитів все ще російською мовою.
    </>
  ),
  afterNum = "EFEDRA · v2 · 2025",
  afterShotSrc,
  afterShotUrl = "efedra.com.ua",
  afterShotAlt = "Новий сайт клініки Ефедра",
  afterTagline = "Сайт, що приводить пацієнтів",
  afterList = DEFAULT_AFTER_LIST,
  afterFoot = (
    <>
      <strong>Бонус:</strong> два розділи (стоматологія і естетика) під одним
      брендом — без втрати фокусу і з окремими лід-формами під кожен напрямок.
    </>
  ),
  results = DEFAULT_RESULTS,
  ctaText = (
    <>
      Хочете <strong>такий самий результат</strong>? Подивіться, як ми це
      робимо.
    </>
  ),
  ctaLabel = "Подивитися кейси клінік",
  locale = "uk",
}: Partial<{
  eyebrow: string;
  eyebrowEm: string;
  heading: React.ReactNode;
  lede: React.ReactNode;
  meta: { strong: string; text: string }[];
  beforeNum: string;
  beforeShotSrc?: string;
  beforeShotUrl: string;
  beforeShotAlt: string;
  beforeTagline: string;
  beforeList: React.ReactNode[];
  beforeFoot: React.ReactNode;
  afterNum: string;
  afterShotSrc?: string;
  afterShotUrl: string;
  afterShotAlt: string;
  afterTagline: string;
  afterList: React.ReactNode[];
  afterFoot: React.ReactNode;
  results: { n: string; lbl: string; tag: string }[];
  ctaText: React.ReactNode;
  ctaLabel: string;
  locale: "uk" | "en";
}> = {}) {
  const beforeLabel = locale === "en" ? "BEFORE" : "БУЛО";
  const afterLabel = locale === "en" ? "AFTER" : "СТАЛО";
  return (
    <section className="case">
      <div className="case-bg" />

      <div className="case-inner">
        <header className="case-header">
          <div>
            <div className="case-eyebrow">
              <span className="case-eyebrow-dot" />
              <span>{eyebrow}</span>
              <span className="case-eyebrow-sep">·</span>
              <span className="case-eyebrow-em">{eyebrowEm}</span>
            </div>
            <h2 className="case-h2">{heading}</h2>
          </div>
          <div>
            <p className="case-lede">{lede}</p>
            <div className="case-meta">
              {meta.map((m, i) => (
                <div className="case-meta-item" key={i}>
                  <strong>{m.strong}</strong>
                  {m.text}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="case-grid">
          <article className="case-card case-card-before">
            <div className="case-card-head">
              <span className="case-badge case-badge-before">
                <span className="case-badge-dot" />
                <span>{beforeLabel}</span>
              </span>
              <span className="case-card-num">{beforeNum}</span>
            </div>
            <CaseShot src={beforeShotSrc} url={beforeShotUrl} alt={beforeShotAlt} />
            <h3 className="case-tagline">
              <span className="case-tagline-icn case-tagline-icn-bad">×</span>
              {beforeTagline}
            </h3>
            <ul className="case-list">
              {beforeList.map((item, i) => (
                <li key={i}>
                  <span className="case-list-icn case-list-icn-bad">
                    <CrossIcon />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="case-card-foot">{beforeFoot}</p>
          </article>

          <article className="case-card case-card-after">
            <div className="case-card-head">
              <span className="case-badge case-badge-after">
                <span className="case-badge-dot" />
                <span>{afterLabel}</span>
              </span>
              <span className="case-card-num">{afterNum}</span>
            </div>
            <CaseShot src={afterShotSrc} url={afterShotUrl} alt={afterShotAlt} />
            <h3 className="case-tagline">
              <span className="case-tagline-icn case-tagline-icn-good">✓</span>
              {afterTagline}
            </h3>
            <ul className="case-list">
              {afterList.map((item, i) => (
                <li key={i}>
                  <span className="case-list-icn case-list-icn-good">
                    <CheckIcon />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="case-card-foot">{afterFoot}</p>
          </article>
        </div>

        <div className="case-results">
          {results.map((r) => (
            <div className="case-result" key={r.lbl}>
              <div className="case-result-tag">{r.tag}</div>
              <div className="case-result-num">{r.n}</div>
              <div className="case-result-lbl">{r.lbl}</div>
            </div>
          ))}
        </div>

        <div className="case-cta">
          <div className="case-cta-text">
            <span className="case-cta-arrow" />
            <span>{ctaText}</span>
          </div>
          <button type="button" className="case-cta-btn">
            <span>{ctaLabel}</span>
            {ARROW_ICON}
          </button>
        </div>
      </div>
    </section>
  );
}
