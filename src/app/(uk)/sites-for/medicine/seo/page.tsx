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
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, webPageNode } from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich, type RichText } from "@/lib/shared/rich-text";
import { buildAlternates } from "@/lib/shared/alternates";
import { MapPin, ShieldCheck, LayoutList, Star, Gauge, BarChart3 } from "lucide-react";

/**
 * Просування медичних сайтів — окремий комерційний інтент.
 *
 * GSC за 3 місяці по `/sites-for/medicine`: 174 покази за пошуковими
 * формулюваннями («seo для медклінік» 60 / поз. 48,7, «seo медичних сайтів»
 * 46 / 37,8, «послуги seo для медичних сайтів» 40 / 31,5, «просування сайтів
 * медичних клінік» 28 / 50,1), і жодної сторінки під них.
 *
 * Інтенти розведені: `/seo` — послуга загалом, `/blog/seo-dlia-medychnykh-saitiv`
 * — як робити самому, ця сторінка — замовити просування клініки. Матеріал теж
 * різний: тут локальний пошук, YMYL і обмеження реклами меддіяльності, чого
 * на загальній сторінці SEO немає.
 */

const PATH = "/sites-for/medicine/seo";
const URL = pageUrl(PATH);

const TITLE = "SEO для медичних сайтів: просування клінік | Code-Site.Art";
const DESCRIPTION =
  "➤ Просування медичних сайтів — від $300/міс ✔️ Локальний пошук і Google Maps ✔️ Сторінки під «лікар + район» ✔️ E-E-A-T для YMYL ➡ Разовий аудит $300.";

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
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

const MED_SEO_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Скільки коштує просування медичного сайту?",
    a: [
      "Сайт клініки — ",
      { em: "від $300/міс" },
      ": техніка, контент, локальний пошук, посилання, звіт щомісяця. Разовий аудит зі списком правок — $300. Загальні умови й що входить у пакет — ",
      { link: { href: "/seo", text: "на сторінці просування" } },
      ".",
    ],
  },
  {
    q: "Чим SEO для медичних сайтів відрізняється від звичайного?",
    a: [
      "Двома речами. Перша — половина результату лежить не на сайті, а в локальному пошуку: картка в Google, відгуки, «стоматолог + район». Друга — медицина належить до YMYL-тематик, де Google жорсткіше дивиться на авторство: сторінка про лікування має бути підписана лікарем із вказаною спеціальністю й досвідом, інакше вона програє навіть при кращій техніці.",
    ],
  },
  {
    q: "Чи можна гарантувати топ-1 по «стоматологія Київ»?",
    a: [
      "Ні, і той, хто гарантує, або продає повітря, або сірі методи, за які сайт потім ловить фільтр. Ми гарантуємо обсяг робіт і показуємо динаміку позицій, трафіку й записів щомісяця. У медицині до цього додається окрема причина обережності: рекламувати медичну діяльність в Україні можна не всім і не в будь-яких формулюваннях.",
    ],
  },
  {
    q: "За скільки з'являться перші результати?",
    a: [
      "Локальний пошук — найшвидша частина: картка в Google може дати перші дзвінки за кілька тижнів. Органіка сайту — 3–6 місяців: спершу ростуть покази, потім позиції, потім записи. Клініка в конкурентному місті йде довше за приватний кабінет у районі.",
    ],
  },
  {
    q: "Що робити, якщо сайт зроблений не вами?",
    a: [
      "Починаємо з ",
      { link: { href: "/audit", text: "аудиту за $300" } },
      ": дивимось техніку, структуру й контент і чесно кажемо, чи є куди рости. Якщо сайт на конструкторі — покажемо стелю платформи до того, як ви заплатите за кампанію, половину рекомендацій якої неможливо впровадити.",
    ],
  },
  {
    q: "Скільки сторінок треба клініці для пошуку?",
    a: [
      "Одна сторінка «Послуги» не працює. Кожна процедура, яку шукають окремо, потребує власної сторінки: імплантація, вініри, чистка — це різні запити з різними цінами й різними сумнівами пацієнта. Як це влаштувати без перетворення на дорвеї, розібрано ",
      { link: { href: "/blog/seo-dlia-medychnykh-saitiv", text: "у матеріалі про SEO для медичних сайтів" } },
      ".",
    ],
  },
];

const jsonLd = buildJsonLd([
  webPageNode({ path: PATH, locale: "uk", title: TITLE, description: DESCRIPTION }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Створення сайту для клініки", path: "/sites-for/medicine" },
    { name: "Просування медичних сайтів", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "SEO-просування медичних сайтів і клінік",
    description: DESCRIPTION,
    provider: { "@id": ORG_ID },
    areaServed: ["UA"],
    offers: [
      {
        "@type": "Offer",
        name: "Просування сайту клініки (за місяць)",
        price: "300",
        priceCurrency: "USD",
        url: URL,
      },
      {
        "@type": "Offer",
        name: "Разовий аудит медичного сайту",
        price: "300",
        priceCurrency: "USD",
        url: URL,
      },
    ],
  },
  {
    "@type": "FAQPage",
    mainEntity: MED_SEO_FAQ.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
    })),
  },
]);

