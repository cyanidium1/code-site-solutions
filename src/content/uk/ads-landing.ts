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

const L = "uk" as const;
const PRICE = formatPackagePrice("business", L);
const TERM = formatPackageTerm("business", L);
const DAYS = PACKAGES.business.days.min;
const HOSTING = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });
const HOURS = SERVICES.auditResponseHours;
const pay = PAYMENT_TERMS;

/** Google Ads landing `/zamovyty-sait` (TZ v2 §4). */
export const ADS_LANDING_UK: AdsLandingContent = {
  metaTitle: `Замовити сайт кодом: ${DAYS} днів, ${PRICE} | Code-Site.Art`,
  metaDescription: `Сайт для бізнесу кодом за ${TERM} і ${PRICE}. Ціна в договорі, код ваш, гарантія і підтримка рік включені. Прорахунок за ${HOURS} години.`,
  header: { telegramLabel: "Telegram", phoneAria: "Подзвонити" },
  hero: {
    eyebrow: "Code-Site.Art · розробка сайтів",
    h1: `Сайт для бізнесу кодом за ${DAYS} днів і ${PRICE}`,
    bullets: [TERM, "Ціна в договорі", "Гарантія рік, підтримка включена"],
    sub: `Без підписок і конструкторів. Код, домен і дані — ваші. Залиште контакт — за ${HOURS} години надішлемо ціну, строк і склад робіт.`,
  },
  packages: {
    title: "Три пакети з фіксованою ціною",
    sub: "Ціна і строк не змінюються після підписання договору. Оберіть пакет — форма відкриється з ним.",
  },
  includes: {
    title: `Що входить у сайт за ${PRICE}`,
    sub: `Пакет «${PACKAGES.business.name[L]}». Строк — ${TERM}.`,
    afterYear: `Через рік — продовження хостингу ${HOSTING} на рік або перенесення сайту на ваш акаунт. Абонплати за підтримку немає.`,
  },
  cases: {
    title: "Кейси з цифрами",
    sub: "Цифри — з наших кейсів у портфоліо, як їх звітують клієнти та Google Search Console.",
  },
  testimonialsTitle: "Що кажуть клієнти",
  comparison: {
    title: "Код чи конструктор: що дешевше за 3 роки",
    sub: `Порівнюємо наш пакет «${PACKAGES.business.name[L]}» з тарифом ${BUILDER_PLAN.name}.`,
    colUs: `Code-Site.Art, ${PRICE}`,
    colBuilder: `Конструктор (${BUILDER_PLAN.name})`,
    rows: [
      {
        label: "Абонплата",
        us: `Немає. Перший рік хостингу включено, далі ${HOSTING} на рік`,
        builder: `${formatPrice(BUILDER_PLAN.perMonthUsd, { locale: L })} на місяць`,
      },
      {
        label: "Код і дизайн",
        us: "Ваші. Сайт можна перенести на будь-який хостинг",
        builder: "Залишаються на платформі. Перестали платити — сайт вимкнено",
      },
      {
        label: "Вартість за 3 роки",
        us: `${formatPrice(ourThreeYearCost(), { locale: L })} — пакет і 2 роки хостингу`,
        builder: `${formatPrice(builderThreeYearCost(), { locale: L })} — тариф × ${COMPARISON_MONTHS} місяців, без дизайну і текстів`,
      },
    ],
    note: `Тариф конструктора — станом на ${BUILDER_PLAN.checkedAt}, оплата за рік.`,
  },
  process: {
    title: `Процес: ${DAYS} робочих днів`,
    sub: "Кожен етап закінчується тим, що ви бачите результат і погоджуєте його.",
    steps: [
      {
        days: "День 1",
        title: "Бриф і структура",
        body: "Короткий дзвінок або анкета. Фіксуємо сторінки, тексти, форми. Підписуємо договір.",
      },
      {
        days: "Дні 2–3",
        title: "Дизайн",
        body: "Макет головної і внутрішніх сторінок під телефон і комп'ютер. Одне коло правок.",
      },
      {
        days: "Дні 4–6",
        title: "Розробка і наповнення",
        body: "Верстаємо кодом, підключаємо CMS, форми і Telegram, наповнюємо текстами.",
      },
      {
        days: "День 7",
        title: "Тест і запуск",
        body: "Перевіряємо швидкість і форми, підключаємо домен, Analytics і Search Console. Передаємо доступи.",
      },
    ],
  },
  faq: {
    title: "Часті питання",
    items: [
      {
        q: `Чи справді сайт буде готовий за ${DAYS} днів?`,
        a: [
          `Так, строк ${TERM} прописаний у договорі. Відлік — з дня, коли ми отримали бриф і матеріали. Якщо зірвемо строк з нашої вини — неустойка ${pay.latePenaltyPercentPerDay}% за кожен робочий день, до ${pay.latePenaltyCapPercent}%.`,
        ],
      },
      {
        q: `Що входить у ціну ${PRICE}?`,
        a: [
          `До 5 сторінок, CMS, форми із заявками в Telegram, SEO-структура, тексти на основі брифу, Analytics, хостинг і SSL на рік, гарантія рік. Ціна фіксується в договорі й не змінюється.`,
        ],
      },
      {
        q: "Як проходить оплата?",
        a: [
          `${pay.prepaymentPercent}% передоплата, ${100 - pay.prepaymentPercent}% після запуску. При 100% передоплаті — знижка ${pay.fullPrepaymentDiscountPercent}%. Оплата на ФОП, карткою або USDT.`,
        ],
      },
      {
        q: "Що буде після першого року?",
        a: [
          `Гарантія і підтримка включені на рік. Далі — продовження хостингу ${HOSTING} на рік або перенесення сайту на ваш акаунт. Код і дані залишаються вашими.`,
        ],
      },
      {
        q: "Чи зможу я сам змінювати тексти і фото?",
        a: [
          "Так. Сайт підключений до Sanity CMS: тексти, фото і ціни редагуєте самі, навіть з телефона. Покажемо, як це робити, під час запуску.",
        ],
      },
    ],
  },
  finalForm: {
    title: `Безкоштовний прорахунок за ${HOURS} години`,
    sub: "Опишіть задачу — відповімо з ціною, строком і складом робіт. Без зобов'язань.",
  },
  footer: {
    contract: "Договір",
    contractHref: "/public-contract",
    rights: "Code-Site.Art",
  },
};
