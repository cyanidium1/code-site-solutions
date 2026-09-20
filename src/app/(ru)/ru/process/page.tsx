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
import { PROCESS_STEPS as STEPS, PROCESS_FAQ } from "@/content/ru/process";
import { buildAlternates } from "@/lib/shared/alternates";

const LOC = "ru" as const;
const BUSINESS_TERM = formatPackageTerm("business", LOC);
const SHOP_TERM = formatPackageTerm("shop", LOC);
const LANDING_TERM = formatPackageTerm("landing", LOC);
const BUSINESS_PRICE = formatPackagePrice("business", LOC);

const META_TITLE = `Как мы делаем сайт за ${BUSINESS_TERM} | Code-Site.Art`;
const META_DESCRIPTION = `Сайт для бизнеса за ${BUSINESS_TERM} и ${BUSINESS_PRICE}, магазин — за ${SHOP_TERM}. Что происходит каждый день, фиксированная цена в договоре, год гарантии.`;

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: buildAlternates({ locale: LOC, uaPath: "/process" }),
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    locale: "ru_UA",
    url: "/ru/process",
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
    path: "/ru/process",
    locale: LOC,
    title: META_TITLE,
    description: META_DESCRIPTION,
  }),
  breadcrumbNode([
    { name: "Главная", path: "/ru" },
    { name: "Процесс", path: "/ru/process" },
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

export default function RuProcessPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Главная", href: "/ru" },
          { label: "Процесс" },
        ]}
        eyebrow={`ПРОЦЕСС · ${BUSINESS_TERM.toUpperCase()}`}
        headline={
          <>
            Сайт для бизнеса за {BUSINESS_TERM}. <em>Что происходит каждый день</em>.
          </>
        }
        sub={`Вы рассказываете о бизнесе — мы делаем структуру, тексты, дизайн, код и запуск. Цена и срок — в договоре до старта. Лендинг — ${LANDING_TERM}, интернет-магазин — ${SHOP_TERM}.`}
      />

      <StatsBar
        items={[
          { value: <>{PACKAGES.business.days.min}</>, label: "рабочих дней — сайт для бизнеса" },
          { value: <>{PACKAGES.shop.days.min}</>, label: "рабочих дней — интернет-магазин" },
          { value: <>100%</>, label: "фиксированная цена в договоре" },
          {
            value: <>{PAYMENT_TERMS.latePenaltyPercentPerDay}%</>,
            label: `неустойка за день просрочки, до ${PAYMENT_TERMS.latePenaltyCapPercent}%`,
          },
        ]}
      />

      <VerticalTimeline steps={STEPS} detailsLabel="Что делаем и что получите" />

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
        sub="Шаги выше — это то, как сделаны проекты ниже."
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="КОММУНИКАЦИЯ"
        heading={
          <>
            Как мы <em>общаемся</em> во время проекта
          </>
        }
        body="Вы не ждете сайт «вслепую». Каждый этап вы видите и согласовываете."
        bulletList={[
          "Один Telegram-чат на весь проект — отвечаем в рабочее время",
          "Тестовая ссылка с первого дня разработки",
          "Код в вашем GitHub с первого коммита",
          "Звонок — по вашему запросу, не обязателен",
          "Если вы не на связи, срок сдвигается на столько же дней",
        ]}
        image={
          <AppImage
            src="/communication.webp"
            alt="Сайт Mono Pools на ноутбуке и телефоне — реализованные проекты и отзывы клиентов"
            width={1600}
            height={1289}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <section className="bg-bg">
        <FAQ heading="А что если…?" items={PROCESS_FAQ} locale={LOC} />
      </section>

      <CtaBanner
        eyebrow="ГОТОВЫ НАЧАТЬ?"
        heading={
          <>
            Готовы пройти <em>процесс</em> с нами?
          </>
        }
        sub="Первый шаг бесплатный: расчет за 24 часа — пакет, цена и срок."
        ctaPrimary={{
          label: "Рассчитать стоимость →",
          href: "/ru/calculator",
        }}
        ctaSecondary={{
          label: "Получить расчет",
          href: "/ru/contacts",
        }}
      />

      <HpFooter />
    </>
  );
}
