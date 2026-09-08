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
import { WorldReach } from "@/components/homepage/world-reach";
import { cn } from "@/components/ui";
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
  "➤ Веб-студія: замовити сайт під ключ для бізнесу ✔️ Фікс-ціна від $800 ✔️ Next.js + Sanity ✔️ Запуск за 1–8 тижнів ➤ Безкоштовний прорахунок за день.";

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
      // Ahrefs, 31.08.2026: «кастомний сайт» відсутній у базі повністю,
      // а «замовити сайт» — 500 запитів при KD 0. Головна бере брендовий
      // і найм-інтент, головний комерційний кластер тримає /rozrobka-saitiv.
      title: "ᐈ Веб-студія Code-Site.Art — замовити сайт від $800",
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
            Проєктуємо, пишемо, розробляємо й запускаємо сайт за 4–10 тижнів.
            Вам — лише 5 годин на ключові рішення.
          </>
        }
        features={[
          { label: "Заявки 24/7", sub: "форма + Telegram" },
          { label: "Гарантія 1 рік", sub: "неустойка 30%" },
        ]}
        ctaPrimaryLabel="Розрахувати вартість"
        ctaPrimaryHref="/calculator"
        ctaSecondaryLabel="Безкоштовний аудит сайту за 24 години"
        ctaSecondaryHref="/contacts?source=hero-audit"
        stats={[
          { num: "50+", lbl: <>проєктів за 5 років</> },
          { num: "7", lbl: <>країн на мапі нижче</> },
          { num: "×3.2", lbl: <>більше заявок у кейсі клініки</> },
        ]}
        deviceTags={[
          { kind: "default", primary: "Custom code" },
          { kind: "default", primary: "TypeScript", mini: "5.7" },
          { kind: "good", primary: "Lighthouse", mini: "90+" },
        ]}
        deviceMockupSrc="/hero/hero-mockup.webp"
        deviceMockupAlt="Приклад сайту для бізнесу, створеного Code-Site.Art"
      />

      {/* Put visible proof before the explanatory sections. The case cards
          already carry CMS cover images, so this breaks the long run of text
          and lets a visitor judge the work before reading the rationale. */}
      <Cases />
      <PainPoints />
      <ValueStack />

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

      <Industries />
      <BusinessValue />
      {/* Process moved off the homepage: five text-only steps with no
          image, duplicating /process, which the header, the footer and
          the "where to start" list all link to. The homepage now spends
          that height on the reach map instead. */}

      <Marquee label="50+ КОМПАНІЙ ДОВІРИЛИСЯ · UA · EU · US · DK · ZA · UK · FR" />

      {/* The seven-countries claim used to be 10px of text inside a hero stat
          cell. Here it is the graphic: every pin is a real project location. */}
      <WorldReach
        eyebrow="ГЕОГРАФІЯ"
        heading={<>Запускаємо проєкти в <em>семи країнах</em></>}
        sub="Кожна крапка на мапі — сайт, який ми зробили і запустили: Одеса й Київ, Копенгаген і Борнгольм, Париж, Дублін, Лондон, Тирана, Нью-Йорк, Кейптаун."
        countries={["Україна", "Данія", "Франція", "Ірландія", "Велика Британія", "Албанія", "США", "ПАР"]}
        foot="Різниця в часових поясах не заважає: щоденний зв’язок у Telegram, звіт про прогрес — раз на тиждень."
      />

      <PullQuoteSwiper slides={testimonialSlides} />

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
          {/* `hpLinkClass` carries a 36px top margin for standalone
              "see all" links; in a list of eight it stacked to 550px on a
              phone (design audit 2026-09-06, H10). Here the gap does the
              spacing and the margin only returns at lg, where the links wrap
              into rows. */}
          <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-2 p-0 lg:flex lg:flex-wrap lg:gap-y-1">
            {DIRECTION_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={cn(hpLinkClass, "mt-0 lg:mt-9")}>
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
