import type { Metadata } from "next";
import { AppImage } from "@/lib/shared/app-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import { CaseStrip } from "@/components/blocks/case-strip";
import { VerticalTimeline } from "@/components/blocks/vertical-timeline";
import { HpHeader, HpFooter } from "@/components/homepage";
import { OG_DEFAULT_IMAGE } from "@/constants/site";
import {
  PACKAGES,
  PAYMENT_TERMS,
  formatPackagePrice,
  formatPackageTerm,
} from "@/constants/pricing";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import { PROCESS_STEPS as STEPS, PROCESS_FAQ } from "@/content/uk/process";
import { buildAlternates } from "@/lib/shared/alternates";

const LOC = "uk" as const;
const BUSINESS_TERM = formatPackageTerm("business", LOC);
const SHOP_TERM = formatPackageTerm("shop", LOC);
const LANDING_TERM = formatPackageTerm("landing", LOC);
const BUSINESS_PRICE = formatPackagePrice("business", LOC);

const META_TITLE = `Як ми робимо сайт за ${BUSINESS_TERM} | Code-Site.Art`;
const META_DESCRIPTION = `Сайт для бізнесу за ${BUSINESS_TERM} і ${BUSINESS_PRICE}, магазин — за ${SHOP_TERM}. Що відбувається кожного дня, фіксована ціна в договорі, рік гарантії.`;

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: buildAlternates({ locale: LOC, uaPath: "/process" }),
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    locale: "uk_UA",
    url: "/process",
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/process",
    locale: LOC,
    title: META_TITLE,
    description: META_DESCRIPTION,
  }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Процес", path: "/process" },
  ]),
  // SEO audit Aug 2026: the HowTo node was removed (Google retired the HowTo
  // rich result in 2023). The on-page steps are untouched.
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
]);

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ProcessPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Процес" },
        ]}
        eyebrow={`ПРОЦЕС · ${BUSINESS_TERM.toUpperCase()}`}
        headline={
          <>
            Сайт для бізнесу за {BUSINESS_TERM}. <em>Що відбувається кожного дня</em>.
          </>
        }
        sub={`Ви розповідаєте про бізнес — ми робимо структуру, тексти, дизайн, код і запуск. Ціна і строк — у договорі до старту. Лендінг — ${LANDING_TERM}, інтернет-магазин — ${SHOP_TERM}.`}
      />

      <StatsBar
        items={[
          { value: <>{PACKAGES.business.days.min}</>, label: "робочих днів — сайт для бізнесу" },
          { value: <>{PACKAGES.shop.days.min}</>, label: "робочих днів — інтернет-магазин" },
          { value: <>100%</>, label: "фіксована ціна в договорі" },
          {
            value: <>{PAYMENT_TERMS.latePenaltyPercentPerDay}%</>,
            label: `неустойка за день прострочки, до ${PAYMENT_TERMS.latePenaltyCapPercent}%`,
          },
        ]}
      />

      <VerticalTimeline steps={STEPS} />

      {/* Portfolio strip — the page ran seven text-only steps with a
          single photo on it (design audit 2026-09-07). */}
      <CaseStrip
        locale={LOC}
        slugs={[
          "efedra-clinic",
          "nbyg-kobenhavn",
          "solide-renovation",
          "glimmer",
          "mono-pools",
          "kondor-device",
        ]}
        sub="Кроки вище — це те, як зроблені проєкти нижче."
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="КОМУНІКАЦІЯ"
        heading={
          <>
            Як ми <em>спілкуємось</em> під час проєкту
          </>
        }
        body="Ви не чекаєте сайт «наосліп». Кожен етап ви бачите і погоджуєте."
        bulletList={[
          "Один Telegram-чат на весь проєкт — відповідаємо в робочий час",
          "Тестове посилання з першого дня розробки",
          "Код у вашому GitHub з першого коміту",
          "Дзвінок — за вашим запитом, не обов'язковий",
          "Якщо ви не на зв'язку, строк зсувається на стільки ж днів",
        ]}
        image={
          <AppImage
            src="/communication.webp"
            alt="Сайт Mono Pools на ноутбуці й телефоні — реалізовані проєкти та відгуки клієнтів"
            width={1600}
            height={1289}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <section className="bg-bg">
        <FAQ heading="Що якщо…?" items={PROCESS_FAQ} locale={LOC} />
      </section>

      <CtaBanner
        eyebrow="ГОТОВІ ПОЧАТИ?"
        heading={
          <>
            Готові пройти <em>процес</em> з нами?
          </>
        }
        sub="Перший крок безкоштовний: прорахунок за 24 години — пакет, ціна і строк."
        ctaPrimary={{
          label: "Розрахувати вартість →",
          href: "/calculator",
        }}
        ctaSecondary={{
          label: "Отримати прорахунок",
          href: "/contacts",
        }}
      />

      <HpFooter />
    </>
  );
}
