import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { TeamSection } from "@/components/about/team-section";
import { ValuesSecondaryRow } from "@/components/about/values-secondary-row";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  HpFooter,
  Bento,
  Process,
  Cases,
  Stack,
  FinalCta3,
} from "@/components/homepage";
import {
  ORG_ID,
  SITE_CONTACT,
  SITE_ORIGIN,
  WEBSITE_ID,
  pageUrl,
} from "@/constants/site";
import { ABOUT_FAQ, VALUES_CELLS, VS_CELLS } from "@/content/uk/about";

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

import { type CSSProperties } from "react";

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
      // eslint-disable-next-line react/forbid-dom-props -- dynamic gradient stops
      style={{ "--gp-from": from, "--gp-to": to } as CSSProperties}
      className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--gp-from)_0%,var(--gp-to)_100%)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:20px_20px] opacity-50"
      />
      {label ? (
        <span className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-white/85">
          {label}
        </span>
      ) : null}
    </div>
  );
}

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
        eyebrow="ПРО НАС"
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
        eyebrow="ПРО НАС"
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

      {/* Section 5: Team */}
      <TeamSection
        eyebrow="КОМАНДА"
        heading={
          <>
            12 людей. Чотирьох ви будете чути <em>щодня</em>.
          </>
        }
        sub="Це ключове ядро — з ким ви будете спілкуватися безпосередньо: тех-лід, дизайнер, фронтенд, маркетинг. За ними ще 8 людей у фоновій роботі: 4 розробники, 2 дизайнери, 2 QA-інженери. Ви бачите результат — не процес."
      />

      {/* Section 6: Values — top 3 as full Bento cells, bottom 3 as
          a compact secondary row so the section isn't 6 uniform cards. */}
      <Bento
        eyebrow="ЦІННОСТІ"
        heading={
          <>
            На чому ми <em>не економимо</em>
          </>
        }
        cells={VALUES_CELLS.slice(0, 3)}
      />
      <ValuesSecondaryRow cells={VALUES_CELLS.slice(3)} ariaLabel="Додаткові цінності" />

      {/* Section 7: Stack */}
      <Stack
        eyebrow="СТЕК"
        heading={
          <>
            Технології, у яких ми <em>ходимо в глибину</em>
          </>
        }
        sub="Не пробуємо все підряд. 10 інструментів, у яких ми сильні. Без експериментів на ваших грошах."
      />

      {/* Section 8: vs */}
      <Bento
        eyebrow="ВІДМІННОСТІ"
        heading={
          <>
            Чим ми <em>відрізняємося</em> від інших
          </>
        }
        cells={VS_CELLS}
      />

      {/* Section 9: Process */}
      <Process
        eyebrow="ПРОЦЕС"
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
        eyebrow="КЕЙСИ"
        heading={
          <>
            Реальні кейси з <em>реальними</em> метриками
          </>
        }
      />

      {/* Section 11: FAQ */}
      <section className="bg-bg">
        <FAQ heading="Часті питання про нас" items={ABOUT_FAQ} />
      </section>

      {/* Section 12: Final CTA */}
      <FinalCta3
        eyebrow="ЗВ'ЯЗОК"
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
