/**
 * Content type and locale data for the vs-freelancers comparison page.
 */

import type * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Briefcase, Brush, Calendar, Code2, Cpu, Crown, Database, Edit3, FileSignature, FileText, FileX, Ghost, Hourglass, Infinity as InfinityIcon, ListChecks, Mail, MessageCircle, Palette, PenLine, Scale, Server, ShieldAlert, ShieldCheck, TrendingUp, Video, Wallet, Workflow } from "lucide-react";
import { formatPrice } from "@/lib/shared/format-price";
import {
  LOCALE_MARKET,
  PAYMENT_TERMS,
  addonPrice,
  formatPackagePrice,
  formatPackageTerm,
  packagePrice,
} from "@/constants/pricing";

/* ─── Figures — our side always comes from the pricing config ───────────── */

const PENALTY_CAP = PAYMENT_TERMS.latePenaltyCapPercent;
// import { SITE_CONTACT } from "@/constants/site"; // CALENDLY DISABLED — see docs/calendly-disabled.md

/* ─── Content shape ─────────────────────────────────────────────────────── */

export type HorrorStory = {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
};

export type RightChoice = { title: string; body: string };

export type Person = { icon: LucideIcon; role: string; body: string };

export type Cost = {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
};

export type DontDo = { title: string; body: string };

export type CompareRow = { criterion: string; freelancer: string; us: string };

export type TcoRow = { item: string; freelancer: string; us: string };

export type Content = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  hero: {
    eyebrowLabel: string;
    h1Lines: React.ReactNode[];
    lede: React.ReactNode;
    badges: { label: string; sub: string }[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  horrorStories: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    items: HorrorStory[];
    foot: React.ReactNode;
  };
  rightChoice: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    items: RightChoice[];
    foot: string;
  };
  compare: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    headers: { criterion: string; freelancer: string; us: string };
    rows: CompareRow[];
  };
  team: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    coreHeading: string;
    core: Person[];
    partnersHeading: string;
    partners: Person[];
    foot: string;
  };
  payFor: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    items: Cost[];
  };
  admin: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    desktopAlt: string;
    desktopCaption: string;
    mobileAlt: string;
    mobileCaption: string;
    capabilitiesHeading: string;
    capabilities: { num: string; title: string; body: string }[];
    foot: React.ReactNode;
  };
  caseStudy: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    situationHeading: string;
    situation: string[];
    actionHeading: string;
    action: string[];
    outcomeHeading: string;
    outcome: string[];
    foot: React.ReactNode;
  };
  filter: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    items: DontDo[];
    foot: string;
  };
  pricing: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    headers: { item: string; freelancer: string; us: string };
    totalLabel: string;
    s1Title: string;
    s1Rows: TcoRow[];
    s1Total: { freelancer: string; us: string };
    s1Verdict: React.ReactNode;
    s2Title: string;
    s2Rows: TcoRow[];
    s2Total: { freelancer: string; us: string };
    s2Verdict: React.ReactNode;
  };
  faq: {
    eyebrow: string;
    heading: React.ReactNode;
    items: { q: string; a: string }[];
  };
  cta: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: string;
    cards: {
      icon: LucideIcon;
      title: string;
      body: string;
      cta: string;
      href: string;
      featured?: boolean;
    }[];
  };
};

/* ─── UA copy ───────────────────────────────────────────────────────────── */

/* ─── Year-one cost of ownership (pricing section) ─────────────────────── */

/**
 * Freelancer side of the TCO tables — market assumptions, not our prices.
 * Our side comes from the pricing config, so the verdict is computed: if a
 * package price moves, the conclusion follows the arithmetic.
 * TODO(owner): перевірити ставки фрілансерів (UA — Freelancehunt/Upwork,
 * EU — Malt/Upwork); checked 2026-09-20.
 */
const FREELANCER = {
  ua: { s1Dev: 700, s1SupportMo: 50, s1Bugs: [200, 300], s1Seo: 400, s1Risk: 0.15,
        s2Dev: 2000, s2SupportMo: 80, s2Integrations: 1200, s2Bugs: 600, s2Risk: 0.25 },
  intl: { s1Dev: 2000, s1SupportMo: 50, s1Bugs: [200, 300], s1Seo: 400, s1Risk: 0.15,
          s2Dev: 5000, s2SupportMo: 80, s2Integrations: 1200, s2Bugs: 600, s2Risk: 0.25 },
} as const;

const TCO_COPY = {
  uk: {
    s1Title: "Сценарій 1: сайт для бізнесу на 5 сторінок",
    s2Title: "Сценарій 2: інтернет-магазин до 100 товарів",
    dev: "Розробка",
    support1: "Підтримка перший рік",
    bugs: "Критичні багфікси (2 за рік)",
    seo: "Доробка SEO через 6 міс",
    risk1: "Ризик зникнення / переробки (15%)",
    support2: "Підтримка",
    integrations: "Інтеграції (CRM, оплата, доставка)",
    bugs2: "Багфікси",
    risk2: "Ризик rescue-проєкту (25% для e-commerce)",
    mo: "міс",
    included: "включено",
    warranty: "гарантія",
    seoIn: "SEO-структура в пакеті",
    contract: "договір і неустойка",
    crm: (p: string) => `${p} (CRM); оплата і доставка — в пакеті`,
    verdict: (devGap: string | null, diff: number, fmt: (n: number) => string) => (
      <>
        {devGap
          ? `Фрілансер дешевший лише в рядку «розробка» — на ${devGap}. `
          : "Фрілансер дорожчий уже на етапі розробки. "}
        За рік володіння різниця —{" "}
        <strong>
          {diff >= 0
            ? `${fmt(diff)} на нашу користь`
            : `${fmt(-diff)} на користь фрілансера`}
        </strong>
        . Цифри фрілансера — типові ринкові, у вашому випадку можуть бути
        іншими.
      </>
    ),
  },
  en: {
    s1Title: "Scenario 1: five-page business website",
    s2Title: "Scenario 2: online shop, up to 100 products",
    dev: "Development",
    support1: "Support, first year",
    bugs: "Critical bug fixes (2 a year)",
    seo: "SEO catch-up after 6 months",
    risk1: "Ghosting / rework risk (15%)",
    support2: "Support",
    integrations: "Integrations (CRM, payment, delivery)",
    bugs2: "Bug fixes",
    risk2: "Rescue project risk (25% for e-commerce)",
    mo: "mo",
    included: "included",
    warranty: "warranty",
    seoIn: "SEO structure in the package",
    contract: "contract and penalty clause",
    crm: (p: string) => `${p} (CRM); payment and delivery in the package`,
    verdict: (devGap: string | null, diff: number, fmt: (n: number) => string) => (
      <>
        {devGap
          ? `A freelancer is cheaper only on the development line — by ${devGap}. `
          : "A freelancer is more expensive already at the build stage. "}
        Over a year of ownership the difference is{" "}
        <strong>
          {diff >= 0
            ? `${fmt(diff)} in our favour`
            : `${fmt(-diff)} in the freelancer's favour`}
        </strong>
        . Freelancer figures are typical market rates; yours may differ.
      </>
    ),
  },
} as const;

