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
    "Невелика команда сильних сеньйорів. 47 проєктів за 3 роки у 4 країнах: UA · EU · US · DK. Кастомні сайти для бізнесу з фіксованою ціною і неустойкою за зрив.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Про нас — Code-Site.Art, бутик-студія з Києва",
    description:
      "Невелика команда сильних сеньйорів. 47 проєктів за 3 роки у 4 країнах: UA · EU · US · DK.",
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
    title: "Прозорість",
    body: "Показуємо ціни в брифі, не «під запит». Без прихованих платежів. Договір з фіксованою сумою.",
    span: "1x1",
  },
  {
    icon: Zap,
    title: "Швидкість",
    body: "Запуск за 4-10 тижнів. Lighthouse 95+ зі старту. Сайти вантажаться < 1 секунди.",
    span: "1x1",
  },
  {
    icon: GithubLogo,
    title: "Власність",
    body: "Код у вашому GitHub з першого коміту. Не у нас. Ви не залежите від студії.",
    span: "1x1",
  },
  {
    icon: MessageSquare,
    title: "Чесність",
    body: "Якщо щось не входить в пакет — кажемо. Якщо технічно неможливо — кажемо. Без обіцянок навмання.",
    span: "1x1",
  },
  {
    icon: Shield,
    title: "Підтримка",
    body: "1 рік гарантії включений. Зламалося не з вашої вини — фіксимо за 4 робочі години в робочий час.",
    span: "1x1",
  },
  {
    icon: Globe,
    title: "Локалізація",
    body: "Працюємо у вашому таймзоні. Документація і комунікація: UA, RU, EN.",
    span: "1x1",
  },
];

/* ─── vs cards (Bento, 3 cells, 1x1) ─────────────────────────────────────── */

