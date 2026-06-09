/**
 * Content type and locale data for the vs-wordpress comparison page.
 * Types and data live together since the type is page-specific and not
 * shared with vs-constructors or vs-freelancers (their Content shapes diverge).
 */

import type * as React from "react";
import { Calendar, Gauge, Mail, MessageCircle, Palette, Plug, Server, ShieldAlert, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TierProps } from "@/types/pricing";
import { formatPrice } from "@/lib/shared/format-price";

/* ─── Content shape ─────────────────────────────────────────────────────── */

export type Cost = {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
  metric: string;
};

export type SeoCard = { title: string; body: React.ReactNode };

export type ProcessStep = {
  num: string;
  title: string;
  duration: string;
  body: string;
};

export type DontDo = { title: string; body: React.ReactNode };

export type CompareRow = { criterion: string; wp: string; us: string };

export type Content = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrowLabel: string;
    h1Lines: React.ReactNode[];
    lede: React.ReactNode;
    badges: { label: string; sub: string }[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  costs: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    items: Cost[];
    foot: React.ReactNode;
  };
  compare: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    headers: { criterion: string; wp: string; us: string };
    rows: CompareRow[];
  };
  caseStudy: {
    eyebrow: string;
    heading: React.ReactNode;
    subEyebrow: string;
    beforeLabel: string;
    afterLabel: string;
    before: { label: string; value: React.ReactNode }[];
    after: { label: string; value: React.ReactNode; lift?: string }[];
    quote: React.ReactNode;
    quoteAuthor: string;
    cta: string;
    ctaHref: string;
  };
  seo: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    cards: SeoCard[];
    closing: string;
  };
  admin: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    compareHeaders: { activity: string; wp: string; us: string };
    compareRows: { activity: string; wp: string; us: string }[];
    capabilitiesHeading: string;
    capabilities: { num: string; title: string; body: string }[];
    foot: React.ReactNode;
  };
  process: {
    eyebrow: string;
    heading: React.ReactNode;
    steps: ProcessStep[];
  };
  filter: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    items: DontDo[];
    foot: string;
  };
  pricing: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    tiers: TierProps[];
    foot: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  faq: {
    eyebrow: string;
    heading: React.ReactNode;
    items: { q: string; a: string }[];
  };
  cta: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    cards: {
      icon: LucideIcon;
      title: string;
      body: string;
      cta: string;
      href: string;
      featured?: boolean;
    }[];
  };
};

/* ─── UA copy ───────────────────────────────────────────────────────────── */

