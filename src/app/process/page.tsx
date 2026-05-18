import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import {
  VerticalTimeline,
  type TimelineStep,
} from "@/components/blocks/vertical-timeline";
import { HpHeader, HpFooter } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";
import { plainRich, type RichText } from "@/lib/rich-text";

export const metadata: Metadata = {
  title:
    "Процес роботи — 7 кроків від брифу до запуску | Code-Site.Art",
  description:
    "Як ми робимо сайти за 4-10 тижнів. Прозорий процес з фіксованими дедлайнами, гарантією 1 рік і неустойкою 30% за зрив. Без сюрпризів.",
  alternates: { canonical: "/process" },
  openGraph: {
    title:
      "Процес роботи — 7 кроків від брифу до запуску | Code-Site.Art",
    description:
      "Прозорий процес з фіксованими дедлайнами, гарантією 1 рік і неустойкою 30% за зрив.",
    type: "website",
    locale: "uk_UA",
    url: "/process",
  },
};

/* ─── Placeholder visual ─────────────────────────────────────────────────── */

function GradPlaceholder({
  from,
  to,
  label,
}: {
  from: string;
  to: string;
  label?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.5,
        }}
      />
      {label ? (
        <span
          style={{
            position: "relative",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

/* ─── 7 timeline steps ───────────────────────────────────────────────────── */

const STEPS: TimelineStep[] = [
  {
    n: "01",
    title: "Бриф",
    duration: "1 день · безкоштовно",
    body: "30-хв дзвінок або Telegram-чат. Розбираємо задачу, цілі, аудиторію, бюджет, термін, референси. На виході — точна вилка ціни і рекомендація щодо пакету.",
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Слухаємо задачу і ставимо уточнюючі питання",
        "Аналізуємо 2-3 ваших конкурентів",
        "Даємо рекомендацію щодо тиру і термінів",
        "Озвучуємо точну вилку ціни",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Розповідаєте про бізнес і ціль сайту",
        "Даєте 3-5 сайтів-референсів",
        "Озвучуєте бюджет і дедлайн (якщо є)",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Письмова оцінка (PDF) з вилкою ціни і термінів",
        "Рекомендація щодо пакету і scope",
        "Список наступних кроків і timeline",
      ],
    },
  },
  {
    n: "02",
    title: "Договір і передоплата",
    duration: "1-3 дні",
    body: (
      <>
        Підписуємо договір — Diia.Sign або PDF з підписом. Ви робите 50% передоплати. На договорі — фіксована сума, фіксований термін, неустойка за зрив з нашої вини.
      </>
    ),
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Складаємо договір з фіксованою сумою",
        "Прописуємо etapи з deliverables",
        "Виставляємо рахунок на 50% передоплати",
        "Робимо kickoff після оплати",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Перечитуєте договір, ставите запитання",
        "Підписуєте через Diia.Sign або PDF",
        "Робите 50% передоплати (ФОП-безнал, Stripe, USDT, Mono)",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Підписаний договір з фіксованими термінами",
        "Право на 2 повних раунди правок дизайну",
        "Право на неустойку 30% за зрив термінів",
      ],
    },
  },
  {
    n: "03",
    title: "Дизайн",
    duration: "1-2 тижні",
    body: (
      <>
        Створюємо макети у Figma. Спершу moodboard, потім головна, далі — внутрішні. 2 повних раунди правок включені. Ви бачите і затверджуєте кожен етап.
      </>
    ),
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Збираємо moodboard з референсів і вашого бренду",
        "Дизайнимо головну (1-3 версії на вибір)",
        "Після підтвердження — дизайнимо внутрішні",
        "Адаптуємо під mobile (375px) і tablet",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Затверджуєте moodboard (1-2 ітерації)",
        "Затверджуєте дизайн головної (2 раунди правок)",
        "Перевіряєте mobile-версії на телефоні",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Figma-файл з повним дизайном (всі сторінки + states)",
        "Mobile + Tablet + Desktop макети",
        "Передача прав на дизайн (вам належить)",
      ],
    },
  },
  {
    n: "04",
    title: "Розробка",
    duration: "2-6 тижнів",
    body: (
      <>
        Пишемо код на Next.js + Sanity. Коммітимо щодня в GitHub. Раз на тиждень — screencast прогресу 3-5 хв. Telegram-чат — щоденний.
      </>
    ),
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Пишемо код у вашому GitHub-репо",
        "Коммітимо щодня (видно весь прогрес)",
        "Записуємо щотижневий screencast",
        "Підключаємо інтеграції (CRM, аналітика, форми)",
        "Створюємо адмінку (Sanity або Strapi)",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Заповнюєте контент в адмінці",
        "Перевіряєте щотижневі screencast'и",
        "Питаєте в Telegram якщо щось незрозуміло",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Доступ до GitHub-репо з першого коміту",
        "Staging-URL для перегляду в реальному часі",
        "Адмінка з вашими даними логіну",
        "Документація як редагувати",
      ],
    },
  },
  {
    n: "05",
    title: "Тестування",
    duration: "1 тиждень",
    body: (
      <>
        Прогінаємо 60-точковий QA-чек-ліст. Тестуємо на 5 девайсах і 3 браузерах. Запускаємо Lighthouse-аудит. Ви проходите свій 10-точковий чек-ліст і затверджуєте.
      </>
    ),
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Прогінаємо 60-point QA checklist",
        "Тестуємо на iPhone, Android, iPad, Chrome/Safari/Firefox",
        "Lighthouse — ціль 90+ Performance, 95+ SEO/A11y",
        "Перевіряємо всі форми, інтеграції, аналітику",
        "Schema.org через Rich Results Test",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Проходите 10-pt чек-ліст (надсилаємо)",
        "Тестуєте всі форми зі своєю поштою",
        "Затверджуєте до запуску",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "QA-звіт з 60 пунктів",
        "Lighthouse-screenshot",
        "Список фіксів якщо є + дата виправлення",
      ],
    },
  },
  {
    n: "06",
    title: "Запуск",
    duration: "1 день",
    body: (
      <>
        Міграція на ваш домен. Налаштовуємо Search Console + Analytics + 301-redirect зі старого сайту. Ви робите фінальні 50% і отримуєте всі доступи.
      </>
    ),
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Налаштовуємо домен (DNS, SSL)",
        "Production deploy на Vercel/Cloudflare",
        "301-redirects зі старих URL",
        "Сабмітимо sitemap у Search Console",
        "Передаємо доступи (хостинг, CMS, GitHub, Analytics)",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Робите фінальний 50% платіж",
        "Перевіряєте сайт на live-домені",
        "Підписуєте acceptance-протокол",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Робочий сайт на вашому домені",
        "Доступи до всіх систем",
        "Документація як управляти і публікувати",
        "1-годинне навчання адмінки (Zoom)",
      ],
    },
  },
  {
    n: "07",
    title: "Підтримка",
    duration: "+ 1 рік (включено)",
    body: (
      <>
        Виправляємо будь-які баги безкоштовно. Оновлюємо залежності. Консультуємо. Якщо щось зламалося не з вашої вини — фіксимо за 4 робочі години в робочий час.
      </>
    ),
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Виправляємо баги (4 робочі години в робочий час)",
        "Оновлюємо залежності",
        "Консультуємо по адмінці і контенту",
        "Перевіряємо security раз на квартал",
        "Робимо backup щотижня",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Пишете в Telegram або email якщо щось не так",
        "Робите беккапи свого контенту в Sanity (опційно)",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Безкоштовна підтримка 365 днів від запуску",
        "Quarterly security check",
        "Опція пакету підтримки після року ($200-500/міс)",
      ],
    },
  },
];

