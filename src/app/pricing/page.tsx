import type { Metadata } from "next";
import {
  Search,
  ArrowRightLeft,
  Wrench,
  Zap,
  Palette,
  FileText,
} from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { ImageText } from "@/components/blocks/image-text";
import { TurnkeyList } from "@/components/blocks/turnkey-list";
import { Tier, type TierProps } from "@/components/blocks/comparison";
import "@/components/blocks/comparison/comparison.css";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  HpFooter,
  Bento,
  FinalCta3,
  type BentoCell,
} from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";
import { plainRich, type RichText } from "@/lib/rich-text";

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

/* ─── Pricing tiers (4 шт) ───────────────────────────────────────────────── */

const TIERS: TierProps[] = [
  {
    name: "Landing",
    price: "$1 000",
    weeks: "1-2 тижні",
    bestFor:
      "Швидкий запуск однієї пропозиції, MVP, тестування гіпотези.",
    includes: {
      heading: "Що входить",
      items: [
        "1 сторінка з адаптивом",
        "SEO-структура (title, meta, schema)",
        "Lighthouse 90+",
        "1 форма заявки",
        "Інтеграція з 1 системою (CRM або email)",
        "Google Analytics + Tag Manager",
        "Документація і навчання",
        "Гарантія 1 рік",
      ],
    },
    excludes: {
      items: [
        "Багатомовність",
        "CMS для самостійних змін",
        "Блог",
        "Складні інтеграції",
      ],
    },
    ctaLabel: "Choose Starter →",
    ctaHref: "/contacts?tier=starter",
  },
  {
    popular: true,
    popularLabel: "★ MOST POPULAR",
    name: "Industry Pro",
    price: "$3 500",
    weeks: "4-8 тижнів",
    bestFor:
      "Бізнесу з compliance вимогами (медицина, право, бухгалтерія), що потребує галузевих інтеграцій.",
    includes: {
      heading: "Що входить",
      items: [
        <><em>Compliance</em> під галузь (МОЗ / RODO / HIPAA-aware)</>,
        "5+ профільних інтеграцій (Helsi/Clio/MEDoc та ін.)",
        "Локальне SEO під район",
        "Особистий кабінет клієнта",
        <>E-sign (<em>Diia.Sign</em> / DocuSign)</>,
        "UA + RU багатомовність",
        "Калькулятори вартості (1-3 шт)",
        "До 30 сторінок",
        <>Гарантія 1 рік + неустойка <em>30%</em> за зрив</>,
      ],
    },
    excludes: {
      items: [
        "EN-локаль (доступна в Pro Plus)",
        "Складна SaaS-логіка",
        "SLA 24/7",
      ],
    },
    ctaLabel: "Choose Industry Pro →",
    ctaHref: "/contacts?tier=industry",
  },
  {
    name: "Pro Plus",
    price: "$7 500",
    weeks: "6-10 тижнів",
    bestFor:
      "Бізнесу, який росте в кількох країнах і потребує EN-локаль, 30+ сторінок і одну глибоку інтеграцію (CRM / ERP / платіжна система).",
    includes: {
      heading: "Все з Industry Pro +",
      items: [
        <><em>EN-локаль</em></>,
        "30+ сторінок",
        "1 кастомна інтеграція",
        "Виділений PM з щотижневими статусами",
        "Розширене SEO (програмні landing-pages)",
        <>Гарантія 1 рік + неустойка <em>30%</em> за зрив</>,
      ],
    },
    excludes: {
      items: [
        "SLA 24/7 (тільки в Custom)",
        "Dedicated team на 5-7 людей",
        "Складна SaaS-архітектура",
      ],
    },
    ctaLabel: "Choose Pro Plus →",
    ctaHref: "/contacts?tier=proplus",
  },
  {
    name: "Custom",
    price: "$14 000",
    weeks: "8-16 тижнів",
    bestFor:
      "Складним продуктам із власною логікою — SaaS, маркетплейс, B2B-портал.",
    includes: {
      heading: "Все з Pro Plus +",
      items: [
        "Архітектурна сесія перед стартом",
        "Dedicated team (5-7 людей під проект)",
        <>UA + RU + <em>EN</em> + інші мови за запитом</>,
        "Складні платіжні воронки",
        "API для зовнішніх інтеграцій",
        <><em>SLA 24/7</em> з 4-годинним response time</>,
        "SOC 2-ready architecture (для B2B-SaaS)",
        "Custom модулі під специфіку",
        "Підтримка за SLA після року",
      ],
    },
    excludes: {
      items: [
        "Створення фото/відео контенту",
        "Брендинг з нуля (логотип, фірмовий стиль)",
        "Юридичний консалтинг",
      ],
    },
    ctaLabel: "Talk to us →",
    ctaGhost: true,
    ctaHref: "/contacts?tier=enterprise",
  },
];

/* ─── Add-ons (Bento × 6) ────────────────────────────────────────────────── */

