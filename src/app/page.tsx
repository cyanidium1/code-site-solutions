import { HeroEditorial } from "@/components/blocks/hero";
import { TurnkeyList } from "@/components/blocks/turnkey-list";
import { Tier, CmpPricingGrid } from "@/components/blocks/comparison";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  Marquee,
  Industries,
  Bento,
  Process,
  Cases,
  PullQuoteSwiper,
  HpFooter,
} from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import "@/components/homepage/homepage.css";
import { ORG_ID, SITE_CONTACT, SITE_ORIGIN, WEBSITE_ID } from "@/constants/site";
import { HOMEPAGE_FAQ, HOMEPAGE_TIERS } from "@/content/uk/homepage";

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

      <main>
      <HeroEditorial
        eyebrow={{ label: "CODE-SITE.ART · БУТИК-СТУДІЯ" }}
        h1Lines={[
          <>
            Сайт <em>приймає заявки</em>,
          </>,
          <>поки ви працюєте.</>,
        ]}
        lede={
          <>
            Готовий сайт за 4-10 тижнів. Ваша участь — 5 годин, далі сайт працює сам: пише заявки, веде клієнтів
            і ранжується в Google.
          </>
        }
        features={[
          { label: "Заявки 24/7", sub: "онлайн-форма + Telegram-міст" },
          { label: "4-10 тижнів", sub: "від брифу до запуску" },
          { label: "Гарантія 1 рік", sub: "+ неустойка 30% за зрив" },
          { label: "Все під ключ", sub: "тексти + дизайн + код + хостинг" },
        ]}
        ctaPrimaryLabel="Розрахувати вартість"
        ctaPrimaryHref="/calculator"
        ctaSecondaryLabel="Безкоштовний аудит сайту за 24 год"
        ctaSecondaryHref="/contacts?source=hero-audit"
        ctaSecondaryShowPlay={false}
        ctaFootnote="Без розмови з sales. Без email-розсилки. Просто аудит."
        showStats
        stats={[
          { num: "47", lbl: <>проєктів<br/>за 3 роки</> },
          { num: "4", lbl: <>країни<br/>UA · EU · US · DK</> },
          { num: "×3.2", lbl: <>заявок<br/>у середньому</> },
          { num: "4.9/5", lbl: <>оцінка<br/>клієнтів</> },
        ]}
        showTicker={false}
        deviceTags={[
          { kind: "default", primary: "Custom code" },
          { kind: "default", primary: "TypeScript", mini: "5.7" },
          { kind: "good", primary: "Lighthouse", mini: "98" },
        ]}
        deviceMockupSrc="/hero/hero-mockup.webp"
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
              <span>ЦІНИ</span>
            </div>
            <h2 className="hp-h2">
              Прозорий прайс — від <em>$800</em> до <em>$6 000+</em>
            </h2>
            <p className="hp-sub">Без «під запит». Без прихованих платежів.</p>
          </div>
          <CmpPricingGrid>
            {HOMEPAGE_TIERS.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </CmpPricingGrid>
        </div>
      </section>

      <PullQuoteSwiper locale="uk" />
      <FAQ heading="Найчастіші питання перед стартом" items={HOMEPAGE_FAQ} />
      <LaunchCta locale="uk" />
      </main>
      <HpFooter />
    </>
  );
}
