# Structured data / Schema.org — code-site.art

Дата: 2026-08-23. Источник — живой сайт `https://www.code-site.art`, все 3 локали.
Инструменты: `render_page.py --json-ld-output` (валидность, полные графы) на выборке из
~20 страниц (главная ×3 локали, /pricing ×2, /process, /contacts, /vs-wordpress, /seo,
3 статьи блога, 2 кейса портфолио, 2 отраслевые /sites-for), плюс чтение
`src/lib/shared/jsonld.ts` и шаблонов страниц как первоисточника поведения на
оставшихся ~190 URL. Полная инвентаризация по всем 208 URL (без битого JSON, без
страниц без JSON-LD) от координатора аудита:

| @type | Count | Комментарий |
|---|---|---|
| DefinedTerm | 384 | глоссарий, инлайн на каждой статье блога |
| BreadcrumbList | 205 | почти на каждой странице |
| ItemPage | 141 | WebPage-тип для блога/кейсов |
| Article | 141 | блог + кейсы портфолио |
| **FAQPage** | **119** | ua 43 / en 41 / ru 35 — см. находку №1 |
| WebPage | 56 | |
| Review | 54 | testimonials на главной, кейсах, sites-for — см. находку №3 |
| Service | 47 | pricing / process / sites-for / vs-wordpress / seo |
| CollectionPage | 6 | |
| Organization | 5 | эмиттится только на нескольких страницах (по дизайну — единый @id) |
| WebSite | 3 | по одной на локаль |
| Blog | 3 | |
| ContactPage | 3 | |
| AboutPage | 2 | |
| Person | 2 | @id-сущности (основатель на /about; связанные ссылки с кейсов) |
| **HowTo** | **1** | /process — см. находку №2 |

Все проверенные блоки — валидный JSON-LD, `@context: "https://schema.org"`, абсолютные
URL, ISO 8601 в датах. Формат — везде JSON-LD (ни Microdata, ни RDFa не найдено).

## Что уже сделано правильно

- **Единый граф через `@id`.** `Organization` эмиттится с постоянным
  `@id: https://www.code-site.art/#organization` на всех локалях (подтверждено
  побайтово на / , /en, /ru — узел идентичен). `Article.publisher`, `Service.provider`,
  `Review.itemReviewed` (кроме кейсов, см. находку №5) ссылаются на этот `@id`, а не
  дублируют сущность. Источник: `src/lib/shared/jsonld.ts` (`ORG_ID` единая константа).
- **`WebSite`/`WebPage` корректно скоупятся по локали** — `/#website` (uk),
  `/en#website`, `/ru#website`; `WebPage.@id` аналогично. Коллизий `@id` между
  локалями не найдено ни на одной из проверенных пар.
- **`Person` для основателя связан по `@id`.** `/about` определяет
  `https://www.code-site.art/about#fedir-alpatov` (`src/app/(uk)/about/page.tsx:48,70`),
  кейсы портфолио ссылаются на этот же `@id` в `Article.author` — не оборванная ссылка.
- **`Organization` содержит полные реквизиты**: `logo` (ImageObject 512×512),
  `foundingDate`, `foundingLocation`, `numberOfEmployees`, `email`, два `contactPoint`
  (телефон + `availableLanguage`), `address`, `sameAs` (5 профилей), `areaServed`
  (корректный ISO-код `GB`, не `UK`), `knowsAbout`.
- **`Article` на блоге в целом полный**: `headline`, `description`, `datePublished`/
  `dateModified` в ISO 8601, `author.name`+`jobTitle`+`url`, `publisher` со ссылкой на
  Organization, `inLanguage`, `mainEntityOfPage`. Пример живой: `/blog/seo-audyt-svoimy-rukamy`.
- **`BreadcrumbList`** почти повсеместно (205 инстансов), формат `item` — абсолютный URL
  (валидный вариант по документации Google).
- **`Offer`/`OfferCatalog` на коммерческих страницах уже есть** — `/pricing`,
  `/vs-wordpress`, `/sites-for/*` эмиттят `Service.hasOfferCatalog` (или `Service.offers`)
  с 3 ценовыми уровнями каждый, `price`+`priceCurrency` заполнены реальными числами
  (не плейсхолдер), валюта локализована (`USD` на uk/ru-рынок, `GBP` на en/UK-рынок).
  Это правильный паттерн для差ференцированных пакетов услуг (не `AggregateOffer` — тот
  предназначен для вариаций одного товара, здесь уместнее `OfferCatalog`).
