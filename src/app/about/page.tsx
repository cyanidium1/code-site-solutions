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
import { TeamCards } from "@/components/blocks/team-cards";
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

export const metadata: Metadata = {
  title: "Про нас — Code-Site.Art, бутик-студія з Києва",
  description:
    "Невелика команда сильних сеньйорів. Робимо custom-coded сайти для бізнесу з 2023 року. 30+ проектів в Україні, ЄС, США, Данії.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Про нас — Code-Site.Art, бутик-студія з Києва",
    description:
      "Невелика команда сильних сеньйорів. Custom-coded сайти для бізнесу з 2023 року.",
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

const ABOUT_FAQ = [
  {
    q: "Скільки людей у команді?",
    a: "Постійне ядро — Fedir + 2 контрактори (senior-дизайнер, backend-розробник). Для більших проектів підключаємо до <em>5-7 людей</em> з перевіреної мережі: 2-3 frontend, контент-маркетолог, SEO-спеціаліст, QA. Все — наші партнери з 2+ років співпраці.",
  },
  {
    q: "Ви робите проекти за кордоном?",
    a: "Так. Маємо клієнтів у <em>Данії</em> (NBYG Bornholm), Україні, ЄС, США. Працюємо в таймзоні клієнта — українські клієнти отримують активний робочий час, європейські — 09:00-17:00 CET, американські (East Coast) — overlap до 14:00 EST.",
  },
  {
    q: "Як швидко ви відповідаєте на запити?",
    a: "Telegram (@fedirdev): <em>30 хв</em> в робочий час, до 2-4 годин у вихідні. Email (hi@code-site.art): 2-4 робочі години. Телефон (+380-97-006-87-07): під час дзвінка або callback за 30 хв.",
  },
  {
    q: "Чи можна зустрітися особисто?",
    a: "Так — <em>Київ</em>. Можемо в наш офіс або в кав'ярню на ваш вибір. Якщо ви не в Києві або в іншій країні — Zoom-консультація 30 хв безкоштовно.",
  },
  {
    q: "Чи можу побачити приклади незавершених проектів?",
    a: "Так, під <em>NDA</em>. На дзвінку покажемо роботу на staging-середовищі, GitHub-комміти, dev-процес, який ми використовуємо. Розуміємо що публічно показати work-in-progress без згоди клієнтів не можемо.",
  },
  {
    q: "Чи беретеся за маленькі проекти ($1-3k)?",
    a: "Так — через <em>Starter-пакет</em>. Лендинг за 1-2 тижні. Не нав'язуємо команду чи багатотижневий процес — для одного лендингу не потрібен PM. Прямо: ви + Fedir + 1 дизайнер = запуск.",
  },
  {
    q: "Чи беретеся за enterprise проекти ($30k+)?",
    a: "Так — через <em>Enterprise-пакет</em> з SLA, dedicated team і архітектурною сесією. Підключаємо до 7 людей з нашої мережі під проект. Маємо досвід будувати SaaS, multi-language платформи, e-commerce 1000+ SKU. Якщо проект більше $50k — обговорюємо окремо, можемо дати референси.",
  },
  {
    q: "Чи робите ребрендинг або логотип?",
    a: "<em>Ні</em>, це не наша експертиза. Брендинг (логотип, фірмовий стиль, brand book) — окрема студія. Можемо рекомендувати 3-х перевірених брендингових партнерів в Україні і ЄС, з якими ми вже робили спільні проекти.",
  },
];

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://code-site.art/about#aboutpage",
      url: "https://code-site.art/about",
      name: "Про нас — Code-Site.Art",
      description:
        "Невелика команда сильних сеньйорів. Робимо custom-coded сайти для бізнесу з 2023 року.",
      inLanguage: "uk",
      isPartOf: { "@id": "https://code-site.art/#website" },
      about: { "@id": "https://code-site.art/#organization" },
    },
    {
      "@type": "Person",
      "@id": "https://code-site.art/about#fedir-alpatov",
      name: "Fedir Alpatov",
      jobTitle: "Founder, Code-Site.Art",
      worksFor: { "@id": "https://code-site.art/#organization" },
      sameAs: [
        "https://www.linkedin.com/in/fediralpatov/",
        "https://t.me/fedirdev",
        "https://www.tiktok.com/@cyanidium.dev",
        "https://www.instagram.com/cyanidium/",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://code-site.art/#organization",
      name: "Code-Site.Art",
      url: "https://code-site.art",
      email: "hi@code-site.art",
      telephone: "+380-97-006-87-07",
      foundingDate: "2023",
      founder: { "@id": "https://code-site.art/about#fedir-alpatov" },
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
          item: "https://code-site.art",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Про нас",
          item: "https://code-site.art/about",
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
        sub="Code-Site.Art — бутик-студія з Києва. Робимо custom-coded сайти для бізнесу з 2023 року. Команда в Україні, проєкти в Україні, ЄС, США, Данії."
      />

      {/* Section 2: Stats */}
      <StatsBar
        items={[
          { value: "30+", label: "проектів запущено" },
          { value: "5", label: "країн (UA, EU, US, DK)" },
          { value: "4.9/5", label: "середня оцінка" },
          { value: "з 2023", label: "року на ринку" },
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

      {/* Section 4: Founder */}
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
          "30+ проектів як founder",
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

      {/* Section 5: Team */}
      <TeamCards
        eyebrow="/ 04 TEAM"
        heading={
          <>
            Маленька команда. <em>Без</em> прошарків.
          </>
        }
        sub="Постійне ядро — Fedir + 2 контрактори, з якими працюємо постійно. Між вами і людьми, які пишуть код, немає аккаунт-менеджерів."
        members={[
          {
            name: "Fedir Alpatov",
            role: "Founder · Full-stack",
            initials: "FA",
            experience: "8+ років",
            location: "Київ",
            tag: "Available",
            spec: "Next.js, Astro, headless CMS. 30+ проектів як founder.",
            socials: [
              { kind: "li", href: "https://www.linkedin.com/in/fediralpatov/" },
              { kind: "tg", href: "https://t.me/fedirdev" },
              { kind: "gh", href: "https://github.com/fedirdev" },
              { kind: "ig", href: "https://www.instagram.com/cyanidium/" },
              { kind: "tt", href: "https://www.tiktok.com/@cyanidium.dev" },
            ],
          },
          {
            name: "Senior Designer",
            role: "Design · UX",
            initials: "SD",
            experience: "6+ років",
            location: "Київ",
            tag: "Contractor",
            spec: "Figma, дослідження користувачів, brand systems.",
            quote:
              "Дизайн без UX-research — це декорування. Кожен проект починаю з реальних користувачів, не з трендів.",
          },
          {
            name: "Backend Engineer",
            role: "Backend · DevOps",
            initials: "BE",
            experience: "7+ років",
            location: "Київ",
            tag: "Contractor",
            spec: "Node.js, Postgres, Vercel/Cloudflare. Мед.CRM, бух-системи, e-commerce.",
            quote:
              "Кожна інтеграція з legacy CRM — окрема історія. Робимо з backup-планом і feature flags, щоб ваша база не лягла на запуску.",
          },
        ]}
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
