import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import { VerticalTimeline } from "@/components/blocks/vertical-timeline";
import { HpHeader, HpFooter } from "@/components/homepage";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";
import { plainRich } from "@/lib/shared/rich-text";
import { PROCESS_STEPS as STEPS, PROCESS_FAQ } from "@/content/uk/process";

export const metadata: Metadata = {
  title:
    "Процес роботи — 7 кроків від брифу до запуску | Code-Site.Art",
  description:
    "Як ми робимо сайти за 4-10 тижнів. Прозорий процес з фіксованими дедлайнами, гарантією 1 рік і неустойкою 30% за зрив. Без сюрпризів.",
  alternates: {
    canonical: "/process",
    languages: { uk: "/process", en: "/en/process", "x-default": "/process" },
  },
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
          <Image
            src="/communication.webp"
            alt="Як ми спілкуємось протягом проекту"
            width={1600}
            height={1289}
          />
        }
      />

      {/* Section 5: What-if FAQ */}
      <section className="bg-bg">
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
