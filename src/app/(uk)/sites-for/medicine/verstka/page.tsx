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
import { Code2, Keyboard, Gauge, Printer, ShieldCheck, Braces } from "lucide-react";

/**
 * Верстка і фронтенд медичного сайту — третій і останній інтент, який
 * `/sites-for/medicine` збирала на себе, не маючи під нього сторінки.
 *
 * GSC за 3 місяці: 172 покази на трьох запитах — «програмування медичних
 * сайтів» 60 / поз. 36,7, «верстка медичних сайтів» 57 / 26,8, «front end
 * медичного сайту» 55 / 57,3.
 *
 * Межа з сусідніми сторінками проходить по шару роботи, а не по словах.
 * `dyzain` — візуальні рішення: довіра, кегль, контраст. Тут — технічний шар:
 * семантика, клавіатура й скрінрідери, чужий віджет запису, вага JS на старих
 * телефонах, стилі друку для пам'яток пацієнту. Нічого з цього на сусідніх
 * сторінках немає.
 */

const PATH = "/sites-for/medicine/verstka";
const URL = pageUrl(PATH);

const TITLE = "Верстка і фронтенд медичних сайтів | Code-Site.Art";
const DESCRIPTION =
  "➤ Верстка медичних сайтів: семантика, доступність із клавіатури, Lighthouse 90+ ✔️ Інтеграція чужого віджета запису ✔️ Стилі друку для пам'яток пацієнту ➡ Входить у вартість розробки.";

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

const VERSTKA_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Скільки коштує верстка медичного сайту окремо?",
    a: [
      "Окремо не продається — вона частина пакета, як і дизайн. Ми не беремо чужий макет у верстку і не віддаємо верстку без коду: адаптив під mobile, tablet і desktop, Lighthouse Performance 90+ і коректна семантика — базовий стандарт кожного проєкту, а не опція за доплату. Сайт клініки під ключ — ",
      { link: { href: "/sites-for/medicine", text: "від $2 500" } },
      ".",
    ],
  },
  {
    q: "Що робити, якщо віджет запису дає нам медична CRM?",
    a: [
      "Це найчастіша фронтенд-задача на медичних сайтах. Чужий віджет приходить скриптом або в iframe: тягне свої стилі, свій шрифт, часто ламається на вузькому екрані й не працює з клавіатури. Ми його не «вставляємо як є» — вантажимо відкладено, щоб він не гальмував перший екран, ізолюємо стилі, перевіряємо на реальних телефонах і додаємо запасний шлях: якщо віджет не піднявся, пацієнт бачить звичайну форму й телефон, а не порожній прямокутник.",
    ],
  },
  {
    q: "Навіщо медичному сайту доступність із клавіатури?",
    a: [
      "Бо частина пацієнтів фізично не користується мишею, а частина заходить зі скрінрідера. Технічно це означає: логічний порядок фокуса, видимий фокус (не `outline: none`), закриття модалок по Escape із поверненням фокуса, підписані поля форм, `aria` на елементах запису. Це робота верстальника, а не дизайнера — і саме її пропускають найчастіше.",
    ],
  },
  {
    q: "Чому швидкість на медичному сайті важливіша, ніж здається?",
    a: [
      "Аудиторія клініки старша за середню, а значить і телефони в неї старші. Сайт, який на новому флагмані відкривається миттєво, на п'ятирічному Android може вантажитись чотири секунди — і пацієнт піде до конкурента. Тому вага JS, шрифти й зображення тримаються в бюджеті з першого дня. Скільки саме коштує кожна секунда, ми порахували ",
      { link: { href: "/blog/shvydkist-medychnoho-saitu", text: "в окремому розборі" } },
      ".",
    ],
  },
  {
    q: "Ви робите верстку на нашому дизайні?",
    a: [
      "Як окрему послугу — ні, і це не зверхність. Чужий макет майже завжди доводиться доопрацьовувати під реальні стани: порожні списки, довгі прізвища лікарів, помилки форми, поведінку на 320 px. Рахувати це наперед неможливо, тож наскрізно виходить чесніше й дешевше. Якщо у вас є макет і своя команда розробки — напишіть, порахуємо окремо.",
    ],
  },
  {
    q: "Що з розміткою для пошуку?",
    a: [
      "Schema.org генерується з даних, а не проставляється руками: клініка, лікарі, послуги, ціни, FAQ. Це технічний шар, і він прямо впливає на вигляд сніпета у видачі. Як це працює разом із рештою пошукової роботи — ",
      { link: { href: "/sites-for/medicine/seo", text: "на сторінці просування медичних сайтів" } },
      ".",
    ],
  },
];

const jsonLd = buildJsonLd([
  webPageNode({ path: PATH, locale: "uk", title: TITLE, description: DESCRIPTION }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Створення сайту для клініки", path: "/sites-for/medicine" },
    { name: "Верстка і фронтенд", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Верстка і фронтенд медичних сайтів",
    description: DESCRIPTION,
    provider: { "@id": ORG_ID },
    areaServed: ["UA"],
    offers: [
      {
        "@type": "Offer",
        name: "Сайт клініки під ключ, верстка у вартості",
        price: "2500",
        priceCurrency: "USD",
        url: URL,
      },
    ],
  },
  {
    "@type": "FAQPage",
    mainEntity: VERSTKA_FAQ.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
    })),
  },
]);

