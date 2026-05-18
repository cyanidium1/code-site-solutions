import "./services.css";

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

/** Default medicine-feature icons in the order used by `DEFAULT_FEATURES`.
 *  Re-exported so the CMS-driven `[slug]` page can reuse them by index — the
 *  industryPage schema doesn't carry an icon field. */
export const MEDICINE_FEATURE_ICONS: React.ReactNode[] = [
  <IcCalendar key="cal" />,
  <IcDoctors key="doc" />,
  <IcPrice key="price" />,
  <IcServices key="svc" />,
  <IcShield key="shield" />,
  <IcPin key="pin" />,
];

export type Feature = {
  icon: React.ReactNode;
  bg: string;
  title: string;
  items: React.ReactNode[];
};

export function FeatureCard({ icon, title, items, bg }: Feature) {
  return (
    <div className="feature-card relative pt-7 px-[26px] pb-[30px] border border-line rounded-[18px] bg-[oklch(0.16_0.005_300)] transition-[border-color,transform] duration-[250ms] flex flex-col gap-[18px] overflow-hidden isolate hover:border-[var(--line-2)] hover:-translate-y-0.5 max-[700px]:pt-[22px] max-[700px]:px-5 max-[700px]:pb-6 max-[700px]:gap-3.5">
      <div
        className="absolute inset-0 -z-[2] bg-cover bg-center [filter:saturate(0.7)]"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center text-[oklch(1_0_0_/_0.95)] shadow-[0_8px_20px_oklch(from_var(--accent)_l_c_h_/_0.3)] max-[700px]:w-[38px] max-[700px]:h-[38px] max-[700px]:rounded-[10px]">
        {icon}
      </div>
      <h3 className="font-display font-bold text-[15px] tracking-[0.05em] uppercase leading-[1.2] text-ink text-balance max-[700px]:text-[13px]">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5 [&>li]:flex [&>li]:items-start [&>li]:gap-2.5 [&>li]:text-[13px] [&>li]:leading-[1.5] [&>li]:text-[var(--ink-2)] [&>li_em]:not-italic [&>li_em]:text-ink [&>li_em]:font-medium max-[700px]:[&>li]:text-[12px]">
        {items.map((it, i) => (
          <li key={i}>
            <span className="w-4 h-4 rounded-full bg-[oklch(from_var(--accent)_l_c_h_/_0.18)] text-accent-soft border border-[oklch(from_var(--accent)_l_c_h_/_0.25)] mt-0.5 inline-flex items-center justify-center shrink-0">
              <CheckIcon />
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: <IcCalendar />,
    bg: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80",
    title: "Онлайн-запис 24/7",
    items: [
      <>Запис у <em>2 кліки</em>. SMS-підтвердження пацієнту, Telegram-сповіщення лікарю</>,
      <>Інтеграція з <em>Dental4Windows</em>, Medesk, MedAI, Helsi, KeyCRM</>,
      "Автоматичні нагадування за день до прийому",
    ],
  },
  {
    icon: <IcDoctors />,
    bg: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
    title: "Каталог лікарів",
    items: [
      "Фото, регалії, освіта, спеціалізація, реальні відгуки пацієнтів",
      "Розклад кожного лікаря в реальному часі",
      "Запис безпосередньо до обраного спеціаліста",
    ],
  },
  {
    icon: <IcPrice />,
    bg: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    title: "Прозорий прайс",
    items: [
      <>Структурований прайс-лист, маркетолог оновлює ціни <em>за 2 хвилини</em></>,
      "Юридично коректне оформлення (стоп-таблиця для пацієнтів)",
      "Можливість приховати окремі позиції від індексації",
    ],
  },
  {
    icon: <IcServices />,
    bg: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80",
    title: "Каталог послуг",
    items: [
      <>Детальний опис процедур з фото <em>«до/після»</em> (з дозволу пацієнтів)</>,
      "Повʼязані послуги і пакетні пропозиції",
      "Відеоматеріали від лікарів",
    ],
  },
  {
    icon: <IcShield />,
    bg: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    title: "Інтеграція зі страховими",
    items: [
      <>Список <em>ДМС-програм</em> з онлайн-розрахунком покриття</>,
      <>Інтеграція з <em>Helsi</em> для держстраховок (НСЗУ)</>,
      "Запис із зазначенням страховки",
    ],
  },
  {
    icon: <IcPin />,
    bg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    title: "Локальне SEO та аналітика",
    items: [
      <><em>Schema.org</em> розмітка MedicalOrganization, оптимізація під «стоматолог + район»</>,
      "Налаштування Google Business Profile, карта проїзду з парковкою",
      "Аналітика трафіку і воронки від перегляду до запису",
    ],
  },
];

const DEFAULT_INTEGRATIONS = [
  "Dental4Windows", "Medesk", "MedAI", "Helsi",
  "KeyCRM", "AmoCRM", "Bitrix24", "Telegram",
];

const SVC_H2_CLASSES =
  "font-display font-bold text-[clamp(34px,4.6vw,60px)] leading-none tracking-[-0.035em] text-ink text-balance max-w-[16ch] uppercase max-[1100px]:max-w-full max-[700px]:text-[clamp(26px,9vw,38px)] [&_em]:italic [&_em]:font-light [&_em]:normal-case [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent [&_em]:inline-block [&_em]:pr-[0.12em] [&_em]:[margin-right:-0.04em]";

const SVC_HEADER_CLASSES =
  "grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-14 items-end pb-7 border-b border-line max-[1100px]:grid-cols-1 max-[1100px]:items-start max-[1100px]:gap-[22px] max-[1100px]:pb-[22px]";

const SVC_SUB_BASE =
  "text-[15px] leading-[1.65] text-[var(--ink-2)] text-pretty max-[700px]:text-[13px] [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium";

export function Services({
  testimonialEyebrow = "ВІДГУК КЛІЄНТА",
  testimonialQuote = (
    <>
      Після запуску сайту ми почали отримувати в <em>3–4 рази</em> більше
      заявок. Особливо виріс потік з Google. І найголовніше — ми тепер
      <em> самі</em> можемо змінювати все на сайті без розробників.
    </>
  ),
  testimonialAuthorInitials = "АП",
  testimonialAuthorName = "Анна П.",
  testimonialAuthorRole = "Засновниця клініки в Одесі",
  servicesHeading = (
    <>
      Що ми робимо для
      <br />
      <em>медичних</em> клінік
    </>
  ),
  servicesSub = (
    <>
      Не «<em>ще один шаблонний медичний сайт</em>». Кожен проєкт — під
      конкретну клініку, її спеціалізацію і регуляторні вимоги.
    </>
  ),
  features = DEFAULT_FEATURES,
  integrationsHeading = (
    <>
      Підключаємо всі
      <br />
      <em>профільні</em> системи
    </>
  ),
  integrationsSub = (
    <>
      Заявка з сайту потрапляє одразу у вашу <em>CRM</em>. Адміністратор бачить
      запис у момент кліку. Лікар отримує сповіщення в Telegram. Пацієнт —
      SMS-підтвердження. Жодних втрачених лідів через листи у спамі або
      дзвінки в неробочий час.
    </>
  ),
  integrations = DEFAULT_INTEGRATIONS,
}: Partial<{
  testimonialEyebrow: string;
  testimonialQuote: React.ReactNode;
  testimonialAuthorInitials: string;
  testimonialAuthorName: string;
  testimonialAuthorRole: string;
  servicesHeading: React.ReactNode;
  servicesSub: React.ReactNode;
  features: Feature[];
  integrationsHeading: React.ReactNode;
  integrationsSub: React.ReactNode;
  integrations: string[];
}> = {}) {
  return (
    <section className="relative py-[var(--section-y)] px-12 bg-bg overflow-hidden max-[1100px]:px-8 max-[700px]:px-[18px]">
      <div className="services-bg absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-[2] max-w-container mx-auto">
        <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-[72px] items-center pb-[100px] mb-[100px] border-b border-line max-[1100px]:grid-cols-1 max-[1100px]:gap-9 max-[1100px]:pb-[72px] max-[1100px]:mb-[72px] max-[700px]:pb-12 max-[700px]:mb-12 max-[700px]:gap-[26px]">
          <div className="testimonial-visual relative aspect-[5/4] rounded-[22px] border border-[var(--line-2)] bg-[linear-gradient(135deg,oklch(0.18_0.005_300),oklch(0.13_0.006_300))] overflow-hidden shadow-[0_40px_80px_oklch(0_0_0_/_0.5)] max-[1100px]:aspect-[16/10] max-[1100px]:max-w-[600px] max-[700px]:rounded-[14px]" />
          <div className="flex flex-col">
            <div className="inline-flex self-start items-center gap-2.5 pl-3 pr-3.5 py-[7px] border border-[var(--line-2)] rounded-full text-[11px] font-medium tracking-[0.12em] text-[var(--ink-2)] bg-[oklch(1_0_0_/_0.025)] mb-7 max-[700px]:text-[9px] max-[700px]:pl-2.5 max-[700px]:pr-[11px] max-[700px]:py-1.5 max-[700px]:mb-[22px]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
              <span>{testimonialEyebrow}</span>
            </div>
            <div className="font-display font-bold text-[56px] leading-none text-accent-soft mb-[18px] max-[700px]:text-[44px]">
              &quot;
            </div>
            <p className="font-display font-normal text-[clamp(20px,2vw,26px)] leading-[1.45] tracking-[-0.015em] text-ink mb-9 text-pretty [&_em]:italic [&_em]:font-medium [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent max-[700px]:text-[17px] max-[700px]:leading-[1.45] max-[700px]:mb-[26px]">
              {testimonialQuote}
            </p>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[linear-gradient(135deg,var(--accent-soft),var(--accent))] text-[oklch(1_0_0_/_0.95)] font-display text-[14px] font-bold tracking-[0.02em] flex items-center justify-center shadow-[0_6px_18px_oklch(from_var(--accent)_l_c_h_/_0.4)] max-[700px]:w-[38px] max-[700px]:h-[38px] max-[700px]:text-[12px]">
                {testimonialAuthorInitials}
              </div>
              <div>
                <div className="font-display font-bold text-[12px] tracking-[0.12em] uppercase text-ink max-[700px]:text-[11px]">
                  {testimonialAuthorName}
                </div>
                <div className="text-[12px] text-[var(--ink-3)] mt-[3px] max-[700px]:text-[11px]">
                  {testimonialAuthorRole}
                </div>
              </div>
            </div>
          </div>
        </div>

        <header className={`mb-14 max-[1100px]:mb-10 ${SVC_HEADER_CLASSES}`}>
          <h2 className={SVC_H2_CLASSES}>{servicesHeading}</h2>
          <p className={`pb-2 ${SVC_SUB_BASE}`}>{servicesSub}</p>
        </header>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 mb-[120px] max-[1100px]:gap-4 max-[1100px]:mb-20 max-[700px]:gap-3 max-[700px]:mb-14">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>

        <header className={`mb-12 ${SVC_HEADER_CLASSES}`}>
          <h2 className={SVC_H2_CLASSES}>{integrationsHeading}</h2>
          <p className={`max-w-[78ch] pb-0 ${SVC_SUB_BASE}`}>{integrationsSub}</p>
        </header>

        <div className="grid grid-cols-4 gap-3.5 max-[1100px]:gap-2.5 max-[700px]:grid-cols-2 max-[700px]:gap-2">
          {integrations.map((name, i) => (
            <div
              key={i}
              className="integration relative h-[52px] border border-line rounded-[10px] bg-[oklch(1_0_0_/_0.02)] flex items-center justify-center font-display font-semibold text-[11px] tracking-[0.1em] uppercase text-[var(--ink-2)] transition-all duration-[250ms] overflow-hidden hover:border-[oklch(from_var(--accent)_l_c_h_/_0.4)] hover:text-accent-soft hover:-translate-y-px max-[700px]:h-11 max-[700px]:text-[10px] max-[700px]:tracking-[0.06em] [&>span]:relative [&>span]:z-[2]"
            >
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
