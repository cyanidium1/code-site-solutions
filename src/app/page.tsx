import { HeroEditorial } from "@/components/blocks/hero";
import { TurnkeyList } from "@/components/blocks/turnkey-list";
import { Tier, type TierProps } from "@/components/blocks/comparison";
import "@/components/blocks/comparison/comparison.css";
import {
  HpHeader,
  Marquee,
  Industries,
  Bento,
  Process,
  Cases,
  Stack,
  PullQuote,
  FinalCta3,
  Newsletter,
  HpFooter,
} from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { ORG_ID, SITE_CONTACT, SITE_ORIGIN, WEBSITE_ID } from "@/lib/site";

const HOMEPAGE_TIERS: TierProps[] = [
  {
    name: "Landing",
    price: "$1 000",
    weeks: "1-2 нед",
    includes: {
      heading: "Що входить",
      items: [
        "Адаптивна верстка",
        "SEO-структура",
        "Інтеграція форм",
        "Гарантія 1 рік",
      ],
    },
    ctaLabel: "Choose Starter",
  },
  {
    popular: true,
    popularLabel: "★ MOST POPULAR",
    name: "Spec for industry",
    price: "$3 500",
    weeks: "4-8 нед",
    includes: {
      heading: "Все з Landing +",
      items: [
        "CMS, блог",
        "5+ інтеграцій",
        "Локальне SEO",
        <>Compliance: <em>МОЗ / RODO / HIPAA-aware</em></>,
        "UA + RU",
      ],
    },
    ctaLabel: "Choose Industry Pro",
  },
  {
    name: "Custom",
    price: "$14 000",
    weeks: "8-16 weeks",
    includes: {
      heading: "Все з Industry Pro +",
      items: [
        "Архітектурна сесія",
        "Dedicated team",
        <><em>SLA</em> + 24/7 support</>,
        "Custom integrations",
      ],
    },
    ctaLabel: "Talk to us",
    ctaGhost: true,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Code-Site.Art",
      url: SITE_ORIGIN,
      email: SITE_CONTACT.email,
      telephone: SITE_CONTACT.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kyiv",
        addressCountry: "UA",
      },
      sameAs: [
        SITE_CONTACT.telegram,
        SITE_CONTACT.linkedin,
        SITE_CONTACT.github,
      ],
      foundingDate: "2023",
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_ORIGIN,
      name: "Code-Site.Art",
      description:
        "Кастомні сайти для бізнесу: ми пишемо тексти, дизайнимо, кодимо, ставимо інтеграції. Через 4-10 тижнів ви отримуєте готовий сайт що починає приводити клієнтів сам.",
      inLanguage: "uk",
      publisher: { "@id": ORG_ID },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <HeroEditorial
        eyebrow={{ label: "CODE-SITE.ART · BOUTIQUE STUDIO" }}
        h1Lines={[
          <>
            Сайт <em>приймає заявки</em>,
          </>,
          <>поки ви працюєте.</>,
        ]}
        lede={
          <>
            Готовий сайт з текстами, дизайном і інтеграціями за{" "}
            <em>4-10 тижнів</em>. Без вашої участі більше ніж{" "}
            <em>5 годин</em> — ми пишемо контент, ставимо онлайн-форми,
            налаштовуємо локальне SEO. Через місяць він починає приводити
            клієнтів сам.
          </>
        }
        features={[
          { label: "Заявки 24/7", sub: "онлайн-форма + Telegram-міст" },
          { label: "4-10 тижнів", sub: "від брифу до запуску" },
          { label: "Гарантія 1 рік", sub: "+ неустойка 30% за зрив" },
          { label: "Все під ключ", sub: "тексти + дизайн + код + хостинг" },
        ]}
        ctaPrimaryLabel="Розрахувати вартість"
        ctaSecondaryLabel="Подивитись кейси"
        showStats
        stats={[
          { num: "47", lbl: <>проєктів<br/>за 3 роки</> },
          { num: "5", lbl: <>країн<br/>UA · EU · US · DK</> },
          { num: "×3.2", lbl: <>заявок<br/>у середньому</> },
          { num: "4.9/5", lbl: <>середня<br/>оцінка</> },
        ]}
        showTicker={false}
        deviceTags={[
          { kind: "default", primary: "Custom code" },
          { kind: "default", primary: "TypeScript", mini: "5.7" },
          { kind: "good", primary: "Lighthouse", mini: "98" },
        ]}
        deviceMockupSrc="/raw-design/assets/hero-devices.webp"
      />

      <TurnkeyList />
      <Marquee />
      <Industries />
      <Bento />
      <Process />
      <Cases />

      <section className="hp-section" id="pricing">
        <div className="hp-inner">
          <div className="hp-section-head">
            <div className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>/ 06 PRICING</span>
            </div>
            <h2 className="hp-h2">
              Прозорий прайс — від <em>$1 000</em> до <em>$14 000+</em>
            </h2>
            <p className="hp-sub">Без «під запит». Без прихованих платежів.</p>
          </div>
          <div className="cmp-pricing-grid">
            {HOMEPAGE_TIERS.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      <Stack />
      <PullQuote />
      <FinalCta3 />
      <Newsletter />
      <HpFooter />
    </>
  );
}
