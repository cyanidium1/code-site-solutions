import type { TimelineStep } from "@/components/blocks/vertical-timeline";
import {
  PACKAGES,
  PAYMENT_TERMS,
  SERVICES,
  addonPrice,
  formatAddonPrice,
  formatDays,
  formatPackageTerm,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import type { RichText } from "@/lib/shared/rich-text";

/*
 * Process for the business package, day by day. Every number comes from
 * `@/constants/pricing` (TZ v2): the total term is PACKAGES.business.days,
 * shop/landing/industry follow the same steps on their own terms.
 */
const LOC = "ru" as const;
const D = PACKAGES.business.days.min;
const DESIGN_DAYS = 2;
const PREPAY = PAYMENT_TERMS.prepaymentPercent;
const PENALTY = `${PAYMENT_TERMS.latePenaltyPercentPerDay}% за каждый день просрочки, до ${PAYMENT_TERMS.latePenaltyCapPercent}%`;
const HOSTING = formatPrice(servicePrice("hostingRenewalPerYear", LOC), { locale: LOC });
const EXTRA_PAGE = formatPrice(addonPrice("extra_page", LOC), { locale: LOC });
const COPY_PRO = formatPrice(addonPrice("copy_pro", LOC), { locale: LOC });
const dayRange = (a: number, b: number) => (a === b ? `День ${a}` : `Дни ${a}–${b}`);

export const PROCESS_STEPS: TimelineStep[] = [
  {
    n: "01",
    title: "Заявка и расчет",
    duration: `до ${SERVICES.auditResponseHours} часов · бесплатно`,
    body: `Заполняете форму или пишете в Telegram. В течение ${SERVICES.auditResponseHours} часов отвечаем: какой пакет подходит, фиксированная цена и срок. Звонок — только если он вам нужен.`,
    weDo: {
      heading: "Что делаем мы",
      items: [
        "Разбираем задачу, задаем уточняющие вопросы",
        "Подбираем пакет: лендинг, сайт для бизнеса или магазин",
        "Называем фиксированную цену и срок в рабочих днях",
      ],
    },
    youDo: {
      heading: "Что делаете вы",
      items: [
        "Описываете бизнес и что должен делать сайт",
        "Даете 2–3 сайта, которые вам нравятся (если есть)",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Расчет: пакет, цена, срок, что входит",
        "Список дополнений, если они нужны",
      ],
    },
  },
  {
    n: "02",
    title: "Договор и предоплата",
    duration: "до старта",
    body: `Договор с фиксированной суммой, сроком и неустойкой: ${PENALTY}. После предоплаты ${PREPAY}% начинается отсчет рабочих дней. Оплата всей суммы вперед — скидка ${PAYMENT_TERMS.fullPrepaymentDiscountPercent}%.`,
    weDo: {
      heading: "Что делаем мы",
      items: [
        "Готовим договор с фиксированной суммой и сроком",
        "Выставляем счет на предоплату",
      ],
    },
    youDo: {
      heading: "Что делаете вы",
      items: [
        "Читаете договор, задаете вопросы",
        "Подписываете через Дія.Підпис или PDF",
        `Вносите ${PREPAY}% предоплаты (ФОП-безнал, Stripe, USDT)`,
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Подписанный договор с ценой и сроком",
        "Дата запуска в календаре",
      ],
    },
  },
  {
    n: "03",
    title: "Структура, тексты и дизайн",
    duration: `${dayRange(1, DESIGN_DAYS)}`,
    body: "Собираем структуру страниц, пишем тексты на основе брифа и делаем дизайн — для телефона и компьютера. Показываем до начала разработки: вы согласовываете или даете правки.",
    weDo: {
      heading: "Что делаем мы",
      items: [
        "Структура страниц и блоков",
        "Тексты на основе брифа",
        "Дизайн для mobile и desktop",
      ],
    },
    youDo: {
      heading: "Что делаете вы",
      items: [
        "Согласовываете структуру, тексты и дизайн",
        "Присылаете логотип, фото, контакты",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Согласованный дизайн всех страниц",
        "Тексты для всех страниц",
      ],
    },
  },
  {
    n: "04",
    title: "Разработка",
    duration: `${dayRange(DESIGN_DAYS + 1, D - 2)}`,
    body: "Пишем код на Next.js, подключаем Sanity CMS, формы с заявками в Telegram и аналитику. Тестовая ссылка работает с первого дня разработки — вы видите прогресс вживую.",
    weDo: {
      heading: "Что делаем мы",
      items: [
        "Код в вашем GitHub-репозитории",
        "Sanity CMS — редактируете без разработчика",
        "Формы, заявки в Telegram, Google Analytics",
      ],
    },
    youDo: {
      heading: "Что делаете вы",
      items: [
        "Смотрите тестовую версию и пишете комментарии в чат",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Тестовая ссылка на сайт",
        "Доступ к GitHub и CMS",
      ],
    },
  },
  {
    n: "05",
    title: "Тесты и правки",
    duration: `${dayRange(D - 1, D - 1)}`,
    body: "Проверяем сайт на телефонах и в браузерах: скорость, формы, метаданные, аналитику. Вносим ваши правки.",
    weDo: {
      heading: "Что делаем мы",
      items: [
        "Тесты на iPhone, Android и desktop",
        "Проверка форм, аналитики, SEO-структуры",
        "Правки по вашим комментариям",
      ],
    },
    youDo: {
      heading: "Что делаете вы",
      items: [
        "Проходите сайт и присылаете правки одним списком",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Сайт, готовый к запуску",
      ],
    },
  },
  {
    n: "06",
    title: "Запуск",
    duration: `${dayRange(D, D)}`,
    body: "Подключаем ваш домен и SSL, настраиваем Search Console, переносим адреса со старого сайта. Вы вносите остаток оплаты и получаете все доступы.",
    weDo: {
      heading: "Что делаем мы",
      items: [
        "Домен, SSL, публикация",
        "301-редиректы со старых адресов",
        "Sitemap в Search Console",
        "Передаем доступы: хостинг, CMS, GitHub, аналитика",
      ],
    },
    youDo: {
      heading: "Что делаете вы",
      items: [
        "Вносите остаток оплаты",
        "Проверяете сайт на своем домене",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Сайт на вашем домене",
        "Все доступы — на вас",
        "Инструкция, как редактировать сайт в CMS",
      ],
    },
  },
  {
    n: "07",
    title: "Гарантия и поддержка",
    duration: "год · включено в цену",
    body: `Год гарантии, хостинга и поддержки входит в цену: баги, аптайм, безопасность, обновления, SSL, резервные копии. После года — хостинг ${HOSTING}/год или перенос на ваш аккаунт.`,
    weDo: {
      heading: "Что делаем мы",
      items: [
        "Исправляем баги бесплатно",
        "Обновляем зависимости, следим за безопасностью",
        "Хостинг, SSL, резервные копии",
      ],
    },
    youDo: {
      heading: "Что делаете вы",
      items: [
        "Сами меняете тексты, цены и фото в CMS",
        "Пишете в Telegram, если что-то не так",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Год поддержки со дня запуска",
        `Новая страница после запуска — ${EXTRA_PAGE}`,
      ],
    },
  },
];

export const PROCESS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Что если вы срываете срок по своей вине?",
    a: [
      "Платим неустойку ",
      { em: `${PENALTY}` },
      ". Это прописано в договоре.",
    ],
  },
  {
    q: "Сколько стоят правки?",
    a: [
      "Правки в рамках согласованной структуры ",
      { em: "входят в цену и срок" },
      `. Новая страница — ${EXTRA_PAGE}, другие дополнения — по фиксированному прайсу в `,
      { link: { href: "/ru/calculator", text: "калькуляторе" } },
      ".",
    ],
  },
  {
    q: "Что если дизайн мне не нравится?",
    a: [
      "Дизайн показываем ",
      { em: "до начала разработки" },
      ". Правим по вашим комментариям, пока не согласуете. Если из-за этого срок сдвигается, новую дату фиксируем письменно.",
    ],
  },
  {
    q: "Что если нужны изменения после запуска?",
    a: [
      { em: "Год гарантии и поддержки" },
      ` включен: баги, хостинг, SSL, обновления. Тексты, цены и фото меняете сами в CMS. Новая страница — ${EXTRA_PAGE}, делаем за ${formatDays(SERVICES.newPageDays, LOC)}. Подробности — на странице `,
      { link: { href: "/support", text: "Підтримка і гарантія" } },
      " (на украинском).",
    ],
  },
  {
    q: "Что если я хочу изменить объем посреди проекта?",
    a: [
      "Можно. Дополнения считаем по фиксированному прайсу, новый срок и сумму вписываем в ",
      { em: "дополнительное соглашение" },
      " к договору.",
    ],
  },
  {
    q: "Что если у меня нет времени на тексты?",
    a: [
      "Тексты на основе брифа ",
      { em: "входят в пакет" },
      ` — вам нужно только ответить на вопросы. Профессиональный копирайтинг с интервью — ${COPY_PRO}.`,
    ],
  },
  {
    q: "Что если сайт нужен быстрее?",
    a: [
      "Срочный запуск — ",
      { em: `${formatAddonPrice("rush", LOC)}` },
      ". Сокращенный срок фиксируем в договоре.",
    ],
  },
  {
    q: "Лендинг или магазин — тоже за 7 дней?",
    a: [
      `Лендинг — ${formatPackageTerm("landing", LOC)}, интернет-магазин — ${formatPackageTerm("shop", LOC)}, отраслевое решение — ${formatPackageTerm("industry", LOC)}. Шаги те же, меняется объем.`,
    ],
  },
];
