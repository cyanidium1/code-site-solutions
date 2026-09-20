/**
 * Homepage copy (ru) — meaning-translation of `content/uk/homepage.ts`
 * (TZ v2 §3.1). Every price and term is read from `@/constants/pricing`.
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
import { resolveRootHref } from "@/constants/i18n-routes";
import type { HomepageContent } from "@/content/uk/homepage";

const L: Locale = "ru";
const fp = (n: number) => formatPrice(n, { locale: L });
const href = (uaPath: string) => resolveRootHref(uaPath, L);

const LANDING = formatPackagePrice("landing", L);
const BUSINESS = formatPackagePrice("business", L);
const SHOP = formatPackagePrice("shop", L);
const INDUSTRY = formatPackagePrice("industry", L);
const CUSTOM = formatPackagePrice("custom", L);
const D = PACKAGES.business.days.min;
const S = PACKAGES.shop.days.min;
const HOURS = SERVICES.auditResponseHours;
const HOSTING = fp(servicePrice("hostingRenewalPerYear", L));
const EXTRA_PAGE = fp(addonPrice("extra_page", L));
const NEW_PAGE_DAYS = formatDays(SERVICES.newPageDays, L);
const PT = PAYMENT_TERMS;

export const HOMEPAGE_RU: HomepageContent = {
  meta: {
    title: `Сайт для бизнеса кодом за ${D} дней и ${BUSINESS} | Code-Site.Art`,
    description: `Сайт под ключ за ${formatPackageTerm("business", L)}, фикс-цена ${BUSINESS} в договоре. Интернет-магазин ${SHOP}. Без подписок, код ваш. Гарантия и поддержка год. Расчёт за ${HOURS} ч`,
  },
  hero: {
    h1Line1: "Сайт под ключ кодом",
    h1Line2Lead: `за ${D} дней `,
    h1Line2Em: `от ${BUSINESS}`,
    lede: "Без подписок и конструкторов. Код, домен и данные — ваши. Гарантия год, и всё включено.",
    features: [
      {
        label: "ТЗ пишем сами",
        sub: "Без брифов на 50 вопросов: решаем, презентуем и аргументируем",
      },
      {
        label: "Гарантия 1 год",
        sub: "Без подписок и привязки: код ваш, можете уйти в любой момент",
      },
    ],
    ctaPrimary: "Получить бесплатный расчёт",
    ctaSecondary: "Смотреть цены",
    footnote: `Ответим с ценой и сроком за ${HOURS} часа. Без обязательств.`,
    mockupAlt: "Пример сайта для бизнеса, созданного Code-Site.Art",
  },
  cases: {
    eyebrow: "КЕЙСЫ",
    headingLead: "Сайты, которые мы ",
    headingEm: "уже запустили",
    ctaLabel: "Все кейсы",
    ctaHref: href("/portfolio"),
  },
  pricing: {
    headingLead: "Цены — ",
    headingEm: "фиксированы в договоре",
    sub: "Три пакета с готовым составом. Выберите пакет — расчёт придёт с ним уже выбранным.",
  },
  industries: {
    headingLead: "Решения под ",
    headingEm: "вашу отрасль",
    sub: "Пакет «Сайт для бизнеса» плюс отраслевая интеграция и требования вашей сферы.",
  },
  process: {
    headingLead: `${D} рабочих дней — `,
    headingEm: "от брифа до запуска",
    sub: "Объём, срок и цена зафиксированы в договоре. Вы заранее знаете, что получите, когда и за сколько.",
    steps: [
      { n: "01", name: "Бриф и структура", duration: "День 1", items: ["Цели и услуги", "Структура страниц", "Список контента"] },
      { n: "02", name: "Дизайн на вашем контенте", duration: "Дни 2–3", items: ["Ваши тексты и фото", "Мобильная версия", "Согласование"] },
      { n: "03", name: "Разработка и наполнение", duration: `Дни 4–${D - 1}`, items: ["Код и CMS", "Формы + Telegram", "SEO-структура"] },
      { n: "04", name: "Тест и запуск", duration: `День ${D}`, items: ["Проверка на телефонах", "Аналитика", "Домен и SSL"] },
    ],
    shopLine: `Интернет-магазин — ${formatPackageTerm("shop", L)}: дни 1–2 бриф и каталог → дни 3–5 дизайн → дни 6–${S - 2} разработка, оплата, доставка и товары → дни ${S - 1}–${S} тест и запуск.`,
    ctaLabel: "Весь процесс",
    ctaHref: href("/process"),
    moreLabel: "Что входит в каждый этап",
  },
  directions: {
    headingLead: "С чего ",
    headingEm: "начать",
    sub: "Страницы, с которых чаще всего начинают: аудит, цены, кейсы и пакеты.",
    links: [
      { href: href("/audit"), label: "Бесплатный аудит сайта" },
      { href: href("/pricing"), label: "Цены" },
      { href: href("/portfolio"), label: "Кейсы" },
      { href: href("/corporate-site"), label: "Сайт для бизнеса" },
      { href: href("/online-store"), label: "Интернет-магазин" },
      { href: href("/vs-constructors"), label: "Сравнить с конструкторами" },
    ],
  },
  faqHeading: "Вопросы, которые возникают перед стартом",
  faq: [
    {
      q: "Сколько будет стоить мой сайт?",
      a: [
        "Лендинг — ",
        { em: LANDING },
        ", сайт для бизнеса — ",
        { em: BUSINESS },
        ", интернет-магазин — ",
        { em: SHOP },
        ". Отраслевое решение ",
        { em: INDUSTRY },
        ", сложная платформа ",
        { em: CUSTOM },
        ". Цена фиксируется в договоре до старта. Сумму с дополнениями посчитает ",
        { link: { href: href("/calculator"), text: "калькулятор" } },
        ".",
      ],
    },
    {
      q: "Сколько времени от брифа до запуска?",
      a: [
        "Лендинг — ",
        { em: formatPackageTerm("landing", L) },
        ", сайт для бизнеса — ",
        { em: formatPackageTerm("business", L) },
        ", интернет-магазин — ",
        { em: formatPackageTerm("shop", L) },
        ", отраслевое решение — ",
        { em: formatPackageTerm("industry", L) },
        ". Дата запуска прописана в договоре.",
      ],
    },
    {
      q: "Почему так дёшево, если это код?",
      a: [
        "Потому что сайт занимает меньше часов. Мы собираем его из проверенных шаблонов и блоков, рутинный код пишет ИИ под контролем разработчика, а между вами и разработчиком нет менеджеров. Вы платите за работу, а не за совещания.",
      ],
    },
    {
      q: "Что будет после года гарантии?",
      a: [
        "Год хостинга, SSL, исправлений и обновлений уже в цене. Дальше — на ваш выбор: продлеваете хостинг у нас за ",
        { em: `${HOSTING}/год` },
        " или мы переносим сайт на ваш аккаунт. Код и так ваш.",
      ],
    },
    {
      q: "Что если через полгода нужна новая страница?",
      a: [
        "Новая страница — ",
        { em: EXTRA_PAGE },
        ", делаем за ",
        { em: NEW_PAGE_DAYS },
        ". Тексты, цены, фото и услуги вы меняете сами в админке — это бесплатно.",
      ],
    },
    {
      q: "Как оплачивать?",
      a: [
        `${PT.prepaymentPercent}% предоплата, ${100 - PT.prepaymentPercent}% после запуска. При 100% предоплате — скидка ${PT.fullPrepaymentDiscountPercent}%. Оплата на ФОП, картой или в USDT.`,
      ],
    },
    {
      q: "Что если вы сорвёте срок?",
      a: [
        "Платим неустойку: ",
        { em: `${PT.latePenaltyPercentPerDay}% за каждый рабочий день` },
        `, до ${PT.latePenaltyCapPercent}% от цены. Это прописано в договоре.`,
      ],
    },
    {
      q: "Могу ли я увидеть код до полной оплаты?",
      a: ["Да. Код, доступы и сайт — ваши с самого начала. Смотрите в любой момент."],
    },
    {
      q: "Что если я не знаю точно, что мне нужно?",
      a: [
        `Это нормально. Оставьте заявку — за ${HOURS} часа ответим, какой пакет подходит, сколько стоит и что можно не делать.`,
      ],
    },
    {
      q: "Гарантируете топ-1 в Google?",
      a: [
        "Нет, и никто честно не может. Мы делаем техническую базу, которую учитывает Google: структуру, скорость, разметку. Остальное — контент и время.",
      ],
    },
    {
      q: "Можно начать с лендинга и позже вырасти до полного сайта?",
      a: [
        "Да. Код ",
        { em: "масштабируется" },
        ": стартуете с лендинга — позже добавляем страницы, CMS и блог без переписывания с нуля.",
      ],
    },
  ],
};

export function buildRuHomepageFaq(): FAQItem[] {
  return HOMEPAGE_RU.faq;
}

