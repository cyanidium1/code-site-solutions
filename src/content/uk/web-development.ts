import {
  CORE_PACKAGES,
  PACKAGES,
  PAYMENT_TERMS,
  SERVICES,
  formatAddonPrice,
  formatPackagePrice,
  formatPackageTerm,
  packagePrice,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import type { MoneyPageContent } from "@/types/money-page";

/**
 * `/rozrobka-saitiv` — головна комерційна сторінка і посадочна для Google Ads
 * (ТЗ v2 §3.4). Ядро кластера (Ahrefs, 31.08.2026): «розробка сайтів» 800,
 * «замовити сайт» 500, «сайт під ключ» 350 — ≈2 950 запитів на місяць.
 *
 * Жодної ціни чи строку руками: усе з `@/constants/pricing`. Кейси — тільки
 * з цифрами, які вже є в картці кейсу (metricsLine у Sanity).
 */
const L = "uk" as const;

const from = (n: number) => formatPrice(n, { locale: L, withPrefix: true });
const price = (id: (typeof CORE_PACKAGES)[number] | "industry" | "custom") => formatPackagePrice(id, L);
const term = (id: (typeof CORE_PACKAGES)[number] | "industry" | "custom") => formatPackageTerm(id, L);

const MIN_PRICE = from(packagePrice("landing", L));
const MIN_DAYS = PACKAGES.landing.days.min;
const BIZ_DAYS = PACKAGES.business.days.min;
const HOSTING = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });
const HOURS = SERVICES.auditResponseHours;

/**
 * Blocks shared with the city pages (`src/content/uk/cities/*`): the same
 * offer, the same process and the same arguments on every page — only the
 * city angle and the local cases differ.
 */
export const MONEY_SHARED_UK = {
  packages: {
    heading: "Три пакети з фіксованою ціною",
    sub:
      `Ціна і строк прописуються в договорі до старту. Потрібна галузева інтеграція — ${price("industry")}, ` +
      `платформа з кабінетами — ${price("custom")}.`,
  },
  included: {
    heading: "Що ви отримуєте",
    sub: "Усе нижче входить у ціну пакета. Після запуску нічого не треба доплачувати, щоб сайт працював.",
    items: [
      { title: "Дизайн на вашому контенті", line: "макет під ваші послуги і тексти, а не куплена тема з чужими фото" },
      { title: "Тексти", line: "пишемо на основі вашого брифу; ви погоджуєте, а не пишете з нуля" },
      { title: "Адаптив", line: "сайт однаково зручний на телефоні, планшеті й комп'ютері" },
      { title: "Заявки в Telegram", line: "кожна заявка з форми одразу приходить вам у месенджер" },
      { title: "SEO-структура", line: "окрема сторінка під кожну послугу, мета-теги, карта сайту, розмітка" },
      { title: "Адмінка", line: "тексти, ціни й фото змінюєте самі, навіть з телефона (у пакетах із CMS)" },
      { title: "Хостинг, SSL і домен на вас", line: `перший рік включено, далі — ${HOSTING} на рік або перенесення на ваш акаунт` },
      { title: "Гарантія і підтримка рік", line: "виправлення помилок і технічний догляд 12 місяців — без абонплати" },
    ],
    foot: "Код, домен і доступи оформлюємо на вас. Підете до іншої студії — заберете сайт із собою.",
  },
  process: {
    heading: `Як ми робимо сайт за ${BIZ_DAYS} днів`,
    sub: "Приклад для пакета «Сайт для бізнесу». Строк рахується в робочих днях від отримання брифу і передоплати.",
    steps: [
      { when: "День 1", title: "Бриф і структура", body: "Короткий бриф і дзвінок. Затверджуємо, які будуть сторінки і що на кожній." },
      { when: "Дні 2–3", title: "Дизайн на вашому контенті", body: "Макет головної і ключових сторінок з вашими текстами і фото. Ви погоджуєте або правите." },
      { when: "Дні 4–6", title: "Розробка і наповнення", body: "Верстаємо, підключаємо форми, Telegram, аналітику, наповнюємо адмінку." },
      { when: `День ${BIZ_DAYS}`, title: "Тест і запуск", body: "Перевіряємо на телефонах і в браузерах, переносимо на домен, передаємо доступи." },
    ],
    foot:
      `Лендінг — ${term("landing")}, інтернет-магазин — ${term("shop")}. ` +
      `Оплата: ${PAYMENT_TERMS.prepaymentPercent}% передоплата, ${100 - PAYMENT_TERMS.prepaymentPercent}% після запуску. ` +
      `Зрив строку з нашої вини — неустойка ${PAYMENT_TERMS.latePenaltyPercentPerDay}% за кожен робочий день.`,
  },
  why: {
    heading: "Чому код, а не конструктор",
    items: [
      {
        title: "Без підписки",
        body:
          "Конструктор працює, поки ви платите щомісяця. Перестали — сайт зник. Наш сайт ви оплачуєте один раз, " +
          `а після першого року платите тільки за хостинг — ${HOSTING} на рік.`,
      },
      {
        title: "Швидкість",
        body:
          "Сторінка не тягне редактор і чужі скрипти конструктора, тому відкривається швидко навіть на мобільному " +
          "інтернеті. Повільний сайт закривають, не дочекавшись першого екрана.",
      },
      {
        title: "Код ваш",
        body:
          "Сайт написаний на Next.js і належить вам: код, домен, адмінка. Можна перенести до іншого підрядника " +
          "або на свій сервер будь-коли — без дозволу платформи.",
      },
    ],
    links: [
      { label: "Порівняння з конструкторами", href: "/vs-constructors" },
      { label: "Порівняння з WordPress", href: "/vs-wordpress" },
    ],
  },
  testimonialsHeading: "Що кажуть клієнти",
  bottomForm: {
    heading: `Безкоштовний прорахунок за ${HOURS} години`,
    sub: `Опишіть задачу — відповімо протягом ${HOURS} годин у робочий час: пакет, ціна, строк. Без зобов'язань.`,
  },
} satisfies Pick<MoneyPageContent, "packages" | "included" | "process" | "why" | "testimonialsHeading" | "bottomForm">;

