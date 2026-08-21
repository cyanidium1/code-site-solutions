import type { Metadata } from "next";
import { AppImage } from "@/lib/shared/app-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import { VerticalTimeline } from "@/components/blocks/vertical-timeline";
import { HpHeader, HpFooter } from "@/components/homepage";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import { PROCESS_STEPS as STEPS, PROCESS_FAQ } from "@/content/ru/process";
import { buildAlternates } from "@/lib/shared/alternates";

const META_TITLE = "Процесс — 7 шагов от брифа до запуска | Code-Site.Art";
const META_DESCRIPTION =
  "4-10 недель под ключ. Ваше время: 5 часов всего. Фиксированная цена, фиксированный срок, неустойка 30% за срыв. Вот как мы работаем.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: buildAlternates({ locale: "ru", uaPath: "/process" }),
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    locale: "ru_UA",
    url: "/ru/process",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/ru/process",
    locale: "ru",
    title: META_TITLE,
    description: META_DESCRIPTION,
  }),
  breadcrumbNode([
    { name: "Главная", path: "/ru" },
    { name: "Процесс", path: "/ru/process" },
  ]),
  {
    "@type": "FAQPage",
    mainEntity: PROCESS_FAQ.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: plainRich(it.a),
      },
    })),
  },
]);

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function RuProcessPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Главная", href: "/ru" },
          { label: "Процесс" },
        ]}
        eyebrow="ПРОЦЕСС · 4-10 НЕДЕЛЬ ПОД КЛЮЧ"
        headline={
          <>
            <em>9 вещей</em>, которые мы делаем за вас. Ваше время: меньше 5 часов.
          </>
        }
        sub="Вы не пишете ТЗ. Не ищете референсы. Не ловите фотографа. Вы тратите 30 минут на рассказ о бизнесе — и через 4-10 недель у вас готовый сайт."
      />

      <StatsBar
        items={[
          { value: <>4-10</>, label: "недель весь срок" },
          { value: <>5 часов</>, label: "вашего времени всего" },
          { value: <>100%</>, label: "фиксированная цена" },
          { value: <>30%</>, label: "неустойка за срыв" },
        ]}
      />

      <VerticalTimeline steps={STEPS} />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="КОММУНИКАЦИЯ"
        heading={
          <>
            Как мы <em>общаемся</em> во время проекта
          </>
        }
        body="Вы не пропадаете на 6 недель, чтобы получить сайт «из ниоткуда». Каждый шаг — контрольная точка, где вы видите и утверждаете."
        bulletList={[
          "Telegram-чат ежедневно — ответ в течение 30 минут в рабочее время",
          "Еженедельный screencast (3-5 минут)",
          "Email-отчёт каждую неделю со статусом этапов",
          "Zoom-звонок раз в спринт (опционально, по вашему запросу)",
          "GitHub-коммиты видны ежедневно — полная прозрачность",
          "Staging-URL для просмотра в реальном времени",
          "Если вы недоступны неделю — проект ставится на паузу, срок сдвигается",
        ]}
        image={
          <AppImage
            src="/communication.webp"
            alt="Сайт Mono Pools на ноутбуке и телефоне с готовыми проектами и отзывами клиентов"
            width={1600}
            height={1289}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <section className="bg-bg">
        <FAQ heading="А что если…?" items={PROCESS_FAQ} locale="ru" />
      </section>

      <CtaBanner
        eyebrow="ГОТОВЫ?"
        heading={
          <>
            Готовы пройти процесс <em>вместе с нами</em>?
          </>
        }
        sub="Первый шаг бесплатный. 30-мин консультация — и вы знаете вилку цены и срок."
        ctaPrimary={{
          label: "Рассчитать цену →",
          href: "/ru/calculator",
        }}
        ctaSecondary={{
          label: "Или обсудить с нами",
          href: "/ru/contacts",
        }}
      />

      <HpFooter />
    </>
  );
}