- **FAQ-контент визуально совпадает с разметкой** (проверено в коде, не только по факту
  наличия тега): `blog-post-page/index.tsx` строит `FAQPage.mainEntity` и видимый
  `<FAQ items={faqItems}>` из одного и того же массива `post.faq` — то есть здесь нет
  нарушения "разметка без видимого контента". Тот же паттерн общего компонента `<FAQ>`
  используется на pricing/process/contacts/sites-for/vs-wordpress/seo.
- **Устаревшие типы почти отсутствуют**: `ClaimReview`, `VehicleListing`,
  `SpecialAnnouncement`, `EstimatedSalary`, `CourseInfo`/`LearningVideo` — не найдены
  нигде. Единственное исключение — `HowTo` (1 инстанс, находка №2).

## Находки

`Critical/High/Medium/Low | заголовок | доказательство | исправление`

**High | `/ru/pricing` отдаёт 404, хотя числится в `sitemap-ru.xml` — для ru-аудитории вся Offer/Service-разметка цен физически отсутствует**
Доказательство: live-фетч `https://www.code-site.art/ru/pricing` → `status_code: 404`,
`structured_data.block_count: 0`. В репозитории (ветка `master`) у `src/app/(ru)/ru/`
вообще нет каталога `pricing/` (есть только `about`-эквивалента тоже нет, `vs-wordpress`,
`vs-constructors`, `vs-freelancers`, `cookies` — тоже отсутствуют), при этом `en` и `uk`
эти роуты имеют. Совпадает с уже известной асимметрией локалей из `_AUDIT-CONTEXT.md`
("vs-wordpress… нет" для ru), но конкретно `/ru/pricing` в контексте не был перечислен и
не должен быть в `sitemap-ru.xml`, если страницы нет.
Исправление: либо восстановить `/ru/pricing` (роут + переводы + Service/Offer JSON-LD
по образцу uk/en), либо убрать `/ru/pricing` из `sitemap-ru.xml` до готовности —
сейчас это 404 в сайтмапе, снижает доверие к карте целиком (пересекается с
категорией индексации, но обнаружено в рамках проверки Offer-разметки).

**High | `Review.itemReviewed` на страницах кейсов портфолио указывает на сам `Article`, а не на бизнес — семантически неверно и вне поддерживаемых Google типов**
Доказательство: live `/portfolio/bravo` →
`Review.itemReviewed.@id = "https://www.code-site.art/portfolio/bravo#article"`
(отзыв "Сайт супер! Дякуємо…" формально помечен как отзыв о статье, а не о сайте/услуге).
Источник бага — `src/components/case-page/index.tsx`, `buildCaseJsonLd()`:
`buildReviewNodes(reviewSeeds, \`${url}#article\`)` — захардкожено для всех кейсов
(≈26 кейсов × 3 локали). Для сравнения — `src/components/industry-page/index.tsx`
делает это правильно: там `Review.itemReviewed` указывает на `ORG_ID`
(подтверждено live на `/sites-for/medicine`).
Исправление: в `case-page/index.tsx` заменить `\`${url}#article\`` на `ORG_ID` (импорт уже
есть в файле), как это уже сделано в `industry-page/index.tsx`. Один диф, чинит все кейсы
разом.

**Medium-High | 54 инстанса `Review` — self-serving-отзывы о собственной студии на её же сайте, авторы не верифицированы**
Доказательство: главная (3 локали), кейсы портфолио, `/sites-for/*` — все `Review.author`
это голый `{"@type":"Person","name":"…"}` без `@id`/`url`/`sameAs`; из общего пула
уникальных `@id`-сущностей `Person` на сайте — только 2 (основатель + ещё одна
привязанная). Отзывы, соответственно, не верифицируемы третьей стороной и
размещены самим бизнесом о самом себе — это ровно тот кейс, который Google
описывает как "self-serving reviews" и не показывает под них rich results (звёзды/
рейтинг), независимо от технической правильности разметки.
Исправление: не тратить силы на попытки "починить" это до состояния, дающего звёзды в
выдаче — self-serving `Review`/`AggregateRating` не покажутся в SERP ни при какой
доработке разметки. Если цель — легитимный рейтинг в поиске, нужен сторонний источник
(Google Business Profile, Clutch, Trustpilot) с последующей агрегацией. Если цель —
GEO/AI-цитируемость, оставить как есть — этого достаточно (эффект неподтверждён, но и
вреда нет, пока контент отзывов реален и виден на странице).

