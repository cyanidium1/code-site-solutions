import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/blocks/page-hero";
import { ImageText } from "@/components/blocks/image-text";
import { FAQ } from "@/components/blocks/final";
import { LeadFormSection } from "@/components/blocks/packages";
import { Bento, HpHeader, HpFooter } from "@/components/homepage";
import { AppImage } from "@/lib/shared/app-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { SERVICES, formatAddonPrice, formatDays, servicePrice } from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import {
  buildJsonLd,
  breadcrumbNode,
  faqNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import type { RichText } from "@/lib/shared/rich-text";
import { buildAlternates } from "@/lib/shared/alternates";
import {
  ArrowRightLeft,
  FileText,
  LayoutList,
  PenLine,
  Puzzle,
  ShieldCheck,
} from "lucide-react";

/*
 * TZ v2 §2.3 / §3.8 (2026-09-20): підтримка і гарантія не продаються окремо —
 * вони включені в ціну пакета на рік. Після року — продовження хостингу або
 * перенос на акаунт клієнта. Старі «від $200/міс», «$40/год» і «підтримка
 * 24/7 за договором» прибрані. Усі цифри — з constants/pricing.ts.
 */

const PATH = "/support";
const URL = pageUrl(PATH);

const MONTHS = SERVICES.includedSupportMonths;
const HOSTING = formatPrice(servicePrice("hostingRenewalPerYear", "uk"), { locale: "uk" });
const EXTRA_PAGE = formatAddonPrice("extra_page", "uk");

const TITLE = "Підтримка і гарантія сайту — рік у ціні | Code-Site.Art";
const DESCRIPTION = `Гарантія і підтримка сайту включені в ціну на рік: баги, аптайм, безпека, хостинг, SSL, бекапи. Далі — хостинг ${HOSTING}/рік або перенос на ваш акаунт.`;

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

/* ─── FAQ (worded as the real GSC queries) ───────────────────────────────── */