export const VS_WORDPRESS_UK: Content = {
  metaTitle:
    "Перейти з WordPress на custom code за 4 тижні · 0 SEO-падінь | Code-Site.Art",
  metaDescription:
    "Мігруємо сайти з WordPress на Next.js за 4–10 тижнів. 47 проєктів — 0 SEO-падінь. Від $1 000 за лендінг. Гарантія 1 рік + неустойка 30%.",
  hero: {
    eyebrowLabel: "/ ПОРІВНЯННЯ · WORDPRESS",
    h1Lines: [
      <>WordPress був правий у 2015.</>,
      <em key="hero-em">Не у 2026.</em>,
    ],
    lede: (
      <>
        Мігруємо ваш сайт з WordPress на custom code за 4 тижні.
        Зберігаємо кожну позицію в Google. 47 проєктів — 0 SEO-падінь.
        Без втрати контенту, коментарів і медіа.
      </>
    ),
    badges: [
      { label: "0 SEO-падінь", sub: "на 47 проєктах" },
      { label: "4 тижні", sub: "від брифу до перенесення" },
      { label: "Гарантія 1 рік", sub: "+ неустойка 30% за зрив" },
      { label: "Від $1 000", sub: "за міграцію лендінга" },
    ],
    ctaPrimary: "Розрахувати міграцію",
    ctaSecondary: "Подивитись як ми мігруємо",
  },
  costs: {
    eyebrow: "/ 02 ПРИХОВАНІ ВИТРАТИ",
    heading: (
      <>
        Скільки насправді коштує <em>сайт на WordPress.</em>
      </>
    ),
    sub: "Хостинг — це лише верхівка. Ось що ви платите щомісяця, навіть якщо не помічаєте:",
    items: [
      {
        num: "01",
        icon: Plug,
        title: "Плагіни",
        body: "Yoast Premium, Wordfence, кешування, форми, бекапи. Кожен плагін — підписка, оновлення, потенційна вразливість.",
        metric: "$50–150/міс",
      },
      {
        num: "02",
        icon: Server,
        title: "Хостинг + CDN",
        body: "WP-оптимізований хостинг (Kinsta, WP Engine) — від $30/міс. Дешевий хостинг = повільний сайт.",
        metric: "$30–200/міс",
      },
      {
        num: "03",
        icon: ShieldAlert,
        title: "Безпека",
        body: "WordPress = улюблена ціль зловмисників. Брутфорс, XSS, plugin-вразливості. Без щомісячного аудиту — питання часу.",
        metric: "1 атака = $500–5 000",
      },
      {
        num: "04",
        icon: Gauge,
        title: "Швидкість",
        body: "Типовий WP-сайт: LCP 3–5 секунд. Google карає в видачі, користувач — закриває вкладку.",
        metric: "−20% conversion",
      },
      {
        num: "05",
        icon: Palette,
        title: "Ліцензії тем",
        body: "Преміум-теми Avada, Divi, Astra Pro — щорічна підписка. Перестали платити — вимикається підтримка.",
        metric: "$60–200/рік",
      },
      {
        num: "06",
        icon: Wrench,
        title: "Розробник",
        body: "Кожна правка — або сам в Elementor (ризик зламати), або дзвінок розробнику ($30–80 за годину).",
        metric: "$200–800/міс",
      },
    ],
    foot: (
      <>
        Сума на 36 місяців володіння — від $5 000 до $20 000{" "}
        <strong>на додачу</strong> до вартості розробки. У нас один платіж і
        нуль підписок.
      </>
    ),
  },
  compare: {
    eyebrow: "/ 03 ПОРІВНЯННЯ",
    heading: (
      <>
        WordPress vs Code-Site. <em>Чесно.</em>
      </>
    ),
    sub: "Без перекручувань. Те, що зустрічаємо щодня на 47 проєктах.",
    headers: { criterion: "Критерій", wp: "WordPress", us: "Code-Site" },
    rows: [
      {
        criterion: "Швидкість завантаження",
        wp: "LCP 3–5 секунд",
        us: "LCP < 1 секунди",
      },
      {
        criterion: "Місячні витрати",
        wp: "$50–200 (плагіни + хостинг + підтримка)",
        us: "$0–20 (тільки Vercel/Cloudflare)",
      },
      {
        criterion: "Безпека",
        wp: "щотижневі патчі, ризик зламу",
        us: "нема attack surface — статичний код",
      },
      {
        criterion: "Редагування контенту",
        wp: "Gutenberg / Elementor — заплутано, ламається",
        us: "Sanity Studio — редагуєте з телефону",
      },
      {
        criterion: "Кастом-фіча",
        wp: "«знайдіть плагін або наймайте розробника»",
        us: "вписана в брифі, реалізована в коді",
      },
      {
        criterion: "Власність коду",
        wp: "спільна, тема-залежна",
        us: "ваша. У вашому GitHub з першого коміту",
      },
      {
        criterion: "Час запуску",
        wp: "2–4 місяці зі студією",
        us: "4–10 тижнів",
      },
      {
        criterion: "Перенесення на інший стек",
        wp: "дуже болюче",
        us: "можливе — Next.js портується на будь-яку інфру",
      },
      {
        criterion: "SEO-можливості",
        wp: "Yoast + чужі плагіни",
        us: "schema.org + sitemaps + Core Web Vitals налаштовані вручну",
      },
    ],
  },
  caseStudy: {
    eyebrow: "/ 04 РЕАЛЬНА МІГРАЦІЯ",
    heading: (
      <>
        NBYG København. <em>З WordPress на Next.js за 6 тижнів.</em>
      </>
    ),
    subEyebrow: "Будівельна компанія · Копенгаген + Борнгольм, Данія · 2024",
    beforeLabel: "До міграції (на WordPress)",
    afterLabel: "Після (60 днів на Next.js)",
    before: [
      { label: "LCP", value: "~4.5 секунди" },
      { label: "Заявок/міс", value: "3" },
      {
        label: "Локальний пошук",
        value: "2-га сторінка Google за «byggefirma Bornholm»",
      },
      { label: "Місячні витрати", value: "~$110 (хостинг + плагіни)" },
    ],
    after: [
      { label: "LCP", value: "0.8 секунди", lift: "×5 швидше" },
      { label: "Заявок/міс", value: "24", lift: "×8" },
      {
        label: "Локальний пошук",
        value: "№1",
        lift: "×6 органічного трафіку",
      },
      { label: "Місячні витрати", value: "$0", lift: "Vercel hobby tier" },
    ],
    quote: (
      <>
        Будівництво на Борнгольмі — щільна ніша. Боялись втратити навіть ту
        мізерну видачу, що мали. Через 30 днів після переходу трафік не впав,
        через 60 — стали №1. З 3 заявок на місяць вийшли на 24 в перший же місяць. Команда написала контент, провела QA,
        запустила. Ми просто отримали ключі.
      </>
    ),
    quoteAuthor: "Owner, NBYG København Aps",
    cta: "Подивитись повний кейс",
    ctaHref: "/portfolio/nbyg-kobenhavn",
  },
  seo: {
    eyebrow: "/ 05 SEO-АНКСІЯ",
    heading: (
      <>
        «А що буде з моїм SEO?» <em>Нічого. Усе залишається.</em>
      </>
    ),
    sub: "Це питання №1, яке нам ставлять. Ось чесна відповідь:",
    cards: [
      {
        title: "47 проєктів · 0 падінь",
        body: (
          <>
            Ми мігрували 47 сайтів з WordPress (та інших платформ). Жоден не
            втратив позиції більш ніж на тиждень. У більшості випадків
            позиції зростали через 30–60 днів — швидший сайт = краще
            ранжування.
          </>
        ),
      },
      {
        title: "301-редіректи від кожної URL",
        body: (
          <>
            Усі ваші старі URL → нові. Без винятків. Робимо мапу редіректів до
            запуску, ви її затверджуєте, ми виливаємо. Google розуміє переїзд
            за 7–14 днів.
          </>
        ),
      },
      {
        title: "Schema.org та Open Graph переносимо",
        body: (
          <>
            Ваша поточна розмітка (Article, Organization, BreadcrumbList)
            переноситься 1-в-1. Зазвичай <strong>покращуємо</strong> її —
            додаємо те, що Yoast пропустив.
          </>
        ),
      },
      {
        title: "Метаконтент і H1/H2 — ваші",
        body: (
          <>
            Не торкаємось текстів сторінок без вашого схвалення. Title,
            description, заголовки — переносимо як є. Якщо хочете оновити —
            окрема сесія копірайтингу.
          </>
        ),
      },
    ],
    closing:
      "Перші 30 днів після запуску ми моніторимо ваш Search Console щодня. Якщо щось іде не так — фіксимо в той самий день. Це включено в гарантію.",
  },
  admin: {
    eyebrow: "/ 06 АДМІНКА",
    heading: (
      <>
        Sanity Studio. <em>Адмінка, з якою працюєш — а не воюєш.</em>
      </>
    ),
    sub: "Найчастіший страх перед міграцією — «а як я буду редагувати без WordPress?». Sanity не схожий на WP. Він кращий: drag-and-drop блоки, які не ламають верстку; повноцінне редагування з телефона; мовність і SEO «з коробки» — без жодного плагіна.",
    compareHeaders: { activity: "Що робите щодня", wp: "WordPress", us: "Sanity Studio" },
    compareRows: [
      {
        activity: "Drag-and-drop блоки",
        wp: "через Gutenberg / Elementor — конфлікти з темою",
        us: "вбудовано, типізовано — верстку не зламати",
      },
      {
        activity: "Редагування з телефона",
        wp: "теоретично існує, на практиці — біль",
        us: "повноцінне, як з компʼютера",
      },
      {
        activity: "Створити нову сторінку",
        wp: "через CMS, але стережись шаблонів",
        us: "один клік, шаблон вже задано",
      },
      {
        activity: "Створити новий тип блоку",
        wp: "потрібен PHP-розробник або плагін",
        us: "drag-and-drop, без коду",
      },
      {
        activity: "Мультимовність",
        wp: "плагін WPML, $99/рік",
        us: "вбудовано, безкоштовно",
      },
      {
        activity: "SEO (title, meta, OG, schema)",
        wp: "Yoast Premium, $99/рік",
        us: "поля в кожному документі, безкоштовно",
      },
      {
        activity: "Real-time співпраця",
        wp: "відсутня (тільки запис-блокування)",
        us: "як Google Docs — кілька осіб одночасно",
      },
      {
        activity: "Історія версій",
        wp: "базова, тільки на платних хостингах",
        us: "повна, відкат у 1 клік",
      },
      {
        activity: "Оновлення безпеки",
        wp: "щотижня — ризик зламати сайт",
        us: "хостимо ми, ви нічого не оновлюєте",
      },
      {
        activity: "Ціна для команди до 5 осіб",
        wp: "$30+/міс хостинг + плагіни",
        us: "$0",
      },
    ],
    capabilitiesHeading: "6 речей, які робите без розробника",
    capabilities: [
      {
        num: "01",
        title: "Drag-and-drop блоки",
        body: "Тягнете секції на сторінку — текст, зображення, форма, відгуки, FAQ. Кожен блок має правила, тому верстку не зламаєте.",
      },
      {
        num: "02",
        title: "Працює з телефона",
        body: "Реально працює. Не «адаптивна версія для аварії» — повноцінне редагування з мобільного. Прочитали відгук від клієнта на ходу — публікуєте до того, як дійшли до офісу.",
      },
      {
        num: "03",
        title: "Створюєте нові сторінки самі",
        body: "Без розробника. Натиснули «новий запис», обрали шаблон, заповнили поля, опублікували. 5 хвилин.",
      },
      {
        num: "04",
        title: "Мультимовність вбудована",
        body: "Кожне поле має українську і англійську версії. Перекладаєте тут — рендериться там. Без плагінів, без додаткової оплати.",
      },
      {
        num: "05",
        title: "SEO без Yoast",
        body: "Кожна сторінка має поля title, meta-description, OG-image, canonical, schema.org. Заповнили — Google бачить.",
      },
      {
        num: "06",
        title: "Безкоштовно для команди до 5 осіб",
        body: "Маркетолог + асистент + копірайтер + редактор + ви — нуль доларів на місяць. Платний тариф починається з 6-ї людини.",
      },
    ],
    foot: (
      <>
        <strong>Sanity Studio — open-source.</strong> Якщо вирішите піти від
        нас через 5 років — Studio залишається у вас, контент експортується в
        JSON, мігруєте куди хочете. Ніякого вендор-лок-іна.
      </>
    ),
  },
  process: {
    eyebrow: "/ 07 ПРОЦЕС МІГРАЦІЇ",
    heading: (
      <>
        Як це відбувається. <em>5 кроків.</em>
      </>
    ),
    steps: [
      {
        num: "01",
        title: "Аудит",
        duration: "2 дні · безкоштовно",
        body: "Дивимось ваш WP: сторінки, плагіни, інтеграції, SEO-стан. Складаємо мапу того, що переноситься.",
      },
      {
        num: "02",
        title: "План + редіректи",
        duration: "1 тиждень",
        body: "Мапа 301-редіректів. Wireframes нової структури. Ви підтверджуєте — ідемо в розробку.",
      },
      {
        num: "03",
        title: "Розробка",
        duration: "2–4 тижні",
        body: "Custom code на Next.js. Контент імпортуємо з WP. Тиждень — демо.",
      },
      {
        num: "04",
        title: "SEO-міст",
        duration: "запуск тижня",
        body: "Налаштування 301, Search Console, Analytics, schema.org. Передзапускний QA.",
      },
      {
        num: "05",
        title: "Запуск + моніторинг",
        duration: "день перемикання + 30 днів",
        body: "DNS-перемикання. Перші 30 днів — щоденний моніторинг позицій і трафіку.",
      },
    ],
  },
  filter: {
    eyebrow: "/ 08 ЧЕСНО",
    heading: (
      <>
        Чого ми <em>не робимо.</em>
      </>
    ),
    sub: "Не для всіх WP-сайтів є сенс іти до нас. Ось коли ми скажемо «ні»:",
    items: [
      {
        title: "Сайти на WooCommerce з 5 000+ SKU",
        body: "Для таких краще Shopify або custom e-commerce рішення на $20k+.",
      },
      {
        title: "Multi-site мережі (WP-Multisite)",
        body: "Це окрема архітектура, не наш профіль.",
      },
      {
        title: "Сайти з кастом-плагінами, написаними під вас",
        body: "Якщо ваш бізнес залежить від PHP-логіки, переписувати її на TypeScript — окремий проект, скажемо чесно.",
      },
    ],
    foot: "Якщо ваш кейс не з цього списку — пишіть. На безкоштовному 30-хв розборі скажемо, чи маємо сенс ми, чи варто шукати іншого виконавця.",
  },
  pricing: {
    eyebrow: "/ 09 ВАРТІСТЬ МІГРАЦІЇ",
    heading: (
      <>
        Скільки коштує <em>піти з WordPress.</em>
      </>
    ),
    sub: "Те ж правило, що й скрізь у нас: ціна в брифі, без «під запит».",
    tiers: [
      {
        name: "Лендінг-міграція",
        price: formatPrice(1000, { locale: "uk" }),
        weeks: "1–2 тижні",
        includes: {
          heading: "Для кого",
          items: [
            "Один сайт-візитка / лендінг",
            "До 5 сторінок",
            "Без блогу",
            "301-редіректи + перенесення медіа",
            "30-денний моніторинг",
          ],
        },
        ctaLabel: "Розрахувати лендінг",
      },
      {
        popular: true,
        popularLabel: "★ НАЙПОПУЛЯРНІШЕ",
        name: "Сайт-міграція",
        price: formatPrice(3500, { locale: "uk" }),
        weeks: "4–8 тижнів",
        includes: {
          heading: "Все з лендінгу +",
          items: [
            "До 30 сторінок",
            "CMS, блог, інтеграції форм",
            "Перенесення коментарів і медіа-бібліотеки",
            "Schema.org + Open Graph апгрейд",
            "Більшість клієнтів сюди",
          ],
        },
        ctaLabel: "Розрахувати сайт",
      },
      {
        name: "Складна міграція",
        price: formatPrice(5000, { locale: "uk" }),
        weeks: "6–10 тижнів",
        includes: {
          heading: "Все з сайту +",
          items: [
            "E-commerce до 5k SKU",
            "Мульти-мовність",
            "Custom API",
            "Складна SEO-структура",
            "Dedicated team",
          ],
        },
        ctaLabel: "Обговорити складну",
        ctaGhost: true,
      },
    ],
    foot: "Усі тири включають: 301-редіректи, перенесення контенту і медіа, schema.org, 30-денний пост-лонч моніторинг, гарантію 1 рік.",
    ctaPrimary: "Розрахувати міграцію",
    ctaSecondary: "Поговорити зі спеціалістом",
  },
  faq: {
    eyebrow: "/ 10 ЧАСТІ ПИТАННЯ",
    heading: (
      <>
        Що питають <em>найчастіше.</em>
      </>
    ),
    items: [
      {
        q: "Чи я втрачу позиції в Google після міграції?",
        a: "Ні. 47 проєктів — 0 падінь більше ніж на тиждень. Робимо повну мапу 301-редіректів і моніторимо Search Console щодня перші 30 днів.",
      },
      {
        q: "Що буде з моїм блогом і коментарями?",
        a: "Усі статті переносимо. Коментарі — за домовленістю: можемо перенести в Disqus/native або залишити як є на старому домені.",
      },
      {
        q: "А моя медіа-бібліотека (фото, PDF)?",
        a: "Переносимо як є. Зберігаємо структуру URL — /wp-content/uploads/... редіректиться на нову структуру.",
      },
      {
        q: "Чи зможу я редагувати контент сам?",
        a: "Так. Sanity Studio — як WordPress, але швидше і не ламається. Працює з телефона. Безкоштовний для команди до 5 осіб.",
      },
      {
        q: "А якщо я захочу повернутись на WordPress?",
        a: "Можливо, але болюче. Ми віддаємо вам код і всю документацію — повернутись на WP можна, але на ринку UA рідко хто цього хоче після переходу.",
      },
      {
        q: "Що з WooCommerce?",
        a: "Залежить від обсягу. До 100 SKU — переносимо на Stripe/LiqPay direct, без плагінів. Більше 5 000 SKU — рекомендуємо Shopify або інший спецвиконавець.",
      },
      {
        q: "Скільки часу займає міграція?",
        a: "Від 1 тижня (простий лендінг) до 10 тижнів (e-commerce до 5k SKU). Середній проект — 4–6 тижнів.",
      },
      {
        q: "Що якщо щось зламається після запуску?",
        a: "Перші 30 днів — щоденний моніторинг, фікси в той самий день. Перший рік — повна гарантія. Якщо зриваємо термін — повертаємо 30%.",
      },
    ],
  },
  cta: {
    eyebrow: "/ 11 ГОТОВІ ПЕРЕЇХАТИ?",
    heading: (
      <>
        Розрахуйте міграцію <em>за 60 секунд.</em>
      </>
    ),
    sub: "Калькулятор — безкоштовний, без форми, реальна ціна одразу. Або поговоримо на 30-хв розборі: зрозуміємо ваш WP, скажемо чи маємо сенс ми.",
    cards: [
      {
        icon: Calendar,
        title: "Калькулятор міграції",
        body: "Виберіть тип сайту і кількість сторінок — отримайте смету за 60 секунд.",
        cta: "Відкрити калькулятор →",
        href: "/calculator?source=vs-wordpress",
        featured: true,
      },
      {
        icon: MessageCircle,
        title: "30-хв розбір",
        body: "Zoom з founder'ом. Покажемо реальні кейси міграцій, оцінимо ваш WP, скажемо термін і ціну.",
        cta: "Записатись →",
        href: "https://calendly.com/fedirdev",
      },
      {
        icon: Mail,
        title: "Бриф через форму",
        body: "Опишіть проєкт детально — повернемось протягом 4 робочих годин.",
        cta: "Заповнити бриф →",
        href: "/contacts",
      },
    ],
  },
};