const VS_CELLS: BentoCell[] = [
  {
    icon: Building,
    title: "vs Корпоративні агентства",
    body: (
      <>
        <p>
          Ціна у 2-3 рази менша за топові UA-агенції (Wezom, KEIS). У 3-5 разів
          менша за US/UK-агенції (Practis, The Modern Firm).
        </p>
        <p>
          Спілкуєтеся напряму з розробниками — без аккаунт-менеджерів-фільтрів.
          Швидкість прийняття рішень — як у фрилансера, надійність — як у
          агентства.
        </p>
      </>
    ),
    span: "1x1",
  },
  {
    icon: UserRound,
    title: "vs Фрилансери",
    body: (
      <>
        <p>
          Договір, гарантія, неустойка 30% за зрив термінів. Команда замість
          одного «я всім займаюся».
        </p>
        <p>
          Якщо хтось хворіє — проект не зупиняється. Якщо щось зламалося після
          запуску — є хто фіксити, не зник у відпустку на 2 тижні.
        </p>
      </>
    ),
    span: "1x1",
  },
  {
    icon: FileCode,
    title: "vs WordPress / Tilda агенції",
    body: (
      <>
        <p>
          Custom-код на Next.js швидший за WordPress у 3 рази. Не залежить від
          плагінів і їх оновлень. Не зламається через дірку в чужому плагіні.
        </p>
        <p>
          Замість $500/рік плагінів + $300/рік підтримки — фіксована ціна
          проекту і ваш код у вашому GitHub.
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
      "Постійне ядро — Fedir + 2 контрактори (senior-дизайнер, backend-розробник). Для більших проектів підключаємо до ",
      { em: "5-7 людей" },
      " з перевіреної мережі: 2-3 frontend, контент-маркетолог, SEO-спеціаліст, QA. Все — наші партнери з 2+ років співпраці.",
    ],
  },
  {
    q: "Ви робите проекти за кордоном?",
    a: [
      "Так. Маємо клієнтів у ",
      { em: "Данії" },
      " (NBYG Bornholm), Україні, ЄС, США. Працюємо в таймзоні клієнта — українські клієнти отримують активний робочий час, європейські — 09:00-17:00 CET, американські (East Coast) — overlap до 14:00 EST.",
    ],
  },
  {
    q: "Як швидко ви відповідаєте на запити?",
    a: [
      "Telegram (@fedirdev): ",
      { em: "30 хв" },
      " в робочий час, до 2-4 годин у вихідні. Email (hi@code-site.art): 2-4 робочі години. Телефон (+380-97-006-87-07): під час дзвінка або callback за 30 хв.",
    ],
  },
  {
    q: "Чи можна зустрітися особисто?",
    a: [
      "Так — ",
      { em: "Київ" },
      ". Можемо в наш офіс або в кав'ярню на ваш вибір. Якщо ви не в Києві або в іншій країні — Zoom-консультація 30 хв безкоштовно.",
    ],
  },
  {
    q: "Чи можу побачити приклади незавершених проектів?",
    a: [
      "Так, під ",
      { em: "NDA" },
      ". На дзвінку покажемо роботу на staging-середовищі, GitHub-комміти, dev-процес, який ми використовуємо. Розуміємо що публічно показати work-in-progress без згоди клієнтів не можемо.",
    ],
  },
  {
    q: "Чи беретеся за маленькі проекти ($1-3k)?",
    a: [
      "Так — через ",
      { em: "Starter-пакет" },
      ". Лендинг за 1-2 тижні. Не нав'язуємо команду чи багатотижневий процес — для одного лендингу не потрібен PM. Прямо: ви + Fedir + 1 дизайнер = запуск.",
    ],
  },
  {
    q: "Чи беретеся за enterprise проекти ($30k+)?",
    a: [
      "Так — через ",
      { em: "Enterprise-пакет" },
      " з SLA, dedicated team і архітектурною сесією. Підключаємо до 7 людей з нашої мережі під проект. Маємо досвід будувати SaaS, multi-language платформи, e-commerce 1000+ SKU. Якщо проект більше $50k — обговорюємо окремо, можемо дати референси.",
    ],
  },
  {
    q: "Чи робите ребрендинг або логотип?",
    a: [
      { em: "Ні" },
      ", це не наша експертиза. Брендинг (логотип, фірмовий стиль, brand book) — окрема студія. Можемо рекомендувати 3-х перевірених брендингових партнерів в Україні і ЄС, з якими ми вже робили спільні проекти.",
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
        "Невелика команда сильних сеньйорів. 47 проєктів за 3 роки у 4 країнах: UA · EU · US · DK.",
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
            Невелика команда сильних сеньйорів. Без{" "}
            <em>корпоративної</em> шкарлупи.
          </>
        }
        sub="Code-Site.Art — бутик-студія з Києва. 47 проєктів за 3 роки у 4 країнах: UA · EU · US · DK. Команда в Україні, проєкти по всьому світу."
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
            Хто ми <em>насправді</em>
          </>
        }
        body={[
          "Ми — невелика студія, не корпорація. Між вами і людьми, які пишуть код, немає аккаунт-менеджерів і прошарків. Ви розмовляєте напряму з тими, хто буде робити ваш проект.",
          "Працюємо переважно з українським і європейським ринком: клініки, юр. фірми, бухгалтерські компанії, e-commerce, SaaS-стартапи. Англомовні клієнти — переважно бутік-бренди в ЄС і США, які хочуть європейську якість без переплати американським агенціям у 3-5 разів.",
        ]}
        image={
          <GradPlaceholder
            from="oklch(0.50 0.18 280)"
            to="oklch(0.30 0.10 240)"
            label="команда · 2025"
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
            Маленька команда. <em>Без</em> прошарків.
          </>
        }
        sub="Постійне ядро + перевірена мережа партнерів. Між вами і людьми, які пишуть код, немає аккаунт-менеджерів."
      />

      {/* Section 6: Values */}
      <Bento
        eyebrow="/ 05 VALUES"
        heading={
          <>
            Принципи, на яких <em>будуємо</em> студію
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
        sub="Не пробуємо все підряд. Вибрали 10 інструментів і знаємо їх до кістки."
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
            Готові <em>обговорити</em> проєкт?
          </>
        }
      />

      <HpFooter />
    </>
  );
}