const SUPPORT_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Скільки коштує підтримка сайту?",
    a: [
      "Для сайтів нашої розробки — ",
      { em: `нічого протягом ${MONTHS} місяців` },
      `: гарантія, хостинг, SSL, бекапи й оновлення включені в ціну пакета. Після року — продовження хостингу за ${HOSTING}/рік або перенос сайту на ваш акаунт. Абонплати немає.`,
    ],
  },
  {
    q: "Скільки коштує адміністрування сайту?",
    a: [
      "Щоденне адміністрування — тексти, ціни, фото, послуги, кейси — ви робите самі в CMS, без розробника і без оплати. Нові сторінки, функції і зміни дизайну робимо за окремим рахунком: сторінка — ",
      { em: EXTRA_PAGE },
      ", функції — за ",
      { link: { href: "/pricing", text: "прайсом додатків" } },
      ", дизайн — за кошторисом до старту.",
    ],
  },
  {
    q: "Що саме покриває гарантія?",
    a: [
      "Помилки в роботі сайту (баги), аптайм, безпеку, оновлення залежностей, хостинг, SSL-сертифікат і резервні копії. Якщо щось зламалося з нашого боку — виправляємо безкоштовно.",
    ],
  },
  {
    q: "Що буде після першого року?",
    a: [
      `Два варіанти на ваш вибір: продовжити хостинг у нас за ${HOSTING}/рік — і сайт працює як працював, або перенести його на ваш акаунт хостингу. Код і домен у будь-якому разі ваші.`,
    ],
  },
  {
    q: "Чи берете ви на підтримку сайти, зроблені не вами?",
    a: [
      "Окремо підтримку не продаємо. Почніть з ",
      { link: { href: "/audit", text: "безкоштовного аудиту" } },
      ": за 24 години скажемо, що з сайтом не так і що вигідніше — виправити чи зробити новий, з роком гарантії в ціні.",
    ],
  },
  {
    q: "Чим підтримка відрізняється від SEO-просування?",
    a: [
      "Підтримка тримає сайт справним. Просування — робота над позиціями в Google: контент, посилання, техніка. Це окрема послуга: ",
      {
        link: {
          href: "/seo",
          text: `просування сайту — від ${formatPrice(servicePrice("seoServicesFrom", "uk"), { locale: "uk" })}/міс`,
        },
      },
      ".",
    ],
  },
];

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const jsonLd = buildJsonLd([
  webPageNode({ path: PATH, locale: "uk", title: TITLE, description: DESCRIPTION }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Підтримка і гарантія", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Підтримка і гарантія сайту",
    description: DESCRIPTION,
    provider: { "@id": ORG_ID },
    areaServed: ["UA"],
    offers: [
      {
        "@type": "Offer",
        name: `Гарантія і підтримка — ${MONTHS} місяців у ціні пакета`,
        price: "0",
        priceCurrency: "USD",
        url: URL,
      },
      {
        "@type": "Offer",
        name: "Продовження хостингу після першого року (рік)",
        price: String(servicePrice("hostingRenewalPerYear", "uk")),
        priceCurrency: "USD",
        url: URL,
      },
    ],
  },
  faqNode(SUPPORT_FAQ),
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
          { label: "Підтримка і гарантія" },
        ]}
        eyebrow="ПІДТРИМКА І ГАРАНТІЯ"
        headline={
          <>
            Підтримка і гарантія — <em>включені в ціну на рік</em>
          </>
        }
        sub={
          <>
            Кожен сайт нашої розробки отримує {MONTHS} місяців гарантії,
            хостингу і технічної підтримки без абонплати. Тексти, ціни і фото
            ви змінюєте самі в CMS. Після року — хостинг {HOSTING}/рік або
            перенос на ваш акаунт. Ціни пакетів —{" "}
            <Link href="/pricing" className="rich-link">
              на сторінці цін
            </Link>
            .
          </>
        }
        actions={{
          primary: { label: "Отримати прорахунок", href: "#lead-form" },
          secondary: { label: "Ціни на сайти", href: "/pricing" },
        }}
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="ГАРАНТІЯ"
        heading={
          <>
            Що покриває <em>гарантія</em>
          </>
        }
        body={`Перші ${MONTHS} місяців після запуску ми відповідаємо за технічний стан сайту. Безкоштовно:`}
        bulletList={[
          "Баги — усе, що працює не так, як узгоджено, виправляємо",
          "Аптайм — стежимо, щоб сайт був доступний, і піднімаємо його, якщо впав",
          "Безпека — закриваємо вразливості, щойно про них стає відомо",
          "Оновлення залежностей — фреймворк і бібліотеки не старіють",
          "Хостинг — сайт працює на нашому сервері, рахунків за хостинг немає",
          "SSL-сертифікат — https підключений і продовжується автоматично",
          "Резервні копії — регулярні, з перевіркою, що з них можна відновитись",
        ]}
        image={
          <AppImage
            src="/included.webp"
            alt="Сайт на гарантійній підтримці Code-Site.Art"
            width={1600}
            height={1124}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <Bento
        eyebrow="ХТО І ЩО РОБИТЬ"
        heading={
          <>
            Що входить, що ви робите самі, <em>а що — за окремим рахунком</em>
          </>
        }
        cells={[
          {
            icon: ShieldCheck,
            title: "Гарантія і хостинг",
            body: "Баги, аптайм, безпека, оновлення, хостинг, SSL, бекапи — перший рік у ціні пакета.",
            stat: "$0",
            span: "1x1",
          },
          {
            icon: PenLine,
            title: "Самі в CMS",
            body: "Тексти, ціни, фото, послуги, кейси — змінюєте в адмінці без розробника. Покажемо, як, під час здачі.",
            stat: "$0",
            span: "1x1",
          },
          {
            icon: LayoutList,
            title: "Нова сторінка",
            body: `Нова послуга, місто чи розділ — за прайсом, строк ${formatDays(SERVICES.newPageDays, "uk")}.`,
            stat: EXTRA_PAGE,
            span: "1x1",
          },
          {
            icon: Puzzle,
            title: "Нові функції",
            body: "Блог, мова, CRM, онлайн-запис, оплата — за прайсом додатків, ціну знаєте до старту.",
            stat: "за прайсом",
            span: "1x1",
          },
          {
            icon: FileText,
            title: "Зміни дизайну",
            body: "Новий блок, перероблений розділ чи редизайн — оцінюємо обсяг і даємо кошторис до початку робіт.",
            stat: "кошторис",
            span: "1x1",
          },
          {
            icon: ArrowRightLeft,
            title: "Після року",
            body: "Продовжуєте хостинг у нас — або переносимо сайт на ваш акаунт. Код і домен ваші в обох випадках.",
            stat: `${HOSTING}/рік`,
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
        body="Без тікет-систем і бюрократії — ви пишете, ми робимо і показуємо результат:"
        bulletList={[
          "Канал у Telegram: проблему описуєте повідомленням",
          "Збій (сайт недоступний, форма не працює) — реагуємо до 4 годин у робочий день",
          "Гарантійне виправлення — безкоштовно; нове — з ціною до старту",
          "Жодних «мінімальних термінів» і абонплати",
        ]}
        image={
          <AppImage
            src="/payment.webp"
            alt="Звіт про підтримку сайту від Code-Site.Art"
            width={1600}
            height={1200}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <LeadFormSection
        locale="uk"
        source="support"
        title="Сайт з роком гарантії в ціні"
        sub="Опишіть, що потрібно, — за 24 години надішлемо прорахунок із фіксованою ціною і строком."
      />

      <section className="bg-bg">
        <FAQ heading="Часті питання про підтримку і гарантію" items={SUPPORT_FAQ} />
      </section>

      <HpFooter />
    </>
  );
}
