import type { Metadata } from "next";

import {
  AboutHero,
  Founder,
  TrackRecord,
  Philosophy,
  RealProjects,
  WhatYouBuy,
  Guarantees,
} from "@/components/about/sections";
import { TeamSection } from "@/components/about/team-section";
import { FAQ } from "@/components/blocks/final";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { HpHeader, HpFooter, Marquee, PullQuote } from "@/components/homepage";
import { ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  organizationNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { ABOUT_UK as C } from "@/content/uk/about";

export const metadata: Metadata = {
  title: C.meta.title,
  description: C.meta.description,
  alternates: {
    canonical: "/about",
    languages: {
      uk: "/about",
      en: "/en/about",
      "x-default": "/about",
    },
  },
  openGraph: {
    title: C.meta.title,
    description: C.meta.description,
    type: "website",
    locale: "uk_UA",
    url: "/about",
  },
};

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const ABOUT_URL = pageUrl("/about");
const FOUNDER_ID = `${ABOUT_URL}#fedir-alpatov`;
const FOUNDER_PROFILES = [
  "https://github.com/cyanidium1",
  "https://www.linkedin.com/in/fediralpatov/",
  "https://www.instagram.com/cyanidium/",
];

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/about",
    locale: "uk",
    title: C.meta.title,
    description: C.meta.description,
    type: "AboutPage",
    extra: { about: { "@id": ORG_ID } },
  }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Про нас", path: "/about" },
  ]),
  organizationNode(),
  {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: "Fedir Alpatov",
    jobTitle: "Developer, Tech Lead & Founder, Code-Site.Art",
    worksFor: { "@id": ORG_ID },
    alumniOf: "Kyiv Polytechnic Institute",
    knowsAbout: ["Next.js", "React", "TypeScript", "Sanity CMS"],
    sameAs: FOUNDER_PROFILES,
  },
]);

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <main>
        {/* 1 — Hero */}
        <AboutHero c={C.hero} />

        {/* 2 — Who is behind the studio */}
        <Founder c={C.founder} />

        {/* 2.5 — The team behind the studio */}
        <TeamSection
          eyebrow="КОМАНДА"
          heading={
            <>
              12 людей. Чотирьох ви будете чути <em>щодня</em>.
            </>
          }
          sub="Це ключове ядро — з ким ви будете спілкуватися безпосередньо: тех-лід, дизайнер, фронтенд, маркетинг. За ними ще 8 людей у фоновій роботі: 4 розробники, 2 дизайнери, 2 QA-інженери. Ви бачите результат — не процес."
        />

        {/* 3 — Public track record ("verify us yourself") */}
        <TrackRecord c={C.trackRecord} />

        {/* 4 — Why we work this way (ownership philosophy) */}
        <Philosophy c={C.philosophy} />

        {/* 5 — Real projects + partner logos + client testimonial */}
        <RealProjects c={C.projects} />
        <Marquee label="КОМПАНІЇ, ЩО ДОВІРИЛИ НАМ САЙТ · UA · EU · DK" />
        <PullQuote
          quote={
            <>
              Будівництво на Борнгольмі — щільна ніша. Боялись втратити навіть ту
              мізерну видачу, що мали. Через 30 днів після переходу трафік не
              впав, через 60 — стали <em>№1</em>. Тепер я роблю нові сторінки
              послуг сам — з телефона.
            </>
          }
          initials="SH"
          name="Søren Hansen"
          role="Owner, NBYG København Aps"
          caseHref="/portfolio/nbyg-kobenhavn"
          caseLabel="Подивитись повний кейс"
        />

        {/* 6 — What clients actually buy */}
        <WhatYouBuy c={C.whatYouBuy} />

        {/* 7 — Guarantees (major trust section) */}
        <Guarantees c={C.guarantees} />

        {/* 8 — FAQ */}
        <section className="bg-bg">
          <FAQ heading="Часті питання про студію" items={C.faq} />
        </section>

        {/* 9 — Final CTA */}
        <LaunchCta
          locale="uk"
          heading={
            <>
              Потрібен сайт, яким ваш бізнес <em>реально володіє</em>?
            </>
          }
          sub="Напишіть — обговоримо задачу, чесно скажемо, що реально зробити, і скільки це коштує. Без тиску й без розсилок."
        />
      </main>

      <HpFooter />
    </>
  );
}
