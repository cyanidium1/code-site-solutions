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
const LOC = "uk" as const;
const D = PACKAGES.business.days.min;
const DESIGN_DAYS = 2;
const PREPAY = PAYMENT_TERMS.prepaymentPercent;
const PENALTY = `${PAYMENT_TERMS.latePenaltyPercentPerDay}% за кожен день прострочки, до ${PAYMENT_TERMS.latePenaltyCapPercent}%`;
const HOSTING = formatPrice(servicePrice("hostingRenewalPerYear", LOC), { locale: LOC });
const EXTRA_PAGE = formatPrice(addonPrice("extra_page", LOC), { locale: LOC });
const COPY_PRO = formatPrice(addonPrice("copy_pro", LOC), { locale: LOC });
const dayRange = (a: number, b: number) => (a === b ? `День ${a}` : `Дні ${a}–${b}`);

export const PROCESS_STEPS: TimelineStep[] = [
  {
    n: "01",
    title: "Заявка і прорахунок",
    duration: `до ${SERVICES.auditResponseHours} годин · безкоштовно`,
    body: `Заповнюєте форму або пишете в Telegram. Протягом ${SERVICES.auditResponseHours} годин відповідаємо: який пакет підходить, фіксована ціна і строк. Дзвінок — лише якщо він вам потрібен.`,
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Розбираємо задачу, ставимо уточнюючі питання",
        "Підбираємо пакет: лендінг, сайт для бізнесу чи магазин",
        "Називаємо фіксовану ціну і строк у робочих днях",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Описуєте бізнес і що має робити сайт",
        "Даєте 2–3 сайти, які вам подобаються (якщо є)",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Прорахунок: пакет, ціна, строк, що входить",
        "Список додатків, якщо вони потрібні",
      ],
    },
  },
  {
    n: "02",
    title: "Договір і передоплата",
    duration: "до старту",
    body: `Договір із фіксованою сумою, строком і неустойкою: ${PENALTY}. Після передоплати ${PREPAY}% починається відлік робочих днів. Оплата всієї суми наперед — знижка ${PAYMENT_TERMS.fullPrepaymentDiscountPercent}%.`,
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Готуємо договір із фіксованою сумою і строком",
        "Виставляємо рахунок на передоплату",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Перечитуєте договір, ставите питання",
        "Підписуєте через Дія.Підпис або PDF",
        `Вносите ${PREPAY}% передоплати (ФОП-безнал, Stripe, USDT)`,
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Підписаний договір із ціною і строком",
        "Дата запуску в календарі",
      ],
    },
  },
  {
    n: "03",
    title: "Структура, тексти і дизайн",
    duration: `${dayRange(1, DESIGN_DAYS)}`,
    body: "Збираємо структуру сторінок, пишемо тексти на основі брифу і робимо дизайн — для телефона й комп'ютера. Показуємо до початку розробки: ви погоджуєте або даєте правки.",
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Структура сторінок і блоків",
        "Тексти на основі брифу",
        "Дизайн для mobile і desktop",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Погоджуєте структуру, тексти і дизайн",
        "Надсилаєте логотип, фото, контакти",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Погоджений дизайн усіх сторінок",
        "Тексти для всіх сторінок",
      ],
    },
  },
  {
    n: "04",
    title: "Розробка",
    duration: `${dayRange(DESIGN_DAYS + 1, D - 2)}`,
    body: "Пишемо код на Next.js, підключаємо Sanity CMS, форми із заявками в Telegram і аналітику. Тестове посилання працює з першого дня розробки — ви бачите прогрес наживо.",
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Код у вашому GitHub-репозиторії",
        "Sanity CMS — редагуєте без розробника",
        "Форми, заявки в Telegram, Google Analytics",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Дивитесь тестову версію і пишете коментарі в чат",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Тестове посилання на сайт",
        "Доступ до GitHub і CMS",
      ],
    },
  },
  {
    n: "05",
    title: "Тести і правки",
    duration: `${dayRange(D - 1, D - 1)}`,
    body: "Перевіряємо сайт на телефонах і в браузерах: швидкість, форми, метадані, аналітику. Вносимо ваші правки.",
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Тести на iPhone, Android і desktop",
        "Перевірка форм, аналітики, SEO-структури",
        "Правки за вашими коментарями",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Проходите сайт і надсилаєте правки одним списком",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Сайт, готовий до запуску",
      ],
    },
  },
  {
    n: "06",
    title: "Запуск",
    duration: `${dayRange(D, D)}`,
    body: "Підключаємо ваш домен і SSL, налаштовуємо Search Console, переносимо адреси зі старого сайту. Ви вносите решту оплати й отримуєте всі доступи.",
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Домен, SSL, публікація",
        "301-редіректи зі старих адрес",
        "Sitemap у Search Console",
        "Передаємо доступи: хостинг, CMS, GitHub, аналітика",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Вносите решту оплати",
        "Перевіряєте сайт на своєму домені",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Сайт на вашому домені",
        "Усі доступи — на вас",
        "Інструкція, як редагувати сайт у CMS",
      ],
    },
  },
  {
    n: "07",
    title: "Гарантія і підтримка",
    duration: "рік · включено в ціну",
    body: `Рік гарантії, хостингу і підтримки входить у ціну: баги, аптайм, безпека, оновлення, SSL, резервні копії. Після року — хостинг ${HOSTING}/рік або перенос на ваш акаунт.`,
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Виправляємо баги безкоштовно",
        "Оновлюємо залежності, стежимо за безпекою",
        "Хостинг, SSL, резервні копії",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Самі змінюєте тексти, ціни й фото в CMS",
        "Пишете в Telegram, якщо щось не так",
      ],
    },
    deliverable: {
      heading: "Результат",
      items: [
        "Рік підтримки від дня запуску",
        `Нова сторінка після запуску — ${EXTRA_PAGE}`,
      ],
    },
  },
];

