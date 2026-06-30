/**
 * Content type and locale data for the vs-constructors comparison page.
 */

import type * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Calendar, CreditCard, Gauge, Globe, Layers, Lock, Mail, MessageCircle, Plug, Plus, PlusSquare, Search } from "lucide-react";
import type { TierProps } from "@/types/pricing";
import { formatPrice } from "@/lib/shared/format-price";
// import { SITE_CONTACT } from "@/constants/site"; // CALENDLY DISABLED — see docs/calendly-disabled.md

/* ─── Content shape ─────────────────────────────────────────────────────── */

export type Sign = {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
};

export type Cost = {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
  metric: string;
};

export type CompareRow = {
  criterion: string;
  values: [string, string, string, string, string]; // tilda, webflow, wix, squarespace, weblium
  us: string;
};

export type Builder = {
  name: string;
  good: string;
  cap: string;
  note?: string;
  when: string;
};

export type PatternRow = { metric: string; before: string; after: string };

export type DontDo = { title: string; body: React.ReactNode };

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
  outgrew: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    items: Sign[];
    foot: string;
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
    builderHeaders: [string, string, string, string, string]; // 5 builder names
    usHeader: string;
    criterionHeader: string;
    rows: CompareRow[];
  };
  builders: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    goodLabel: string;
    capLabel: string;
    noteLabel: string;
    whenLabel: string;
    items: Builder[];
  };
  admin: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    desktopAlt: string;
    desktopCaption: string;
    mobileAlt: string;
    mobileCaption: string;
    capabilitiesHeading: string;
    capabilities: { num: string; title: string; body: string }[];
    foot: React.ReactNode;
  };
  patterns: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    headers: { metric: string; before: string; after: string };
    rows: PatternRow[];
    foot: string;
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
    sub: React.ReactNode;
    tiers: TierProps[];
    foot: React.ReactNode;
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

