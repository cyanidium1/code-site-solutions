/* ═══ Icons (24x24 stroke=1.6) ═══════════════════════════════════════════ */

function IcCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcDoctors() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 18c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcPrice() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IcServices() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function IcShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IcPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══ Components ═════════════════════════════════════════════════════════ */

function FeatureCard({ icon, title, items, bg }) {
  return (
    <div className="feature-card">
      <div
        className="feature-card-bg"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-card-h">{title}</h3>
      <ul className="feature-card-list">
        {items.map((it, i) => (
          <li key={i}>
            <span className="feature-check"><CheckIcon /></span>
            <span dangerouslySetInnerHTML={{ __html: it }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Services() {
  const features = [
    {
      icon: <IcCalendar />,
      bg: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80',
      title: 'Онлайн-запис 24/7',
      items: [
        'Запис у <em>2 кліки</em>. SMS-підтвердження пацієнту, Telegram-сповіщення лікарю',
        'Інтеграція з <em>Dental4Windows</em>, Medesk, MedAI, Helsi, KeyCRM',
        'Автоматичні нагадування за день до прийому',
      ],
    },
    {
      icon: <IcDoctors />,
      bg: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
      title: 'Каталог лікарів',
      items: [
        'Фото, регалії, освіта, спеціалізація, реальні відгуки пацієнтів',
        'Розклад кожного лікаря в реальному часі',
        'Запис безпосередньо до обраного спеціаліста',
      ],
    },
    {
      icon: <IcPrice />,
      bg: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
      title: 'Прозорий прайс',
      items: [
        'Структурований прайс-лист, маркетолог оновлює ціни <em>за 2 хвилини</em>',
        'Юридично коректне оформлення (стоп-таблиця для пацієнтів)',
        'Можливість приховати окремі позиції від індексації',
      ],
    },
    {
      icon: <IcServices />,
      bg: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80',
      title: 'Каталог послуг',
      items: [
        'Детальний опис процедур з фото <em>«до/після»</em> (з дозволу пацієнтів)',
        'Повʼязані послуги і пакетні пропозиції',
        'Відеоматеріали від лікарів',
      ],
    },
    {
      icon: <IcShield />,
      bg: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      title: 'Інтеграція зі страховими',
      items: [
        'Список <em>ДМС-програм</em> з онлайн-розрахунком покриття',
        'Інтеграція з <em>Helsi</em> для держстраховок (НСЗУ)',
        'Запис із зазначенням страховки',
      ],
    },
    {
      icon: <IcPin />,
      bg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      title: 'Локальне SEO та аналітика',
      items: [
        '<em>Schema.org</em> розмітка MedicalOrganization, оптимізація під «стоматолог + район»',
        'Налаштування Google Business Profile, карта проїзду з парковкою',
        'Аналітика трафіку і воронки від перегляду до запису',
      ],
    },
  ];

  const integrations = [
    'Dental4Windows', 'Medesk', 'MedAI', 'Helsi',
    'KeyCRM', 'AmoCRM', 'Bitrix24', 'Telegram',
  ];

  return (
    <section className="services">
      <div className="services-bg" />
      <div className="services-inner">

        {/* ─── Testimonial ─────────────────────────────────────────────── */}
        <div className="testimonial">
          <div className="testimonial-visual" />
          <div className="testimonial-text">
            <div className="testimonial-eyebrow">
              <span className="testimonial-eyebrow-dot" />
              <span>ВІДГУК КЛІЄНТА</span>
            </div>
            <div className="testimonial-mark">"</div>
            <p className="testimonial-quote">
              Після запуску сайту ми почали отримувати в <em>3–4 рази</em> більше
              заявок. Особливо виріс потік з Google. І найголовніше — ми тепер
              <em> самі</em> можемо змінювати все на сайті без розробників.
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">АП</div>
              <div>
                <div className="testimonial-author-name">Анна П.</div>
                <div className="testimonial-author-role">Засновниця клініки в Одесі</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Feature cards ───────────────────────────────────────────── */}
        <header className="svc-header">
          <h2 className="svc-h2">
            Що ми робимо для<br />
            <em>медичних</em> клінік
          </h2>
          <p className="svc-sub">
            Не «<em>ще один шаблонний медичний сайт</em>». Кожен проєкт — під
            конкретну клініку, її спеціалізацію і регуляторні вимоги.
          </p>
        </header>

        <div className="feature-grid">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>

        {/* ─── Integrations ────────────────────────────────────────────── */}
        <header className="svc-header integrations-header">
          <h2 className="svc-h2">
            Підключаємо всі<br />
            <em>профільні</em> системи
          </h2>
          <p className="svc-sub">
            Заявка з сайту потрапляє одразу у вашу <em>CRM</em>. Адміністратор бачить
            запис у момент кліку. Лікар отримує сповіщення в Telegram. Пацієнт —
            SMS-підтвердження. Жодних втрачених лідів через листи у спамі або
            дзвінки в неробочий час.
          </p>
        </header>

        <div className="integrations-grid">
          {integrations.map((name, i) => (
            <div className="integration" key={i}>
              <span>{name}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Services />);
