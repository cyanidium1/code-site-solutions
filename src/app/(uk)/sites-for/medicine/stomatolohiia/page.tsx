import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/blocks/page-hero";
import { ImageText } from "@/components/blocks/image-text";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { Bento, HpHeader, HpFooter } from "@/components/homepage";
import { AppImage } from "@/lib/shared/app-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich, type RichText } from "@/lib/shared/rich-text";
import { buildAlternates } from "@/lib/shared/alternates";
import {
  CalendarCheck,
  Users,
  BadgeDollarSign,
  ShieldCheck,
  Smartphone,
  MapPin,
} from "lucide-react";

const PATH = "/sites-for/medicine/stomatolohiia";
const URL = pageUrl(PATH);

const TITLE = "Створення сайту для стоматології під ключ | Code-Site.Art";
const DESCRIPTION =
  "➤ Розробка сайту стоматології під ключ ✔️ Онлайн-запис 24/7 ✔️ Каталог лікарів і цін ✔️ Інтеграція з Dental4Windows ✔️ Запуск за 4 тижні ➡ Безкоштовний прорахунок.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ locale: "uk", uaPath: PATH }),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "uk_UA",
    url: PATH,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const STOM_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Скільки коштує сайт для стоматології?",
    a: [
      "Базовий сайт стоматології під ключ — ",
      { em: "від $3 500" },
      ": до 8 сторінок, онлайн-запис, каталог лікарів, прайс, запуск за 4 тижні. Клініка з кількома кріслами і ДМС-інтеграцією — від $6 500. Точну вилку під ваш кабінет дає ",
      { link: { href: "/calculator", text: "калькулятор вартості сайту" } },
      ".",
    ],
  },
  {
    q: "Як замовити сайт для стоматології і скільки це триває?",
    a: [
      "30-хвилинний бриф → фіксована ціна в договорі → дизайн → код → запуск. Стандартний термін — ",
      { em: "4 тижні" },
      " від брифу до робочого сайту з онлайн-записом. Тексти пишемо ми, ви лише вичитуєте медичну частину.",
    ],
  },
  {
    q: "Чи інтегруєте сайт з Dental4Windows або іншою CRM?",
    a: [
      "Так. Працювали з Dental4Windows, Medesk, Helsi, KeyCRM. Запис із сайту одразу падає в календар CRM, адміністратор бачить сповіщення в Telegram, пацієнт отримує SMS-підтвердження.",
    ],
  },
  {
    q: "Що зі створенням сайту для стоматолога-приватника, а не клініки?",
    a: [
      "Робимо компактніший формат: особиста сторінка лікаря з послугами, кейсами «до/після», відгуками і тим самим онлайн-записом — від $1 500. Це краще за профіль в агрегаторі: пацієнт записується до вас, а не до сусіда в списку.",
    ],
  },
  {
    q: "Чим ваш сайт кращий за шаблон на Tilda для стоматології?",
    a: [
      "Швидкість (0,9 с проти 4–6 с), онлайн-запис із перевіркою графіка лікаря замість форми «передзвонимо», локальне SEO під «стоматолог + район» і захист даних пацієнтів. Деталі — на сторінці ",
      { link: { href: "/sites-for/medicine", text: "створення медичних сайтів" } },
      ".",
    ],
  },
];

const jsonLd = buildJsonLd([
  webPageNode({ path: PATH, locale: "uk", title: TITLE, description: DESCRIPTION }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Створення медичних сайтів", path: "/sites-for/medicine" },
    { name: "Сайт для стоматології", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Створення сайтів для стоматологій",
    description: DESCRIPTION,
    provider: { "@id": ORG_ID },
    areaServed: ["UA"],
    offers: [
      {
        "@type": "Offer",
        name: "Сайт стоматології під ключ",
        price: "3500",
        priceCurrency: "USD",
        url: URL,
      },
    ],
  },
  {
    "@type": "FAQPage",
    mainEntity: STOM_FAQ.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
    })),
  },
]);

