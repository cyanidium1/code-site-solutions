/**
 * /ru/pricing — копирайт (ru, перевод uk по смыслу). Ни одной цены руками:
 * все цифры и сроки — из `@/constants/pricing`. Вёрстка — `@/components/pricing-page`.
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
import { PRICING_PROSE_RU } from "@/content/ru/pricing-prose";

const L = "ru" as const;
const usd = (n: number) => formatPrice(n, { locale: L });

const landing = usd(packagePrice("landing", L));
const business = usd(packagePrice("business", L));
const shop = usd(packagePrice("shop", L));
const hosting = usd(servicePrice("hostingRenewalPerYear", L));
const seoServices = usd(servicePrice("seoServicesFrom", L));
const seoShop = usd(servicePrice("seoShopFrom", L));
const extraPage = usd(addonPrice("extra_page", L));
const pay = PAYMENT_TERMS;
const instalmentPackages = ALL_PACKAGES.filter((id) => packagePrice(id, L) >= pay.instalmentsFrom)
  .map((id) => PACKAGES[id].name[L])
  .join(" и ");

/* Сравнение: Tilda — tilda.cc/pricing, проверено 20.09.2026 (Personal $10/мес
 * при оплате за год, $15 помесячно; экспорт кода — только на Business).
 * «от $200/мес за поддержку у типичной студии» — формулировка владельца
 * (TZ §3.2); TODO(owner): проверить тариф на 2–3 студиях. */
const TILDA_PERSONAL_YEARLY = 10;
const TILDA_PERSONAL_MONTHLY = 15;
const WP_SUPPORT_FROM = 200;
const CHECKED = "20.09.2026";
const ours3y = usd(packagePrice("business", L) + 2 * servicePrice("hostingRenewalPerYear", L));

