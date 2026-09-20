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
const price = formatPackagePrice("business", L);
const term = formatPackageTerm("business", L);
const days = PACKAGES.business.days.max;
const landing = formatPackagePrice("landing", L);
const shop = formatPackagePrice("shop", L);
const rush = `«${ADDONS.rush.name[L]}» (${formatAddonPrice("rush", L)})`;
const hosting = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });

export const CORPORATE_UK: PackagePageContent = {
  pkg: "business",
  rootPath: "/corporate-site",
  metaTitle: `Сайт для бізнесу за ${price}, ${term} | Code-Site.Art`,
  metaDescription: `Сайт для бізнесу на коді за ${price} і ${term}: до 5 сторінок, Sanity CMS, заявки в Telegram, SEO-структура, хостинг на рік. Код ваш.`,
  breadcrumbHome: "Головна",
  breadcrumbSelf: "Сайт для бізнесу",
  serviceName: "Розробка сайту для бізнесу",
  offerName: "Сайт для бізнесу під ключ",
  eyebrow: "Пакет «Сайт для бізнесу» · найпопулярніше",
  h1: `Сайт для бізнесу за ${price} і ${term}`,
  sub: "До 5 сторінок: головна, послуги, про компанію, кейси, контакти. Тексти й фото змінюєте самі в Sanity CMS, навіть з телефона. Ціна фіксується в договорі.",
  badges: [
    { label: price, sub: "фікс-ціна в договорі" },
    { label: term, sub: "від брифу до запуску" },
    { label: "Sanity CMS", sub: "редагуєте самі" },
    { label: "Гарантія рік", sub: "включена в ціну" },
  ],
  composition: {
    heading: ["Що входить у сайт для бізнесу ", `за ${price}`],
    includesTitle: "Що входить",
    excludesTitle: "Що не входить",
    excludesFoot: `Кошик і оплата товарів — це пакет «Інтернет-магазин» за ${shop}. CRM, онлайн-запис, оплату послуг, другу мову й блог можна додати — див. додатки нижче.`,
  },
  when: {
    heading: ["Коли потрібен сайт — ", "а коли вистачить лендінгу"],
    fitTitle: "Сайт для бізнесу — правильний вибір",
    fit: [
      "Кілька послуг, кожній потрібна своя сторінка",
      "Хочете самі оновлювати тексти, ціни й фото",
      "Потрібен пошуковий трафік, а не лише реклама",
      "Сайт має показати компанію: команда, кейси, відгуки",
    ],
    notFitTitle: "Краще інший пакет",
    notFit: [
      `Одна пропозиція під рекламу — вистачить лендінгу за ${landing}`,
      `Каталог із кошиком і оплатою — інтернет-магазин за ${shop}`,
      "Особистий кабінет, складні інтеграції — Custom",
    ],
  },
  process: {
    heading: ["Як ми робимо сайт ", `за ${term}`],
    sub: "Строк рахуємо від дня, коли отримали бриф і передоплату.",
    steps: [
      { from: 1, title: "Бриф і структура", body: "Погоджуємо сторінки, блоки і тексти. Ви бачите карту сайту в перший же день." },
      { from: 2, to: 3, title: "Дизайн", body: "Макети головної і внутрішніх сторінок під телефон і комп'ютер, правки за вашими коментарями." },
      { from: 4, to: days - 1, title: "Розробка", body: "Верстка, Sanity CMS, форми і Telegram, SEO-структура, Google Analytics і Search Console." },
      { from: days, title: "Тест і запуск", body: "Перевіряємо форми і швидкість, запускаємо на вашому домені і показуємо, як редагувати сайт." },
    ],
  },
  addons: {
    heading: ["Що можна ", "додати до сайту"],
    sub: `Кожен додаток має фіксовану ціну. Потрібно швидше — додаток ${rush}.`,
    calcLabel: "Порахувати в калькуляторі",
    calcHref: "/calculator",
  },
  payment: { heading: ["Умови ", "оплати"] },
  cases: {
    heading: ["Сайти для бізнесу, які ми ", "вже запустили"],
    sub: "Три проєкти з портфоліо. Цифри на картках взяті з кейсів.",
    slugs: ["nbyg-kobenhavn", "efedra-clinic", "webbond"],
    allLabel: "Всі кейси",
    allHref: "/portfolio",
  },
  faq: {
    heading: "Часті питання про сайт для бізнесу",
    items: [
      {
        q: `Що входить у сайт для бізнесу за ${price}?`,
        a: [
          "До 5 сторінок, Sanity CMS, форми із заявками в Telegram, SEO-структура, тексти на основі брифу, Google Analytics і Search Console, хостинг і SSL на рік, гарантія рік. Код і доступи — ваші.",
        ],
      },
      {
        q: "Скільки триває розробка?",
        a: [`${term} від брифу і передоплати. Якщо треба швидше — додаток ${rush}.`],
      },
      {
        q: "Що якщо потрібно більше 5 сторінок?",
        a: [
          `Кожна додаткова сторінка — ${formatAddonPrice("extra_page", L)}. Ціну фіксуємо в договорі до старту.`,
        ],
      },
      {
        q: "Чи зможу я сам редагувати сайт?",
        a: [
          "Так. Sanity CMS працює в браузері і з телефона: тексти, фото, ціни, нові кейси. На запуску покажемо, як це робити.",
        ],
      },
      {
        q: "Чим це відрізняється від лендінгу?",
        a: [
          `Лендінг — одна сторінка під одну дію, без CMS, за ${landing}. Сайт для бізнесу — до 5 сторінок з CMS і SEO-структурою під пошук. Детальніше — `,
          { link: { href: "/landing", text: "сторінка лендінгу" } },
          ".",
        ],
      },
      {
        q: "Що після запуску?",
        a: [
          `Гарантія і підтримка включені на рік. Після року — продовження хостингу ${hosting}/рік або перенос на ваш акаунт.`,
        ],
      },
      {
        q: "Кому належить сайт?",
        a: ["Вам: код, домен, доступи до CMS і аналітики. Підписок і прив'язки до нас немає."],
      },
    ],
  },
  seo: { href: "/seo", linkLabel: "Як працює просування" },
  cta: {
    heading: ["Безкоштовний прорахунок ", "за 24 години"],
    sub: "Опишіть задачу у формі вгорі — відповімо з ціною, строком і складом робіт. Без зобов'язань.",
    formLabel: "Заповнити форму",
    calcLabel: "Відкрити калькулятор",
    calcHref: "/calculator",
  },
  related: {
    heading: "Сайти для бізнесу в нішах — розбори",
    sub: "Що має бути на сайті у вашій ніші і які помилки забирають заявки.",
    links: [
      { label: "сайт готелю з бронюванням", href: "/blog/sait-dlia-hotelyu-z-bronyuvannyam" },
      { label: "сайт турагентства", href: "/blog/sait-dlia-turahentstva" },
      { label: "сайт компанії вантажоперевезень", href: "/blog/sait-dlia-vantazhoperevezen" },
    ],
  },
};
