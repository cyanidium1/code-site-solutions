import { ValueStack } from "@/components/blocks/value-stack";
import { Tier, CmpPricingGrid } from "@/components/blocks/comparison";
import { FAQ } from "@/components/blocks/final";
import {
  HomeHero,
  HpHeader,
  Marquee,
  Industries,
  BusinessValue,
  PainPoints,
  Process,
  Cases,
  PullQuoteSwiper,
  HpFooter,
} from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { ORG_ID } from "@/constants/site";
import {
  buildJsonLd,
  buildReviewNodes,
  organizationNode,
  webPageNode,
  websiteNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { buildHomepageFaq, HOMEPAGE_TIERS } from "@/content/uk/homepage";
import {
  fetchPricingPlans,
  toHomepagePlanOverride,
  pricingRange,
} from "@/lib/server/fetch-pricing-plans";
import { fetchTestimonialSlides } from "@/lib/server/fetch-testimonials";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpLinkClass, hpSectionClass, hpSectionHeadClass, hpSubClass } from "@/components/homepage/shared";
import Link from "next/link";

/**
 * In-content directions block. Every external link the site earns points at
 * the homepage; this block passes that equity down to the money pages with
 * keyword anchors (footer/nav links don't count for this purpose).
 */
const DIRECTION_LINKS: { href: string; label: string }[] = [
  { href: "/sites-for/medicine", label: "Створення медичних сайтів" },
  { href: "/sites-for/renovation", label: "Розробка сайту для будівельної компанії" },
  { href: "/pricing", label: "Ціна створення сайту" },
  { href: "/calculator", label: "Калькулятор вартості сайту" },
  { href: "/seo", label: "Просування сайту від $300/міс" },
  { href: "/portfolio", label: "Кейси розробки сайтів" },
  { href: "/process", label: "Процес розробки сайту" },
  { href: "/support", label: "Обслуговування сайтів — вартість" },
];

const HOMEPAGE_DESCRIPTION =
  "➤ Кастомні сайти під ключ для бізнесу та стартапів ✔️ Фікс-ціна від $800 ✔️ Next.js + Sanity ✔️ Запуск за 4–10 тижнів ✔️ Гарантія 1 рік ➤ Замовте безкоштовний дзвінок.";

export default async function HomePage() {
  const [cmsPlans, testimonialSlides] = await Promise.all([
    fetchPricingPlans("uk"),
    fetchTestimonialSlides("uk"),
  ]);
  const tiers = cmsPlans.length ? cmsPlans.map((p) => p.tier) : HOMEPAGE_TIERS;
  const planOverride = toHomepagePlanOverride(cmsPlans);
  const faqItems = buildHomepageFaq(planOverride);
  const range = pricingRange(cmsPlans, "uk");

  // Reviews attach to the Organization — same slides feed the slider, so
  // Google's "review visible on page" rule is satisfied. Slides missing
  // rating or date are silently dropped by `buildReviewNodes`.
  const reviews = buildReviewNodes(
    testimonialSlides.map((s) => ({
      body: s.quote,
      authorName: s.authorName,
      rating: s.rating,
      datePublished: s.reviewDate ?? s.createdAt?.slice(0, 10),
      headline: s.reviewHeadline,
    })),
    ORG_ID,
  );

  const jsonLd = buildJsonLd([
    organizationNode(),
    websiteNode("uk", HOMEPAGE_DESCRIPTION),
    webPageNode({
      path: "/",
      locale: "uk",
      title: "ᐈ Студія розробки кастомних сайтів під ключ | Code-Site.Art",
      description: HOMEPAGE_DESCRIPTION,
      speakableSelectors: [
        '[data-speakable="hero-title"]',
        '[data-speakable="hero-description"]',
      ],
    }),
    reviews,
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <main>
      <HomeHero
        eyebrow={{ label: "CODE-SITE.ART · БУТИК-СТУДІЯ" }}
        h1Lines={[
          <>Сайти будь-якої складності,</>,
          <>
            що приводять <em>заявки 24/7.</em>
          </>,
        ]}
        lede={
          <>
            За 4–10 тижнів ви отримуєте сайт, який швидко завантажується,
            викликає довіру з першого екрана й ранжується в Google та
            AI-пошуку. Ваша участь — 5 годин. Решту беремо на себе.
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
        ctaSecondaryLabel="Безкоштовний аудит сайту за 24 години"
        ctaSecondaryHref="/contacts?source=hero-audit"
        ctaFootnote="Протягом 24 годин надішлемо розбір: що гальмує ваш сайт, чому немає заявок і що виправити першим."
        stats={[
          { num: "50+", lbl: <>проєктів<br/>за 5 років</> },
          { num: "7", lbl: <>країн<br/>UA · EU · US · DK · ZA · UK · FR</> },
          { num: "×3.2", lbl: <>більше заявок<br/>у середньому</> },
          { num: "30%", lbl: <>неустойка<br/>за зрив терміну</> },
        ]}
        deviceTags={[
          { kind: "default", primary: "Custom code" },
          { kind: "default", primary: "TypeScript", mini: "5.7" },
          { kind: "good", primary: "Lighthouse", mini: "98" },
        ]}
        deviceMockupSrc="/hero/hero-mockup.webp"
        deviceMockupAlt="Приклад сайту для бізнесу, створеного Code-Site.Art"
      />

      <PainPoints />
      <ValueStack />
      <Industries />
      <BusinessValue />
      <Process />
      <Cases />

      <Marquee label="50+ КОМПАНІЙ ДОВІРИЛИСЯ · UA · EU · US · DK · ZA · UK · FR" />

      <PullQuoteSwiper slides={testimonialSlides} />

      <section className={hpSectionClass} id="pricing">
        <div className={hpInnerClass}>
          <div className={hpSectionHeadClass}>
            <div className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>ЦІНИ</span>
            </div>
            <h2 className={hpH2Class}>
              Прозорий прайс — від <em>{range.min}</em>
            </h2>
            <p className={hpSubClass}>Ви бачите ціну наперед і фіксуєте її до старту робіт.</p>
          </div>
          <CmpPricingGrid>
            {tiers.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </CmpPricingGrid>
        </div>
      </section>

      <section className={hpSectionClass} id="directions">
        <div className={hpInnerClass}>
          <div className={hpSectionHeadClass}>
            <div className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>НАПРЯМКИ</span>
            </div>
            <h2 className={hpH2Class}>
              З чого <em>почати</em>
            </h2>
            <p className={hpSubClass}>
              Сторінки, з яких найчастіше починають: рішення під вашу галузь,
              ціни і процес роботи.
            </p>
          </div>
          <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-1 p-0">
            {DIRECTION_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={hpLinkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQ heading="Питання, які виникають перед стартом" items={faqItems} />
      <LaunchCta locale="uk" />
      </main>
      <HpFooter />
    </>
  );
}
