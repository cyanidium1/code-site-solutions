function TierCheck() {
  return (
    <svg className="tier-check" viewBox="0 0 24 24" fill="none">
      <path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TierX() {
  return (
    <svg className="tier-x" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TableRow({ param, wp, wix, custom, labels }) {
  return (
    <tr>
      <td className="cmp-td-param" data-label={labels[0]}>{param}</td>
      <td className="cmp-td-bad" data-label={labels[1]}>{wp}</td>
      <td className="cmp-td-bad" data-label={labels[2]}>{wix}</td>
      <td className="cmp-td-good" data-label={labels[3]}>{custom}</td>
    </tr>
  );
}

function Tier({ name, price, weeks, popular, includes, excludes, ctaLabel, ctaGhost }) {
  return (
    <div className={'cmp-tier' + (popular ? ' cmp-tier-pop' : '')}>
      {popular && <div className="cmp-tier-badge">Популярно</div>}
      <div className="cmp-tier-head">
        <div className="cmp-tier-name" dangerouslySetInnerHTML={{ __html: name }} />
        <h3 className="cmp-tier-price">
          <em>від</em>
          {price}
        </h3>
        <div className="cmp-tier-meta">{weeks}</div>
      </div>

      <div>
        <h4 className="cmp-tier-section-h good">{includes.heading}</h4>
        <ul className="cmp-tier-list">
          {includes.items.map((it, i) => (
            <li key={i}>
              <TierCheck />
              <span dangerouslySetInnerHTML={{ __html: it }} />
            </li>
          ))}
        </ul>
      </div>

      {excludes && excludes.items.length > 0 && (
        <>
          <div className="cmp-tier-divider" />
          <div>
            <h4 className="cmp-tier-section-h">Не входить</h4>
            <ul className="cmp-tier-list muted">
              {excludes.items.map((it, i) => (
                <li key={i}>
                  <TierX />
                  <span dangerouslySetInnerHTML={{ __html: it }} />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="cmp-tier-cta">
        <button className={'cmp-tier-btn' + (ctaGhost ? ' cmp-tier-btn-ghost' : '')}>
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

function Comparison() {
  const tableLabels = ['Параметр', 'Шаблон WP', 'Wix', 'Кодовий сайт'];
  const rows = [
    { param: 'Швидкість завантаження', wp: '5–8 сек', wix: '3–6 сек', custom: '0,8–1,5 сек' },
    { param: 'Онлайн-запис', wp: 'плагін (баги)', wix: 'через Apps', custom: 'кастомна' },
    { param: 'Інтеграція з мед. CRM', wp: 'обмежена', wix: 'немає (Zapier)', custom: 'будь-яка' },
    { param: 'Локальне SEO', wp: 'плагін Yoast', wix: 'базове', custom: 'закладено' },
    { param: 'Безпека даних пацієнтів', wp: 'низька', wix: 'середня', custom: 'висока (GDPR)' },
    { param: 'Юр. коректність МОЗ', wp: 'залежить від теми', wix: 'обмежено', custom: 'перевіряємо юристом' },
    { param: 'TCO за 3 роки', wp: '$4–6k', wix: '$3,5–5k', custom: '$5–7k' },
  ];

  return (
    <section className="cmp">
      <div className="cmp-bg" />
      <div className="cmp-inner">

        {/* ─── Comparison table ──────────────────────────────────────────── */}
        <h2 className="cmp-h2">
          Чим кодовий сайт<br />
          кращий за шаблонну<br />
          медицину на <span className="upper-em">WordPress</span> або <span className="upper-em">Wix</span>
        </h2>

        <div className="cmp-table-wrap">
          <table className="cmp-table">
            <thead>
              <tr>
                <th>Параметр</th>
                <th>Шаблон WP</th>
                <th>Wix</th>
                <th className="cmp-th-good">Кодовий сайт</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => <TableRow key={i} {...r} labels={tableLabels} />)}
            </tbody>
          </table>
        </div>

        <div className="cmp-table-cta">
          <button className="cmp-btn-primary">Детальне порівняння конструкторів</button>
          <button className="cmp-btn-ghost">Порівняння з WordPress</button>
        </div>

        {/* ─── Contact form ──────────────────────────────────────────────── */}
        <div className="cmp-contact">
          <div className="cmp-contact-inner">
            <h2 className="cmp-contact-h">Обговорити проєкт</h2>
            <p className="cmp-contact-sub">
              Розкажіть коротко про вашу клініку — відповімо в Telegram протягом
              1–2 годин у робочий час.
            </p>
            <form className="cmp-form" onSubmit={(e) => e.preventDefault()}>
              <input className="cmp-input" type="text" placeholder="Як до вас звертатися" />
              <input className="cmp-input" type="text" placeholder="Telegram, телефон або email" />
              <textarea className="cmp-textarea" placeholder="Яка клініка, який сайт потрібен, що зараз не працює" />
              <button className="cmp-submit" type="submit">
                Надіслати — відповімо за 1–2 години
              </button>
            </form>
            <div className="cmp-contact-foot">
              Або одразу пишіть у Telegram — <a href="#">@fedirdev</a>
            </div>
          </div>
        </div>

        {/* ─── Pricing ───────────────────────────────────────────────────── */}
        <h2 className="cmp-h2">Скільки коштує сайт для клініки</h2>

        <div className="cmp-pricing-grid">
          <Tier
            name="Базовий сайт<br />клініки"
            price="$3 500"
            weeks="4 тижні"
            includes={{
              heading: 'Що входить',
              items: [
                'До 8 сторінок',
                'Онлайн-запис',
                'Каталог лікарів і послуг',
                'Прозорий прайс',
                'Відгуки пацієнтів',
                'Базове <em>SEO</em>',
                'Мобільна адаптація',
              ],
            }}
            excludes={{
              items: [
                'Створення контенту (тексти послуг, описи лікарів)',
                'Професійна фотозйомка',
                'ДМС-інтеграція',
                'Блог',
              ],
            }}
            ctaLabel="Замовити базовий"
          />

          <Tier
            popular
            name="Розширений"
            price="$6 500"
            weeks="6 тижнів"
            includes={{
              heading: 'Все з базового +',
              items: [
                'Блог і SEO-сторінки',
                '<em>ДМС-інтеграція</em>',
                'Фото-кейси до/після',
                'Історія відвідувань і нагадування',
                'Онлайн-консультація',
                'Інтеграція з медичною <em>CRM</em>',
              ],
            }}
            excludes={{
              items: [
                'Фотозйомка (можемо організувати окремо)',
                'Контент для блогу (можемо запропонувати копірайтера)',
                'Багатомовність',
              ],
            }}
            ctaLabel="Замовити розширений"
          />

          <Tier
            name="Преміум / мережа<br />клінік"
            price="$12 000"
            weeks="8–10 тижнів"
            includes={{
              heading: 'Все з розширеного +',
              items: [
                'Багатофіліальна структура',
                'Повна <em>CRM</em>-інтеграція',
                'Багатомовність',
                'Кастомні модулі під вашу спеціалізацію',
                'Підтримка по <em>SLA</em>',
              ],
            }}
            excludes={{
              items: [
                'Створення фото/відео контенту',
                'Юридичний консалтинг (тільки технічна юр-коректність)',
              ],
            }}
            ctaLabel="Обговорити мережу"
            ctaGhost
          />
        </div>

      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Comparison />);
