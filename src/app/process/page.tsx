import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import { VerticalTimeline } from "@/components/blocks/vertical-timeline";
import { HpHeader, HpFooter } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";
import { plainRich } from "@/lib/shared/rich-text";
import { PROCESS_STEPS as STEPS, PROCESS_FAQ } from "@/content/uk/process";

export const metadata: Metadata = {
  title:
    "Процес роботи — 7 кроків від брифу до запуску | Code-Site.Art",
  description:
    "Як ми робимо сайти за 4-10 тижнів. Прозорий процес з фіксованими дедлайнами, гарантією 1 рік і неустойкою 30% за зрив. Без сюрпризів.",
  alternates: { canonical: "/process" },
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

/* ─── Placeholder visual ─────────────────────────────────────────────────── */

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
          <GradPlaceholder
            from="oklch(0.50 0.18 230)"
            to="oklch(0.45 0.20 295)"
            label="communication · transparent"
          />
        }
      />

      {/* Section 5: What-if FAQ */}
      <section style={{ background: "var(--bg)" }}>
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