function tcoTables(locale: keyof typeof TCO_COPY) {
  const t = TCO_COPY[locale];
  const f = FREELANCER[LOCALE_MARKET[locale]];
  const fmt = (n: number) => formatPrice(Math.round(n), { locale });
  const zero = (why: string) => `${fmt(0)} (${why})`;

  const s1Us = packagePrice("business", locale);
  const s1Risk = f.s1Dev * f.s1Risk;
  const s1Fl =
    f.s1Dev + f.s1SupportMo * 12 + f.s1Bugs[0] + f.s1Bugs[1] + f.s1Seo + s1Risk;

  const crm = addonPrice("crm", locale);
  const s2Us = packagePrice("shop", locale) + crm;
  const s2Risk = f.s2Dev * f.s2Risk;
  const s2Fl =
    f.s2Dev + f.s2SupportMo * 12 + f.s2Integrations + f.s2Bugs + s2Risk;

  const gap = (fl: number, us: number) => (fl < us ? fmt(us - fl) : null);

  return {
    s1Title: t.s1Title,
    s1Rows: [
      { item: t.dev, freelancer: fmt(f.s1Dev), us: fmt(s1Us) },
      {
        item: t.support1,
        freelancer: `${fmt(f.s1SupportMo)}/${t.mo} × 12 = ${fmt(f.s1SupportMo * 12)}`,
        us: zero(t.included),
      },
      {
        item: t.bugs,
        freelancer: `${fmt(f.s1Bugs[0])} + ${fmt(f.s1Bugs[1])} = ${fmt(f.s1Bugs[0] + f.s1Bugs[1])}`,
        us: zero(t.warranty),
      },
      { item: t.seo, freelancer: fmt(f.s1Seo), us: zero(t.seoIn) },
      {
        item: t.risk1,
        freelancer: `${fmt(f.s1Dev)} × ${f.s1Risk} = ${fmt(s1Risk)}`,
        us: zero(t.contract),
      },
    ],
    s1Total: { freelancer: fmt(s1Fl), us: fmt(s1Us) },
    s1Verdict: t.verdict(gap(f.s1Dev, s1Us), s1Fl - s1Us, fmt),
    s2Title: t.s2Title,
    s2Rows: [
      { item: t.dev, freelancer: fmt(f.s2Dev), us: fmt(packagePrice("shop", locale)) },
      {
        item: t.support2,
        freelancer: `${fmt(f.s2SupportMo)}/${t.mo} × 12 = ${fmt(f.s2SupportMo * 12)}`,
        us: zero(t.included),
      },
      { item: t.integrations, freelancer: fmt(f.s2Integrations), us: t.crm(fmt(crm)) },
      { item: t.bugs2, freelancer: fmt(f.s2Bugs), us: zero(t.warranty) },
      {
        item: t.risk2,
        freelancer: `${fmt(f.s2Dev)} × ${f.s2Risk} = ${fmt(s2Risk)}`,
        us: zero(t.contract),
      },
    ],
    s2Total: { freelancer: fmt(s2Fl), us: fmt(s2Us) },
    s2Verdict: t.verdict(gap(f.s2Dev, packagePrice("shop", locale)), s2Fl - s2Us, fmt),
  };
}

/* ─── UA copy ─── */

