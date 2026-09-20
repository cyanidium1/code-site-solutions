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
const price = formatPackagePrice("landing", L);
const term = formatPackageTerm("landing", L);
const days = PACKAGES.landing.days.max;
const business = formatPackagePrice("business", L);
const rush = `«${ADDONS.rush.name[L]}» (${formatAddonPrice("rush", L)})`;
const hosting = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });

export const LANDING_RU: PackagePageContent = {
  pkg: "landing",
  rootPath: "/landing",
  metaTitle: `Лендинг под ключ за ${price}, ${term} | Code-Site.Art`,
  metaDescription: `Лендинг на коде за ${price} и ${term}: дизайн, тексты по брифу, форма с заявками в Telegram, хостинг на год. Фикс-цена в договоре, код ваш.`,
  breadcrumbHome: "Главная",
  breadcrumbSelf: "Лендинг",
  serviceName: "Разработка лендинга",
  offerName: "Лендинг под ключ",
  eyebrow: "Пакет «Лендинг»",
  h1: `Лендинг за ${price} и ${term}`,
  sub: "Одна страница под одно действие: оффер, выгоды, отзывы, FAQ и форма. Заявки приходят в Telegram. Цена фиксируется в договоре до старта.",
  badges: [
    { label: price, sub: "фикс-цена в договоре" },
    { label: term, sub: "от брифа до запуска" },
    { label: "Гарантия год", sub: "включена в цену" },
    { label: "Код ваш", sub: "без подписок" },
  ],
  composition: {
    heading: ["Что входит в лендинг ", `за ${price}`],
    includesTitle: "Что входит",
    excludesTitle: "Что не входит",
    excludesFoot: `Нужны CMS, блог или несколько страниц — это пакет «Сайт для бизнеса» за ${business}. Язык, CRM, запись и оплату можно добавить к лендингу — см. дополнения ниже.`,
  },
  when: {
    heading: ["Когда лендинга достаточно — ", "а когда нужен сайт"],
    fitTitle: "Лендинг — правильный выбор",
    fit: [
      "Одна услуга или продукт, на который нужны заявки",
      "Реклама в Google или соцсетях ведёт на отдельную страницу",
      "Запуск нового направления или проверка идеи",
      "Событие, курс, франшиза — решение принимают на одной странице",
    ],
    notFitTitle: "Лучше сайт для бизнеса",
    notFit: [
      "Нужны отдельные страницы под услуги, кейсы, контакты",
      "Хотите сами менять тексты и фото без разработчика",
      "Цель — поисковый трафик по многим запросам",
      "Каталог товаров с корзиной — это интернет-магазин",
    ],
  },
  process: {
    heading: ["Как мы делаем лендинг ", `за ${term}`],
    sub: "Срок считаем со дня, когда получили бриф и предоплату.",
    steps: [
      { from: 1, title: "Бриф и структура", body: "Разбираем бриф, согласовываем блоки страницы и пишем тексты." },
      { from: 2, title: "Дизайн", body: "Макет под телефон и компьютер. Одна итерация правок в тот же день." },
      { from: days, title: "Вёрстка, тест и запуск", body: "Верстаем, подключаем форму и Telegram, базовое SEO, аналитику. Запускаем на вашем домене." },
    ],
  },
  addons: {
    heading: ["Что можно ", "добавить к лендингу"],
    sub: `У каждого дополнения фиксированная цена. Нужно быстрее — дополнение ${rush}.`,
    calcLabel: "Посчитать в калькуляторе",
    calcHref: resolveRootHref("/calculator", L),
  },
  payment: { heading: ["Условия ", "оплаты"] },
  cases: {
    heading: ["Лендинги, которые мы ", "уже запустили"],
    sub: "Онлайн-курс, франшиза, личный бренд — каждая страница под одно действие посетителя.",
    slugs: ["aleko-course", "tatarka-franchise", "oleksandr-sitnikov"],
    allLabel: "Все кейсы",
    allHref: resolveRootHref("/portfolio", L),
  },
  faq: {
    heading: "Частые вопросы о лендинге",
    items: [
      {
        q: `Что входит в лендинг за ${price}?`,
        a: [
          "Одна страница-лонгрид, адаптив, форма с заявками в Telegram, базовое SEO, тексты по вашему брифу, хостинг и SSL на год, гарантия год. Код и доступы — ваши.",
        ],
      },
      {
        q: "Сколько длится разработка?",
        a: [`${term} от брифа и предоплаты. Если нужно быстрее — дополнение ${rush}.`],
      },
      {
        q: "Хватит мне лендинга или нужен сайт?",
        a: [
          "Одно предложение и одно целевое действие — хватит лендинга. Отдельные страницы под услуги, кейсы, блог — смотрите ",
          { link: { href: resolveRootHref("/corporate-site", L), text: `Сайт для бизнеса за ${business}` } },
          ".",
        ],
      },
      {
        q: "У меня нет текстов. Что делать?",
        a: [
          `Тексты пишем мы по брифу — это входит в цену. Нужна более глубокая работа с текстами — дополнение «${ADDONS.copy_pro.name[L]}».`,
        ],
      },
      {
        q: "Смогу ли я потом дорастить лендинг до сайта?",
        a: ["Да. Страницы, CMS, блог и языки добавляются поверх существующего кода без переписывания с нуля."],
      },
      {
        q: "Что после запуска?",
        a: [
          `Гарантия и поддержка включены на год. После года — продление хостинга ${hosting}/год или перенос на ваш аккаунт.`,
        ],
      },
      {
        q: "Сколько заявок принесёт лендинг?",
        a: [
          "Зависит от трафика. Лендинг превращает посетителей в заявки, но посетителей приводит реклама или соцсети. Обещать количество заявок мы не будем.",
        ],
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
    heading: "Лендинги для ниш — разборы",
    sub: "Что должно быть на сайте в вашей нише и какие ошибки забирают заявки.",
    links: [
      { label: "сайт для психолога", href: "/ru/blog/sayt-dlya-psihologa" },
      { label: "сайт для салона красоты", href: "/ru/blog/sayt-dlya-salona-krasoty" },
      { label: "сайт фотографа", href: "/ru/blog/sayt-dlya-fotografa" },
      { label: "сайт ресторана с доставкой", href: "/ru/blog/sayt-dlya-restorana-i-dostavki-edy" },
      { label: "сайт фитнес-клуба", href: "/ru/blog/sayt-fitnes-kluba" },
      { label: "сайт кондитера", href: "/ru/blog/sayt-dlya-konditera" },
    ],
  },
};
