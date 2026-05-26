import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/blocks/page-hero";
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

      {/* Section 1: Page hero (with inline stats + side image overlap) */}
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
        stats={[
          { value: "47", label: "проєктів за 3 роки" },
          { value: "UA · EU · US · DK", label: "країни запуску" },
          { value: "4.9/5", label: "середня оцінка" },
          { value: "×3.2", label: "більше заявок у середньому" },
        ]}
        image={
          <Image
            src="/about/hero.webp"
            alt=""
            width={1197}
            height={1133}
            priority
            fetchPriority="high"
            sizes="(max-width: 960px) 100vw, (max-width: 1440px) 50vw, 1000px"
            /*
             * Sized + translated to mirror the home hero (MOCKUP_IMG_CLASS):
             * 50vw clamp + -10% translate-x so the image breaks out of the
             * narrower right column and overlaps the wide stats card. The
             * z-10 on the right-col wrapper (in PageHero) puts it above.
             * `max-w-none` defeats next/image's default max-width:100%.
             * Fine-tune translate / clamp values to taste.
             */
            className="w-[clamp(420px,50vw,800px)] max-w-none h-auto -translate-x-[10%] [filter:drop-shadow(0_50px_60px_oklch(0_0_0_/_0.55))_drop-shadow(0_20px_30px_oklch(0_0_0_/_0.35))] max-[960px]:w-full max-[960px]:max-w-full max-[960px]:translate-x-0"
          />
        }
      />

      {/* Section 3: Хто ми "Не агенція. Не фрилансер." — temporarily hidden,
          awaiting a real team photo. To restore: re-add `ImageText` import,
          drop a team photo at /public/about/team-2026.webp, and reinstate:

          <ImageText
            variant="side"
            imageVariant="imageRight"
            eyebrow="ПРО НАС"
            heading={<>Не агенція. <em>Не фрилансер.</em></>}
            body={[
              "Ми навмисно не ростемо до 50 співробітників. У великих агенціях ваш проєкт — один із тридцяти, і ним займається менеджер, а не той, хто пише код. У фрилансера ваш проєкт залежить від однієї людини, яка може зникнути на 3 тижні.",
              "12 людей — це той розмір, де команда тримає високу якість, а ви знаєте кожного, хто причетний до вашого сайту. З 2022 року робимо проєкти для клінік, юридичних і бухгалтерських фірм, ремонтних компаній, e-commerce та SaaS — переважно в Україні та ЄС.",
            ]}
            image={<Image src="/about/team-2026.webp" alt="..." width={1200} height={900} />}
          /> */}

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
          a compact secondary row so the section isn't 6 uniform cards.
          CS logo sits behind the empty 4th column slot (xl+ only). */}
      <Bento
        eyebrow="ЦІННОСТІ"
        heading={
          <>
            На чому ми <em>не економимо</em>
          </>
        }
        cells={VALUES_CELLS.slice(0, 3)}
        decoration={
          <Image
            src="/about/values-logo.webp"
            alt=""
            aria-hidden="true"
            width={1158}
            height={652}
            sizes="(min-width: 1100px) 580px, 0px"
            className="hidden xl:block pointer-events-none absolute right-0 top-[18%] w-[clamp(360px,30vw,580px)] h-auto z-0 opacity-90 [filter:drop-shadow(0_20px_30px_oklch(0_0_0_/_0.45))]"
          />
        }
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

      {/* Section 8: vs — screenshot mockup sits behind the empty 4th col (xl+ only) */}
      <Bento
        eyebrow="ВІДМІННОСТІ"
        heading={
          <>
            Чим ми <em>відрізняємося</em> від інших
          </>
        }
        cells={VS_CELLS}
        decoration={
          <Image
            src="/about/differences.webp"
            alt=""
            aria-hidden="true"
            width={1351}
            height={1566}
            sizes="(min-width: 1100px) 720px, 0px"
            className="hidden xl:block pointer-events-none absolute 2xl:right-[-5%] 2xl:top-[-15%] right-[-3%] top-[28%] w-[clamp(420px,38vw,720px)] h-auto z-0"
          />
        }
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
