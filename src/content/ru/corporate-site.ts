import type { PackagePageContent } from "@/components/landing-page/types";
import { resolveRootHref } from "@/constants/i18n-routes";
import {
  ADDONS,
  PACKAGES,
  formatAddonPrice,
  formatPackagePrice,
  formatPackageTerm,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";

const L = "ru";
const price = formatPackagePrice("business", L);
const term = formatPackageTerm("business", L);
const days = PACKAGES.business.days.max;
const landing = formatPackagePrice("landing", L);
const shop = formatPackagePrice("shop", L);
const rush = `«${ADDONS.rush.name[L]}» (${formatAddonPrice("rush", L)})`;
const hosting = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });

export const CORPORATE_RU: PackagePageContent = {
  pkg: "business",
  rootPath: "/corporate-site",
  metaTitle: `Сайт для бизнеса за ${price}, ${term} | Code-Site.Art`,
  metaDescription: `Сайт для бизнеса на коде за ${price} и ${term}: до 5 страниц, Sanity CMS, заявки в Telegram, SEO-структура, хостинг на год. Код ваш.`,
  breadcrumbHome: "Главная",
  breadcrumbSelf: "Сайт для бизнеса",
  serviceName: "Разработка сайта для бизнеса",
  offerName: "Сайт для бизнеса под ключ",
  eyebrow: "Пакет «Сайт для бизнеса» · самый популярный",
  h1: `Сайт для бизнеса за ${price} и ${term}`,
  sub: "До 5 страниц: главная, услуги, о компании, кейсы, контакты. Тексты и фото меняете сами в Sanity CMS, даже с телефона. Цена фиксируется в договоре.",
  badges: [
    { label: price, sub: "фикс-цена в договоре" },
    { label: term, sub: "от брифа до запуска" },
    { label: "Sanity CMS", sub: "редактируете сами" },
    { label: "Гарантия год", sub: "включена в цену" },
  ],
  composition: {
    heading: ["Что входит в сайт для бизнеса ", `за ${price}`],
    includesTitle: "Что входит",
    excludesTitle: "Что не входит",
    excludesFoot: `Корзина и оплата товаров — это пакет «Интернет-магазин» за ${shop}. CRM, онлайн-запись, оплату услуг, второй язык и блог можно добавить — см. дополнения ниже.`,
  },
  when: {
    heading: ["Когда нужен сайт — ", "а когда хватит лендинга"],
    fitTitle: "Сайт для бизнеса — правильный выбор",
    fit: [
      "Несколько услуг, каждой нужна своя страница",
      "Хотите сами обновлять тексты, цены и фото",
      "Нужен поисковый трафик, а не только реклама",
      "Сайт должен показать компанию: команда, кейсы, отзывы",
    ],
    notFitTitle: "Лучше другой пакет",
    notFit: [
      `Одно предложение под рекламу — хватит лендинга за ${landing}`,
      `Каталог с корзиной и оплатой — интернет-магазин за ${shop}`,
      "Личный кабинет, сложные интеграции — Custom",
    ],
  },
  process: {
    heading: ["Как мы делаем сайт ", `за ${term}`],
    sub: "Срок считаем со дня, когда получили бриф и предоплату.",
    steps: [
      { from: 1, title: "Бриф и структура", body: "Согласовываем страницы, блоки и тексты. Карту сайта вы видите в первый же день." },
      { from: 2, to: 3, title: "Дизайн", body: "Макеты главной и внутренних страниц под телефон и компьютер, правки по вашим комментариям." },
      { from: 4, to: days - 1, title: "Разработка", body: "Вёрстка, Sanity CMS, формы и Telegram, SEO-структура, Google Analytics и Search Console." },
      { from: days, title: "Тест и запуск", body: "Проверяем формы и скорость, запускаем на вашем домене и показываем, как редактировать сайт." },
    ],
  },
  addons: {
    heading: ["Что можно ", "добавить к сайту"],
    sub: `У каждого дополнения фиксированная цена. Нужно быстрее — дополнение ${rush}.`,
    calcLabel: "Посчитать в калькуляторе",
    calcHref: resolveRootHref("/calculator", L),
  },
  payment: { heading: ["Условия ", "оплаты"] },
  cases: {
    heading: ["Сайты для бизнеса, которые мы ", "уже запустили"],
    sub: "Три проекта из портфолио. Цифры на карточках взяты из кейсов.",
    slugs: ["nbyg-kobenhavn", "efedra-clinic", "webbond"],
    allLabel: "Все кейсы",
    allHref: resolveRootHref("/portfolio", L),
  },
  faq: {
    heading: "Частые вопросы о сайте для бизнеса",
    items: [
      {
        q: `Что входит в сайт для бизнеса за ${price}?`,
        a: [
          "До 5 страниц, Sanity CMS, формы с заявками в Telegram, SEO-структура, тексты по брифу, Google Analytics и Search Console, хостинг и SSL на год, гарантия год. Код и доступы — ваши.",
        ],
      },
      {
        q: "Сколько длится разработка?",
        a: [`${term} от брифа и предоплаты. Если нужно быстрее — дополнение ${rush}.`],
      },
      {
        q: "Что если нужно больше 5 страниц?",
        a: [`Каждая дополнительная страница — ${formatAddonPrice("extra_page", L)}. Цену фиксируем в договоре до старта.`],
      },
      {
        q: "Смогу ли я сам редактировать сайт?",
        a: ["Да. Sanity CMS работает в браузере и с телефона: тексты, фото, цены, новые кейсы. На запуске покажем, как это делать."],
      },
      {
        q: "Чем это отличается от лендинга?",
        a: [
          `Лендинг — одна страница под одно действие, без CMS, за ${landing}. Сайт для бизнеса — до 5 страниц с CMS и SEO-структурой под поиск. Подробнее — `,
          { link: { href: resolveRootHref("/landing", L), text: "страница лендинга" } },
          ".",
        ],
      },
      {
        q: "Что после запуска?",
        a: [
          `Гарантия и поддержка включены на год. После года — продление хостинга ${hosting}/год или перенос на ваш аккаунт.`,
        ],
      },
      {
        q: "Кому принадлежит сайт?",
        a: ["Вам: код, домен, доступы к CMS и аналитике. Подписок и привязки к нам нет."],
      },
    ],
  },
  seo: { href: "/seo", linkLabel: "Как работает продвижение" },
  cta: {
    heading: ["Бесплатный расчёт ", "за 24 часа"],
    sub: "Опишите задачу в форме вверху — ответим с ценой, сроком и составом работ. Без обязательств.",
    formLabel: "Заполнить форму",
    calcLabel: "Открыть калькулятор",
    calcHref: resolveRootHref("/calculator", L),
  },
  related: {
    heading: "Сайты для бизнеса в нишах — разборы",
    sub: "Что должно быть на сайте в вашей нише и какие ошибки забирают заявки.",
    links: [
      { label: "сайт отеля с бронированием", href: "/ru/blog/sayt-otelya-s-bronirovaniem" },
      { label: "сайт турагентства", href: "/ru/blog/sayt-turagentstva" },
      { label: "сайт грузоперевозок", href: "/ru/blog/sayt-gruzoperevozok" },
    ],
  },
};
