import {
  Calendar,
  Mail,
  MessageCircle,
  Ghost,
  Hourglass,
  Wallet,
  ShieldAlert,
  Server,
  FileX,
  Workflow,
  ListChecks,
  ShieldCheck,
  Scale,
  FileSignature,
  FileText,
  Edit3,
  Infinity as InfinityIcon,
  CheckCircle2,
  XCircle,
  Crown,
  Palette,
  Code2,
  TrendingUp,
  Database,
  Cpu,
  PenLine,
  Briefcase,
  Video,
  Brush,
  type LucideIcon,
} from "lucide-react";
import { HpHeader, Newsletter, HpFooter, FinalCta3 } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { HeroEditorial } from "@/components/blocks/hero";
import "@/components/blocks/comparison/comparison.css";
import { FAQ, type FAQItem } from "@/components/blocks/final";

export type VfLocale = "uk" | "en";

/* ─── Section header ────────────────────────────────────────────────────── */

function SectionHead({
  eyebrow,
  heading,
  sub,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="hp-section-head">
      <div className="hp-eyebrow">
        <span className="hp-eyebrow-dot" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="hp-h2">{heading}</h2>
      {sub ? <p className="hp-sub">{sub}</p> : null}
    </div>
  );
}

/* ─── Content shape ─────────────────────────────────────────────────────── */

type HorrorStory = {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
};

type RightChoice = { title: string; body: string };

type Person = { icon: LucideIcon; role: string; body: string };

type Cost = {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
};

type DontDo = { title: string; body: string };

type CompareRow = { criterion: string; freelancer: string; us: string };

type TcoRow = { item: string; freelancer: string; us: string };

