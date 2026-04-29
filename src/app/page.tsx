import { HeroEditorial } from "@/components/blocks/hero";
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
        "Compliance: <em>МОЗ / RODO / HIPAA-aware</em>",
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
        "<em>SLA</em> + 24/7 support",
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
      "@id": "https://code-site.art/#organization",
      name: "Code-Site.Art",
      url: "https://code-site.art",
      email: "hi@code-site.art",
      telephone: "+380-97-006-87-07",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kyiv",
        addressCountry: "UA",
      },
      sameAs: [
        "https://t.me/fedirdev",
        "https://linkedin.com/in/fedirdev",
        "https://github.com/fedirdev",
      ],
      foundingDate: "2023",
    },
    {
      "@type": "WebSite",
      "@id": "https://code-site.art/#website",
      url: "https://code-site.art",
      name: "Code-Site.Art",
      description:
        "Бутик-студія з Києва. Custom-coded сайти для клінік, юристів, бухгалтерії, e-commerce і SaaS.",
      inLanguage: "uk",
      publisher: { "@id": "https://code-site.art/#organization" },
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
        eyebrow={{ label: "CODE-SITE.ART · STUDIO", em: "ВІД $1 000" }}
        h1Lines={[
          <>Custom-coded сайти,</>,
          <>
            що <em>приводять</em>
          </>,
        ]}
        h1Num="30+"
        h1NumLabel={
          <>
            проєктів
            <br />
            з 2023 року
          </>
        }
        lede={
          <>
            Запуск за <em>4-10 тижнів</em>, гарантія 1 рік + неустойка за зрив,
            Lighthouse 95+ зі старту. Код у вашому GitHub з першого коміту.
          </>
        }
        features={[
          { label: "Lighthouse 95+", sub: "зі старту" },
          { label: "Гарантія 1 рік", sub: "+ неустойка за зрив" },
          { label: "Запуск 4-10 тижнів", sub: "industry-сайти" },
          { label: "GitHub", sub: "ваш від першого коміту" },
        ]}
        ctaPrimaryLabel="Розрахувати вартість"
        ctaSecondaryLabel="Подивитись рішення"
        showStats
        stats={[
          { num: "30+", lbl: <>проєктів<br/>з 2023</> },
          { num: "4.9/5", lbl: <>середня<br/>оцінка</> },
          { num: "5", lbl: <>країн<br/>UA · EU · US</> },
        ]}
        showTicker={false}
        deviceTags={[
          { kind: "default", primary: "Custom code" },
          { kind: "default", primary: "TypeScript", mini: "5.7" },
          { kind: "good", primary: "Lighthouse", mini: "98" },
        ]}
      />

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