/* ─── EN copy ───────────────────────────────────────────────────────────── */

export const VS_WORDPRESS_EN: Content = {
  metaTitle:
    "Migrate off WordPress in 4 weeks · 0 SEO drops | Code-Site.Art",
  metaDescription:
    "We migrate WordPress sites to Next.js in 4–10 weeks. 47 projects — zero SEO drops. From £1,000 for a landing. 1-year warranty + 30% rebate.",
  hero: {
    eyebrowLabel: "/ COMPARE · WORDPRESS",
    h1Lines: [
      <>WordPress was the right call in 2015.</>,
      <em key="hero-em">Not in 2026.</em>,
    ],
    lede: (
      <>
        We migrate your site off WordPress in 4 weeks. Every Google
        ranking stays put. 47 projects — zero SEO drops. Your
        content, comments, and media come with you.
      </>
    ),
    badges: [
      { label: "0 SEO drops", sub: "across 47 projects" },
      { label: "4 weeks", sub: "brief to live" },
      { label: "1-year warranty", sub: "+ 30% rebate if we slip" },
      { label: "From £1,000", sub: "for a landing migration" },
    ],
    ctaPrimary: "Calculate migration cost",
    ctaSecondary: "See how we migrate",
  },
  costs: {
    eyebrow: "/ 02 HIDDEN COSTS",
    heading: (
      <>
        What WordPress <em>actually costs you.</em>
      </>
    ),
    sub: "Hosting is just the surface. Here's what you're paying every month — whether you notice it or not:",
    items: [
      {
        num: "01",
        icon: Plug,
        title: "Plugins",
        body: "Yoast Premium, Wordfence, caching, forms, backups. Every plugin is a subscription, an update, and a potential vulnerability.",
        metric: "£50–150/mo",
      },
      {
        num: "02",
        icon: Server,
        title: "Hosting + CDN",
        body: "WP-optimized hosting (Kinsta, WP Engine) starts at £30/mo. Cheap hosting = slow site. Either way, you pay.",
        metric: "£30–200/mo",
      },
      {
        num: "03",
        icon: ShieldAlert,
        title: "Security",
        body: "WordPress is the #1 target for attackers. Brute-force, XSS, plugin vulnerabilities. Without monthly audits — it's a matter of when, not if.",
        metric: "1 hack = £500–5,000",
      },
      {
        num: "04",
        icon: Gauge,
        title: "Speed",
        body: "Typical WP site: LCP of 3–5 seconds. Google penalizes you in rankings, users bounce.",
        metric: "−20% conversion",
      },
      {
        num: "05",
        icon: Palette,
        title: "Theme licenses",
        body: "Premium themes (Avada, Divi, Astra Pro) — yearly subscriptions. Stop paying, support cuts off.",
        metric: "£60–200/yr",
      },
      {
        num: "06",
        icon: Wrench,
        title: "Developer",
        body: "Every edit is either DIY in Elementor (risk breaking it) or a call to your dev (£30–80/hr).",
        metric: "£200–800/mo",
      },
    ],
    foot: (
      <>
        Total cost over 36 months: £5,000 to £20,000{" "}
        <strong>on top of</strong> the original build. We charge once. Zero
        subscriptions.
      </>
    ),
  },
  compare: {
    eyebrow: "/ 03 SIDE BY SIDE",
    heading: (
      <>
        WordPress vs Code-Site. <em>Honest.</em>
      </>
    ),
    sub: "No spin. What we actually see across 47 projects.",
    headers: { criterion: "Criterion", wp: "WordPress", us: "Code-Site" },
    rows: [
      {
        criterion: "Loading speed",
        wp: "LCP 3–5 seconds",
        us: "LCP under 1 second",
      },
      {
        criterion: "Monthly cost",
        wp: "£50–200 (plugins + hosting + maintenance)",
        us: "£0–20 (Vercel/Cloudflare only)",
      },
      {
        criterion: "Security",
        wp: "weekly patches, breach risk",
        us: "no attack surface — it's static code",
      },
      {
        criterion: "Content editing",
        wp: "Gutenberg / Elementor — confusing, breaks",
        us: "Sanity Studio — edit from your phone",
      },
      {
        criterion: "Custom feature",
        wp: "\"find a plugin or hire a dev\"",
        us: "written in the brief, built in code",
      },
      {
        criterion: "Code ownership",
        wp: "shared, theme-bound",
        us: "yours. In your GitHub from commit one",
      },
      {
        criterion: "Time to launch",
        wp: "2–4 months with an agency",
        us: "4–10 weeks",
      },
      {
        criterion: "Migrating to another stack later",
        wp: "extremely painful",
        us: "clean — Next.js ports to any infra",
      },
      {
        criterion: "SEO capability",
        wp: "Yoast + a stack of plugins",
        us: "schema.org + sitemaps + Core Web Vitals tuned by hand",
      },
    ],
  },
  caseStudy: {
    eyebrow: "/ 04 REAL MIGRATION",
    heading: (
      <>
        NBYG København. <em>From WordPress to Next.js in 6 weeks.</em>
      </>
    ),
    subEyebrow: "Construction · Copenhagen + Bornholm, Denmark · 2024",
    beforeLabel: "Before (on WordPress)",
    afterLabel: "After (60 days post-migration)",
    before: [
      { label: "LCP", value: "~4.5 seconds" },
      { label: "Inquiries/month", value: "3" },
      {
        label: "Local search",
        value: "page 2 of Google for “byggefirma Bornholm”",
      },
      { label: "Monthly site cost", value: "~£110 (hosting + plugins)" },
    ],
    after: [
      { label: "LCP", value: "0.8 seconds", lift: "5× faster" },
      { label: "Inquiries/month", value: "24", lift: "8×" },
      { label: "Local search", value: "#1", lift: "6× organic traffic" },
      { label: "Monthly cost", value: "£0", lift: "Vercel hobby tier" },
    ],
    quote: (
      <>
        Construction on Bornholm is a tight niche. We were nervous about
        losing even the small Google traction we had. Thirty days after the
        move, traffic held. Sixty days in, we were #1 locally.
        Inquiries jumped from 3 a month to 24 in our first month
        live. The team wrote the content, ran the QA, and shipped. We just
        got the keys.
      </>
    ),
    quoteAuthor: "Owner, NBYG København Aps",
    cta: "See the full case study",
    ctaHref: "/en/portfolio/nbyg-kobenhavn",
  },
  seo: {
    eyebrow: "/ 05 THE SEO QUESTION",
    heading: (
      <>
        “What about my SEO?” <em>Nothing happens. It all stays.</em>
      </>
    ),
    sub: "This is the #1 question we get. Here's the straight answer:",
    cards: [
      {
        title: "47 projects · 0 drops",
        body: (
          <>
            We&apos;ve migrated 47 sites off WordPress (and other platforms). Not
            one lost rankings for more than a week. In most cases, rankings
            climbed 30–60 days post-launch — a faster site is a better-ranked
            site.
          </>
        ),
      },
      {
        title: "301 redirects for every URL",
        body: (
          <>
            Every old URL → new URL. No exceptions. We build the redirect map
            before launch, you approve it, we ship. Google figures out the
            move in 7–14 days.
          </>
        ),
      },
      {
        title: "Schema.org and Open Graph carry over",
        body: (
          <>
            Your current schema (Article, Organization, BreadcrumbList)
            transfers 1-for-1. We usually <strong>upgrade</strong> it — add
            what Yoast missed.
          </>
        ),
      },
      {
        title: "Meta content and H1/H2 stay yours",
        body: (
          <>
            We don&apos;t touch on-page copy without your sign-off. Titles,
            descriptions, headings — all carry over. Want a refresh? That&apos;s
            a separate copywriting session.
          </>
        ),
      },
    ],
    closing:
      "For the first 30 days post-launch, we watch your Search Console daily. If something goes sideways, we fix it the same day. It's covered under your warranty.",
  },
  admin: {
    eyebrow: "/ 06 THE ADMIN",
    heading: (
      <>
        Sanity Studio. <em>The admin you work with, not against.</em>
      </>
    ),
    sub: "The biggest fear before migration is “how will I edit without WordPress?” Sanity isn't WordPress. It's better: drag-and-drop blocks that can't break the layout, full mobile editing, multi-language and SEO out of the box — no plugins required.",
    compareHeaders: { activity: "What you do daily", wp: "WordPress", us: "Sanity Studio" },
    compareRows: [
      {
        activity: "Drag-and-drop blocks",
        wp: "via Gutenberg / Elementor — theme conflicts",
        us: "built in, typed — can't break the layout",
      },
      {
        activity: "Mobile editing",
        wp: "exists in theory, painful in practice",
        us: "full editing from your phone, same as desktop",
      },
      {
        activity: "Create a new page",
        wp: "possible, but mind the template",
        us: "one click, template already set",
      },
      {
        activity: "Create a new block type",
        wp: "need a PHP dev or a plugin",
        us: "drag-and-drop, no code",
      },
      {
        activity: "Multi-language",
        wp: "WPML plugin, £99/year",
        us: "built in, free",
      },
      {
        activity: "SEO (title, meta, OG, schema)",
        wp: "Yoast Premium, £99/year",
        us: "fields on every document, free",
      },
      {
        activity: "Real-time collaboration",
        wp: "none (just record-locking)",
        us: "like Google Docs — multiple editors at once",
      },
      {
        activity: "Version history",
        wp: "basic, only on paid hosting",
        us: "full, one-click rollback",
      },
      {
        activity: "Security updates",
        wp: "weekly — risk of breaking the site",
        us: "we host it, you update nothing",
      },
      {
        activity: "Cost for a team up to 5",
        wp: "£30+/mo hosting + plugins",
        us: "£0",
      },
    ],
    capabilitiesHeading: "6 things you do without a developer",
    capabilities: [
      {
        num: "01",
        title: "Drag-and-drop blocks",
        body: "Drag sections onto a page — text, image, form, testimonials, FAQ. Every block has rules, so you can't break the layout.",
      },
      {
        num: "02",
        title: "Works on your phone",
        body: "Actually works. Not “responsive admin for emergencies” — full editing from mobile. Read a testimonial on the train — publish before you reach the office.",
      },
      {
        num: "03",
        title: "Create new pages yourself",
        body: "No developer needed. Click “new entry,” pick a template, fill the fields, publish. 5 minutes.",
      },
      {
        num: "04",
        title: "Multi-language built in",
        body: "Every field has UK and EN versions. Translate here — it renders there. No plugins, no extra fees.",
      },
      {
        num: "05",
        title: "SEO without Yoast",
        body: "Every page has title, meta-description, OG-image, canonical, schema.org fields. Fill them in — Google sees them.",
      },
      {
        num: "06",
        title: "Free for teams up to 5",
        body: "Your marketer + assistant + copywriter + editor + you — zero dollars per month. Paid tier kicks in at editor #6.",
      },
    ],
    foot: (
      <>
        <strong>Sanity Studio is open-source.</strong> If you decide to leave
        us in 5 years — the Studio stays with you, content exports to JSON,
        you migrate anywhere. No vendor lock-in.
      </>
    ),
  },
  process: {
    eyebrow: "/ 07 HOW WE MIGRATE",
    heading: (
      <>
        How it works. <em>5 steps.</em>
      </>
    ),
    steps: [
      {
        num: "01",
        title: "Audit",
        duration: "2 days · free",
        body: "We look at your WP: pages, plugins, integrations, SEO state. Map of what transfers.",
      },
      {
        num: "02",
        title: "Plan + redirects",
        duration: "1 week",
        body: "301 redirect map. Wireframes of the new structure. You sign off — we start building.",
      },
      {
        num: "03",
        title: "Build",
        duration: "2–4 weeks",
        body: "Custom code on Next.js. Content imported from WP. Weekly demos.",
      },
      {
        num: "04",
        title: "SEO bridge",
        duration: "launch week",
        body: "301s configured, Search Console, Analytics, schema.org. Pre-launch QA.",
      },
      {
        num: "05",
        title: "Launch + monitor",
        duration: "switch day + 30 days",
        body: "DNS swap. First 30 days — daily monitoring of rankings and traffic.",
      },
    ],
  },
  filter: {
    eyebrow: "/ 08 STRAIGHT TALK",
    heading: (
      <>
        What we <em>don&apos;t do.</em>
      </>
    ),
    sub: "Not every WP site should come to us. Here's when we'll say no:",
    items: [
      {
        title: "WooCommerce sites with 5,000+ SKUs",
        body: "Shopify or a £20k+ custom build is the right call.",
      },
      {
        title: "WP-Multisite networks",
        body: "That's a different architecture, not our wheelhouse.",
      },
      {
        title: "Sites with custom plugins written for your business",
        body: "If your operation depends on bespoke PHP logic, rewriting it in TypeScript is a separate project. We'll tell you straight.",
      },
    ],
    foot: "If your case isn't on this list, talk to us. The 30-minute consult is free — we'll tell you if we're a fit or if you should look elsewhere.",
  },
  pricing: {
    eyebrow: "/ 09 MIGRATION PRICING",
    heading: (
      <>
        What it costs to <em>leave WordPress.</em>
      </>
    ),
    sub: "Same rule as everywhere on this site: price in the brief, no “request a quote.”",
    tiers: [
      {
        name: "Landing migration",
        price: formatPrice(1000, { locale: "en" }),
        priceLabel: "from",
        weeks: "1–2 weeks",
        includes: {
          heading: "Who it's for",
          items: [
            "One landing or business-card site",
            "Up to 5 pages",
            "No blog",
            "301 redirects + media transfer",
            "30-day monitoring",
          ],
        },
        ctaLabel: "Estimate landing",
      },
      {
        popular: true,
        popularLabel: "★ MOST POPULAR",
        name: "Site migration",
        price: formatPrice(3500, { locale: "en" }),
        priceLabel: "from",
        weeks: "4–8 weeks",
        includes: {
          heading: "Everything in landing, plus",
          items: [
            "Up to 30 pages",
            "CMS, blog, form integrations",
            "Comments + media library carried over",
            "Schema.org + Open Graph upgrade",
            "Where most clients land",
          ],
        },
        ctaLabel: "Estimate site",
      },
      {
        name: "Complex migration",
        price: formatPrice(5000, { locale: "en" }),
        priceLabel: "from",
        weeks: "6–10 weeks",
        includes: {
          heading: "Everything in site, plus",
          items: [
            "E-commerce up to 5k SKUs",
            "Multi-language",
            "Custom API",
            "Complex SEO structure",
            "Dedicated team",
          ],
        },
        ctaLabel: "Talk through complex",
        ctaGhost: true,
      },
    ],
    foot: "Every tier includes: 301 redirects, content and media transfer, schema.org, 30-day post-launch monitoring, 1-year warranty.",
    ctaPrimary: "Calculate migration cost",
    ctaSecondary: "Talk to a migration specialist",
  },
  faq: {
    eyebrow: "/ 10 FAQ",
    heading: (
      <>
        What people <em>ask most.</em>
      </>
    ),
    items: [
      {
        q: "Will I lose Google rankings after migration?",
        a: "No. 47 projects, zero drops longer than a week. We build a complete 301 redirect map and monitor Search Console daily for the first 30 days.",
      },
      {
        q: "What about my blog and comments?",
        a: "All posts transfer. Comments — your call: we can move them to Disqus/native or leave them on the old domain.",
      },
      {
        q: "What about my media library (images, PDFs)?",
        a: "Transferred as-is. URL structure preserved — /wp-content/uploads/... 301s to the new structure.",
      },
      {
        q: "Can I still edit content myself?",
        a: "Yes. Sanity Studio — like WordPress, but faster and doesn't break. Works on mobile. Free for teams up to 5 editors.",
      },
      {
        q: "What if I want to go back to WordPress later?",
        a: "Possible, but painful. We give you the code and full documentation — going back to WP is on the table, but in our experience nobody does after the move.",
      },
      {
        q: "What about WooCommerce?",
        a: "Depends on scale. Under 100 SKUs — we move to Stripe/LiqPay direct, no plugins. Over 5,000 SKUs — we'll recommend Shopify or another specialist.",
      },
      {
        q: "How long does migration take?",
        a: "1 week (simple landing) to 10 weeks (e-commerce up to 5k SKUs). Average project — 4–6 weeks.",
      },
      {
        q: "What if something breaks after launch?",
        a: "First 30 days — daily monitoring, same-day fixes. First year — full warranty. If we miss the deadline — 30% rebate.",
      },
    ],
  },
  cta: {
    eyebrow: "/ 11 READY TO MIGRATE?",
    heading: (
      <>
        Get a migration estimate <em>in 60 seconds.</em>
      </>
    ),
    sub: "Calculator is free, no form, real price up front. Or let's talk for 30 minutes — we'll look at your WP and tell you if we're a fit.",
    cards: [
      {
        icon: Calendar,
        title: "Migration calculator",
        body: "Pick a site type and page count — get an estimate in 60 seconds.",
        cta: "Open calculator →",
        href: "/calculator?source=vs-wordpress",
        featured: true,
      },
      {
        icon: MessageCircle,
        title: "30-min consult",
        body: "Zoom with the founder. We'll show real migration cases, look at your WP, give you a timeline and price.",
        cta: "Book now →",
        href: "https://calendly.com/fedirdev",
      },
      {
        icon: Mail,
        title: "Send a brief",
        body: "Detailed form. Describe the project — we'll come back within 4 business hours.",
        cta: "Fill out brief →",
        href: "/contacts",
      },
    ],
  },
};
