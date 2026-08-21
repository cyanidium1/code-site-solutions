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
  Building2,
  Stethoscope,
  CalendarCheck,
  ShieldCheck,
  Network,
  FileText,
} from "lucide-react";

const PATH = "/sites-for/medicine/medychnyi-tsentr";
const URL = pageUrl(PATH);

const TITLE = "Розробка сайту для медичного центру під ключ | Code-Site.Art";
const DESCRIPTION =
  "➤ Замовити створення сайту для медичного центру ✔️ Відділення і каталог лікарів ✔️ Онлайн-запис ✔️ Запуск за 4–6 тижнів ➡ Безкоштовний прорахунок.";

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

const MED_CENTER_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Скільки коштує розробка сайту для медичного центру?",
    a: [
      "Сайт під ключ для медичного центру — ",
      { em: "від $3 500" },
      ": відділення, каталог лікарів, онлайн-запис, прайс. Центр із ДМС-інтеграцією, блогом і медичною CRM — від $6 500, мережа закладів — від $12 000. Швидка вилка — у ",
      { link: { href: "/calculator", text: "калькуляторі вартості сайту" } },
      ", повний прайс — на сторінці ",
      { link: { href: "/pricing", text: "ціни створення сайту" } },
      ".",
    ],
  },
  {
    q: "Як замовити створення сайту для медичного центру?",
    a: [
      "30-хвилинний бриф → фіксована ціна в договорі → структура і дизайн → код і інтеграції → запуск. Ваша участь — до 5 годин на весь проєкт: тексти пишемо ми, медичну редактуру робить ваш лікар.",
    ],
  },
  {
    q: "Чим сайт медичного закладу відрізняється від сайту звичайної компанії?",
    a: [
      "Трьома речами: юридичні вимоги (закон про рекламу медпослуг, обробка персональних даних пацієнтів), структура під відділення і лікарів замість «послуги/про нас», і запис як головна дія — кожна сторінка веде до кнопки запису, а не до телефона.",
    ],
  },
  {
    q: "Яка веб-студія підійде для медичних центрів — загальна чи профільна?",
    a: [
      "Студія, яка вже робила медицину: не доведеться пояснювати, чому не можна «до/після» в рекламі, що таке НСЗУ і чому дані пацієнтів не можна зберігати абиде. Ми ведемо окремий напрям ",
      { link: { href: "/sites-for/medicine", text: "створення медичних сайтів" } },
      " — з готовими рішеннями для запису, CRM і захисту даних.",
    ],
  },
  {
    q: "Чи можна інтегрувати сайт із Helsi, Medesk або нашою CRM?",
    a: [
      "Так: Helsi (НСЗУ), Medesk, MedAI, KeyCRM, AmoCRM, Bitrix24 — або ваша система через API. Запис із сайту падає в CRM миттєво, лікар і адміністратор отримують сповіщення, пацієнт — SMS-підтвердження і нагадування.",
    ],
  },
];

const jsonLd = buildJsonLd([
  webPageNode({ path: PATH, locale: "uk", title: TITLE, description: DESCRIPTION }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Створення медичних сайтів", path: "/sites-for/medicine" },
    { name: "Сайт для медичного центру", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Розробка сайтів для медичних центрів",
    description: DESCRIPTION,
    provider: { "@id": ORG_ID },
    areaServed: ["UA"],
    offers: [
      {
        "@type": "Offer",
        name: "Сайт медичного центру під ключ",
        price: "3500",
        priceCurrency: "USD",
        url: URL,
      },
    ],
  },
  {
    "@type": "FAQPage",
    mainEntity: MED_CENTER_FAQ.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
    })),
  },
]);

