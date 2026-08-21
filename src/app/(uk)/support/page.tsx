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
import { Wrench, ShieldCheck, Gauge, FileText, ArrowRightLeft, Search } from "lucide-react";

const PATH = "/support";
const URL = pageUrl(PATH);

const TITLE = "Обслуговування сайту: вартість від $200/міс | Code-Site.Art";
const DESCRIPTION =
  "➤ Обслуговування сайтів — вартість від $200/міс або $40/год ✔️ Оновлення, бекапи, моніторинг, правки ✔️ Перший рік підтримки — у ціні розробки ➡ Чесний прайс.";

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
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/* ─── FAQ (worded as the real GSC queries) ───────────────────────────────── */

const SUPPORT_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Скільки коштує обслуговування сайту?",
    a: [
      "Щомісячний пакет — ",
      { em: "$200–500/міс" },
      " залежно від обсягу: моніторинг, оновлення, дрібні правки, консультації. Разові задачі — $40/год. Для сайтів, які розробили ми, перший рік підтримки вже входить у ",
      { link: { href: "/pricing", text: "вартість розробки сайту" } },
      " — платити окремо не треба.",
    ],
  },
  {
    q: "Що входить у вартість обслуговування сайту?",
    a: [
      "Технічний моніторинг (аптайм, швидкість, помилки), оновлення залежностей і безпеки, регулярні бекапи, дрібні правки контенту і верстки (до 4 годин на місяць у базовому пакеті), звіт наприкінці місяця. Роботи понад пакет — за ставкою $40/год, узгоджуємо заздалегідь.",
    ],
  },
  {
    q: "Від чого залежить ціна підтримки сайту?",
    a: [
      "Від трьох речей: розміру сайту (лендінг чи платформа з CMS та інтеграціями), частоти змін (раз на місяць чи щотижня) і критичності (інтернет-магазину потрібен моніторинг 24/7, сайту-візитці — ні). Тому вилка $200–500/міс, а не одна цифра.",
    ],
  },
  {
    q: "Чи берете ви на обслуговування сайти, зроблені не вами?",
    a: [
      "Так, після технічного аудиту ($300): дивимось код, хостинг, залежності і чесно кажемо, що можна підтримувати, а що дешевше переписати. Сайти на конструкторах (Tilda, Wix) не обслуговуємо — там немає доступу до коду.",
    ],
  },
  {
    q: "Чим обслуговування відрізняється від SEO-просування?",
    a: [
      "Обслуговування тримає сайт справним і актуальним. Просування — це робота над позиціями в Google: контент, посилання, техніка. Це окрема послуга з окремим бюджетом: ",
      { link: { href: "/seo", text: "просування сайту — ціна від $300/міс" } },
      ".",
    ],
  },
];

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const jsonLd = buildJsonLd([
  webPageNode({ path: PATH, locale: "uk", title: TITLE, description: DESCRIPTION }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Обслуговування сайтів", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Обслуговування і підтримка сайтів",
    description: DESCRIPTION,
    provider: { "@id": ORG_ID },
    areaServed: ["UA", "EU", "US", "DK"],
    offers: [
      {
        "@type": "Offer",
        name: "Щомісячне обслуговування сайту",
        price: "200",
        priceCurrency: "USD",
        url: URL,
      },
      {
        "@type": "Offer",
        name: "Погодинні роботи",
        price: "40",
        priceCurrency: "USD",
        url: URL,
      },
    ],
  },
  {
    "@type": "FAQPage",
    mainEntity: SUPPORT_FAQ.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
    })),
  },
]);

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function SupportPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Обслуговування" },
        ]}
        eyebrow="ПІДТРИМКА"
        headline={
          <>
            Обслуговування сайтів — <em>вартість і що входить</em>
          </>
        }
        sub={
          <>
            Сайт без підтримки старіє: залежності ловлять вразливості, форми
            тихо ламаються, швидкість повзе вниз — і Google це бачить. Ми
            тримаємо сайти справними за фіксовану ціну: від $200/міс за
            пакет або $40/год разово. Для сайтів нашої розробки перший рік
            уже входить у{" "}
            <Link href="/pricing" className="rich-link">
              ціну створення сайту
            </Link>
            .
          </>
        }
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="ЩОМІСЯЦЯ"
        heading={
          <>
            Що входить у <em>вартість обслуговування сайту</em>
          </>
        }
        body="Не абстрактна «підтримка» одним рядком у рахунку, а конкретний список робіт, який ви бачите у щомісячному звіті:"
        bulletList={[
          "Моніторинг аптайму і швидкості — дізнаємось про падіння раніше за ваших клієнтів",
          "Оновлення залежностей і патчі безпеки — сайт не стає легкою мішенню",
          "Регулярні бекапи з перевіркою відновлення — не «є бекап», а «відновлюється за годину»",
          "Дрібні правки контенту і верстки — до 4 годин на місяць у базовому пакеті",
          "Контроль форм і інтеграцій — заявки доходять у CRM і Telegram, а не губляться",
          "Звіт наприкінці місяця: що зроблено, що помічено, що радимо далі",
        ]}
        image={
          <AppImage
            src="/included.webp"
            alt="Приклад сайту на підтримці Code-Site.Art"
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
            Обслуговування сайту: <em>вартість за форматами</em>
          </>
        }
        cells={[
          {
            icon: Wrench,
            title: "Базовий пакет",
            body: "Моніторинг, оновлення, бекапи, до 4 годин правок. Для лендінгів і корпоративних сайтів.",
            stat: "$200/міс",
            span: "1x1",
          },
          {
            icon: Gauge,
            title: "Розширений пакет",
            body: "Все з базового + до 12 годин робіт, пріоритетна черга, моніторинг 24/7. Для магазинів і платформ.",
            stat: "$500/міс",
            span: "1x1",
          },
          {
            icon: FileText,
            title: "Погодинні роботи",
            body: "Разові задачі без пакета: нові блоки, правки, інтеграції. Оцінка обсягу — до старту.",
            stat: "$40/год",
            span: "1x1",
          },
          {
            icon: ShieldCheck,
            title: "Перший рік — у ціні",
            body: "Кожен сайт нашої розробки отримує рік гарантійної підтримки безкоштовно — це вже в пакеті.",
            stat: "$0",
            span: "1x1",
          },
          {
            icon: Search,
            title: "Технічний аудит",
            body: "Для сайтів чужої розробки: розбір коду, хостингу і залежностей перед взяттям на підтримку.",
            stat: "$300",
            span: "1x1",
          },
          {
            icon: ArrowRightLeft,
            title: "Міграція з WordPress",
            body: "Якщо підтримувати старий сайт дорожче, ніж переїхати: перенос без втрати SEO-історії.",
            stat: "$500–2 000",
            span: "1x1",
          },
        ]}
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="ЯК ПРАЦЮЄ"
        heading={
          <>
            Як влаштована <em>підтримка</em>
          </>
        }
        body="Проста схема без бюрократії — ви пишете задачу, ми робимо і показуємо результат:"
        bulletList={[
          "Канал у Telegram: задачі ставите повідомленням, без тікет-систем",
          "Термінові інциденти (сайт лежить, форма не працює) — реакція до 4 годин у робочий день",
          "Планові роботи — беремо в тижневий спринт і показуємо до/після",
          "Все понад пакет узгоджуємо до старту: жодних несподіваних рахунків",
          "Скасувати пакет можна будь-коли — без штрафів і «мінімальних термінів»",
        ]}
        image={
          <AppImage
            src="/payment.webp"
            alt="Звіт про обслуговування сайту від Code-Site.Art"
            width={1600}
            height={1200}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <section className="bg-bg px-6 sm:px-8 lg:px-12 py-14">
        <div className="max-w-container mx-auto">
          <h2 className="m-0 font-actay uppercase font-bold text-[clamp(22px,2.6vw,34px)] leading-[1.15] text-ink">
            Чому сайт без обслуговування дорожчає
          </h2>
          <div className="mt-6 max-w-[760px] font-sans text-[15.5px] leading-[1.7] text-ink-dim space-y-4">
            <p className="m-0">
              Сайт — не банер, який один раз надрукували. Під ним живе
              екосистема, яка рухається щомісяця: виходять оновлення фреймворка
              і бібліотек, у старих версіях знаходять вразливості, платіжні та
              CRM-інтеграції змінюють свої API, а Google підвищує вимоги до
              швидкості. Сайт, який ніхто не супроводжує, не «стоїть на місці» —
              він відстає. Спочатку непомітно: на пів секунди повільніше
              завантаження, форма, яка через раз не доставляє заявку. Потім
              помітно: позиції у видачі просідають, а оцінка безпеки стає
              аргументом для страхової чи корпоративного клієнта не працювати з
              вами.
            </p>
            <p className="m-0">
              Економіка тут проста. Година профілактики коштує $40. Відновлення
              зламаного сайту з бекапа, якого ніхто не перевіряв, — днями
              простою і втраченими заявками. Ремонт інтеграції, яка тихо
              померла пів року тому, — розслідуванням, чому CRM пів року не
              бачила лідів. Тому ми продаємо обслуговування не як «страховку про
              всяк випадок», а як план робіт: що саме, коли і навіщо робиться —
              і що ви побачите у звіті наприкінці місяця.
            </p>
            <p className="m-0">
              Якщо ваш сайт робили ми — перший рік усе це вже включено в
              ціну розробки, і ви знаєте, як виглядає наш звіт. Якщо сайт
              робив хтось інший — почнемо з технічного аудиту за $300:
              подивимось код, хостинг і залежності та чесно скажемо, що
              вигідніше — підтримувати як є чи мігрувати.
            </p>
          </div>
        </div>
      </section>

      <CtaBanner
        heading={
          <>
            Не впевнені, скільки коштуватиме <em>ваш випадок</em>?
          </>
        }
        sub="Порахуйте вартість нового сайту в калькуляторі або напишіть нам — скажемо чесно, чи потрібен вам пакет, чи вистачить разових робіт."
        ctaPrimary={{ label: "Калькулятор вартості сайту", href: "/calculator" }}
        ctaSecondary={{ label: "Написати нам", href: "/contacts" }}
      />

      <section className="bg-bg">
        <FAQ heading="Часті питання про обслуговування" items={SUPPORT_FAQ} />
      </section>

      <LaunchCta
        locale="uk"
        heading={
          <>
            Передати сайт <em>на підтримку</em>?
          </>
        }
        sub="Безкоштовна 30-хв консультація. Розкажемо, що радимо саме вашому сайту."
      />

      <HpFooter />
    </>
  );
}
