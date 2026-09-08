import type { Metadata } from "next";
import { ValueStack } from "@/components/blocks/value-stack";
import { Tier, CmpPricingGrid } from "@/components/blocks/comparison";
import { FAQ } from "@/components/blocks/final";
import {
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
import { OG_DEFAULT_IMAGE, ORG_ID, SITE_ORIGIN } from "@/constants/site";
import {
  buildJsonLd,
  buildReviewNodes,
  organizationNode,
  webPageNode,
  websiteNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { buildAlternates } from "@/lib/shared/alternates";
import { RU_INDUSTRIES, RU_TIERS, buildRuHomepageFaq } from "@/content/ru/homepage";
import {
  fetchPricingPlans,
  toHomepagePlanOverride,
  pricingRange,
} from "@/lib/server/fetch-pricing-plans";
import { fetchTestimonialSlides } from "@/lib/server/fetch-testimonials";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpSectionClass, hpSectionHeadClass, hpSubClass } from "@/components/homepage/shared";
import { HeroShowcase } from "@/components/homepage/hero-showcase";
import { WorldReach } from "@/components/homepage/world-reach";

const HOMEPAGE_RU_DESCRIPTION =
  "➤ Кастомные сайты под ключ для бизнеса и стартапов ✔️ Фикс-цена от $800 ✔️ Next.js + Sanity ✔️ Запуск за 4–10 недель ✔️ Гарантия 1 год ➤ Закажите бесплатный звонок.";

export const metadata: Metadata = {
  title: "ᐈ Веб-студия Code-Site.Art — заказать сайт от $800",
  description: HOMEPAGE_RU_DESCRIPTION,
  alternates: buildAlternates({ locale: "ru", uaPath: "/" }),
  openGraph: {
    title: "ᐈ Веб-студия Code-Site.Art — заказать сайт от $800",
    description: HOMEPAGE_RU_DESCRIPTION,
    type: "website",
    locale: "ru_UA",
    url: `${SITE_ORIGIN}/ru`,
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Веб-студия Code-Site.Art — заказать сайт от $800",
    description: HOMEPAGE_RU_DESCRIPTION,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

export default async function HomePageRu() {
  const [cmsPlans, testimonialSlides] = await Promise.all([
    fetchPricingPlans("ru"),
    fetchTestimonialSlides("ru"),
  ]);
  const tiers = cmsPlans.length ? cmsPlans.map((p) => p.tier) : RU_TIERS;
  const planOverride = toHomepagePlanOverride(cmsPlans);
  const faqItems = buildRuHomepageFaq(planOverride);
  const range = pricingRange(cmsPlans, "ru");

  // Same slides feed the slider below — Google's "review visible on page"
  // rule is satisfied. Slides missing rating or date are silently dropped.
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
    websiteNode("ru", HOMEPAGE_RU_DESCRIPTION),
    webPageNode({
      path: "/ru",
      locale: "ru",
      title: "ᐈ Веб-студия Code-Site.Art — заказать сайт от $800",
      description: HOMEPAGE_RU_DESCRIPTION,
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
      {/* Hero: the colour-changing showcase from the previous code-site.art
          build - four arguments, four real projects, three counting figures
          each. Slide 1 keeps the page h1 verbatim; the others are h2. */}
      <HeroShowcase
        locale="ru"
        ctaPrimaryLabel="Обсудить проект"
        ctaPrimaryHref="/ru/contacts"
        ctaSecondaryLabel="Бесплатный аудит за 24 часа"
        ctaSecondaryHref="/ru/contacts?source=hero-audit"
        slideLabelTemplate="Перейти к слайду {n}"
        slides={[
          {
            id: "leads",
            slug: "efedra-clinic",
            theme: "green",
            title: (
              <>
                Сайты любой сложности, которые приводят{" "}
                <em className="not-italic text-accent-soft">заявки 24/7</em>
              </>
            ),
            description:
              "Проектируем, пишем, разрабатываем и запускаем сайт за 4–10 недель. Вам — только 5 часов на ключевые решения.",
            subtitle: "Заявка падает в Telegram, а не в почту",
            figures: [
              { value: "×3.2", label: "больше заявок в кейсе клиники" },
              { value: "24/7", label: "онлайн-форма + Telegram-мост" },
              { value: "1", label: "год гарантии после запуска" },
            ],
            caseLabel: "Кейс: Efedra Clinic →",
          },
          {
            id: "speed",
            slug: "nbyg-kobenhavn",
            theme: "amber",
            title: <>Скорость, которую видно в Core Web Vitals</>,
            description:
              "Собственный код без лишних зависимостей: страница открывается раньше, чем человек успеет передумать.",
            subtitle: "Скорость — это позиции в поиске",
            figures: [
              { value: "90+", label: "Lighthouse на продакшене" },
              { value: "0.8s", label: "LCP в кейсе клиники" },
              { value: "100%", label: "адаптив mobile / tablet / desktop" },
            ],
            caseLabel: "Кейс: NBYG København →",
          },
          {
            id: "price",
            slug: "solide-renovation",
            theme: "violet",
            title: <>Фикс-цена в договоре — от $800</>,
            description:
              "Вы видите сумму до старта работ и фиксируете её. Срыв срока с нашей стороны — неустойка 30%.",
            subtitle: "Цена не меняется после старта",
            figures: [
              { value: "$800", label: "стартовая цена лендинга" },
              { value: "4–10", label: "недель от брифа до запуска" },
              { value: "30%", label: "неустойка за срыв срока" },
            ],
            caseLabel: "Кейс: Solide Renovation →",
          },
          {
            id: "reach",
            slug: "aleko-course",
            theme: "cyan",
            title: <>50+ проектов в семи странах</>,
            description:
              "Пять лет работы — от лендинга до платформы с CMS и интеграциями. Команда в Украине, клиенты в ЕС и США.",
            subtitle: "От лендинга до платформы с CMS",
            figures: [
              { value: "50+", label: "проектов за 5 лет" },
              { value: "7", label: "стран на карте ниже" },
              { value: "5", label: "лет студии" },
            ],
            caseLabel: "Кейс: Aleko Course →",
          },
        ]}
      />

      <PainPoints locale="ru" />
      <ValueStack locale="ru" />

      <section className={hpSectionClass} id="pricing">
        <div className={hpInnerClass}>
          <div className={hpSectionHeadClass}>
            <div className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>ЦЕНЫ</span>
            </div>
            <h2 className={hpH2Class}>
              Прозрачный прайс — от <em>{range.min}</em>
            </h2>
            <p className={hpSubClass}>Вы видите цену заранее и фиксируете её до старта работ.</p>
          </div>
          <CmpPricingGrid>
            {tiers.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </CmpPricingGrid>
        </div>
      </section>

      <Industries
        heading={
          <>
            Решения для <em>вашей отрасли.</em>
          </>
        }
        sub="Полное решение с интеграциями и compliance, которых ждёт ваш сектор."
        items={RU_INDUSTRIES}
      />

      <BusinessValue locale="ru" />

      {/* Process moved off the homepage: text-only steps with no image,
          duplicating /process, which the header, the footer and the
          "where to start" list all link to. The homepage now spends that
          height on the reach map instead. */}

      <Cases
        eyebrow="КЕЙСЫ"
        heading={
          <>
            50+ клиентов <em>готовы нас рекомендовать</em>
          </>
        }
        locale="ru"
        ctaLabel="Все кейсы"
        ctaHref="/ru/portfolio"
      />

      <Marquee label="50+ КОМПАНИЙ ДОВЕРИЛИСЬ · UA · EU · US · DK · ZA · UK · FR" />

      {/* The seven-countries claim used to be 10px of text inside a hero stat
          cell. Here it is the graphic: every pin is a real project location. */}
      <WorldReach
        eyebrow="ГЕОГРАФИЯ"
        heading={<>Запускаем проекты в <em>семи странах</em></>}
        sub="Каждая точка на карте — сайт, который мы сделали и запустили: Одесса и Киев, Копенгаген и Борнхольм, Париж, Дублин, Лондон, Тирана, Нью-Йорк, Кейптаун."
        countries={["Украина", "Дания", "Франция", "Ирландия", "Великобритания", "Албания", "США", "ЮАР"]}
        foot="Разница в часовых поясах не мешает: ежедневная связь в Telegram, отчёт о прогрессе — раз в неделю."
      />

      <PullQuoteSwiper slides={testimonialSlides} />

      <FAQ heading="Вопросы, которые возникают перед стартом" items={faqItems} locale="ru" />
      <LaunchCta locale="ru" />
      </main>
      <HpFooter />
    </>
  );
}
