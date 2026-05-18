# Design Review — Code-Site.Art

Аудит виконано як старший продуктовий дизайнер: на основі читання CSS/TSX усіх блоків і сторінок + перевірки рендеру на dev-сервері. Зосереджено на ламкій верстці, неузгоджених ширинах/відступах, текстах що погано читаються на певних ширинах, та "AI-ішному" вигляді (переоб'южені італіки, синтетичні метрики, шаблонні 3-карткові ритми).

---

## 0. ТОП-15 пріоритетних правок (cross-cutting — чинять найбільшу шкоду одразу на всьому сайті)

Якщо часу мало — почати тут. Кожна торкається 5+ сторінок.

1. **Зведений токен `--container-max`**. Зараз `.hero-grid` = 1440px, `.hp-inner` / `max-w-container` = 1240, `.contact-split-inner` = 1180, `FAQ` = 880, `Audit` = 1140, legal = 760, `MetaStrip` = 1240 інлайном. Сторінка візуально "стрибає" по краях. → Прийняти **1240** як стандарт; широкий 1440 лишити лише для оптичного якоря з мокапом героя.
2. **Зведений токен вертикального ритму секцій**. Padding-y бігає `60 / 56 / 64 / 80 / 100 / 120 / 36`. Жодного рітму. → Ввести `--section-y` (80px desktop / 56 mobile) + `--section-y-tight` (56/40) + `--section-y-lg` (120/72). Заборонити інлайнові значення.
3. **Закрити "ущелину" 900–1100px**. Майже всі блоки перемикають сітку на 1100 → 640/700. Між ними інтерфейс ламається: hero має 720px min-height на ноутбуці 768px, ImageText переходить на 800, contact-split на 900, vs-таблиці виходять у скрол із `whitespace-nowrap`. → Додати один проміжний breakpoint `≤1080`/`≤960` для ключових блоків (hero, image-text, outcome, services, vertical-timeline, comparison-tables).
4. **Прибрати ~80% інлайнових `<em>` italic**. Italic-gradient `<em>` використовується у кожному параграфі (hero, reasons, services, outcome, case, team-cards quotes, FAQ answers). На довгих українських реченнях це візуальний шум, і це найсильніший "AI-tell" сайту. → Italic-gradient лишити **тільки в H1/H2**; в body — максимум 1 `<em>` на параграф, без градієнта.
5. **Зняти "магічні" висоти**. `hero-grid min-height: 720px`, `hero-right height: 640px`, `hp-bento grid-auto-rows: 360px`, `case-result-num font-size: 36px`, `.benefit-hero number font-size: clamp(72,11vw,140)`. На 13" ноутбуці hero забиває весь viewport, Bento на планшеті стає 1440px заввишки. → Перейти на intrinsic sizing з `aspect-ratio`, `clamp()` та `min-height: clamp()`.
6. **Уніфікувати "eyebrow" нумерацію** (`/ 02 TURNKEY`, `/ 03 SOLUTIONS`, …). Зараз: UA homepage пропускає 08, EN homepage пропускає 08, 09, 10; About стрибає 02→04; вся нумерація не паралельна між UA/EN. Eyebrow-и часто **англійською на українській сторінці**. → Або повна локалізація eyebrow-ів, або відмова від наскрізної нумерації (зробити їх просто секційними тегами).
7. **Локалізувати все, що зашите англійською в UA-сторінках**: "TRUSTED BY 47+ BUSINESSES IN UA · EU · US · DK" (marquee), "BOUTIQUE STUDIO" (hero eyebrow), "CASE STUDY" (page-hero default), "★ MOST POPULAR" (pricing tier), кроки процесу ("Brief", "Design", "Development"…), MetaStrip ("Industry", "Region", "Year"), MockBookingForm рядки. І навпаки — українські рядки на EN маршрутах (`pickRichText` fallback на UK, `loc(..., "uk")` у `PortfolioCard`, дефолти у `LeadForm`).
8. **Уніфікувати typography stack**. Завантажується `Manrope` + `Inter` + `JetBrains Mono` (~10 файлів). У hero є фейковий `font-family: 'Manrope', serif` (italic просто рендериться системним serif — виглядає як баг шрифту). → Залишити **Manrope** (400/500/600/700) + JetBrains Mono (400/500) для технічного label-у. Inter прибрати (використовується лише в кількох calc-кнопках, перейти на Manrope).
9. **Прибрати випадкові метрики, що пахнуть вигадкою**. `47 проєктів за 3 роки` + `47+ businesses` (marquee) + `47 міграцій` (vs-pages) + `×3.2 заявок` + `0.6s LCP` + `98 Lighthouse` + `0 DROPS` + дві окремі плашки `100%` у Bento + `×2.4 / ×3.2 / ×3-4` (та сама метрика, три різні значення в Reasons/Case/Outcome) + `60-point QA`, `30% rebate`, `BENCHMARK · 2025`, `GLOBAL DATA · 2024`. → Або реальне джерело з посиланням, або зрізати до 2–3 верифікованих чисел на сторінку.
10. **Знести "3 однакові картки" як домінантний ритм**. Reasons=3, Services=6, Outcome=3, Case before/after=7+7, бентоси=4×2 з ідентичних 1×1, FAQ=5–8 завжди, кроки процесу = жорсткий 3-секційний (weDo/youDo/deliverable) для кожного етапу. → Варіювати: одна секція asymmetric (image-led), одна — щільніша, одна — стислий список без карток.
11. **Розмір/format цін узгодити**. Pricing tiers: `$1 000` (NBSP), Bento: `$1,000+` (US кома), FAQ: `$1 000`. Один і той самий проєкт — три формати на одній сторінці. → Один формат у всьому коді (`$1,000` US або `$1 000` UA — залежно від locale), без `+`.
12. **Прибрати дублі токенів та "!important" забруднення**. `--ink-dim` = `--ink-2` (однакове значення), `--line-strong` = `--line-2`. У `final.css` — 12 `!important` декларацій для подолання HeroUI; це боргова петля.
13. **`em` глобальний хак** `em { padding-inline-end: 0.16em }` (`globals.css:51-55`) існує лише тому, що italic gradient `<em>` усюди — самокоментар у CSS це визнає. → Hardcode видалити після redux italic-ів (пункт 4); або обмежити селектор `.h1 em, .hp-h2 em`.
14. **Hero mockup переповнення на 1440px+**. `width: 230%; max-width: 230%; transform: translateX(-22%)` тримається тільки правилом `≤1440px`. На широких моніторах мокап виходить за межі своєї колонки і ховається за лівою. → Прибрати override для `>1440px` або змінити на `clamp(110%, 130%, 160%)`.
15. **Сторінка `/blog` — порожня, без футера; `/legal`, `/policy`, `/public-contract` — стаб-плейсхолдери з robots:noindex.** Сайт збирає PII через калькулятор і контактну форму без політики — юридичний ризик, не лише UX. → Сховати посилання у футері до публікації або викотити мінімальний privacy v1.

---

## 1. Глобальні токени / `globals.css` / `layout.tsx`

- **`layout.tsx:10-29`** — три сім'ї шрифтів × 5/3/2 ваг ≈ 10 файлів на first paint. Скоротити Manrope до 400/600/700, видалити Inter, залишити JetBrains Mono 400/500.
- **`globals.css:13-15`** — `--ink-dim` та `--ink-2` мають однакове значення `oklch(0.78 0.012 300)`. Видалити один.
- **`globals.css:17-19`** — `--line-strong` = `--line-2` = `oklch(1 0 0 / 0.14)`. Видалити один.
- **`globals.css:51-55`** — глобальний хак `em { padding-inline-end: 0.16em }`. Обмежити селектор до `.h1 em, .hp-h2 em, .case-h2 em` або взагалі видалити після зменшення italic-ів.
- **Контейнерні max-width** — 1440/1240/1180/1140/880/760 одночасно. Звести до 1240 + один опціональний "narrow" 760 для legal/text-only.
- **Section spacing** — `60/56/64/80/100/120/36` бігає по `hp-section`, `.tight`, `final-section`, `cmp-tier-grid`, `lead-form-section`, `image-text section`, `audit-section`. Ввести `--section-y` / `--section-y-tight` / `--section-y-lg`.

---

## 2. Header / Footer / Mobile menu

- **`hp-header.tsx:36-50` + `homepage.css:1543-1722`** — 8 пунктів навігації + dropdown + locale + CTA = 11 елементів. На 1024px вже тісно. → Прибрати 2 пункти (Calculator → перенести у dropdown "Послуги", Stories — у футер).
- **`homepage.css:1858`** — burger включається тільки `≤800px`, але навігація тісно ще на 1000px. Перенести burger на `≤960px`.
- **`hp-header` sticky над `position: fixed` `.hero-bg`** — backdrop-blur у sticky шарі при скролі нічого корисного не блюрить (бекграунд лишається на місці). Видалити blur у sticky або зробити header `fixed` теж.
- **CTA "ОБГОВОРИТИ ПРОЄКТ" 12px uppercase Cyrillic** — на цьому розмірі кирилиця погано читається ("Безкоштовний аудит" в інших CTA — те саме). Підняти base font до 13px у uppercase pill.
- **Footer (`homepage.css:1437-1452`)** — 5-колоночна сітка на UA, 4-колоночна на EN. Brand-колонка розширюється по-різному, симетрія ламається.
- **`homepage.css:2204-2205`** — на `≤800px` brand спан 2, решта 5 колонок як `2×3` з одним порожнім слотом. UA: `1+2+2`, EN: `2+2+1`. Асиметрія.
- **`homepage.css:1477`** — `hp-footer-desc max-width: 320px` всередині колонки ~370px → візуальний "обрив" праворуч.
- **Disabled industries** (`homepage.css:1453-1458`) — `color: var(--ink-3); cursor: default`, але без strikethrough/"Coming soon" pill — виглядає як просто темніше посилання, не як "недоступне".

---

## 3. Homepage — UA (`src/app/page.tsx`)

### 3.1 Hero (`blocks/hero/`)

- **`hero.css:174` `min-height: 720px`** — на 13" ноутбуці (768px заввишки) hero забиває весь viewport. → `min-height: clamp(560px, 80vh, 720px)`.
- **`hero.css:444, 453` `height: 640px` + `min-height: 640px`** — жорстко, дає мертвий простір або обрізає теги. Перейти на `aspect-ratio`.
- **`hero.css:522-531` мокап `width: 230%; transform: translateX(-22%)`** — на >1440px виходить за колонку. → `width: clamp(110%, 130%, 160%)` або обмежити правило ≤1440.
- **Зона 900–1100px не покрита** — між `≤1440` rule і `≤640` mobile нічого немає. На 950px фічі + 4 стати + мокап ламаються в малий проміжок 28px.
- **`hero.css:225-226` `.h1 em font-weight: 300; font-family: 'Manrope', serif`** — Manrope не має serif italic, рендериться системним serif → виглядає як невантажений шрифт; до того ж стрибок з weight 700 → 300.
- **3 різні max-width у лівій колонці**: lede=460, features=480, stats=100%. Step-down видно. Узгодити до 480.
- **`hero.css:265, 281, 405`** — `lede max-width 460 vs features 480 vs stats 100%`.
- **`hero/index.tsx:194-208`** — `ctaSecondary` рендерить arrow SVG, а в label вже є "→". Дубль стрілок.
- **Floating tags (`hero.css:493-495`)** на `≤1440`: `left: -6%`/`right: -6%` → виходять за `.device-stage` і налазять на lede.
- **`hero/index.tsx:235-242`** — `display: contents` на `<span>` зі stat+divider: ламає `gap` flex-у в Safari < 16.4 і втрачає ARIA фокус.
- **`app/page.tsx:227-230` `<br/>` всередині stats labels** — тендітно: на 1100px "проєктів<br/>за 3 роки" може налазити на divider.
- **Сopy AI-tells**: `"BOUTIQUE STUDIO"`, `"сайт працює сам"`, `"5 годин"` (підозріло точно), `"×3.2 заявок"`, `"0.6s LCP"`, англійський "Без розмови з sales" в UA футноті.

### 3.2 Marquee

- **`homepage/index.tsx:86`** — `"TRUSTED BY 47+ BUSINESSES IN UA · EU · US · DK"` зашите англійською. UA сторінка показує англомовний eyebrow.
- **Дубль "47"** — і в hero stat, і в marquee. Виглядає як невипадкова цифра-плейсхолдер.
- **`homepage.css:164` `filter: brightness(0) invert(1)`** — усі 16 логотипів стають білими силуетами, бренди не впізнавані (Stripe, Helsi). → Використати `grayscale(1) brightness(2)` або просто opacity dimming.
- **Mobile (375px)** — letter-spacing 0.14em + 11px label + fade-маска зрізає до 5 логотипів видимих одночасно. Опустити letter-spacing на mobile.

### 3.3 Industries

- **8 карток у `repeat(4, 1fr)`** — при 1240/4 ≈ 290px колонка стискає довгі англомовні назви ("Construction / Renovation", "Accounting & Bookkeeping") у 2 рядки, а короткі ("Cosmetology") — у 1. Висота карток рваниста.
- **6 з 8 карток — мертві посилання `href: null`** з `opacity: 0.78`. Виглядає як loading-state, не як заплановані "Coming soon". → Додати pill "Skoro" / "Coming soon" або strikethrough.
- **Mixed mid-card**: title англомовний ("Healthcare / Medicine"), опис український. Візуальний хаос.
- **`/ 03 SOLUTIONS`, `/ 04 WHY US`, `/ 05 PROCESS` тощо** — eyebrow англійською в UA-секціях.

### 3.4 Bento

- **`homepage.css:311` `grid-auto-rows: 360px`** — все клітинки 1×1 (немає 2×2/3×1 у даних) → це просто 4×2 фіксованих 360px = 720 desktop, 1440 на планшеті. Висота не відповідає щільності контенту.
- **8 контр-статів на 8 клітинках** (`98 LH`, `100%`, `4 wk`, `$3.5k+`, `1y`, `4h`, `0 DROPS`, `100%`) — синтетичне; **два `100%`** і **`0 DROPS`** — це не одиниця виміру.
- **Body занадто короткий** в одній клітинці (3 слова) поруч з повним реченням в іншій → рваний ритм.
- **`homepage.css:347 .hp-bento-cell::before inset-inline: 24px`** — mobile перепис у 18 не покриває всі варіанти. Лінія-акцент зрушує на пів-піксель.
- **`homepage.css:417-419 text-wrap: balance + word-break: keep-all`** — `keep-all` для англомовних слів у міксі (GitHub) → не дозволить перенести довге слово, переповнення.

### 3.5 Process

- **`homepage.css:955, 962 white-space: nowrap`** на name/duration. 5 колонок / 1240 ≈ 232px. "Launch + Support" не вміщається, виходить горизонтально.
- **`process.tsx:14-20`** — кроки англійською ("Brief", "Design", "Development", "Testing", "Launch + Support"); тільки 5-й крок з UA-body. Мовний мікс у одному ряду.
- **`homepage.css:890-895`** — ракета `right: -14px; top: 50%; transform: translateY(-50%) rotate(45deg)`. Лінія `left:28px; right:28px` → ракета сидить на номері "05".
- **`homepage.css:919 transition-delay: calc(var(--i,0) * 0.32s)`** × 5 кроків = 1.6s, лінія 3s. Останній крок з'являється раніше, ніж лінія дотягується. Timing rozkalibrovany.

### 3.6 Cases (на homepage)

- **`homepage/index.tsx:748-768`** — 15-рядковий інлайн `style` об'єкт для "coming soon" badge. Винести у CSS.
- **`homepage.css:994` aspect-ratio 4/3 у 3-кол сітці** + `.hp-case-shot inset: 28px` → бар "chrome" зі smudge blur з'їдає більшість thumbnail-у. Перейти на `aspect-ratio: 16/10` або зменшити inset.
- **"Всі кейси →" `hp-link bottom-bordered`** — єдина секція з "all" посиланням; асиметрично з pricing/bento/industries.

### 3.7 Pricing

- **`comparison.css:90-95` gap 18px**, інші блоки 16px. Дрібниця, але видно.
- **`blocks/comparison/index.tsx:91-114`** — `Tier` — 90% inline Tailwind arbitrary values з `[oklch(...)] shadow-[...]`. Складно підтримувати.
- **3 формати ціни на одній сторінці** — `$1 000`, `$1,000+`, `$1 000`.
- **`★ MOST POPULAR`** — англійською в UA tier-у.

### 3.8 PullQuote

- **`homepage/index.tsx:914`** — `«…»` зовні + `<em>` градієнтний `24` всередині — типографічний конфлікт між UA gillemet і градієнт-italic.
- **`homepage.css:1207`** — `inline-flex; flex-direction: column;` для author block з avatar/name/role/LinkedIn — layout shift при наявності/відсутності `liHref`.
- **`homepage.css:1195` font-clamp(22, 2.5vw, 32px)** при max-width 760px → 23 chars/line. Або шрифт менший, або контейнер ширший.

### 3.9 FAQ

- **`blocks/final/index.tsx:195`** — `tracking-[-0.035em] uppercase` для UA "НАЙЧАСТІШІ ПИТАННЯ ПЕРЕД СТАРТОМ" — негативний tracking + uppercase = clostrophobic.
- **`max-w-[880px]`** проти 1240 у решті — сторінка візуально звужується на FAQ.
- **`pt-[100px] pb-[100px]`** проти 56px стандарту `.hp-section` — порушений ритм.
- **`final.css:32-89`** — 12 `!important` декларацій (битва з HeroUI). Технічний борг.
- **Heading style ≠ решті** — інші секції мають `.hp-h2` italic gradient, FAQ — звичайний uppercase. Різні візуальні мови за 2 секції.

### 3.10 FinalCta3

- **`homepage.css:1259 margin-top: -16px`** — негативний відступ; ламкий якщо heading wraps.
- **`border-image` на featured card з `border-radius: 22px`** — у Safari округлення кутів квадратиться.
- **2px border featured vs 1px інших** — зміщує baseline сусідніх карток на 1px.

### 3.11 Newsletter

- **`newsletter.tsx:21-23`** — submit лише міняє local state, **жодного API виклику**. Користувача дезінформує. → Підключити до `/api/lead` або сховати кнопку.
- **`homepage.css:1399 sub max-width 420`** + flex-row ≥800px → паграф 3-4 рядки, H у 1 рядок, форма праворуч. Асиметрично.

---

## 4. Homepage — EN (`src/app/en/page.tsx`)

- Усі проблеми homepage UA + спеціальні:
- **7 індустрій vs UA 8** — `repeat(4, 1fr)` дає `4+3` з порожнім слотом на desktop.
- **Нумерація eyebrow стрибає 02→11** — більше пропусків, ніж UA.

---

## 5. Industry pages (`src/app/sites-for/[slug]`, `src/components/industry-page/`)

- **`industry-page/index.tsx:574`** — heuristic split по `" / "` у eyebrow ламає UA з нюансами ("стоматологія/гігієна").
- **`industry-page/index.tsx:57 pickRichText fallback на UK`** — EN сторінка тихо рендерить UA параграф, якщо перекладач пропустив блок. → Має повертати `null` + warning при build.
- **`industry-page/index.tsx:163 buildOutcomeMock`** завжди fallback на MockPages → порожня 3-кол сітка placeholder. Додати explicit empty state.
- **`industry-page/index.tsx:96`** — `priceCurrency: "USD"` зашите. UA сторінка з "30 000 грн" дасть невірний Schema.org.
- **`industry-page/index.tsx:418`** — `MEDICINE_FEATURE_ICONS` reused для **всіх** індустрій. Renovation/Accountancy сторінка показує doctor/calendar/shield icons. → Додати `featureIcon` поле в schema.
- **`outcome/index.tsx:76-94 MockBookingForm`** — зашиті UA рядки ("Запис на консультацію", "+380 ··", "Стоматологія / гігієна"). EN page рендерить українські строки в моку.
- **`reasons/index.tsx:41/63`, `services/index.tsx:110/189`, `case/index.tsx:109-113`** — однакові метрики drift: Reasons "×2.4", Case "×3.2", Outcome "×3-4". Та сама подія, три значення.
- **`case/index.tsx:79-143`** — `DEFAULT_BEFORE_LIST`, `AFTER_LIST`, `DEFAULT_RESULTS`, `beforeShotUrl="efedraclinic.com.ua"` як defaults. Якщо schema пропускає поле — на чужій індустрії показуються дані клініки Efedra. → Видалити defaults або throw у dev.

### Блоки індустрії

- **`image-text/index.tsx:78` breakpoint на 800** (інші — 1100) → у 900–1100 image-text 2-col з gap-16 робить image <380px wide.
- **`image-text/index.tsx:106-139`** — 4 різні mt-scale (mt-6, mt-7, mt-8) між eyebrow/heading/body/bullet/CTA. Звести.
- **`reasons/index.tsx:156`** — 3-col `[180,220]_1fr_[180,280]`; на 900–1100 правий стат-бокс падає вниз і отримує vertical separator лише у цьому проміжку. Артифакт.
- **`reasons/index.tsx:132 max-w-[16ch]`** — UA "3 причини, чому пацієнти не записуються з вашого сайту" (51 chars) → 4 короткі рядки.
- **`reasons/index.tsx:44/66`** — синтетичні "BENCHMARK · 2025", "GLOBAL DATA · 2024".
- **`services/index.tsx:176`** — uppercase H2 з `[&_em]:normal-case` всередині — italic mixed-case у uppercase виглядає як випадковість.
- **`services/index.tsx:244`** — `.testimonial-visual aspect-[5/4]` — порожній 500×400 градієнтний бокс без фото.
- **`services/index.tsx:289`** — integration cards — `<span>uppercase</span>` назв брендів. SEO-keyword stripe замість іконок.
- **`outcome/index.tsx:261 number font: clamp(72,11vw,140)`** — на 900–1100 цифра 100+px перебиває контент.
- **`outcome/index.tsx:133`** — `order-2 / order-1` потім `max-[1100px]:order-0` — `order:0` тут створює неконсистентність.
- **`outcome/index.tsx 133` directions card** — body 70ch у 1100px карті = стіна тексту.
- **`outcome/index.tsx replaceLabel/allowedLabel`** — grey vs accent-soft dots — різниця занадто тонка; "bad vs good" не зчитується.

---

## 6. Portfolio + case pages

### `src/app/portfolio/page.tsx`

- **`page.tsx:197` "Кейси завантажуються…"** — лише UA на EN маршруті теж.
- **PortfolioCard** завжди `loc(..., "uk")` (UA-only). EN — окремий файл; drift двох копій.
- **Empty state у 1-col у 3-col grid** — займає одну колонку, не центрується по ширині.
- **`page.tsx:203, 221`** — FinalCta + CtaBanner один за одним з однаковою gradient-панеллю → два майже однакових CTA поспіль.

### `src/components/blocks/page-hero`

- **`page-hero/index.tsx:29 display: contents`** на `<span>` wrapper — ламає gap у Safari < 16.
- **H1 max-w-[920px] у 1240 контейнері** — довгі UA case titles wraps в 3-4 рядки, sub-paragraph max-w-720 — коротше → ragged right.
- **`case-page/index.tsx:621`** — default eyebrow `"/ CASE STUDY"` англійською в UA.
- **Hero без device mockup** — на >1400px праворуч від H1 700+px порожньо.

### `src/components/case-page` (`portfolio/[slug]`)

- **`case-page/index.tsx:236 MetaStrip 1240 inline-style**** — відхиляється від `max-w-container` className.
- **`case-page/index.tsx:198 MetaStrip labels англійські** ("Industry", "Region", "Year")** — values локалізовані, labels — ні.
- **`case-page/index.tsx:266 ScreenshotPending`** — 12px uppercase центрований у gradient placeholder — велике мертве поле 16:9 на 920px. Або сховати секцію, або додати recommended dimensions.

### `blocks/case` (Before/After на homepage та case pages)

- **`case.css:101 .VS pill** — між карткою скрита на mobile, але на 700–900 налазить на dashed separator і border-highlight after-картки.
- **`case.css:55 .case-h2 max-width: 14ch`** — extreme; UA "До / Після на прикладі реального клієнта" → 5 рядків.
- **`case-result-num font-size: 36px`** fixed — на широких viewport-ах виглядає малою.
- **CTA-strip rounded-full** на 900–1100 wraps, кути pill стикаються з текстом.

---

## 7. vs-* comparison pages (`/vs-constructors`, `/vs-freelancers`, `/vs-wordpress`)

- **`vs-constructors/index.tsx:1421-1457`** — comparison table `minWidth: 880` + `whitespace-nowrap` всюди. UA значення ("Місячна вартість", "Володіння кодом", "1-2 тижні самостійно") потребують >1000px. Між 768–1080 — горизонтальний скрол.
- **Sticky left column "Критерій" має той самий bg `oklch(0.155 0.005 300)`** як решта картки → sticky не помітний при скролі.
- **Два паралельних табличних системи** — custom 7-col grid в vs-constructors та `.cmp-table` в vs-freelancers/wordpress + pricing TCO. Різні padding (`px-4 py-3.5` vs `18px 24px`), різні mobile reflows. Звести.
- **`vs-constructors/index.tsx:1508 builders cards 2-col + optional note`** — без note 4 ряди, з note 5 → парна рима ламається.
- **Усі 11 секцій vs-page** використовують той самий `SectionHead` (eyebrow/H2/sub) → нескінченна вертикальна одноманітність.
- **`vs-constructors/index.tsx:1319, vs-freelancers/index.tsx:1415`** — `deviceTags` має `{ kind: "default", primary: "→" }` як окремий "badge" зі стрілкою-гліфом. Замінити на divider chip або icon.
- **`vs-freelancers/index.tsx:1858`** — `<strong>` всередині `<td>` з `font-bold` на td → подвійний bold; rendering залежить від доступних ваг.
- **`max-w-[68ch]/60ch/64ch`** — 7+ різних "centered footer paragraph" ширин на одній сторінці.
- **Стат-щільність**: "47 міграцій · 0 SEO-падінь", "12 of 47 rescues", "60-point QA", "30% rebate", "$1,800–4,500", "LCP 0.8s" — сumulatively fabricated-feeling. → 2-3 верифікованих claims на секцію максимум.

---

## 8. Calculator (`src/app/calculator`, `src/components/calculator/`)

- **`formatters.ts:1-2 formatEur` насправді USD** — currency: "USD", locale: en-US. Output завжди `$1,000` незалежно від locale. → Перейменувати + локалізувати number-grouping.
- **`WebsiteCalculator.tsx:34, 143, 158, 173, 196, 294, 344`** — кожен section heading має italic `<em>`. → Зняти 2-3 з 6.
- **`WebsiteCalculator.tsx:70-122`** — 3 info-card секції (How it works / Why packages / Why estimate) кожна з 3 картками. Класична AI-рима. Об'єднати або скоротити.
- **`calculator.css:85`** — sticky summary fixed-width 360px, controls стискаються. Між 1100–1280 controls cramped. → `minmax(280px, 340px)` + breakpoint для checkbox grid 2-col нижче 1280, не 1100.
- **`calculator.css:478-490`** — sticky `top:96px max-height:calc(100vh-112px) overflow-y:auto`. На <900px заввишки summary стає скроллом всередині скролу, ховається CTA. → Drop sticky нижче 900px.
- **`CalculatorControls.tsx:328-340`** — design cards використовують `role="button"` на `<div>` з ручним key handling. Втрачає `:focus-visible`, без `aria-pressed`. → Реальний `<button type="button">`.
- **`CalculatorControls.tsx:354`** — "View examples" `<button>` nested **всередині** `<div role="button">`. Nested interactive. Розплющити.
- **`calculator.css:435-476`** — checkbox cards `min-height: 88px` з варіативним контентом → порожній простір або стрибок. → `align-items: stretch`.
- **`LeadForm.tsx:56-66`** — onSubmit лише `console.info` + setState. **API не підключений.** → wire to `/api/lead`.
- **`LeadForm.tsx:92-185`** — без field-level errors / `aria-invalid` / errorMessage. Тільки нативний browser tooltip.
- **`EstimateSummary.tsx:127-131`** — total price gradient-clipped `<h4>` 28px; на довгих range ("$12,000 – $18,000") wraps, низ символів обрізається через `-webkit-text-fill-color: transparent`. → 32px, `nowrap`, line-height 1.1.
- **`EstimateSummary.tsx:200-223`** — ROI block + scarcity + disclaimer + 2 CTA — занадто щільно (8 dividers, 10+ блоків). → Collapse у `<details>` за замовчуванням.
- **`calculator.css:540`** — `border-bottom: 1px dashed var(--line)` на кожен summary list row → шум. → `:not(:last-child)` only.
- **`CalculatorControls.tsx:218`** — preset middle card `translateY(-6px)` ламає baseline сусідів. → `align-self: end` через grid.
- **`WebsiteCalculator.tsx:349-375`** — 3 separator `<span>` "або/or" inline в alt-CTA pill row → wraps weirdly на mobile.
- **`CalculatorControls.tsx:300-318`** — `productComplexity` тільки для ecommerce → height jolts при зміні project type. Reserve slot або animate.

---

## 9. Pricing (`src/app/pricing/page.tsx`)

- **`pricing/page.tsx:30-32`** — title `від $1 000 до $14 000+` з NBSP-thin spaces; на macOS Safari можуть рендеритися як broken glyphs.
- **`pricing/page.tsx:126, 158, 186, 215`** — кожен CTA закінчується " →". Trailing arrows = AI tell. Використати proper `<Icon>` chevron.
- **`pricing/page.tsx:140, 144, 148, 170, 175, 199, 202`** — feature lists — strings + `<em>` JSX fragments; вертикальний ритм ламається через italic baseline shift.
- **`pricing/page.tsx:223-265`** — Add-ons Bento 6 однакових 1×1. Defeats Bento purpose. → Vary одну плитку.
- **`pricing/page.tsx:485-496`** — два `ImageText` блоки поспіль з `imageRight` обидва — виглядає як дубль секції. Alternate.
- **`pricing/page.tsx:557 "Чесна схема без сюрпризів"** + "без сюрпризів" повторюється — sales filler.
- **`pricing/page.tsx:131 popularLabel "★ MOST POPULAR"** англійською на UA.

---

## 10. Offer / Legal / Policy / Public-contract

- **`legal-stub.tsx:40-67`** — inline-style typography (`fontFamily`, `fontSize`, `lineHeight`, `padding: "60px 48px"`). Bypasses tokens; 48px sides — занадто широко на mobile <480.
- **`legal-stub.tsx:41 maxWidth: 760`** — fine для prose, але без H2/H3 hierarchy. Коли публікують реальний legal — heading styles не існують. → Define MDX/prose styles перед публікацією.
- **Усі 4 legal pages — той самий FinalCta3 + "Документ зараз готується юристом"** — приходять з cookie banner, очікують реальний text. → Опублікувати щонайменше privacy v1 або зняти посилання з футера.
- **`robots: { index: false }`** — fine для stub, але посилання у футері без контенту = поганий UX.

---

## 11. Contacts (`src/app/contacts/page.tsx`)

- **`contacts/page.tsx:138`** — `heading="Частe запитують перед заявкою"` — **"Частe" — кирилиця + латинське e**, або просто typo "Часто".
- **`contact-split/index.tsx:23 "Жодного бота — пише сам Fedir"** + **lines 51-56 — emoji icons (📍🕒🌐)** як bullets. Решта сайту — lucide icons. → Lucide MapPin/Clock/Globe.
- **Немає мапи/фото** попри адресу "Київ" — на desktop праворуч порожня візуальна рамка.
- **CONTACTS_FAQ** — кожна відповідь має `<em>`. 5 картки = 5 italic. → Залишити 2.

---

## 12. Process (`src/app/process/page.tsx`)

- **`process/page.tsx:18-19`** — title "7 кроків", hero "9 речей". Conflicting numerics на 2 параграфи. → Match.
- **`process/page.tsx:478`** — eyebrow `"/ PROCESS · 4-10 WEEKS END-TO-END"` англійською (несконсистентно з calc-eyebrow, які локалізовані).
- **STEPS array** — кожен step має 3-секційну shape (weDo / youDo / deliverable) з 3-5 bullets кожна. **Найсильніший AI tell на сайті.** Варіювати: 2-секційні steps, prose-only steps.
- **STEPS mix UA + translit ("etapи", "Deliverable", "moodboard", "screencast", "Lighthouse").** → Перекласти або italic як свідомі техтерміни.
- **`process/page.tsx:152, 175, 367`** — "30% неустойка" 3+ рази + "1 раз за 2 роки" повторюється → fabricated specificity.
- **VerticalTimeline mobile** — `vertical-timeline/index.tsx:140` 3-col панель → 1-col на 900 → кожен step ~600px. Додати 2-col 700-900.
- **`vertical-timeline/index.tsx:45 marker column 56px` + `gap-x-7`** без `minmax(0,1fr)` → панель overflow horizontally.

---

## 13. About (`src/app/about/page.tsx`)

- **`about/page.tsx:478-482 "12 людей"** але `TEAM_MEMBERS` має 4 (8 "у фоновій роботі"). Mismatch видно одразу. → Або list 12, або change copy.
- **`about/page.tsx:526`** — Founder section у `{false && (...)}` → **dead code в production**. Видалити.
- **`about/page.tsx:498 "×3.2 більше заявок"** без methodology. Repeat invented metric.
- **`about/page.tsx`** — 11 нумерованих секцій (02 → 12) — kitchen sink. Consolidate.
- **`team-section.tsx:112 aspect-square + object-cover object-top`** — погано crops chest-framed headshots. → `aspect-[3/4]`.
- **`team-section.tsx:298 grid-cols-4 → 2 → 1`** — 4-card row на 1101px стає дуже вузьким. Додати `xl/lg/md` ramp.
- **`team-section.tsx:30-89`** — short descriptions як stylized first-person quotes з лапками — marketing fan-fiction, особливо коли template повторюється 4 рази.
- **`about/page.tsx imports Github as GithubLogo`** + `Github` — redundant alias.

---

## 14. Blog (`src/app/blog/page.tsx`)

- **Без `<HpFooter />`** — сторінка обривається mid-air.
- **`minHeight: 50vh + paddingTop: 120`** — desktop = mostly empty viewport.
- **Empty state = H1 + параграф, no skeleton/illustration/sign-up.** Missed conversion. → Newsletter capture або "notify me".

---

## 15. Stories preview (`src/app/stories/*`)

- **`stories/vertical-timeline/page.tsx:107`** — heading "7 кроків" але 3 STEPS в array.
- **`stories/cta-banner/page.tsx:30`** — `href: "/calculator/site-cost"` — **broken**; реальний шлях `/calculator`.
- **Усі stories pages — без header/footer, без `<main>`, без preview-meta** (component name, props variants). Виглядають як сирі блоки на сторінці. → Тонка story shell.
- **`stories/team-cards`** — `href: "#"` placeholders → avatars не рендеряться.
- **`stories/image-text/page.tsx:163 bullet "Launch + Support — 1 рік підтримки"** — EN+UA mix.

---

## 16. Загальний AI-smell (копія / контент)

Список фраз, що повторюються по кодбазі і додають "ШІшності":

- **"сайт працює сам"**, "обертає клієнтів", "приймає заявки 24/7", "перетворює відвідувачів", "Без сюрпризів", "просто і прозоро", "30 хв" (8+ разів), "5 годин участі", "BOUTIQUE STUDIO", "TRUSTED BY", "★ MOST POPULAR".
- **Усі FAQ блоки** — 5–8 питань, відповіді 2–4 речення, italic em-phrase майже у кожній. Найсильніший шаблонний сигнал у кодбазі.
- **Кожна секція має тричі повторений ритм** (3 reasons / 3 bullets / 3 stats / 3 cards), на більшості сторінок одночасно.
- **Числа без джерела**: `47`, `47+`, `×3.2`, `0.6s LCP`, `98 Lighthouse`, `60-point QA`, `30% rebate`, `4h response`, `2 з 4 слотів`, `BENCHMARK · 2025`, `GLOBAL DATA · 2024`. Деякі суперечать одна одній (×2.4 vs ×3.2 vs ×3–4 для тієї самої метрики).
- **Eyebrows нумеровані** "/ 02", "/ 03", … але нумерація стрибає по сторінці і мови.
- **Кожне CTA закінчується " →"** — на pricing 4× з 4, на homepage 5× з 7, на vs-pages ~10×.
- **Italic gradient `<em>`** як замінник bold — 3+ рази на параграф.

---

## 17. Quick wins (10–30 хв кожен — найбільший ROI)

1. Видалити `<HpFooter />` мiss у `/blog`.
2. Замінити emoji icons (📍🕒🌐) у `contact-split` на lucide.
3. Localize hardcoded EN: marquee label, "BOUTIQUE STUDIO", "★ MOST POPULAR", "CASE STUDY", MetaStrip labels, MockBookingForm strings, "Brief/Design/Development" кроки.
4. Виправити typo "Частe" → "Часто" (`contacts:138`).
5. Виправити broken link `/calculator/site-cost` → `/calculator` (`stories/cta-banner`).
6. Видалити dead `{false && (...)}` Founder section з about.
7. `formatEur` → `formatUsd` + локалізація number-grouping.
8. Кеp 1 italic `<em>` на параграф у default content (Reasons, Services, Outcome, Case, FAQ).
9. Узгодити ціну: `$1,000` US всюди.
10. Прибрати `min-Width:880` + `whitespace-nowrap` з vs-constructors comparison table; дозволити wrap.
11. Видалити дубль token-ів (`--ink-dim`/`--ink-2`, `--line-strong`/`--line-2`).
12. Hide footer links на `/legal`, `/policy`, `/public-contract` поки немає контенту.
13. Wire newsletter submit до реального endpoint або сховати кнопку.
14. Wire calculator LeadForm submit до `/api/lead`.
15. Узгодити max-width на 1240 у `MetaStrip`, `Audit`, `hero-grid` (зняти 1440 → 1240; залишити widescreen лише для мокапа).

---

## 18. Файли, в які треба впиратися найчастіше

```
src/components/blocks/hero/hero.css                       (749 рядків — головний джерело геометрії)
src/components/homepage/homepage.css                      (2207 рядків — більшість секцій homepage)
src/components/blocks/case/case.css                       (Before/After + result-num)
src/components/blocks/comparison/comparison.css           (pricing + vs-tables)
src/components/blocks/final/final.css                     (FAQ + final CTA, !important spam)
src/components/blocks/contact-split/contact-split.css     (форми + breakpoint 900)
src/components/calculator/calculator.css                  (sticky summary + checkbox cards)
src/components/industry-page/index.tsx                    (defaults + locale fallback)
src/components/case-page/index.tsx                        (MetaStrip + ScreenshotPending)
src/components/vs-constructors|freelancers|wordpress/     (дві паралельні таблиці)
src/app/globals.css + src/app/layout.tsx                  (токени, шрифти)
```

---

**Підсумок:** ~210 знайдених проблем, з них 15 cross-cutting (розділ 0) — фіксація саме їх дасть найбільший візуальний приріст. Решта — sektion-specific уточнення, які можна закривати поступово. Без виправлення italic-gradient-em (#4) і повторюваних 3-картки-3-стати ритмів (#10) сайт продовжуватиме читатися як AI-генерований, навіть з ідеальною геометрією.
