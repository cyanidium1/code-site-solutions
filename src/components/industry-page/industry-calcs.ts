import type { LandingPageContent } from "@/types/landing";
import type { Locale } from "@/constants/locales";

/**
 * Per-industry mini-calculator configs, reusing the MiniCalc component from
 * the site-type pages. Prices follow the canonical tier ladder: corporate
 * industries start at $2,500 on uk/ru and £3,500 on en (auto $3,000, real
 * estate $4,000 per their homepage cards), e-commerce at $6,000, courses at the $800 landing base.
 * EN mirrors numerals in £ (site-wide 1:1 convention).
 */

type MiniCalcContent = NonNullable<LandingPageContent["miniCalc"]>;
type L3 = { uk: string; ru: string; en: string };

/** EN mirrors numerals in £ (site-wide 1:1 convention); uk/ru price in $. */
const CURRENCY_BY_LOCALE: Record<Locale, string> = {
  uk: "$",
  ru: "$",
  en: "£",
};

type IndustryCalcDef = {
  tier: string;
  base: number;
  /**
   * Per-market base, for locales where it diverges from `base`. Mirrors
   * TIER_AMOUNT_OVERRIDES in constants/pricing-tiers: the corporate tier is
   * $2,500 on uk/ru and £3,500 on en. Omit when every market shares a number.
   */
  baseByLocale?: Partial<Record<Locale, number>>;
  baseLabel: L3;
  baseNote: L3;
  blocks: { label: L3; note: L3; unitPrice: number; max: number };
  options: { id: string; label: L3; price: number }[];
  heading: L3;
  sub: L3;
};

const COMMON = {
  title: {
    uk: "Зберіть свій сайт — ціна рахується одразу",
    ru: "Соберите свой сайт — цена считается сразу",
    en: "Build your website — the price updates live",
  },
  totalLabel: {
    uk: "Орієнтовна ціна",
    ru: "Ориентировочная цена",
    en: "Estimated price",
  },
  totalNote: {
    uk: "Це оцінка, не рахунок. Фінальна цифра фіксується в договорі.",
    ru: "Это оценка, не счёт. Финальная цифра фиксируется в договоре.",
    en: "An estimate, not an invoice. The final figure is fixed in the contract.",
  },
  form: {
    heading: {
      uk: "Отримати точну ціну — ваш вибір прикріпимо до заявки",
      ru: "Получить точную цену — ваш выбор прикрепим к заявке",
      en: "Get an exact quote — your selection ships with the enquiry",
    },
    namePlaceholder: { uk: "Імʼя", ru: "Имя", en: "Name" },
    contactPlaceholder: {
      uk: "Email / Telegram / WhatsApp",
      ru: "Email / Telegram / WhatsApp",
      en: "Email / Telegram / WhatsApp",
    },
    submitLabel: {
      uk: "Надіслати конфігурацію",
      ru: "Отправить конфигурацию",
      en: "Send my configuration",
    },
    success: {
      uk: "Дякуємо! Відповімо протягом 4 робочих годин — з підтвердженою ціною під ваш вибір.",
      ru: "Спасибо! Ответим в течение 4 рабочих часов — с подтверждённой ценой под ваш выбор.",
      en: "Thank you! We'll reply within 4 working hours with a confirmed price for your selection.",
    },
    error: {
      uk: "Не надіслалось. Спробуйте ще раз або напишіть на hi@code-site.art.",
      ru: "Не отправилось. Попробуйте ещё раз или напишите на hi@code-site.art.",
      en: "Something went wrong. Try again or email hi@code-site.art.",
    },
    summaryTitle: {
      uk: "Конфігурація з міні-калькулятора:",
      ru: "Конфигурация из мини-калькулятора:",
      en: "Configuration from the mini-calculator:",
    },
  },
  pagesBlock: {
    label: {
      uk: "Додаткові унікальні сторінки",
      ru: "Дополнительные уникальные страницы",
      en: "Extra unique pages",
    },
    note: {
      uk: "+$220 за унікальний макет; службові сторінки — включені",
      ru: "+$220 за уникальный макет; служебные страницы — включены",
      en: "+£220 per unique layout; utility pages are included",
    },
  },
  headingDefault: {
    uk: "Порахуйте свій сайт — під вашу специфіку",
    ru: "Посчитайте свой сайт — под вашу специфику",
    en: "Price your website — for your specifics",
  },
} as const;

const pagesBlock = (unit = 220, max = 5) => ({
  label: COMMON.pagesBlock.label,
  note: COMMON.pagesBlock.note,
  unitPrice: unit,
  max,
});

