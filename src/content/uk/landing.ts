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
const price = formatPackagePrice("landing", L);
const term = formatPackageTerm("landing", L);
const days = PACKAGES.landing.days.max;
const business = formatPackagePrice("business", L);
const rush = `«${ADDONS.rush.name[L]}» (${formatAddonPrice("rush", L)})`;
const hosting = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });

export const LANDING_UK: PackagePageContent = {
  pkg: "landing",
  rootPath: "/landing",
  metaTitle: `Лендінг під ключ за ${price}, ${term} | Code-Site.Art`,
  metaDescription: `Лендінг на коді за ${price} і ${term}: дизайн, тексти з брифу, форма з заявками в Telegram, хостинг на рік. Фікс-ціна в договорі, код ваш.`,
  breadcrumbHome: "Головна",
  breadcrumbSelf: "Лендінг",
  serviceName: "Розробка лендінгу",
  offerName: "Лендінг під ключ",
  eyebrow: "Пакет «Лендінг»",
  h1: `Лендінг за ${price} і ${term}`,
  sub: "Одна сторінка під одну дію: оффер, вигоди, відгуки, FAQ і форма. Заявки приходять у Telegram. Ціна фіксується в договорі до старту.",
  badges: [
    { label: price, sub: "фікс-ціна в договорі" },
    { label: term, sub: "від брифу до запуску" },
    { label: "Гарантія рік", sub: "включена в ціну" },
    { label: "Код ваш", sub: "без підписок" },
  ],
  composition: {
    heading: ["Що входить у лендінг ", `за ${price}`],
    includesTitle: "Що входить",
    excludesTitle: "Що не входить",
    excludesFoot: `Потрібні CMS, блог або кілька сторінок — це пакет «Сайт для бізнесу» за ${business}. Мову, CRM, запис і оплату можна додати до лендінгу — див. додатки нижче.`,
  },
  when: {
    heading: ["Коли лендінга достатньо — ", "а коли потрібен сайт"],
    fitTitle: "Лендінг — правильний вибір",
    fit: [
      "Одна послуга чи продукт, на який потрібні заявки",
      "Реклама в Google чи соцмережах веде на окрему сторінку",
      "Запуск нового напряму або перевірка ідеї",
      "Подія, курс, франшиза — рішення ухвалюють на одній сторінці",
    ],
    notFitTitle: "Краще сайт для бізнесу",
    notFit: [
      "Потрібні окремі сторінки під послуги, кейси, контакти",
      "Хочете самі змінювати тексти й фото без розробника",
      "Мета — пошуковий трафік із багатьох запитів",
      "Каталог товарів із кошиком — це інтернет-магазин",
    ],
  },
  process: {
    heading: ["Як ми робимо лендінг ", `за ${term}`],
    sub: "Строк рахуємо від дня, коли отримали бриф і передоплату.",
    steps: [
      { from: 1, title: "Бриф і структура", body: "Розбираємо бриф, погоджуємо блоки сторінки і пишемо тексти." },
      { from: 2, title: "Дизайн", body: "Макет під телефон і комп'ютер. Одна ітерація правок у той самий день." },
      { from: days, title: "Верстка, тест і запуск", body: "Верстаємо, підключаємо форму і Telegram, базове SEO, аналітику. Запускаємо на вашому домені." },
    ],
  },
  addons: {
    heading: ["Що можна ", "додати до лендінгу"],
    sub: `Кожен додаток має фіксовану ціну. Потрібно швидше — додаток ${rush}.`,
    calcLabel: "Порахувати в калькуляторі",
    calcHref: "/calculator",
  },
  payment: { heading: ["Умови ", "оплати"] },
  cases: {
    heading: ["Лендінги, які ми ", "вже запустили"],
    sub: "Онлайн-курс, франшиза, особистий бренд — кожна сторінка під одну дію відвідувача.",
    slugs: ["aleko-course", "tatarka-franchise", "oleksandr-sitnikov"],
    allLabel: "Всі кейси",
    allHref: "/portfolio",
  },
  faq: {
    heading: "Часті питання про лендінг",
    items: [
      {
        q: `Що входить у лендінг за ${price}?`,
        a: [
          "Одна сторінка-лонгрід, адаптив, форма із заявками в Telegram, базове SEO, тексти на основі вашого брифу, хостинг і SSL на рік, гарантія рік. Код і доступи — ваші.",
        ],
      },
      {
        q: "Скільки триває розробка?",
        a: [
          `${term} від брифу і передоплати. Якщо треба швидше — додаток ${rush}.`,
        ],
      },
      {
        q: "Чи вистачить мені лендінга, чи потрібен сайт?",
        a: [
          "Одна пропозиція і одна цільова дія — вистачить лендінга. Окремі сторінки під послуги, кейси, блог — дивіться ",
          { link: { href: "/corporate-site", text: `Сайт для бізнесу за ${business}` } },
          ".",
        ],
      },
      {
        q: "У мене немає текстів. Що робити?",
        a: [
          `Тексти пишемо ми на основі брифу — це входить у ціну. Потрібна глибша робота над текстами — додаток «${ADDONS.copy_pro.name[L]}».`,
        ],
      },
      {
        q: "Чи зможу я потім доростити лендінг до сайту?",
        a: [
          "Так. Сторінки, CMS, блог і мови додаються поверх наявного коду без переписування з нуля.",
        ],
      },
      {
        q: "Що після запуску?",
        a: [
          `Гарантія і підтримка включені на рік. Після року — продовження хостингу ${hosting}/рік або перенос на ваш акаунт.`,
        ],
      },
      {
        q: "Скільки заявок принесе лендінг?",
        a: [
          "Залежить від трафіку. Лендінг перетворює відвідувачів на заявки, але відвідувачів приводить реклама чи соцмережі. Обіцяти кількість заявок ми не будемо.",
        ],
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
    heading: "Лендінги для ніш — розбори",
    sub: "Що має бути на сайті у вашій ніші і які помилки забирають заявки.",
    links: [
      { label: "сайт для психолога", href: "/blog/sait-dlia-psykholoha" },
      { label: "сайт для салону краси", href: "/blog/sait-dlia-salonu-krasy" },
      { label: "сайт фотографа", href: "/blog/sait-dlia-fotohrafa" },
      { label: "сайт ресторану з доставкою", href: "/blog/sait-dlia-restoranu-kafe-dostavky" },
      { label: "сайт фітнес-клубу", href: "/blog/sait-dlia-fitnes-klubu" },
      { label: "сайт кондитера", href: "/blog/sait-dlia-kondytera" },
    ],
  },
};
