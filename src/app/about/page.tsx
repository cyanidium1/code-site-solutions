import type { Metadata } from "next";
import {
  Linkedin,
  Send,
  Github,
  Music2,
  Instagram,
  Eye,
  Zap,
  Github as GithubLogo,
  MessageSquare,
  Shield,
  Globe,
  Building,
  UserRound,
  FileCode,
} from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { TeamSection } from "@/components/about/team-section";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  HpFooter,
  Bento,
  Process,
  Cases,
  Stack,
  FinalCta3,
  type BentoCell,
} from "@/components/homepage";
import {
  ORG_ID,
  SITE_CONTACT,
  SITE_ORIGIN,
  WEBSITE_ID,
  pageUrl,
} from "@/lib/site";
import type { RichText } from "@/lib/rich-text";

export const metadata: Metadata = {
  title: "Про нас — Code-Site.Art, бутик-студія з Києва",
  description:
    "12 людей, які роблять сайти, що приносять заявки. Бутик-студія з Києва: 47 проєктів за 3 роки у 4 країнах: UA · EU · US · DK. Договір з фіксованою сумою і неустойкою за зрив.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Про нас — Code-Site.Art, бутик-студія з Києва",
    description:
      "12 людей, які роблять сайти, що приносять заявки. 47 проєктів за 3 роки у 4 країнах: UA · EU · US · DK.",
    type: "website",
    locale: "uk_UA",
    url: "/about",
  },
};

/* ─── Placeholder visuals ────────────────────────────────────────────────── */

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

function FounderAvatar() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at 30% 30%, oklch(0.55 0.18 295) 0%, oklch(0.20 0.08 280) 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "linear-gradient(180deg, oklch(0.7 0.14 295), oklch(0.55 0.18 295))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Manrope, sans-serif",
          fontWeight: 700,
          fontSize: 64,
          color: "var(--bg)",
          letterSpacing: "-0.02em",
          boxShadow: "0 0 80px oklch(0.55 0.18 295 / 0.45)",
        }}
      >
        FA
      </div>
    </div>
  );
}

/* ─── Founder socials row (під картку засновника) ────────────────────────── */

const FOUNDER_SOCIALS = [
  { Icon: Linkedin, href: "https://www.linkedin.com/in/fediralpatov/", label: "LinkedIn" },
  { Icon: Github, href: "https://github.com/fedirdev", label: "GitHub" },
  { Icon: Send, href: "https://t.me/fedirdev", label: "Telegram" },
  { Icon: Music2, href: "https://www.tiktok.com/@cyanidium.dev", label: "TikTok" },
  { Icon: Instagram, href: "https://www.instagram.com/cyanidium/", label: "Instagram" },
];