export const VS_FREELANCERS_UK: Content = {
  metaTitle: `Студія чи фрілансер: сайт за ${formatPackagePrice("business", "uk")} з договором`,
  metaDescription: `Сайт для бізнесу — ${formatPackagePrice("business", "uk")}, ${formatPackageTerm("business", "uk")}, за договором. Гарантія рік, неустойка до ${PENALTY_CAP}% за зрив строку, код ваш.`,
  ogTitle: "Команда, а не одна людина. Ніхто не зникне з авансом. — Code-Site.Art",
  hero: {
    eyebrowLabel: "ПОРІВНЯННЯ · ФРІЛАНСЕРИ",
    h1Lines: [
      <>
        Сайт для бізнесу за {formatPackagePrice("business", "uk")} і{" "}
        {formatPackageTerm("business", "uk")}.
      </>,
      <em key="hero-em">Ніхто не зникне з оплаченим авансом.</em>,
    ],
    lede: (
      <>
        Фрілансери чудові — для лендінгу на вечір. Коли йдеться про сайт, від
        якого залежить виручка, потрібна команда: Федір Алпатов, засновник і
        техлід, дизайнер, розробник, редактор. Договір. Гарантія в
        письмовому вигляді. Код у вашому GitHub з першого дня.
      </>
    ),
    badges: [
      { label: "4 людини", sub: "техлід, дизайнер, розробник, редактор" },
      { label: "Гарантія 1 рік", sub: `+ неустойка до ${PENALTY_CAP}% за зрив строку` },
      { label: "0 акаунт-менеджерів", sub: "говорите з тим, хто пише код" },
      { label: "Договір із ФОП", sub: "не домовленість у Telegram" },
    ],
    ctaPrimary: "Розрахувати проєкт",
    ctaSecondary: "Подивитись як ми працюємо",
  },
  horrorStories: {
    eyebrow: "02 ВИ ЧУЛИ ЦЕ",
    heading: (
      <>
        6 історій, які <em>ви, мабуть, чули.</em>
      </>
    ),
    sub: "Або пережили самі. Це не наклеп на фрілансерів — це реальні сценарії, які ми бачимо щомісяця, коли клієнти приходять на rescue-проєкт.",
    items: [
      {
        num: "01",
        icon: Ghost,
        title: "Зник з аванса",
        body: "Заплатили 30% на старті. Перший тиждень — на звʼязку. Другий — мовчання. Третій — заблокований у Telegram. Юридично повернути — нереально, бо контракт був «на словах».",
      },
      {
        num: "02",
        icon: Hourglass,
        title: "Закінчив на 80% і перестав відповідати",
        body: "Сайт майже готовий, але без оплати реклами/CRM/чого-небудь критичного. Запускати самі не можете — не знаєте паролів. Знайти заміну з тим самим стеком — місяць пошуку.",
      },
      {
        num: "03",
        icon: Wallet,
        title: "Запустив і відмовив у підтримці",
        body: "«Це вже окрема оплата» — стандартна відповідь на будь-який запит після передачі сайту. Кожна правка тексту — від $50. Через 3 місяці перестає відповідати взагалі.",
      },
      {
        num: "04",
        icon: ShieldAlert,
        title: "Використав піратські плагіни / тему",
        body: "Сайт працює — поки ви не оновили щось у WordPress. Тоді ламається все одразу. Виявляється, на сайті 4 nulled-плагіни — переписувати з нуля або ризикувати юридично.",
      },
      {
        num: "05",
        icon: Server,
        title: "Сайт на його особистому хостингу",
        body: "«Я заплачу за хостинг, ви мені компенсуєте» — і пропадає. Через 3 місяці хостинг закінчується, сайт вимикається. Ваш домен заблокований у його акаунті, доступу немає.",
      },
      {
        num: "06",
        icon: FileX,
        title: "Без документації",
        body: "Технічно сайт є, але як він влаштований — знає тільки фрілансер. Наступний розробник проводить тиждень на reverse-engineering, далі ще тиждень на переписування половини, бо логіка незрозуміла.",
      },
    ],
    foot: (
      <>
        Кожна з цих 6 — це не виняткова історія. Це{" "}
        <strong>типовий патерн</strong>. Частина наших проєктів — це rescue
        після фрілансера або іншої студії. Якщо ви впізнаєте себе — надішліть
        посилання: у безкоштовному аудиті за 24 години скажемо чесно, що можна
        врятувати.
      </>
    ),
  },
  rightChoice: {
    eyebrow: "03 КОЛИ ФРІЛАНСЕР — ПРАВИЛЬНИЙ ВИБІР",
    heading: (
      <>
        Коли НЕ треба <em>звертатись до нас.</em>
      </>
    ),
    sub: "Не для кожного проєкту потрібна студія. Ось 4 ситуації, коли фрілансер — обʼєктивно правильний вибір. Якщо ви тут — ми не вписуємось, і це нормально.",
    items: [
      {
        title: "Лендінг до 5 сторінок без інтеграцій",
        body: `Бюджет менший за наш лендінг (${formatPackagePrice("landing", "uk")}) — фрілансер на тиждень. Договір і гарантія тут — переплата.`,
      },
      {
        title: "MVP-лендінг «за вечір» для тесту ідеї",
        body: `Швидкість > якість: фрілансер зробить за вечір, у нас лендінг — ${formatPackageTerm("landing", "uk")}. Beta-фаза = свобода ламати.`,
      },
      {
        title: "Особистий блог / портфоліо без бізнес-логіки",
        body: "Tilda або фрілансер за $300. Studio тут робити нема чого.",
      },
      {
        title: "Експериментальний проєкт з невизначеним майбутнім",
        body: "Якщо невідомо, чи буде друга версія, інвестиція в студію = передчасна оптимізація.",
      },
    ],
    foot: "Якщо ваш проєкт у цьому списку — пишіть фрилансеру на Upwork. У нас є рекомендації перевірених UA-фрилансерів, можемо звести. Без жартів — ми за чесний вибір.",
  },
  compare: {
    eyebrow: "04 ПОРІВНЯННЯ",
    heading: (
      <>
        Фрілансер vs Code-Site. <em>Чесно по фактах.</em>
      </>
    ),
    sub: "Не «ми кращі за всіх». Ось де фрілансер виграє, а де ми — на основі 25+ проєктів.",
    headers: { criterion: "Критерій", freelancer: "Фрілансер", us: "Code-Site" },
    rows: [
      {
        criterion: "Стартовий бюджет",
        // Freelancer range — market assumption. TODO(owner): перевірити ставки.
        freelancer: "$300–2 000",
        us: `${formatPackagePrice("landing", "uk")} – ${formatPackagePrice("custom", "uk")}`,
      },
      {
        criterion: "Розмір команди",
        freelancer: "1 людина",
        us: "4 людини: техлід, дизайнер, розробник, редактор",
      },
      {
        criterion: "Спеціалізації",
        freelancer: "1–2 (зазвичай «тільки код» або «тільки дизайн»)",
        us: "6+ (дизайн, фронт, бекенд, копірайт, SEO, QA, PM)",
      },
      {
        criterion: "Процес",
        freelancer: "гнучкий, неформальний",
        us: "структурований: brief → design → dev → QA → launch",
      },
      {
        criterion: "QA / тестування",
        freelancer: "self-review, інколи відсутнє",
        us: "60-point QA checklist перед запуском",
      },
      {
        criterion: "Документація",
        freelancer: "зазвичай немає",
        us: "повна, передається з кодом",
      },
      {
        criterion: "Контракт",
        freelancer: "усний / на Telegram",
        us: "юридична особа, договір, неустойка",
      },
      {
        criterion: "Гарантія",
        freelancer: "«виправлю якщо буде час»",
        us: "1 рік, у договорі",
      },
      {
        criterion: "Підтримка після запуску",
        freelancer: "за окрему оплату або зникає",
        us: "1 рік включено",
      },
      {
        criterion: "Заміна виконавця при проблемі",
        freelancer: "пошук нового з нуля",
        us: "передача всередині команди за день",
      },
      {
        criterion: "Швидкість",
        freelancer: "1 людина = 1 потік",
        us: `фікс у договорі: сайт для бізнесу — ${formatPackageTerm("business", "uk")}`,
      },
      {
        criterion: "Ризик зникнення",
        freelancer: "високий — нема юр. зобовʼязання",
        us: "відсутній — зривається договір, не людина",
      },
    ],
  },
  team: {
    eyebrow: "05 КОМАНДА",
    heading: (
      <>
        Хто саме <em>на вашому проєкті.</em>
      </>
    ),
    sub: "Команда з 4 людей: Федір Алпатов — засновник і техлід, дизайнер, розробник, редактор. Вузьких фахівців підключаємо під задачу. Між вами і людьми, які пишуть код, немає акаунт-менеджерів.",
    coreHeading: "Постійне ядро",
    core: [
      {
        icon: Crown,
        role: "Техлід і засновник — Федір Алпатов",
        body: "Архітектура проєкту. Технічні рішення. Прямий контакт з клієнтом на брифі.",
      },
      {
        icon: Palette,
        role: "Дизайнер",
        body: "Дизайн макетів, прототипи, дизайн-система проєкту.",
      },
      {
        icon: Code2,
        role: "Розробник",
        body: "Реалізація дизайну в коді, performance, кросбраузерність.",
      },
      {
        icon: TrendingUp,
        role: "Редактор",
        body: "Тексти сторінок, SEO-структура, контент-план.",
      },
    ],
    partnersHeading: "Кого підключаємо під задачу (не входять у команду)",
    partners: [
      {
        icon: Database,
        role: "Backend Developer",
        body: "Кастом-API, складна логіка, інтеграції CRM/ERP.",
      },
      {
        icon: Cpu,
        role: "DevOps / Інфраструктура",
        body: "Складна архітектура, multi-environment, CI/CD.",
      },
      {
        icon: PenLine,
        role: "Копірайтер UA",
        body: "Тексти головної, опис послуг, SEO-статті.",
      },
      {
        icon: PenLine,
        role: "Копірайтер EN",
        body: "EN-локалізація, англомовні лендінги.",
      },
      {
        icon: ShieldCheck,
        role: "QA Engineer",
        body: "Перед запуском — 60-point checklist + регрес.",
      },
      {
        icon: Briefcase,
        role: "Project Manager",
        body: "Великі проєкти зі складним scope.",
      },
      {
        icon: Video,
        role: "Motion / Video Designer",
        body: "Анімації, відео-кейси, hero-motion.",
      },
      {
        icon: Brush,
        role: "Ілюстратор",
        body: "Кастом-ілюстрації, іконки, графічні сцени.",
      },
    ],
    foot: "Хочете спілкуватись з конкретною людиною з команди? Скажіть на брифі — налаштуємо. Між вами і виконавцем немає прошарків.",
  },
  payFor: {
    eyebrow: "06 ЗА ЩО ПЛАТИТЕ",
    heading: (
      <>
        Різниця в ціні — <em>це не годинна ставка.</em>
      </>
    ),
    sub: "Фрілансер рахує години. У нас — фіксована ціна пакета в договорі. Ось що в неї входить, окрім самих годин:",
    items: [
      {
        num: "01",
        icon: Workflow,
        title: "Процес",
        body: "Brief → design → dev → QA → launch. У фрілансера часто «почали і подивимось». У нас — структура, через яку ваш проєкт пройде, навіть якщо у когось грип.",
      },
      {
        num: "02",
        icon: ListChecks,
        title: "60-point QA checklist",
        body: "Перед запуском проєкт проходить 60 пунктів перевірки: performance, accessibility, SEO, responsive, cross-browser, форми, аналітика. Фрілансер робить self-test (часто none).",
      },
      {
        num: "03",
        icon: ShieldCheck,
        title: "Гарантія 1 рік",
        body: "Це не маркетинг — це юридичне зобовʼязання в договорі. Помилка у нашому коді через 11 місяців — ми її виправляємо безкоштовно. Фрілансер: «це окрема оплата».",
      },
      {
        num: "04",
        icon: Scale,
        title: "Неустойка 30% за зрив",
        body: "Не встигаємо в термін — повертаємо 30% від ціни проєкту. Це не пуста обіцянка — є в кожному договорі. У фрілансера ризик зриву на вас.",
      },
      {
        num: "05",
        icon: FileSignature,
        title: "Контракт з юр. особою",
        body: "Договір із ФОП або ТОВ. Закриваючі акти. Можна списувати у витрати. Спірні питання вирішуються через суд, а не через «будь ласка не блокуй мене».",
      },
      {
        num: "06",
        icon: FileText,
        title: "Документація і handoff",
        body: "Код передається з повною документацією. Якщо завтра ми зникнемо — будь-який наступний розробник зрозуміє ваш проєкт за день. У фрілансера документації зазвичай немає.",
      },
      {
        num: "07",
        icon: Edit3,
        title: "Sanity Studio для самостійних правок",
        body: "Після запуску ви редагуєте контент самі. Без нас. У фрілансера зазвичай «напишіть мені, я виправлю — від $50».",
      },
      {
        num: "08",
        icon: InfinityIcon,
        title: "Безперервність",
        body: "Якщо когось з команди немає — проєкт не зупиняється. Передача за день. У фрілансера: один зник = весь проєкт зник.",
      },
    ],
  },
  admin: {
    eyebrow: "07 ПІСЛЯ ЗАПУСКУ",
    heading: (
      <>
        Редагуєте сайт самі. <em>Без нас. Без фрилансера.</em>
      </>
    ),
    sub: "Найбільша пастка фрилансера — після запуску ви залежите від нього на кожну правку. Текст замінити — $50. Кнопку перефарбувати — $30. Через 3 місяці він перестає відповідати, і ви платите наступному ще раз. Ми даємо вам Sanity Studio — повноцінну адмінку, де ви робите все самі. З компʼютера. Або з телефона. Безкоштовно для команди до 5 осіб.",
    desktopAlt:
      "Sanity Studio admin interface on desktop — drag-and-drop block editor",
    desktopCaption:
      "Sanity Studio з компʼютера — повний контроль над контентом",
    mobileAlt:
      "Sanity Studio admin interface on mobile phone — full editing capability",
    mobileCaption: "Та сама адмінка з телефона — редагуйте з будь-де",
    capabilitiesHeading: "6 речей, які робите без розробника",
    capabilities: [
      {
        num: "01",
        title: "Drag-and-drop блоки",
        body: "Перетягуєте секції на сторінку — текст, зображення, форма, відгуки, FAQ. Кожен блок має правила, тому верстку не зламаєте.",
      },
      {
        num: "02",
        title: "Редагуєте з телефона",
        body: "Реально. Не «адаптивна версія для аварії» — повноцінне редагування з мобільного. У відрядженні дізналися ціни конкурентів — оновили свої з кафе за 2 хвилини.",
      },
      {
        num: "03",
        title: "Створюєте нові сторінки самі",
        body: "Без розробника. Натиснули «новий запис», обрали шаблон, заповнили поля, опублікували. 5 хвилин від ідеї до публікації.",
      },
      {
        num: "04",
        title: "Мультимовність вбудована",
        body: "Кожне поле має українську і англійську версії. Перекладаєте — рендериться. Без плагінів, без додаткової оплати.",
      },
      {
        num: "05",
        title: "SEO без плагінів",
        body: "Кожна сторінка має поля title, meta-description, OG-image, schema.org. Заповнили — Google бачить. Без Yoast, без підписок.",
      },
      {
        num: "06",
        title: "Команда до 5 осіб — безкоштовно",
        body: "Маркетолог + асистент + копірайтер + редактор + ви — нуль доларів на місяць. Платний тариф починається з 6-ї людини.",
      },
    ],
    foot: (
      <>
        Sanity Studio — open-source. Через 5 років вирішите піти від нас —
        Studio залишається у вас, контент експортується в JSON.{" "}
        <strong>Ніякого вендор-лок-іна.</strong> Жоден фрилансер вам такого не
        дасть.
      </>
    ),
  },
  caseStudy: {
    eyebrow: "08 RESCUE-ПРОЄКТИ",
    heading: (
      <>
        Частина наших проєктів — <em>це rescue після фрілансера.</em>
      </>
    ),
    sub: "Це не виняток. Це типовий патерн. Ось що ми бачимо на типовому rescue-кейсі:",
    situationHeading: "Типова ситуація",
    situation: [
      "Клієнт заплатив фрілансеру $1 500–3 000 за лендінг або сайт",
      "Фрілансер закінчив 60–80% і перестав відповідати",
      "Сайт працює, але без оплати реклами / форм / CRM-інтеграції",
      "Доступу до коду немає — фрілансер не передав",
      "Знайти нового фрілансера з тим самим стеком — 1–2 місяці пошуку",
    ],
    actionHeading: "Що робимо ми",
    action: [
      "Протягом 24 годин: безкоштовний аудит — дивимось, що є, що працює, що ні",
      "Фіксуємо ціну і строк у договорі — за пакетом, без погодинки",
      "Якщо стек «сирий» — переписуємо на наш код, а не латаємо",
      "Запуск + 30 днів моніторингу, гарантія і підтримка рік",
    ],
    outcomeHeading: "Типовий результат",
    outcome: [
      `Запуск за строком пакета (сайт для бізнесу — ${formatPackageTerm("business", "uk")}) замість 1–2 місяців пошуку нового фрілансера`,
      "Сайт остаточно функціональний, з документацією, з гарантією",
      "Витрати клієнта: фрілансеру (вже втрачено) + наш rescue-проєкт = в середньому в 1.5–2× дорожче, ніж якби з нами одразу",
    ],
    foot: (
      <>
        Висновок очевидний: дешевий фрілансер часто{" "}
        <strong>дорожче</strong>, ніж студія з самого початку. Якщо ви на стадії
        «вирішую — фрілансер чи студія» — перечитайте секцію 03 (коли фрілансер
        правильний вибір). Якщо вже були з фрілансером і не вийшло —
        давайте поговоримо.
      </>
    ),
  },
  filter: {
    eyebrow: "09 ЧЕСНО",
    heading: (
      <>
        Чого ми <em>не робимо.</em>
      </>
    ),
    sub: "Навіть для серйозних проєктів ми не для всіх. Ось коли ми скажемо «ні»:",
    items: [
      {
        title: `Сайт дешевше за ${formatPackagePrice("landing", "uk")}`,
        body: `Наш мінімум — ${formatPackagePrice("landing", "uk")} за лендінг. Дешевше — не з нашими гарантіями.`,
      },
      {
        title: "Запуск «до завтра»",
        body: `Наш мінімум — ${formatPackageTerm("landing", "uk")} на лендінг. Якщо горить сьогодні — фрілансер на ніч.`,
      },
      {
        title: "Сайт «схожий на цей, тільки інший» без брифу",
        body: "Ми не клонуємо чужі дизайни. Якщо потрібен point-and-shoot копі-сайт — це Tilda на 2 години.",
      },
      {
        title: "Ваш родич зробить дешевше",
        body: "Серйозно, якщо у вас є знайомий розробник з нормальним портфоліо — наймайте його. Ми не сильніші за конкретного хорошого фрілансера — ми сильніші за середню статистику фрілансерів.",
      },
    ],
    foot: "Якщо ваш кейс із цього списку — будемо чесні і не візьмемо проєкт. Краще скажемо «ні» зараз, ніж розчаруємо вас потім.",
  },
  pricing: {
    eyebrow: "10 ПОРІВНЯННЯ ВИТРАТ",
    heading: (
      <>
        Що дешевше: <em>фрілансер чи студія?</em>
      </>
    ),
    sub: "На папері — фрилансер. У реальності за 12 місяців володіння — нерідко навпаки. Подивимось чесно:",
    headers: { item: "Стаття", freelancer: "Фрілансер", us: "Code-Site" },
    totalLabel: "Разом за рік",
    ...tcoTables("uk"),
  },
  faq: {
    eyebrow: "11 ЧАСТІ ПИТАННЯ",
    heading: (
      <>
        Що питають <em>найчастіше.</em>
      </>
    ),
    items: [
      {
        q: "Я вже працював із фрілансером, він зник. Що робити?",
        a: "Надішліть посилання і доступи, які лишились. Безкоштовний аудит — протягом 24 годин: код, SEO, що працює. Далі два варіанти: rescue (зберігаємо що можна) або перезбірка з нуля. Скажемо чесно, що дешевше.",
      },
      {
        q: "Можете продовжити незавершену роботу фрілансера?",
        a: "Часто так, якщо він залишив код у нормальному стані. Дивимось — оцінюємо обсяг доробки. Якщо логіка занадто заплутана — чесно скажемо, що дешевше переписати.",
      },
      {
        q: "У мене є знайомий фрілансер дешевше, в чому різниця?",
        a: "Якщо це конкретний хороший фрілансер з портфоліо — можливо, нічого. Ми не стверджуємо що ми кращі за всіх. Ми кращі за середню статистику фрілансерів — і за нас юридично можна притягнути за зрив.",
      },
      {
        q: "А якщо ваш Tech Lead захворіє?",
        a: "Проєкт не зупиняється. Код, задачі і документація — у спільному репозиторії, розробник і дизайнер ті самі. Строк у договорі не змінюється.",
      },
      {
        q: "Можна спілкуватись з конкретною людиною з команди?",
        a: "Так. На брифі ви знайомитесь зі всією командою, можете обрати primary-контакт. Між вами і командою немає аккаунт-менеджерів.",
      },
      {
        q: "Як щодо NDA?",
        a: "Підпишемо стандартний NDA до брифу безкоштовно. Якщо у вас свій шаблон — теж підпишемо.",
      },
      {
        q: "Скільки людей у команді?",
        a: "Четверо: Федір Алпатов — засновник і техлід, дизайнер, розробник, редактор. Вузьких фахівців (бекенд, моушн, ілюстрації) підключаємо під задачу. Працюємо віддалено.",
      },
      {
        q: "Скільки у вас аккаунт-менеджерів?",
        a: "Нуль. Ми вирішили що між клієнтом і виконавцем не повинно бути прошарків. Це означає що Tech Lead інколи не відповідає миттєво (бо пише код), але ви точно знаєте, з ким маєте справу.",
      },
    ],
  },
  cta: {
    eyebrow: "12 ГОТОВІ ОБГОВОРИТИ?",
    heading: (
      <>
        Розрахуйте проєкт <em>за 60 секунд.</em>
      </>
    ),
    sub: "Калькулятор без форми, ціна одразу. Або надішліть посилання — безкоштовний аудит за 24 години: скажемо, чи підходимо ми, чи краще фрілансер.",
    cards: [
      {
        icon: Calendar,
        title: "Калькулятор проєкту",
        body: "Виберіть тип сайту і кількість сторінок — отримайте смету за 60 секунд.",
        cta: "Відкрити калькулятор →",
        href: "/calculator?source=vs-freelancers",
        featured: true,
      },
      /* CALENDLY DISABLED — see docs/calendly-disabled.md
      {
        icon: MessageCircle,
        title: "30-хв розбір",
        body: "Zoom з founder'ом. Покажемо реальні rescue-кейси, оцінимо ваш проєкт.",
        cta: "Записатись →",
        href: SITE_CONTACT.calendly,
      },
      */
      {
        icon: Mail,
        title: "Бриф через форму",
        body: "Опишіть проєкт — відповімо з розрахунком протягом 24 годин.",
        cta: "Заповнити бриф →",
        href: "/contacts",
      },
    ],
  },
};


