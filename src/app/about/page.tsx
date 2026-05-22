import type { Metadata } from "next";

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
      <section
        style={{
          background: "var(--bg)",
          padding: "0 48px 64px",
        }}
        aria-label="Додаткові цінності"
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
          className="about-values-secondary"
        >
          {VALUES_CELLS.slice(3).map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="about-values-secondary-card"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "16px 18px",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  background: "oklch(0.16 0.005 300)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: 10,
                    background: "oklch(from var(--accent) l c h / 0.12)",
                    border: "1px solid oklch(from var(--accent) l c h / 0.22)",
                    color: "var(--accent-soft)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--ink)",
                      lineHeight: 1.2,
                      marginBottom: 4,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.45,
                      color: "var(--ink-2)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                    }}
                  >
                    {c.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
      <section style={{ background: "var(--bg)" }}>
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
