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
import { HpHeader, HpFooter, Bento } from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import {
  ADDONS_CELLS,
  PRICING_FAQ,
  TURNKEY_FOOTER_RU,
  TURNKEY_ITEMS_RU,
} from "@/content/ru/pricing";
import { RU_TIERS } from "@/content/ru/homepage";
import { fetchPricingPlans } from "@/lib/server/fetch-pricing-plans";
import { TIER_AMOUNTS, TIER_NAMES } from "@/constants/pricing-tiers";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { buildAlternates } from "@/lib/shared/alternates";
import { PRICING_PROSE_RU } from "@/content/ru/pricing-prose";

const PRICING_TITLE =
  "Цена создания сайта 2026 — фиксированные пакеты | Code-Site.Art";
const PRICING_DESCRIPTION =
  "➤ Стоимость разработки сайта по фиксированной цене ✔️ Лендинг от $800 ✔️ Корпоративный сайт от $2 500 ✔️ Кастомная платформа от $6 000 ➡ Без «по запросу».";

export const metadata: Metadata = {
  title: PRICING_TITLE,
  description: PRICING_DESCRIPTION,
  alternates: buildAlternates({ locale: "ru", uaPath: "/pricing" }),
  openGraph: {
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
    type: "website",
    locale: "ru_UA",
    url: "/ru/pricing",
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

const PRICING_URL = pageUrl("/ru/pricing");

/**
 * JSON-LD schema for the pricing page. Pure-function builder kept at module
 * scope: the *shape* of the payload lives here (out of the page component),
 * but the offer values are passed in by the caller so they can track CMS
 * data on each ISR cycle. Mirrors the uk and en pricing pages.
 */
type RuPricingOffer = { name: string; price: string; currency: string };

function buildRuPricingJsonLd(offers: RuPricingOffer[]) {
  return buildJsonLd([
    webPageNode({
      path: "/ru/pricing",
      locale: "ru",
      title: PRICING_TITLE,
      description: PRICING_DESCRIPTION,
    }),
    breadcrumbNode([
      { name: "Главная", path: "/ru" },
      { name: "Цены", path: "/ru/pricing" },
    ]),
    {
      "@type": "Service",
      "@id": `${PRICING_URL}#service`,
      name: "Разработка кастомных сайтов под ключ",
      description:
        "Custom-coded сайты на Next.js: лендинги, корпоративные сайты, отраслевые решения, enterprise-платформы.",
      provider: { "@id": ORG_ID },
      areaServed: ["UA", "EU", "US", "DK"],
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

export default async function RuPricingPage() {
  const cmsPlans = await fetchPricingPlans("ru");
  const tiers = cmsPlans.length ? cmsPlans.map((p) => p.tier) : RU_TIERS;

  const offers: RuPricingOffer[] = cmsPlans.length
    ? cmsPlans.map((p) => ({
        name: p.name,
        price: String(p.priceFrom),
        currency: p.currency,
      }))
    : [
        {
          name: TIER_NAMES.landing.ru,
          price: String(TIER_AMOUNTS.landing),
          currency: "USD",
        },
        {
          name: TIER_NAMES.corporate.ru,
          price: String(TIER_AMOUNTS.corporate),
          currency: "USD",
        },
        {
          name: TIER_NAMES.custom.ru,
          price: String(TIER_AMOUNTS.custom),
          currency: "USD",
        },
      ];
  const jsonLd = buildRuPricingJsonLd(offers);

  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      {/* Section 1: Page hero */}
      <PageHero
        breadcrumbs={[{ label: "Главная", href: "/ru" }, { label: "Цены" }]}
        eyebrow="ЦЕНЫ"
        headline={
          <>
            Цена создания сайта в 2026 — <em>фиксированные пакеты от $800</em>
          </>
        }
        sub="Цена — это то, что вы получите. Не «по запросу». Фиксируется в договоре, и в неё входит всё: копирайтинг, дизайн, вёрстка, код, домен, хостинг, запуск, год поддержки. Вы платите и получаете готовый продукт."
      />

      {/* Section 1.5: Turnkey list — promise of "everything included" */}
      <TurnkeyList
        eyebrow="ПОД КЛЮЧ"
        heading={
          <>
            <em>9 вещей</em>, которые входят в любой пакет
          </>
        }
        sub="Вы платите фиксированную сумму и получаете готовый сайт. Не нужно писать бриф, искать референсы и договариваться с фотографом. Вот что входит в каждый проект — без доплат."
        items={TURNKEY_ITEMS_RU}
        footer={TURNKEY_FOOTER_RU}
      />

      {/* Section 2: pricing tiers */}
      <section className={hpSectionClass} id="tiers">
        <div className={hpInnerClass}>
          <CmpPricingGrid>
            {tiers.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </CmpPricingGrid>
        </div>
      </section>

      {/* Section 3: What's included */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="ВХОДИТ"
        heading={
          <>
            Что входит в <em>стоимость разработки сайта</em> — без исключений
          </>
        }
        body="Независимо от пакета — вот базовый стандарт, который вы получаете на любом проекте Code-Site.Art. За это не нужно платить отдельно."
        bulletList={[
          "Кастомный дизайн (не шаблон) — каждый сайт уникален",
          "Адаптивная вёрстка под mobile / tablet / desktop",
          "SEO-структура с первого дня (title, meta, sitemap, robots)",
          "Lighthouse Performance 90+, SEO 95+, Accessibility 95+",
          "GitHub-репозиторий с полным кодом — в вашей собственности",
          "Гарантия 1 год на исправление багов",
          "Бесплатная консультация на старте (30 мин Zoom)",
          "Документация и часовое обучение работе с админкой",
          "Передача всех доступов и паролей после запуска",
          "Настройка Google Analytics + Search Console",
        ]}
        image={
          <AppImage
            src="/included.webp"
            alt="Сайт детского пространства «Безлад» на ноутбуке — пример проекта Code-Site.Art"
            width={1600}
            height={1124}
            sizes={IMG_SIZES.half}
          />
        }
      />

      {/* Section 4: What's NOT included */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="НЕ ВХОДИТ"
        heading={
          <>
            Что <em>НЕ</em> входит — честно
          </>
        }
        body="Не скрываем ограничений. Вот что НЕ входит в стоимость сайта, но мы можем помочь отдельно или порекомендовать партнёров."
        bulletIcon="cross"
        bulletList={[
          "Объёмный контент сверх стартового: тексты всех страниц услуг, статьи блога, фото, видео — отдельно (от $30 за статью) или ваш копирайтер",
          "Брендинг с нуля: логотип, фирменный стиль — рекомендуем партнёров",
          "Юридический консалтинг — только техническая юр-корректность",
          "Google Ads / Meta Ads — отдельная услуга performance-маркетолога",
          "Хостинг после первого года — передаём вам аккаунты Vercel/Cloudflare",
          "SMM-стратегия и ведение соцсетей — отдельная услуга",
          "SEO-кампания после года гарантии — отдельный пакет от $300/мес",
        ]}
        cta={{ label: "Обсудить, что нужно", href: "/ru/contacts" }}
        image={
          <AppImage
            src="/not-included.webp"
            alt="Подарочные сертификаты издательства Glimmer — пример дизайна от Code-Site.Art"
            width={1600}
            height={1200}
            sizes={IMG_SIZES.half}
          />
        }
      />

      {/* Section 5: Add-ons (Bento × 6) */}
      <Bento
        eyebrow="ДОПОЛНИТЕЛЬНО"
        heading={
          <>
            Дополнительные услуги <em>вне пакетов</em>
          </>
        }
        cells={ADDONS_CELLS}
      />

      {/* Section 6: Payment */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="ОПЛАТА"
        heading={
          <>
            Как <em>устроена</em> оплата
          </>
        }
        body="Честная схема без сюрпризов. Всё фиксируется в договоре перед стартом."
        bulletList={[
          "50% предоплата — старт работы. 50% при сдаче — после приёмки проекта",
          "Безнал на ФОП (UAH) — стандарт для украинских клиентов",
          "Stripe (USD/EUR) — для иностранных клиентов",
          "USDT TRC20 — если удобно вам",
          "Mono Pay / LiqPay — для небольших сумм",
          "Рассрочка на 3 платежа — для проектов от $10 000",
          "Скидка 10% при оплате 100% вперёд",
          "Договор с фиксированной суммой. Если мы срываем срок по своей вине — компенсируем неустойкой",
        ]}
        image={
          <AppImage
            src="/payment.webp"
            alt="Коммерческое предложение Code-Site.Art на разработку нового сайта"
            width={1600}
            height={1200}
            sizes={IMG_SIZES.half}
          />
        }
      />

      {/* Section 7: Calculator promo */}
      <ProseSections items={PRICING_PROSE_RU} />

      <CtaBanner
        heading={
          <>
            Не уверены, какой <em>пакет</em> подходит?
          </>
        }
        sub="Калькулятор за 60 секунд посчитает вилку стоимости под ваш проект и пришлёт детальный прайс на email."
        ctaPrimary={{ label: "Попробовать калькулятор", href: "/ru/calculator" }}
        ctaSecondary={{ label: "Или обсудить с нами", href: "/ru/contacts" }}
      />

      {/* Section 8: FAQ */}
      <section className="bg-bg">
        <FAQ heading="Частые вопросы о ценах" items={PRICING_FAQ} locale="ru" />
      </section>

      {/* Section 9: Final CTA 3 options */}
      <LaunchCta
        locale="ru"
        heading={
          <>
            Готовы <em>обсудить</em> проект?
          </>
        }
        sub="Бесплатная 30-мин консультация. Без обязательств."
      />

      <HpFooter />
    </>
  );
}