**Info | `FAQPage` на 119 страницах (ua 43 / en 41 / ru 35) — rich-результат отменён Google 7 мая 2026 для всех сайтов, не только gov/health**
Доказательство: `grep FAQPage` находит паттерн на pricing/process/contacts/
sites-for/vs-wordpress/seo/каждой статье блога; live-подтверждено на `/pricing`,
`/process`, `/contacts`, `/vs-wordpress`, `/seo`, `/sites-for/medicine`,
`/sites-for/ecommerce`, 3 статьях блога. Контент вопрос-ответ везде виден на странице
(общий компонент `<FAQ>`, тот же массив данных, что и в JSON-LD) — нарушения
"невидимый контент под разметку" нет.
Исправление: ничего срочного. Это не штраф и не техдолг, требующий немедленного
вмешательства — просто больше нет SERP-эффекта. При следующей переработке шаблонов
можно перестать эмиттить `@type: FAQPage` конкретно (оставить блок как обычный
видимый контент без разметки) — так масштаб авто-генерируемого JSON-LD слегка
уменьшится, но менять сейчас 119 страниц целенаправленно ради этого — не приоритет.

**High | HowTo/HowToStep на `/process` — rich-результат снят с сентября 2023, разметка сейчас ничего не даёт в выдаче**
Доказательство: live `/process` → `@type: "HowTo"`, `@id: ".../process#howto"`,
`totalTime: "P10W"`, 7 вложенных `HowToStep` (Бриф → Договір → Дизайн → Розробка →
Тестування → Запуск → Підтримка). JSON валиден, но тип полностью выведен из выдачи
Google почти 3 года назад.
Исправление: убрать узел `HowTo`/`HowToStep` из JSON-LD-билдера `/process` (во всех
локалях). Видимую вёрстку менять не нужно — только сам граф. Ранжирующего эффекта
разметка всё равно не давала; если хочется сохранить машиночитаемую структуру шагов
для AI-агентов, можно оставить как обычный `ItemList` (не устаревший тип), но это уже
дополнительная задача, а не обязательная замена.

**High | `Article.image` отсутствует — обязательное поле для Article/BlogPosting — системно на всех кейсах портфолио, частично на статьях блога**
Доказательство: live-проверка `image`: `/blog/seo-audyt-svoimy-rukamy` → `null`,
`/en/blog/medical-website-seo-guide` → `null`, `/portfolio/co2lab` → `null`,
`/portfolio/bravo` → `null`; для сравнения `/blog/vartist-rozrobky-saytu-2026` → корректный
абсолютный URL с Sanity CDN. На блоге проблема зависит от заполненности CMS-поля
(`ogImage`/cover) — не 100% страниц. На кейсах — 100%: в
`src/components/case-page/index.tsx`, `buildCaseJsonLd()` узел `Article` вообще не
содержит свойства `image`, хотя у каждого кейса есть `doc.hero.heroImage`
(рендерится в видимом hero прямо на странице).
Исправление для кейсов (готовый диф ниже) — добавить `image` в `Article`, взяв
`doc.hero.heroImage` через уже используемый в проекте хелпер `sanityCdn`. Для блога —
обязать/проверить заполнение `ogImage` или cover-изображения в CMS у постов без
`image` в выдаче.

