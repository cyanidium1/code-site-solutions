import type { Locale } from "@/constants/locales";
import type { FAQItem } from "@/types/faq";
import {
  PAYMENT_TERMS,
  SERVICES,
  formatPackagePrice,
  formatPackageTerm,
  industryFloor,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import { LOCALIZED_ROOTS, localizePath } from "@/constants/i18n-routes";
import { DEFAULT_LOCALE, type SecondaryLocale } from "@/constants/locales";

/**
 * `/faq` — the site-wide FAQ hub.
 *
 * Every page already carries its own FAQ block (a clinic asks different
 * questions than a car dealer). This page answers the ones that are the same
 * whatever you are buying: price, timeline, payment, ownership, warranty.
 *
 * Numbers are read from `@/constants/pricing`, never typed into the copy —
 * the whole point of that file is that a price change propagates instead of
 * leaving a stale figure in an answer nobody re-reads. Nothing here states a
 * commitment the offer pages and the contract don't already make.
 */

export type FaqGroup = { id: string; title: string; items: FAQItem[] };

export type FaqPageCopy = {
  metaTitle: string;
  metaDescription: string;
  headingLead: string;
  headingEm: string;
  lede: string;
  tocHeading: string;
  ctaHeading: string;
  ctaSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  breadcrumb: { home: string; faq: string };
  groups: FaqGroup[];
};

/* ─── helpers ────────────────────────────────────────────────────────────── */

/**
 * Link to the locale's own page when it exists, otherwise to the default
 * locale's. Several pages an answer wants to cite are Ukrainian-only — the
 * public contract, support, and the vs-* comparisons on RU — and blindly
 * prefixing the path would hand a RU reader a 404 in the middle of the answer
 * that is meant to reassure them. `LOCALIZED_ROOTS` already knows which
 * top-level routes have a twin, so this reads it rather than a second list.
 */
function href(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  return LOCALIZED_ROOTS[locale as SecondaryLocale].has(path)
    ? localizePath(path, locale)
    : path;
}

function figures(loc: Locale) {
  return {
    landing: formatPackagePrice("landing", loc),
    business: formatPackagePrice("business", loc),
    shop: formatPackagePrice("shop", loc),
    industry: formatPrice(industryFloor(loc), { locale: loc, withPrefix: true }),
    landingTerm: formatPackageTerm("landing", loc),
    businessTerm: formatPackageTerm("business", loc),
    shopTerm: formatPackageTerm("shop", loc),
    industryTerm: formatPackageTerm("industry", loc),
    prepay: `${PAYMENT_TERMS.prepaymentPercent}%`,
    discount: `${PAYMENT_TERMS.fullPrepaymentDiscountPercent}%`,
    penalty: `${PAYMENT_TERMS.latePenaltyPercentPerDay}%`,
    penaltyCap: `${PAYMENT_TERMS.latePenaltyCapPercent}%`,
    instalmentsFrom: formatPrice(PAYMENT_TERMS.instalmentsFrom, { locale: loc }),
    instalments: String(PAYMENT_TERMS.instalmentsCount),
    supportMonths: String(SERVICES.includedSupportMonths),
    hosting: formatPrice(SERVICES.hostingRenewalPerYear, { locale: loc }),
    seoFrom: formatPrice(SERVICES.seoServicesFrom, { locale: loc }),
    auditHours: String(SERVICES.auditResponseHours),
    newPage: `${SERVICES.newPageDays.min}–${SERVICES.newPageDays.max}`,
  };
}

/* ─── UK ─────────────────────────────────────────────────────────────────── */

function ukCopy(): FaqPageCopy {
  const f = figures("uk");
  const p = (path: string) => href(path, "uk");
  return {
    metaTitle: "Часті питання про розробку сайту | Code-Site.Art",
    metaDescription: `Ціни, строки, оплата, договір і гарантія. Сайт для бізнесу — ${f.business} за ${f.businessTerm}. Відповіді на питання, які ставлять до замовлення.`,
    headingLead: "Питання, які ставлять ",
    headingEm: "до замовлення",
    lede: `Ціна, строк, оплата, право на код і гарантія. Якщо відповіді тут немає — напишіть, відповімо за ${f.auditHours} години.`,
    tocHeading: "Розділи",
    ctaHeading: "Не знайшли відповідь?",
    ctaSub: `Безкоштовний прорахунок за ${f.auditHours} години: пакет, ціна і строк під вашу задачу.`,
    ctaPrimary: "Отримати прорахунок",
    ctaSecondary: "Порахувати самостійно",
    breadcrumb: { home: "Головна", faq: "Часті питання" },
    groups: [
      {
        id: "price",
        title: "Ціна",
        items: [
          {
            q: "Скільки коштує сайт?",
            a: [
              `Лендінг — ${f.landing}, сайт для бізнесу — ${f.business}, інтернет-магазин — ${f.shop}, галузеве рішення з інтеграцією — ${f.industry}. Це `,
              { em: "повна вартість" },
              ", не «від». У ",
              { link: { href: p("/pricing"), text: "цінах" } },
              " видно, що входить у кожен пакет, а ",
              { link: { href: p("/calculator"), text: "калькулятор" } },
              " рахує вашу конфігурацію з додатковими опціями.",
            ],
          },
          {
            q: "Чому ціна фіксована, а не «від»?",
            a: [
              "Тому що обсяг пакета описаний до старту: кількість сторінок, інтеграції, хто пише тексти. Ціна і строк ",
              { em: "закріплюються в договорі" },
              " до першого платежу і не змінюються, поки ви не додасте щось поза пакетом — тоді ми називаємо ціну доповнення окремо, і ви вирішуєте.",
            ],
          },
          {
            q: "Що не входить у ціну?",
            a: [
              "Рекламний бюджет, платні підписки третіх сервісів, професійна фотозйомка і закупівля стокових фото, щомісячне SEO-просування (",
              { em: `від ${f.seoFrom} на місяць` },
              "). Усе, що можна додати до пакета, і скільки це коштує, перелічено в ",
              { link: { href: p("/calculator"), text: "калькуляторі" } },
              ".",
            ],
          },
          {
            q: "Скільки коштує сайт після першого року?",
            a: [
              `Хостинг і SSL включені на ${f.supportMonths} місяців. Далі продовження хостингу — ${f.hosting} на рік. Домен ви оплачуєте напряму реєстратору, зазвичай це $10–15 на рік. Більше нічого обов'язкового немає: сайт не має підписки, без якої він перестає працювати.`,
            ],
          },
        ],
      },
      {
        id: "terms",
        title: "Строки",
        items: [
          {
            q: "Скільки часу займає розробка?",
            a: [
              `Лендінг — ${f.landingTerm}, сайт для бізнесу — ${f.businessTerm}, інтернет-магазин — ${f.shopTerm}, галузеве рішення — ${f.industryTerm}. Відлік іде з моменту, коли ми отримали від вас матеріали і передоплату.`,
            ],
          },
          {
            q: "Що буде, якщо ви зірвете строк?",
            a: [
              `У договорі є неустойка: ${f.penalty} від вартості за кожен день прострочки, до ${f.penaltyCap}. Якщо строк зсувається через вас — не відповідаєте на питання, не даєте матеріали — він зсувається на стільки ж днів, і неустойка не діє.`,
            ],
          },
          {
            q: "Чи можна швидше?",
            a: [
              "Так, є опція прискорення: строк скорочується приблизно на 40% за доплату. Але «швидше» має межу — зібрати магазин на 1 000 товарів за три дні не вийде ні за які гроші. Реальний строк ми називаємо у прорахунку.",
            ],
          },
        ],
      },
      {
        id: "payment",
        title: "Оплата і договір",
        items: [
          {
            q: "Як відбувається оплата?",
            a: [
              `Передоплата ${f.prepay}, решта — після того, як ви прийняли роботу. При оплаті всієї суми одразу — знижка ${f.discount}. Пакети від ${f.instalmentsFrom} можна платити в ${f.instalments} етапи.`,
            ],
          },
          {
            q: "Ви працюєте за договором?",
            a: [
              "Так. Договір із фіксованою ціною, строком, обсягом робіт і неустойкою. Умови — у ",
              { link: { href: p("/offer"), text: "публічній оферті" } },
              " і ",
              { link: { href: p("/public-contract"), text: "публічному договорі" } },
              ". Для ФОП і юросіб — закриваючі документи.",
            ],
          },
          {
            q: "Чи можна повернути гроші?",
            a: [
              "Передоплата покриває роботу, яку ми вже зробили: структуру, дизайн, тексти. Якщо ви зупиняєте проєкт на ранньому етапі — повертаємо невитрачену частину, а всі готові матеріали залишаються вам. Умови розриву прописані в договорі, а не вирішуються по ситуації.",
            ],
          },
        ],
      },
      {
        id: "ownership",
        title: "Що ви отримуєте",
        items: [
          {
            q: "Сайт буде моїм?",
            a: [
              "Так. ",
              { em: "Код ваш" },
              " — лежить у вашому GitHub з першого коміту. Домен реєструється на вас. Хостинг — на ваш акаунт. Ви не залежите від нас: будь-який інший розробник зможе продовжити роботу.",
            ],
          },
          {
            q: "Чи зможу я редагувати сайт сам?",
            a: [
              "Так, у пакетах від «Сайту для бізнесу» стоїть ",
              { em: "Sanity CMS" },
              ": тексти, фото, послуги, ціни, статті ви правите самі, навіть з телефона. Показуємо, як це робити, на відео-інструкції після запуску. Лендінг іде без CMS — правки по ньому робимо ми.",
            ],
          },
          {
            q: "Хто пише тексти і робить фото?",
            a: [
              "Базові тексти пишемо ми на основі вашого брифу — це входить у пакет. Можна замовити роботу копірайтера глибше: інтерв'ю, структура під пошукові запити. Фото — ваші, або підбираємо стокові за окрему вартість. Готові тексти від вас теж підходять.",
            ],
          },
          {
            q: "Чи входить SEO?",
            a: [
              "Базове SEO входить у кожен пакет: структура, мета-теги, мікророзмітка, швидкість, sitemap, індексація. Це фундамент, з яким сайт може ранжуватися. Щомісячне просування — окрема послуга, ",
              { em: `від ${f.seoFrom} на місяць` },
              ", деталі на сторінці ",
              { link: { href: p("/seo"), text: "SEO" } },
              ".",
            ],
          },
        ],
      },
      {
        id: "after",
        title: "Після запуску",
        items: [
          {
            q: "Яка гарантія?",
            a: [
              `Гарантія ${f.supportMonths} місяців: помилки, які виникли з нашого боку, виправляємо безкоштовно і без обмеження кількості. Хостинг, SSL і оновлення безпеки на цей рік теж включені.`,
            ],
          },
          {
            q: "Що з підтримкою далі?",
            a: [
              "Після гарантійного року можна залишитися на підтримці: правки, нові сторінки, оновлення. Нова сторінка після запуску займає ",
              { em: `${f.newPage} робочі дні` },
              ". Формати й ціни — на сторінці ",
              { link: { href: p("/support"), text: "підтримки" } },
              ".",
            ],
          },
          {
            q: "Що робити зі старим сайтом?",
            a: [
              "Старий сайт працює до запуску нового. Переносимо контент, налаштовуємо ",
              { em: "301-редиректи" },
              " зі старих URL на нові, зберігаємо мета-теги і мікророзмітку. Так позиції в Google не втрачаються — у цьому й суть окремої опції переносу з WordPress, Tilda чи Wix.",
            ],
          },
        ],
      },
      {
        id: "how",
        title: "Як ми працюємо",
        items: [
          {
            q: "З чого почати?",
            a: [
              "З безкоштовного прорахунку. Ви розповідаєте про бізнес і задачу — ми протягом ",
              { em: `${f.auditHours} годин` },
              " відповідаємо з пакетом, ціною і строком. Прорахунок ні до чого не зобов'язує і залишається вам. Весь порядок робіт описаний на сторінці ",
              { link: { href: p("/process"), text: "процесу" } },
              ".",
            ],
          },
          {
            q: "Чому не конструктор?",
            a: [
              "Конструктор дешевший на старті й дорожчий далі: підписка назавжди, чужий код, обмеження в швидкості й SEO. Ми детально порівняли обидва варіанти з цифрами — ",
              { link: { href: p("/vs-constructors"), text: "сайт на конструкторі проти коду" } },
              " і ",
              { link: { href: p("/vs-wordpress"), text: "WordPress проти коду" } },
              ".",
            ],
          },
          {
            q: "Ви працюєте з клієнтами з інших країн?",
            a: [
              "Так. Для України ціни в доларах, для Європи — окремий прайс у євро. Спілкуємося українською, російською та англійською. Сайт може бути багатомовним і мультивалютним — це додаткова опція в калькуляторі.",
            ],
          },
        ],
      },
    ],
  };
}

/* ─── RU ─────────────────────────────────────────────────────────────────── */

function ruCopy(): FaqPageCopy {
  const f = figures("ru");
  const p = (path: string) => href(path, "ru");
  return {
    metaTitle: "Частые вопросы о разработке сайта | Code-Site.Art",
    metaDescription: `Цены, сроки, оплата, договор и гарантия. Сайт для бизнеса — ${f.business} за ${f.businessTerm}. Ответы на вопросы, которые задают до заказа.`,
    headingLead: "Вопросы, которые задают ",
    headingEm: "до заказа",
    lede: `Цена, срок, оплата, право на код и гарантия. Если ответа здесь нет — напишите, ответим за ${f.auditHours} часа.`,
    tocHeading: "Разделы",
    ctaHeading: "Не нашли ответ?",
    ctaSub: `Бесплатный расчёт за ${f.auditHours} часа: пакет, цена и срок под вашу задачу.`,
    ctaPrimary: "Получить расчёт",
    ctaSecondary: "Посчитать самостоятельно",
    breadcrumb: { home: "Главная", faq: "Частые вопросы" },
    groups: [
      {
        id: "price",
        title: "Цена",
        items: [
          {
            q: "Сколько стоит сайт?",
            a: [
              `Лендинг — ${f.landing}, сайт для бизнеса — ${f.business}, интернет-магазин — ${f.shop}, отраслевое решение с интеграцией — ${f.industry}. Это `,
              { em: "полная стоимость" },
              ", а не «от». В ",
              { link: { href: p("/pricing"), text: "ценах" } },
              " видно, что входит в каждый пакет, а ",
              { link: { href: p("/calculator"), text: "калькулятор" } },
              " считает вашу конфигурацию с дополнительными опциями.",
            ],
          },
          {
            q: "Почему цена фиксированная, а не «от»?",
            a: [
              "Потому что объём пакета описан до старта: количество страниц, интеграции, кто пишет тексты. Цена и срок ",
              { em: "закрепляются в договоре" },
              " до первого платежа и не меняются, пока вы не добавите что-то вне пакета — тогда мы отдельно называем цену дополнения, и вы решаете.",
            ],
          },
          {
            q: "Что не входит в цену?",
            a: [
              "Рекламный бюджет, платные подписки сторонних сервисов, профессиональная фотосъёмка и покупка стоковых фото, ежемесячное SEO-продвижение (",
              { em: `от ${f.seoFrom} в месяц` },
              "). Всё, что можно добавить к пакету, и сколько это стоит, перечислено в ",
              { link: { href: p("/calculator"), text: "калькуляторе" } },
              ".",
            ],
          },
          {
            q: "Сколько стоит сайт после первого года?",
            a: [
              `Хостинг и SSL включены на ${f.supportMonths} месяцев. Дальше продление хостинга — ${f.hosting} в год. Домен вы оплачиваете напрямую регистратору, обычно это $10–15 в год. Больше ничего обязательного нет: у сайта нет подписки, без которой он перестаёт работать.`,
            ],
          },
        ],
      },
      {
        id: "terms",
        title: "Сроки",
        items: [
          {
            q: "Сколько времени занимает разработка?",
            a: [
              `Лендинг — ${f.landingTerm}, сайт для бизнеса — ${f.businessTerm}, интернет-магазин — ${f.shopTerm}, отраслевое решение — ${f.industryTerm}. Отсчёт идёт с момента, когда мы получили от вас материалы и предоплату.`,
            ],
          },
          {
            q: "Что будет, если вы сорвёте срок?",
            a: [
              `В договоре есть неустойка: ${f.penalty} от стоимости за каждый день просрочки, до ${f.penaltyCap}. Если срок сдвигается из-за вас — не отвечаете на вопросы, не даёте материалы — он сдвигается на столько же дней, и неустойка не действует.`,
            ],
          },
          {
            q: "Можно быстрее?",
            a: [
              "Да, есть опция ускорения: срок сокращается примерно на 40% за доплату. Но у «быстрее» есть предел — собрать магазин на 1 000 товаров за три дня не выйдет ни за какие деньги. Реальный срок мы называем в расчёте.",
            ],
          },
        ],
      },
      {
        id: "payment",
        title: "Оплата и договор",
        items: [
          {
            q: "Как происходит оплата?",
            a: [
              `Предоплата ${f.prepay}, остальное — после того, как вы приняли работу. При оплате всей суммы сразу — скидка ${f.discount}. Пакеты от ${f.instalmentsFrom} можно платить в ${f.instalments} этапа.`,
            ],
          },
          {
            q: "Вы работаете по договору?",
            a: [
              "Да. Договор с фиксированной ценой, сроком, объёмом работ и неустойкой. Условия — в ",
              { link: { href: p("/offer"), text: "публичной оферте" } },
              " и ",
              { link: { href: p("/public-contract"), text: "публичном договоре" } },
              ". Для ФЛП и юрлиц — закрывающие документы.",
            ],
          },
          {
            q: "Можно вернуть деньги?",
            a: [
              "Предоплата покрывает работу, которую мы уже сделали: структуру, дизайн, тексты. Если вы останавливаете проект на раннем этапе — возвращаем неизрасходованную часть, а все готовые материалы остаются вам. Условия расторжения прописаны в договоре, а не решаются по ситуации.",
            ],
          },
        ],
      },
      {
        id: "ownership",
        title: "Что вы получаете",
        items: [
          {
            q: "Сайт будет моим?",
            a: [
              "Да. ",
              { em: "Код ваш" },
              " — лежит в вашем GitHub с первого коммита. Домен регистрируется на вас. Хостинг — на ваш аккаунт. Вы не зависите от нас: любой другой разработчик сможет продолжить работу.",
            ],
          },
          {
            q: "Смогу ли я редактировать сайт сам?",
            a: [
              "Да, в пакетах от «Сайта для бизнеса» стоит ",
              { em: "Sanity CMS" },
              ": тексты, фото, услуги, цены, статьи вы правите сами, даже с телефона. Показываем, как это делать, в видео-инструкции после запуска. Лендинг идёт без CMS — правки по нему делаем мы.",
            ],
          },
          {
            q: "Кто пишет тексты и делает фото?",
            a: [
              "Базовые тексты пишем мы на основе вашего брифа — это входит в пакет. Можно заказать работу копирайтера глубже: интервью, структура под поисковые запросы. Фото — ваши, или подбираем стоковые за отдельную стоимость. Готовые тексты от вас тоже подходят.",
            ],
          },
          {
            q: "Входит ли SEO?",
            a: [
              "Базовое SEO входит в каждый пакет: структура, мета-теги, микроразметка, скорость, sitemap, индексация. Это фундамент, с которым сайт может ранжироваться. Ежемесячное продвижение — отдельная услуга, ",
              { em: `от ${f.seoFrom} в месяц` },
              ", детали на странице ",
              { link: { href: p("/seo"), text: "SEO" } },
              ".",
            ],
          },
        ],
      },
      {
        id: "after",
        title: "После запуска",
        items: [
          {
            q: "Какая гарантия?",
            a: [
              `Гарантия ${f.supportMonths} месяцев: ошибки, возникшие с нашей стороны, исправляем бесплатно и без ограничения количества. Хостинг, SSL и обновления безопасности на этот год тоже включены.`,
            ],
          },
          {
            q: "Что с поддержкой дальше?",
            a: [
              "После гарантийного года можно остаться на поддержке: правки, новые страницы, обновления. Новая страница после запуска занимает ",
              { em: `${f.newPage} рабочих дня` },
              ". Форматы и цены — на странице ",
              { link: { href: p("/support"), text: "поддержки" } },
              ".",
            ],
          },
          {
            q: "Что делать со старым сайтом?",
            a: [
              "Старый сайт работает до запуска нового. Переносим контент, настраиваем ",
              { em: "301-редиректы" },
              " со старых URL на новые, сохраняем мета-теги и микроразметку. Так позиции в Google не теряются — в этом и смысл отдельной опции переноса с WordPress, Tilda или Wix.",
            ],
          },
        ],
      },
      {
        id: "how",
        title: "Как мы работаем",
        items: [
          {
            q: "С чего начать?",
            a: [
              "С бесплатного расчёта. Вы рассказываете о бизнесе и задаче — мы в течение ",
              { em: `${f.auditHours} часов` },
              " отвечаем с пакетом, ценой и сроком. Расчёт ни к чему не обязывает и остаётся вам. Весь порядок работ описан на странице ",
              { link: { href: p("/process"), text: "процесса" } },
              ".",
            ],
          },
          {
            q: "Почему не конструктор?",
            a: [
              "Конструктор дешевле на старте и дороже дальше: подписка навсегда, чужой код, ограничения в скорости и SEO. Мы подробно сравнили оба варианта с цифрами — ",
              { link: { href: p("/vs-constructors"), text: "сайт на конструкторе против кода" } },
              " и ",
              { link: { href: p("/vs-wordpress"), text: "WordPress против кода" } },
              ".",
            ],
          },
          {
            q: "Вы работаете с клиентами из других стран?",
            a: [
              "Да. Для Украины цены в долларах, для Европы — отдельный прайс в евро. Общаемся на украинском, русском и английском. Сайт может быть многоязычным и мультивалютным — это дополнительная опция в калькуляторе.",
            ],
          },
        ],
      },
    ],
  };
}

/* ─── EN ─────────────────────────────────────────────────────────────────── */

function enCopy(): FaqPageCopy {
  const f = figures("en");
  const p = (path: string) => href(path, "en");
  return {
    metaTitle: "Website development FAQ | Code-Site.Art",
    metaDescription: `Prices, timelines, payment, contract and warranty. A business website is ${f.business} in ${f.businessTerm}. The questions clients ask before they order.`,
    headingLead: "The questions clients ask ",
    headingEm: "before they order",
    lede: `Price, timeline, payment, who owns the code, and the warranty. If your question isn't here, write to us — we answer within ${f.auditHours} hours.`,
    tocHeading: "Sections",
    ctaHeading: "Didn't find your answer?",
    ctaSub: `A free quote within ${f.auditHours} hours: the package, the price and the timeline for your project.`,
    ctaPrimary: "Get a quote",
    ctaSecondary: "Work it out yourself",
    breadcrumb: { home: "Home", faq: "FAQ" },
    groups: [
      {
        id: "price",
        title: "Price",
        items: [
          {
            q: "How much does a website cost?",
            a: [
              `A landing page is ${f.landing}, a business website ${f.business}, an online shop ${f.shop}, and an industry build with an integration ${f.industry}. That is the `,
              { em: "full price" },
              ", not a starting point. ",
              { link: { href: p("/pricing"), text: "Pricing" } },
              " shows what each package contains, and the ",
              { link: { href: p("/calculator"), text: "calculator" } },
              " prices your own configuration with the add-ons.",
            ],
          },
          {
            q: "Why is the price fixed rather than an estimate?",
            a: [
              "Because the scope is written down before we start: how many pages, which integrations, who writes the copy. The price and the timeline are ",
              { em: "fixed in the contract" },
              " before the first payment and do not move unless you add something outside the package — then we quote that addition separately and you decide.",
            ],
          },
          {
            q: "What is not included?",
            a: [
              "Ad spend, paid third-party subscriptions, professional photography and stock photo licences, and monthly SEO retainers (",
              { em: `from ${f.seoFrom} a month` },
              "). Everything that can be added to a package, and what it costs, is listed in the ",
              { link: { href: p("/calculator"), text: "calculator" } },
              ".",
            ],
          },
          {
            q: "What does the site cost after the first year?",
            a: [
              `Hosting and SSL are included for ${f.supportMonths} months. After that, hosting renewal is ${f.hosting} a year. You pay for the domain directly to the registrar, usually €10–15 a year. Nothing else is mandatory: there is no subscription the site stops working without.`,
            ],
          },
        ],
      },
      {
        id: "terms",
        title: "Timelines",
        items: [
          {
            q: "How long does it take?",
            a: [
              `A landing page takes ${f.landingTerm}, a business website ${f.businessTerm}, an online shop ${f.shopTerm}, and an industry build ${f.industryTerm}. The clock starts when we have your materials and the deposit.`,
            ],
          },
          {
            q: "What happens if you miss the deadline?",
            a: [
              `The contract carries a penalty: ${f.penalty} of the project price for every day late, up to ${f.penaltyCap}. If the delay is on your side — unanswered questions, missing materials — the deadline moves by the same number of days and the penalty does not apply.`,
            ],
          },
          {
            q: "Can it be faster?",
            a: [
              "Yes, there is a rush option that cuts roughly 40% off the timeline for a surcharge. But faster has a floor — no budget builds a 1,000-product shop in three days. We quote the real timeline up front.",
            ],
          },
        ],
      },
      {
        id: "payment",
        title: "Payment and contract",
        items: [
          {
            q: "How does payment work?",
            a: [
              `A ${f.prepay} deposit, the balance once you have accepted the work. Pay in full up front and you get ${f.discount} off. Packages from ${f.instalmentsFrom} can be paid in ${f.instalments} instalments.`,
            ],
          },
          {
            q: "Do you work under a contract?",
            a: [
              "Yes. A contract with a fixed price, a deadline, a defined scope and a late penalty. The terms are in our ",
              { link: { href: p("/offer"), text: "public offer" } },
              ". Invoices and closing documents are issued for companies.",
            ],
          },
          {
            q: "Can I get a refund?",
            a: [
              "The deposit covers work already done: structure, design, copy. If you stop the project early we return the unspent part, and everything finished so far is yours to keep. Termination is written into the contract rather than settled case by case.",
            ],
          },
        ],
      },
      {
        id: "ownership",
        title: "What you get",
        items: [
          {
            q: "Will I own the site?",
            a: [
              "Yes. ",
              { em: "The code is yours" },
              " — it sits in your GitHub from the first commit. The domain is registered to you. Hosting runs on your account. You are not locked to us: any other developer can pick the project up.",
            ],
          },
          {
            q: "Can I edit the site myself?",
            a: [
              "Yes. From the business package up, the site ships with ",
              { em: "Sanity CMS" },
              ": copy, photos, services, prices and articles are yours to edit, from a phone if you want. We record a walkthrough at launch. A landing page ships without a CMS — we make the edits on it.",
            ],
          },
          {
            q: "Who writes the copy and provides photos?",
            a: [
              "We write the base copy from your brief — that is in the package. Deeper copywriting is available as an add-on: interviews, structure built around search demand. Photos are yours, or we licence stock for a fee. Copy you already have works too.",
            ],
          },
          {
            q: "Is SEO included?",
            a: [
              "Technical SEO is in every package: structure, meta tags, structured data, speed, sitemap, indexing. That is the foundation a site needs to rank at all. Ongoing promotion is a separate service, ",
              { em: `from ${f.seoFrom} a month` },
              " — details on the ",
              { link: { href: p("/seo"), text: "SEO page" } },
              ".",
            ],
          },
        ],
      },
      {
        id: "after",
        title: "After launch",
        items: [
          {
            q: "What is the warranty?",
            a: [
              `${f.supportMonths} months: anything that broke on our side we fix for free, with no cap on how many times. Hosting, SSL and security updates for that year are included too.`,
            ],
          },
          {
            q: "What about support after that?",
            a: [
              "After the warranty year you can stay on support: edits, new pages, updates. A new page after launch takes ",
              { em: `${f.newPage} working days` },
              ". Formats and prices are on the ",
              { link: { href: p("/support"), text: "support page" } },
              ".",
            ],
          },
          {
            q: "What happens to my old site?",
            a: [
              "The old site keeps running until the new one launches. We move the content, set up ",
              { em: "301 redirects" },
              " from the old URLs to the new ones, and carry over meta tags and structured data, so Google rankings survive the move. That is the point of the separate migration option for WordPress, Wix and Squarespace.",
            ],
          },
        ],
      },
      {
        id: "how",
        title: "How we work",
        items: [
          {
            q: "How do we start?",
            a: [
              "With a free quote. You describe the business and the job; within ",
              { em: `${f.auditHours} hours` },
              " we reply with a package, a price and a timeline. The quote commits you to nothing and is yours to keep. The full order of work is on the ",
              { link: { href: p("/process"), text: "process page" } },
              ".",
            ],
          },
          {
            q: "Why not a site builder?",
            a: [
              "A builder is cheaper to start and dearer to keep: a subscription forever, code you don't own, limits on speed and SEO. We compared both with numbers — ",
              { link: { href: p("/vs-constructors"), text: "builders versus code" } },
              " and ",
              { link: { href: p("/vs-wordpress"), text: "WordPress versus code" } },
              ".",
            ],
          },
          {
            q: "Do you work with clients abroad?",
            a: [
              "Yes. Ukraine is priced in dollars, Europe has its own price list in euros. We work in English, Ukrainian and Russian. The site can be multilingual and multi-currency — an add-on in the calculator.",
            ],
          },
        ],
      },
    ],
  };
}

export const FAQ_PAGE_COPY: Record<Locale, FaqPageCopy> = {
  uk: ukCopy(),
  ru: ruCopy(),
  en: enCopy(),
};

/** Flat list for the FAQPage JSON-LD node. */
export function faqPageItems(locale: Locale): FAQItem[] {
  return FAQ_PAGE_COPY[locale].groups.flatMap((g) => g.items);
}
