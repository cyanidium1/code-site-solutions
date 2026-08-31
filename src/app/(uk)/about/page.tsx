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
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  organizationNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { FounderVideo } from "@/components/about/founder-video";
import { ABOUT_UK as C } from "@/content/uk/about";
import { buildAlternates } from "@/lib/shared/alternates";

export const metadata: Metadata = {
  title: C.meta.title,
  description: C.meta.description,
  alternates: buildAlternates({ locale: "uk", uaPath: "/about" }),
  openGraph: {
    title: C.meta.title,
    description: C.meta.description,
    type: "website",
    locale: "uk_UA",
    url: "/about",
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: C.meta.title,
    description: C.meta.description,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const ABOUT_URL = pageUrl("/about");
const FOUNDER_ID = `${ABOUT_URL}#fedir-alpatov`;
const FOUNDER_PROFILES = [
  "https://github.com/cyanidium1",
  "https://uk.linkedin.com/in/fediralpatov",
  "https://instagram.com/codesite.art",
];

/**
 * Дві мовні версії одного ролика на Vimeo. Англійська позначена в описі
 * «ENG» — саме її я спочатку помилково поставив на українську сторінку.
 * Легасі-сайт використовує 1152026299 і для uk, і для ru.
 * Дані — Vimeo oEmbed на 31.08.2026.
 */
const FOUNDER_VIDEO = {
  id: "1152026299",
  name: "Про студію Code-Site.Art — розповідає засновник",
  description:
    "Федір Алпатов про студію, підхід до роботи і задачі, з якими приходять клієнти.",
  uploadDate: "2026-01-06",
  duration: "PT35S",
};

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
    "@type": "VideoObject",
    name: FOUNDER_VIDEO.name,
    description: FOUNDER_VIDEO.description,
    uploadDate: FOUNDER_VIDEO.uploadDate,
    duration: FOUNDER_VIDEO.duration,
    thumbnailUrl: pageUrl("/team/fedir.jpg"),
    embedUrl: `https://player.vimeo.com/video/${FOUNDER_VIDEO.id}`,
    publisher: { "@id": ORG_ID },
  },
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

        {/* Відео-знайомство із засновником. Стоїть одразу після блоку про
            нього: людина щойно прочитала, хто це, і може подивитись на нього
            живого — це найсильніший сигнал довіри на сторінці. */}
        <FounderVideo
          vimeoId={FOUNDER_VIDEO.id}
          eyebrow="ЗНАЙОМСТВО"
          heading={["Хто робитиме ваш сайт — ", "коротко, від першої особи"]}
          sub="Федір розповідає про студію, підхід до роботи і про те, з якими задачами до нас приходять. Дві хвилини — швидше, ніж читати сторінку цілком."
          playLabel="Дивитися відео про студію"
          posterAlt="Федір Алпатов, засновник Code-Site.Art"
        />

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
