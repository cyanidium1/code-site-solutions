import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import {
  EfedraCaseGallery,
  type EfedraGalleryTile,
} from "@/components/portfolio/efedra-case-gallery";
import {
  HpHeader,
  HpFooter,
  PullQuote,
  FinalCta3,
} from "@/components/homepage";
import {
  NbygMetaStrip,
  NbygRelatedCard as RelatedCard,
  type NbygRelatedRow,
} from "@/components/portfolio/nbyg-shared";
import { casesGridClass } from "@/components/blocks/related-card";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpLinkClass, hpSectionClass, hpSectionHeadClass } from "@/components/homepage/shared";

export const metadata: Metadata = {
  title: "Efedra Clinic — кейс редизайну сайту клініки в Одесі",
  description:
    "Як ми переробили сайт стоматологічної клініки + студії краси. Custom-coded на Next.js + Sanity. Результат: ×3.2 заявок, LCP 0.8s, Top-3 Google.",
  alternates: { canonical: "/portfolio/efedra-clinic" },
  openGraph: {
    title: "Efedra Clinic — кейс редизайну сайту клініки в Одесі",
    description:
      "Custom-coded на Next.js + Sanity. ×3.2 заявок, LCP 0.8s, Top-3 Google.",
    type: "article",
    locale: "uk_UA",
    url: "/portfolio/efedra-clinic",
  },
};

/* ─── Case media: public/EfedraCaseCreenshots (файли з узгодженими іменами) ─ */

const EFEDRA = "/EfedraCaseCreenshots" as const;

const EFEDRA_CASE_MEDIA = {
  before: `${EFEDRA}/efedra-main-before.jpg`,
  after: `${EFEDRA}/efedra-main-after.png`,
  gallery: [
    `${EFEDRA}/efedra-main-gallery-1.png`,
    `${EFEDRA}/efedra-gallery-2.png`,
    `${EFEDRA}/efedra-mobile.png`,
    `${EFEDRA}/efedra-admin.png`,
  ],
} as const;

/** Відео в блоці Outcome (перед PullQuote) — https://youtu.be/4asVKZhnY9c */
const EFEDRA_OUTCOME_VIDEO_ID = "4asVKZhnY9c";

function CaseShot({
  src,
  alt,
  priority,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      className={className ?? "h-full w-full object-cover block"}
    />
  );
}

function OutcomeYoutubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative block h-full min-h-[200px] w-full overflow-hidden rounded-[inherit]">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="Efedra Clinic — відео з кейсу (YouTube)"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 z-0 h-full w-full border-0"
      />
    </div>
  );
}

/* ─── Page-local data ───────────────────────────────────────────────────── */

const META_ITEMS = [
  "· Industry: Healthcare",
  "· Region: Odesa, Ukraine",
  "· Year: 2025",
  "· Stack: Next.js, Sanity, Vercel",
  "· Duration: 6 weeks",
  "· Budget: $5,000",
];

const RELATED: NbygRelatedRow[] = [
  {
    name: "NBYG København",
    meta: "Construction · Copenhagen + Bornholm, Denmark · 2024",
    metrics: "×8 inquiries · LCP 0.8s · Top-1 local",
    industry: "Construction",
    industryColor: "#EF4444",
    tech: "Next.js",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.20 25) 0%, oklch(0.62 0.18 60) 100%)",
    href: "/portfolio/nbyg-kobenhavn",
  },
  {
    name: "Tatarka",
    meta: "Real Estate Investment · Kyiv · 2025",
    metrics: "$4M raised · Investor portal · Multi-lang",
    industry: "Real Estate",
    industryColor: "#EF4444",
    tech: "Next.js",
    gradient:
      "linear-gradient(135deg, oklch(0.62 0.16 65) 0%, oklch(0.55 0.18 40) 100%)",
  },
  {
    name: "Webbond",
    meta: "Digital Agency · Kyiv · 2024",
    metrics: "Кастомний дизайн · Складний portfolio · Багатомовність",
    industry: "Digital Agency",
    industryColor: "#8B5CF6",
    tech: "Next.js",
    gradient:
      "linear-gradient(135deg, oklch(0.50 0.20 295) 0%, oklch(0.40 0.18 280) 100%)",
  },
];