export default function MedicineSeoPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Сайти для клінік", href: "/sites-for/medicine" },
          { label: "Просування" },
        ]}
        eyebrow="SEO ДЛЯ МЕДИЧНИХ САЙТІВ"
        headline={
          <>
            Просування медичних сайтів — <em>від $300/міс</em>
          </>
        }
        sub={
          <>
            Пацієнт шукає не «клініку взагалі», а «стоматолога на Оболоні» — і
            половина результату тут лежить у локальному пошуку, а не в тексті
            на сайті. Ведемо обидві частини: картку в Google і сторінки під
            конкретні процедури. Якщо сайту ще немає, почніть із{" "}
            <Link href="/sites-for/medicine" className="rich-link">
              створення сайту для клініки
            </Link>
            .
          </>
        }
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="ЧОМУ ІНАКШЕ"
        heading={
          <>
            Медицина — <em>YMYL-тематика</em>, і Google це знає
          </>
        }
        body="YMYL означає «your money or your life»: теми, де погана порада коштує здоров'я або грошей. Google перевіряє такі сайти суворіше, і звичайні SEO-прийоми там працюють гірше:"
        bulletList={[
          "Стаття про лікування без підпису лікаря програє підписаній навіть при кращій техніці",
          "У профілі автора мають бути спеціальність, освіта й досвід — не просто ім'я",
          "Клініка без ліцензійних даних на сайті виглядає слабше за конкурента з ними",
          "Обіцянки «гарантованого результату лікування» — ризик не лише для позицій, а й за законом про рекламу",
          "Відгуки пацієнтів потрібні, але зі згодою і без розкриття діагнозу",
        ]}
        image={
          <AppImage
            src="/included.webp"
            alt="Сайт клініки на ноутбуці — приклад проєкту Code-Site.Art"
            width={1600}
            height={1124}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <Bento
        eyebrow="ЩО РОБИМО"
        heading={
          <>
            Просування сайтів медичних клінік: <em>шість напрямків</em>
          </>
        }
        cells={[
          {
            icon: MapPin,
            title: "Локальний пошук",
            body: "Картка в Google, категорії, фото, години, відгуки. Для клініки це часто швидший канал, ніж сам сайт.",
            span: "2x1",
          },
          {
            icon: LayoutList,
            title: "Сторінка на процедуру",
            body: "Імплантація, вініри, чистка — різні запити, різні ціни, різні сумніви. Одна сторінка «Послуги» їх не закриє.",
            span: "1x1",
          },
          {
            icon: ShieldCheck,
            title: "E-E-A-T",
            body: "Підписи лікарів, спеціальність і досвід, ліцензії. У YMYL це не формальність, а фактор ранжування.",
            span: "1x1",
          },
          {
            icon: Star,
            title: "Відгуки",
            body: "Збір і робота з відгуками в Google — і на картці, і на сайті, зі згодою пацієнта.",
            span: "1x1",
          },
          {
            icon: Gauge,
            title: "Швидкість",
            body: "Пацієнт іде з повільного сайту раніше, ніж дочитає. Тримаємо Core Web Vitals у зеленій зоні.",
            span: "1x1",
          },
          {
            icon: BarChart3,
            title: "Звіт щомісяця",
            body: "Позиції, трафік і записи — не «виконано 40 робіт», а цифри, які можна перевірити.",
            span: "2x1",
          },
        ]}
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="ЧОГО НЕ ОБІЦЯЄМО"
        heading={
          <>
            У медицині обережність <em>коштує дешевше</em> за наслідки
          </>
        }
        body="Це той випадок, коли частина типових SEO-обіцянок або не працює, або створює ризик поза пошуком:"
        bulletList={[
          "Не гарантуємо топ-1: Google не продає позиції, а в медицині ще й перевіряє суворіше",
          "Не пишемо тексти з обіцянкою результату лікування — це питання не лише позицій",
          "Не робимо десятки однакових сторінок під райони: це дорвеї, і в YMYL за них прилітає швидше",
          "Не публікуємо відгуки без згоди пацієнта і з деталями діагнозу",
          "Не беремо сайт на конструкторі без розмови про стелю платформи",
        ]}
        image={
          <AppImage
            src="/not-included.webp"
            alt="Приклад матеріалів проєкту від Code-Site.Art"
            width={1600}
            height={1200}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <CtaBanner
        heading={
          <>
            Почніть із <em>аудиту за $300</em>
          </>
        }
        sub="Розберемо сайт клініки й картку в Google, покажемо, за якими запитами вас зараз не видно і що з цього дожимається найшвидше. Термін — 5 робочих днів."
        ctaPrimary={{ label: "Замовити аудит", href: "/contacts" }}
        ctaSecondary={{ label: "Умови просування", href: "/seo" }}
      />

      <section className="bg-bg px-5 py-16 md:px-12">
        <FAQ heading="Часті питання про просування медичних сайтів" items={MED_SEO_FAQ} />
      </section>

      <LaunchCta
        heading="Замовити послуги SEO для медичних сайтів"
        sub="Розкажіть про клініку і місто — подивимось, який у ніші реальний попит і з чого варто починати саме вам."
      />

      <HpFooter />
    </>
  );
}
