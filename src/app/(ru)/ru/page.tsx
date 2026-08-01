import type { Metadata } from "next";
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
import { ORG_ID, SITE_ORIGIN } from "@/constants/site";
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

const HOMEPAGE_RU_DESCRIPTION =
  "➤ Кастомные сайты под ключ для бизнеса и стартапов ✔️ Фикс-цена от $800 ✔️ Next.js + Sanity ✔️ Запуск за 4–10 недель ✔️ Гарантия 1 год ➤ Закажите бесплатный звонок.";

export const metadata: Metadata = {
  title: "ᐈ Студия разработки кастомных сайтов под ключ | Code-Site.Art",
  description: HOMEPAGE_RU_DESCRIPTION,
  alternates: buildAlternates({ locale: "ru", uaPath: "/" }),
  openGraph: {
    title: "ᐈ Студия разработки кастомных сайтов под ключ | Code-Site.Art",
    description: HOMEPAGE_RU_DESCRIPTION,
    type: "website",
    locale: "ru_UA",
    url: `${SITE_ORIGIN}/ru`,
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Студия разработки кастомных сайтов под ключ | Code-Site.Art",
    description: HOMEPAGE_RU_DESCRIPTION,
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
      title: "ᐈ Студия разработки кастомных сайтов под ключ | Code-Site.Art",
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
      <HomeHero
        eyebrow={{ label: "CODE-SITE.ART · БУТИК-СТУДИЯ" }}
        h1Lines={[
          <>Сайты любой сложности,</>,
          <>
            которые приводят <em>заявки 24/7.</em>
          </>,
        ]}
        lede={
          <>
            За 4–10 недель вы получаете сайт, который быстро загружается,
            вызывает доверие с первого экрана и ранжируется в Google и
            AI-поиске. Ваше участие — 5 часов. Остальное берём на себя.
          </>
        }
        features={[
          { label: "Заявки 24/7", sub: "онлайн-форма + Telegram-мост" },
          { label: "4-10 недель", sub: "от брифа до запуска" },
          { label: "Гарантия 1 год", sub: "+ неустойка 30% за срыв" },
          { label: "Всё под ключ", sub: "тексты + дизайн + код + хостинг" },
        ]}
        ctaPrimaryLabel="Обсудить проект"
        ctaPrimaryHref="/ru/contacts"
        ctaSecondaryLabel="Бесплатный аудит сайта за 24 часа"
        ctaSecondaryHref="/ru/contacts?source=hero-audit"
        ctaFootnote="В течение 24 часов пришлём разбор: что тормозит ваш сайт, почему нет заявок и что исправить первым."
        stats={[
          { num: "50+", lbl: <>проектов<br/>за 5 лет</> },
          { num: "7", lbl: <>стран<br/>UA · EU · US · DK · ZA · UK · FR</> },
          { num: "×3.2", lbl: <>больше заявок<br/>в среднем</> },
          { num: "30%", lbl: <>неустойка<br/>за срыв срока</> },
        ]}
        deviceTags={[
          { kind: "default", primary: "Custom code" },
          { kind: "default", primary: "TypeScript", mini: "5.7" },
          { kind: "good", primary: "Lighthouse", mini: "98" },
        ]}
        deviceMockupSrc="/hero/hero-mockup.webp"
        deviceMockupAlt="Пример сайта для бизнеса, созданного Code-Site.Art"
      />

      <PainPoints locale="ru" />
      <ValueStack locale="ru" />

      <Industries
        eyebrow=""
        heading={
          <>
            Решения для <em>вашей отрасли.</em>
          </>
        }
        sub="Полное решение с интеграциями и compliance, которых ждёт ваш сектор."
        items={RU_INDUSTRIES}
      />

      <BusinessValue locale="ru" />

      <Process
        eyebrow="ПРОЦЕСС · 4-10 НЕДЕЛЬ"
        heading={
          <>
            Построить. Запустить. Расти.
            <br />
            <em>Без шести месяцев совещаний.</em>
          </>
        }
        sub={
          <>
            Фиксированный объём. Фиксированный срок. Фиксированная цена.{" "}
            <span className="text-ink-3">Вы заранее знаете, что получите, когда и за сколько.</span>
          </>
        }
        steps={[
          { n: "01", name: "Бриф", duration: "1 день", items: ["Цели бизнеса", "Структура", "Анализ конкурентов"] },
          { n: "02", name: "Архитектура", duration: "1–2 недели", items: ["Страницы", "Воронки", "SEO-структура"] },
          { n: "03", name: "Дизайн и разработка", duration: "2–6 недель", items: ["UI", "Настройка CMS", "Интеграции"] },
          { n: "04", name: "Тестирование", duration: "~1 неделя", items: ["QA", "Аналитика", "Редиректы"] },
          { n: "05", name: "Запуск и поддержка", duration: "год поддержки", items: ["Мониторинг", "Гарантия 1 год", "Постоянный рост"] },
        ]}
        ctaLabel="Весь процесс"
        ctaHref="/process"
      />

      <Cases
        eyebrow="КЕЙСЫ"
        heading={
          <>
            50+ клиентов <em>готовы нас рекомендовать</em>
          </>
        }
        locale="ru"
        ctaLabel="Все кейсы"
        ctaHref="/portfolio"
      />

      <Marquee label="50+ КОМПАНИЙ ДОВЕРИЛИСЬ · UA · EU · US · DK · ZA · UK · FR" />

      <PullQuoteSwiper slides={testimonialSlides} />

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

      <FAQ heading="Вопросы, которые возникают перед стартом" items={faqItems} locale="ru" />
      <LaunchCta locale="ru" />
      </main>
      <HpFooter />
    </>
  );
}