**Medium | На `/pricing` (uk и en) `Service.name` и `OfferCatalog.name` захардкожены по-английски вне зависимости от локали**
Доказательство: live `/pricing` (uk-UA, `inLanguage: "uk-UA"`) →
`Service.name: "Custom website development"`,
`Service.hasOfferCatalog.name: "Code-Site.Art pricing tiers"` — при этом все соседние
строки на той же странице (`WebPage.name`, `Service.description`, `Offer.name`:
"Лендінг"/"Корпоративний сайт"/"Кастомна платформа") корректно на украинском. Источник:
`src/app/(uk)/pricing/page.tsx:83,90` и `src/app/(en)/en/pricing/page.tsx:87,94` — обе
локали буквально содержат одну и ту же английскую строку в коде.
Исправление: локализовать оба поля. Для uk: `name: "Розробка кастомних сайтів"`,
`hasOfferCatalog.name: "Тарифи Code-Site.Art"`. En уже корректен по смыслу (сайт
на английском), можно оставить. Для ru — добавить localized-версии при восстановлении
`/ru/pricing` (см. находку про 404).

**Low | `inLanguage` для ru — без региона ("ru"), тогда как uk/en используют полный тег**
Доказательство: live `/ru` → `WebSite.inLanguage: "ru"`, `/` → `"uk-UA"`, `/en` →
`"en-GB"`. Все три значения валидны по BCP-47 сами по себе, но непоследовательны
между собой.
Исправление: для консистентности явно выбрать региональный вариант, например `"ru"` →
оставить (нейтральный, международный) или `"ru-UA"`, если целевая аудитория —
русскоязычные пользователи в зоне обслуживания сайта. Не критично, косметика.

**Low | `AggregateRating` отсутствует полностью — уже осознанно отложено**
Доказательство: `src/lib/shared/jsonld.ts:123-127`, явный `TODO(google-business-profile)`
с закомментированным блоком `aggregateRating`, ждущим реального источника (Google
Business Profile). Подтверждаю: решение верное — не публиковать `aggregateRating` без
реального стороннего источника рейтинга. Добавлять сейчас не нужно.
Исправление: не трогать до появления GBP. Когда появится — брать реальные `ratingValue`/
`reviewCount` из GBP API, не из локальных 3 отзывов на главной (это и есть self-serving
риск из находки выше).

## Итоговая оценка: 64 / 100

Архитектура графа (единые `@id` для Organization/WebSite, отсутствие дублей одного типа
на странице, отсутствие большинства устаревших типов, валидный JSON везде, честный
подход к `AggregateRating`) — сильная сторона. Но есть 3 находки High-уровня с реальным
техническим ущербом (сломанная `Review.itemReviewed` на всех кейсах, отсутствующий
`Article.image` на кейсах и части блога, мёртвый `HowTo`), плюс сломанная страница
`/ru/pricing`, которую сайтмап выдаёт за живую. Ни одна находка не блокирует индексацию
целиком, поэтому не Critical, но в сумме — заметный технический долг, не только
"желательные" улучшения.

---

## Готовые к внедрению JSON-LD / дифы

### 1. Исправить `Review.itemReviewed` на страницах кейсов

Файл: `src/components/case-page/index.tsx`, внутри `buildCaseJsonLd()`.

```diff
- const reviews = buildReviewNodes(reviewSeeds, `${url}#article`);
+ const reviews = buildReviewNodes(reviewSeeds, ORG_ID);
```

`ORG_ID` уже импортирован в файле (`import { ORG_ID, pageUrl } from "@/constants/site";`).
После правки живой пример для `/portfolio/bravo` будет выглядеть так:

```json
{
  "@type": "Review",
  "itemReviewed": { "@id": "https://www.code-site.art/#organization" },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5",
    "worstRating": "1"
  },
  "reviewBody": "Сайт супер! Дякуємо\nНапишіть мені, і я нагодую вас найсмачнішою шаурмою за наш рахунок!",
  "author": { "@type": "Person", "name": "Альона" },
  "datePublished": "2026-05-26"
}
```

### 2. Добавить `image` в `Article` на кейсах портфолио

Файл: `src/components/case-page/index.tsx`, `buildCaseJsonLd()` — узел `Article`
сейчас не содержит `image`. Добавить (используя уже импортированный в проекте
`sanityCdn`, как это сделано в `blog-post-page/index.tsx`):

```diff
+ import { sanityCdn } from "@/lib/shared/sanity-cdn";
  ...
+ const heroImageUrl = doc.hero?.heroImage?.asset?.url
+   ? sanityCdn(doc.hero.heroImage.asset.url, { w: 1200, q: 70 })
+   : undefined;
  ...
  {
    "@type": "Article",
    "@id": `${url}#article`,
    url,
    headline: title,
    description,
    inLanguage: LOCALE_CONFIG[locale].bcp47,
    datePublished: doc.date ?? `${doc.year ?? new Date().getFullYear()}-01-01`,
+   image: heroImageUrl ? [heroImageUrl] : undefined,
    author: { ... },
    publisher: { ... },
  },
