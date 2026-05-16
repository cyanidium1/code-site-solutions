import { HeroEditorial } from "@/components/blocks/hero";
import { TurnkeyList } from "@/components/blocks/turnkey-list";
import { Tier, type TierProps } from "@/components/blocks/comparison";
import "@/components/blocks/comparison/comparison.css";
import { FAQ, type FAQItem } from "@/components/blocks/final";
import {
  HpHeader,
  Marquee,
  Industries,
  Bento,
  Process,
  Cases,
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
    weeks: "1-2 тижні",
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
    weeks: "4-8 тижнів",
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
    weeks: "8-16 тижнів",
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

const HOMEPAGE_FAQ: FAQItem[] = [
  {
    q: "Скільки коштує мій сайт?",
    a: [
      "Залежить від типу. Лендінг — від ",
      { em: "$1 000" },
      ". Сайт під індустрію (медицина, юристи, бухгалтерія, нерухомість і т.д.) — від ",
      { em: "$3 500" },
      ". Custom-проєкти з нестандартною архітектурою — від ",
      { em: "$14 000" },
      ". Точна цифра — у ",
      { link: { href: "/calculator", text: "калькуляторі" } },
      " або після 30-хв розмови.",
    ],
  },
  {
    q: "Скільки часу від брифу до запуску?",
    a: [
      "Лендінг — ",
      { em: "1-2 тижні" },
      ". Industry-сайт — ",
      { em: "4-8 тижнів" },
      ". Custom — ",
      { em: "8-16 тижнів" },
      ". Це з усіма правками, контентом і SEO. Без сюрпризів — фіксована дата в договорі.",
    ],
  },
  {
    q: "Що якщо мій бюджет менше за ваш мінімум?",
    a: [
      "Чесно скажемо, що не зробимо за цю ціну, і порадимо, до кого звернутися. Не беремо проєкти, які не можемо зробити якісно за вашими грошима.",
    ],
  },
  {
    q: "Що якщо я не знаю точно, що мені потрібно?",
    a: [
      "Це нормально. На безкоштовній 30-хв розмові ми задамо ",
      { em: "10-15 питань" },
      " і самі сформуємо ТЗ. Ваше завдання — описати бізнес.",
    ],
  },
  {
    q: "Я можу побачити код, перш ніж заплатити повністю?",
    a: [
      "Так. Після першого етапу (дизайн) ви отримуєте доступ до ",
      { em: "репозиторію" },
      ". Дивитеся, ставите коментарі, приймаєте рішення продовжувати.",
    ],
  },
  {
    q: "Що ви робите після запуску?",
    a: [
      "Перші ",
      { em: "2 місяці" },
      " — безкоштовні правки, моніторинг і фікси. Далі — 1 рік гарантії в ціні (баги фіксимо за 4 робочі години). Підтримка/розвиток — за фіксованою ставкою без сюрпризів.",
    ],
  },
  {
    q: "Можна почати з лендінгу і пізніше дорости до повного сайту?",
    a: [
      "Так. Архітектура, яку ми пишемо, ",
      { em: "масштабується" },
      ". Стартуєте з Landing — через рік додаємо CMS, блог, додаткові індустрії — без переписування з нуля.",
    ],
  },
  {
    q: "Що якщо у мене вже є дизайнер / контент / логотип?",
    a: [
      "Тоді працюємо з вашими файлами або Figma. Це ",
      { em: "-10-15% від ціни" },
      " і коротший термін. У договорі прописуємо, що ви даєте і коли.",
    ],
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
            Готовий сайт за <em>4-10 тижнів</em>. Ваша участь —{" "}
            <em>5 годин</em>, далі сайт працює сам: пише заявки, веде клієнтів
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
        ctaSecondaryLabel="Безкоштовний аудит сайту за 24 год →"
        ctaSecondaryHref="/contacts?source=hero-audit"
        ctaSecondaryShowPlay={false}
        ctaFootnote="Без розмови з sales. Без email-розсилки. Просто аудит."
        showStats
        stats={[
          { num: "47", lbl: <>проєктів<br/>за 3 роки</> },
          { num: "4", lbl: <>країни<br/>UA · EU · US · DK</> },
          { num: "×3.2", lbl: <>заявок<br/>у середньому</> },
          { num: "0.6s", lbl: <>LCP<br/>швидкість</> },
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
              <span>/ 07 PRICING</span>
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

      <PullQuote
        caseHref="/portfolio/nbyg-kobenhavn"
        caseLabel="Подивитись повний кейс"
      />
      <FAQ heading="Найчастіші питання перед стартом" items={HOMEPAGE_FAQ} />
      <FinalCta3
        urgency={
          <>
            Найближчий старт — <strong>через 2 тижні</strong>. На цей квартал
            лишилося <strong>2 з 4 слотів</strong>. Відповідаємо на заявку за
            4 робочі години.
          </>
        }
      />
      <Newsletter />
      <HpFooter />
    </>
  );
}
