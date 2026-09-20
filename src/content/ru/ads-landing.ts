import type { AdsLandingContent } from "@/components/ads-landing/types";
import {
  PACKAGES,
  PAYMENT_TERMS,
  SERVICES,
  formatPackagePrice,
  formatPackageTerm,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import {
  BUILDER_PLAN,
  COMPARISON_MONTHS,
  builderThreeYearCost,
  ourThreeYearCost,
} from "@/components/ads-landing/builder-plan";

const L = "ru" as const;
const PRICE = formatPackagePrice("business", L);
const TERM = formatPackageTerm("business", L);
const DAYS = PACKAGES.business.days.min;
const HOSTING = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });
const HOURS = SERVICES.auditResponseHours;
const pay = PAYMENT_TERMS;

/** Google Ads landing `/ru/zakazat-sait` (TZ v2 §4). Meaning translation of uk. */
export const ADS_LANDING_RU: AdsLandingContent = {
  metaTitle: `Заказать сайт кодом: ${DAYS} дней, ${PRICE} | Code-Site.Art`,
  metaDescription: `Сайт для бизнеса кодом за ${TERM} и ${PRICE}. Цена в договоре, код ваш, гарантия и поддержка год включены. Расчет за ${HOURS} часа.`,
  header: { telegramLabel: "Telegram", phoneAria: "Позвонить" },
  hero: {
    eyebrow: "Code-Site.Art · разработка сайтов",
    h1: `Сайт для бизнеса кодом за ${DAYS} дней и ${PRICE}`,
    bullets: [TERM, "Цена в договоре", "Гарантия год, поддержка включена"],
    sub: `Без подписок и конструкторов. Код, домен и данные — ваши. Оставьте контакт — за ${HOURS} часа пришлем цену, срок и состав работ.`,
  },
  packages: {
    title: "Три пакета с фиксированной ценой",
    sub: "Цена и срок не меняются после подписания договора. Выберите пакет — форма откроется с ним.",
  },
  includes: {
    title: `Что входит в сайт за ${PRICE}`,
    sub: `Пакет «${PACKAGES.business.name[L]}». Срок — ${TERM}.`,
    afterYear: `Через год — продление хостинга ${HOSTING} в год или перенос сайта на ваш аккаунт. Абонплаты за поддержку нет.`,
  },
  cases: {
    title: "Кейсы с цифрами",
    sub: "Цифры — из наших кейсов в портфолио, как их сообщают клиенты и Google Search Console.",
  },
  testimonialsTitle: "Что говорят клиенты",
  comparison: {
    title: "Код или конструктор: что дешевле за 3 года",
    sub: `Сравниваем наш пакет «${PACKAGES.business.name[L]}» с тарифом ${BUILDER_PLAN.name}.`,
    colUs: `Code-Site.Art, ${PRICE}`,
    colBuilder: `Конструктор (${BUILDER_PLAN.name})`,
    rows: [
      {
        label: "Абонплата",
        us: `Нет. Первый год хостинга включен, дальше ${HOSTING} в год`,
        builder: `${formatPrice(BUILDER_PLAN.perMonthUsd, { locale: L })} в месяц`,
      },
      {
        label: "Код и дизайн",
        us: "Ваши. Сайт можно перенести на любой хостинг",
        builder: "Остаются на платформе. Перестали платить — сайт отключен",
      },
      {
        label: "Стоимость за 3 года",
        us: `${formatPrice(ourThreeYearCost(), { locale: L })} — пакет и 2 года хостинга`,
        builder: `${formatPrice(builderThreeYearCost(), { locale: L })} — тариф × ${COMPARISON_MONTHS} месяцев, без дизайна и текстов`,
      },
    ],
    note: `Тариф конструктора — по состоянию на ${BUILDER_PLAN.checkedAt}, оплата за год.`,
  },
  process: {
    title: `Процесс: ${DAYS} рабочих дней`,
    sub: "Каждый этап заканчивается тем, что вы видите результат и согласовываете его.",
    steps: [
      {
        days: "День 1",
        title: "Бриф и структура",
        body: "Короткий звонок или анкета. Фиксируем страницы, тексты, формы. Подписываем договор.",
      },
      {
        days: "Дни 2–3",
        title: "Дизайн",
        body: "Макет главной и внутренних страниц под телефон и компьютер. Один круг правок.",
      },
      {
        days: "Дни 4–6",
        title: "Разработка и наполнение",
        body: "Верстаем кодом, подключаем CMS, формы и Telegram, наполняем текстами.",
      },
      {
        days: "День 7",
        title: "Тест и запуск",
        body: "Проверяем скорость и формы, подключаем домен, Analytics и Search Console. Передаем доступы.",
      },
    ],
  },
  faq: {
    title: "Частые вопросы",
    items: [
      {
        q: `Сайт правда будет готов за ${DAYS} дней?`,
        a: [
          `Да, срок ${TERM} прописан в договоре. Отсчет — со дня, когда мы получили бриф и материалы. Если сорвем срок по нашей вине — неустойка ${pay.latePenaltyPercentPerDay}% за каждый рабочий день, до ${pay.latePenaltyCapPercent}%.`,
        ],
      },
      {
        q: `Что входит в цену ${PRICE}?`,
        a: [
          "До 5 страниц, CMS, формы с заявками в Telegram, SEO-структура, тексты на основе брифа, Analytics, хостинг и SSL на год, гарантия год. Цена фиксируется в договоре и не меняется.",
        ],
      },
      {
        q: "Как проходит оплата?",
        a: [
          `${pay.prepaymentPercent}% предоплата, ${100 - pay.prepaymentPercent}% после запуска. При 100% предоплате — скидка ${pay.fullPrepaymentDiscountPercent}%. Оплата на ФОП, картой или USDT.`,
        ],
      },
      {
        q: "Что будет после первого года?",
        a: [
          `Гарантия и поддержка включены на год. Дальше — продление хостинга ${HOSTING} в год или перенос сайта на ваш аккаунт. Код и данные остаются вашими.`,
        ],
      },
      {
        q: "Смогу ли я сам менять тексты и фото?",
        a: [
          "Да. Сайт подключен к Sanity CMS: тексты, фото и цены редактируете сами, даже с телефона. Покажем, как это делать, при запуске.",
        ],
      },
    ],
  },
  finalForm: {
    title: `Бесплатный расчет за ${HOURS} часа`,
    sub: "Опишите задачу — ответим с ценой, сроком и составом работ. Без обязательств.",
  },
  footer: {
    // No ru version of the contract page; the uk one is the legal text.
    contract: "Договор",
    contractHref: "/public-contract",
    rights: "Code-Site.Art",
  },
};