export default function MedicineFrontendPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Сайти для клінік", href: "/sites-for/medicine" },
          { label: "Верстка і фронтенд" },
        ]}
        eyebrow="ВЕРСТКА МЕДИЧНИХ САЙТІВ"
        headline={
          <>
            Фронтенд медичного сайту — <em>шар, який видно лише коли він зламався</em>
          </>
        }
        sub={
          <>
            Дизайн вирішує, чи повірить пацієнт. Верстка вирішує, чи зможе він
            записатися: з клавіатури, зі старого телефона, коли чужий віджет
            запису не піднявся. Це технічний шар{" "}
            <Link href="/sites-for/medicine" className="rich-link">
              створення сайту для клініки
            </Link>
            , а не окрема послуга — і нижче про те, що в ньому специфічно
            медичного.
          </>
        }
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="ЧУЖИЙ ВІДЖЕТ"
        heading={
          <>
            Найчастіша поломка — <em>віджет запису з медичної CRM</em>
          </>
        }
        body="Клініка вже працює в своїй системі, і запис на сайт приходить звідти — скриптом або в iframe. Далі починається те, чого не видно на макеті:"
        bulletList={[
          "Віджет тягне власні стилі та шрифт і ламає типографіку сторінки",
          "Вантажиться синхронно й затримує перший екран на секунду-дві",
          "На 320 px вилазить за межі екрана — а це половина пацієнтів",
          "Не працює з клавіатури: фокус провалюється всередину iframe і не повертається",
          "Якщо сервіс лежить, пацієнт бачить порожній прямокутник замість запису",
        ]}
        image={
          <AppImage
            src="/hero/hero-mockup.webp"
            alt="Сайт клініки на ноутбуці та телефоні — проєкт Code-Site.Art"
            width={1600}
            height={1067}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <Bento
        eyebrow="ЩО ВХОДИТЬ"
        heading={
          <>
            Верстка медичних сайтів: <em>шість технічних вимог</em>
          </>
        }
        cells={[
          {
            icon: Code2,
            title: "Семантика",
            body: "Заголовки за ієрархією, списки списками, кнопка кнопкою. Це основа і для скрінрідера, і для пошуку.",
            span: "2x1",
          },
          {
            icon: Keyboard,
            title: "Клавіатура і фокус",
            body: "Логічний порядок табуляції, видимий фокус, Escape у модалках із поверненням фокуса на місце.",
            span: "1x1",
          },
          {
            icon: Gauge,
            title: "Бюджет швидкості",
            body: "Вага JS, шрифтів і зображень тримається під контролем із першого дня, а не «оптимізується потім».",
            span: "1x1",
          },
          {
            icon: ShieldCheck,
            title: "Форми без витоків",
            body: "Дані пацієнта не потрапляють у GET-параметри й не осідають в аналітиці. Помилки — біля поля, а не одним рядком угорі.",
            span: "1x1",
          },
          {
            icon: Printer,
            title: "Стилі друку",
            body: "Пам'ятку до процедури і напрямок пацієнти друкують. На звичайній верстці з принтера виходить каша.",
            span: "1x1",
          },
          {
            icon: Braces,
            title: "Schema.org із даних",
            body: "Клініка, лікарі, послуги, ціни й FAQ розмічаються автоматично, а не проставляються руками на кожній сторінці.",
            span: "2x1",
          },
        ]}
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="СТАРІ ТЕЛЕФОНИ"
        heading={
          <>
            Ваш пацієнт заходить <em>не з нового флагмана</em>
          </>
        }
        body="Аудиторія клініки старша за середню по інтернету, і техніка в неї відповідна. Що ми з цього робимо на практиці:"
        bulletList={[
          "Перевіряємо на реальних старих Android, а не тільки в емуляторі браузера",
          "Мінімум JS на першому екрані: запис має працювати навіть до повного завантаження",
          "Зображення в сучасних форматах і потрібного розміру, а не масштабовані вниз",
          "Шрифти без миготіння тексту при завантаженні",
          "Нічого критичного не ховаємо за hover — на телефоні його не існує",
          "Lighthouse 90+ на мобільному як умова здачі, а не як побажання",
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

      <CtaBanner
        heading={
          <>
            Перевіримо ваш сайт <em>на цих пунктах</em>
          </>
        }
        sub="Надішліть адресу — пройдемо запис із клавіатури, подивимось швидкість на мобільному й скажемо, що ламається. Один робочий день, безкоштовно."
        ctaPrimary={{ label: "Замовити перевірку", href: "/contacts" }}
        ctaSecondary={{ label: "Дизайн медичного сайту", href: "/sites-for/medicine/dyzain" }}
      />

      <section className="bg-bg px-5 py-16 md:px-12">
        <FAQ heading="Часті питання про верстку медичних сайтів" items={VERSTKA_FAQ} />
      </section>

      <LaunchCta
        heading="Програмування медичних сайтів під ключ"
        sub="Верстка і фронтенд входять у вартість розробки. Розкажіть, у якій системі клініка веде запис, — і ми скажемо, як її підключити без втрати швидкості."
      />

      <HpFooter />
    </>
  );
}
