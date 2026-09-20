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
const price = formatPackagePrice("shop", L);
const term = formatPackageTerm("shop", L);
const days = PACKAGES.shop.days.max;
const landing = formatPackagePrice("landing", L);
const business = formatPackagePrice("business", L);
const rush = `«${ADDONS.rush.name[L]}» (${formatAddonPrice("rush", L)})`;
const hosting = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });
const usd = (n: number) => formatPrice(n, { locale: L });

/* Same comparison as the uk page. TODO(owner): перевірити тариф — see the
   note in src/content/uk/online-store.ts ($30–80 is the owner's range). */
const SUB = { min: 30, max: 80, months: 36 };

export const ONLINE_STORE_RU: PackagePageContent = {
  pkg: "shop",
  rootPath: "/online-store",
  metaTitle: `Интернет-магазин за ${price}, ${term} | Code-Site.Art`,
  metaDescription: `Интернет-магазин на коде за ${price} и ${term}: каталог, корзина, LiqPay или Monobank, Новая Почта, админка. Без подписок и комиссий, код ваш.`,
  breadcrumbHome: "Главная",
  breadcrumbSelf: "Интернет-магазин",
  serviceName: "Разработка интернет-магазина",
  offerName: "Интернет-магазин под ключ",
  eyebrow: "Пакет «Интернет-магазин»",
  h1: `Интернет-магазин кодом за ${price} и ${term} — без подписок и комиссий`,
  sub: "Каталог, корзина, заказ в 2 клика, оплата LiqPay или Monobank, Новая Почта. Товарами управляете сами в админке. Платите один раз — магазин ваш.",
  badges: [
    { label: price, sub: "фикс-цена в договоре" },
    { label: term, sub: "от брифа до запуска" },
    { label: "0 подписок", sub: "и 0 комиссий платформе" },
    { label: "Гарантия год", sub: "включена в цену" },
  ],
  composition: {
    heading: ["Что входит в магазин ", `за ${price}`],
    includesTitle: "Что входит",
    excludesTitle: "Что не входит",
    excludesFoot: `Больше товаров — дополнения «${ADDONS.sku_500.name[L]}» (${formatAddonPrice("sku_500", L)}) и «${ADDONS.sku_1000.name[L]}» (${formatAddonPrice("sku_1000", L)}). Фильтры, CRM и второй язык — см. дополнения ниже.`,
  },
  when: {
    heading: ["Когда нужен магазин — ", "а когда нет"],
    fitTitle: "Магазин — правильный выбор",
    fit: [
      "Каталог, который покупатель листает и заказывает сам",
      "Заказы должны приходить в Telegram, а не теряться в Direct",
      "Комиссии и подписки платформ съедают маржу",
      "Нужна оплата онлайн и доставка Новой Почтой",
    ],
    notFitTitle: "Лучше другой пакет",
    notFit: [
      `1–3 товара или инфопродукт — лендинг за ${landing} с дополнением оплаты`,
      `Услуги без каталога — сайт для бизнеса за ${business}`,
      "Маркетплейс с продавцами и складом — Custom",
    ],
  },
  process: {
    heading: ["Как мы делаем магазин ", `за ${term}`],
    sub: "Срок считаем со дня, когда получили бриф, предоплату и список товаров.",
    steps: [
      { from: 1, to: 2, title: "Бриф и структура каталога", body: "Категории, характеристики товаров, доставка и оплата. Согласовываем карту магазина." },
      { from: 3, to: 5, title: "Дизайн", body: "Главная, категория, карточка товара, корзина — под телефон и компьютер." },
      { from: 6, to: days - 2, title: "Разработка", body: "Каталог, корзина, LiqPay или Monobank, Новая Почта, админка Sanity, SEO категорий, уведомления в Telegram." },
      { from: days - 1, to: days, title: "Тест и запуск", body: "Тестовые заказы и оплаты, проверка скорости. Запуск и обучение работе с админкой." },
    ],
  },
  compare: {
    heading: ["Код или конструктор: ", "что дешевле за 3 года"],
    sub: "Horoshop, Shop-Express, Prom — ежемесячная плата, пока магазин работает. Наш магазин — один платёж.",
    theirsTitle: "Конструктор или маркетплейс",
    theirsLine: `Подписка ${usd(SUB.min)}–${SUB.max}/мес × ${SUB.months} мес = ${usd(SUB.min * SUB.months)}–${usd(SUB.max * SUB.months).replace("$", "")} и магазин не ваш`,
    theirsRows: [
      { name: "Horoshop (Standard–Pro, оплата за год)", price: "816–1 728 грн/мес" },
      { name: "Prom.ua (пакеты «Prom мікс 1 000» — «Prom топ»)", price: "7 500–11 500 грн/год" },
      // TODO(owner): перевірити тариф Shop-Express і вписати ціну.
      { name: "Shop-Express", price: "ежемесячная подписка" },
    ],
    theirsPoints: [
      "Платите, пока магазин работает",
      "Дизайн и SEO — в рамках возможностей платформы",
      "Переезд на другую платформу — фактически новый магазин",
    ],
    oursTitle: "Code-Site.Art",
    oursLine: `${price} один раз, код и база ваши`,
    oursPoints: [
      "0 подписок и 0 комиссий платформе",
      "Код и база товаров ваши — можно перенести куда угодно",
      `Хостинг и SSL на год включены; дальше — ${hosting}/год или ваш аккаунт`,
      "Гарантия и поддержка на год включены",
    ],
    checked: "Тарифы Horoshop и Prom — с публичных страниц платформ, проверено 20.09.2026",
  },
  addons: {
    heading: ["Что можно ", "добавить к магазину"],
    sub: `У каждого дополнения фиксированная цена. Нужно быстрее — дополнение ${rush}.`,
    calcLabel: "Посчитать в калькуляторе",
    calcHref: resolveRootHref("/calculator", L),
  },
  payment: { heading: ["Условия ", "оплаты"] },
  cases: {
    heading: ["Магазины, которые мы ", "уже запустили"],
    sub: "Книжное издательство, электроника, косметика. Цифры на карточках взяты из кейсов.",
    slugs: ["glimmer", "kondor-device", "le-muse-nature"],
    allLabel: "Все кейсы",
    allHref: resolveRootHref("/portfolio", L),
  },
  faq: {
    heading: "Частые вопросы об интернет-магазине",
    items: [
      {
        q: `Что входит в магазин за ${price}?`,
        a: [
          "Каталог до 100 товаров, карточки с вариантами, корзина, заказ в 2 клика, оплата LiqPay или Monobank, Новая Почта, админка Sanity, SEO категорий, уведомления о заказах в Telegram, хостинг и SSL на год, гарантия год.",
        ],
      },
      {
        q: "Сколько длится разработка?",
        a: [`${term} от брифа и предоплаты. Если нужно быстрее — дополнение ${rush}.`],
      },
      {
        q: "У меня больше 100 товаров. Сколько это стоит?",
        a: [
          `${ADDONS.sku_500.name[L]} — ${formatAddonPrice("sku_500", L)}. ${ADDONS.sku_1000.name[L]} — ${formatAddonPrice("sku_1000", L)}. Цену фиксируем в договоре до старта.`,
        ],
      },
      {
        q: "Почему не Horoshop, Shop-Express или Prom?",
        a: [
          "Там ежемесячная подписка, пока магазин работает, а дизайн и SEO ограничены платформой. Здесь — один платёж, код и база ваши. Подробнее — ",
          { link: { href: resolveRootHref("/vs-constructors", L), text: "код против конструктора" } },
          ".",
        ],
      },
      {
        q: "Есть ли комиссия с продаж?",
        a: ["Нам — нет. Платёжные сервисы (LiqPay, Monobank) берут свою комиссию за эквайринг по своим тарифам."],
      },
      {
        q: "Кто добавляет товары?",
        a: [
          `Вы, в админке Sanity — с компьютера или телефона. На запуске покажем, как это делать. Импорт из Excel входит в дополнение «${ADDONS.sku_1000.name[L]}».`,
        ],
      },
      {
        q: "Что после запуска?",
        a: [
          `Гарантия и поддержка включены на год. После года — продление хостинга ${hosting}/год или перенос на ваш аккаунт.`,
        ],
      },
    ],
  },
  seo: {
    href: "/seo",
    linkLabel: "Как работает продвижение магазина",
    line: `После запуска: продвижение магазина от ${usd(servicePrice("seoShopFrom", L))}/мес`,
  },
  cta: {
    heading: ["Бесплатный расчёт ", "за 24 часа"],
    sub: "Опишите ассортимент и задачу в форме вверху — ответим с ценой, сроком и составом работ. Без обязательств.",
    formLabel: "Заполнить форму",
    calcLabel: "Открыть калькулятор",
    calcHref: resolveRootHref("/calculator", L),
  },
};