export const PRICING_COPY_RU: PricingCopy = {
  path: "/ru/pricing",
  ogLocale: "ru_UA",
  title: `Цены на сайт 2026: лендинг ${landing}, сайт ${business}, магазин ${shop}`,
  description: `Лендинг ${landing} за ${formatPackageTerm("landing", L)}, сайт для бизнеса ${business}, магазин ${shop}. Цена в договоре, код ваш, гарантия год включена.`,
  crumbs: { home: "Главная", homeHref: "/ru", self: "Цены" },
  eyebrow: "ЦЕНЫ",
  h1: ["Цены на сайты 2026 —", "фиксированные, в договоре"],
  heroSub: `Лендинг ${landing}, сайт для бизнеса ${business}, интернет-магазин ${shop}. Сумма и срок — в договоре до старта. Хостинг, SSL, гарантия и поддержка на год уже в цене. Код — ваш.`,
  heroActions: { primary: "Бесплатный расчёт за 24 часа", secondary: "Все пакеты и цены" },
  cta: {
    button: "Получить расчёт",
    line: `Бесплатно. Ответим за ${SERVICES.auditResponseHours} часа с ценой и сроком.`,
  },
  cards: {
    title: "Три пакета, которые берут чаще всего",
    sub: "Кнопка под карточкой открывает форму с уже выбранным пакетом.",
  },
  packages: {
    title: "Все пакеты: цена, срок, что входит",
    sub: "Срок — в рабочих днях с момента, когда получили бриф и материалы.",
  },
  industries: {
    title: "Отраслевые решения",
    sub: `Готовая структура, тексты и интеграции под вашу отрасль. ${formatPackagePrice("industry", L)}, срок ${formatPackageTerm("industry", L)}.`,
  },
  addons: {
    title: "Дополнения к пакету — тоже по фиксированной цене",
    sub: "Добавляете только то, что нужно. Пакет плюс дополнения — это и есть цена в договоре.",
  },
  services: {
    title: "Услуги вне пакетов",
    sub: "Что бывает до и после запуска и сколько это стоит.",
    rows: [
      {
        name: "Аудит сайта / расчёт",
        price: usd(SERVICES.auditPrice),
        note: [
          `Ответ за ${SERVICES.auditResponseHours} часа: что не так и сколько стоит исправить. `,
          { link: { href: "/ru/audit", text: "Бесплатный аудит" } },
          ".",
        ],
      },
      {
        name: "Поддержка и гарантия",
        price: `${usd(0)}, год включён`,
        note: [
          `Баги, хостинг, SSL, обновления, резервные копии — первые ${SERVICES.includedSupportMonths} месяцев в цене пакета. Дальше: хостинг ${hosting}/год или переносим сайт на ваш аккаунт.`,
        ],
      },
      {
        name: "Новые страницы и функции после запуска",
        price: "по прайсу дополнений",
        note: [
          `Новая страница — ${formatAddonPrice("extra_page", L)}, ${SERVICES.newPageDays.min}–${SERVICES.newPageDays.max} рабочих дня. Функции — по ценам из таблицы дополнений, отдельным счётом.`,
        ],
      },
      {
        name: "SEO-продвижение",
        price: `от ${seoServices}/мес`,
        note: [
          `Сайт услуг — от ${seoServices}/мес, интернет-магазин — от ${seoShop}/мес. `,
          { link: { href: "/ru/seo", text: "Продвижение сайта" } },
          ".",
        ],
      },
      {
        name: "Редизайн",
        price: "цена пакета + перенос",
        note: [
          `Платите за пакет, который соответствует новому сайту, плюс перенос контента ${formatAddonPrice("migration", L)}. `,
          { link: { href: "/ru/redesign", text: "Редизайн сайта" } },
          ".",
        ],
      },
    ],
  },
  payment: {
    title: "Условия оплаты",
    sub: `Для пакетов от ${usd(pay.instalmentsFrom)} — рассрочка на ${pay.instalmentsCount} платежа.`,
  },
  compare: {
    title: "Мы vs WordPress-студия vs конструктор",
    sub: `Для примера — ${PACKAGES.business.name[L].toLowerCase()}, ${PACKAGES.business.includes[L][0].toLowerCase()}. Только то, что можно проверить.`,
    headers: ["", "Code-Site.Art", "WordPress-студия", "Конструктор (Tilda)"],
    rows: [
      {
        param: "Подписка / мес",
        ours: `Нет. После первого года — хостинг ${hosting}/год`,
        wp: `Поддержка — от ${usd(WP_SUPPORT_FROM)}/мес у типичной студии, плюс хостинг`,
        builder: `${usd(TILDA_PERSONAL_YEARLY)}/мес при оплате за год (${usd(TILDA_PERSONAL_MONTHLY)} помесячно), тариф Personal`,
      },
      {
        param: "Владение кодом",
        ours: "Код в вашем GitHub, домен и данные — на вас",
        wp: "Файлы ваши, но темы и плагины часто на платных лицензиях",
        builder: "Сайт живёт на платформе. Экспорт кода — только на тарифе Business",
      },
      {
        param: "Скорость запуска",
        ours: `${formatPackageTerm("business", L)}, срок в договоре`,
        wp: "Зависит от очереди студии",
        builder: "Сколько времени потратите сами",
      },
      {
        param: "Поддержка",
        ours: "Год включён: баги, хостинг, SSL, обновления",
        wp: "Отдельный договор и ежемесячная оплата",
        builder: "Поддержка платформы. Сам сайт — ваша задача",
      },
      {
        param: "Цена за 3 года",
        ours: `${ours3y}: пакет ${business} + хостинг ${hosting} × 2 года`,
        wp: `Цена сайта + от ${usd(WP_SUPPORT_FROM * 36)} за поддержку`,
        builder: `${usd(TILDA_PERSONAL_YEARLY * 36)} только подписка, плюс ваше время или дизайнер`,
      },
    ],
    foot: `Тариф Tilda — с tilda.cc/pricing, проверено ${CHECKED}. Цены конструкторов меняются, смотрите актуальные на их сайте.`,
  },
  faqTitle: "Вопросы о ценах",
  faq: [
    {
      q: "Почему фикс-цена, а не почасовая оплата?",
      a: [
        "Потому что вы покупаете готовый сайт, а не часы. Состав каждого пакета расписан заранее: страницы, функции, срок. Сумма и срок фиксируются в договоре до старта и в процессе не растут. Если мы срываем срок по своей вине — платим ",
        { em: `${pay.latePenaltyPercentPerDay}% за каждый рабочий день, до ${pay.latePenaltyCapPercent}%` },
        ". При почасовой оплате риск ошибки в оценке несёт клиент — у нас его несём мы.",
      ],
    },
    {
      q: "Что если нужно больше 5 страниц?",
      a: [
        `${PACKAGES.business.name[L]} включает до 5 страниц. Каждая следующая — `,
        { em: `${extraPage} за страницу` },
        `. Например, 8 страниц: ${business} + 3 × ${extraPage} = ${usd(packagePrice("business", L) + 3 * addonPrice("extra_page", L))}. Точную сумму под вашу конфигурацию покажет `,
        { link: { href: "/ru/calculator", text: "калькулятор" } },
        ".",
      ],
    },
    {
      q: "Есть ли рассрочка?",
      a: [
        `Да, для пакетов от ${usd(pay.instalmentsFrom)} (${instalmentPackages}) — `,
        { em: `${pay.instalmentsCount} платежа` },
        `. Для остальных стандарт: ${pay.prepaymentPercent}% предоплата, ${100 - pay.prepaymentPercent}% после запуска. При 100% предоплате — скидка ${pay.fullPrepaymentDiscountPercent}%.`,
      ],
    },
    {
      q: "Сколько стоит сайт под ключ?",
      a: [
        "Лендинг — ",
        { em: formatPackagePrice("landing", L) },
        ` за ${formatPackageTerm("landing", L)}, сайт для бизнеса — `,
        { em: formatPackagePrice("business", L) },
        ` за ${formatPackageTerm("business", L)}, интернет-магазин — `,
        { em: formatPackagePrice("shop", L) },
        ` за ${formatPackageTerm("shop", L)}. Отраслевое решение — ${formatPackagePrice("industry", L)}, платформа на заказ — ${formatPackagePrice("custom", L)}. В цену входят дизайн, разработка, тексты на основе брифа, хостинг и SSL на год, гарантия год.`,
      ],
    },
    {
      q: "Можно заказать отдельно дизайн или вёрстку?",
      a: [
        `Нет, мы делаем сайт целиком: дизайн, код, запуск. Макет без кода не приносит заявок, а передача чужого макета в разработку обычно стоит дороже, чем сделать всё сразу. Самый доступный полный вариант — лендинг за ${landing}.`,
      ],
    },
    {
      q: "Сколько стоит продвижение сайта?",
      a: [
        "Это отдельная услуга, в цену разработки не входит. Сайт услуг — ",
        { em: `от ${seoServices}/мес` },
        ", интернет-магазин — ",
        { em: `от ${seoShop}/мес` },
        ". SEO-структура, sitemap и подключение Search Console уже есть в каждом пакете. Подробнее — на странице ",
        { link: { href: "/ru/seo", text: "продвижение сайта" } },
        ".",
      ],
    },
    {
      q: "Что будет после года гарантии?",
      a: [
        "Два варианта. Продлеваете хостинг у нас — ",
        { em: `${hosting}/год` },
        ". Или мы переносим сайт на ваш аккаунт, и вы нам ничего не платите. Абонплаты за «поддержку» нет. Новые страницы и функции — по прайсу дополнений, отдельным счётом.",
      ],
    },
    {
      q: "Почему цены у студий отличаются в разы?",
      a: [
        "Потому что под словом «сайт» продают разное. Сравнивайте не цифру, а состав: кто пишет тексты, чей домен, есть ли гарантия, есть ли ежемесячная плата и кому принадлежит код. У нас код передаётся в ваш GitHub-репозиторий, а поддержка первого года уже в цене.",
      ],
    },
    {
      q: "Сколько стоит редизайн?",
      a: [
        `Как новый сайт соответствующего пакета плюс перенос контента ${formatAddonPrice("migration", L)}. Отдельной цены «за редизайн» нет. Подробнее — `,
        { link: { href: "/ru/redesign", text: "редизайн сайта" } },
        ".",
      ],
    },
  ],
  prose: PRICING_PROSE_RU,
  schema: {
    serviceName: "Разработка сайтов под ключ",
    serviceDescription: `Сайты на коде по фиксированной цене: лендинг ${landing}, сайт для бизнеса ${business}, интернет-магазин ${shop}, отраслевые решения и платформы на заказ.`,
    catalogName: "Пакеты Code-Site.Art",
  },
};