/* ─── EN copy ───────────────────────────────────────────────────────────── */

export const VS_FREELANCERS_EN: Content = {
  metaTitle: `Studio vs freelancer: website for ${formatPackagePrice("business", "en")}, on contract`,
  metaDescription: `Custom-coded business website for ${formatPackagePrice("business", "en")} in ${formatPackageTerm("business", "en")}, on contract. One-year warranty, up to ${PENALTY_CAP}% penalty if we slip, you own the code.`,
  ogTitle: "A team, not one person. Nobody ghosts you. — Code-Site.Art",
  hero: {
    eyebrowLabel: "COMPARE · FREELANCERS",
    h1Lines: [
      <>
        Business website for {formatPackagePrice("business", "en")} in{" "}
        {formatPackageTerm("business", "en")}.
      </>,
      <em key="hero-em">Nobody ghosts you with your deposit.</em>,
    ],
    lede: (
      <>
        Freelancers are great — for a landing page over a weekend. When it&apos;s
        a site your revenue depends on, you need a team: Fedir Alpatov, founder
        and tech lead, a designer, a developer, an editor. A contract. A
        warranty in writing. Code in your GitHub from day one.
      </>
    ),
    badges: [
      { label: "4 people", sub: "tech lead, designer, developer, editor" },
      { label: "1-year warranty", sub: `+ up to ${PENALTY_CAP}% penalty if we slip` },
      {
        label: "0 account managers",
        sub: "you talk to the people writing the code",
      },
      { label: "Contract with a legal entity", sub: "not a person on WhatsApp" },
    ],
    ctaPrimary: "Get an estimate",
    ctaSecondary: "See how we work",
  },
  horrorStories: {
    eyebrow: "02 YOU'VE HEARD THESE",
    heading: (
      <>
        6 stories you&apos;ve <em>probably heard.</em>
      </>
    ),
    sub: "Or lived through. This isn't a smear on freelancers — these are real scenarios we see every month when clients come to us for a rescue project.",
    items: [
      {
        num: "01",
        icon: Ghost,
        title: "Vanished with the deposit",
        body: "Paid 30% upfront. Week one — responsive. Week two — silence. Week three — blocked on WhatsApp. Legally getting your money back is unrealistic, because the contract was “verbal.”",
      },
      {
        num: "02",
        icon: Hourglass,
        title: "Finished 80%, stopped replying",
        body: "Site is almost done, but without payment integration / CRM / something critical. You can't launch yourself — you don't have the passwords. Finding a replacement with the same stack — a month of searching.",
      },
      {
        num: "03",
        icon: Wallet,
        title: "Launched and refused support",
        body: "“That's a separate fee” — the standard reply to any request after handoff. Every text edit — from €50. After 3 months, they stop replying entirely.",
      },
      {
        num: "04",
        icon: ShieldAlert,
        title: "Used pirated plugins / themes",
        body: "Site works — until you update something in WordPress. Then everything breaks at once. Turns out there are 4 nulled plugins on the site — rewrite from scratch or take a legal risk.",
      },
      {
        num: "05",
        icon: Server,
        title: "Site on their personal hosting",
        body: "“I'll pay for hosting, you reimburse me” — and they vanish. Three months later, hosting expires, site goes dark. Your domain is locked in their account, you have no access.",
      },
      {
        num: "06",
        icon: FileX,
        title: "No documentation",
        body: "The site exists, but only the freelancer knows how it works. The next developer spends a week reverse-engineering, then another week rewriting half of it because the logic is opaque.",
      },
    ],
    foot: (
      <>
        Each of these 6 isn&apos;t an exceptional story. It&apos;s a{" "}
        <strong>typical pattern</strong>. Some of our projects are rescues
        after a freelancer or another agency. If you recognise yourself — send
        us the link. The free audit comes within 24 hours and tells you
        straight what&apos;s salvageable.
      </>
    ),
  },
  rightChoice: {
    eyebrow: "03 WHEN A FREELANCER IS THE RIGHT CHOICE",
    heading: (
      <>
        When NOT to <em>hire us.</em>
      </>
    ),
    sub: "Not every project needs a studio. Here are 4 situations where a freelancer is objectively the right call. If you're here — we're not the fit, and that's fine.",
    items: [
      {
        title: "A landing under 5 pages with no integrations",
        body: `Budget below our landing page (${formatPackagePrice("landing", "en")}) — a freelancer for a week. A contract and warranty here is overpay.`,
      },
      {
        title: "An MVP landing “over a weekend” to test an idea",
        body: `Speed > quality: a freelancer ships over a weekend, our landing page takes ${formatPackageTerm("landing", "en")}. Beta phase = freedom to break things.`,
      },
      {
        title: "Personal blog / portfolio without business logic",
        body: "Tilda or a freelancer for €300. Nothing for a studio to do here.",
      },
      {
        title: "Experimental project with an uncertain future",
        body: "If you don't know whether v2 will happen, investing in a studio is premature optimisation.",
      },
    ],
    foot: "If your project is on this list — go hire on Upwork. We have a list of vetted freelancers we can refer you to. No jokes — we're for honest fit.",
  },
  compare: {
    eyebrow: "04 SIDE BY SIDE",
    heading: (
      <>
        Freelancer vs Code-Site. <em>Honest, fact-based.</em>
      </>
    ),
    sub: "Not “we're better than everyone.” Here's where a freelancer wins, and where we do — based on 25+ projects.",
    headers: { criterion: "Criterion", freelancer: "Freelancer", us: "Code-Site" },
    rows: [
      {
        criterion: "Starting budget",
        // Freelancer range — market assumption. TODO(owner): перевірити ставки.
        freelancer: "€300–2,000",
        us: `${formatPackagePrice("landing", "en")} – ${formatPackagePrice("custom", "en")}`,
      },
      {
        criterion: "Team size",
        freelancer: "1 person",
        us: "4 people: tech lead, designer, developer, editor",
      },
      {
        criterion: "Specialisations",
        freelancer: "1–2 (usually “just code” or “just design”)",
        us: "6+ (design, frontend, backend, copy, SEO, QA, PM)",
      },
      {
        criterion: "Process",
        freelancer: "flexible, informal",
        us: "structured: brief → design → dev → QA → launch",
      },
      {
        criterion: "QA / testing",
        freelancer: "self-review, sometimes none",
        us: "60-point QA checklist before launch",
      },
      {
        criterion: "Documentation",
        freelancer: "usually none",
        us: "full, handed off with the code",
      },
      {
        criterion: "Contract",
        freelancer: "verbal / on WhatsApp",
        us: "legal entity, contract, rebate clause",
      },
      {
        criterion: "Warranty",
        freelancer: "“I'll fix it if I have time”",
        us: "1 year, in the contract",
      },
      {
        criterion: "Post-launch support",
        freelancer: "charged separately or vanishes",
        us: "1 year included",
      },
      {
        criterion: "Replacement when something goes wrong",
        freelancer: "search for a new freelancer from scratch",
        us: "handoff inside the team in a day",
      },
      {
        criterion: "Speed",
        freelancer: "1 person = 1 stream",
        us: `fixed in the contract: business website — ${formatPackageTerm("business", "en")}`,
      },
      {
        criterion: "Disappearance risk",
        freelancer: "high — no legal obligation",
        us: "none — the contract breaks, not the person",
      },
    ],
  },
  team: {
    eyebrow: "05 THE TEAM",
    heading: (
      <>
        Who&apos;s actually <em>on your project.</em>
      </>
    ),
    sub: "A team of 4: Fedir Alpatov — founder and tech lead, a designer, a developer, an editor. Specialists are brought in per task. No account managers between you and the people writing the code.",
    coreHeading: "Core team",
    core: [
      {
        icon: Crown,
        role: "Tech Lead / Founder",
        body: "Project architecture. Technical decisions. Direct client contact at brief.",
      },
      {
        icon: Palette,
        role: "Designer",
        body: "Design mocks, prototypes, project design system.",
      },
      {
        icon: Code2,
        role: "Developer",
        body: "Translating design to code, performance, cross-browser.",
      },
      {
        icon: TrendingUp,
        role: "SEO / B2B Marketing Strategist",
        body: "SEO structure, technical optimisation, content strategy.",
      },
    ],
    partnersHeading: "Brought in per task (not part of the team)",
    partners: [
      {
        icon: Database,
        role: "Backend Developer",
        body: "Custom APIs, complex logic, CRM/ERP integrations.",
      },
      {
        icon: Cpu,
        role: "DevOps / Infrastructure",
        body: "Complex architecture, multi-environment, CI/CD.",
      },
      {
        icon: PenLine,
        role: "Copywriter",
        body: "Homepage copy, service descriptions, SEO articles.",
      },
      {
        icon: PenLine,
        role: "Localisation",
        body: "Additional-language versions and landing pages.",
      },
      {
        icon: ShieldCheck,
        role: "QA Engineer",
        body: "Pre-launch — 60-point checklist + regression.",
      },
      {
        icon: Briefcase,
        role: "Project Manager",
        body: "Large projects with complex scope.",
      },
      {
        icon: Video,
        role: "Motion / Video Designer",
        body: "Animations, video cases, hero motion.",
      },
      {
        icon: Brush,
        role: "Illustrator",
        body: "Custom illustrations, icons, graphic scenes.",
      },
    ],
    foot: "Want to talk to a specific person on the team? Say so at brief — we'll arrange it. There are no layers between you and the executor.",
  },
  payFor: {
    eyebrow: "06 WHAT YOU PAY FOR",
    heading: (
      <>
        The price gap <em>isn&apos;t the hourly rate.</em>
      </>
    ),
    sub: "A freelancer bills hours. We charge a fixed package price in the contract. Here's what it covers — besides the hours:",
    items: [
      {
        num: "01",
        icon: Workflow,
        title: "Process",
        body: "Brief → design → dev → QA → launch. With a freelancer it's often “let's start and see.” With us — a structure your project moves through even if someone gets the flu.",
      },
      {
        num: "02",
        icon: ListChecks,
        title: "60-point QA checklist",
        body: "Before launch the project runs through 60 verification points: performance, accessibility, SEO, responsive, cross-browser, forms, analytics. Freelancer does self-test (often none).",
      },
      {
        num: "03",
        icon: ShieldCheck,
        title: "1-year warranty",
        body: "This isn't marketing — it's a contractual obligation. A bug in our code 11 months later, we fix it free. Freelancer: “that's a separate fee.”",
      },
      {
        num: "04",
        icon: Scale,
        title: "30% rebate clause",
        body: "We miss the deadline — we pay back 30% of the project price. This isn't an empty promise; it's in every contract. With a freelancer, deadline risk is on you.",
      },
      {
        num: "05",
        icon: FileSignature,
        title: "Contract with a legal entity",
        body: "A sole trader or limited company contract. Proper invoices. Tax-deductible. Disputes resolved in court, not via “please don't block me.”",
      },
      {
        num: "06",
        icon: FileText,
        title: "Documentation and handoff",
        body: "Code is delivered with full documentation. If we vanished tomorrow, any next developer understands your project in a day. Freelancers usually skip documentation.",
      },
      {
        num: "07",
        icon: Edit3,
        title: "Sanity Studio for self-edits",
        body: "After launch, you edit content yourself. Without us. Freelancer is usually “message me, I'll fix it — from €50.”",
      },
      {
        num: "08",
        icon: InfinityIcon,
        title: "Continuity",
        body: "If someone on the team is out, the project doesn't stop. Handoff in a day. With a freelancer: one person vanishes = the whole project vanishes.",
      },
    ],
  },
  admin: {
    eyebrow: "07 AFTER LAUNCH",
    heading: (
      <>
        You edit the site yourself.{" "}
        <em>Without us. Without a freelancer.</em>
      </>
    ),
    sub: "The biggest freelancer trap is post-launch dependency. Want to swap a paragraph? €50. Recolor a button? €30. Three months later they stop replying, and you pay the next person to figure out the codebase. We give you Sanity Studio — a full admin where you do it all yourself. From your computer. Or your phone. Free for teams up to 5.",
    desktopAlt:
      "Sanity Studio admin interface on desktop — drag-and-drop block editor",
    desktopCaption: "Sanity Studio on desktop — full content control",
    mobileAlt:
      "Sanity Studio admin interface on mobile phone — full editing capability",
    mobileCaption: "Same admin on your phone — edit from anywhere",
    capabilitiesHeading: "6 things you do without a developer",
    capabilities: [
      {
        num: "01",
        title: "Drag-and-drop blocks",
        body: "Drag sections onto a page — text, image, form, testimonials, FAQ. Every block has rules, so you can't break the layout.",
      },
      {
        num: "02",
        title: "Edit from your phone",
        body: "Actually. Not “responsive admin for emergencies” — full editing on mobile. Heard your competitor's pricing on a call — update yours from a café in 2 minutes.",
      },
      {
        num: "03",
        title: "Create new pages yourself",
        body: "No developer needed. Click “new entry,” pick a template, fill the fields, publish. 5 minutes from idea to live.",
      },
      {
        num: "04",
        title: "Multi-language built in",
        body: "Every field has UK and EN versions. Translate, it renders. No plugins, no extra fees.",
      },
      {
        num: "05",
        title: "SEO without plugins",
        body: "Every page has title, meta-description, OG-image, schema.org fields. Fill them in — Google sees them. No Yoast, no subscriptions.",
      },
      {
        num: "06",
        title: "Free for teams up to 5",
        body: "Your marketer + assistant + copywriter + editor + you — €0 per month. Paid tier starts at editor #6.",
      },
    ],
    foot: (
      <>
        Sanity Studio is open-source. If you decide to leave us in 5 years,
        the Studio stays with you and content exports to JSON.{" "}
        <strong>No vendor lock-in.</strong> No freelancer will give you that.
      </>
    ),
  },
  caseStudy: {
    eyebrow: "08 RESCUE PROJECTS",
    heading: (
      <>
        Some of our projects — <em>rescues after a freelancer.</em>
      </>
    ),
    sub: "Not an outlier. A typical pattern. Here's what we see on a typical rescue:",
    situationHeading: "Typical situation",
    situation: [
      "Client paid a freelancer €1,500–3,000 for a landing or site",
      "Freelancer finished 60–80% and stopped replying",
      "Site works, but without payment integration / forms / CRM",
      "No code access — the freelancer never handed it off",
      "Finding a new freelancer with the same stack — 1–2 months of searching",
    ],
    actionHeading: "What we do",
    action: [
      "Within 24 hours: a free audit — what's there, what works, what doesn't",
      "Price and timeline fixed in the contract — per package, not per hour",
      "If the stack is rough, we rebuild in our code instead of patching",
      "Launch + 30 days monitoring, a year of warranty and support",
    ],
    outcomeHeading: "Typical outcome",
    outcome: [
      `Live within the package timeline (business website — ${formatPackageTerm("business", "en")}) instead of 1–2 months hunting for a new freelancer`,
      "Site is finally functional, with documentation and warranty",
      "Client's total spend: freelancer (already lost) + our rescue = on average 1.5–2× more expensive than if they'd come to us first",
    ],
    foot: (
      <>
        The conclusion is obvious: a cheap freelancer is often{" "}
        <strong>more expensive</strong> than a studio from the start. If
        you&apos;re at “deciding — freelancer or studio,” re-read section 03
        (when a freelancer is the right call). If you already tried a
        freelancer and it didn&apos;t work out — let&apos;s talk.
      </>
    ),
  },
  filter: {
    eyebrow: "09 STRAIGHT TALK",
    heading: (
      <>
        What we <em>don&apos;t do.</em>
      </>
    ),
    sub: "Even for serious projects, we're not for everyone. Here's when we'll say no:",
    items: [
      {
        title: `Sites under ${formatPackagePrice("landing", "en")}`,
        body: `Our minimum is ${formatPackagePrice("landing", "en")} for a landing page. Cheaper doesn't come with our guarantees.`,
      },
      {
        title: "Launch by tomorrow",
        body: `Our minimum is ${formatPackageTerm("landing", "en")} for a landing page. If it has to be live tonight, hire a freelancer for the night.`,
      },
      {
        title: "A site “like this one but different” without a brief",
        body: "We don't clone other people's designs. If you need a point-and-shoot copy site, that's Tilda over 2 hours.",
      },
      {
        title: "Your relative can do it cheaper",
        body: "Seriously, if you have a developer in your network with a real portfolio — hire them. We're not better than a specific good freelancer — we're better than the average of freelancers as a category.",
      },
    ],
    foot: "If your case is on this list, we'll be honest and pass on the project. Better to say no now than disappoint you later.",
  },
  pricing: {
    eyebrow: "10 COST COMPARISON",
    heading: (
      <>
        What&apos;s cheaper: <em>freelancer or studio?</em>
      </>
    ),
    sub: "On paper — freelancer. Over 12 months of ownership, often the opposite. Let's look honestly:",
    headers: { item: "Line item", freelancer: "Freelancer", us: "Code-Site" },
    totalLabel: "Total year 1",
    ...tcoTables("en"),
  },
  faq: {
    eyebrow: "11 FAQ",
    heading: (
      <>
        What people <em>ask most.</em>
      </>
    ),
    items: [
      {
        q: "I worked with a freelancer, they vanished. What now?",
        a: "Send us the link and whatever access is left. The audit is free and comes within 24 hours: code, SEO, what works. Then two options: rescue (keep what works) or a full rebuild. We'll tell you straight which is cheaper.",
      },
      {
        q: "Can you finish what a freelancer abandoned?",
        a: "Often yes, if they left the code in reasonable shape. We assess scope. If the logic is too tangled, we'll honestly say it's cheaper to rewrite.",
      },
      {
        q: "I have a freelancer in my network who's cheaper. What's the difference?",
        a: "If they're a specific good freelancer with a real portfolio — maybe nothing. We don't claim to be better than everyone. We're better than the average of freelancers — and we can legally be held accountable for missed deadlines.",
      },
      {
        q: "What if your Tech Lead gets sick?",
        a: "The project doesn't stop. Code, tasks and docs live in a shared repository; the developer and designer stay the same. The contract deadline doesn't move.",
      },
      {
        q: "Can I talk to a specific person on the team?",
        a: "Yes. At brief you meet the whole team and can pick a primary contact. There are no account managers between you and the team.",
      },
      {
        q: "What about NDA?",
        a: "We sign a standard NDA before brief, free. If you have your own template, we'll sign that too.",
      },
      {
        q: "How many people are on the team?",
        a: "Four: Fedir Alpatov — founder and tech lead, a designer, a developer, an editor. Specialists (backend, motion, illustration) are brought in per task. We work remotely.",
      },
      {
        q: "How many account managers do you have?",
        a: "Zero. We decided there shouldn't be layers between client and executor. It means the Tech Lead doesn't always reply instantly (because they're writing code) — but you always know exactly who you're talking to.",
      },
    ],
  },
  cta: {
    eyebrow: "12 READY TO TALK?",
    heading: (
      <>
        Get an estimate <em>in 60 seconds.</em>
      </>
    ),
    sub: "Calculator, no form, price up front. Or send us a link — free audit within 24 hours: we'll tell you if we're a fit or if a freelancer is better.",
    cards: [
      {
        icon: Calendar,
        title: "Project calculator",
        body: "Pick site type and page count — get an estimate in 60 seconds.",
        cta: "Open calculator →",
        href: "/calculator?source=vs-freelancers",
        featured: true,
      },
      /* CALENDLY DISABLED — see docs/calendly-disabled.md
      {
        icon: MessageCircle,
        title: "30-min consult",
        body: "Zoom with the founder. We'll show real rescue cases and assess your project.",
        cta: "Book now →",
        href: SITE_CONTACT.calendly,
      },
      */
      {
        icon: Mail,
        title: "Send a brief",
        body: "Describe the project — we reply with a quote within 24 hours.",
        cta: "Fill out brief →",
        href: "/contacts",
      },
    ],
  },
};
