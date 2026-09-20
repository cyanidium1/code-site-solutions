import type { ProseSection } from "@/types/prose";
import {
  PACKAGES,
  formatPackagePrice,
  formatPackageTerm,
  packagePrice,
  servicePrice,
  uahApprox,
  type PackageId,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";

/**
 * SEO-текст под таблицами /ru/pricing. Переписан 20.09.2026 под
 * productized-модель: цена = пакет + дополнения. Цифры — из `@/constants/pricing`.
 */

const L = "ru" as const;
const usd = (n: number) => formatPrice(n, { locale: L });

const TYPE_ROWS: [string, PackageId][] = [
  ["Лендинг, одностраничный сайт", "landing"],
  ["Сайт компании, до 5 страниц", "business"],
  ["Интернет-магазин", "shop"],
  ["Сайт под отрасль: клиника, юристы, ремонт…", "industry"],
  ["Платформа с кабинетами, веб-приложение", "custom"],
];

/** Package hrefs in the config are uk paths. */
const ru = (href: string) => `/ru${href}`;

export const PRICING_PROSE_RU: ProseSection[] = [
  {
    eyebrow: "ОТ ЧЕГО ЗАВИСИТ",
    heading: ["Цена сайта = ", "пакет + дополнения"],
    sub: "Гривны — ориентир по курсу. В договоре сумма фиксируется до старта.",
    image: {
      src: "/services/phone-calc-uk-v2.webp",
      width: 1000,
      height: 1250,
      alt: "Калькулятор стоимости сайта Code-Site.Art на телефоне",
    },
    paragraphs: [
      "Тип сайта определяет пакет, а пакет — базовую цену и срок. Лендинг продаёт одну услугу на одной странице. Сайт для бизнеса раскладывает услуги по отдельным страницам. Магазин добавляет каталог, корзину и оплату.",
      "Дальше добавляете только то, что нужно вам: ещё страницы, второй язык, блог, CRM, онлайн-запись. У каждого дополнения фиксированная цена в таблице выше. Сумма пакета и дополнений — это и есть цена в договоре. Почасовых доплат нет.",
    ],
    table: {
      headers: ["Тип сайта", "Цена", "В гривнах", "Срок"],
      rows: TYPE_ROWS.map(([label, id]) => [
        label,
        formatPackagePrice(id, L),
        (PACKAGES[id].fromPrice ? "от " : "") + uahApprox(packagePrice(id, L)),
        formatPackageTerm(id, L),
      ]),
    },
    foot: "Точную сумму под вашу конфигурацию даёт калькулятор: пакет, дополнения, цена.",
    links: [
      { label: "лендинг под ключ", href: ru(PACKAGES.landing.href) },
      { label: "сайт для бизнеса", href: ru(PACKAGES.business.href) },
      { label: "создание интернет-магазина", href: ru(PACKAGES.shop.href) },
      { label: "разработка сайтов под ключ", href: "/ru/rozrobka-saitiv" },
      { label: "калькулятор стоимости сайта", href: "/ru/calculator" },
    ],
  },
  {
    eyebrow: "ВНЕ СЧЁТА",
    heading: ["Что платите ", "не нам"],
    sub: "Несколько небольших расходов, о которых лучше знать до старта.",
    paragraphs: [
      "Цена пакета покрывает разработку, хостинг и SSL на первый год, гарантию и поддержку. Есть несколько расходов, которые идут мимо нас. Мы называем их до подписания договора.",
    ],
    bullets: [
      "Домен — оформляется на вас и оплачивается регистратору ежегодно",
      `Хостинг со второго года — ${usd(servicePrice("hostingRenewalPerYear", L))}/год у нас, или переносим сайт на ваш аккаунт`,
      "Комиссия платёжного сервиса для магазина — платите провайдеру, не нам",
      "Корпоративная почта на домене — если нужна",
      `Продвижение — отдельный бюджет, от ${usd(servicePrice("seoServicesFrom", L))}/мес, и только если нужно`,
    ],
    links: [{ label: "продвижение сайта", href: "/ru/seo" }],
  },
];