type Content = {
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

const UK: Content = {
  metaTitle:
    "Студія vs Фрілансер · 12 людей у вашому проєкті · 0 ризику зникнення | Code-Site.Art",
  metaDescription:
    "Studio з 12 людей замість одного фрілансера. Контракт із юр. особою, гарантія 1 рік, неустойка 30%. Rescue-проєкти після фрілансерів — 12 з 47.",
  ogTitle: "12 людей у вашому проєкті. Жоден не зникне з аванса. — Code-Site.Art",
  hero: {
    eyebrowLabel: "/ ПОРІВНЯННЯ · ФРІЛАНСЕРИ",
    h1Lines: [
      <>12 людей у вашому проєкті.</>,
      <em key="hero-em">Жоден не зникне з оплаченим авансом.</em>,
    ],
    lede: (
      <>
        Фрілансери чудові — для лендінгу на вечір. Коли йдеться про сайт, від
        якого залежить виручка, потрібна команда: дизайнер, фронтендер, бекенд,
        копірайтер, SEO, QA, PM. Контракт із юридичною особою. Гарантія в
        письмовому вигляді. Код у вашому <em>GitHub</em> з першого дня.
      </>
    ),
    badges: [
      { label: "12 людей", sub: "4 в офісі + 8 перевірених партнерів" },
      { label: "Гарантія 1 рік", sub: "+ неустойка 30% за зрив" },
      { label: "0 акаунт-менеджерів", sub: "говорите з тим, хто пише код" },
      { label: "Контракт з ТОВ", sub: "не з людиною на Telegram" },
    ],
    ctaPrimary: "Розрахувати проєкт",
    ctaSecondary: "Подивитись як ми працюємо",
  },
  horrorStories: {
    eyebrow: "/ 02 ВИ ЧУЛИ ЦЕ",
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
        <strong>типовий патерн</strong>. У нас 12 з 47 проєктів — це rescue
        після фрілансера або іншої студії. Якщо ви впізнаєте себе — пишіть, на
        безкоштовному розборі скажемо чесно, що можна врятувати.
      </>
    ),
  },
  rightChoice: {
    eyebrow: "/ 03 КОЛИ ФРІЛАНСЕР — ПРАВИЛЬНИЙ ВИБІР",
    heading: (
      <>
        Коли НЕ треба <em>звертатись до нас.</em>
      </>
    ),
    sub: "Не для кожного проєкту потрібна студія. Ось 4 ситуації, коли фрілансер за $500 — обʼєктивно правильний вибір. Якщо ви тут — ми не вписуємось, і це нормально.",
    items: [
      {
        title: "Лендінг до 5 сторінок без інтеграцій",
        body: "До бюджету $1 000 — фрілансер на тиждень. Studio-overhead тут — переплата.",
      },
      {
        title: "MVP-лендінг «за вечір» для тесту ідеї",
        body: "Швидкість > якість, фрілансер доставить за 2 дні, ми — за 2 тижні. Beta-фаза = свобода ламати.",
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
    eyebrow: "/ 04 ПОРІВНЯННЯ",
    heading: (
      <>
        Фрілансер vs Code-Site. <em>Чесно по фактах.</em>
      </>
    ),
    sub: "Не «ми кращі за всіх». Ось де фрілансер виграє, а де ми — на основі 47 проєктів і 12 rescue-кейсів.",
    headers: { criterion: "Критерій", freelancer: "Фрілансер", us: "Code-Site" },
    rows: [
      {
        criterion: "Стартовий бюджет",
        freelancer: "$300–2 000",
        us: "$1 000–14 000",
      },
      {
        criterion: "Розмір команди",
        freelancer: "1 людина",
        us: "4 в офісі + 8 партнерів",
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
        us: "12 людей = паралельні треки, швидше",
      },
      {
        criterion: "Ризик зникнення",
        freelancer: "високий — нема юр. зобовʼязання",
        us: "відсутній — зривається договір, не людина",
      },
    ],
  },
  team: {
    eyebrow: "/ 05 КОМАНДА",
    heading: (
      <>
        Хто саме <em>на вашому проєкті.</em>
      </>
    ),
    sub: "Постійне ядро з 4 людей в офісі + 8 перевірених партнерів, які підключаються по ролі. Між вами і людьми, які пишуть код, немає аккаунт-менеджерів.",
    coreHeading: "Постійне ядро",
    core: [
      {
        icon: Crown,
        role: "Tech Lead / Founder",
        body: "Архітектура проєкту. Технічні рішення. Прямий контакт з клієнтом на брифі.",
      },
      {
        icon: Palette,
        role: "Senior UI/UX Designer",
        body: "Дизайн макетів, прототипи, дизайн-система проєкту.",
      },
      {
        icon: Code2,
        role: "Senior Frontend Developer",
        body: "Реалізація дизайну в коді, performance, кросбраузерність.",
      },
      {
        icon: TrendingUp,
        role: "SEO / B2B Marketing Strategist",
        body: "SEO-структура, технічна оптимізація, контент-стратегія.",
      },
    ],
    partnersHeading: "Перевірена мережа партнерів (підключаємо за необхідністю)",
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
    eyebrow: "/ 06 ЗА ЩО ПЛАТИТЕ",
    heading: (
      <>
        Різниця в ціні — <em>це не годинна ставка.</em>
      </>
    ),
    sub: "Фрілансер бере $30–60 за годину × 80 годин роботи. Ми беремо більше. Ось за що — окрім самих годин:",
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
    eyebrow: "/ 07 ПІСЛЯ ЗАПУСКУ",
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
    eyebrow: "/ 08 RESCUE-ПРОЄКТИ",
    heading: (
      <>
        12 з 47 наших проєктів — <em>це rescue після фрілансера.</em>
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
      "День 1: безкоштовний аудит — дивимось що є, що працює, що ні",
      "Тиждень 1: переписуємо проблемні частини, підключаємо інтеграції",
      "Тиждень 2–4: якщо стек «сирий» — мігруємо на наш custom code",
      "Тиждень 4–6: запуск + 30 днів моніторингу",
    ],
    outcomeHeading: "Типовий результат",
    outcome: [
      "Запуск через 4–6 тижнів замість 1–2 місяців пошуку нового фрілансера",
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
    eyebrow: "/ 09 ЧЕСНО",
    heading: (
      <>
        Чого ми <em>не робимо.</em>
      </>
    ),
    sub: "Навіть для серйозних проєктів ми не для всіх. Ось коли ми скажемо «ні»:",
    items: [
      {
        title: "Сайт за $300–800",
        body: "Наш мінімум $1 000 за лендінг. Фізично не можемо вийти на меншу ціну при наших стандартах якості.",
      },
      {
        title: "Запуск «до завтра»",
        body: "Наш мінімум 1 тиждень навіть на найпростішому лендінгу. Якщо горить — фрилансер на ніч.",
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
    eyebrow: "/ 10 ПОРІВНЯННЯ ВИТРАТ",
    heading: (
      <>
        Що дешевше: <em>фрілансер чи студія?</em>
      </>
    ),
    sub: "На папері — фрилансер. У реальності за 12 місяців володіння — нерідко навпаки. Подивимось чесно:",
    headers: { item: "Стаття", freelancer: "Фрілансер", us: "Code-Site" },
    totalLabel: "Разом за рік",
    s1Title: "Сценарій 1: Лендінг для клініки",
    s1Rows: [
      { item: "Розробка", freelancer: "$1 500", us: "$3 500" },
      {
        item: "Підтримка перший рік",
        freelancer: "$50/міс × 12 = $600",
        us: "$0 (включено)",
      },
      {
        item: "Виправлення критичних багів (2 за рік)",
        freelancer: "$200 + $300 = $500",
        us: "$0 (гарантія)",
      },
      {
        item: "Доробка SEO через 6 міс",
        freelancer: "$400",
        us: "$0 (вже зроблено)",
      },
      {
        item: "Ризик зникнення / переробки (15%)",
        freelancer: "$1 500 × 0.15 = $225",
        us: "$0",
      },
    ],
    s1Total: { freelancer: "$3 225", us: "$3 500" },
    s1Verdict: (
      <>
        Різниця: $275. Це <strong>базова ставка ризику</strong>. Через 2 роки
        фрілансер може бути дорожче на 30%.
      </>
    ),
    s2Title: "Сценарій 2: Сайт e-commerce малого бізнесу",
    s2Rows: [
      { item: "Розробка", freelancer: "$4 000", us: "$5 500" },
      {
        item: "Підтримка",
        freelancer: "$80/міс × 12 = $960",
        us: "$0",
      },
      {
        item: "Інтеграції (CRM, оплата, доставка)",
        freelancer: "$1 200",
        us: "$0 (включено)",
      },
      { item: "Багфікси", freelancer: "$600", us: "$0" },
      {
        item: "Ризик rescue-проєкту (25% для e-commerce)",
        freelancer: "$4 000 × 0.25 = $1 000",
        us: "$0",
      },
    ],
    s2Total: { freelancer: "$11 760", us: "$5 500" },
    s2Verdict: (
      <>
        Різниця: фрілансер у <strong>2.1× дорожче</strong> за рік на середньому
        e-commerce.
      </>
    ),
  },
  faq: {
    eyebrow: "/ 11 ЧАСТІ ПИТАННЯ",
    heading: (
      <>
        Що питають <em>найчастіше.</em>
      </>
    ),
    items: [
      {
        q: "Я вже працював із фрілансером, він зник. Що робити?",
        a: "Безкоштовний аудит на тиждень. Дивимось що з кодом, що з SEO, скільки врятується. Запропонуємо два варіанти: rescue (зберігаємо що можна) або міграція з нуля (швидше і чистіше). Скажемо чесно, що дешевше.",
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
        a: "Проєкт не зупиняється. Передача всередині команди за день. Ваш SEO/PM/QA/копірайтер — ті самі, тільки технічний контакт міняється на час.",
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
        q: "Чи правда, що 12 у вашому «12 людей» — це з партнерами?",
        a: "Так. 4 в постійному ядрі (вони в офісі), 8 — перевірена мережа партнерів, які підключаються за роллю. Чесно: партнери не сидять на проєкті 8 годин на день, але повністю відповідають за свою ділянку.",
      },
      {
        q: "Скільки у вас аккаунт-менеджерів?",
        a: "Нуль. Ми вирішили що між клієнтом і виконавцем не повинно бути прошарків. Це означає що Tech Lead інколи не відповідає миттєво (бо пише код), але ви точно знаєте, з ким маєте справу.",
      },
    ],
  },
  cta: {
    eyebrow: "/ 12 ГОТОВІ ОБГОВОРИТИ?",
    heading: (
      <>
        Розрахуйте проєкт <em>за 60 секунд.</em>
      </>
    ),
    sub: "Калькулятор без форми, ціна одразу. Або поговоримо на 30-хв розборі — поясните проєкт, скажемо чи маємо сенс ми, чи краще фрілансер.",
    cards: [
      {
        icon: Calendar,
        title: "Калькулятор проєкту",
        body: "Виберіть тип сайту і кількість сторінок — отримайте смету за 60 секунд.",
        cta: "Відкрити калькулятор →",
        href: "/calculator?source=vs-freelancers",
        featured: true,
      },
      {
        icon: MessageCircle,
        title: "30-хв розбір",
        body: "Zoom з founder'ом. Покажемо реальні rescue-кейси, оцінимо ваш проєкт.",
        cta: "Записатись →",
        href: "https://calendly.com/fedirdev",
      },
      {
        icon: Mail,
        title: "Бриф через форму",
        body: "Опишіть проєкт детально — повернемось протягом 4 робочих годин.",
        cta: "Заповнити бриф →",
        href: "/contacts",
      },
    ],
  },
};

/* ─── EN copy ───────────────────────────────────────────────────────────── */

const EN: Content = {
  metaTitle:
    "Studio vs Freelancer · 12 people on your project · No ghost risk | Code-Site.Art",
  metaDescription:
    "A studio of 12 people instead of one freelancer. Legal-entity contract, 1-year warranty, 30% rebate. Rescue projects after freelancers — 12 of 47.",
  ogTitle:
    "12 people on your project. None of them can ghost you. — Code-Site.Art",
  hero: {
    eyebrowLabel: "/ COMPARE · FREELANCERS",
    h1Lines: [
      <>12 people on your project.</>,
      <em key="hero-em">None of them can ghost you.</em>,
    ],
    lede: (
      <>
        Freelancers are great — for a landing page over a weekend. When it&apos;s
        a site your revenue depends on, you need a team: designer, frontend,
        backend, copywriter, SEO, QA, PM. A contract with a legal entity. A
        warranty in writing. Code in your <em>GitHub</em> from day one.
      </>
    ),
    badges: [
      { label: "12 people", sub: "4 in-house + 8 vetted partners" },
      { label: "1-year warranty", sub: "+ 30% rebate if we slip" },
      {
        label: "0 account managers",
        sub: "you talk to the people writing the code",
      },
      { label: "Contract with a legal entity", sub: "not a person on Telegram" },
    ],
    ctaPrimary: "Get an estimate",
    ctaSecondary: "See how we work",
  },
  horrorStories: {
    eyebrow: "/ 02 YOU'VE HEARD THESE",
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
        body: "Paid 30% upfront. Week one — responsive. Week two — silence. Week three — blocked on Telegram. Legally getting your money back is unrealistic, because the contract was “verbal.”",
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
        body: "“That's a separate fee” — the standard reply to any request after handoff. Every text edit — from $50. After 3 months, they stop replying entirely.",
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
        Each of these 6 isn't an exceptional story. It's a{" "}
        <strong>typical pattern</strong>. 12 of our 47 projects are rescues
        after a freelancer or another agency. If you recognize yourself — talk
        to us. The free 30-minute consult will tell you straight what's
        salvageable.
      </>
    ),
  },
  rightChoice: {
    eyebrow: "/ 03 WHEN A FREELANCER IS THE RIGHT CHOICE",
    heading: (
      <>
        When NOT to <em>hire us.</em>
      </>
    ),
    sub: "Not every project needs a studio. Here are 4 situations where a $500 freelancer is objectively the right call. If you're here — we're not the fit, and that's fine.",
    items: [
      {
        title: "A landing under 5 pages with no integrations",
        body: "Budget under $1,000 — a freelancer for a week. Studio overhead here is overpay.",
      },
      {
        title: "An MVP landing “over a weekend” to test an idea",
        body: "Speed > quality, a freelancer ships in 2 days, we ship in 2 weeks. Beta phase = freedom to break things.",
      },
      {
        title: "Personal blog / portfolio without business logic",
        body: "Tilda or a freelancer for $300. Nothing for a studio to do here.",
      },
      {
        title: "Experimental project with an uncertain future",
        body: "If you don't know whether v2 will happen, investing in a studio is premature optimization.",
      },
    ],
    foot: "If your project is on this list — go hire on Upwork. We have a list of vetted freelancers we can refer you to. No jokes — we're for honest fit.",
  },
  compare: {
    eyebrow: "/ 04 SIDE BY SIDE",
    heading: (
      <>
        Freelancer vs Code-Site. <em>Honest, fact-based.</em>
      </>
    ),
    sub: "Not “we're better than everyone.” Here's where a freelancer wins, and where we do — based on 47 projects and 12 rescue cases.",
    headers: { criterion: "Criterion", freelancer: "Freelancer", us: "Code-Site" },
    rows: [
      {
        criterion: "Starting budget",
        freelancer: "$300–2,000",
        us: "$1,000–14,000",
      },
      {
        criterion: "Team size",
        freelancer: "1 person",
        us: "4 in-house + 8 partners",
      },
      {
        criterion: "Specializations",
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
        freelancer: "verbal / on Telegram",
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
        us: "12 people = parallel tracks, faster",
      },
      {
        criterion: "Disappearance risk",
        freelancer: "high — no legal obligation",
        us: "none — the contract breaks, not the person",
      },
    ],
  },
  team: {
    eyebrow: "/ 05 THE TEAM",
    heading: (
      <>
        Who&apos;s actually <em>on your project.</em>
      </>
    ),
    sub: "A core in-house team of 4 + a vetted network of 8 partners we bring in by role. No account managers between you and the people writing the code.",
    coreHeading: "Core team",
    core: [
      {
        icon: Crown,
        role: "Tech Lead / Founder",
        body: "Project architecture. Technical decisions. Direct client contact at brief.",
      },
      {
        icon: Palette,
        role: "Senior UI/UX Designer",
        body: "Design mocks, prototypes, project design system.",
      },
      {
        icon: Code2,
        role: "Senior Frontend Developer",
        body: "Translating design to code, performance, cross-browser.",
      },
      {
        icon: TrendingUp,
        role: "SEO / B2B Marketing Strategist",
        body: "SEO structure, technical optimization, content strategy.",
      },
    ],
    partnersHeading: "Vetted partner network (brought in as needed)",
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
        role: "Copywriter (UA)",
        body: "Homepage copy, service descriptions, SEO articles.",
      },
      {
        icon: PenLine,
        role: "Copywriter (EN)",
        body: "EN localization, English landings.",
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
    eyebrow: "/ 06 WHAT YOU PAY FOR",
    heading: (
      <>
        The price gap <em>isn&apos;t the hourly rate.</em>
      </>
    ),
    sub: "A freelancer charges $30–60/hr × 80 hours of work. We charge more. Here's what for — besides the hours:",
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
        body: "Sole proprietor or LLC contract. Closing acts. Tax-deductible. Disputes resolved in court, not via “please don't block me.”",
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
        body: "After launch, you edit content yourself. Without us. Freelancer is usually “message me, I'll fix it — from $50.”",
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
    eyebrow: "/ 07 AFTER LAUNCH",
    heading: (
      <>
        You edit the site yourself.{" "}
        <em>Without us. Without a freelancer.</em>
      </>
    ),
    sub: "The biggest freelancer trap is post-launch dependency. Want to swap a paragraph? $50. Recolor a button? $30. Three months later they stop replying, and you pay the next person to figure out the codebase. We give you Sanity Studio — a full admin where you do it all yourself. From your computer. Or your phone. Free for teams up to 5.",
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
        body: "Your marketer + assistant + copywriter + editor + you — zero dollars per month. Paid tier starts at editor #6.",
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
    eyebrow: "/ 08 RESCUE PROJECTS",
    heading: (
      <>
        12 of our 47 projects — <em>rescues after a freelancer.</em>
      </>
    ),
    sub: "Not an outlier. A typical pattern. Here's what we see on a typical rescue:",
    situationHeading: "Typical situation",
    situation: [
      "Client paid a freelancer $1,500–3,000 for a landing or site",
      "Freelancer finished 60–80% and stopped replying",
      "Site works, but without payment integration / forms / CRM",
      "No code access — the freelancer never handed it off",
      "Finding a new freelancer with the same stack — 1–2 months of searching",
    ],
    actionHeading: "What we do",
    action: [
      "Day 1: free audit — what's there, what works, what doesn't",
      "Week 1: rewrite the broken parts, hook up integrations",
      "Weeks 2–4: if the stack is rough, migrate to our custom code",
      "Weeks 4–6: launch + 30 days monitoring",
    ],
    outcomeHeading: "Typical outcome",
    outcome: [
      "Live in 4–6 weeks instead of 1–2 months hunting for a new freelancer",
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
    eyebrow: "/ 09 STRAIGHT TALK",
    heading: (
      <>
        What we <em>don&apos;t do.</em>
      </>
    ),
    sub: "Even for serious projects, we're not for everyone. Here's when we'll say no:",
    items: [
      {
        title: "Sites under $300–800",
        body: "Our minimum is $1,000 for a landing. Physically can't go lower at our quality standard.",
      },
      {
        title: "Launch by tomorrow",
        body: "Our minimum is 1 week even for the simplest landing. If it's urgent, hire a freelancer for the night.",
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
    eyebrow: "/ 10 COST COMPARISON",
    heading: (
      <>
        What&apos;s cheaper: <em>freelancer or studio?</em>
      </>
    ),
    sub: "On paper — freelancer. Over 12 months of ownership, often the opposite. Let's look honestly:",
    headers: { item: "Line item", freelancer: "Freelancer", us: "Code-Site" },
    totalLabel: "Total year 1",
    s1Title: "Scenario 1: Landing for a clinic",
    s1Rows: [
      { item: "Development", freelancer: "$1,500", us: "$3,500" },
      {
        item: "First-year support",
        freelancer: "$50/mo × 12 = $600",
        us: "$0 (included)",
      },
      {
        item: "Critical bug fixes (2/year)",
        freelancer: "$200 + $300 = $500",
        us: "$0 (warranty)",
      },
      {
        item: "SEO retrofit at 6 months",
        freelancer: "$400",
        us: "$0 (done at launch)",
      },
      {
        item: "Disappearance / rebuild risk (15%)",
        freelancer: "$1,500 × 0.15 = $225",
        us: "$0",
      },
    ],
    s1Total: { freelancer: "$3,225", us: "$3,500" },
    s1Verdict: (
      <>
        Difference: $275. That&apos;s the{" "}
        <strong>base risk premium</strong>. By year 2, the freelancer route can
        be 30% more expensive.
      </>
    ),
    s2Title: "Scenario 2: Small-business e-commerce",
    s2Rows: [
      { item: "Development", freelancer: "$4,000", us: "$5,500" },
      { item: "Support", freelancer: "$80/mo × 12 = $960", us: "$0" },
      {
        item: "Integrations (CRM, payment, shipping)",
        freelancer: "$1,200",
        us: "$0 (included)",
      },
      { item: "Bug fixes", freelancer: "$600", us: "$0" },
      {
        item: "Rescue project risk (25% for e-commerce)",
        freelancer: "$4,000 × 0.25 = $1,000",
        us: "$0",
      },
    ],
    s2Total: { freelancer: "$11,760", us: "$5,500" },
    s2Verdict: (
      <>
        Difference: freelancer is <strong>2.1× more expensive</strong> in year
        one on a typical e-commerce build.
      </>
    ),
  },
  faq: {
    eyebrow: "/ 11 FAQ",
    heading: (
      <>
        What people <em>ask most.</em>
      </>
    ),
    items: [
      {
        q: "I worked with a freelancer, they vanished. What now?",
        a: "Free audit, takes a week. We look at the code, the SEO, what's salvageable. We'll propose two options: rescue (keep what works) or full rebuild (faster and cleaner). We'll tell you straight which is cheaper.",
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
        a: "Project doesn't stop. Internal handoff in a day. Your SEO/PM/QA/copywriter stay the same, only the technical contact changes temporarily.",
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
        q: "Is the “12 people” figure including partners?",
        a: "Yes. 4 in the in-house core (in the office), 8 in the vetted partner network we bring in by role. Honest: partners don't sit on your project 8 hours a day, but they own their slice end-to-end.",
      },
      {
        q: "How many account managers do you have?",
        a: "Zero. We decided there shouldn't be layers between client and executor. It means the Tech Lead doesn't always reply instantly (because they're writing code) — but you always know exactly who you're talking to.",
      },
    ],
  },
  cta: {
    eyebrow: "/ 12 READY TO TALK?",
    heading: (
      <>
        Get an estimate <em>in 60 seconds.</em>
      </>
    ),
    sub: "Calculator, no form, real price up front. Or let's talk for 30 minutes — explain the project, we'll tell you if we're a fit or if a freelancer is better.",
    cards: [
      {
        icon: Calendar,
        title: "Project calculator",
        body: "Pick site type and page count — get an estimate in 60 seconds.",
        cta: "Open calculator →",
        href: "/calculator?source=vs-freelancers",
        featured: true,
      },
      {
        icon: MessageCircle,
        title: "30-min consult",
        body: "Zoom with the founder. We'll show real rescue cases and assess your project.",
        cta: "Book now →",
        href: "https://calendly.com/fedirdev",
      },
      {
        icon: Mail,
        title: "Send a brief",
        body: "Detailed form. Describe the project — we'll come back within 4 business hours.",
        cta: "Fill out brief →",
        href: "/contacts",
      },
    ],
  },
};

const CONTENT: Record<VfLocale, Content> = { uk: UK, en: EN };

export function getVsFreelancersContent(locale: VfLocale): Content {
  return CONTENT[locale];
}

/* ─── View ──────────────────────────────────────────────────────────────── */

export function VsFreelancersView({ locale }: { locale: VfLocale }) {
  const c = CONTENT[locale];

  return (
    <>
      <HpHeader />

      <HeroEditorial
        eyebrow={{ label: c.hero.eyebrowLabel }}
        h1Lines={c.hero.h1Lines}
        lede={c.hero.lede}
        features={c.hero.badges}
        ctaPrimaryLabel={c.hero.ctaPrimary}
        ctaSecondaryLabel={c.hero.ctaSecondary}
        ctaSecondaryShowPlay={false}
        showStats={false}
        showTicker={false}
        deviceTags={[
          { kind: "default", primary: "1 freelancer" },
          { kind: "default", primary: "→" },
          { kind: "good", primary: "12 people", mini: "0 ghost" },
        ]}
        deviceMockupSrc="/raw-design/assets/hero-devices.webp"
      />

      {/* 02 — 6 freelancer horror stories */}
      <section className="hp-section">
        <div className="hp-inner">
          <SectionHead
            eyebrow={c.horrorStories.eyebrow}
            heading={c.horrorStories.heading}
            sub={c.horrorStories.sub}
          />
          <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
            {c.horrorStories.items.map((it) => {
              const Icon = it.icon;
              return (
                <div
                  key={it.num}
                  className="border border-line rounded-[18px] p-6 bg-[oklch(0.155_0.005_300)] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-bold tracking-[0.18em] text-[var(--ink-3)]">
                      {it.num}
                    </span>
                    <span className="w-9 h-9 rounded-full inline-flex items-center justify-center bg-[oklch(0.55_0.18_25_/_0.12)] text-[oklch(0.78_0.15_25)] border border-[oklch(0.55_0.18_25_/_0.3)]">
                      <Icon size={16} strokeWidth={1.6} />
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-[17px] tracking-[-0.01em] text-ink">
                    {it.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-[var(--ink-2)]">
                    {it.body}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-8 max-w-[68ch] mx-auto text-center text-[14px] leading-[1.65] text-[var(--ink-2)] [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.horrorStories.foot}
          </p>
        </div>
      </section>

      {/* 03 — When a freelancer is the right choice */}
      <section className="hp-section">
        <div className="hp-inner">
          <SectionHead
            eyebrow={c.rightChoice.eyebrow}
            heading={c.rightChoice.heading}
            sub={c.rightChoice.sub}
          />
          <ul className="list-none flex flex-col gap-3 max-w-[820px] mx-auto">
            {c.rightChoice.items.map((it, i) => (
              <li
                key={i}
                className="flex gap-4 border border-line rounded-[14px] p-5 bg-[oklch(0.13_0.005_300)]"
              >
                <span className="w-7 h-7 shrink-0 rounded-full inline-flex items-center justify-center bg-[oklch(from_var(--accent)_l_c_h_/_0.15)] text-accent-soft border border-[oklch(from_var(--accent)_l_c_h_/_0.3)]">
                  <CheckCircle2 size={15} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display font-bold text-[15px] text-ink mb-1">
                    {it.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-[var(--ink-2)]">
                    {it.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-7 text-center text-[13px] leading-[1.65] text-[var(--ink-3)] max-w-[60ch] mx-auto">
            {c.rightChoice.foot}
          </p>
        </div>
      </section>

      {/* 04 — Side-by-side comparison table */}
      <section className="hp-section" id="compare-table">
        <div className="hp-inner">
          <SectionHead
            eyebrow={c.compare.eyebrow}
            heading={c.compare.heading}
            sub={c.compare.sub}
          />
          <div className="border border-line rounded-[18px] overflow-hidden bg-[oklch(0.155_0.005_300)]">
            <table className="cmp-table">
              <thead>
                <tr>
                  <th>{c.compare.headers.criterion}</th>
                  <th>{c.compare.headers.freelancer}</th>
                  <th className="cmp-th-good">{c.compare.headers.us}</th>
                </tr>
              </thead>
              <tbody>
                {c.compare.rows.map((row, i) => (
                  <tr key={i}>
                    <td
                      className="cmp-td-param"
                      data-label={c.compare.headers.criterion}
                    >
                      {row.criterion}
                    </td>
                    <td
                      className="cmp-td-bad"
                      data-label={c.compare.headers.freelancer}
                    >
                      {row.freelancer}
                    </td>
                    <td
                      className="cmp-td-good"
                      data-label={c.compare.headers.us}
                    >
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 05 — 12 people on your project */}
      <section className="hp-section">
        <div className="hp-inner">
          <SectionHead
            eyebrow={c.team.eyebrow}
            heading={c.team.heading}
            sub={c.team.sub}
          />

          <h3 className="font-display text-[12px] font-bold tracking-[0.16em] uppercase text-accent-soft mb-4 text-center">
            {c.team.coreHeading}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-12 max-[700px]:grid-cols-1">
            {c.team.core.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.role}
                  className="border border-line rounded-[18px] p-6 bg-[oklch(0.155_0.005_300)] flex gap-4 items-start"
                >
                  <span className="w-10 h-10 shrink-0 rounded-full inline-flex items-center justify-center bg-[oklch(from_var(--accent)_l_c_h_/_0.12)] text-accent-soft border border-[oklch(from_var(--accent)_l_c_h_/_0.25)]">
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-[16px] tracking-[-0.01em] text-ink mb-1">
                      {p.role}
                    </h4>
                    <p className="text-[13px] leading-[1.55] text-[var(--ink-2)]">
                      {p.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="font-display text-[12px] font-bold tracking-[0.16em] uppercase text-[var(--ink-3)] mb-4 text-center max-w-[64ch] mx-auto">
            {c.team.partnersHeading}
          </h3>
          <div className="grid grid-cols-4 gap-3 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
            {c.team.partners.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.role}
                  className="border border-line rounded-[14px] p-5 bg-[oklch(0.13_0.005_300)] flex flex-col gap-2"
                >
                  <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-[oklch(0.18_0.005_300)] text-[var(--ink-2)] border border-line">
                    <Icon size={15} strokeWidth={1.6} />
                  </span>
                  <h4 className="font-display font-bold text-[14px] tracking-[-0.01em] text-ink">
                    {p.role}
                  </h4>
                  <p className="text-[12px] leading-[1.5] text-[var(--ink-3)]">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-[13px] leading-[1.65] text-[var(--ink-2)] max-w-[60ch] mx-auto">
            {c.team.foot}
          </p>
        </div>
      </section>

      {/* 06 — What you actually pay for */}
      <section className="hp-section">
        <div className="hp-inner">
          <SectionHead
            eyebrow={c.payFor.eyebrow}
            heading={c.payFor.heading}
            sub={c.payFor.sub}
          />
          <div className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
            {c.payFor.items.map((it) => {
              const Icon = it.icon;
              return (
                <div
                  key={it.num}
                  className="border border-line rounded-[18px] p-6 bg-[oklch(0.155_0.005_300)] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[11px] font-bold tracking-[0.18em] text-[var(--ink-3)]">
                      {it.num}
                    </span>
                    <span className="w-9 h-9 rounded-full inline-flex items-center justify-center bg-[oklch(from_var(--accent)_l_c_h_/_0.12)] text-accent-soft border border-[oklch(from_var(--accent)_l_c_h_/_0.25)]">
                      <Icon size={16} strokeWidth={1.6} />
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-[16px] tracking-[-0.01em] text-ink">
                    {it.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-[var(--ink-2)]">
                    {it.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 07 — After launch (Sanity Studio) */}
      <section className="hp-section">
        <div className="hp-inner">
          <SectionHead
            eyebrow={c.admin.eyebrow}
            heading={c.admin.heading}
            sub={c.admin.sub}
          />

          <div className="grid grid-cols-[1.5fr_1fr] gap-6 mb-12 max-[900px]:grid-cols-1">
            <figure className="m-0 flex flex-col">
              <div className="relative border border-line rounded-[14px] overflow-hidden bg-[oklch(0.13_0.005_300)] aspect-[16/9]">
                <img
                  src="/sanity-studio/admin-desktop.png"
                  alt={c.admin.desktopAlt}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 text-[12px] leading-[1.5] text-[var(--ink-3)] text-center">
                {c.admin.desktopCaption}
              </figcaption>
            </figure>
            <figure className="m-0 flex flex-col">
              <div className="relative border border-line rounded-[14px] overflow-hidden bg-[oklch(0.13_0.005_300)] aspect-[9/16] max-w-[280px] mx-auto w-full">
                <img
                  src="/sanity-studio/admin-mobile.png"
                  alt={c.admin.mobileAlt}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 text-[12px] leading-[1.5] text-[var(--ink-3)] text-center">
                {c.admin.mobileCaption}
              </figcaption>
            </figure>
          </div>

          <h3 className="font-display font-bold text-[clamp(22px,3vw,30px)] tracking-[-0.02em] text-ink mb-6 text-center">
            {c.admin.capabilitiesHeading}
          </h3>
          <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
            {c.admin.capabilities.map((cap) => (
              <div
                key={cap.num}
                className="border border-line rounded-[18px] p-6 bg-[oklch(0.155_0.005_300)] flex flex-col gap-3"
              >
                <span className="font-display text-[11px] font-bold tracking-[0.18em] text-[var(--ink-3)]">
                  {cap.num}
                </span>
                <h4 className="font-display font-bold text-[17px] tracking-[-0.01em] text-ink">
                  {cap.title}
                </h4>
                <p className="text-[13px] leading-[1.55] text-[var(--ink-2)]">
                  {cap.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-[68ch] mx-auto text-center text-[13px] leading-[1.65] text-[var(--ink-2)] [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.admin.foot}
          </p>
        </div>
      </section>

      {/* 08 — Real case (rescue pattern) */}
      <section className="hp-section">
        <div className="hp-inner">
          <SectionHead
            eyebrow={c.caseStudy.eyebrow}
            heading={c.caseStudy.heading}
            sub={c.caseStudy.sub}
          />
          <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-1">
            {[
              { heading: c.caseStudy.situationHeading, items: c.caseStudy.situation, tone: "bad" as const },
              { heading: c.caseStudy.actionHeading, items: c.caseStudy.action, tone: "neutral" as const },
              { heading: c.caseStudy.outcomeHeading, items: c.caseStudy.outcome, tone: "good" as const },
            ].map((col, i) => (
              <div
                key={i}
                className={`border rounded-[18px] p-6 flex flex-col gap-4 ${
                  col.tone === "good"
                    ? "border-[oklch(from_var(--accent)_l_c_h_/_0.3)] bg-[oklch(from_var(--accent)_l_c_h_/_0.06)]"
                    : "border-line bg-[oklch(0.155_0.005_300)]"
                }`}
              >
                <h3
                  className={`font-display text-[12px] font-bold tracking-[0.16em] uppercase ${
                    col.tone === "good" ? "text-accent-soft" : "text-[var(--ink-3)]"
                  }`}
                >
                  {col.heading}
                </h3>
                <ul className="list-none flex flex-col gap-2.5">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex gap-2.5 text-[13px] leading-[1.55] text-[var(--ink-2)]">
                      <span
                        className={`mt-[6px] w-1.5 h-1.5 shrink-0 rounded-full ${
                          col.tone === "good"
                            ? "bg-accent-soft"
                            : col.tone === "bad"
                              ? "bg-[oklch(0.65_0.18_25)]"
                              : "bg-[var(--ink-3)]"
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[68ch] mx-auto text-center text-[14px] leading-[1.65] text-[var(--ink-2)] [&_strong]:text-accent-soft [&_strong]:font-semibold">
            {c.caseStudy.foot}
          </p>
        </div>
      </section>

      {/* 09 — What we don't do */}
      <section className="hp-section">
        <div className="hp-inner">
          <SectionHead
            eyebrow={c.filter.eyebrow}
            heading={c.filter.heading}
            sub={c.filter.sub}
          />
          <ul className="list-none flex flex-col gap-3 max-w-[820px] mx-auto">
            {c.filter.items.map((it, i) => (
              <li
                key={i}
                className="flex gap-4 border border-line rounded-[14px] p-5 bg-[oklch(0.13_0.005_300)]"
              >
                <span className="w-7 h-7 shrink-0 rounded-full inline-flex items-center justify-center bg-[oklch(0.55_0.18_25_/_0.12)] text-[oklch(0.7_0.18_25)] border border-[oklch(0.55_0.18_25_/_0.3)]">
                  <XCircle size={15} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display font-bold text-[15px] text-ink mb-1">
                    {it.title}
                  </h3>
                  <p className="text-[13px] leading-[1.55] text-[var(--ink-2)]">
                    {it.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-7 text-center text-[13px] leading-[1.65] text-[var(--ink-3)] max-w-[60ch] mx-auto">
            {c.filter.foot}
          </p>
        </div>
      </section>

      {/* 10 — TCO comparison (two scenarios) */}
      <section className="hp-section" id="pricing">
        <div className="hp-inner">
          <SectionHead
            eyebrow={c.pricing.eyebrow}
            heading={c.pricing.heading}
            sub={c.pricing.sub}
          />

          {[
            {
              title: c.pricing.s1Title,
              rows: c.pricing.s1Rows,
              total: c.pricing.s1Total,
              verdict: c.pricing.s1Verdict,
            },
            {
              title: c.pricing.s2Title,
              rows: c.pricing.s2Rows,
              total: c.pricing.s2Total,
              verdict: c.pricing.s2Verdict,
            },
          ].map((scenario, idx) => (
            <div key={idx} className={idx === 0 ? "mb-12" : undefined}>
              <h3 className="font-display font-bold text-[clamp(18px,2.4vw,22px)] tracking-[-0.01em] text-ink mb-4">
                {scenario.title}
              </h3>
              <div className="border border-line rounded-[18px] overflow-hidden bg-[oklch(0.155_0.005_300)]">
                <table className="cmp-table">
                  <thead>
                    <tr>
                      <th>{c.pricing.headers.item}</th>
                      <th>{c.pricing.headers.freelancer}</th>
                      <th className="cmp-th-good">{c.pricing.headers.us}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenario.rows.map((row, i) => (
                      <tr key={i}>
                        <td className="cmp-td-param" data-label={c.pricing.headers.item}>
                          {row.item}
                        </td>
                        <td className="cmp-td-bad" data-label={c.pricing.headers.freelancer}>
                          {row.freelancer}
                        </td>
                        <td className="cmp-td-good" data-label={c.pricing.headers.us}>
                          {row.us}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        className="cmp-td-param font-semibold text-ink"
                        data-label={c.pricing.headers.item}
                      >
                        <strong>{c.pricing.totalLabel}</strong>
                      </td>
                      <td className="cmp-td-bad font-semibold" data-label={c.pricing.headers.freelancer}>
                        <strong>{scenario.total.freelancer}</strong>
                      </td>
                      <td className="cmp-td-good font-bold" data-label={c.pricing.headers.us}>
                        <strong>{scenario.total.us}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[13px] leading-[1.65] text-[var(--ink-2)] max-w-[68ch] [&_strong]:text-accent-soft [&_strong]:font-semibold">
                {scenario.verdict}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 11 — FAQ (schema.org FAQPage emitted at the route level) */}
      <FAQ
        heading={
          locale === "en" ? "What people ask most" : "Що питають найчастіше"
        }
        items={c.faq.items.map<FAQItem>((it) => ({
          q: it.q,
          a: [it.a],
        }))}
      />

      {/* 12 — Final CTA */}
      <FinalCta3
        eyebrow={c.cta.eyebrow}
        heading={c.cta.heading}
        sub={c.cta.sub}
        cards={c.cta.cards}
      />

      <Newsletter />
      <HpFooter />
    </>
  );
}