const ADDONS_CELLS: BentoCell[] = [
  {
    icon: Search,
    title: "SEO-аудит",
    body: "Технічний + контентний аудит вашого поточного сайту. Список правок з пріоритетами.",
    stat: "$300",
    span: "1x1",
  },
  {
    icon: ArrowRightLeft,
    title: "Міграція з WordPress",
    body: "Перенос на Next.js без втрати SEO-історії. 301-redirects, Search Console handoff.",
    stat: "$500-2 000",
    span: "1x1",
  },
  {
    icon: Wrench,
    title: "Підтримка після року",
    body: "Виправлення, оновлення, консультації. Або monthly retainer, або по годинах.",
    stat: "$200/міс або $40/год",
    span: "1x1",
  },
  {
    icon: Zap,
    title: "Швидкий лендинг",
    body: "Спрощений лендинг для термінової кампанії. 7-14 днів від брифу до запуску.",
    stat: "$1 500",
    span: "1x1",
  },
  {
    icon: Palette,
    title: "Брендинг (через партнерів)",
    body: "Логотип, фірмовий стиль, brand book. Робимо з нашими перевіреними партнерами.",
    stat: "від $1 500",
    span: "1x1",
  },
  {
    icon: FileText,
    title: "Контент",
    body: "Копірайтер з досвідом B2B-сайтів. Тексти для лендингу, кейсів, блогу.",
    stat: "$200/стаття",
    span: "1x1",
  },
];

/* ─── FAQ ────────────────────────────────────────────────────────────────── */

const PRICING_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Чому ви даєте фіксовану ціну, а не «під запит»?",
    a: [
      "Бо це ваш час. Ви заходите на сайт, бачите вилку — розумієте, чи проект у вашому бюджеті. Не доводиться писати, чекати менеджера, дзвонити. Ми так само поважаємо ваш час, як і свій. ",
      { em: "Точна цифра" },
      " — після 30-хв брифу.",
    ],
  },
  {
    q: "Чим Pro Plus відрізняється від Industry Pro і коли вибирати який?",
    a: [
      "Industry Pro ($3 500) — для бізнесу з compliance вимогами і галузевими інтеграціями (",
      { em: "Helsi, Clio, MEDoc" },
      ") в одній мові. Pro Plus ($7 500) додає ",
      { em: "EN-локаль" },
      ", 30+ сторінок, одну глибоку інтеграцію (CRM / ERP / платіжна) і виділеного PM з щотижневими статусами. Беріть Pro Plus, якщо клієнти не лише з України, або обсяг контенту виходить за межі 30 сторінок. Деталі — на сторінках /sites-for/medicine, /sites-for/legal, /sites-for/accounting.",
    ],
  },
  {
    q: "Чи можу домовитися про знижку?",
    a: [
      "Так, у двох випадках: ",
      { em: "знижка 10%" },
      " при оплаті 100% наперед (одним платежем). Або проект-партнерство (рекомендація на ваш сайт у нашому портфоліо + open-source-кейс) — обговорюємо індивідуально.",
    ],
  },
  {
    q: "Що якщо мій проект не вписується в жоден тир?",
    a: [
      "Розповідайте — обговоримо. Можливі варіанти: 1) трохи більше обсягу за фіксовану ціну сусіднього тиру; 2) ",
      { em: "кастомний quote" },
      " (для проектів складніше Enterprise); 3) розбити на 2 етапи (MVP + розширення). Не змушуємо вас вписуватись у наші коробки.",
    ],
  },
  {
    q: "Чи можна оплатити криптою?",
    a: [
      "Так. ",
      { em: "USDT TRC20" },
      " — стандартно. Інші стейблкоїни (USDC) — обговоримо. Bitcoin / Ethereum — теж можна, але з фіксацією курсу на момент платежу. Для іноземних клієнтів крипта — найпростіший спосіб.",
    ],
  },
  {
    q: "Чи є розстрочка для великих проектів?",
    a: [
      "Для проектів від $10 000 — так. Стандартна схема: ",
      { em: "30% старт + 35% після затвердження дизайну + 35% після здачі" },
      ". Для Enterprise (від $14 000) — можемо розбити на 4 платежі під milestones. Підписання договору — обов'язкове.",
    ],
  },
  {
    q: "Як рахуються інтеграції?",
    a: [
      "Кожна стороння інтеграція (CRM, email, payment, calendar, e-sign) — ",
      { em: "від $200 до $500" },
      " залежно від складності. Складні бекофісні інтеграції (1С, BAS, кастомні API) — окремий quote, $1 000-3 000. Точна цифра — після технічного аудиту.",
    ],
  },
  {
    q: "Що якщо потрібні зміни після запуску?",
    a: [
      "1 рік — гарантія: виправлення багів, дрібні правки безкоштовно. Нові фічі — ",
      { em: "$40/год" },
      " (за погодинною ставкою) або monthly retainer $200-500/міс залежно від обсягу. Великий редизайн — окремий проект. Кажемо одразу, скільки буде коштувати.",
    ],
  },
];

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
        eyebrow="/ PRICING"
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
          <div className="pricing-tier-grid-4">
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
        eyebrow="/ 02 INCLUDED"
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
        eyebrow="/ 03 NOT INCLUDED"
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
        eyebrow="/ 04 ADD-ONS"
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
        eyebrow="/ 05 PAYMENT"
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
      <section style={{ background: "var(--bg)" }}>
        <FAQ heading="Часті питання про ціни" items={PRICING_FAQ} />
      </section>

      {/* Section 9: Final CTA 3 options */}
      <FinalCta3
        eyebrow="/ GET IN TOUCH"
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