/* ─── What-if FAQ ────────────────────────────────────────────────────────── */

const PROCESS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Що якщо ми зриваємо термін з нашої вини?",
    a: [
      "Платимо неустойку ",
      { em: "30% від суми контракту" },
      ". Прописано в договорі. За 2 роки роботи такий випадок був 1 раз — автоматично перерахували клієнту знижку. Ваш ризик — нуль.",
    ],
  },
  {
    q: "Що якщо я хочу більше правок ніж 2 раунди дизайну?",
    a: [
      "Кожен додатковий раунд — погодинна ставка ",
      { em: "$40/год" },
      ". Зазвичай повний раунд правок займає 4-8 годин роботи дизайнера. Тобто 3-й раунд = $160-320. Прозоро, без сюрпризів.",
    ],
  },
  {
    q: "Що якщо результат дизайну мені не подобається?",
    a: [
      "На етапі дизайну є 2 повних раунди правок. Якщо після другого раунду фундаментально не подобається — повертаємо ",
      { em: "70% передоплати" },
      " і розходимось. Краще ніж тягнути проект через силу. За 2 роки таке було 1 раз.",
    ],
  },
  {
    q: "Що якщо мені потрібні зміни вже після запуску?",
    a: [
      { em: "1 рік гарантії" },
      ": виправлення багів і дрібні правки безкоштовно. Нові фічі — $40/год або monthly retainer $200-500/міс. Великий редизайн — окремий проект з фіксованою ціною.",
    ],
  },
  {
    q: "Що якщо я хочу змінити scope посеред проекту?",
    a: [
      "Можна. Якщо в межах ",
      { em: "±20% обсягу" },
      " — без зміни ціни. Якщо більше — переоцінюємо і виставляємо доплату або повертаємо різницю. Все прописується в supplementary agreement.",
    ],
  },
  {
    q: "Що якщо я не маю часу заповнювати контент?",
    a: [
      "Можемо порекомендувати копірайтера ($200/стаття) або взяти контент-наповнення на себе (",
      { em: "$300-500/блок" },
      "). Або запустити сайт з placeholder-контентом і доповнити через 2-3 тижні.",
    ],
  },
  {
    q: "Що якщо у мене зріє новий проект через 6 місяців?",
    a: [
      "Постійним клієнтам ",
      { em: "знижка 10%" },
      " на наступні проекти. Перший рік підтримки — безкоштовний. Якщо проект пов'язаний (наприклад, mobile-app до сайту) — обговорюємо інтеграцію без додаткових інтеграційних коштів.",
    ],
  },
  {
    q: "Що якщо мені треба термінова правка під подію?",
    a: [
      "В робочий час — за 4 години. Поза робочим часом / у вихідні — emergency-ставка ",
      { em: "$80/год" },
      ". Або вкажіть подію в брифі заздалегідь — забезпечимо буфер до неї.",
    ],
  },
];

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const PROCESS_URL = pageUrl("/process");