export default function StomatolohiiaPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Медичні сайти", href: "/sites-for/medicine" },
          { label: "Стоматологія" },
        ]}
        eyebrow="СТОМАТОЛОГІЯ"
        headline={
          <>
            Створення сайту для стоматології — <em>запис пацієнтів 24/7</em>
          </>
        }
        sub={
          <>
            Розробка сайту стоматології під ключ: онлайн-запис із перевіркою
            графіка лікаря, каталог послуг із чесними цінами, сторінки лікарів
            і роботи «до/після». Пацієнт записується вночі з телефону — а не
            чекає, поки адміністратор візьме слухавку. Це спеціалізація нашого
            напрямку{" "}
            <Link href="/sites-for/medicine" className="rich-link">
              створення медичних сайтів
            </Link>
            .
          </>
        }
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="ПРОБЛЕМА"
        heading={
          <>
            Чому стоматології <em>втрачають пацієнтів</em> на шаблонних сайтах
          </>
        }
        body="Пацієнт обирає стоматолога за 10 хвилин: відкриває 3–4 сайти з видачі та записується там, де швидко, зрозуміло і не страшно. Типовий шаблон програє в кожній точці:"
        bulletList={[
          "Немає онлайн-запису — тільки «залиште номер, ми передзвонимо». Половина пацієнтів шукає лікаря ввечері, коли ніхто не передзвонить",
          "Ціни приховані — «вартість уточнюйте». Пацієнт іде туди, де ціна на імплантацію написана прямо",
          "Немає сторінок лікарів — а в стоматології записуються до людини, не до вивіски",
          "Сайт вантажиться 4–6 секунд на мобільному — 53% відвідувачів закривають вкладку раніше",
          "Немає робіт «до/після» — головного доказу якості в естетичній стоматології",
        ]}
        image={
          <AppImage
            src="/hero/hero-mockup.webp"
            alt="Приклад сайту стоматології з онлайн-записом від Code-Site.Art"
            width={1600}
            height={1124}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="РІШЕННЯ"
        heading={
          <>
            Що входить у <em>розробку сайту стоматології</em>
          </>
        }
        body="Замовити сайт для стоматології у нас — означає отримати систему запису, а не візитку. У кожен проєкт входить:"
        bulletList={[
          "Онлайн-запис: послуга → лікар → вільний слот → SMS-підтвердження, 3 кроки без дзвінка",
          "Каталог послуг із цінами і зрозумілими описами — від гігієни до імплантації",
          "Сторінки лікарів: фото, спеціалізація, стаж, сертифікати, відгуки",
          "Галерея робіт «до/після» з обробкою фото під вимоги реклами медпослуг",
          "Локальне SEO: «стоматолог + район», Google Business Profile, картки послуг",
          "Захист персональних даних пацієнтів: HTTPS, шифрування, журнал доступів",
          "Інтеграція з CRM клініки: Dental4Windows, Medesk, Helsi, KeyCRM",
        ]}
        image={
          <AppImage
            src="/included.webp"
            alt="Каталог послуг стоматології на кастомному сайті"
            width={1600}
            height={1124}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <Bento
        eyebrow="ЦІНИ"
        heading={
          <>
            Скільки коштує <em>сайт для стоматології</em>
          </>
        }
        cells={[
          {
            icon: CalendarCheck,
            title: "Кабінет стоматолога",
            body: "Особиста сторінка лікаря: послуги, роботи «до/після», відгуки, онлайн-запис. Для приватної практики на 1–2 крісла.",
            stat: "від $1 500",
            span: "1x1",
          },
          {
            icon: Users,
            title: "Стоматологія під ключ",
            body: "До 8 сторінок, каталог послуг і цін, сторінки лікарів, онлайн-запис із CRM, локальне SEO. Запуск за 4 тижні.",
            stat: "від $3 500",
            span: "2x1",
          },
          {
            icon: BadgeDollarSign,
            title: "Клініка з ДМС",
            body: "Багатопрофільна стоматологія: страхові програми, кілька філій, блог, розширена аналітика.",
            stat: "від $6 500",
            span: "1x1",
          },
          {
            icon: ShieldCheck,
            title: "Рік підтримки",
            body: "Гарантія і техпідтримка перший рік — уже в ціні кожного пакета.",
            stat: "$0",
            span: "1x1",
          },
          {
            icon: Smartphone,
            title: "Mobile-first",
            body: "70%+ записів у стоматологію відбуваються з телефона — сайт проєктується від мобільного екрана.",
            stat: "0,9 с",
            span: "1x1",
          },
        ]}
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="ЛОКАЛЬНИЙ ПОШУК"
        heading={
          <>
            Пацієнти шукають <em>«стоматолог + район»</em>
          </>
        }
        body="Стоматологія — локальний бізнес: пацієнт не поїде через усе місто лікувати карієс. Тому сайт будується під локальну видачу Google:"
        bulletList={[
          "Окремі сторінки під ключові послуги: імплантація, брекети, вініри, дитяча стоматологія",
          "Schema.org розмітка Dentist + LocalBusiness — розширений сніпет із рейтингом у видачі",
          "Звʼязка з Google Business Profile і відгуками — карта показує вас у топ-3 по району",
          "Реальний приклад: сайт клініки Efedra в Одесі виріс із нуля до стабільного потоку записів з органіки — дивіться кейс у портфоліо",
        ]}
        cta={{ label: "Кейс клініки Efedra", href: "/portfolio/efedra-clinic" }}
        image={
          <AppImage
            src="/not-included.webp"
            alt="Локальна видача Google для запиту стоматолог"
            width={1600}
            height={1200}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <CtaBanner
        heading={
          <>
            Потрібен сайт для <em>медичного центру</em>, а не стоматології?
          </>
        }
        sub="Для багатопрофільних клінік і медичних центрів — окрема сторінка з відділеннями, лікарями і ДМС-інтеграціями."
        ctaPrimary={{
          label: "Розробка сайту для медичного центру",
          href: "/sites-for/medicine/medychnyi-tsentr",
        }}
        ctaSecondary={{ label: "Вартість розробки сайту", href: "/pricing" }}
      />

      <section className="bg-bg">
        <FAQ heading="Часті питання про сайти для стоматологій" items={STOM_FAQ} />
      </section>

      <LaunchCta
        locale="uk"
        heading={
          <>
            Замовити сайт <em>стоматології</em>?
          </>
        }
        sub="Безкоштовна 30-хв консультація: подивимось ваш поточний сайт і скажемо чесно, що радимо."
      />

      <HpFooter />
    </>
  );
}
