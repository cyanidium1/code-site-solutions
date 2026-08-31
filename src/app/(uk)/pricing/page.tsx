import type { Metadata } from "next";
import { AppImage } from "@/lib/shared/app-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";

import { PageHero } from "@/components/blocks/page-hero";
import { ImageText } from "@/components/blocks/image-text";
import { TurnkeyList } from "@/components/blocks/turnkey-list";
import { Tier, CmpPricingGrid } from "@/components/blocks/comparison";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { ProseSections } from "@/components/blocks/prose-section";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  HpFooter,
  Bento,
} from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import { ADDONS_CELLS, PRICING_FAQ } from "@/content/uk/pricing";
import { HOMEPAGE_TIERS } from "@/content/uk/homepage";
import { fetchPricingPlans } from "@/lib/server/fetch-pricing-plans";
import { TIER_AMOUNTS, TIER_NAMES } from "@/constants/pricing-tiers";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { SectionHead } from "@/components/shared/section-head";
import { buildAlternates } from "@/lib/shared/alternates";
import { PRICING_PROSE_UK } from "@/content/uk/pricing-prose";

// GSC, 3 міс: «створити сайт ціна» 156 показів, «зробити сайт ціна» 134 —
// дієслово попереду. Старий title починався з «Ціна створення», що збігається
// лише з довшими формулюваннями. Гривня в сніпеті — паритет з топ-7 видачі:
// webnauts.pro і seok.ua виносять грн, і саме вони стоять вище нас.
const PRICING_TITLE = "Створити сайт — ціна 2026: від $800 (≈35 600 грн) | Code-Site.Art";
const PRICING_DESCRIPTION =
  "➤ Скільки коштує зробити сайт у 2026 ✔️ Лендінг від $800 (≈35 600 грн) ✔️ Корпоративний від $2 500 ✔️ Платформа від $6 000 ➡ Ціна фіксується в договорі до старту.";