/* ─── JSON-LD ───────────────────────────────────────────────────────────── */

const CASE_URL = pageUrl("/portfolio/efedra-clinic");
const ABOUT_URL = pageUrl("/about");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
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
          name: "Портфоліо",
          item: pageUrl("/portfolio"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Efedra Clinic",
          item: CASE_URL,
        },
      ],
    },
    {
      "@type": "Article",
      "@id": `${CASE_URL}#article`,
      url: CASE_URL,
      headline: "Efedra Clinic — кейс редизайну сайту клініки в Одесі",
      description:
        "Як ми переробили сайт стоматологічної клініки + студії краси. Custom-coded на Next.js + Sanity. Результат: ×3.2 заявок, LCP 0.8s, Top-3 Google.",
      inLanguage: "uk",
      datePublished: "2024-09-01",
      author: {
        "@type": "Person",
        "@id": `${ABOUT_URL}#fedir-alpatov`,
        name: "Fedir Alpatov",
        jobTitle: "Founder, Code-Site.Art",
        url: ABOUT_URL,
      },
      publisher: {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Code-Site.Art",
      },
      about: "Healthcare website redesign — Efedra Clinic, Odesa, Ukraine",
    },
  ],
};

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function EfedraCasePage() {
  const galleryTiles: EfedraGalleryTile[] = [
    {
      label: "Головна",
      src: EFEDRA_CASE_MEDIA.gallery[0],
      alt: "Efedra Clinic — головна сторінка сайту",
    },
    {
      label: "Приклади дизайну внутрішніх сторінок",
      src: EFEDRA_CASE_MEDIA.gallery[1],
      alt: "Efedra Clinic — приклади дизайну внутрішніх сторінок",
    },
    {
      label: "Мобільна версія",
      src: EFEDRA_CASE_MEDIA.gallery[2],
      alt: "Efedra Clinic — мобільна версія сайту",
    },
    {
      label: "Адмінпанель (Sanity CMS)",
      src: EFEDRA_CASE_MEDIA.gallery[3],
      alt: "Efedra Clinic — адмінпанель Sanity CMS",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      {/* Section 1: Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Портфоліо", href: "/portfolio" },
          { label: "Efedra Clinic" },
        ]}
        eyebrow="КЕЙС"
        headline={
          <>
            Efedra Clinic — стоматологія і <em>студія краси</em> в Одесі
          </>
        }
        sub="Двонапрямкова клініка в Одесі: стоматологія + естетична медицина. Перенесли з застарілого WordPress на Next.js + Sanity з мобільним онлайн-записом і локальним SEO."
      />
      <NbygMetaStrip items={META_ITEMS} />

      {/* Section 2: Stats bar */}
      <StatsBar
        items={[
          { value: "×3.2", label: "більше заявок на місяць" },
          { value: "0.8s", label: "LCP (було 4.2s)" },
          { value: "98", label: "Lighthouse performance" },
          { value: "Top-3", label: "Google по local запитам" },
        ]}
      />

      {/* Section 3: Challenge */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        bulletIcon="cross"
        eyebrow="ЗАДАЧА"
        heading={
          <>
            З чим <em>прийшов клієнт</em>
          </>
        }
        body="Клієнт мав застарілий сайт на Tilda 2021 року. Він не підтримував онлайн-запис, мав слабкий маркетинг і втрачав 60%+ потенційних пацієнтів через поганий UX та відсутність інструментів конверсії."
        bulletList={[
          "Сайт завантажувався понад 5 секунд на мобільному",
          "Не ранжувався в Google за ключовими запитами",
          "Не було зручної форми запису — лише базові контакти",
          "Відсутня маркетингова система (CTA, воронка, логіка конверсії)",
          "Мультимовність реалізована некоректно (змішані RU/UA тексти, без перемикання)",
          "Адмінка на Tilda була обмежена та незручна з телефону",
          "Висока абонплата через тарифну модель Tilda",
          "Сайт працював нестабільно та періодично падав",
          "Не було чіткого розділення послуг (стоматологія + краса)",
        ]}
        image={
          <CaseShot
            src={EFEDRA_CASE_MEDIA.before}
            alt="Старий сайт Efedra Clinic на Tilda до редизайну"
            priority
          />
        }
      />

      {/* Section 4: Solution */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="РІШЕННЯ"
        heading={
          <>
            Що ми <em>зробили</em>
          </>
        }
        body="Ми розробили новий сайт з нуля на Next.js + Sanity CMS. Структурували послуги (стоматологія та краса), покращили UX і впровадили систему конверсії з коректною SEO- та мультимовною архітектурою."
        bulletList={[
          "Повністю кастомний сайт на Next.js + Sanity CMS",
          "Швидкий mobile-first досвід з оптимізованою продуктивністю",
          "Онлайн-запис із продуманим користувацьким сценарієм",
          "Чітке розділення напрямків (стоматологія + краса)",
          "Зручні та зрозумілі прайси послуг",
          "CMS для простого редагування, у тому числі з телефону",
          "Відсутність абонплати — повний контроль над платформою",
          "Коректна мультимовність з SEO-індексацією",
          "Інтеграція з Telegram для обробки лідів",
          "SEO ведеться 3 місяці → вже є заявки з органічного трафіку",
        ]}
        image={
          <CaseShot
            src={EFEDRA_CASE_MEDIA.after}
            alt="Новий сайт Efedra Clinic на Next.js та Sanity після запуску"
          />
        }
      />

      {/* Section 5: Image gallery (2x2 fallback) */}
      <EfedraCaseGallery tiles={galleryTiles} />

      {/* Section 6: Outcome */}
      <ImageText
        variant="centered"
        sectionClassName="pt-5 max-[800px]:pt-5"
        eyebrow="РЕЗУЛЬТАТ"
        heading={
          <>
            Результат через 3 місяці після <em>запуску</em>
          </>
        }
        body={[
          "Через 3 місяці після запуску — нової версії сайту приніс ×3.2 більше заявок на місяць. Мобільний трафік виріс у 4 рази через локальне SEO. Адміністратор клініки витрачає на оновлення контенту в 5 разів менше часу — все самостійно через Sanity.",
          "Загальний ROI сайту окупився за 4 місяці тільки через додаткові заявки.",
        ]}
        bulletList={[
          "Заявок на місяць: 8 → 25",
          "Мобільний трафік: ×4",
          "Час оновлення контенту: −80%",
          "Cost per acquisition: −62%",
          "Bounce rate: 68% → 41%",
        ]}
        image={
          <OutcomeYoutubeEmbed videoId={EFEDRA_OUTCOME_VIDEO_ID} />
        }
      />

      {/* Section 7: Client quote */}
      <PullQuote
        quote={
          <>
            Все працює і я задоволена. Дякую величезне!) Якщо комусь буде
            потрібна ваша допомога, обов&apos;язково порекомендую.
            <br />
            <br />
            П.С. ще й нарешті заявки з органіки пішли!
          </>
        }
        showAvatar={false}
        name="Марія К."
        role="СЕО Проекту"
      />

      {/* Section 8: Related cases */}
      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <div className={hpSectionHeadClass}>
            <div className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>СУМІЖНІ КЕЙСИ</span>
            </div>
            <h2 className={hpH2Class}>
              Інші <em>кейси</em>
            </h2>
          </div>
          <div className={casesGridClass}>
            {RELATED.map((r) => (
              <RelatedCard key={r.name} row={r} />
            ))}
          </div>
          <Link href="/portfolio" className={hpLinkClass}>
            Всі кейси
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </Link>
        </div>
      </section>

      {/* Section 9: Final CTA */}
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
