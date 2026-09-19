/**
 * /calculator page copy per locale. Every number is read from
 * `@/constants/pricing`, so the page can never quote a price the
 * calculator doesn't produce.
 */

import type { Locale } from "@/constants/locales";
import { localizePath } from "@/constants/i18n-routes";
import {
  PACKAGES,
  SERVICES,
  formatPackagePrice,
  formatPackageTerm,
  packagePrice,
  servicePrice,
  showsUahHint,
  uahApprox,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import type { FAQItem } from "@/types/faq";
import type { ProseSection } from "@/types/prose";

const DEFAULT: Locale = "uk";

type CalculatorPage = {
  title: string;
  description: string;
  breadcrumbHome: string;
  breadcrumbSelf: string;
  eyebrow: string;
  /** H1; the part in `em` gets the brand gradient. */
  h1: [string, string];
  sub: string;
  stats: { value: string; label: string }[];
  faqHeading: string;
  faq: FAQItem[];
  prose: ProseSection[];
};

export function calculatorPage(l: Locale): CalculatorPage {
  const p = (id: Parameters<typeof formatPackagePrice>[0]) => formatPackagePrice(id, l);
  const t = (id: Parameters<typeof formatPackageTerm>[0]) => formatPackageTerm(id, l);
  const money = (n: number) => formatPrice(n, { locale: l });
  const seo = money(servicePrice("seoServicesFrom", l));
  const uah = (id: "landing" | "business" | "shop") =>
    showsUahHint(l) ? uahApprox(packagePrice(id, l)) : "";
  const custom = formatPrice(packagePrice("custom", l), { locale: l, withPrefix: true });
  const range = `${money(packagePrice("landing", l))}–${money(packagePrice("shop", l))}`;
  const days = `${PACKAGES.landing.days.min}–${PACKAGES.shop.days.min}`;

  if (l === DEFAULT) {
    return {
      title: "Калькулятор вартості сайту — фікс-ціна за 1 хвилину",
      description: `Оберіть пакет і додатки — ціну і строк видно одразу. Лендінг ${p("landing")}, сайт для бізнесу ${p("business")}, магазин ${p("shop")}. Ціна в договорі.`,
      breadcrumbHome: "Головна",
      breadcrumbSelf: "Калькулятор",
      eyebrow: "/ КАЛЬКУЛЯТОР",
      h1: ["Калькулятор сайту: ", "фікс-ціна за 1 хвилину"],
      sub: "Три кроки: пакет, додатки, ціна. Жодних множників і «під запит» — сума, яку ви побачите, піде в договір.",
      stats: [
        { value: range, label: "фіксовані ціни пакетів" },
        { value: days, label: "робочих днів до запуску" },
        { value: "1 рік", label: "гарантія і підтримка в ціні" },
        { value: "0", label: "підписок і абонплат" },
      ],
      faqHeading: "Питання про ціну",
      faq: [
        { q: "Ціна з калькулятора — остаточна?", a: ["Так. Пакет і додатки мають фіксовані ціни, сума з калькулятора йде в договір без змін. Змінитися вона може лише тоді, коли ви самі додасте щось до обсягу."] },
        { q: "Чому строк росте, коли я додаю додатки?", a: ["Кожні три додатки — це приблизно два робочі дні розробки і тестування. Калькулятор додає їх сам. Опція «Терміново» скорочує строк на 40%."] },
        { q: "Що якщо мого варіанту немає в списку?", a: [`Напишіть у коментарі до заявки. Кабінети, складна логіка чи інтеграції з вашими системами — це пакет Custom ${custom}, його рахуємо після розмови.`] },
        { q: "Що входить у ціну крім розробки?", a: [`Хостинг і SSL на рік, гарантія і техпідтримка на рік, базове SEO. Абонплат немає. Просування після запуску — окрема послуга: `, { link: { href: "/seo", text: `SEO від ${seo}/міс` } }] },
      ],
      prose: [
        {
          eyebrow: "СКІЛЬКИ КОШТУЄ",
          heading: ["Ціна сайту: ", "три пакети і фіксовані додатки"],
          sub: "Ціну визначає пакет. Додатки — тільки те, чого в пакеті немає, кожен з фіксованою ціною.",
          paragraphs: [
            `Лендінг — одна сторінка, що продає одну послугу. Сайт для бізнесу — до п'яти сторінок з CMS, яку ви редагуєте самі. Інтернет-магазин — каталог до 100 товарів з оплатою і Новою Поштою.`,
            `У кожен пакет уже входять хостинг і SSL на рік, гарантія на рік і базове SEO. Додаткова сторінка після запуску коштує стільки ж, скільки в калькуляторі, — і робиться за ${SERVICES.newPageDays.min}–${SERVICES.newPageDays.max} робочі дні.`,
          ],
          table: {
            headers: ["Пакет", "Ціна", "У гривнях", "Строк"],
            rows: (["landing", "business", "shop"] as const).map((id) => [PACKAGES[id].name.uk, p(id), uah(id), t(id)]),
          },
          foot: "Гривні — орієнтир за фіксованим курсом, а не котирування. У договорі — сума в доларах.",
          links: [{ label: "прайс з усіма додатками", href: "/pricing" }],
        },
      ],
    };
  }

  if (l === "ru") {
    return {
      title: "Калькулятор стоимости сайта — фикс-цена за 1 минуту",
      description: `Выберите пакет и дополнения — цена и срок видны сразу. Лендинг ${p("landing")}, сайт для бизнеса ${p("business")}, магазин ${p("shop")}. Цена в договоре.`,
      breadcrumbHome: "Главная",
      breadcrumbSelf: "Калькулятор",
      eyebrow: "/ КАЛЬКУЛЯТОР",
      h1: ["Калькулятор сайта: ", "фикс-цена за 1 минуту"],
      sub: "Три шага: пакет, дополнения, цена. Никаких множителей и «по запросу» — сумма, которую вы увидите, пойдёт в договор.",
      stats: [
        { value: range, label: "фиксированные цены пакетов" },
        { value: days, label: "рабочих дней до запуска" },
        { value: "1 год", label: "гарантия и поддержка в цене" },
        { value: "0", label: "подписок и абонплат" },
      ],
      faqHeading: "Вопросы о цене",
      faq: [
        { q: "Цена из калькулятора — окончательная?", a: ["Да. У пакета и дополнений фиксированные цены, сумма из калькулятора идёт в договор без изменений. Измениться она может, только если вы сами добавите что-то в объём."] },
        { q: "Почему срок растёт, когда я добавляю дополнения?", a: ["Каждые три дополнения — это примерно два рабочих дня разработки и тестирования. Калькулятор добавляет их сам. Опция «Срочно» сокращает срок на 40%."] },
        { q: "Что если моего варианта нет в списке?", a: [`Напишите в комментарии к заявке. Кабинеты, сложная логика или интеграции с вашими системами — это пакет Custom ${custom}, его считаем после разговора.`] },
        { q: "Что входит в цену кроме разработки?", a: [`Хостинг и SSL на год, гарантия и техподдержка на год, базовое SEO. Абонплаты нет. Продвижение после запуска — отдельная услуга: `, { link: { href: "/ru/seo", text: `SEO от ${seo}/мес` } }] },
      ],
      prose: [
        {
          eyebrow: "СКОЛЬКО СТОИТ",
          heading: ["Цена сайта: ", "три пакета и фиксированные дополнения"],
          sub: "Цену определяет пакет. Дополнения — только то, чего в пакете нет, у каждого фиксированная цена.",
          paragraphs: [
            "Лендинг — одна страница, которая продаёт одну услугу. Сайт для бизнеса — до пяти страниц с CMS, которую вы редактируете сами. Интернет-магазин — каталог до 100 товаров с оплатой и Новой Почтой.",
            `В каждый пакет уже входят хостинг и SSL на год, гарантия на год и базовое SEO. Новая страница после запуска стоит столько же, сколько в калькуляторе, и делается за ${SERVICES.newPageDays.min}–${SERVICES.newPageDays.max} рабочих дня.`,
          ],
          table: {
            headers: ["Пакет", "Цена", "В гривнах", "Срок"],
            rows: (["landing", "business", "shop"] as const).map((id) => [PACKAGES[id].name.ru, p(id), uah(id), t(id)]),
          },
          foot: "Гривны — ориентир по фиксированному курсу, а не котировка. В договоре — сумма в долларах.",
          links: [{ label: "прайс со всеми дополнениями", href: "/ru/pricing" }],
        },
      ],
    };
  }

  return {
    title: "Website cost calculator — a fixed price in a minute",
    description: `Pick a package and add-ons and see price and timeline at once. Landing page ${p("landing")}, business website ${p("business")}, online shop ${p("shop")}.`,
    breadcrumbHome: "Home",
    breadcrumbSelf: "Calculator",
    eyebrow: "/ CALCULATOR",
    h1: ["Website calculator: ", "a fixed price in a minute"],
    sub: "Three steps: package, add-ons, price. No multipliers, no “price on request” — the figure you see is the figure in the contract.",
    stats: [
      { value: range, label: "fixed package prices" },
      { value: days, label: "business days to launch" },
      { value: "1 year", label: "warranty and support included" },
      { value: "0", label: "subscriptions" },
    ],
    faqHeading: "Questions about price",
    faq: [
      { q: "Is the calculator price final?", a: ["Yes. Packages and add-ons have fixed prices, and the total goes into the contract unchanged. It only changes if you add to the scope yourself."] },
      { q: "Why does the timeline grow when I add add-ons?", a: ["Every three add-ons take roughly two more business days to build and test. The calculator adds them for you. The rush option cuts the timeline by 40%."] },
      { q: "What if my option isn't listed?", a: [`Mention it in the comment. User accounts, complex logic or integrations with your own systems fall under the Custom package ${custom}, quoted after a call.`] },
      { q: "What's included besides the build?", a: ["A year of hosting and SSL, a year of warranty and support, and basic SEO. No subscriptions. Search marketing after launch is a separate service: ", { link: { href: localizePath("/seo", l), text: `SEO from ${seo}/month` } }] },
    ],
    prose: [],
  };
}