const HOWTO_STEPS = STEPS.map((s, i) => ({
  "@type": "HowToStep",
  position: i + 1,
  name: s.title,
  text: typeof s.body === "string" ? s.body : `${s.title} — ${s.duration}`,
  url: `${PROCESS_URL}#step-${s.n}`,
}));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "@id": `${PROCESS_URL}#howto`,
      name: "Процес розробки сайту — 7 кроків від брифу до запуску",
      description:
        "Покроковий процес створення сайту в Code-Site.Art: від брифу і договору до запуску і підтримки.",
      totalTime: "P10W",
      step: HOWTO_STEPS,
      provider: { "@id": ORG_ID },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Головна",
          item: SITE_ORIGIN,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Процес",
          item: PROCESS_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: PROCESS_FAQ.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: plainRich(it.a),
        },
      })),
    },
  ],
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ProcessPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      {/* Section 1: Page hero */}
      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Процес" },
        ]}
        eyebrow="/ PROCESS · 4-10 WEEKS END-TO-END"
        headline={
          <>
            <em>9 речей</em>, які ми зробимо за вас. Без вашої участі більше ніж 5 годин.
          </>
        }
        sub="Не пишете ТЗ. Не шукаєте референси. Не ловите фотографа. Ви розповідаєте про бізнес 30 хвилин — і отримуєте готовий сайт за 4-10 тижнів."
      />

      {/* Section 2: Stats bar */}
      <StatsBar
        items={[
          { value: <>4-10</>, label: "тижнів запуск" },
          { value: <>5 год</>, label: "від замовника total" },
          { value: <>100%</>, label: "фіксована ціна" },
          { value: <>30%</>, label: "неустойка за зрив" },
        ]}
      />

      {/* Section 3: Vertical timeline (7 steps) */}
      <VerticalTimeline steps={STEPS} />

      {/* Section 4: Communication */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="/ COMMUNICATION"
        heading={
          <>
            Як ми <em>спілкуємось</em> протягом проекту
          </>
        }
        body="Ви не зникаєте на 6 тижнів і не отримуєте сайт «зненацька». Кожен етап — checkpoint, де ви бачите і затверджуєте."
        bulletList={[
          "Telegram-чат щоденно — відповідаємо за 30 хв в робочий час",
          "Раз на тиждень — screencast прогресу 3-5 хв",
          "Email-репорт раз на тиждень з milestone-статусом",
          "Zoom-дзвінок раз на спринт (опційно, на ваш запит)",
          "GitHub-комміти видно щодня — повна прозорість",
          "Staging-URL для перегляду в реальному часі",
          "Якщо вас немає тиждень — пауза проекту, дедлайн зсувається",
        ]}
        image={
          <GradPlaceholder
            from="oklch(0.50 0.18 230)"
            to="oklch(0.45 0.20 295)"
            label="communication · transparent"
          />
        }
      />

      {/* Section 5: What-if FAQ */}
      <section style={{ background: "var(--bg)" }}>
        <FAQ heading="Що якщо…?" items={PROCESS_FAQ} />
      </section>

      {/* Section 6: Final CTA */}
      <CtaBanner
        eyebrow="/ READY?"
        heading={
          <>
            Готові пройти <em>процес</em> з нами?
          </>
        }
        sub="Перший крок безкоштовний. 30-хв консультація — і ви знаєте точну вилку ціни і термінів."
        ctaPrimary={{
          label: "Розрахувати вартість →",
          href: "/calculator",
        }}
        ctaSecondary={{
          label: "Або обговорити з нами",
          href: "/contacts",
        }}
      />

      <HpFooter />
    </>
  );
}