function FounderSocials() {
  return (
    <section
      style={{
        padding: "0 24px 64px",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          / find Fedir online
        </span>
        <div
          style={{
            display: "inline-flex",
            gap: 8,
            padding: "10px 14px",
            border: "1px solid var(--line)",
            borderRadius: 999,
            background: "oklch(1 0 0 / 0.03)",
          }}
        >
          {FOUNDER_SOCIALS.map((s) => {
            const Icon = s.Icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  color: "var(--ink-2)",
                  transition: "color 0.2s, background 0.2s",
                }}
              >
                <Icon size={16} strokeWidth={1.6} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Values (Bento, 6 cells) ────────────────────────────────────────────── */

const VALUES_CELLS: BentoCell[] = [
  {
    icon: Eye,
    title: "Чистий код",
    body: "Пишемо так, щоб через 2 роки інший розробник продовжив роботу за тиждень, а не за місяць переписував з нуля. Ваш сайт не залежить від нас особисто.",
    span: "1x1",
  },
  {
    icon: Zap,
    title: "Швидкість завантаження",
    body: "Lighthouse 90+ балів зі старту. Сторінки вантажаться менше секунди. Кожна секунда затримки — це -7% конверсії.",
    span: "1x1",
  },
  {
    icon: GithubLogo,
    title: "Надійність",
    body: "Код у вашому GitHub з першого комміту. Договір з фіксованою сумою і неустойкою 30% за зрив термінів. Якщо хтось у команді хворіє — проєкт не зупиняється.",
    span: "1x1",
  },
  {
    icon: MessageSquare,
    title: "Чесність",
    body: "Якщо щось не входить у пакет — кажемо до підпису, не після. Якщо технічно неможливо — кажемо. Ціни в брифі, не «під запит».",
    span: "1x1",
  },
  {
    icon: Shield,
    title: "Підтримка",
    body: "1 рік гарантії включений у ціну. Зламалося не з вашої вини — фіксимо за 4 робочі години. Перші 2 місяці — безкоштовні правки.",
    span: "1x1",
  },
  {
    icon: Globe,
    title: "Зручність комунікації",
    body: "Працюємо у вашому таймзоні. Раз на тиждень — статус-апдейт. Усі правки фіксуються в Notion, ви завжди знаєте, на якому етапі проєкт.",
    span: "1x1",
  },
];

/* ─── vs cards (Bento, 3 cells, 1x1) ─────────────────────────────────────── */

const VS_CELLS: BentoCell[] = [
  {
    icon: Building,
    title: "vs Велика агенція",
    body: (
      <>
        <p>
          Велика агенція коштує $15-50k. Ваш проєкт — один із тридцяти. До
          розробника ви говорите через двох менеджерів. Швидкість прийняття
          рішень — тиждень.
        </p>
        <p>
          У нас — $1.5-8k. Ви говорите з тех-лідом і дизайнером напряму.
          Рішення — за день.
        </p>
      </>
    ),
    span: "1x1",
  },
  {
    icon: UserRound,
    title: "vs Фрилансер",
    body: (
      <>
        <p>
          Фрилансер дешевше — $500-3k. Але немає договору, гарантії і
          неустойки. Захворів — ваш проєкт став. Зник — ви на нулі.
        </p>
        <p>
          У нас — договір, фіксований дедлайн, неустойка 30% за зрив. 12
          людей — хтось завжди закриє ваш проєкт.
        </p>
      </>
    ),
    span: "1x1",
  },
  {
    icon: FileCode,
    title: "vs WordPress / конструктори",
    body: (
      <>
        <p>
          WordPress і Tilda — швидко, але дорого в підтримці: $500/рік плагіни
          + $300/рік оновлення. Сайт ламається після кожного апдейту плагіна.
        </p>
        <p>
          Custom-код на Next.js — швидший у 3 рази. Не залежить від плагінів.
          Код у вашому GitHub. Платите один раз, володієте назавжди.
        </p>
      </>
    ),
    span: "1x1",
  },
];

/* ─── FAQ items ──────────────────────────────────────────────────────────── */

const ABOUT_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Скільки людей у команді?",
    a: [
      { em: "12 людей" },
      ". 4 — ключове ядро, з яким ви спілкуєтеся напряму: тех-лід (Федір), дизайнер (Діана), фронтенд (Ольга), SEO/маркетинг (Кристина). За ними 8 спеціалістів у фоновій роботі: 4 розробники, 2 дизайнери, 2 QA-інженери. Це той розмір, де якість тримається, а ви знаєте кожного, хто причетний до вашого сайту.",
    ],
  },
  {
    q: "Ви робите проекти за кордоном?",
    a: [
      "Так. Клієнти в Україні, ",
      { em: "Данії" },
      ", ЄС і США. Працюємо у вашому таймзоні.",
    ],
  },
  {
    q: "Як швидко ви відповідаєте на запити?",
    a: [
      "У робочий час — ",
      { em: "30 хв" },
      " у Telegram, 4 години — на email. У вихідні — наступного робочого дня. Терміни на підтримку прописані в договорі.",
    ],
  },
  {
    q: "Чи можна зустрітися особисто?",
    a: [
      "Так — у ",
      { em: "Києві" },
      ", в офісі або кав'ярні на ваш вибір. Якщо ви не в Києві — Zoom 30 хвилин безкоштовно.",
    ],
  },
  {
    q: "Чи можу побачити приклади незавершених проектів?",
    a: [
      "Так, під ",
      { em: "NDA" },
      ". На дзвінку покажемо staging, GitHub-комміти і поточний процес. Публічно work-in-progress без згоди клієнтів не показуємо.",
    ],
  },
  {
    q: "Чи беретеся за маленькі проекти ($1-3k)?",
    a: [
      "Так, якщо це ",
      { em: "лендінг або проста промо-сторінка" },
      " з конкретною бізнес-задачею. Не беремося за «ще одну сторінку до існуючого WordPress» — це не наша експертиза.",
    ],
  },
  {
    q: "Чи беретеся за enterprise проекти ($30k+)?",
    a: [
      "Так, але ",
      { em: "обмежено" },
      ". Беремо 1-2 enterprise-проєкти на квартал, бо вони з'їдають половину команди на 3+ місяці. Якщо у вас такий проєкт — пишіть напряму засновнику.",
    ],
  },
  {
    q: "Чи робите ребрендинг або логотип?",
    a: [
      { em: "Ні" },
      ", це не наша експертиза. Брендинг — окрема студія. Можемо рекомендувати 3 перевірених брендингових партнерів в Україні і ЄС.",
    ],
  },
];

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const ABOUT_URL = pageUrl("/about");
const FOUNDER_ID = `${ABOUT_URL}#fedir-alpatov`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${ABOUT_URL}#aboutpage`,
      url: ABOUT_URL,
      name: "Про нас — Code-Site.Art",
      description:
        "12 людей, які роблять сайти, що приносять заявки. 47 проєктів за 3 роки у 4 країнах: UA · EU · US · DK.",
      inLanguage: "uk",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
    },
    {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: "Fedir Alpatov",
      jobTitle: "Founder, Code-Site.Art",
      worksFor: { "@id": ORG_ID },
      sameAs: [
        "https://www.linkedin.com/in/fediralpatov/",
        SITE_CONTACT.telegram,
        "https://www.tiktok.com/@cyanidium.dev",
        "https://www.instagram.com/cyanidium/",
      ],
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Code-Site.Art",
      url: SITE_ORIGIN,
      email: SITE_CONTACT.email,
      telephone: SITE_CONTACT.phone,
      foundingDate: "2023",
      founder: { "@id": FOUNDER_ID },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kyiv",
        addressCountry: "UA",
      },
      areaServed: ["UA", "EU", "US", "DK"],
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
          name: "Про нас",
          item: ABOUT_URL,
        },
      ],
    },
  ],
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function AboutPage() {
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
          { label: "Про нас" },
        ]}
        eyebrow="/ ABOUT"
        headline={
          <>
            12 людей, які роблять сайти, що{" "}
            <em>приносять заявки</em>
          </>
        }
        sub={
          <>
            Бутик-студія з Києва. 47 проєктів за 3 роки у 4 країнах. Спілкуєтеся
            напряму з людьми, які пишуть код і малюють дизайн — без
            аккаунт-менеджерів-фільтрів і без «перевідправлю питання команді».
          </>
        }
      />

      {/* Section 2: Stats */}
      <StatsBar
        items={[
          { value: "47", label: "проєктів за 3 роки" },
          { value: "UA · EU · US · DK", label: "країни запуску" },
          { value: "4.9/5", label: "середня оцінка" },
          { value: "×3.2", label: "більше заявок у середньому" },
        ]}
      />

      {/* Section 3: Хто ми */}
      <ImageText
        variant="side"
        imageVariant="imageRight"
        eyebrow="/ 02 ABOUT"
        heading={
          <>
            Не агенція. <em>Не фрилансер.</em>
          </>
        }
        body={[
          "Ми навмисно не ростемо до 50 співробітників. У великих агенціях ваш проєкт — один із тридцяти, і ним займається менеджер, а не той, хто пише код. У фрилансера ваш проєкт залежить від однієї людини, яка може зникнути на 3 тижні.",
          "12 людей — це той розмір, де команда тримає високу якість, а ви знаєте кожного, хто причетний до вашого сайту. З 2022 року робимо проєкти для клінік, юридичних і бухгалтерських фірм, ремонтних компаній, e-commerce та SaaS — переважно в Україні та ЄС.",
        ]}
        image={
          <GradPlaceholder
            from="oklch(0.50 0.18 280)"
            to="oklch(0.30 0.10 240)"
            label="команда · 2026"
          />
        }
      />

      {/* Section 4: Founder — тимчасово приховано до готовності контенту */}
      {false && (
        <>
          <ImageText
            variant="side-with-list"
            imageVariant="imageLeft"
            eyebrow="/ 03 FOUNDER"
            heading={
              <>
                Fedir <em>Alpatov</em>
              </>
            }
            body={[
              "Засновник Code-Site.Art. До студії — 8+ років у розробці на різних позиціях: фріланс, продуктові команди, агенції.",
              "Code-Site.Art відкрив у 2023 коли побачив, скільки часу і грошей клієнти зливають у WordPress, плагіни, фрилансерів-одинаків. Зробив студію, яка робить навпаки: custom-код, прозорий прайс, фіксовані терміни.",
            ]}
            bulletList={[
              "8+ років у веб-розробці",
              "47 проєктів за 3 роки як founder",
              "Спеціалізація: Next.js, Astro, headless CMS",
              "Спікер на українських dev-конференціях",
              "Open-source contributor",
            ]}
            cta={{
              label: "Написати в Telegram",
              href: "https://t.me/fedirdev",
            }}
            image={<FounderAvatar />}
          />
          <FounderSocials />
        </>
      )}

      {/* Section 5: Team */}
      <TeamSection
        eyebrow="/ 04 TEAM"
        heading={
          <>
            12 людей. Чотирьох ви будете чути <em>щодня</em>.
          </>
        }
        sub="Це ключове ядро — з ким ви будете спілкуватися безпосередньо: тех-лід, дизайнер, фронтенд, маркетинг. За ними ще 8 людей у фоновій роботі: 4 розробники, 2 дизайнери, 2 QA-інженери. Ви бачите результат — не процес."
      />

      {/* Section 6: Values */}
      <Bento
        eyebrow="/ 05 VALUES"
        heading={
          <>
            На чому ми <em>не економимо</em>
          </>
        }
        cells={VALUES_CELLS}
      />

      {/* Section 7: Stack */}
      <Stack
        eyebrow="/ 06 STACK"
        heading={
          <>
            Технології, у яких ми <em>ходимо в глибину</em>
          </>
        }
        sub="Не пробуємо все підряд. 10 інструментів, у яких ми сильні. Без експериментів на ваших грошах."
      />

      {/* Section 8: vs */}
      <Bento
        eyebrow="/ 07 DIFFERENCE"
        heading={
          <>
            Чим ми <em>відрізняємося</em> від інших
          </>
        }
        cells={VS_CELLS}
      />

      {/* Section 9: Process */}
      <Process
        eyebrow="/ 08 PROCESS"
        heading={
          <>
            Як ми <em>працюємо</em>
          </>
        }
        ctaLabel="Детальніше про процес"
        ctaHref="/process"
      />

      {/* Section 10: Cases */}
      <Cases
        eyebrow="/ 09 CASES"
        heading={
          <>
            Реальні кейси з <em>реальними</em> метриками
          </>
        }
      />

      {/* Section 11: FAQ */}
      <section style={{ background: "var(--bg)" }}>
        <FAQ heading="Часті питання про нас" items={ABOUT_FAQ} />
      </section>

      {/* Section 12: Final CTA */}
      <FinalCta3
        eyebrow="/ 10 GET IN TOUCH"
        heading={
          <>
            <em>30 хвилин</em> — і ви знатимете, чи підходимо одне одному
          </>
        }
        sub="Без зобов'язань. Покажемо реальні кейси, послухаємо вашу задачу і чесно скажемо, чи зможемо зробити те, що вам потрібно."
      />

      <HpFooter />
    </>
  );
}
