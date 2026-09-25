import { fetchCaseStudies } from "@/components/case-page/data";
import { loc } from "@/lib/shared/sanity-locale";
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
import { HpHeader, HpFooter, PullQuote } from "@/components/homepage";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  organizationNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { FounderVideo } from "@/components/about/founder-video";
import { ABOUT_RU as C } from "@/content/ru/about";
import { buildAlternates } from "@/lib/shared/alternates";

export const metadata: Metadata = {
  title: C.meta.title,
  description: C.meta.description,
  alternates: buildAlternates({ locale: "ru", uaPath: "/about" }),
  openGraph: {
    title: C.meta.title,
    description: C.meta.description,
    type: "website",
    locale: "ru_UA",
    url: "/ru/about",
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

const FOUNDER_ID = `${pageUrl("/about")}#fedir-alpatov`;
const FOUNDER_PROFILES = [
  "https://github.com/cyanidium1",
  "https://uk.linkedin.com/in/fediralpatov",
  "https://instagram.com/codesite.art",
];

/** Отдельной русской версии ролика нет — ставим украинскую (1152026299), как и
 *  легаси-сайт для uk и ru. Английская (1151995135) живет на /en/about. */
const FOUNDER_VIDEO = {
  id: "1152026299",
  name: "О студии Code-Site.Art — рассказывает основатель",
  description:
    "Федор Алпатов о студии, подходе к работе и задачах, с которыми приходят клиенты.",
  uploadDate: "2026-01-06",
  duration: "PT35S",
};

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/ru/about",
    locale: "ru",
    title: C.meta.title,
    description: C.meta.description,
    type: "AboutPage",
    extra: { about: { "@id": ORG_ID } },
  }),
  breadcrumbNode([
    { name: "Главная", path: "/ru" },
    { name: "О студии", path: "/ru/about" },
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
    jobTitle: "Разработчик, техлид и основатель Code-Site.Art",
    worksFor: { "@id": ORG_ID },
    alumniOf: "Kyiv Polytechnic Institute",
    knowsAbout: ["Next.js", "React", "TypeScript", "Sanity CMS"],
    sameAs: FOUNDER_PROFILES,
  },
]);

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function RuAboutPage() {
  // Case covers for the "real projects" cards (plan 2026-09-16).
  const cases = await fetchCaseStudies();
  const covers = Object.fromEntries(
    cases
      .filter((cs) => cs.coverImage?.asset?.url)
      .map((cs) => [
        cs.slug,
        { image: cs.coverImage!, alt: loc(cs.coverImage!.alt, "ru") || cs.slug },
      ]),
  );
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <main>
        {/* 1 — Hero */}
        <AboutHero c={C.hero} />

        {/* 2 — Who is behind the studio */}
        <Founder c={C.founder} />

        {/* Founder intro video, right after the section about him. */}
        <FounderVideo
          vimeoId={FOUNDER_VIDEO.id}
          eyebrow="ЗНАКОМСТВО"
          heading={["Кто будет делать ваш сайт — ", "коротко, от первого лица"]}
          sub="Федор рассказывает о студии, подходе к работе и о том, с какими задачами к нам приходят. Две минуты — быстрее, чем читать всю страницу."
          playLabel="Смотреть видео о студии"
          posterAlt="Федор Алпатов, основатель Code-Site.Art"
        />

        {/* 2.5 — The team behind the studio */}
        <TeamSection
          locale="ru"
          eyebrow="КОМАНДА"
          heading={
            <>
              Команда из 4 человек. С каждым вы говорите <em>напрямую</em>.
            </>
          }
          sub="Федор Алпатов — основатель и техлид. С ним дизайнер, разработчик и редактор. Без аккаунт-менеджеров между вами и теми, кто делает сайт."
        />

        {/* 3 — Public track record ("verify us yourself") */}
        <TrackRecord c={C.trackRecord} />

        {/* 4 — Why we work this way (ownership philosophy) */}
        <Philosophy c={C.philosophy} />

        {/* 5 — Real projects + partner logos + client testimonial */}
        <RealProjects c={C.projects} covers={covers} />
        <PullQuote
          quote={
            <>
              Строительство на Борнхольме — плотная ниша. Боялись потерять даже
              ту скромную выдачу, что была. Через 30 дней после переезда трафик
              не просел, через 60 — пошёл <em>вверх</em>. Теперь новые страницы
              услуг я делаю сам — с телефона.
            </>
          }
          initials="SH"
          name="Søren Hansen"
          role="Owner, NBYG København Aps"
          caseHref="/ru/portfolio/nbyg-kobenhavn"
          caseLabel="Смотреть полный кейс"
        />

        {/* 6 — What clients actually buy */}
        <WhatYouBuy c={C.whatYouBuy} />

        {/* 7 — Guarantees (major trust section) */}
        <Guarantees c={C.guarantees} />

        {/* 8 — FAQ */}
        <section className="bg-bg">
          <FAQ heading="Частые вопросы о студии" items={C.faq} locale="ru" />
        </section>

        {/* 9 — Final CTA */}
        <LaunchCta
          locale="ru"
          heading={
            <>
              Нужен сайт, которым ваш бизнес <em>реально владеет</em>?
            </>
          }
          sub="Напишите — обсудим задачу, честно скажем, что реально сделать и сколько это стоит. Без давления и без рассылок."
        />
      </main>

      <HpFooter />
    </>
  );
}