export const PROCESS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Що якщо ви зриваєте строк з вашої вини?",
    a: [
      "Платимо неустойку ",
      { em: `${PENALTY}` },
      ". Це прописано в договорі.",
    ],
  },
  {
    q: "Скільки коштують правки?",
    a: [
      "Правки в межах погодженої структури ",
      { em: "входять у ціну і строк" },
      `. Нова сторінка — ${EXTRA_PAGE}, інші додатки — за фіксованим прайсом у `,
      { link: { href: "/calculator", text: "калькуляторі" } },
      ".",
    ],
  },
  {
    q: "Що якщо дизайн мені не подобається?",
    a: [
      "Дизайн показуємо ",
      { em: "до початку розробки" },
      ". Правимо за вашими коментарями, поки не погодите. Якщо через це строк зсувається, нову дату фіксуємо письмово.",
    ],
  },
  {
    q: "Що якщо потрібні зміни після запуску?",
    a: [
      { em: "Рік гарантії і підтримки" },
      ` включено: баги, хостинг, SSL, оновлення. Тексти, ціни й фото змінюєте самі в CMS. Нова сторінка — ${EXTRA_PAGE}, робимо за ${formatDays(SERVICES.newPageDays, LOC)}. Деталі — на сторінці `,
      { link: { href: "/support", text: "Підтримка і гарантія" } },
      ".",
    ],
  },
  {
    q: "Що якщо я хочу змінити обсяг посеред проєкту?",
    a: [
      "Можна. Додатки рахуємо за фіксованим прайсом, новий строк і суму вписуємо в ",
      { em: "додаткову угоду" },
      " до договору.",
    ],
  },
  {
    q: "Що якщо я не маю часу на тексти?",
    a: [
      "Тексти на основі брифу ",
      { em: "входять у пакет" },
      ` — вам треба лише відповісти на питання. Професійний копірайтинг з інтерв'ю — ${COPY_PRO}.`,
    ],
  },
  {
    q: "Що якщо сайт потрібен швидше?",
    a: [
      "Терміновий запуск — ",
      { em: `${formatAddonPrice("rush", LOC)}` },
      ". Скорочений строк фіксуємо в договорі.",
    ],
  },
  {
    q: "Лендінг чи магазин — теж за 7 днів?",
    a: [
      `Лендінг — ${formatPackageTerm("landing", LOC)}, інтернет-магазин — ${formatPackageTerm("shop", LOC)}, галузеве рішення — ${formatPackageTerm("industry", LOC)}. Кроки ті самі, змінюється обсяг.`,
    ],
  },
];