export const metadata: Metadata = {
  title: PRICING_TITLE,
  description: PRICING_DESCRIPTION,
  alternates: buildAlternates({ locale: "uk", uaPath: "/pricing" }),
  openGraph: {
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
    type: "website",
    locale: "uk_UA",
    url: "/pricing",
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const PRICING_URL = pageUrl("/pricing");

/**
 * JSON-LD schema for the pricing page. Pure-function builder kept at module
 * scope: the *shape* of the payload lives here (out of the page component),
 * but the offer values are passed in by the caller so they can track CMS
 * data on each ISR cycle. Caller is responsible for sourcing `offers`
 * (typically from `fetchPricingPlans()` with the constants as fallback).
 */
type UkPricingOffer = { name: string; price: string; currency: string };

function buildUkPricingJsonLd(offers: UkPricingOffer[]) {
  return buildJsonLd([
    webPageNode({
      path: "/pricing",
      locale: "uk",
      title: PRICING_TITLE,
      description: PRICING_DESCRIPTION,
    }),
    breadcrumbNode([
      { name: "Головна", path: "/" },
      { name: "Ціни", path: "/pricing" },
    ]),
    {
      "@type": "Service",
      "@id": `${PRICING_URL}#service`,
      // SEO audit Aug 2026: was the English "Custom website development" on
      // the Ukrainian page, next to a Ukrainian description.
      name: "Розробка кастомних сайтів під ключ",
      description:
        "Custom-coded сайти на Next.js: лендинги, корпоративні сайти, спеціалізовані під галузь рішення, enterprise-платформи.",
      provider: { "@id": ORG_ID },
      areaServed: ["UA", "EU", "US", "DK"],
      // GSC, 3 міс: 115 цінових запитів, 2 210 показів, нуль кликів. У видачі
      // по «створити сайт ціна» перші місця беруть сторінки, у сніпеті яких
      // видно діапазон — ifish.com.ua показує «15 000–400 000 грн». Такий
      // сніпет Google будує з AggregateOffer, а не з переліку окремих Offer,
      // який тут уже був. Межі рахуються з тих самих тарифів, тож розійтися
      // з тим, що написано на сторінці, вони не можуть.
      ...(offers.length
        ? {
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: offers[0].currency,
              lowPrice: Math.min(...offers.map((o) => Number(o.price))),
              highPrice: Math.max(...offers.map((o) => Number(o.price))),
              offerCount: offers.length,
              url: PRICING_URL,
            },
          }
        : {}),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Code-Site.Art pricing tiers",
        itemListElement: offers.map((o) => ({
          "@type": "Offer",
          name: o.name,
          price: o.price,
          priceCurrency: o.currency,
          url: PRICING_URL,
        })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: PRICING_FAQ.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
      })),
    },
  ]);
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function PricingPage() {
  const cmsPlans = await fetchPricingPlans("uk");
  const tiers = cmsPlans.length ? cmsPlans.map((p) => p.tier) : HOMEPAGE_TIERS;

  const offers: UkPricingOffer[] = cmsPlans.length
    ? cmsPlans.map((p) => ({
        name: p.name,
        price: String(p.priceFrom),
        currency: p.currency,
      }))
    : [
        { name: TIER_NAMES.landing.uk, price: String(TIER_AMOUNTS.landing), currency: "USD" },
        { name: TIER_NAMES.corporate.uk, price: String(TIER_AMOUNTS.corporate), currency: "USD" },
        { name: TIER_NAMES.custom.uk, price: String(TIER_AMOUNTS.custom), currency: "USD" },
      ];
  const jsonLd = buildUkPricingJsonLd(offers);

  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      {/* Section 1: Page hero */}
      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Ціни" },
        ]}
        eyebrow="ЦІНИ"
        headline={
          <>
            Створити сайт у 2026 — <em>ціна від $800, зафіксована в договорі</em>
          </>
        }
        sub="Ціна — це те, що ви отримаєте. Не «під запит». Фіксовано в договорі, у ціну входить все — копірайтинг, дизайн, верстка, код, домен, хостинг, запуск, рік підтримки. Ви платите і отримуєте готовий продукт."
      />

      {/* Section 1.5: Turnkey list — promise of "everything included" */}
      <TurnkeyList
        heading={
          <>
            <em>9 речей</em>, які входять у будь-який пакет
          </>
        }
      />

      {/* Section 2: pricing tiers */}
      <section className={hpSectionClass} id="tiers">
        <div className={hpInnerClass}>
          <SectionHead
            eyebrow="ПАКЕТИ"
            heading={
              <>
                Скільки коштує <em>зробити сайт</em>
              </>
            }
          />
          <CmpPricingGrid>
            {tiers.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </CmpPricingGrid>
        </div>
      </section>

      {/* Section 3: What's included (side-with-list, без CTA) */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="ВХОДИТЬ"
        heading={
          <>
            Що входить у <em>вартість розробки сайту</em> — без винятків
          </>
        }
        body="Незалежно від пакета — ось базовий стандарт, який ви отримуєте з будь-яким проектом Code-Site.Art. Не платите за це окремо."
        bulletList={[
          "Кастомний дизайн (не шаблон) — кожен сайт унікальний",
          "Адаптивна верстка під mobile/tablet/desktop",
          "SEO-структура з першого дня (title, meta, sitemap, robots)",
          "Lighthouse Performance 90+, SEO 95+, Accessibility 95+",
          "GitHub-репозиторій з повним кодом — у вашій власності",
          "Гарантія 1 рік на виправлення багів",
          "Безкоштовна консультація на старті (30 хв Zoom)",
          "Документація і 1-годинне навчання адмінки",
          "Передача всіх доступів і паролів після запуску",
          "Налаштування Google Analytics + Search Console",
        ]}
        image={
          <AppImage
            src="/included.webp"
            alt="Сайт дитячого простору «Безлад» на ноутбуці — приклад проєкту Code-Site.Art"
            width={1600}
            height={1124}
            sizes={IMG_SIZES.half}
          />
        }
      />

      {/* Section 4: What's NOT included (side-with-list з CTA) */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="НЕ ВХОДИТЬ"
        heading={
          <>
            Що <em>НЕ</em> входить — чесно
          </>
        }
        body="Не приховуємо обмежень. Ось що НЕ входить у вартість сайту, але можемо допомогти окремо або порекомендувати партнерів."
        bulletList={[
          "Обʼємний контент понад стартовий: тексти всіх сторінок послуг, статті блогу, фото, відео — окремо (від $30/стаття) або ваш копірайтер",
          "Брендинг з нуля: логотип, фірмовий стиль — рекомендуємо партнерів",
          "Юридичний консалтинг — тільки технічна юр-коректність",
          "Google Ads / Meta Ads — окрема послуга performance-маркетолога",
          "Хостинг після першого року — передаємо вам акаунти Vercel/Cloudflare",
          "SMM-стратегія, ведення соцмереж — окрема послуга",
          "SEO-кампанія після року гарантії — окремий пакет від $300/міс",
        ]}
        cta={{ label: "Обговорити що потрібно", href: "/contacts" }}
        image={
          <AppImage
            src="/not-included.webp"
            alt="Подарункові сертифікати видавництва Glimmer — приклад дизайну від Code-Site.Art"
            width={1600}
            height={1200}
            sizes={IMG_SIZES.half}
          />
        }
      />

      {/* Section 5: Add-ons (Bento × 6) */}
      <Bento
        eyebrow="ДОДАТКОВО"
        heading={
          <>
            Додаткові послуги <em>поза пакетами</em>
          </>
        }
        cells={ADDONS_CELLS}
      />

      {/* Section 6: Payment (side-with-list, imageLeft) */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="ОПЛАТА"
        heading={
          <>
            Як <em>влаштована</em> оплата
          </>
        }
        body="Чесна схема без сюрпризів. Все фіксується в договорі перед стартом."
        bulletList={[
          "50% передоплата — старт роботи. 50% при здачі — після прийняття проекту",
          "Безнал на ФОП (UAH) — стандарт для українських клієнтів",
          "Stripe (USD/EUR) — для іноземних клієнтів",
          "USDT TRC20 — якщо зручно вам",
          "Mono Pay / LiqPay — для невеликих сум",
          "Розстрочка на 3 платежі — для проектів від $10 000",
          "Знижка 10% при оплаті 100% наперед",
          "Договір з фіксованою сумою. Якщо ми перевищуємо термін з нашої вини — компенсуємо неустойкою",
        ]}
        image={
          <AppImage
            src="/payment.webp"
            alt="Комерційна пропозиція Code-Site.Art на розробку нового сайту"
            width={1600}
            height={1200}
            sizes={IMG_SIZES.half}
          />
        }
      />

      {/* Section 7: Calculator promo */}
      <ProseSections items={PRICING_PROSE_UK} />

      <CtaBanner
        heading={
          <>
            Не впевнені, який <em>пакет</em> підходить?
          </>
        }
        sub="Калькулятор за 60 секунд порахує вилку вартості під ваш проект і пришле детальний прайс на email."
        ctaPrimary={{
          label: "Спробувати калькулятор",
          href: "/calculator",
        }}
        ctaSecondary={{
          label: "Або обговорити з нами",
          href: "/contacts",
        }}
      />

      {/* Section 8: FAQ */}
      <section className="bg-bg">
        <FAQ heading="Часті питання про ціни" items={PRICING_FAQ} />
      </section>

      {/* Section 9: Final CTA 3 options */}
      <LaunchCta
        locale="uk"
        heading={
          <>
            Готові <em>обговорити</em> проєкт?
          </>
        }
        sub="Безкоштовна 30-хв консультація. Без зобов'язань."
      />

      <HpFooter />
    </>
  );
}
