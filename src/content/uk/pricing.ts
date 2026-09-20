/**
 * /pricing — копірайт (uk). Жодної ціни руками: усі цифри й строки беруться
 * з `@/constants/pricing` (TZ v2 §1.1). Верстка — `@/components/pricing-page`.
 */

import type { PricingCopy } from "@/components/pricing-page";
import {
  ALL_PACKAGES,
  PAYMENT_TERMS,
  PACKAGES,
  SERVICES,
  addonPrice,
  formatAddonPrice,
  formatPackagePrice,
  formatPackageTerm,
  packagePrice,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import { PRICING_PROSE_UK } from "@/content/uk/pricing-prose";

const L = "uk" as const;
const usd = (n: number) => formatPrice(n, { locale: L });

const landing = usd(packagePrice("landing", L));
const business = usd(packagePrice("business", L));
const shop = usd(packagePrice("shop", L));
const hosting = usd(servicePrice("hostingRenewalPerYear", L));
const seoServices = usd(servicePrice("seoServicesFrom", L));
const seoShop = usd(servicePrice("seoShopFrom", L));
const extraPage = usd(addonPrice("extra_page", L));
const pay = PAYMENT_TERMS;
const instalmentPackages = ALL_PACKAGES.filter((id) => packagePrice(id, "uk") >= pay.instalmentsFrom)
  .map((id) => PACKAGES[id].name[L])
  .join(" і ");

/* ─── Порівняння (TZ §3.2) ──────────────────────────────────────────────
 * Tilda: tilda.cc/pricing, перевірено 20.09.2026 — Personal $10/міс при
 * оплаті за рік ($15 помісячно), Business $20/міс за рік ($25 помісячно);
 * експорт коду — лише на Business. Ціни Wix залежать від країни, тому
 * беремо Tilda. «від $200/міс за підтримку у типової студії» — формулювання
 * власника (TZ §3.2); TODO(owner): перевірити тариф на 2–3 студіях.
 */
const TILDA_PERSONAL_YEARLY = 10;
const TILDA_PERSONAL_MONTHLY = 15;
const WP_SUPPORT_FROM = 200;
const CHECKED = "20.09.2026";
const ours3y = usd(packagePrice("business", L) + 2 * servicePrice("hostingRenewalPerYear", L));

export const PRICING_COPY_UK: PricingCopy = {
  path: "/pricing",
  ogLocale: "uk_UA",
  // ≤ 60 символів: повна формула ТЗ «Ціни на створення сайту…» — 71.
  title: `Ціни на сайт 2026: лендінг ${landing}, сайт ${business}, магазин ${shop}`,
  description: `Лендінг ${landing} за ${formatPackageTerm("landing", L)}, сайт для бізнесу ${business}, магазин ${shop}. Ціна в договорі, код ваш, гарантія рік включена.`,
  crumbs: { home: "Головна", homeHref: "/", self: "Ціни" },
  eyebrow: "ЦІНИ",
  h1: ["Ціни на сайти 2026 —", "фіксовані, в договорі"],
  heroSub: `Лендінг ${landing}, сайт для бізнесу ${business}, інтернет-магазин ${shop}. Сума і строк — у договорі до старту. Хостинг, SSL, гарантія і підтримка на рік уже в ціні. Код — ваш.`,
  heroActions: { primary: "Безкоштовний прорахунок за 24 год", secondary: "Усі пакети і ціни" },
  cta: {
    button: "Отримати прорахунок",
    line: `Безкоштовно. Відповімо за ${SERVICES.auditResponseHours} години з ціною і строком.`,
  },
  cards: {
    title: "Три пакети, які беруть найчастіше",
    sub: "Кнопка під карткою відкриває форму з уже вибраним пакетом.",
  },
  packages: {
    title: "Усі пакети: ціна, строк, що входить",
    sub: "Строк — у робочих днях від дня, коли отримали бриф і матеріали.",
  },
  industries: {
    title: "Галузеві рішення",
    sub: `Готова структура, тексти й інтеграції під вашу галузь. ${formatPackagePrice("industry", L)}, строк ${formatPackageTerm("industry", L)}.`,
  },
  addons: {
    title: "Додатки до пакета — теж за фіксованою ціною",
    sub: "Додаєте тільки те, що потрібно. Сума пакета плюс додатки — і є ціна в договорі.",
  },
  services: {
    title: "Послуги поза пакетами",
    sub: "Що буває до і після запуску і скільки це коштує.",
    rows: [
      {
        name: "Аудит сайту / прорахунок",
        price: usd(SERVICES.auditPrice),
        note: [
          `Відповідь за ${SERVICES.auditResponseHours} години: що не так і скільки коштує виправити. `,
          { link: { href: "/audit", text: "Безкоштовний аудит" } },
          ".",
        ],
      },
      {
        name: "Підтримка і гарантія",
        price: `${usd(0)}, рік включено`,
        note: [
          `Баги, хостинг, SSL, оновлення, резервні копії — перші ${SERVICES.includedSupportMonths} місяців у ціні пакета. Далі: хостинг ${hosting}/рік або переносимо сайт на ваш акаунт. `,
          { link: { href: "/support", text: "Детальніше про підтримку" } },
          ".",
        ],
      },
      {
        name: "Нові сторінки і функції після запуску",
        price: "за прайсом додатків",
        note: [
          `Нова сторінка — ${formatAddonPrice("extra_page", L)}, ${SERVICES.newPageDays.min}–${SERVICES.newPageDays.max} робочі дні. Функції — за цінами з таблиці додатків, окремим рахунком.`,
        ],
      },
      {
        name: "SEO-просування",
        price: `від ${seoServices}/міс`,
        note: [
          `Сайт послуг — від ${seoServices}/міс, інтернет-магазин — від ${seoShop}/міс. `,
          { link: { href: "/seo", text: "Просування сайту" } },
          ".",
        ],
      },
      {
        name: "Редизайн",
        price: "ціна пакета + перенос",
        note: [
          `Платите за пакет, що відповідає новому сайту, плюс перенос контенту ${formatAddonPrice("migration", L)}. `,
          { link: { href: "/redesign", text: "Редизайн сайту" } },
          ".",
        ],
      },
    ],
  },
  payment: {
    title: "Умови оплати",
    sub: `Для пакетів від ${usd(pay.instalmentsFrom)} — розстрочка на ${pay.instalmentsCount} платежі.`,
  },
  compare: {
    title: "Ми vs WordPress-студія vs конструктор",
    sub: `Для прикладу — ${PACKAGES.business.name[L].toLowerCase()}, ${PACKAGES.business.includes[L][0].toLowerCase()}. Тільки те, що можна перевірити.`,
    headers: ["", "Code-Site.Art", "WordPress-студія", "Конструктор (Tilda)"],
    rows: [
      {
        param: "Підписка / міс",
        ours: `Немає. Після першого року — хостинг ${hosting}/рік`,
        wp: `Підтримка — від ${usd(WP_SUPPORT_FROM)}/міс у типової студії, плюс хостинг`,
        builder: `${usd(TILDA_PERSONAL_YEARLY)}/міс при оплаті за рік (${usd(TILDA_PERSONAL_MONTHLY)} помісячно), тариф Personal`,
      },
      {
        param: "Володіння кодом",
        ours: "Код у вашому GitHub, домен і дані — на вас",
        wp: "Файли ваші, але теми й плагіни часто на платних ліцензіях",
        builder: "Сайт живе на платформі. Експорт коду — лише на тарифі Business",
      },
      {
        param: "Швидкість запуску",
        ours: `${formatPackageTerm("business", L)}, строк у договорі`,
        wp: "Залежить від черги студії",
        builder: "Скільки часу витратите самі",
      },
      {
        param: "Підтримка",
        ours: `Рік включено: баги, хостинг, SSL, оновлення`,
        wp: "Окремий договір і щомісячна оплата",
        builder: "Підтримка платформи. Сам сайт — ваша задача",
      },
      {
        param: "Ціна за 3 роки",
        ours: `${ours3y}: пакет ${business} + хостинг ${hosting} × 2 роки`,
        wp: `Ціна сайту + від ${usd(WP_SUPPORT_FROM * 36)} за підтримку`,
        builder: `${usd(TILDA_PERSONAL_YEARLY * 36)} лише підписка, плюс ваш час або дизайнер`,
      },
    ],
    foot: `Тариф Tilda — з tilda.cc/pricing, перевірено ${CHECKED}. Ціни конструкторів змінюються, дивіться актуальні на їхньому сайті.`,
  },
  faqTitle: "Питання про ціни",
  faq: [
    {
      q: "Чому фікс-ціна, а не погодинно?",
      a: [
        "Бо ви купуєте готовий сайт, а не години. Склад кожного пакета розписаний заздалегідь: сторінки, функції, строк. Сума і строк фіксуються в договорі до старту і в процесі не ростуть. Якщо ми зриваємо строк з нашої вини — платимо ",
        { em: `${pay.latePenaltyPercentPerDay}% за кожен робочий день, до ${pay.latePenaltyCapPercent}%` },
        ". При погодинній оплаті ризик помилки в оцінці несе клієнт — у нас його несемо ми.",
      ],
    },
    {
      q: "Що якщо потрібно більше 5 сторінок?",
      a: [
        `${PACKAGES.business.name[L]} включає до 5 сторінок. Кожна наступна — `,
        { em: `${extraPage} за сторінку` },
        `. Наприклад, 8 сторінок: ${business} + 3 × ${extraPage} = ${usd(packagePrice("business", L) + 3 * addonPrice("extra_page", L))}. Точну суму під вашу конфігурацію покаже `,
        { link: { href: "/calculator", text: "калькулятор" } },
        ".",
      ],
    },
    {
      q: "Чи є розстрочка?",
      a: [
        `Так, для пакетів від ${usd(pay.instalmentsFrom)} (${instalmentPackages}) — `,
        { em: `${pay.instalmentsCount} платежі` },
        `. Для решти стандарт: ${pay.prepaymentPercent}% передоплата, ${100 - pay.prepaymentPercent}% після запуску. При 100% передоплаті — знижка ${pay.fullPrepaymentDiscountPercent}%.`,
      ],
    },
    {
      q: "Скільки коштує сайт під ключ?",
      a: [
        "Лендінг — ",
        { em: formatPackagePrice("landing", L) },
        ` за ${formatPackageTerm("landing", L)}, сайт для бізнесу — `,
        { em: formatPackagePrice("business", L) },
        ` за ${formatPackageTerm("business", L)}, інтернет-магазин — `,
        { em: formatPackagePrice("shop", L) },
        ` за ${formatPackageTerm("shop", L)}. Галузеве рішення — ${formatPackagePrice("industry", L)}, платформа на замовлення — ${formatPackagePrice("custom", L)}. У ціну входять дизайн, розробка, тексти на основі брифу, хостинг і SSL на рік, гарантія рік.`,
      ],
    },
    {
      q: "Можна замовити окремо дизайн або верстку?",
      a: [
        `Ні, ми робимо сайт наскрізно: дизайн, код, запуск. Макет без коду не приносить заявок, а передача чужого макета в розробку зазвичай коштує більше, ніж зробити все одразу. Найдешевший повний варіант — лендінг за ${landing}.`,
      ],
    },
    {
      q: "Скільки коштує просування сайту?",
      a: [
        "Це окрема послуга, у ціну розробки не входить. Сайт послуг — ",
        { em: `від ${seoServices}/міс` },
        ", інтернет-магазин — ",
        { em: `від ${seoShop}/міс` },
        ". SEO-структура, sitemap і підключення Search Console вже є в кожному пакеті. Деталі — на сторінці ",
        { link: { href: "/seo", text: "просування сайту" } },
        ".",
      ],
    },
    {
      q: "Що буде після року гарантії?",
      a: [
        "Два варіанти. Продовжуєте хостинг у нас — ",
        { em: `${hosting}/рік` },
        ". Або ми переносимо сайт на ваш акаунт, і ви не платите нам нічого. Абонплати за «підтримку» немає. Нові сторінки й функції — за прайсом додатків, окремим рахунком.",
      ],
    },
    {
      q: "Чому ціни у студій відрізняються в рази?",
      a: [
        "Бо під словом «сайт» продають різне. Порівнюйте не цифру, а склад: хто пише тексти, чий домен, чи є гарантія, чи є щомісячна плата і кому належить код. У нас код передається у ваш GitHub-репозиторій, а підтримка першого року вже в ціні.",
      ],
    },
    {
      q: "Скільки коштує редизайн?",
      a: [
        `Як новий сайт відповідного пакета плюс перенос контенту ${formatAddonPrice("migration", L)}. Окремої ціни «за редизайн» немає. Детальніше — `,
        { link: { href: "/redesign", text: "редизайн сайту" } },
        ".",
      ],
    },
  ],
  prose: PRICING_PROSE_UK,
  schema: {
    serviceName: "Розробка сайтів під ключ",
    serviceDescription: `Сайти на коді за фіксованою ціною: лендінг ${landing}, сайт для бізнесу ${business}, інтернет-магазин ${shop}, галузеві рішення і платформи на замовлення.`,
    catalogName: "Пакети Code-Site.Art",
  },
};
