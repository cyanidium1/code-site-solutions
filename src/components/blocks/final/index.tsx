"use client";

import "./final.css";

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type SocialKind = "li" | "ig" | "tg" | "tt";

export function SocialIcon({ kind }: { kind: SocialKind }) {
  const paths: Record<SocialKind, React.ReactElement> = {
    li: (
      <path
        d="M4 4h4v4H4zM4 10h4v10H4zM10 10h4v2c.6-1.2 2-2 4-2 3 0 4 2 4 5v5h-4v-4c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5V20h-4z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    ig: (
      <>
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
        <circle cx="17" cy="7" r="0.8" fill="currentColor" />
      </>
    ),
    tg: (
      <path
        d="M21 4L3 11l5 2 2 6 3-3 5 4 3-16z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    tt: (
      <path
        d="M14 4v10.5a2.5 2.5 0 11-2.5-2.5M14 4c.5 2 2 3.5 4.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      {paths[kind]}
    </svg>
  );
}

export type FAQItem = { q: string; a: string };

const DEFAULT_FAQ: FAQItem[] = [
  {
    q: "Скільки часу займає запуск сайту клініки?",
    a: "Базовий сайт — <em>4 тижні</em>, розширений — 6 тижнів, преміум для мережі — 8–10 тижнів. Дедлайни фіксуємо у договорі. Кожен тиждень — звіт зі скріншотами та проміжним результатом.",
  },
  {
    q: "Що робити зі старим сайтом?",
    a: "Старий сайт працює до запуску нового — без втрати трафіку. Налаштовуємо <em>301-редиректи</em> зі старих URL на нові, переносимо мета-теги і Schema-розмітку, передаємо домен. Просідання в Google зазвичай немає.",
  },
  {
    q: "Хто наповнюватиме сайт контентом?",
    a: "Можемо повністю — у нас є копірайтер з медичним досвідом і фотограф (за окрему вартість). Або ви даєте тексти і фото, ми верстаємо. Або гібридно — ви даєте опис послуг, ми переписуємо під <em>SEO</em> і вимоги МОЗ.",
  },
  {
    q: "Які інтеграції з медичними CRM можливі?",
    a: "Працювали з <em>Dental4Windows</em>, Medesk, MedAI, Helsi (НСЗУ), KeyCRM, AmoCRM, Bitrix24. Якщо у вас інша CRM — підключаємо через API або Webhook. Запис із сайту падає у CRM миттєво, лікар отримує сповіщення в Telegram.",
  },
  {
    q: "Як захищені дані пацієнтів?",
    a: "Відповідність <em>GDPR</em> і вимогам МОЗ України: шифрування даних на льоту (HTTPS) і у спокої, IP-обмеження для адмінки, журнал доступів, регулярні бекапи. Сервери — у ЄС. Договір з вами включає DPA.",
  },
  {
    q: "Чи можна розмістити відгуки пацієнтів?",
    a: "Так, але <em>з письмовою згодою пацієнта</em> та без розкриття діагнозу. Підготуємо шаблон згоди разом з юристом. Альтернатива — інтеграція з Google Reviews або Doc.ua, де відгуки модерує платформа.",
  },
  {
    q: "Чи можна за законом розміщувати ціни на медичні послуги?",
    a: "Так — і з 2024 це навіть обовʼязково для приватних клінік (постанова КМУ). Ми робимо прайс структурований, з позначкою «<em>орієнтовна вартість</em>» і застереженням, що остаточна ціна визначається після консультації. Юрист перевіряє формулювання.",
  },
  {
    q: "Чи можна запустити рекламу медичних послуг у Google і Facebook?",
    a: "Можна, але з обмеженнями: не можна обіцяти «гарантоване зцілення», використовувати фото «до/після» в обʼявах, рекламувати рецептурні препарати. Ми готуємо посадкові сторінки, які проходять модерацію Google Ads з першого разу. Налаштування реклами — окремо, але рекомендуємо перевірених підрядників.",
  },
];

export function FAQ({
  heading = "Часті питання",
  items = DEFAULT_FAQ,
}: { heading?: string; items?: FAQItem[] } = {}) {
  return (
    <section className="faq">
      <div className="faq-bg" />
      <div className="faq-inner">
        <h2 className="faq-h2">{heading}</h2>
        <div className="faq-list">
          {items.map((it, i) => (
            <details className="faq-item" key={i}>
              <summary>
                <span className="faq-q">{it.q}</span>
                <span className="faq-toggle"><PlusIcon /></span>
              </summary>
              <div
                className="faq-a"
                dangerouslySetInnerHTML={{ __html: it.a }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const DEFAULT_AUDIT_LIST: React.ReactNode[] = [
  <>
    Список з <em>7–12 помилок</em>, через які клініка втрачає пацієнтів
  </>,
  <>
    Технічний звіт зі швидкості та <em>SEO</em> (PageSpeed + Schema)
  </>,
  <>План покращень з пріоритетами</>,
  <>Орієнтовну вартість переробки або нового сайту</>,
  <>2–3 кейси клінік з нашого портфоліо</>,
];

export function Audit({
  heading = "Отримайте безкоштовний розбір сайту вашої клініки",
  sub = (
    <>
      Залиште посилання на ваш поточний сайт. Протягом <em>24 годин</em>{" "}
      надішлемо розбір.
    </>
  ),
  list = DEFAULT_AUDIT_LIST,
  foot = "Жодних зобов'язань. Корисно, навіть якщо вирішите працювати з іншим підрядником.",
  inputName = "Як до вас звертатися",
  inputContact = "Імейл або нік у Telegram",
  inputPhone = "+380 (__) ___-__-__",
  inputUrl = "https://...",
  submit = "Отримати розбір за 24 години",
  disclaim = "Не надсилаємо нічого, окрім розбору і одного листа з прикладами наших робіт. Без спаму.",
}: Partial<{
  heading: string;
  sub: React.ReactNode;
  list: React.ReactNode[];
  foot: string;
  inputName: string;
  inputContact: string;
  inputPhone: string;
  inputUrl: string;
  submit: string;
  disclaim: string;
}> = {}) {
  return (
    <section className="audit">
      <div className="audit-bg" />
      <div className="audit-inner">
        <div className="audit-text">
          <h2 className="audit-h">{heading}</h2>
          <p className="audit-sub">{sub}</p>
          <ul className="audit-list">
            {list.map((it, i) => (
              <li key={i}>
                <span className="audit-check"><CheckIcon /></span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
          <p className="audit-foot">{foot}</p>
        </div>
        <form className="audit-form-card" onSubmit={(e) => e.preventDefault()}>
          <input className="audit-input" type="text" placeholder={inputName} />
          <input className="audit-input" type="text" placeholder={inputContact} />
          <input className="audit-input" type="tel" placeholder={inputPhone} />
          <input className="audit-input" type="url" placeholder={inputUrl} />
          <button className="audit-submit" type="submit">{submit}</button>
          <div className="audit-disclaim">{disclaim}</div>
        </form>
      </div>
    </section>
  );
}

export type FootColumn = {
  h: string;
  items: React.ReactNode[];
};

const DEFAULT_FOOT_COLS: FootColumn[] = [
  {
    h: "+380-97-006-67-07",
    items: [
      <span className="nolink">Для дзвінка</span>,
      <span className="nolink">Hi@code-site.art</span>,
      <span className="nolink">Для письмового зв'язку</span>,
      <a href="#">@fedirdev</a>,
      <span className="nolink">Telegram — швидкий зв'язок</span>,
    ],
  },
  {
    h: "Меню",
    items: [
      <a href="#">Портфоліо</a>,
      <a href="#">Головна</a>,
      <a href="#">Послуги</a>,
      <a href="#">Блог</a>,
      <a href="#">Контакти</a>,
    ],
  },
  {
    h: "Юридичні дані",
    items: [
      <a href="#">Публічний договір</a>,
      <a href="#">Оферта</a>,
      <a href="#">Конфіденційність</a>,
    ],
  },
];

export function ClinicFooter({
  brandName = (
    <>
      <em>Code-Site</em>.Art
    </>
  ),
  brandDesc = "Code-site.art — кастомна розробка сайтів з 2025 року. Команда в Україні, проєкти в Україні, ЄС та США.",
  socials = ["li", "ig", "tg", "tt"] as SocialKind[],
  cols = DEFAULT_FOOT_COLS,
  bottomText = "© Code-site.art, 2026",
}: Partial<{
  brandName: React.ReactNode;
  brandDesc: string;
  socials: SocialKind[];
  cols: FootColumn[];
  bottomText: string;
}> = {}) {
  const labels: Record<SocialKind, string> = {
    li: "LinkedIn",
    ig: "Instagram",
    tg: "Telegram",
    tt: "TikTok",
  };
  return (
    <footer className="foot">
      <div className="foot-inner">
        <div>
          <div className="foot-brand-name">{brandName}</div>
          <p className="foot-brand-desc">{brandDesc}</p>
          <div className="foot-social">
            {socials.map((kind) => (
              <a key={kind} href="#" aria-label={labels[kind]}>
                <SocialIcon kind={kind} />
              </a>
            ))}
          </div>
        </div>
        {cols.map((col, i) => (
          <div key={i}>
            <div className="foot-col-h">{col.h}</div>
            <ul className="foot-col-list">
              {col.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="foot-bottom">{bottomText}</div>
    </footer>
  );
}

export function Final() {
  return (
    <div className="fin">
      <FAQ />
      <Audit />
      <ClinicFooter />
    </div>
  );
}