export const VS_CONSTRUCTORS_UK: Content = {
  metaTitle:
    "Перейти з Tilda, Webflow, Wix на custom code · 0 SEO-падінь | Code-Site.Art",
  metaDescription:
    "Мігруємо сайти з Tilda, Webflow, Wix, Squarespace, Weblium на Next.js за 4–10 тижнів. 47 проєктів — 0 SEO-падінь. Від $1 000. Без підписок після запуску.",
  hero: {
    eyebrowLabel: "/ ПОРІВНЯННЯ · КОНСТРУКТОРИ",
    h1Lines: [
      <>Конструктори ідеальні.</>,
      <em key="hero-em">Поки бізнес у них поміщається.</em>,
    ],
    lede: (
      <>
        Tilda, Webflow, Wix, Squarespace, Weblium — кожен мав сенс на старті.
        Коли потік клієнтів виріс, конструктор починає заважати: повільне
        завантаження, лок-ін на платформі, місячна підписка, потолок
        інтеграцій. Мігруємо на custom code за 4 тижні. Зберігаємо
        все: SEO, контент, домен, аналітику.
      </>
    ),
    badges: [
      { label: "47 проєктів", sub: "0 SEO-падінь" },
      { label: "4 тижні", sub: "від брифу до запуску" },
      { label: "0 підписок", sub: "платите один раз" },
      { label: "Від $1 000", sub: "за міграцію лендінга" },
    ],
    ctaPrimary: "Розрахувати міграцію",
    ctaSecondary: "Дивитись таблицю порівняння",
  },
  outgrew: {
    eyebrow: "/ 02 ВИ ПЕРЕРОСЛИ",
    heading: (
      <>
        5 ознак, що конструктор <em>вас гальмує.</em>
      </>
    ),
    sub: "Якщо бачите хоча б 2 — час говорити про міграцію.",
    items: [
      {
        num: "01",
        icon: Gauge,
        title: "Сайт завантажується довше 2 секунд",
        body: "Конструктори додають свою CSS і JS-обвʼязку на кожній сторінці. На мобільному 3G ваш Tilda/Wix вантажиться 4–6 секунд. Користувач закриває вкладку, Google карає в видачі.",
      },
      {
        num: "02",
        icon: CreditCard,
        title: "Місячний рахунок поповз вгору",
        body: "Стартували з $15, зараз $50–80? Це нормальна динаміка конструкторів: додатковий тариф, плагіни, інтеграції, премʼєм-шаблон. За 3 роки володіння — $1 800–3 000 у підписках.",
      },
      {
        num: "03",
        icon: Plug,
        title: "Потрібна фіча, якої немає у платформі",
        body: "Кастом-форма з логікою, інтеграція з вашою CRM, складний чекаут, мультимовність з географією — конструктори впираються в потолок. Або ставите милиці, або міняєте платформу.",
      },
      {
        num: "04",
        icon: Search,
        title: "SEO застряг на одному рівні",
        body: "Schema.org обмежена, sitemap не редагується, Core Web Vitals не дотягують. Ви зробили все, що пропонує платформа, — і застрягли на 5–10 позиції. Без custom-оптимізації вище не вийде.",
      },
      {
        num: "05",
        icon: Lock,
        title: "Не контролюєте свої дані",
        body: "Платформа закриється, ціна виросте вдвічі, технологія застаріє — ви не власник коду і не власник інфраструктури. Експорт є, але часто це HTML без логіки.",
      },
    ],
    foot: "Поставили хоча б дві галочки — пишіть. На безкоштовному 30-хв розборі скажемо, чи має сенс міграція зараз, чи рано.",
  },
  costs: {
    eyebrow: "/ 03 ПРИХОВАНІ ВИТРАТИ",
    heading: (
      <>
        Скільки конструктор <em>коштує насправді.</em>
      </>
    ),
    sub: "Базова підписка — лише видима частина. Ось що ви платите щомісяця:",
    items: [
      {
        num: "01",
        icon: Layers,
        title: "Базова підписка",
        body: "Tilda Personal, Webflow CMS, Wix Premium, Squarespace Business, Weblium Pro — мінімум для нормального бізнес-сайту.",
        metric: "$15–49/міс",
      },
      {
        num: "02",
        icon: Plug,
        title: "Додаткові інтеграції",
        body: "Email-форми, чат, бронювання, CRM-конектор. Кожен — окрема підписка через app store платформи.",
        metric: "$10–30/міс кожна",
      },
      {
        num: "03",
        icon: PlusSquare,
        title: "Премʼєм-шаблон / тема",
        body: "Гарний шаблон зазвичай — окрема покупка або ще один тариф.",
        metric: "$50–300 одноразово",
      },
      {
        num: "04",
        icon: ArrowUpRight,
        title: "Ліміт сторінок / трафіку",
        body: "Виросли — переходьте на дорожчий тариф. Tilda Business — $25/міс, Webflow CMS Plus — $39/міс.",
        metric: "+$20–40/міс",
      },
      {
        num: "05",
        icon: Globe,
        title: "Власний домен на дорогих тарифах",
        body: "На Wix і Weblium безкоштовний тариф взагалі без власного домену.",
        metric: "$10–15/рік + tier",
      },
      {
        num: "06",
        icon: Plus,
        title: "Втрата при зростанні",
        body: "Ваш сайт виріс до 100 сторінок? Webflow CMS = $39/міс. Wix VIP = $39/міс. Кожні 100 сторінок — додатковий tier.",
        metric: "+$20–60/міс",
      },
    ],
    foot: (
      <>
        За 3 роки на конструкторі ви платите{" "}
        <strong>від $1 800 до $4 500</strong> у підписках. У нас один платіж —
        від $1 000. Через рік ви вже в плюсі.
      </>
    ),
  },
  compare: {
    eyebrow: "/ 04 ПОРІВНЯННЯ",
    heading: (
      <>
        Code-Site vs усі <em>топові конструктори.</em>
      </>
    ),
    sub: "Чесно по фактах. Без перекручувань. На основі 47 проєктів і 3 років роботи з кожним з них.",
    criterionHeader: "Критерій",
    builderHeaders: ["Tilda", "Webflow", "Wix", "Squarespace", "Weblium"],
    usHeader: "Code-Site",
    rows: [
      {
        criterion: "Швидкість (LCP)",
        values: ["3–4с", "2–3с", "4–6с", "2–4с", "3–5с"],
        us: "< 1с",
      },
      {
        criterion: "Місячна вартість",
        values: ["$15–25", "$14–49", "$16–159", "$23–49", "$0–25"],
        us: "$0–20 (тільки хостинг)",
      },
      {
        criterion: "Володіння кодом",
        values: ["ні", "частково", "ні", "ні", "ні"],
        us: "так, у вашому GitHub",
      },
      {
        criterion: "Кастом-фічі",
        values: [
          "дуже обмежено",
          "обмежено",
          "мінімум",
          "мінімум",
          "дуже обмежено",
        ],
        us: "необмежено",
      },
      {
        criterion: "Schema.org / SEO",
        values: [
          "базова",
          "непогана",
          "дуже обмежена",
          "непогана",
          "базова",
        ],
        us: "повна, на ваш бриф",
      },
      {
        criterion: "Мультимовність",
        values: [
          "додатковий tier",
          "через workaround",
          "додатковий tier",
          "обмежено",
          "обмежено",
        ],
        us: "необмежено",
      },
      {
        criterion: "Час запуску",
        values: [
          "1–2 тижні самостійно",
          "1–4 тижні самостійно",
          "3–7 днів",
          "1–2 тижні",
          "1 тиждень",
        ],
        us: "4–10 тижнів зі студією",
      },
      {
        criterion: "Експорт коду",
        values: [
          "HTML без логіки",
          "HTML + CSS",
          "неможливо",
          "неможливо",
          "неможливо",
        ],
        us: "повний код",
      },
      {
        criterion: "Юрисдикція",
        values: ["Росія (СПб)", "США", "Ізраїль", "США", "Україна"],
        us: "—",
      },
    ],
  },
  builders: {
    eyebrow: "/ 05 ЧЕСНО ПО КОЖНОМУ",
    heading: (
      <>
        Що кожен конструктор <em>робить добре. І де його потолок.</em>
      </>
    ),
    sub: "Ми працювали з усіма пʼятьма. Жоден не «поганий» — кожен має свою нішу. Питання: чи відповідає вашому бізнесу зараз.",
    goodLabel: "Що добре",
    capLabel: "Де потолок",
    noteLabel: "Окремо",
    whenLabel: "Коли мігрувати",
    items: [
      {
        name: "Tilda",
        good: "Швидкий старт, велика бібліотека блоків, інтуітивний редактор. Ідеальний для лендінгів і інфо-сайтів до 10 сторінок.",
        cap: "Повільне завантаження на мобільному, обмежений експорт, місячна підписка. Кастомні інтеграції — лише через workaround.",
        note: "Компанія зареєстрована в РФ. Для частини українського бізнесу — окрема причина шукати альтернативу.",
        when: "Ваш сайт переріс 15 сторінок, ви платите $25+/міс, і потрібна одна-дві кастом-фічі, яких в Tilda немає.",
      },
      {
        name: "Webflow",
        good: "Найкраща дизайнерська свобода серед конструкторів. Чистіший код, ніж у конкурентів. Сильний для SaaS-лендінгів і портфоліо.",
        cap: "$20–40/міс на сайт + хостинг. CMS обмежена в кількості items на нижчих тарифах. Анімації важкі — заваджають performance. Складна модель ціноутворення (CMS / Business / Enterprise + хостинг).",
        when: "Складна логіка форм, кастом-чекаут, потрібен повний контроль над performance, або месячний рахунок > $50.",
      },
      {
        name: "Wix",
        good: "Найпростіший вхід для тих, хто ніколи не робив сайтів. Чесний free tier. Багато готових шаблонів.",
        cap: "Найгірший performance у списку. SEO дуже обмежений. Кастом — практично неможливо. Платні плагіни на кожен крок.",
        when: "Бізнес виріс із «одна людина робить усе» до команди, або ви помітили, що позиції в Google не ростуть.",
      },
      {
        name: "Squarespace",
        good: "Найкрасивіші out-of-the-box шаблони. Сильний для креативних бізнесів — фотографи, дизайнери, бутики, ресторани в US/EU.",
        cap: "$23–49/міс. Мультимовність обмежена. Кастомні інтеграції — складно. SEO непоганий, але потолок є.",
        when: "Вам потрібна реальна мультимовність, складна e-commerce-логіка, або performance стає важливим.",
      },
      {
        name: "Weblium",
        good: "Український продукт, AI-driven setup, free tier. Простий для дуже малого бізнесу.",
        cap: "Маленька екосистема, обмежені інтеграції, базова SEO, немає експорту.",
        when: "Бізнес виріс із «сайт-візитка» до «сайт як інструмент привлечення клієнтів».",
      },
    ],
  },
  admin: {
    eyebrow: "/ 06 АДМІНКА ПІСЛЯ МІГРАЦІЇ",
    heading: (
      <>
        Не втрачаєте drag-and-drop.{" "}
        <em>Виграєте все, чого вам бракує в конструкторі.</em>
      </>
    ),
    sub: "Найбільший страх перед міграцією з Tilda/Webflow/Wix — «втрачу зручну візуальну адмінку». Не втрачаєте. Sanity Studio — це той самий drag-and-drop візуальний редактор, який ви любите. Просто без обмежень платформи: повноцінна мультимовність, schema.org, відсутність вендор-лок-іна, нуль підписок.",
    desktopAlt:
      "Sanity Studio admin interface on desktop — drag-and-drop block editor",
    desktopCaption: "Sanity Studio — звична логіка drag-and-drop без обмежень",
    mobileAlt:
      "Sanity Studio admin interface on mobile phone — full editing capability",
    mobileCaption:
      "Та сама адмінка з телефона — як у Tilda/Webflow, тільки без підписки",
    capabilitiesHeading: "6 речей, які ви виграєте",
    capabilities: [
      {
        num: "01",
        title: "Drag-and-drop, який не ламається",
        body: "Як Tilda Zero Block, але блоки типізовані — верстку не зламаєте навіть випадково.",
      },
      {
        num: "02",
        title: "Повноцінне редагування з телефона",
        body: "Не «адаптивна версія для аварії» — повне редагування. У Wix мобільна адмінка обмежена, у Tilda — теж. У Sanity — однакова з компʼютером.",
      },
      {
        num: "03",
        title: "Мультимовність — без додаткового тарифу",
        body: "Tilda — окремий tier за multilang. Webflow — workaround. Wix — extra tier. У Sanity вбудовано безкоштовно.",
      },
      {
        num: "04",
        title: "SEO без додаткових плагінів",
        body: "Schema.org, sitemap, redirects, OG-картинки — поля в кожному документі. Без Yoast-аналогів. Без додаткових підписок.",
      },
      {
        num: "05",
        title: "Команда до 5 осіб — безкоштовно",
        body: "Tilda Business на команду — від $25/міс. Webflow на команду — від $39/міс. Sanity на команду до 5 — $0.",
      },
      {
        num: "06",
        title: "Open-source, повний експорт",
        body: "Через 5 років захочете піти — Studio залишається у вас, контент експортується в JSON. У жодного конструктора такого немає.",
      },
    ],
    foot: (
      <>
        Ви платили $25–80/міс за платформу + плагіни. Тепер платите{" "}
        $0/міс за адмінку. Лише хостинг — $0–20 на Vercel/Cloudflare.
        За рік — економія <strong>$300–960</strong>.
      </>
    ),
  },
  patterns: {
    eyebrow: "/ 07 НА 47 МІГРАЦІЯХ",
    heading: (
      <>
        Що ми бачимо <em>на типовій міграції з конструктора.</em>
      </>
    ),
    sub: "12 з 47 наших міграцій — це переходи з Tilda, Webflow, Wix і Squarespace. Тут — типові цифри до/після:",
    headers: {
      metric: "Метрика",
      before: "До (на конструкторі)",
      after: "Після (Next.js)",
    },
    rows: [
      {
        metric: "LCP (мобільний)",
        before: "3.5–5 секунд",
        after: "< 1 секунди (×4 швидше)",
      },
      {
        metric: "Заявок/міс",
        before: "стабільне плато",
        after: "+30–80% за 60 днів",
      },
      {
        metric: "Позиції в Google",
        before: "5–15 за ключовими",
        after: "переважно Top-5, частина Top-3",
      },
      {
        metric: "Місячна вартість",
        before: "$25–80",
        after: "$0–20 (тільки Vercel/Cloudflare)",
      },
      {
        metric: "Час на правки контенту",
        before: "5–15 хв через UI конструктора",
        after: "1–3 хв через Sanity з телефона",
      },
    ],
    foot: "Точні цифри по вашому проекту скажемо на безкоштовному 30-хв розборі — потрібно подивитись ваш сайт і поточну аналітику.",
  },
  filter: {
    eyebrow: "/ 08 ЧЕСНО",
    heading: (
      <>
        Чого ми <em>не робимо.</em>
      </>
    ),
    sub: "Не з кожним конструктором є сенс мігрувати. Ось коли ми скажемо «ні»:",
    items: [
      {
        title: "Webflow + ваш дизайн на 200+ сторінках",
        body: "Мігрувати дешевше, ніж побудувати такий обʼєм з нуля. Краще перейти на Webflow Enterprise або власну CMS на Webflow.",
      },
      {
        title: "Wix VIP з кастом-кодом, який ви самі писали",
        body: "Якщо ви вже взяли Wix Velo і вкладали туди логіку, це окремий обсяг. Скажемо чесно — або переписуємо як новий проект ($14k+), або залишайтесь.",
      },
      {
        title: "Squarespace магазин з 1 000+ товарів",
        body: "У такому випадку ваш реальний конкурент — Shopify, не custom code. Підкажемо до кого звернутись.",
      },
    ],
    foot: "Якщо ваш кейс не з цього списку — пишіть. На безкоштовному 30-хв розборі скажемо чесно.",
  },
  pricing: {
    eyebrow: "/ 09 ВАРТІСТЬ МІГРАЦІЇ",
    heading: (
      <>
        Скільки коштує <em>піти з конструктора.</em>
      </>
    ),
    sub: (
      <>
        Зазвичай <strong>дешевше</strong>, ніж міграція з WordPress — менше
        custom-логіки переносити. Ціна в брифі, без «під запит».
      </>
    ),
    tiers: [
      {
        name: "Лендінг-міграція",
        price: formatPrice(1000, { locale: "uk" }),
        weeks: "1–2 тижні",
        includes: {
          heading: "Для кого",
          items: [
            "Tilda / Wix / Webflow одностраничник",
            "До 5 сторінок",
            "301-редіректи зі старих URL",
            "Перенесення медіа",
            "30-денний моніторинг",
          ],
        },
        ctaLabel: "Розрахувати лендінг",
      },
      {
        popular: true,
        popularLabel: "★ НАЙПОПУЛЯРНІШЕ",
        name: "Сайт-міграція",
        price: formatPrice(3000, { locale: "uk" }),
        weeks: "3–6 тижнів",
        includes: {
          heading: "Все з лендінгу +",
          items: [
            "До 30 сторінок",
            "CMS, блог, форми",
            "Перенесення інтеграцій (Mailchimp / Stripe / LiqPay)",
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
            "Webflow CMS з 50+ items",
            "Squarespace store до 200 SKU",
            "Мультимовність",
            "Custom API",
            "Dedicated team",
          ],
        },
        ctaLabel: "Обговорити складну",
        ctaGhost: true,
      },
    ],
    foot: (
      <>
        Усі пакети включають: 301-редіректи з усіх старих URL, перенесення
        контенту і медіа, schema.org, 30-денний пост-лонч моніторинг, гарантію
        1 рік. <strong>Без підписок після запуску.</strong>
      </>
    ),
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
        a: "Ні. На 47 проєктах — 0 падінь більше ніж на тиждень. Будуємо повну мапу 301-редіректів зі старих URL на нові. Перші 30 днів моніторимо Search Console щодня.",
      },
      {
        q: "Що з моїм доменом?",
        a: "Залишається ваш. Ми просто перемикаємо DNS. Зміни користувач не помічає, у Google домен той самий.",
      },
      {
        q: "Що з історією Google Analytics?",
        a: "Усе залишається. GA4 прив'язано до property, не до сайту. Підключаємо до нової версії — історія в одному акаунті.",
      },
      {
        q: "Чи зможу я редагувати сайт після міграції?",
        a: "Так. Sanity Studio працює з телефона, інтерфейс простіший за Webflow і не ламається як Wix. Безкоштовно для команди до 5 осіб.",
      },
      {
        q: "У мене на Tilda підключений Mailchimp — це працюватиме?",
        a: "Так. Перепідключаємо до Mailchimp напряму через API — навіть швидше, ніж через Tilda.",
      },
      {
        q: "На Wix у мене Wix Stores з оплатою — як це переедет?",
        a: "Підключаємо Stripe (для EU/US) або LiqPay (для UA) напряму. Чекаут швидший, комісії нижчі, без додаткової підписки.",
      },
      {
        q: "Як експортувати дані з конструктора?",
        a: "Робимо за вас. Tilda — через Zero Block + контент-парсинг. Webflow — через CMS API. Wix/Squarespace — через scraping і ручний перенос.",
      },
      {
        q: "Що робити з SEO-налаштуваннями, які я налаштовував у Yoast / SEO-плагіні конструктора?",
        a: "Title, meta description, OG-теги переносимо 1-в-1. Schema.org — зазвичай покращуємо, додаємо те, що конструктор пропустив.",
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
    sub: "Калькулятор без форми, реальна ціна одразу. Або поговоримо на 30-хв розборі — подивимось ваш конструктор, скажемо термін і ціну.",
    cards: [
      {
        icon: Calendar,
        title: "Калькулятор міграції",
        body: "Виберіть тип сайту і кількість сторінок — отримайте смету за 60 секунд.",
        cta: "Відкрити калькулятор →",
        href: "/calculator?source=vs-constructors",
        featured: true,
      },
      /* CALENDLY DISABLED — see docs/calendly-disabled.md
      {
        icon: MessageCircle,
        title: "30-хв розбір",
        body: "Zoom з founder'ом. Покажемо реальні кейси міграцій з конструкторів.",
        cta: "Записатись →",
        href: SITE_CONTACT.calendly,
      },
      */
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

export const VS_CONSTRUCTORS_EN: Content = {
  metaTitle:
    "Migrate from GoDaddy, Webflow, Wix to custom code · 0 SEO drops | Code-Site.Art",
  metaDescription:
    "We migrate sites from GoDaddy, Webflow, Wix, Squarespace, Shopify to Next.js in 4–10 weeks. 47 projects — zero SEO drops. From £1,000. No subscriptions after launch.",
  hero: {
    eyebrowLabel: "/ COMPARE · SITE BUILDERS",
    h1Lines: [
      <>Site builders are great.</>,
      <em key="hero-em">Until your business outgrows them.</em>,
    ],
    lede: (
      <>
        GoDaddy, Webflow, Wix, Squarespace, Shopify — each made sense at the
        start. As your traffic grows, the builder starts pushing back: slow
        loads, vendor lock-in, monthly subscriptions, integration ceiling. We
        migrate you to custom code in 4 weeks. Everything carries
        over — SEO, content, domain, analytics.
      </>
    ),
    badges: [
      { label: "47 projects", sub: "0 SEO drops" },
      { label: "4 weeks", sub: "brief to launch" },
      { label: "0 subscriptions", sub: "pay once, own it" },
      { label: "From £1,000", sub: "for a landing migration" },
    ],
    ctaPrimary: "Calculate migration cost",
    ctaSecondary: "Jump to comparison table",
  },
  outgrew: {
    eyebrow: "/ 02 OUTGROWN",
    heading: (
      <>
        5 signs your builder <em>is holding you back.</em>
      </>
    ),
    sub: "Two checkboxes or more — it's time to talk migration.",
    items: [
      {
        num: "01",
        icon: Gauge,
        title: "Your site takes more than 2 seconds to load",
        body: "Builders bolt their CSS and JS onto every page. On mobile 3G your GoDaddy/Wix loads in 4–6 seconds. Users bounce, Google drops you in rankings.",
      },
      {
        num: "02",
        icon: CreditCard,
        title: "Monthly bill keeps creeping up",
        body: "Started at £15, now you're at £50–80? That's the builder lifecycle: extra tier, plugins, integrations, premium template. Three years in, you've spent £1,800–3,000 on subscriptions.",
      },
      {
        num: "03",
        icon: Plug,
        title: "You need a feature the platform doesn't have",
        body: "Custom form with conditional logic, your specific CRM integration, complex checkout, multi-language with geo — builders hit a ceiling. Either you bolt on workarounds, or you switch.",
      },
      {
        num: "04",
        icon: Search,
        title: "SEO is stuck on a plateau",
        body: "Schema.org is limited, sitemap is locked, Core Web Vitals are mediocre. You've maxed what the platform offers — and you're stuck at position 5–10. Without custom optimisation, you can't move up.",
      },
      {
        num: "05",
        icon: Lock,
        title: "You don't own your data",
        body: "The platform shuts down, doubles the price, the tech goes stale — you don't own the code or the infrastructure. Export exists, but it's usually HTML without the logic.",
      },
    ],
    foot: "Two or more checkboxes? Talk to us. The free 30-minute consult will tell you if migration makes sense now or if it's too early.",
  },
  costs: {
    eyebrow: "/ 03 HIDDEN COSTS",
    heading: (
      <>
        What a builder <em>actually costs you.</em>
      </>
    ),
    sub: "The base subscription is just the visible part. Here's what you're paying every month:",
    items: [
      {
        num: "01",
        icon: Layers,
        title: "Base subscription",
        body: "GoDaddy Personal, Webflow CMS, Wix Premium, Squarespace Business, Shopify Pro — minimum for a real business site.",
        metric: "£15–49/mo",
      },
      {
        num: "02",
        icon: Plug,
        title: "Add-on integrations",
        body: "Forms, chat, bookings, CRM connector. Each one — a separate subscription through the platform's app store.",
        metric: "£10–30/mo each",
      },
      {
        num: "03",
        icon: PlusSquare,
        title: "Premium template / theme",
        body: "A good template is usually a separate purchase or a higher tier.",
        metric: "£50–300 one-time",
      },
      {
        num: "04",
        icon: ArrowUpRight,
        title: "Page / traffic limit",
        body: "Outgrew it? Move to a pricier tier. GoDaddy Business — £25/mo, Webflow CMS Plus — £39/mo.",
        metric: "+£20–40/mo",
      },
      {
        num: "05",
        icon: Globe,
        title: "Custom domain on higher tiers",
        body: "Wix and Shopify free tiers don't even support custom domains.",
        metric: "£10–15/yr + tier",
      },
      {
        num: "06",
        icon: Plus,
        title: "Penalty for growth",
        body: "Site grew to 100 pages? Webflow CMS — £39/mo. Wix VIP — £39/mo. Every 100 pages, another tier.",
        metric: "+£20–60/mo",
      },
    ],
    foot: (
      <>
        Over 3 years on a builder, you pay <strong>£1,800 to £4,500</strong>{" "}
        in subscriptions. We charge once — from £1,000. You break
        even in year one.
      </>
    ),
  },
  compare: {
    eyebrow: "/ 04 SIDE BY SIDE",
    heading: (
      <>
        Code-Site vs every <em>major builder.</em>
      </>
    ),
    sub: "Honest, fact-based. Pulled from 47 projects and 3 years working with each of these.",
    criterionHeader: "Criterion",
    builderHeaders: ["GoDaddy", "Webflow", "Wix", "Squarespace", "Shopify"],
    usHeader: "Code-Site",
    rows: [
      {
        criterion: "Speed (LCP)",
        values: ["3–4s", "2–3s", "4–6s", "2–4s", "3–5s"],
        us: "< 1s",
      },
      {
        criterion: "Monthly cost",
        values: ["£15–25", "£14–49", "£16–159", "£23–49", "£0–25"],
        us: "£0–20 (hosting only)",
      },
      {
        criterion: "Code ownership",
        values: ["no", "partial", "no", "no", "no"],
        us: "yes, in your GitHub",
      },
      {
        criterion: "Custom features",
        values: [
          "very limited",
          "limited",
          "minimal",
          "minimal",
          "very limited",
        ],
        us: "unlimited",
      },
      {
        criterion: "Schema.org / SEO",
        values: [
          "basic",
          "decent",
          "very limited",
          "decent",
          "basic",
        ],
        us: "full, custom to your brief",
      },
      {
        criterion: "Multi-language",
        values: [
          "extra tier",
          "via workaround",
          "extra tier",
          "limited",
          "limited",
        ],
        us: "unlimited",
      },
      {
        criterion: "Time to launch",
        values: [
          "1–2 weeks DIY",
          "1–4 weeks DIY",
          "3–7 days",
          "1–2 weeks",
          "1 week",
        ],
        us: "4–10 weeks with us",
      },
      {
        criterion: "Code export",
        values: [
          "HTML without logic",
          "HTML + CSS",
          "not possible",
          "not possible",
          "not possible",
        ],
        us: "full source code",
      },
      {
        criterion: "Jurisdiction",
        values: [
          "USA (Arizona)",
          "USA",
          "Israel",
          "USA",
          "Canada",
        ],
        us: "—",
      },
    ],
  },
  builders: {
    eyebrow: "/ 05 EACH BUILDER, HONEST",
    heading: (
      <>
        What each builder <em>does well. And where it caps out.</em>
      </>
    ),
    sub: "We've worked with all five. None of them is “bad” — each has its niche. The question: is it still right for your business?",
    goodLabel: "What's good",
    capLabel: "Where it caps",
    noteLabel: "Note",
    whenLabel: "When to migrate",
    items: [
      {
        name: "GoDaddy",
        good: "Fast launch, large block library, intuitive editor. Ideal for landings and info sites up to 10 pages.",
        cap: "Slow on mobile, limited export, monthly subscription. Custom integrations only via workaround.",
        note: "Aggressive upsells, and you never own the code — leaving later means a rebuild.",
        when: "Your site is past 15 pages, you're paying £25+/mo, and you need a custom feature GoDaddy doesn't have.",
      },
      {
        name: "Webflow",
        good: "The best design freedom of any builder. Cleaner code than competitors. Strong for SaaS landings and portfolios.",
        cap: "£20–40/mo per site plus hosting. CMS is item-limited on lower tiers. Heavy animations hurt performance. Pricing model is tangled (CMS / Business / Enterprise + hosting).",
        when: "Complex form logic, custom checkout, you need full control over performance, or your monthly bill is north of £50.",
      },
      {
        name: "Wix",
        good: "Easiest entry point for non-technical owners. Honest free tier. Lots of templates.",
        cap: "Worst performance in this list. SEO is heavily restricted. Custom is barely possible. Paid plugins for every step.",
        when: "Business grew from “one person doing everything” to a team — or you've noticed your rankings aren't moving.",
      },
      {
        name: "Squarespace",
        good: "Best out-of-the-box templates. Strong for creative businesses — photographers, designers, boutiques, restaurants in the UK and EU.",
        cap: "£23–49/mo. Multi-language is limited. Custom integrations are hard. SEO is decent but capped.",
        when: "You need real multi-language, complex e-commerce logic, or performance becomes a priority.",
      },
      {
        name: "Shopify",
        good: "Ukrainian-built product, AI-driven setup, real free tier. Simple for very small businesses.",
        cap: "Small ecosystem, limited integrations, basic SEO, no code export.",
        when: "Business grew from “online business card” to “site as a customer-acquisition tool.”",
      },
    ],
  },
  admin: {
    eyebrow: "/ 06 ADMIN AFTER MIGRATION",
    heading: (
      <>
        You don&apos;t lose drag-and-drop.{" "}
        <em>You gain what your builder doesn&apos;t have.</em>
      </>
    ),
    sub: "The biggest pre-migration fear is “I'll lose the easy visual admin.” You don't. Sanity Studio is the same drag-and-drop visual editor you love about your builder. Just without the platform limits: full multi-language, schema.org, no vendor lock-in, zero subscriptions.",
    desktopAlt:
      "Sanity Studio admin interface on desktop — drag-and-drop block editor",
    desktopCaption: "Sanity Studio — familiar drag-and-drop, no limits",
    mobileAlt:
      "Sanity Studio admin interface on mobile phone — full editing capability",
    mobileCaption:
      "Same admin on your phone — like GoDaddy/Webflow, just without the subscription",
    capabilitiesHeading: "6 things you gain",
    capabilities: [
      {
        num: "01",
        title: "Drag-and-drop that can't break",
        body: "Like GoDaddy Zero Block, but blocks are typed — you can't break the layout even by accident.",
      },
      {
        num: "02",
        title: "Full mobile editing",
        body: "Not “responsive admin for emergencies” — full editing on mobile. Wix mobile admin is limited, GoDaddy's too. Sanity is the same on phone as on desktop.",
      },
      {
        num: "03",
        title: "Multi-language at no extra tier",
        body: "GoDaddy charges for a separate tier. Webflow uses workarounds. Wix wants the higher plan. Sanity has it built in, free.",
      },
      {
        num: "04",
        title: "SEO without add-ons",
        body: "Schema.org, sitemap, redirects, OG images — fields on every document. No Yoast equivalents. No extra subscriptions.",
      },
      {
        num: "05",
        title: "Free for teams up to 5",
        body: "GoDaddy Business for a team — from £25/mo. Webflow for a team — from £39/mo. Sanity for up to 5 editors — £0.",
      },
      {
        num: "06",
        title: "Open-source, full export",
        body: "If you decide to leave in 5 years — the Studio stays with you, content exports to JSON. No constructor offers this.",
      },
    ],
    foot: (
      <>
        You were paying £25–80/mo for the platform + plugins. Now you
        pay £0/mo for the admin. Only hosting — £0–20 on
        Vercel/Cloudflare. Annual savings: <strong>£300–960</strong>.
      </>
    ),
  },
  patterns: {
    eyebrow: "/ 07 ACROSS 47 MIGRATIONS",
    heading: (
      <>
        What we see <em>on a typical builder migration.</em>
      </>
    ),
    sub: "12 of our 47 projects were from GoDaddy, Webflow, Wix, and Squarespace. Here are the typical before/after numbers:",
    headers: {
      metric: "Metric",
      before: "Before (on builder)",
      after: "After (Next.js)",
    },
    rows: [
      {
        metric: "LCP (mobile)",
        before: "3.5–5 seconds",
        after: "under 1 second (4× faster)",
      },
      {
        metric: "Inquiries/month",
        before: "flat plateau",
        after: "+30–80% within 60 days",
      },
      {
        metric: "Google rankings",
        before: "position 5–15 for target keywords",
        after: "mostly top-5, some top-3",
      },
      {
        metric: "Monthly cost",
        before: "£25–80",
        after: "£0–20 (Vercel/Cloudflare only)",
      },
      {
        metric: "Time to edit content",
        before: "5–15 min via builder UI",
        after: "1–3 min via Sanity, from your phone",
      },
    ],
    foot: "Exact numbers for your project after a free 30-minute consult — we'll look at your site and current analytics.",
  },
  filter: {
    eyebrow: "/ 08 STRAIGHT TALK",
    heading: (
      <>
        What we <em>don&apos;t do.</em>
      </>
    ),
    sub: "Not every builder migration makes sense. Here's when we'll say no:",
    items: [
      {
        title: "Webflow with your custom design across 200+ pages",
        body: "Rebuild from scratch is more expensive than staying. Webflow Enterprise or a custom CMS on Webflow is the better call.",
      },
      {
        title: "Wix VIP with custom code you wrote in Velo",
        body: "If you've invested in Wix Velo logic, that's a separate scope. We'll tell you straight — either we rebuild as a new project (£14k+) or you stay.",
      },
      {
        title: "Squarespace store with 1,000+ products",
        body: "Your real competitor is Shopify, not custom code. We'll point you to a specialist.",
      },
    ],
    foot: "If your case isn't on this list, talk to us. The free 30-minute consult will tell you straight.",
  },
  pricing: {
    eyebrow: "/ 09 MIGRATION PRICING",
    heading: (
      <>
        What it costs to <em>leave a builder.</em>
      </>
    ),
    sub: (
      <>
        Usually <strong>cheaper</strong> than a WordPress migration — less
        custom logic to bring over. Price in the brief, no “request a quote.”
      </>
    ),
    tiers: [
      {
        name: "Landing migration",
        price: formatPrice(1000, { locale: "en" }),
        priceLabel: "from",
        weeks: "1–2 weeks",
        includes: {
          heading: "Who it's for",
          items: [
            "GoDaddy / Wix / Webflow one-pager",
            "Up to 5 pages",
            "301 redirects from old URLs",
            "Media transfer",
            "30-day monitoring",
          ],
        },
        ctaLabel: "Estimate landing",
      },
      {
        popular: true,
        popularLabel: "★ MOST POPULAR",
        name: "Site migration",
        price: formatPrice(3000, { locale: "en" }),
        priceLabel: "from",
        weeks: "3–6 weeks",
        includes: {
          heading: "Everything in landing, plus",
          items: [
            "Up to 30 pages",
            "CMS, blog, forms",
            "Integrations (Mailchimp / Stripe / GoCardless) reconnected",
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
            "Webflow CMS with 50+ items",
            "Squarespace store up to 200 SKUs",
            "Multi-language",
            "Custom API",
            "Dedicated team",
          ],
        },
        ctaLabel: "Talk through complex",
        ctaGhost: true,
      },
    ],
    foot: (
      <>
        Every tier includes: 301 redirects from all old URLs, content and
        media transfer, schema.org, 30-day post-launch monitoring, 1-year
        warranty. <strong>No subscriptions after launch.</strong>
      </>
    ),
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
        a: "No. Across 47 projects — zero drops longer than a week. We build a complete 301 redirect map from every old URL to the new one. We watch Search Console daily for the first 30 days.",
      },
      {
        q: "What happens to my domain?",
        a: "It stays yours. We just switch DNS. Users don't notice, and to Google it's the same domain.",
      },
      {
        q: "What about my Google Analytics history?",
        a: "It all stays. GA4 is tied to a property, not to a site. We hook the new version up — history sits in the same account.",
      },
      {
        q: "Can I still edit the site easily after migration?",
        a: "Yes. Sanity Studio works on mobile, the interface is simpler than Webflow and more reliable than Wix. Free for teams up to 5 editors.",
      },
      {
        q: "I have Mailchimp connected to GoDaddy — will it still work?",
        a: "Yes. We reconnect to Mailchimp directly via the API — usually faster than through GoDaddy's wrapper.",
      },
      {
        q: "I'm using Wix Stores with checkout — how does that move?",
        a: "We connect Stripe or GoCardless directly. Faster checkout, lower fees, no extra subscription.",
      },
      {
        q: "How do I export my data from the builder?",
        a: "We do it for you. GoDaddy — via Zero Block + content parsing. Webflow — via CMS API. Wix/Squarespace — scraping and manual transfer.",
      },
      {
        q: "What about the SEO settings I configured in Yoast / the builder's SEO plugin?",
        a: "Titles, meta descriptions, OG tags transfer 1-for-1. Schema.org — we usually upgrade it, adding what the builder skipped.",
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
    sub: "Calculator, no form, real price up front. Or let's talk for 30 minutes — we'll look at your builder and give you a timeline and price.",
    cards: [
      {
        icon: Calendar,
        title: "Migration calculator",
        body: "Pick site type and page count — get an estimate in 60 seconds.",
        cta: "Open calculator →",
        href: "/calculator?source=vs-constructors",
        featured: true,
      },
      /* CALENDLY DISABLED — see docs/calendly-disabled.md
      {
        icon: MessageCircle,
        title: "30-min consult",
        body: "Zoom with the founder. We'll show real builder migration cases.",
        cta: "Book now →",
        href: SITE_CONTACT.calendly,
      },
      */
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