export const WEB_DEVELOPMENT_UK: MoneyPageContent = {
  metaTitle: `Розробка сайтів під ключ — ціна ${MIN_PRICE}, строк від ${MIN_DAYS} днів`,
  metaDescription:
    `Сайт кодом під ключ: лендінг ${price("landing")}, сайт для бізнесу ${price("business")} за ${BIZ_DAYS} днів, ` +
    `магазин ${price("shop")}. Фікс-ціна в договорі, код ваш, без підписок.`,
  breadcrumbHome: "Головна",
  breadcrumbSelf: "Розробка сайтів",

  hero: {
    headline: ["Розробка сайтів під ключ — ", `фікс-ціна ${MIN_PRICE}, строк від ${MIN_DAYS} днів`],
    sub:
      `Лендінг — ${price("landing")} за ${term("landing")}. Сайт для бізнесу — ${price("business")} за ${term("business")}. ` +
      `Інтернет-магазин — ${price("shop")} за ${term("shop")}. Залиште контакт — за ${HOURS} години надішлемо безкоштовний прорахунок.`,
  },

  ...MONEY_SHARED_UK,

  cases: {
    heading: "Шість сайтів і що вони дали",
    sub: "Цифри — з карток кейсів у портфоліо: Search Console, аналітика і звіти клієнтів.",
    slugs: ["nbyg-kobenhavn", "icelab", "efedra-clinic", "mono-pools", "aleko-course", "kondor-device"],
    allLabel: "Всі кейси",
    allHref: "/portfolio",
  },

  faq: {
    heading: "Часті питання про розробку сайтів",
    items: [
      {
        q: "Скільки коштує розробка сайту під ключ?",
        a: [
          "Лендінг — ",
          { em: price("landing") },
          `, сайт для бізнесу до 5 сторінок — ${price("business")}, інтернет-магазин — ${price("shop")}. ` +
            `Галузеве рішення — ${price("industry")}, платформа з кабінетами — ${price("custom")}. ` +
            "Ціна фіксується в договорі до старту і не змінюється. Повний прайс і додатки — ",
          { link: { href: "/pricing", text: "на сторінці цін" } },
          ".",
        ],
      },
      {
        q: "Скільки часу займає розробка?",
        a: [
          `Лендінг — ${term("landing")}, сайт для бізнесу — ${term("business")}, магазин — ${term("shop")}. ` +
            "Строк рахується від брифу і передоплати та прописується в договорі. Якщо зриваємо з нашої вини — " +
            `платимо неустойку ${PAYMENT_TERMS.latePenaltyPercentPerDay}% за кожен робочий день, до ${PAYMENT_TERMS.latePenaltyCapPercent}%.`,
        ],
      },
      {
        q: "Що входить у ціну?",
        a: [
          "Дизайн, тексти на основі вашого брифу, розробка, адаптив, форми із заявками в Telegram, SEO-структура, " +
            "хостинг і SSL на рік, гарантія і підтримка рік. Склад кожного пакета — у картках вище. " +
            "Щоб зібрати свою конфігурацію, скористайтеся ",
          { link: { href: "/calculator", text: "калькулятором" } },
          ".",
        ],
      },
      {
        q: "Що буде після першого року?",
        a: [
          `Нічого обов'язкового. Або продовжуєте хостинг у нас за ${HOSTING} на рік, або ми переносимо сайт на ваш акаунт. ` +
            "Абонплати за підтримку немає. Нові сторінки і функції — за прайсом додатків.",
        ],
      },
      {
        q: "Як проходить оплата?",
        a: [
          `${PAYMENT_TERMS.prepaymentPercent}% передоплата, ${100 - PAYMENT_TERMS.prepaymentPercent}% після запуску. ` +
            `При 100% передоплаті — знижка ${PAYMENT_TERMS.fullPrepaymentDiscountPercent}%. ` +
            "Оплата на ФОП безготівкою, карткою або в USDT.",
        ],
      },
      {
        q: "Потрібна друга мова або блог. Скільки це додасть?",
        a: [
          `Друга мова — ${formatAddonPrice("lang", L)}, блог — ${formatAddonPrice("blog", L)}, додаткова сторінка — ` +
            `${formatAddonPrice("extra_page", L)}. Перенос зі старого сайту зі збереженням позицій — ${formatAddonPrice("migration", L)}. ` +
            "Усі додатки мають фіксовану ціну.",
        ],
      },
      {
        q: "Хто буде власником сайту і домену?",
        a: [
          "Ви. Домен реєструємо на вас, код і доступи до хостингу та адмінки передаємо повністю. " +
            "Домен на студії — найпоширеніший спосіб прив'язати клієнта, і ми так не робимо.",
        ],
      },
      {
        q: "Чи можна редагувати сайт самостійно?",
        a: [
          "Так. У пакетах «Сайт для бізнесу» і «Інтернет-магазин» є адмінка: тексти, ціни, фото й товари " +
            "змінюєте самі, навіть з телефона. Зламати дизайн при цьому не вийде.",
        ],
      },
      {
        q: "Ви працюєте по всій Україні?",
        a: [
          "Так, віддалено. Окремі сторінки є для ",
          { link: { href: "/rozrobka-saitiv-kyiv", text: "Києва" } },
          ", ",
          { link: { href: "/rozrobka-saitiv-lviv", text: "Львова" } },
          ", ",
          { link: { href: "/rozrobka-saitiv-odesa", text: "Одеси" } },
          ", ",
          { link: { href: "/rozrobka-saitiv-dnipro", text: "Дніпра" } },
          " і ",
          { link: { href: "/rozrobka-saitiv-kharkiv", text: "Харкова" } },
          ". Ціна від міста не залежить.",
        ],
      },
      {
        q: "Ви гарантуєте заявки або топ у Google?",
        a: [
          "Ні, і ніхто чесно не може. Ми гарантуємо строк, ціну і те, що сайт технічно готовий до пошуку. " +
            "Результати наших клієнтів — у кейсах вище, з цифрами з Search Console.",
        ],
      },
    ],
  },

  hub: {
    eyebrow: "ЩО РОБИМО",
    heading: ["Оберіть формат, галузь ", "або місто"],
    groups: [
      {
        title: "За типом сайту",
        links: [
          { label: "Лендінг", href: "/landing", note: `${price("landing")} · ${term("landing")}` },
          { label: "Сайт для бізнесу", href: "/corporate-site", note: `${price("business")} · ${term("business")}` },
          { label: "Інтернет-магазин", href: "/online-store", note: `${price("shop")} · ${term("shop")}` },
          { label: "Редизайн сайту", href: "/redesign", note: "за ціною пакета + перенос" },
          { label: "Ціни і додатки", href: "/pricing" },
        ],
      },
      {
        title: "За галуззю",
        links: [
          { label: "Сайт для клініки", href: "/sites-for/medicine", note: price("industry") },
          { label: "Сайт будівельної компанії", href: "/sites-for/renovation" },
          { label: "Сайт для юридичної фірми", href: "/sites-for/legal" },
          { label: "Сайт для бухгалтера", href: "/sites-for/finance" },
          { label: "Сайт автосервісу й автосалону", href: "/sites-for/auto" },
          { label: "Сайт нерухомості", href: "/sites-for/real-estate" },
        ],
      },
      {
        title: "За містом",
        links: [
          { label: "Розробка сайтів у Києві", href: "/rozrobka-saitiv-kyiv" },
          { label: "Розробка сайтів у Львові", href: "/rozrobka-saitiv-lviv" },
          { label: "Розробка сайтів в Одесі", href: "/rozrobka-saitiv-odesa" },
          { label: "Розробка сайтів у Дніпрі", href: "/rozrobka-saitiv-dnipro" },
          { label: "Розробка сайтів у Харкові", href: "/rozrobka-saitiv-kharkiv" },
        ],
      },
    ],
  },
};
