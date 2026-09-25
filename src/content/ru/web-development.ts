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
 * `/ru/rozrobka-saitiv` — русская версия главной коммерческой страницы, для
 * RU-группы объявлений Google Ads (ТЗ v2 §3.4). Структура идентична uk.
 * Ни одной цены или срока вручную: всё из `@/constants/pricing`.
 */
const L = "ru" as const;

const from = (n: number) => formatPrice(n, { locale: L, withPrefix: true });
const price = (id: (typeof CORE_PACKAGES)[number] | "industry" | "custom") => formatPackagePrice(id, L);
const term = (id: (typeof CORE_PACKAGES)[number] | "industry" | "custom") => formatPackageTerm(id, L);

const MIN_PRICE = from(packagePrice("landing", L));
const MIN_DAYS = PACKAGES.landing.days.min;
const BIZ_DAYS = PACKAGES.business.days.min;
const HOSTING = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });
const HOURS = SERVICES.auditResponseHours;

/** Blocks shared with the RU city pages (`src/content/ru/cities/*`). */
export const MONEY_SHARED_RU = {
  packages: {
    heading: "Три пакета с фиксированной ценой",
    sub:
      `Цена и срок прописываются в договоре до старта. Нужна отраслевая интеграция — ${price("industry")}, ` +
      `платформа с кабинетами — ${price("custom")}.`,
  },
  included: {
    heading: "Что вы получаете",
    sub: "Всё ниже входит в цену пакета. После запуска ничего не нужно доплачивать, чтобы сайт работал.",
    items: [
      { title: "Дизайн на вашем контенте", line: "макет под ваши услуги и тексты, а не купленная тема с чужими фото" },
      { title: "Тексты", line: "пишем на основе вашего брифа; вы согласовываете, а не пишете с нуля" },
      { title: "Адаптив", line: "сайт одинаково удобен на телефоне, планшете и компьютере" },
      { title: "Заявки в Telegram", line: "каждая заявка с формы сразу приходит вам в мессенджер" },
      { title: "SEO-структура", line: "отдельная страница под каждую услугу, мета-теги, карта сайта, разметка" },
      { title: "Админка", line: "тексты, цены и фото меняете сами, даже с телефона (в пакетах с CMS)" },
      { title: "Хостинг, SSL и домен на вас", line: `первый год включён, дальше — ${HOSTING} в год или перенос на ваш аккаунт` },
      { title: "Гарантия и поддержка год", line: "исправление ошибок и технический уход 12 месяцев — без абонплаты" },
    ],
    foot: "Код, домен и доступы оформляем на вас. Уйдёте в другую студию — заберёте сайт с собой.",
  },
  process: {
    heading: `Как мы делаем сайт за ${BIZ_DAYS} дней`,
    sub: "Пример для пакета «Сайт для бизнеса». Срок считается в рабочих днях от получения брифа и предоплаты.",
    steps: [
      { when: "День 1", title: "Бриф и структура", body: "Короткий бриф и звонок. Утверждаем, какие будут страницы и что на каждой." },
      { when: "Дни 2–3", title: "Дизайн на вашем контенте", body: "Макет главной и ключевых страниц с вашими текстами и фото. Вы согласовываете или правите." },
      { when: "Дни 4–6", title: "Разработка и наполнение", body: "Верстаем, подключаем формы, Telegram, аналитику, наполняем админку." },
      { when: `День ${BIZ_DAYS}`, title: "Тест и запуск", body: "Проверяем на телефонах и в браузерах, переносим на домен, передаём доступы." },
    ],
    foot:
      `Лендинг — ${term("landing")}, интернет-магазин — ${term("shop")}. ` +
      `Оплата: ${PAYMENT_TERMS.prepaymentPercent}% предоплата, ${100 - PAYMENT_TERMS.prepaymentPercent}% после запуска. ` +
      `Срыв срока по нашей вине — неустойка ${PAYMENT_TERMS.latePenaltyPercentPerDay}% за каждый рабочий день.`,
  },
  why: {
    heading: "Почему код, а не конструктор",
    items: [
      {
        title: "Без подписки",
        body:
          "Конструктор работает, пока вы платите каждый месяц. Перестали — сайт исчез. Наш сайт вы оплачиваете один раз, " +
          `а после первого года платите только за хостинг — ${HOSTING} в год.`,
      },
      {
        title: "Скорость",
        body:
          "Страница не тянет редактор и чужие скрипты конструктора, поэтому открывается быстро даже на мобильном " +
          "интернете. Медленный сайт закрывают, не дождавшись первого экрана.",
      },
      {
        title: "Код ваш",
        body:
          "Сайт написан на Next.js и принадлежит вам: код, домен, админка. Можно перенести к другому подрядчику " +
          "или на свой сервер в любой момент — без разрешения платформы.",
      },
    ],
    links: [
      { label: "Сравнение с конструкторами", href: "/vs-constructors" },
      { label: "Сравнение с WordPress", href: "/vs-wordpress" },
    ],
  },
  testimonialsHeading: "Что говорят клиенты",
  bottomForm: {
    heading: `Бесплатный расчёт за ${HOURS} часа`,
    sub: `Опишите задачу — ответим в течение ${HOURS} часов в рабочее время: пакет, цена, срок. Без обязательств.`,
  },
} satisfies Pick<MoneyPageContent, "packages" | "included" | "process" | "why" | "testimonialsHeading" | "bottomForm">;