const CALCS: Record<string, IndustryCalcDef> = {
  medicine: {
    tier: "corporate",
    base: 2500,
    baseByLocale: { en: 3500 },
    baseLabel: {
      uk: "Базовий сайт клініки",
      ru: "Базовый сайт клиники",
      en: "Core clinic website",
    },
    baseNote: {
      uk: "до 8 сторінок: онлайн-запис, каталог лікарів, прайс, адмінка, рік гарантії",
      ru: "до 8 страниц: онлайн-запись, каталог врачей, прайс, админка, год гарантии",
      en: "up to 8 pages: online booking, practitioner directory, price list, CMS, 1-year warranty",
    },
    blocks: pagesBlock(),
    options: [
      { id: "dms", label: { uk: "ДМС-інтеграція (страхові)", ru: "ДМС-интеграция (страховые)", en: "Insurance integration" }, price: 300 },
      { id: "medcrm", label: { uk: "Медична CRM (Helsi, Medesk, Dental4W)", ru: "Медицинская CRM (Helsi, Medesk, Dental4W)", en: "Clinic CRM / practice system" }, price: 300 },
      { id: "blog", label: { uk: "Блог і SEO-сторінки", ru: "Блог и SEO-страницы", en: "Blog & SEO pages" }, price: 400 },
      { id: "branch", label: { uk: "Друга локація / філія", ru: "Вторая локация / филиал", en: "Second location" }, price: 500 },
      { id: "lang3", label: { uk: "Третя мова", ru: "Третий язык", en: "Third language" }, price: 250 },
      { id: "payments", label: { uk: "Онлайн-оплата послуг", ru: "Онлайн-оплата услуг", en: "Online payments" }, price: 250 },
    ],
    heading: {
      uk: "Порахуйте сайт своєї клініки",
      ru: "Посчитайте сайт своей клиники",
      en: "Price your clinic's website",
    },
    sub: {
      uk: "База $2 500 — повноцінний сайт із записом. Опції — коли ваша клініка цього потребує.",
      ru: "База $2 500 — полноценный сайт с записью. Опции — когда ваша клиника этого требует.",
      en: "The £3,500 base is a complete site with booking. Options — when your clinic needs them.",
    },
  },
  renovation: {
    tier: "corporate",
    base: 2500,
    baseByLocale: { en: 3500 },
    baseLabel: {
      uk: "Базовий сайт будівельної компанії",
      ru: "Базовый сайт строительной компании",
      en: "Core construction company website",
    },
    baseNote: {
      uk: "5 сторінок: послуги, портфоліо, форма заявки, адмінка, локальне SEO",
      ru: "5 страниц: услуги, портфолио, форма заявки, админка, локальное SEO",
      en: "5 pages: services, portfolio, lead form, CMS, local SEO",
    },
    blocks: pagesBlock(),
    options: [
      { id: "estimator", label: { uk: "Калькулятор кошторису для клієнтів", ru: "Калькулятор сметы для клиентов", en: "Client-facing estimate calculator" }, price: 400 },
      { id: "cases", label: { uk: "Портфоліо-система «до/після»", ru: "Портфолио-система «до/после»", en: "Before/after portfolio system" }, price: 350 },
      { id: "crm", label: { uk: "CRM-інтеграція", ru: "CRM-интеграция", en: "CRM integration" }, price: 300 },
      { id: "lang", label: { uk: "Друга мова (робота за кордоном)", ru: "Второй язык (работа за рубежом)", en: "Second language (cross-border work)" }, price: 250 },
      { id: "gallery", label: { uk: "Галерея обʼєктів із фільтрами", ru: "Галерея объектов с фильтрами", en: "Filterable project gallery" }, price: 300 },
      { id: "payments", label: { uk: "Онлайн-оплата авансів", ru: "Онлайн-оплата авансов", en: "Online deposit payments" }, price: 250 },
    ],
    heading: {
      uk: "Порахуйте сайт своєї компанії",
      ru: "Посчитайте сайт своей компании",
      en: "Price your company's website",
    },
    sub: {
      uk: "База $2 500 окупається з одного закритого обʼєкта. Опції — під ваш формат робіт.",
      ru: "База $2 500 окупается с одного закрытого объекта. Опции — под ваш формат работ.",
      en: "The £3,500 base pays back with one closed project. Options — for how you work.",
    },
  },
  legal: {
    tier: "corporate",
    base: 2500,
    baseByLocale: { en: 3500 },
    baseLabel: {
      uk: "Базовий сайт юридичної фірми",
      ru: "Базовый сайт юридической фирмы",
      en: "Core law firm website",
    },
    baseNote: {
      uk: "5 сторінок: практики, команда, кейси, конфіденційна форма, адмінка",
      ru: "5 страниц: практики, команда, кейсы, конфиденциальная форма, админка",
      en: "5 pages: practice areas, team, cases, confidential enquiry form, CMS",
    },
    blocks: pagesBlock(),
    options: [
      { id: "booking", label: { uk: "Запис на консультацію", ru: "Запись на консультацию", en: "Consultation booking" }, price: 300 },
      { id: "payments", label: { uk: "Онлайн-оплата консультацій", ru: "Онлайн-оплата консультаций", en: "Online consultation payments" }, price: 250 },
      { id: "esign", label: { uk: "Інтеграція e-sign / Clio", ru: "Интеграция e-sign / Clio", en: "E-sign / Clio integration" }, price: 300 },
      { id: "blog", label: { uk: "Блог і правові публікації", ru: "Блог и правовые публикации", en: "Blog & legal publications" }, price: 400 },
      { id: "lang", label: { uk: "Друга мова", ru: "Второй язык", en: "Second language" }, price: 250 },
      { id: "crm", label: { uk: "CRM-інтеграція", ru: "CRM-интеграция", en: "CRM integration" }, price: 300 },
    ],
    heading: {
      uk: "Порахуйте сайт своєї фірми",
      ru: "Посчитайте сайт своей фирмы",
      en: "Price your firm's website",
    },
    sub: {
      uk: "База $2 500 — сайт, що будує довіру. Опції — під вашу практику.",
      ru: "База $2 500 — сайт, который строит доверие. Опции — под вашу практику.",
      en: "The £3,500 base builds trust. Options — for your practice.",
    },
  },
  finance: {
    tier: "corporate",
    base: 2500,
    baseByLocale: { en: 3500 },
    baseLabel: {
      uk: "Базовий сайт фінансової компанії",
      ru: "Базовый сайт финансовой компании",
      en: "Core accounting / finance website",
    },
    baseNote: {
      uk: "5 сторінок: послуги, команда, кейси, форма заявки, адмінка",
      ru: "5 страниц: услуги, команда, кейсы, форма заявки, админка",
      en: "5 pages: services, team, cases, lead form, CMS",
    },
    blocks: pagesBlock(),
    options: [
      { id: "xero", label: { uk: "Інтеграція Xero / QuickBooks", ru: "Интеграция Xero / QuickBooks", en: "Xero / QuickBooks integration" }, price: 300 },
      { id: "calc", label: { uk: "Калькулятори (податки, кредити)", ru: "Калькуляторы (налоги, кредиты)", en: "Tax / loan calculators" }, price: 400 },
      { id: "booking", label: { uk: "Запис на консультацію", ru: "Запись на консультацию", en: "Consultation booking" }, price: 300 },
      { id: "blog", label: { uk: "Блог і SEO-сторінки", ru: "Блог и SEO-страницы", en: "Blog & SEO pages" }, price: 400 },
      { id: "lang", label: { uk: "Друга мова", ru: "Второй язык", en: "Second language" }, price: 250 },
      { id: "payments", label: { uk: "Онлайн-оплата послуг", ru: "Онлайн-оплата услуг", en: "Online payments" }, price: 250 },
    ],
    heading: {
      uk: "Порахуйте свій сайт",
      ru: "Посчитайте свой сайт",
      en: "Price your website",
    },
    sub: {
      uk: "База $2 500 — сайт, якому довіряють гроші. Опції — під ваші послуги.",
      ru: "База $2 500 — сайт, которому доверяют деньги. Опции — под ваши услуги.",
      en: "The £3,500 base earns financial trust. Options — for your services.",
    },
  },
  ecommerce: {
    tier: "custom",
    base: 6000,
    baseLabel: {
      uk: "Базовий інтернет-магазин",
      ru: "Базовый интернет-магазин",
      en: "Base online store",
    },
    baseNote: {
      uk: "каталог до ~50 товарів, кошик, чекаут, адмінка, SEO, рік гарантії",
      ru: "каталог до ~50 товаров, корзина, чекаут, админка, SEO, год гарантии",
      en: "catalogue up to ~50 products, cart, checkout, CMS, SEO, 1-year warranty",
    },
    blocks: pagesBlock(),
    options: [
      { id: "payments", label: { uk: "Онлайн-оплата (Stripe / LiqPay)", ru: "Онлайн-оплата (Stripe / LiqPay)", en: "Online payments (Stripe / GoCardless)" }, price: 300 },
      { id: "catalog500", label: { uk: "Каталог 50–500 товарів", ru: "Каталог 50–500 товаров", en: "Catalogue of 50–500 products" }, price: 500 },
      { id: "filters", label: { uk: "Розширені фільтри й пошук", ru: "Расширенные фильтры и поиск", en: "Advanced filters & search" }, price: 400 },
      { id: "crm", label: { uk: "CRM і сповіщення про замовлення", ru: "CRM и уведомления о заказах", en: "CRM & order notifications" }, price: 100 },
      { id: "lang", label: { uk: "Друга мова", ru: "Второй язык", en: "Second language" }, price: 250 },
      { id: "premium", label: { uk: "Преміум-дизайн", ru: "Премиум-дизайн", en: "Premium design" }, price: 400 },
    ],
    heading: {
      uk: "Порахуйте свій магазин",
      ru: "Посчитайте свой магазин",
      en: "Price your store",
    },
    sub: {
      uk: "База $6 000 — робочий магазин із чекаутом. Опції — коли продажі ростуть.",
      ru: "База $6 000 — рабочий магазин с чекаутом. Опции — когда продажи растут.",
      en: "The £6,000 base is a working store with checkout. Options — as sales grow.",
    },
  },
  auto: {
    tier: "corporate",
    base: 3000,
    baseLabel: {
      uk: "Базовий сайт авто-бізнесу",
      ru: "Базовый сайт авто-бизнеса",
      en: "Core motor-trade website",
    },
    baseNote: {
      uk: "5 сторінок: послуги, форма заявки, адмінка, локальне SEO",
      ru: "5 страниц: услуги, форма заявки, админка, локальное SEO",
      en: "5 pages: services, lead form, CMS, local SEO",
    },
    blocks: pagesBlock(),
    options: [
      { id: "catalog", label: { uk: "Каталог авто з фільтрами", ru: "Каталог авто с фильтрами", en: "Filterable vehicle catalogue" }, price: 500 },
      { id: "auctions", label: { uk: "Інтеграція аукціонів (Copart)", ru: "Интеграция аукционов (Copart)", en: "Auction integration (BCA/Copart)" }, price: 400 },
      { id: "customs", label: { uk: "Калькулятор розмитнення", ru: "Калькулятор растаможки", en: "Import cost calculator" }, price: 400 },
      { id: "crm", label: { uk: "CRM-інтеграція", ru: "CRM-интеграция", en: "CRM integration" }, price: 300 },
      { id: "lang", label: { uk: "Друга мова", ru: "Второй язык", en: "Second language" }, price: 250 },
      { id: "payments", label: { uk: "Онлайн-оплата депозитів", ru: "Онлайн-оплата депозитов", en: "Online deposit payments" }, price: 250 },
    ],
    heading: {
      uk: "Порахуйте свій сайт",
      ru: "Посчитайте свой сайт",
      en: "Price your website",
    },
    sub: {
      uk: "База $3 000 — сайт, що приводить заявки. Опції — під ваш формат: імпорт, СТО, продаж.",
      ru: "База $3 000 — сайт, который приводит заявки. Опции — под ваш формат: импорт, СТО, продажа.",
      en: "The £3,000 base brings enquiries. Options — for your model: import, garage, sales.",
    },
  },
  "real-estate": {
    tier: "corporate",
    base: 4000,
    baseLabel: {
      uk: "Базовий сайт нерухомості",
      ru: "Базовый сайт недвижимости",
      en: "Core property website",
    },
    baseNote: {
      uk: "5 сторінок: обʼєкти, послуги, команда, форма заявки, адмінка",
      ru: "5 страниц: объекты, услуги, команда, форма заявки, админка",
      en: "5 pages: listings, services, team, lead form, CMS",
    },
    blocks: pagesBlock(),
    options: [
      { id: "listings", label: { uk: "Каталог обʼєктів із фільтрами", ru: "Каталог объектов с фильтрами", en: "Filterable listings catalogue" }, price: 500 },
      { id: "map", label: { uk: "Інтерактивна карта обʼєктів", ru: "Интерактивная карта объектов", en: "Interactive listings map" }, price: 300 },
      { id: "mortgage", label: { uk: "Іпотечний калькулятор", ru: "Ипотечный калькулятор", en: "Mortgage calculator" }, price: 400 },
      { id: "crm", label: { uk: "CRM-інтеграція", ru: "CRM-интеграция", en: "CRM integration" }, price: 300 },
      { id: "lang", label: { uk: "Друга мова", ru: "Второй язык", en: "Second language" }, price: 250 },
      { id: "currency", label: { uk: "Багатовалютність", ru: "Мультивалютность", en: "Multi-currency" }, price: 200 },
    ],
    heading: {
      uk: "Порахуйте свій сайт",
      ru: "Посчитайте свой сайт",
      en: "Price your website",
    },
    sub: {
      uk: "База $4 000 — сайт з обʼєктами і заявками. Опції — під вашу модель продажів.",
      ru: "База $4 000 — сайт с объектами и заявками. Опции — под вашу модель продаж.",
      en: "The £4,000 base ships listings and leads. Options — for your sales model.",
    },
  },
  courses: {
    tier: "landing",
    base: 800,
    baseLabel: {
      uk: "Базовий лендінг курсу",
      ru: "Базовый лендинг курса",
      en: "Base course landing page",
    },
    baseNote: {
      uk: "до 7 екранів: програма, тарифи, відгуки, форма — запуск за 1–2 тижні",
      ru: "до 7 экранов: программа, тарифы, отзывы, форма — запуск за 1–2 недели",
      en: "up to 7 sections: programme, tiers, reviews, form — live in 1–2 weeks",
    },
    blocks: {
      label: { uk: "Додаткові екрани", ru: "Дополнительные экраны", en: "Extra sections" },
      note: { uk: "+$100 за екран понад 7", ru: "+$100 за экран сверх 7", en: "+£100 per section beyond 7" },
      unitPrice: 100,
      max: 5,
    },
    options: [
      { id: "payments", label: { uk: "Оплата курсу онлайн", ru: "Оплата курса онлайн", en: "Online course payments" }, price: 150 },
      { id: "tiers", label: { uk: "Тарифи і пакети", ru: "Тарифы и пакеты", en: "Pricing tiers" }, price: 100 },
      { id: "video", label: { uk: "Вбудований відеоплеєр уроків", ru: "Встроенный видеоплеер уроков", en: "Embedded lesson video player" }, price: 300 },
      { id: "telegram", label: { uk: "Заявки в Telegram", ru: "Заявки в Telegram", en: "Leads to Telegram" }, price: 50 },
      { id: "lang", label: { uk: "Друга мова", ru: "Второй язык", en: "Second language" }, price: 100 },
      { id: "brand", label: { uk: "Брендовий дизайн з анімаціями", ru: "Брендовый дизайн с анимациями", en: "Branded design with animation" }, price: 120 },
    ],
    heading: {
      uk: "Порахуйте лендінг свого курсу",
      ru: "Посчитайте лендинг своего курса",
      en: "Price your course landing page",
    },
    sub: {
      uk: "База $800 — сторінка, що продає курс. Опції — коли запуск набирає обертів.",
      ru: "База $800 — страница, которая продаёт курс. Опции — когда запуск набирает обороты.",
      en: "The £800 base sells the course. Options — as the launch picks up speed.",
    },
  },
};

