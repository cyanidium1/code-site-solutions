import type { Locale } from "@/constants/locales";
import type * as React from "react";
import { AppImage } from "@/lib/shared/app-image";
import {
  TrendingUp,
  Target,
  Gauge,
  Network,
  BarChart3,
  Rocket,
  LifeBuoy,
  Zap,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import type { PriceLocale } from "@/lib/shared/format-price";
import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";

/* ───────────────────────────────────────────────────────────────────────
   WHAT YOU GET — 2026 redesign of the ValueStack band (Figma «код сайт
   арт» frame #1729:2696; audit: docs/home-wyg-figma-audit.md). This band
   ABSORBS the former PerformanceProof section: its 0.5s/95+ stat panels
   and the "design that sells" checklist are §1.4/§1.5 of the design, so
   their copy lives here now and the standalone component is retired.
   Since 2026-09-25 it renders as ruled entries beside one real photo
   (DESIGN.md); the `small` / `stats` / `bullets` / `img` / `icon` copy fields are
   kept for content history but not drawn.
   ─────────────────────────────────────────────────────────────────── */

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=55`;

type Card = {
  icon: LucideIcon;
  title: string;
  desc: string;
  img: string;
};

type Stat = { icon: LucideIcon; num: string; title: string; desc: string };

type Copy = {
  eyebrow: string;
  heading: React.ReactNode;
  sub: React.ReactNode;
  featured: Card[];
  small: Card[];
  stats: Stat[];
  designHeading: React.ReactNode;
  bullets: string[];
  footnote: React.ReactNode;
};

// Shared image set (locale-independent) so UK + EN stay in sync. The design
// uses its own photo fills at 6% opacity — these read equivalently dimmed.
const IMG = {
  visibility: UNSPLASH("photo-1518773553398-650c184e0bb3"),
  enquiries: UNSPLASH("photo-1480694313141-fce5e697ee25"),
  control: UNSPLASH("photo-1562034475-0292da13283a"),
  performance: UNSPLASH("photo-1501290301209-7a0323622985"),
  scalable: UNSPLASH("photo-1518112166137-85f9979a43aa"),
  analytics: UNSPLASH("photo-1551288049-bebda4e38f71"),
  launch: UNSPLASH("photo-1680992046626-418f7e910589"),
  support: UNSPLASH("photo-1655204903983-73007f15cb3e"),
};

const UK: Copy = {
  eyebrow: "ЩО ВИ ОТРИМУЄТЕ",
  heading: (
    <>
      Що входить <em>у кожен сайт</em>
    </>
  ),
  sub: (
    <>
      Дизайн, тексти, SEO, хостинг і рік підтримки — в одній ціні.
    </>
  ),
  featured: [
    {
      icon: TrendingUp,
      title: "Вас знаходять у Google",
      desc: "Побудований так, як любить пошук: структура, швидкість, метадані. Щоб люди, які вже шукають вашу послугу, знаходили саме вас.",
      img: IMG.visibility,
    },
    {
      icon: Target,
      title: "Відвідувачі стають заявками",
      desc: "Чіткі меседжі, шлях до дії за 1–2 кроки та mobile-first верстка — бо саме звідти приходить більшість ваших клієнтів.",
      img: IMG.enquiries,
    },
    {
      icon: Smartphone,
      title: "Керуєте з телефона",
      desc: "Тексти, ціни, послуги й кейси змінюєте самі в адмінці. Код, домен і дані — ваші.",
      img: IMG.launch,
    },
    {
      icon: LifeBuoy,
      title: "Підтримка включена",
      desc: "Рік гарантії, хостингу і техпідтримки — в ціні. Жодних абонплат.",
      img: IMG.support,
    },
  ],
  small: [
    { icon: Gauge, title: "Сервер відповідає за 0,2–0,5 с", desc: "Стільки триває відповідь сервера цього сайту — сторінка починає малюватися одразу, а не після паузи. Сайти на конструкторах віддають перший байт помітно довше.", img: IMG.performance },
    { icon: Network, title: "Готовий рости разом із вами", desc: "Нові сторінки, локації та інтеграції додаються поверх наявного — без переробки з нуля.", img: IMG.scalable },
    { icon: BarChart3, title: "Звідки приходять гроші", desc: "Аналітика з першого дня: джерела трафіку, заявки, результати.", img: IMG.analytics },
    { icon: Rocket, title: "Запуск — на нас", desc: "Хостинг, безпека, DNS, деплой — усю технічну частину робимо ми. Ви просто отримуєте ключі.", img: IMG.launch },
    { icon: LifeBuoy, title: "Рік підтримки після запуску", desc: "Виправлення, оновлення, хостинг і SSL — рік у ціні сайту.", img: IMG.support },
  ],
  stats: [
    {
      icon: Zap,
      num: "2,4 с",
      title: "до першого екрана",
      desc: "Це LCP цього сайту, зміряний на реальних відвідувачах, а не в лабораторному тесті. Зелена зона Google — до 2,5 с. Перевірте самі, ми не проти.",
    },
    {
      icon: Gauge,
      num: "0",
      title: "зсувів макета",
      desc: "CLS нуль: нічого не стрибає під пальцем, поки сторінка вантажиться. Це один із трьох показників, за якими Google оцінює сайт, — і єдиний, де буває ідеальний результат.",
    },
  ],
  designHeading: (
    <>
      «Дизайн, що продає» — це не слова, <em>а рішення:</em>
    </>
  ),
  bullets: [
    "Кнопка там, куди великий палець дотягується без зусиль.",
    "Головна дія помітна з першого погляду.",
    "Колір і шрифт передають характер вашого бренду.",
    "Спершу знімаємо сумнів — потім ставимо кнопку.",
  ],
  footnote: (
    <>
      Сайти на чистому коді працюють утричі швидше за конструктори. Швидше —
      це вища конверсія й кращі позиції в пошуку.
    </>
  ),
};

const EN: Copy = {
  eyebrow: "WHAT YOU GET",
  heading: (
    <>
      What comes <em>with every site</em>
    </>
  ),
  sub: (
    <>
      Design, copy, SEO, hosting and a year of support — in one price.
    </>
  ),
  featured: [
    {
      icon: TrendingUp,
      title: "You get found on Google",
      desc: "Built the way search likes it: structure, speed, metadata. So the people already searching for your service find you right now.",
      img: IMG.visibility,
    },
    {
      icon: Target,
      title: "Visitors turn into leads",
      desc: "Clear messaging, a path to action in 1–2 steps, and a mobile-first layout — because that’s where most of your clients come from.",
      img: IMG.enquiries,
    },
    {
      icon: Smartphone,
      title: "You run it from your phone",
      desc: "Copy, prices, services and case studies — you change them yourself in the CMS. The code, domain and data are yours.",
      img: IMG.launch,
    },
    {
      icon: LifeBuoy,
      title: "Support included",
      desc: "A year of warranty, hosting and technical support is in the price. No monthly fees.",
      img: IMG.support,
    },
  ],
  small: [
    { icon: Gauge, title: "Server responds in 0.2–0.5s", desc: "That is this site's own server response time — the page starts painting immediately rather than after a pause. Builder-made sites take noticeably longer to send the first byte.", img: IMG.performance },
    { icon: Network, title: "Ready to grow with you", desc: "New pages, locations, and integrations are added on top of what’s there — no rebuild from scratch.", img: IMG.scalable },
    { icon: BarChart3, title: "You see where the money comes from", desc: "Analytics set up from day one: traffic sources, leads, results.", img: IMG.analytics },
    { icon: Rocket, title: "Launch is on us", desc: "Hosting, security, DNS, deployment — we handle all the technical side. You just pick up the keys.", img: IMG.launch },
    { icon: LifeBuoy, title: "A year of support after launch", desc: "Fixes, updates, hosting and SSL — a year included in the price.", img: IMG.support },
  ],
  stats: [
    {
      icon: Zap,
      num: "2.4s",
      title: "to first paint",
      desc: "That is this site's LCP, measured on real visitors rather than in a lab test. Google's green zone is under 2.5s. Check it yourself — we don't mind.",
    },
    {
      icon: Gauge,
      num: "0",
      title: "layout shift",
      desc: "CLS of zero: nothing jumps under your thumb while the page loads. It is one of the three metrics Google scores a site on, and the only one where a perfect result is possible.",
    },
  ],
  designHeading: (
    <>
      “Design that sells” isn’t a word — <em>it’s a decision:</em>
    </>
  ),
  bullets: [
    "The button sits where your thumb reaches without stretching.",
    "The main action is visible at a glance.",
    "Color and type carry your brand’s character.",
    "We ease the hesitation first — then place the button.",
  ],
  footnote: (
    <>
      Custom-coded sites run 3× faster than builder sites. Faster means higher
      conversion and better search rankings.
    </>
  ),
};

const RU: Copy = {
  eyebrow: "ЧТО ВЫ ПОЛУЧАЕТЕ",
  heading: (
    <>
      Что входит <em>в каждый сайт</em>
    </>
  ),
  sub: (
    <>
      Дизайн, тексты, SEO, хостинг и год поддержки — в одной цене.
    </>
  ),
  featured: [
    {
      icon: TrendingUp,
      title: "Вас находят в Google",
      desc: "Построен так, как любит поиск: структура, скорость, метаданные. Чтобы люди, которые уже ищут вашу услугу, находили именно вас.",
      img: IMG.visibility,
    },
    {
      icon: Target,
      title: "Посетители становятся заявками",
      desc: "Чёткие сообщения, путь к действию за 1–2 шага и mobile-first вёрстка — ведь именно оттуда приходит большинство ваших клиентов.",
      img: IMG.enquiries,
    },
    {
      icon: Smartphone,
      title: "Управляете с телефона",
      desc: "Тексты, цены, услуги и кейсы меняете сами в админке. Код, домен и данные — ваши.",
      img: IMG.launch,
    },
    {
      icon: LifeBuoy,
      title: "Поддержка включена",
      desc: "Год гарантии, хостинга и техподдержки — в цене. Никаких абонплат.",
      img: IMG.support,
    },
  ],
  small: [
    { icon: Gauge, title: "Сервер отвечает за 0,2–0,5 с", desc: "Столько занимает ответ сервера этого сайта — страница начинает рисоваться сразу, а не после паузы. Сайты на конструкторах отдают первый байт заметно дольше.", img: IMG.performance },
    { icon: Network, title: "Готов расти вместе с вами", desc: "Новые страницы, локации и интеграции добавляются поверх существующего — без переделки с нуля.", img: IMG.scalable },
    { icon: BarChart3, title: "Откуда приходят деньги", desc: "Аналитика с первого дня: источники трафика, заявки, результаты.", img: IMG.analytics },
    { icon: Rocket, title: "Запуск — на нас", desc: "Хостинг, безопасность, DNS, деплой — всю техническую часть делаем мы. Вы просто получаете ключи.", img: IMG.launch },
    { icon: LifeBuoy, title: "Год поддержки после запуска", desc: "Исправления, обновления, хостинг и SSL — год в цене сайта.", img: IMG.support },
  ],
  stats: [
    {
      icon: Zap,
      num: "2,4 с",
      title: "до первого экрана",
      desc: "Это LCP этого сайта, измеренный на реальных посетителях, а не в лабораторном тесте. Зелёная зона Google — до 2,5 с. Проверьте сами, мы не против.",
    },
    {
      icon: Gauge,
      num: "0",
      title: "сдвигов макета",
      desc: "CLS ноль: ничего не прыгает под пальцем, пока страница грузится. Это один из трёх показателей, по которым Google оценивает сайт, — и единственный, где бывает идеальный результат.",
    },
  ],
  designHeading: (
    <>
      «Дизайн, который продаёт» — это не слова, <em>а решение:</em>
    </>
  ),
  bullets: [
    "Кнопка там, куда большой палец дотягивается без усилий.",
    "Главное действие заметно с первого взгляда.",
    "Цвет и шрифт передают характер вашего бренда.",
    "Сначала снимаем сомнение — потом ставим кнопку.",
  ],
  footnote: (
    <>
      Сайты на чистом коде работают втрое быстрее конструкторов. Быстрее —
      это выше конверсия и лучшие позиции в поиске.
    </>
  ),
};

const COPY_BY_LOCALE: Record<Locale, Copy> = { uk: UK, en: EN, ru: RU };

/* Real screen of the CMS (Sanity Studio) composited into a generated scene —
   the scene is AI-made, the screen is not (plan 2026-09-16, §10 prompt A). */
const VALUE_PHOTO = {
  src: "/home/admin-phone-v2.webp",
  width: 1080,
  height: 1350,
  alt: {
    uk: "Адмінка сайту на телефоні: редагування послуги і ціни",
    ru: "Админка сайта на телефоне: редактирование услуги и цены",
    en: "The site's CMS on a phone: editing a service and its price",
  } as Record<Locale, string>,
};

export function ValueStack({
  locale = "uk",
  eyebrow,
  heading,
  sub,
}: {
  locale?: PriceLocale;
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
} = {}) {
  const c = COPY_BY_LOCALE[locale];

  // 2026-09-25 (DESIGN.md): four ruled entries beside one real photo. The
  // icon tiles, dimmed stock-photo fills, grain, chevron vector, glow ellipse
  // and sparkle trio are gone — none of them said anything the words don't.
  // The photo stays a cell of the same grid (owner, 2026-09-17: «по сітці»).
  return (
    <section className={hpSectionClass} id="value">
      <div className={hpInnerClass}>
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SectionHead eyebrow={eyebrow ?? c.eyebrow} heading={heading ?? c.heading} sub={sub ?? c.sub} />
            <ul className="m-0 grid list-none grid-cols-1 gap-x-10 border-t border-line p-0 xl:grid-cols-2 xl:border-t-0">
              {c.featured.map((card) => (
                <li key={card.title} className="border-b border-line py-5 xl:border-t xl:border-b-0 xl:pt-6 xl:pb-2">
                  <h3 className="m-0 font-actay text-[16px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-ink md:text-[18px]">
                    {card.title}
                  </h3>
                  <p className="mt-2 mb-0 max-w-[46ch] font-sans text-[15px] leading-[1.6] text-ink-dim [text-wrap:pretty]">
                    {card.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-frame border border-line md:mt-0 md:aspect-auto md:min-h-[440px]">
            <AppImage
              src={VALUE_PHOTO.src}
              alt={VALUE_PHOTO.alt[locale]}
              fill
              sizes="(min-width: 1100px) 33vw, (min-width: 700px) 42vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