export const WEB_DEVELOPMENT_RU: MoneyPageContent = {
  metaTitle: `Разработка сайтов под ключ — цена ${MIN_PRICE}, срок от ${MIN_DAYS} дней`,
  metaDescription:
    `Сайт кодом под ключ: лендинг ${price("landing")}, сайт для бизнеса ${price("business")} за ${BIZ_DAYS} дней, ` +
    `магазин ${price("shop")}. Фикс-цена в договоре, код ваш, без подписок.`,
  breadcrumbHome: "Главная",
  breadcrumbSelf: "Разработка сайтов",

  hero: {
    headline: ["Разработка сайтов под ключ — ", `фикс-цена ${MIN_PRICE}, срок от ${MIN_DAYS} дней`],
    sub:
      `Лендинг — ${price("landing")} за ${term("landing")}. Сайт для бизнеса — ${price("business")} за ${term("business")}. ` +
      `Интернет-магазин — ${price("shop")} за ${term("shop")}. Оставьте контакт — за ${HOURS} часа пришлём бесплатный расчёт.`,
  },

  ...MONEY_SHARED_RU,

  cases: {
    heading: "Шесть сайтов и что они дали",
    sub: "Цифры — из карточек кейсов в портфолио: Search Console, аналитика и отчёты клиентов.",
    slugs: ["nbyg-kobenhavn", "icelab", "efedra-clinic", "mono-pools", "aleko-course", "kondor-device"],
    allLabel: "Все кейсы",
    allHref: "/ru/portfolio",
  },

  faq: {
    heading: "Частые вопросы о разработке сайтов",
    items: [
      {
        q: "Сколько стоит разработка сайта под ключ?",
        a: [
          "Лендинг — ",
          { em: price("landing") },
          `, сайт для бизнеса до 5 страниц — ${price("business")}, интернет-магазин — ${price("shop")}. ` +
            `Отраслевое решение — ${price("industry")}, платформа с кабинетами — ${price("custom")}. ` +
            "Цена фиксируется в договоре до старта и не меняется. Полный прайс и дополнения — ",
          { link: { href: "/ru/pricing", text: "на странице цен" } },
          ".",
        ],
      },
      {
        q: "Сколько времени занимает разработка?",
        a: [
          `Лендинг — ${term("landing")}, сайт для бизнеса — ${term("business")}, магазин — ${term("shop")}. ` +
            "Срок считается от брифа и предоплаты и прописывается в договоре. Если срываем по нашей вине — " +
            `платим неустойку ${PAYMENT_TERMS.latePenaltyPercentPerDay}% за каждый рабочий день, до ${PAYMENT_TERMS.latePenaltyCapPercent}%.`,
        ],
      },
      {
        q: "Что входит в цену?",
        a: [
          "Дизайн, тексты на основе вашего брифа, разработка, адаптив, формы с заявками в Telegram, SEO-структура, " +
            "хостинг и SSL на год, гарантия и поддержка год. Состав каждого пакета — в карточках выше. " +
            "Чтобы собрать свою конфигурацию, воспользуйтесь ",
          { link: { href: "/ru/calculator", text: "калькулятором" } },
          ".",
        ],
      },
      {
        q: "Что будет после первого года?",
        a: [
          `Ничего обязательного. Либо продлеваете хостинг у нас за ${HOSTING} в год, либо мы переносим сайт на ваш аккаунт. ` +
            "Абонплаты за поддержку нет. Новые страницы и функции — по прайсу дополнений.",
        ],
      },
      {
        q: "Как проходит оплата?",
        a: [
          `${PAYMENT_TERMS.prepaymentPercent}% предоплата, ${100 - PAYMENT_TERMS.prepaymentPercent}% после запуска. ` +
            `При 100% предоплате — скидка ${PAYMENT_TERMS.fullPrepaymentDiscountPercent}%. ` +
            "Оплата на ФЛП безналичным расчётом, картой или в USDT.",
        ],
      },
      {
        q: "Нужен второй язык или блог. Сколько это добавит?",
        a: [
          `Второй язык — ${formatAddonPrice("lang", L)}, блог — ${formatAddonPrice("blog", L)}, дополнительная страница — ` +
            `${formatAddonPrice("extra_page", L)}. Перенос со старого сайта с сохранением позиций — ${formatAddonPrice("migration", L)}. ` +
            "У всех дополнений фиксированная цена.",
        ],
      },
      {
        q: "Кто будет владельцем сайта и домена?",
        a: [
          "Вы. Домен регистрируем на вас, код и доступы к хостингу и админке передаём полностью. " +
            "Домен на студии — самый распространённый способ привязать клиента, и мы так не делаем.",
        ],
      },
      {
        q: "Можно ли редактировать сайт самостоятельно?",
        a: [
          "Да. В пакетах «Сайт для бизнеса» и «Интернет-магазин» есть админка: тексты, цены, фото и товары " +
            "меняете сами, даже с телефона. Сломать дизайн при этом не получится.",
        ],
      },
      {
        q: "Вы работаете по всей Украине?",
        a: [
          "Да, удалённо. Отдельные страницы есть для ",
          { link: { href: "/ru/rozrobka-saitiv-kyiv", text: "Киева" } },
          ", ",
          { link: { href: "/ru/rozrobka-saitiv-lviv", text: "Львова" } },
          ", ",
          { link: { href: "/ru/rozrobka-saitiv-odesa", text: "Одессы" } },
          ", ",
          { link: { href: "/ru/rozrobka-saitiv-dnipro", text: "Днепра" } },
          " и ",
          { link: { href: "/ru/rozrobka-saitiv-kharkiv", text: "Харькова" } },
          ". Цена от города не зависит.",
        ],
      },
      {
        q: "Вы гарантируете заявки или топ в Google?",
        a: [
          "Нет, и никто честно не может. Мы гарантируем срок, цену и то, что сайт технически готов к поиску. " +
            "Результаты наших клиентов — в кейсах выше, с цифрами из Search Console.",
        ],
      },
    ],
  },

  hub: {
    eyebrow: "ЧТО ДЕЛАЕМ",
    heading: ["Выберите формат, отрасль ", "или город"],
    groups: [
      {
        title: "По типу сайта",
        links: [
          { label: "Лендинг", href: "/ru/landing", note: `${price("landing")} · ${term("landing")}` },
          { label: "Сайт для бизнеса", href: "/ru/corporate-site", note: `${price("business")} · ${term("business")}` },
          { label: "Интернет-магазин", href: "/ru/online-store", note: `${price("shop")} · ${term("shop")}` },
          { label: "Редизайн сайта", href: "/ru/redesign", note: "по цене пакета + перенос" },
          { label: "Стоимость создания сайта", href: "/ru/pricing" },
        ],
      },
      {
        title: "По отрасли",
        links: [
          { label: "Сайт для клиники", href: "/ru/sites-for/medicine", note: price("industry") },
          { label: "Сайт строительной компании", href: "/ru/sites-for/renovation" },
          { label: "Сайт для юридической фирмы", href: "/ru/sites-for/legal" },
          { label: "Сайт для бухгалтера", href: "/ru/sites-for/finance" },
          { label: "Сайт автосервиса и автосалона", href: "/ru/sites-for/auto" },
          { label: "Сайт недвижимости", href: "/ru/sites-for/real-estate" },
        ],
      },
      {
        title: "По городу",
        links: [
          { label: "Разработка сайтов в Киеве", href: "/ru/rozrobka-saitiv-kyiv" },
          { label: "Разработка сайтов во Львове", href: "/ru/rozrobka-saitiv-lviv" },
          { label: "Разработка сайтов в Одессе", href: "/ru/rozrobka-saitiv-odesa" },
          { label: "Разработка сайтов в Днепре", href: "/ru/rozrobka-saitiv-dnipro" },
          { label: "Разработка сайтов в Харькове", href: "/ru/rozrobka-saitiv-kharkiv" },
        ],
      },
    ],
  },
};
