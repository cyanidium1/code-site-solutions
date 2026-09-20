import type { PackagePageContent } from "@/components/landing-page/types";
import {
  ADDONS,
  PACKAGES,
  formatAddonPrice,
  formatPackagePrice,
  formatPackageTerm,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";

const L = "uk";
const price = formatPackagePrice("shop", L);
const term = formatPackageTerm("shop", L);
const days = PACKAGES.shop.days.max;
const landing = formatPackagePrice("landing", L);
const business = formatPackagePrice("business", L);
const rush = `«${ADDONS.rush.name[L]}» (${formatAddonPrice("rush", L)})`;
const hosting = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });
const usd = (n: number) => formatPrice(n, { locale: L });

/* Subscription-builder comparison (TZ v2 §3.5). The $30–80 range is the
   owner's. TODO(owner): перевірити тариф — at 42 грн/$ the checked entry
   plans are lower (Horoshop Standard 816 грн ≈ $19, Prom ≈ $15–23/міс);
   $30–80 matches Horoshop Pro–B2B (1 728–3 360 грн). */
const SUB = { min: 30, max: 80, months: 36 };

export const ONLINE_STORE_UK: PackagePageContent = {
  pkg: "shop",
  rootPath: "/online-store",
  metaTitle: `Інтернет-магазин за ${price}, ${term} | Code-Site.Art`,
  metaDescription: `Інтернет-магазин на коді за ${price} і ${term}: каталог, кошик, LiqPay або Monobank, Нова Пошта, адмінка. Без підписок і комісій, код ваш.`,
  breadcrumbHome: "Головна",
  breadcrumbSelf: "Інтернет-магазин",
  serviceName: "Розробка інтернет-магазину",
  offerName: "Інтернет-магазин під ключ",
  eyebrow: "Пакет «Інтернет-магазин»",
  h1: `Інтернет-магазин кодом за ${price} і ${term} — без підписок і комісій`,
  sub: "Каталог, кошик, замовлення за 2 кліки, оплата LiqPay або Monobank, Нова Пошта. Товарами керуєте самі в адмінці. Платите один раз — магазин ваш.",
  badges: [
    { label: price, sub: "фікс-ціна в договорі" },
    { label: term, sub: "від брифу до запуску" },
    { label: "0 підписок", sub: "і 0 комісій платформі" },
    { label: "Гарантія рік", sub: "включена в ціну" },
  ],
  composition: {
    heading: ["Що входить у магазин ", `за ${price}`],
    includesTitle: "Що входить",
    excludesTitle: "Що не входить",
    excludesFoot: `Більше товарів — додатки «${ADDONS.sku_500.name[L]}» (${formatAddonPrice("sku_500", L)}) і «${ADDONS.sku_1000.name[L]}» (${formatAddonPrice("sku_1000", L)}). Фільтри, CRM і друга мова — див. додатки нижче.`,
  },
  when: {
    heading: ["Коли потрібен магазин — ", "а коли ні"],
    fitTitle: "Магазин — правильний вибір",
    fit: [
      "Каталог, який покупець гортає і замовляє сам",
      "Замовлення мають падати в Telegram, а не губитися в Direct",
      "Комісії й підписки платформ з'їдають маржу",
      "Потрібна оплата онлайн і доставка Новою Поштою",
    ],
    notFitTitle: "Краще інший пакет",
    notFit: [
      `1–3 товари чи інфопродукт — лендінг за ${landing} з додатком оплати`,
      `Послуги без каталогу — сайт для бізнесу за ${business}`,
      "Маркетплейс із продавцями і складом — Custom",
    ],
  },
  process: {
    heading: ["Як ми робимо магазин ", `за ${term}`],
    sub: "Строк рахуємо від дня, коли отримали бриф, передоплату і список товарів.",
    steps: [
      { from: 1, to: 2, title: "Бриф і структура каталогу", body: "Категорії, характеристики товарів, доставка й оплата. Погоджуємо карту магазину." },
      { from: 3, to: 5, title: "Дизайн", body: "Головна, категорія, картка товару, кошик — під телефон і комп'ютер." },
      { from: 6, to: days - 2, title: "Розробка", body: "Каталог, кошик, LiqPay або Monobank, Нова Пошта, адмінка Sanity, SEO категорій, сповіщення в Telegram." },
      { from: days - 1, to: days, title: "Тест і запуск", body: "Тестові замовлення й оплати, перевірка швидкості. Запуск і навчання роботі з адмінкою." },
    ],
  },
  compare: {
    heading: ["Код чи конструктор: ", "що дешевше за 3 роки"],
    sub: "Horoshop, Shop-Express, Prom — щомісячна плата, поки магазин працює. Наш магазин — один платіж.",
    theirsTitle: "Конструктор або маркетплейс",
    theirsLine: `Підписка ${usd(SUB.min)}–${SUB.max}/міс × ${SUB.months} міс = ${usd(SUB.min * SUB.months)}–${usd(SUB.max * SUB.months).replace("$", "")} і магазин не ваш`,
    theirsRows: [
      { name: "Horoshop (Standard–Pro, оплата за рік)", price: "816–1 728 грн/міс" },
      { name: "Prom.ua (пакети «Prom мікс 1 000» — «Prom топ»)", price: "7 500–11 500 грн/рік" },
      // TODO(owner): перевірити тариф Shop-Express і вписати ціну.
      { name: "Shop-Express", price: "щомісячна підписка" },
    ],
    theirsPoints: [
      "Платите, поки магазин працює",
      "Дизайн і SEO — у межах можливостей платформи",
      "Переїзд на іншу платформу — фактично новий магазин",
    ],
    oursTitle: "Code-Site.Art",
    oursLine: `${price} один раз, код і база ваші`,
    oursPoints: [
      "0 підписок і 0 комісій платформі",
      "Код і база товарів ваші — можна перенести куди завгодно",
      `Хостинг і SSL на рік включені; далі — ${hosting}/рік або ваш акаунт`,
      "Гарантія і підтримка рік включені",
    ],
    checked: "Тарифи Horoshop і Prom — з публічних сторінок платформ, перевірено 20.09.2026",
  },
  addons: {
    heading: ["Що можна ", "додати до магазину"],
    sub: `Кожен додаток має фіксовану ціну. Потрібно швидше — додаток ${rush}.`,
    calcLabel: "Порахувати в калькуляторі",
    calcHref: "/calculator",
  },
  payment: { heading: ["Умови ", "оплати"] },
  cases: {
    heading: ["Магазини, які ми ", "вже запустили"],
    sub: "Книжкове видавництво, електроніка, косметика. Цифри на картках взяті з кейсів.",
    slugs: ["glimmer", "kondor-device", "le-muse-nature"],
    allLabel: "Всі кейси",
    allHref: "/portfolio",
  },
  faq: {
    heading: "Часті питання про інтернет-магазин",
    items: [
      {
        q: `Що входить у магазин за ${price}?`,
        a: [
          "Каталог до 100 товарів, картки з варіантами, кошик, замовлення за 2 кліки, оплата LiqPay або Monobank, Нова Пошта, адмінка Sanity, SEO категорій, сповіщення про замовлення в Telegram, хостинг і SSL на рік, гарантія рік.",
        ],
      },
      {
        q: "Скільки триває розробка?",
        a: [`${term} від брифу і передоплати. Якщо треба швидше — додаток ${rush}.`],
      },
      {
        q: "У мене більше 100 товарів. Скільки це коштує?",
        a: [
          `${ADDONS.sku_500.name[L]} — ${formatAddonPrice("sku_500", L)}. ${ADDONS.sku_1000.name[L]} — ${formatAddonPrice("sku_1000", L)}. Ціну фіксуємо в договорі до старту.`,
        ],
      },
      {
        q: "Чому не Horoshop, Shop-Express чи Prom?",
        a: [
          "Там щомісячна підписка, поки магазин працює, а дизайн і SEO обмежені платформою. Тут — один платіж, код і база ваші. Детальніше — ",
          { link: { href: "/vs-constructors", text: "код проти конструктора" } },
          ".",
        ],
      },
      {
        q: "Чи є комісія з продажів?",
        a: [
          "Нам — ні. Платіжні сервіси (LiqPay, Monobank) беруть свою комісію за еквайринг за своїми тарифами.",
        ],
      },
      {
        q: "Хто додає товари?",
        a: [
          `Ви, в адмінці Sanity — з комп'ютера або телефона. На запуску покажемо, як це робити. Імпорт з Excel входить у додаток «${ADDONS.sku_1000.name[L]}».`,
        ],
      },
      {
        q: "Що після запуску?",
        a: [
          `Гарантія і підтримка включені на рік. Після року — продовження хостингу ${hosting}/рік або перенос на ваш акаунт.`,
        ],
      },
    ],
  },
  seo: {
    href: "/seo",
    linkLabel: "Як працює просування магазину",
    line: `Після запуску: просування магазину від ${usd(servicePrice("seoShopFrom", L))}/міс`,
  },
  cta: {
    heading: ["Безкоштовний прорахунок ", "за 24 години"],
    sub: "Опишіть асортимент і задачу у формі вгорі — відповімо з ціною, строком і складом робіт. Без зобов'язань.",
    formLabel: "Заповнити форму",
    calcLabel: "Відкрити калькулятор",
    calcHref: "/calculator",
  },
};
