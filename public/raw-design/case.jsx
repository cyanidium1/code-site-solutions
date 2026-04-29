const BEFORE_LIST = [
  <>заплутана структура сайту, користувачі не розуміли куди натискати</>,
  <>застарілий дизайн, який не викликав <em>довіри</em></>,
  <>низька швидкість завантаження</>,
  <>некоректна мультимовність (російська/українська)</>,
  <>незручна адмінка — будь-які зміни через розробника <em>за гроші</em></>,
  <>сайт періодично падав</>,
  <>не було нормальної системи запису/бронювання</>,
];

const AFTER_LIST = [
  <>зрозуміла структура сайту <em>під користувача</em></>,
  <>сучасний дизайн, що підвищує довіру</>,
  <>швидке завантаження <em>&lt;1.5 c</em></>,
  <>коректна мультимовність (RU/UA)</>,
  <>зручна адмінка <em>без розробника</em></>,
  <>стабільна робота без падінь</>,
  <>онлайн-запис та форми заявок</>,
];

const RESULTS = [
  { n: '×3.2', lbl: 'більше заявок з сайту', tag: 'CONVERSION' },
  { n: '<1.5c', lbl: 'час завантаження сторінки', tag: 'PERFORMANCE' },
  { n: '98', lbl: 'Lighthouse · Performance', tag: 'CORE WEB VITALS' },
  { n: '×4', lbl: 'органічного трафіку Google', tag: 'SEO · 6 МІС.' },
];

function CrossIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CaseShot({ src, url, alt }) {
  return (
    <div className="case-shot">
      <div className="case-shot-bar">
        <span className="case-shot-dot" />
        <span className="case-shot-dot" />
        <span className="case-shot-dot" />
        <span className="case-shot-url">{url}</span>
      </div>
      <div className="case-shot-img">
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}

function Case() {
  return (
    <section className="case">
      <div className="case-bg" />

      <div className="case-inner">
        <header className="case-header">
          <div>
            <div className="case-eyebrow">
              <span className="case-eyebrow-dot" />
              <span>РЕАЛЬНИЙ КЕЙС</span>
              <span className="case-eyebrow-sep">·</span>
              <span className="case-eyebrow-em">КЛІНІКА «ЕФЕДРА», ОДЕСА</span>
            </div>
            <h2 className="case-h2">
              До / Після на прикладі<br />
              <em>реального</em> клієнта
            </h2>
          </div>
          <div>
            <p className="case-lede">
              До нас звернулася клініка <em>«Ефедра»</em> з Одеси — із застарілим
              сайтом, який не приносив заявок. Завдання було не просте: переробити
              структуру, дизайн і логіку під <em>два напрямки</em> бізнесу клініки —
              стоматологію і студію краси.
            </p>
            <div className="case-meta">
              <div className="case-meta-item">
                <strong>4 тижні</strong>
                від брифу до релізу
              </div>
              <div className="case-meta-item">
                <strong>2 напрямки</strong>
                стоматологія + естетика
              </div>
              <div className="case-meta-item">
                <strong>UA + RU</strong>
                локалізація під SEO
              </div>
            </div>
          </div>
        </header>

        <div className="case-grid">
          <article className="case-card case-card-before">
            <div className="case-card-head">
              <span className="case-badge case-badge-before">
                <span className="case-badge-dot" />
                <span>БУЛО</span>
              </span>
              <span className="case-card-num">EFEDRA · v1 · 2022</span>
            </div>
            <CaseShot src="assets/case-before.png" url="efedraclinic.com.ua" alt="Старий сайт клініки Ефедра" />
            <h3 className="case-tagline">
              <span className="case-tagline-icn case-tagline-icn-bad">×</span>
              Сайт, що не продає
            </h3>
            <ul className="case-list">
              {BEFORE_LIST.map((item, i) => (
                <li key={i}>
                  <span className="case-list-icn case-list-icn-bad"><CrossIcon /></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="case-card-foot">
              <strong>Примітка:</strong> російську мову залишено як основну для SEO, оскільки
              в Одесі значна частина пошукових запитів все ще російською мовою.
            </p>
          </article>

          <article className="case-card case-card-after">
            <div className="case-card-head">
              <span className="case-badge case-badge-after">
                <span className="case-badge-dot" />
                <span>СТАЛО</span>
              </span>
              <span className="case-card-num">EFEDRA · v2 · 2025</span>
            </div>
            <CaseShot src="assets/case-after.png" url="efedra.com.ua" alt="Новий сайт клініки Ефедра" />
            <h3 className="case-tagline">
              <span className="case-tagline-icn case-tagline-icn-good">✓</span>
              Сайт, що приводить пацієнтів
            </h3>
            <ul className="case-list">
              {AFTER_LIST.map((item, i) => (
                <li key={i}>
                  <span className="case-list-icn case-list-icn-good"><CheckIcon /></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="case-card-foot">
              <strong>Бонус:</strong> два розділи (стоматологія і естетика) під одним брендом —
              без втрати фокусу і з окремими лід-формами під кожен напрямок.
            </p>
          </article>
        </div>

        <div className="case-results">
          {RESULTS.map((r) => (
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
            <span>Хочете <strong>такий самий результат</strong>? Подивіться, як ми це робимо.</span>
          </div>
          <button type="button" className="case-cta-btn">
            <span>Подивитися кейси клінік</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Case />);
