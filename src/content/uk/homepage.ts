/**
 * Homepage copy (uk) — TZ v2 §3.1. Every price and term is read from
 * `@/constants/pricing`; never type a figure into this file by hand.
 * ru/en mirror the shape via `HomepageContent`.
 */

import type { FAQItem } from "@/types/faq";
import type { Locale } from "@/constants/locales";
import {
  PACKAGES,
  PAYMENT_TERMS,
  SERVICES,
  addonPrice,
  formatDays,
  formatPackagePrice,
  formatPackageTerm,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";

export type HomeProcessStep = { n: string; name: string; duration: string; items: string[] };

export type HomepageContent = {
  meta: { title: string; description: string };
  hero: {
    /** First H1 line, then the second line split around the accented part. */
    h1Line1: string;
    h1Line2Lead: string;
    h1Line2Em: string;
    lede: string;
    features: { label: string; sub: string }[];
    ctaPrimary: string;
    ctaSecondary: string;
    footnote: string;
    mockupAlt: string;
  };
  cases: { eyebrow: string; headingLead: string; headingEm: string; ctaLabel: string; ctaHref: string };
  pricing: { headingLead: string; headingEm: string; sub: string };
  industries: { headingLead: string; headingEm: string; sub: string };
  process: {
    headingLead: string;
    headingEm: string;
    sub: string;
    steps: HomeProcessStep[];
    shopLine: string;
    ctaLabel: string;
    ctaHref: string;
    moreLabel: string;
  };
  directions: { headingLead: string; headingEm: string; sub: string; links: { href: string; label: string }[] };
  faqHeading: string;
  faq: FAQItem[];
};

const L: Locale = "uk";
const fp = (n: number) => formatPrice(n, { locale: L });

const LANDING = formatPackagePrice("landing", L);
const BUSINESS = formatPackagePrice("business", L);
const SHOP = formatPackagePrice("shop", L);
const INDUSTRY = formatPackagePrice("industry", L);
const CUSTOM = formatPackagePrice("custom", L);
/** Business package term in days — "7" in the H1 and the process block. */
const D = PACKAGES.business.days.min;
/** Shop term in days — the second process line. */
const S = PACKAGES.shop.days.min;
const HOURS = SERVICES.auditResponseHours;
const HOSTING = fp(servicePrice("hostingRenewalPerYear", L));
const EXTRA_PAGE = fp(addonPrice("extra_page", L));
const NEW_PAGE_DAYS = formatDays(SERVICES.newPageDays, L);
const PT = PAYMENT_TERMS;

export const HOMEPAGE_UK: HomepageContent = {
  meta: {
    title: `Сайт для бізнесу кодом за ${D} днів і ${BUSINESS} | Code-Site.Art`,
    description: `Сайт під ключ за ${formatPackageTerm("business", L)}, фікс-ціна ${BUSINESS} в договорі. Інтернет-магазин ${SHOP}. Без підписок, код ваш. Гарантія, підтримка рік. Прорахунок за ${HOURS} год`,
  },
  hero: {
    h1Line1: "Сайт для бізнесу кодом —",
    h1Line2Lead: `за ${D} днів і `,
    h1Line2Em: BUSINESS,
    lede: "Без підписок і конструкторів. Код, домен і дані — ваші. Гарантія рік і все включено.",
    features: [
      { label: formatPackageTerm("business", L), sub: "Від брифу до запуску" },
      { label: "Ціна в договорі", sub: "Фіксуємо до старту робіт" },
      { label: "Гарантія рік, підтримка включена", sub: "Хостинг і SSL теж" },
    ],
    ctaPrimary: "Отримати безкоштовний прорахунок",
    ctaSecondary: "Дивитись ціни",
    footnote: `Відповімо з ціною і строком за ${HOURS} години. Без зобов'язань.`,
    mockupAlt: "Приклад сайту для бізнесу, створеного Code-Site.Art",
  },
  cases: {
    eyebrow: "КЕЙСИ",
    headingLead: "Сайти, які ми ",
    headingEm: "вже запустили",
    ctaLabel: "Всі кейси",
    ctaHref: "/portfolio",
  },
  pricing: {
    headingLead: "Ціни — ",
    headingEm: "фіксовані в договорі",
    sub: "Три пакети з готовим складом. Оберіть пакет — прорахунок прийде з ним уже вибраним.",
  },
  industries: {
    headingLead: "Спеціалізовані рішення під ",
    headingEm: "вашу галузь",
    sub: "Пакет «Сайт для бізнесу» плюс галузева інтеграція і вимоги вашої сфери.",
  },
  process: {
    headingLead: `${D} робочих днів — `,
    headingEm: "від брифу до запуску",
    sub: "Обсяг, строк і ціна зафіксовані в договорі. Ви заздалегідь знаєте, що отримаєте, коли і за скільки.",
    steps: [
      { n: "01", name: "Бриф і структура", duration: "День 1", items: ["Цілі і послуги", "Структура сторінок", "Список контенту"] },
      { n: "02", name: "Дизайн на вашому контенті", duration: "Дні 2–3", items: ["Ваші тексти і фото", "Мобільна версія", "Погодження"] },
      { n: "03", name: "Розробка і наповнення", duration: `Дні 4–${D - 1}`, items: ["Код і CMS", "Форми + Telegram", "SEO-структура"] },
      { n: "04", name: "Тест і запуск", duration: `День ${D}`, items: ["Перевірка на телефонах", "Аналітика", "Домен і SSL"] },
    ],
    shopLine: `Інтернет-магазин — ${formatPackageTerm("shop", L)}: дні 1–2 бриф і каталог → дні 3–5 дизайн → дні 6–${S - 2} розробка, оплата, доставка і товари → дні ${S - 1}–${S} тест і запуск.`,
    ctaLabel: "Детальний процес",
    ctaHref: "/process",
    moreLabel: "Що входить у кожен етап",
  },
  directions: {
    headingLead: "З чого ",
    headingEm: "почати",
    sub: "Сторінки, з яких найчастіше починають: аудит, ціни, кейси і пакети.",
    links: [
      { href: "/audit", label: "Безкоштовний аудит сайту" },
      { href: "/pricing", label: "Ціни" },
      { href: "/portfolio", label: "Кейси" },
      { href: "/corporate-site", label: "Сайт для бізнесу" },
      { href: "/online-store", label: "Інтернет-магазин" },
      { href: "/vs-constructors", label: "Порівняти з конструкторами" },
    ],
  },
  faqHeading: "Питання, які виникають перед стартом",
  faq: [
    {
      q: "Скільки коштуватиме мій сайт?",
      a: [
        "Лендінг — ",
        { em: LANDING },
        ", сайт для бізнесу — ",
        { em: BUSINESS },
        ", інтернет-магазин — ",
        { em: SHOP },
        ". Галузеве рішення ",
        { em: INDUSTRY },
        ", складна платформа ",
        { em: CUSTOM },
        ". Ціна фіксується в договорі до старту. Суму з додатками порахує ",
        { link: { href: "/calculator", text: "калькулятор" } },
        ".",
      ],
    },
    {
      q: "Скільки часу від брифу до запуску?",
      a: [
        "Лендінг — ",
        { em: formatPackageTerm("landing", L) },
        ", сайт для бізнесу — ",
        { em: formatPackageTerm("business", L) },
        ", інтернет-магазин — ",
        { em: formatPackageTerm("shop", L) },
        ", галузеве рішення — ",
        { em: formatPackageTerm("industry", L) },
        ". Дата запуску прописана в договорі.",
      ],
    },
    {
      q: "Чому так дешево, якщо це код?",
      a: [
        "Бо сайт займає менше годин. Ми збираємо його з перевірених шаблонів і блоків, рутинний код пише ШІ під контролем розробника, а між вами і розробником немає менеджерів. Ви платите за роботу, а не за наради.",
      ],
    },
    {
      q: "Що буде після року гарантії?",
      a: [
        "Рік хостингу, SSL, виправлень і оновлень уже в ціні. Далі — на ваш вибір: продовжуєте хостинг у нас за ",
        { em: `${HOSTING}/рік` },
        " або ми переносимо сайт на ваш акаунт. Код і так ваш.",
      ],
    },
    {
      q: "Що якщо потрібна нова сторінка через півроку?",
      a: [
        "Нова сторінка — ",
        { em: EXTRA_PAGE },
        ", робимо за ",
        { em: NEW_PAGE_DAYS },
        ". Тексти, ціни, фото і послуги ви змінюєте самі в адмінці — це безкоштовно.",
      ],
    },
    {
      q: "Як оплачувати?",
      a: [
        `${PT.prepaymentPercent}% передоплата, ${100 - PT.prepaymentPercent}% після запуску. При 100% передоплаті — знижка ${PT.fullPrepaymentDiscountPercent}%. Оплата на ФОП, карткою або в USDT.`,
      ],
    },
    {
      q: "Що якщо ви зірвете строк?",
      a: [
        "Платимо неустойку: ",
        { em: `${PT.latePenaltyPercentPerDay}% за кожен робочий день` },
        `, до ${PT.latePenaltyCapPercent}% від ціни. Це прописано в договорі.`,
      ],
    },
    {
      q: "Чи можу я побачити код до повної оплати?",
      a: ["Так. Код, доступи й сайт — ваші від самого початку. Дивіться будь-коли."],
    },
    {
      q: "Що як я не знаю точно, що мені потрібно?",
      a: [
        `Це нормально. Залиште заявку — за ${HOURS} години відповімо, який пакет підходить, скільки коштує і що можна не робити.`,
      ],
    },
    {
      q: "Чи гарантуєте топ-1 у Google?",
      a: [
        "Ні, і ніхто чесно не може. Ми робимо технічну базу, яку Google враховує: структуру, швидкість, розмітку. Решта — контент і час.",
      ],
    },
    {
      q: "Можна почати з лендінгу і пізніше дорости до повного сайту?",
      a: [
        "Так. Код ",
        { em: "масштабується" },
        ": стартуєте з лендінгу — пізніше додаємо сторінки, CMS і блог без переписування з нуля.",
      ],
    },
  ],
};

/** Back-compat for the homepage FAQ callers. */
export function buildHomepageFaq(): FAQItem[] {
  return HOMEPAGE_UK.faq;
}

