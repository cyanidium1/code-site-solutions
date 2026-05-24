import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { ImageText } from "@/components/blocks/image-text";
import { TurnkeyList } from "@/components/blocks/turnkey-list";
import { Tier } from "@/components/blocks/comparison";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  HpFooter,
  Bento,
  FinalCta3,
} from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";
import { plainRich } from "@/lib/shared/rich-text";
import { ADDONS_CELLS, PRICING_FAQ, TIERS } from "@/content/uk/pricing";

export const metadata: Metadata = {
  title: "Прайс — від $1 000 до $14 000+ | Code-Site.Art",
  description:
    "Прозорі ціни без «під запит». Лендинг від $1 000, Industry Pro від $3 500, Pro Plus від $7 500, enterprise від $14 000. Гарантія 1 рік.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Прайс — від $1 000 до $14 000+ | Code-Site.Art",
    description:
      "Прозорі ціни без «під запит». Фіксована вартість за фіксований обсяг роботи.",
    type: "website",
    locale: "uk_UA",
    url: "/pricing",
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
      // eslint-disable-next-line react/forbid-dom-props -- dynamic gradient stops
      style={{ "--gp-from": from, "--gp-to": to } as React.CSSProperties}
      className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--gp-from)_0%,var(--gp-to)_100%)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:20px_20px] opacity-50"
      />
      {label ? (
        <span className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-white/85">
          {label}
        </span>
      ) : null}
    </div>
  );
}

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const PRICING_URL = pageUrl("/pricing");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PRICING_URL}#service`,
      name: "Custom website development",
      description:
        "Custom-coded сайти на Next.js: лендинги, корпоративні сайти, спеціалізовані під галузь рішення, enterprise-платформи.",
      provider: { "@id": ORG_ID },
      areaServed: ["UA", "EU", "US", "DK"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Code-Site.Art pricing tiers",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Starter — Landing",
            description:
              "Швидкий запуск однієї пропозиції, MVP, тестування гіпотези.",
            price: "1000",
            priceCurrency: "USD",
            url: PRICING_URL,
          },
          {
            "@type": "Offer",
            name: "Industry Pro",
            description:
              "Сайт під специфіку галузі: медицина, юристи, бухгалтерія. З compliance і профільними інтеграціями.",
            price: "3500",
            priceCurrency: "USD",
            url: PRICING_URL,
          },
          {
            "@type": "Offer",
            name: "Pro Plus",
            description:
              "Бізнесу, який росте в кількох країнах і потребує EN-локаль, 30+ сторінок і одну глибоку інтеграцію (CRM / ERP / платіжна система).",
            price: "7500",
            priceCurrency: "USD",
            url: PRICING_URL,
          },
          {
            "@type": "Offer",
            name: "Enterprise — Custom",
            description:
              "Складні платформи: SaaS, marketplaces, e-commerce 1000+ SKU, мережі філій.",
            price: "14000",
            priceCurrency: "USD",
            url: PRICING_URL,
          },
        ],
      },
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
          name: "Ціни",
          item: PRICING_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: PRICING_FAQ.map((it) => ({
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

export default function PricingPage() {
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
          { label: "Ціни" },
        ]}
        eyebrow="ЦІНИ"
        headline={
          <>
            Ціна — це <em>те, що ви отримаєте</em>. Не «під запит».
          </>
        }
        sub="Від $1 000 до $14 000+, фіксовано в договорі. У ціну входить все — копірайтинг, дизайн, верстка, код, домен, хостинг, запуск, рік підтримки. Ви платите і отримуєте готовий продукт."
      />

      {/* Section 1.5: Turnkey list — promise of "everything included" */}
      <TurnkeyList
        heading={
          <>
            <em>9 речей</em>, які входять у будь-який тир
          </>
        }
      />

      {/* Section 2: 4 tiers */}
      <section className="hp-section" id="tiers">
        <div className="hp-inner">
          <div className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[1100px]:gap-3.5 max-[700px]:grid-cols-1">
            {TIERS.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: What's included (side-with-list, без CTA) */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="ВХОДИТЬ"
        heading={
          <>
            Що входить у <em>всі пакети</em> — без винятків
          </>
        }
        body="Незалежно від тиру — ось базовий стандарт, який ви отримуєте з будь-яким проектом Code-Site.Art. Не платите за це окремо."
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
          <GradPlaceholder
            from="oklch(0.55 0.16 145)"
            to="oklch(0.45 0.20 295)"
            label="included · all tiers"
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
          "Контент: тексти, фото, відео — окрема послуга або ваш копірайтер",
          "Брендинг з нуля: логотип, фірмовий стиль — рекомендуємо партнерів",
          "Юридичний консалтинг — тільки технічна юр-коректність",
          "Google Ads / Meta Ads — окрема послуга performance-маркетолога",
          "Хостинг після першого року — передаємо вам акаунти Vercel/Cloudflare",
          "SMM-стратегія, ведення соцмереж — окрема послуга",
          "SEO-кампанія після року гарантії — окремий пакет від $300/міс",
        ]}
        cta={{ label: "Обговорити що потрібно", href: "/contacts" }}
        image={
          <GradPlaceholder
            from="oklch(0.45 0.18 25)"
            to="oklch(0.30 0.12 290)"
            label="not included"
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
          <GradPlaceholder
            from="oklch(0.50 0.18 230)"
            to="oklch(0.45 0.20 295)"
            label="payment · contract"
          />
        }
      />

      {/* Section 7: Calculator promo */}
      <CtaBanner
        heading={
          <>
            Не впевнені, який <em>тир</em> підходить?
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
      <FinalCta3
        eyebrow="ЗВ'ЯЗОК"
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