```

### 3. Убрать `HowTo`/`HowToStep` с `/process` (все локали)

Найти билдер JSON-LD для `/process` (используется во всех трёх `.../process/page.tsx`)
и удалить узел с `@type: "HowTo"` из массива, передаваемого в `buildJsonLd([...])`.
Видимую вёрстку (7 шагов на странице) не трогать — только граф. Если позже понадобится
машиночитаемая структура шагов для AI-краулеров, использовать вместо `HowTo` обычный
`ItemList` (не входит в список устаревших типов):

```json
{
  "@type": "ItemList",
  "@id": "https://www.code-site.art/process#steps",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Бриф", "description": "30-хв дзвінок або Telegram-чат. Розбираємо задачу, цілі, аудиторію, бюджет, термін, референси." },
    { "@type": "ListItem", "position": 2, "name": "Договір і передоплата", "description": "Договір і передоплата — 1-3 дні" },
    { "@type": "ListItem", "position": 3, "name": "Дизайн", "description": "Дизайн — 1-2 тижні" },
    { "@type": "ListItem", "position": 4, "name": "Розробка", "description": "Розробка — 2-6 тижнів" },
    { "@type": "ListItem", "position": 5, "name": "Тестування", "description": "Тестування — 1 тиждень" },
    { "@type": "ListItem", "position": 6, "name": "Запуск", "description": "Запуск — 1 день" },
    { "@type": "ListItem", "position": 7, "name": "Підтримка", "description": "Підтримка — + 1 рік (включено)" }
  ]
}
```
(Опционально — только если сохранение структуры важно для AI-цитируемости; ранжирующего
эффекта в Google Search это не даёт, см. Core Rules.)

### 4. Локализовать `Service.name` / `OfferCatalog.name` на `/pricing` (uk)

Файл: `src/app/(uk)/pricing/page.tsx`, строки 83 и 90.

```diff
  {
    "@type": "Service",
    "@id": "https://www.code-site.art/pricing#service",
-   name: "Custom website development",
+   name: "Розробка кастомних сайтів",
    description: "Custom-coded сайти на Next.js: лендинги, корпоративні сайти, спеціалізовані під галузь рішення, enterprise-платформи.",
    provider: { "@id": ORG_ID },
    areaServed: ["UA", "EU", "US", "DK"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
-     name: "Code-Site.Art pricing tiers",
+     name: "Тарифи Code-Site.Art",
      itemListElement: [ /* без изменений — уже локализовано */ ]
    }
  }
```

### 5. Пример готового `Offer`/`OfferCatalog` для `/ru/pricing` (когда страница будет восстановлена)

Данные — реальные значения с других локалей (валюта как на uk-версии, `$`, целевая
аудитория — не Великобритания), не плейсхолдеры:

```json
{
  "@type": "Service",
  "@id": "https://www.code-site.art/ru/pricing#service",
  "name": "Разработка кастомных сайтов",
  "description": "Custom-coded сайты на Next.js: лендинги, корпоративные сайты, специализированные под отрасль решения, enterprise-платформы.",
  "provider": { "@id": "https://www.code-site.art/#organization" },
  "areaServed": ["UA", "EU", "US", "DK"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Тарифы Code-Site.Art",
    "itemListElement": [
      { "@type": "Offer", "name": "Лендинг", "price": "800", "priceCurrency": "USD", "url": "https://www.code-site.art/ru/pricing" },
      { "@type": "Offer", "name": "Корпоративный сайт", "price": "3500", "priceCurrency": "USD", "url": "https://www.code-site.art/ru/pricing" },
      { "@type": "Offer", "name": "Кастомная платформа", "price": "6000", "priceCurrency": "USD", "url": "https://www.code-site.art/ru/pricing" }
    ]
  }
}
```

Дополнить `WebPage`/`BreadcrumbList` по тому же шаблону, что и `/pricing` (uk) и
`/en/pricing`, с `inLanguage: "ru"` и `@id`-суффиксом `/ru#website`.