export default function MedychnyiTsentrPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Медичні сайти", href: "/sites-for/medicine" },
          { label: "Медичний центр" },
        ]}
        eyebrow="МЕДИЧНИЙ ЦЕНТР"
        headline={
          <>
            Розробка сайту для медичного центру —{" "}
            <em>відділення, лікарі, запис</em>
          </>
        }
        sub={
          <>
            Сайт під ключ для медичного центру чи медичного закладу: структура
            від відділень до конкретного лікаря, онлайн-запис із перевіркою
            графіка, ДМС-програми і захист даних пацієнтів. Замовити створення
            сайту для медичного центру можна після 30-хвилинного брифу — ціна
            фіксується в договорі до старту. Це частина нашого напряму{" "}
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
        eyebrow="СТРУКТУРА"
        heading={
          <>
            Що входить у <em>сайт медичного закладу</em>
          </>
        }
        body="Медичний центр — це не «послуги + контакти». Це система з десятків лікарів, відділень і програм, у якій пацієнт має знайти своє за два кліки:"
        bulletList={[
          "Відділення: терапія, діагностика, педіатрія, хірургія — кожне зі своєю сторінкою і лікарями",
          "Каталог лікарів із фільтрами за спеціальністю: фото, стаж, сертифікати, графік, кнопка запису",
          "Онлайн-запис: відділення → лікар → вільний слот → SMS-підтвердження",
          "Прайс із пошуком по послугах — прозорі ціни без «уточнюйте у адміністратора»",
          "ДМС і страхові програми: перелік компаній-партнерів і що покривається",
          "Сторінки аналізів і чекапів із підготовкою до процедур",
          "Захист даних: шифрування, журнал доступів, сервери в ЄС, DPA в договорі",
        ]}
        image={
          <AppImage
            src="/hero/hero-mockup.webp"
            alt="Структура сайту медичного центру: відділення і лікарі"
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
            Сайт під ключ для медичного центру: <em>вартість</em>
          </>
        }
        cells={[
          {
            icon: Building2,
            title: "Медичний центр",
            body: "До 8 сторінок: відділення, лікарі, прайс, онлайн-запис, локальне SEO. Запуск за 4 тижні.",
            stat: "від $3 500",
            span: "2x1",
          },
          {
            icon: Network,
            title: "Центр із ДМС і CRM",
            body: "Розширена структура, страхові програми, медична CRM, блог, аналітика записів.",
            stat: "від $6 500",
            span: "1x1",
          },
          {
            icon: Stethoscope,
            title: "Мережа закладів",
            body: "Кілька філій із спільним каталогом лікарів, єдиним записом і сторінками кожної локації.",
            stat: "від $12 000",
            span: "1x1",
          },
          {
            icon: CalendarCheck,
            title: "Онлайн-запис",
            body: "Віджет запису з перевіркою графіка входить у кожен пакет — не окрема опція.",
            stat: "у ціні",
            span: "1x1",
          },
          {
            icon: ShieldCheck,
            title: "Рік підтримки",
            body: "Гарантія, оновлення і техпідтримка перший рік — уже в ціні розробки.",
            stat: "$0",
            span: "1x1",
          },
          {
            icon: FileText,
            title: "Контент",
            body: "Тексти відділень і послуг пишемо ми — з редактурою вашими лікарями. Медичний копірайтер у команді.",
            stat: "у ціні",
            span: "1x1",
          },
        ]}
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="ЧОМУ МИ"
        heading={
          <>
            Веб-студія <em>для медичних центрів</em>, не «для всіх»
          </>
        }
        body="Медицину не можна робити за шаблоном інтернет-магазину. Ось що ми вже знаємо про ваш проєкт до першого дзвінка:"
        bulletList={[
          "Закон про рекламу медпослуг: що можна показувати, а що — ні (і чому «до/після» — обережно)",
          "Персональні дані пацієнтів — окремий контур захисту, не «форма як у всіх»",
          "Запис — головна конверсія: кожна сторінка веде до запису за 1 клік",
          "Пацієнти читають про лікаря перед записом — сторінки лікарів важливіші за «про компанію»",
          "Кейс у ніші: сайт клініки Efedra в Одесі — стабільний потік записів з органічного пошуку",
        ]}
        cta={{ label: "Кейс клініки Efedra", href: "/portfolio/efedra-clinic" }}
        image={
          <AppImage
            src="/included.webp"
            alt="Сайт медичного центру на ноутбуці — проєкт Code-Site.Art"
            width={1600}
            height={1124}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <CtaBanner
        heading={
          <>
            У вас <em>стоматологія</em>, а не багатопрофільний центр?
          </>
        }
        sub="Для стоматологій — окрема сторінка: роботи «до/після», інтеграція з Dental4Windows і запис до конкретного лікаря."
        ctaPrimary={{
          label: "Створення сайту для стоматології",
          href: "/sites-for/medicine/stomatolohiia",
        }}
        ctaSecondary={{ label: "Вартість розробки сайту", href: "/pricing" }}
      />

      <section className="bg-bg">
        <FAQ
          heading="Часті питання про сайти медичних центрів"
          items={MED_CENTER_FAQ}
        />
      </section>

      <LaunchCta
        locale="uk"
        heading={
          <>
            Обговорити сайт <em>вашого центру</em>?
          </>
        }
        sub="Безкоштовна 30-хв консультація. Розберемо структуру і скажемо чесну вилку ціни."
      />

      <HpFooter />
    </>
  );
}
