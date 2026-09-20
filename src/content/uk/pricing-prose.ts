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
 * SEO-текст під таблицями /pricing (запити «ціна сайту», «створити сайт
 * ціна»). Переписано 20.09.2026 під productized-модель: ціна = пакет +
 * додатки. Жодних цифр руками — усе з `@/constants/pricing`.
 */

const L = "uk" as const;
const usd = (n: number) => formatPrice(n, { locale: L });

const TYPE_ROWS: [string, PackageId][] = [
  ["Лендінг, односторінковий сайт", "landing"],
  ["Сайт компанії, до 5 сторінок", "business"],
  ["Інтернет-магазин", "shop"],
  ["Сайт під галузь: клініка, юристи, ремонт…", "industry"],
  ["Платформа з кабінетами, веб-додаток", "custom"],
];

export const PRICING_PROSE_UK: ProseSection[] = [
  {
    eyebrow: "ВІД ЧОГО ЗАЛЕЖИТЬ",
    heading: ["Ціна сайту = ", "пакет + додатки"],
    sub: "Гривні — орієнтир за курсом. У договорі сума фіксується до старту.",
    image: {
      src: "/services/phone-calc-uk-v2.webp",
      width: 1000,
      height: 1250,
      alt: "Калькулятор вартості сайту Code-Site.Art на телефоні",
    },
    paragraphs: [
      "Тип сайту визначає пакет, а пакет — базову ціну і строк. Лендінг продає одну послугу на одній сторінці. Сайт для бізнесу розкладає послуги по окремих сторінках. Магазин додає каталог, кошик і оплату.",
      "Далі додаєте тільки те, що потрібно саме вам: ще сторінки, другу мову, блог, CRM, онлайн-запис. Кожен додаток має фіксовану ціну в таблиці вище. Сума пакета і додатків — це і є ціна в договорі. Погодинних доплат немає.",
    ],
    table: {
      headers: ["Тип сайту", "Ціна", "У гривнях", "Строк"],
      rows: TYPE_ROWS.map(([label, id]) => [
        label,
        formatPackagePrice(id, L),
        (PACKAGES[id].fromPrice ? "від " : "") + uahApprox(packagePrice(id, L)),
        formatPackageTerm(id, L),
      ]),
    },
    foot: "Точну суму під вашу конфігурацію дає калькулятор: пакет, додатки, ціна.",
    links: [
      { label: "лендінг під ключ", href: PACKAGES.landing.href },
      { label: "сайт для бізнесу", href: PACKAGES.business.href },
      { label: "створення інтернет-магазину", href: PACKAGES.shop.href },
      { label: "розробка сайтів під ключ", href: "/rozrobka-saitiv" },
      { label: "калькулятор вартості сайту", href: "/calculator" },
    ],
  },
  {
    eyebrow: "ПОЗА РАХУНКОМ",
    heading: ["Що платите ", "не нам"],
    sub: "Кілька невеликих витрат, про які краще знати до старту.",
    paragraphs: [
      "Ціна пакета покриває розробку, хостинг і SSL на перший рік, гарантію і підтримку. Є кілька витрат, які йдуть повз нас. Ми називаємо їх до підпису договору.",
    ],
    bullets: [
      "Домен — оформлюється на вас і оплачується реєстратору щороку",
      `Хостинг з другого року — ${usd(servicePrice("hostingRenewalPerYear", L))}/рік у нас, або переносимо сайт на ваш акаунт`,
      "Комісія платіжного сервісу для магазину — платите провайдеру, не нам",
      "Корпоративна пошта на домені — якщо потрібна",
      `Просування — окремий бюджет, від ${usd(servicePrice("seoServicesFrom", L))}/міс, і лише якщо потрібне`,
    ],
    links: [
      { label: "підтримка і гарантія", href: "/support" },
      { label: "просування сайту", href: "/seo" },
      { label: "порівняння з конструкторами", href: "/vs-constructors" },
    ],
  },
];