/** Section heading/sub for the calculator block, per industry+locale. */
export function industryCalcHeading(
  slug: string,
  locale: Locale,
): { heading: string; sub: string } | null {
  const def = CALCS[slug];
  if (!def) return null;
  return { heading: def.heading[locale], sub: def.sub[locale] };
}

/** MiniCalc content for an industry page, or null when not configured. */
export function industryCalcContent(
  slug: string,
  locale: Locale,
): MiniCalcContent | null {
  const def = CALCS[slug];
  if (!def) return null;
  const cur = CURRENCY_BY_LOCALE[locale];
  const fixNote = (s: string) => (cur === "$" ? s : s.replace(/\$/g, cur));
  return {
    tier: def.tier,
    title: COMMON.title[locale],
    baseLabel: def.baseLabel[locale],
    baseNote: def.baseNote[locale],
    basePrice: def.baseByLocale?.[locale] ?? def.base,
    currency: cur,
    blocks: {
      label: def.blocks.label[locale],
      note: fixNote(def.blocks.note[locale]),
      unitPrice: def.blocks.unitPrice,
      max: def.blocks.max,
    },
    options: def.options.map((o) => ({
      id: o.id,
      label: o.label[locale],
      price: o.price,
    })),
    totalLabel: COMMON.totalLabel[locale],
    totalNote: COMMON.totalNote[locale],
    form: {
      heading: COMMON.form.heading[locale],
      namePlaceholder: COMMON.form.namePlaceholder[locale],
      contactPlaceholder: COMMON.form.contactPlaceholder[locale],
      submitLabel: COMMON.form.submitLabel[locale],
      success: COMMON.form.success[locale],
      error: COMMON.form.error[locale],
      summaryTitle: COMMON.form.summaryTitle[locale],
    },
  };
}
