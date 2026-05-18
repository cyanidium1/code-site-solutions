# Sprint 2D — Pre-implementation Inventory

Read-only audit for the 15 cross-cutting fixes from [design-review.md](./design-review.md) Section 0, plus the two runtime fixes (C2.16 `/process` animation, C2.17 `/vs-*` hero collision).

Branch: `fix/design-cross-cutting`. No code changes in Phase 0.

---

## 1. Container max-width audit

### Raw occurrences

| File:Line | Value | Context |
|---|---|---|
| `tailwind.config.ts:53` | 1240px | `maxWidth.container` Tailwind token → `max-w-container` |
| `src/app/globals.css:111` | 1240px | `.container-page` utility |
| `src/components/blocks/hero/hero.css:70` | **1440px** | `.hero-inner` header bar |
| `src/components/blocks/hero/hero.css:172` | **1440px** | `.hero-grid` (device-mockup widescreen) |
| `src/components/homepage/homepage.css:18` | 1240px | `.hp-section > inner` |
| `src/components/homepage/homepage.css:1444` | 1240px | `.hp-footer-inner` |
| `src/components/homepage/homepage.css:1518` | 1240px | `.hp-header-row` |
| `src/components/homepage/homepage.css:1554` | 1240px | `.hp-header-inner` |
| `src/components/blocks/case/case.css:20` | 1240px | `.case-inner` |
| `src/components/blocks/turnkey-list/turnkey-list.css:41` | 1240px | `.turnkey-list-inner` |
| `src/components/blocks/contact-split/contact-split.css:12` | **1180px** | `.contact-split-inner` |
| `src/components/blocks/contact-split/contact-split.css:75` | **1180px** | duplicate `.contact-split-inner` |
| `src/components/blocks/final/index.tsx:278` | **1140px** | FinalCta3 grid wrapper |
| `src/components/blocks/final/index.tsx:194` | **880px** | FAQ inner (`max-w-[880px]`) |
| `src/components/industry-page/index.tsx:544` | 880px | Industry rich-text section |
| `src/components/homepage/homepage.css:52` | 880px | `.hp-section-head` |
| `src/components/blocks/page-hero/index.tsx:46` | 920px | page-hero H1 (`max-w-[920px]`) |
| `src/components/blocks/vertical-timeline/index.tsx:85` | 820px | timeline heading block |
| `src/components/blocks/turnkey-list/turnkey-list.css:51` | 820px | turnkey heading |
| `src/components/blocks/turnkey-list/turnkey-list.css:103` | 640px | turnkey body |
| `src/components/homepage/homepage.css:68` | 640px | hp-section narrow head |
| `src/components/homepage/homepage.css:1188` | 760px | pullquote inner |
| `src/components/blocks/comparison/index.tsx:389` | 560px | comparison contact card body |
| `src/components/calculator/calculator.css:1150` (approx) | 720px | `.lead-form-section` inner |
| `src/components/homepage/homepage.css:1399` | 420px | newsletter sub |
| `src/components/homepage/homepage.css:1477` | 320px | footer brand desc |
| `src/components/homepage/homepage.css:1877` | 420px !important | mobile menu inner |
| `src/components/legal/legal-stub.tsx:43` | **760** (inline) | legal stub prose wrapper |
| `src/app/about/page.tsx:167` | **1240** (inline) | About page wrapper |
| `src/components/case-page/index.tsx:236` | **1240** (inline) | MetaStrip |
| `src/app/portfolio/_nbyg-kobenhavn/page.tsx:80` | **1240** (inline) | Portfolio detail |
| `src/app/en/portfolio/_nbyg-kobenhavn/page.tsx:80` | **1240** (inline) | EN portfolio detail |
| `src/app/portfolio/_efedra-clinic/page.tsx:105` | **1240** (inline) | Portfolio detail |
| `src/app/en/page.tsx:401` | **720** (inline) | EN home process-eyebrow wrapper |

### Plan

| Current | Locations | Action | New token |
|---|---|---|---|
| **1440px** | hero.css:70/172 | Keep — widescreen for hero device-mockup only | `--container-max-wide: 1440px` |
| **1240px** | tailwind:53, globals:111, homepage.css:18/1444/1518/1554, case.css:20, turnkey-list.css:41, + 6 inline TSX | **Standard.** Collapse inline `style={{maxWidth:1240}}` → `max-w-container` className | `--container-max: 1240px` |
| **1180px** | contact-split.css:12/75 | Migrate → standard | `--container-max` |
| **1140px** | final/index.tsx:278 (FinalCta3) | Migrate → standard | `--container-max` |
| **920px** | page-hero:46 | Heading constraint (not container) — keep as separate token | `--container-h1: 920px` |
| **880px** | final/index.tsx:194 (FAQ), industry-page:544 (prose), homepage.css:52 (.hp-section-head) | Keep narrower for prose / FAQ readability | `--container-narrow: 880px` |
| **820px** | vertical-timeline:85, turnkey-list.css:51 | Heading constraint — align with narrow tier | `--container-narrow` |
| **760px** | legal-stub:43, homepage.css:1188 (pullquote) | Keep narrow for prose | `--container-prose: 760px` |
| **720px** | calculator.css lead-form, en/page.tsx:401 | Form-narrow — separate token | `--container-form: 720px` |
| **640px** | homepage.css:68, turnkey-list.css:103 | Body micro-section → use prose | `--container-prose` |
| 560/420/320 | comparison contact body, newsletter sub, footer brand | Component-internal; not containers — leave | n/a |

**Deliverable for C2.1:** 5 tokens (`--container-max`, `--container-max-wide`, `--container-h1`, `--container-narrow`, `--container-prose`) + optional `--container-form`. Migrate inline `style={{maxWidth}}` in 6 TSX files to className.

---

## 2. Section vertical spacing audit

### Raw section-level paddings

| File:Line | Value (desktop / mobile) | Element |
|---|---|---|
| `src/components/homepage/homepage.css:10, 2050` | 56 / 36 | `.hp-section` |
| `src/components/homepage/homepage.css:15, 2051` | 36 / 24 | `.hp-section.tight` |
| `src/components/homepage/homepage.css:1439, 2203` | 80 / 60 | `.hp-footer` |
| `src/components/blocks/hero/hero.css:165, 601, 643` | 60 (bottom) / 36 | `.hero` (asymmetric `24/48/60`) |
| `src/components/blocks/case/case.css:7, 404, 425` | 120/100 → 80/80 → 64/64 | `.case` |
| `src/components/blocks/contact-split/contact-split.css:3, 64, 70` | 80/64/48 | `.contact-split` |
| `src/components/blocks/turnkey-list/turnkey-list.css:3, 10, 16` | 56/48/36 | `.turnkey-list` |
| `src/components/calculator/calculator.css:23-32, 1527-1533` | 96/80/120 → 64/64/80 mobile | calculator stages (own rhythm) |
| `src/components/blocks/comparison/index.tsx:356` | 100 → 80 → 56 | comparison `<section>` (`py-[100px]/py-20/py-14`) |
| `src/components/blocks/final/index.tsx:192, 276` | 100 → 80 → 56 | FAQ + FinalCta3 `<section>` |
| `src/components/blocks/cta-banner/index.tsx:34` | 100 → 60 | cta-banner `<section>` |
| `src/components/blocks/image-text/index.tsx:145` | 100 → 60 | image-text `<section>` |
| `src/components/blocks/outcome/index.tsx:189` | 100 → 80 → 56 | outcome `<section>` |
| `src/components/blocks/reasons/index.tsx:119` | **120/100 asymmetric** → 80 → 64 | reasons `<section>` |
| `src/components/blocks/services/index.tsx:240` | 100 → 80 → 56 | services `<section>` |
| `src/components/about/team-section.tsx:276` | 100 → 60 | about team |
| `src/components/blocks/team-cards/index.tsx:202` | 100 → 60 | team-cards |
| `src/components/blocks/vertical-timeline/index.tsx:82` | 100 → 60 | timeline |
| `src/components/blocks/stats-bar/index.tsx:7` | 48 → 32 | stats-bar (p-12 / px-6 py-8) |
| `src/components/industry-page/index.tsx:543` | 64 (py-16) | industry rich-text |
| `src/components/blocks/outcome/index.tsx:204` | mb-120 → mb-80 → mb-56 | directions card separator |
| `src/components/blocks/comparison/index.tsx:388` | mb-120 → mb-80 → mb-56 | `.cmp-contact` separator |

### Plan

| Current (desktop / mobile) | Where | Proposed token |
|---|---|---|
| **120 / 72** | reasons:119 (`pt-120 pb-100`), case.css:7 (120/100), calculator:32, outcome:204 (`mb-120`), comparison:388 (`mb-120`) | `--section-y-lg: 120px` / 72 mobile |
| **100 / 56–60** (dominant) | comparison, final, cta-banner, image-text, outcome, services, team-cards, team-section, vertical-timeline | **`--section-y: 100px` / 56 mobile** |
| **80 / 56** | contact-split (80/64/48), footer (80/60) | `--section-y-md: 80px` / 56 mobile |
| **56 / 36** | `.hp-section`, turnkey-list | `--section-y-tight: 56px` / 36 mobile |
| **36 / 24** | `.hp-section.tight`, newsletter | `--section-y-xtight: 36px` / 24 mobile |
| 16/24/40 | newsletter, marquee, footer-inner partials | Component-level — leave |

### Anomalies

- **`pt-[120px] pb-[100px]`** asymmetric (reasons:119) — only block with non-equal top/bottom.
- **Hero `24px 48px 60px`** — bottom 60 unique.
- **`.hp-section` 56px vs every new block 100px** — actively conflicting rhythms. Two systems, no shared component.
- **`mb-[120px]`** on `cmp-contact` and `outcome directions` — used as section separator, not padding.
- **Calculator 96/96/80/96/80/120** — its own per-stage rhythm, ignores `.hp-section`.
- **No `padding-block` logical property** used anywhere — all `padding:` shorthand.

**Deliverable for C2.2:** Define 5 tokens (`--section-y`, `--section-y-md`, `--section-y-tight`, `--section-y-lg`, `--section-y-xtight`) with desktop+mobile values via `clamp()` or media-query overrides; migrate all section-level `py-[100px]`, `pt-[120px]`, `padding: NNpx 48px` in the listed files. **Acceptance:** no 200+px black gap at 1440×900 between two sections.

---

## 3. Italic `<em>` usage (the AI-smell fix)

**Site-wide total**: ~301 `<em>` raw matches across 51 files (≈150 tag pairs).
**Global CSS hack** (to be addressed): `src/app/globals.css:51-55` — `em { padding-inline-end: 0.16em; -webkit-box-decoration-break: clone; box-decoration-break: clone; }`. Comment at lines 43-50 explicitly acknowledges this is a workaround for italic glyphs clipped by `background-clip: text` on the gradient. Restrict selector to `.h1 em, .hp-h2 em, .case-h2 em` after cleanup.

### Top 10 files needing body-em cleanup

| Rank | File | Body `<em>` lines to strip |
|---|---|---|
| 1 | `src/components/vs-wordpress/index.tsx` | hero 178/732, body 182/183/250/611/632/736/737/804/1164/1186 |
| 2 | `src/components/vs-constructors/index.tsx` | hero 199/747, body 206/317/507/508/620/641/754/864/1061/1062/1176/1198 |
| 3 | `src/components/blocks/services/index.tsx` | bullets 113/114/133/143/153/154/163; body 219 |
| 4 | `src/app/process/page.tsx` | body 126/151/161/196/233/269/306 |
| 5 | `src/app/pricing/page.tsx` | list items 140/144/148/170/175/199/202 |
| 6 | `src/app/en/page.tsx` | body 238/257/344/345/471/490 |
| 7 | `src/components/blocks/case/index.tsx` | bullets 82/87/95/99/103/128/130 |
| 8 | `src/components/blocks/final/index.tsx` | body 237/240/251/433 |
| 9 | `src/app/page.tsx` (UA home) | body 208/209/256/272 |
| 10 | `src/components/blocks/reasons/index.tsx` | body 170 + bullets |

Also flagged: `vs-freelancers/index.tsx` (hero 217/809, body 224/816), `outcome/index.tsx` (body 188/190/205/219), `contact-split/index.tsx` (body 2× `<em>проєкт</em>`), `vertical-timeline/index.tsx` (3× body), `homepage/index.tsx:886` (`<em>24</em>` in pullquote).

### Files where `<em>` stays (heading-only)

`hero/index.tsx` (H1), `cta-banner/index.tsx`, `turnkey-list/index.tsx`, `team-cards/index.tsx`, `team-section.tsx`, `page-hero/index.tsx` (H1 receives em via children), `about/page.tsx` (10 of 10 in H2s), `homepage/index.tsx` H2s at 210/584/676/850/988.

**Deliverable for C2.4:** ~80 inline `<em>` to remove from body, ~70 to keep in headings. Plus narrow the global CSS hack in `globals.css:51-55`.

---

## 4. Hardcoded English on UA routes

### Category A — Eyebrow labels (numbered "/ NN LABEL")

| File:Line | String | UA route |
|---|---|---|
| `src/components/homepage/index.tsx:86` | `"TRUSTED BY 47+ BUSINESSES IN UA · EU · US · DK"` | `/` Marquee |
| `src/components/homepage/index.tsx:207` | `"/ 03 SOLUTIONS"` | `/` Industries |
| `src/components/homepage/index.tsx:581` | `"/ 04 WHY US"` | `/` Reasons |
| `src/components/homepage/index.tsx:673` | `"/ 06 CASES"` | `/` Cases |
| `src/components/homepage/index.tsx:847` | `"/ 07 STACK"` | `/` Bento |
| `src/components/homepage/index.tsx:985` | `"/ 09 GET IN TOUCH"` | `/` FinalCta3 |
| `src/components/homepage/process.tsx:23` | `"/ 05 PROCESS · 4-10 WEEKS END-TO-END"` | `/` Process |
| `src/components/blocks/turnkey-list/index.tsx:92` | `"/ 02 TURNKEY"` | `/` and any TurnkeyList user |
| `src/app/page.tsx:199` | `"CODE-SITE.ART · BOUTIQUE STUDIO"` | `/` Hero |
| `src/app/about/page.tsx:506-631` | `"/ 02 ABOUT"`, `"/ 03 FOUNDER"`, `"/ 04 TEAM"`, `"/ 05 VALUES"`, `"/ 06 STACK"`, `"/ 07 DIFFERENCE"`, `"/ 08 PROCESS"`, `"/ 09 CASES"`, `"/ 10 GET IN TOUCH"` | `/about` |
| `src/app/pricing/page.tsx:478-551` | `"/ 02 INCLUDED"`, `"/ 03 NOT INCLUDED"`, `"/ 04 ADD-ONS"`, `"/ 05 PAYMENT"` | `/pricing` |
| `src/app/portfolio/_nbyg-kobenhavn/page.tsx:351,377,401,430` | `"/ CASE STUDY"`, `"/ 02 PROBLEM"`, `"/ 03 SOLUTION"`, `"/ 04 OUTCOME"` | `/portfolio/nbyg-kobenhavn` |
| `src/app/portfolio/_efedra-clinic/page.tsx:368,393,424,458` | `"/ CASE STUDY"`, `"/ 02 CHALLENGE"`, `"/ 03 SOLUTION"`, `"/ 04 OUTCOME"` | `/portfolio/efedra-clinic` |
| `src/components/case-page/index.tsx:621` | `eyebrow || "/ CASE STUDY"` | all case pages fallback |
| `src/app/stories/team-cards/page.tsx:8` | `"/ 04 TEAM"` | `/stories/team-cards` |
| `src/app/stories/image-text/page.tsx:110-174` | `"/ 02 ABOUT"`, `"/ 03 FOUNDER"`, `"/ 04 TEAM"`, `"/ 06 PROCESS"`, `"/ 09 STUDIO"` | stories |

**Note:** `vs-wordpress`, `vs-freelancers`, `vs-constructors` UA blocks already use Ukrainian eyebrows (correctly localized) — only EN counterparts use English. Skip these for C2.7.

### Category B — Pricing tier badge

| File:Line | String | Route |
|---|---|---|
| `src/app/page.tsx:41` | `popularLabel: "★ MOST POPULAR"` | `/` |
| `src/app/pricing/page.tsx:131` | `popularLabel: "★ MOST POPULAR"` | `/pricing` |
| `src/components/vs-wordpress/index.tsx:602` | `popularLabel: "★ MOST POPULAR"` | `/vs/wordpress` UA |
| `src/components/vs-constructors/index.tsx:611` | `popularLabel: "★ MOST POPULAR"` | `/vs/constructors` UA |

### Category C — Process step names

| File:Line | String | Route |
|---|---|---|
| `src/components/homepage/process.tsx:15-19` | `"Brief"`, `"Design"`, `"Development"`, `"Testing"`, `"Launch + Support"` + EN durations (`"1 day · free"`, `"1-2 weeks"`, etc.) | `/` Process |
| `src/components/homepage/index.tsx:379-382` | Bento process: `"Brief"`, `"Design"`, `"Launch"` + `"wk 1"`/`"wk 4"` | `/` Bento |
| `src/components/homepage/index.tsx:406` | Bento price-name: `"Industry"` | `/` Bento |

### Category D — MetaStrip / Mock form labels

| File:Line | String | Issue |
|---|---|---|
| `src/components/case-page/index.tsx:198-200` | `industry: "Industry"`, `region: "Region"`, `year: "Year"` (label object) | UA case pages — labels EN, values localized |
| `src/components/blocks/outcome/index.tsx:76` | `"Запис на консультацію"` | UA hardcoded — **leaks to EN routes** (inverse problem) |
| `src/components/blocks/outcome/index.tsx:79` | `"Олена Петрова"` | UA leaks to EN |
| `src/components/blocks/outcome/index.tsx:83` | `"+380 ··"` | UA leaks to EN |
| `src/components/blocks/outcome/index.tsx:90` | `"Стоматологія / гігієна"` | UA leaks to EN |
| `src/components/blocks/outcome/index.tsx:93` | `"Записатися"` | UA leaks to EN |

### Category E — Fabricated metric labels

| File:Line | String |
|---|---|
| `src/components/blocks/reasons/index.tsx:44` | `src: "GLOBAL DATA · 2024"` |
| `src/components/blocks/reasons/index.tsx:65` | `src: "BENCHMARK · 2025"` |

**Decision needed for C2.6/C2.7**: Two viable approaches:

1. **Localize eyebrows + numbers** (`/ 03 РІШЕННЯ`, `/ 04 ЧОМУ МИ`, `/ 05 ПРОЦЕС` …). Keep numbering continuous (no gaps). Maintain UA/EN parity.
2. **Drop continuous numbering entirely.** Make eyebrows simple section tags (`РІШЕННЯ`, `ПРОЦЕС`, `КЕЙСИ`). Less visual noise, removes the "08/09/10 stutter" problem in design-review #6.

Recommendation: **option 2** (drop numbering). It removes a whole class of bugs (mismatched UA/EN numbers, gaps) and reads cleaner. Apply uniformly across homepage, about, pricing, portfolio, stories.

---

## 5. Form wiring audit

### 5a. Newsletter (`src/components/homepage/newsletter.tsx`)

**Submit handler — lines 18–24:**
```tsx
<form
  className="hp-news-form"
  onSubmit={(e) => {
    e.preventDefault();
    setSubmitted(true);
  }}
>
```

- **API call:** None.
- **State:** `submitted: false → true` (one-way; never reset).
- **UI on submit:** Button label swaps from `t("button")` to `t("success")` (line 34). Form not cleared, not disabled, no toast. Email value persists in input.
- **Validation:** Only HTML `required` + `type="email"`. No `aria-invalid`, no error UI.

### 5b. Calculator LeadForm (`src/components/calculator/LeadForm.tsx`)

**Submit handler — lines 56–66:**
```tsx
const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // TODO: connect this payload to existing API/contact endpoint when backend is ready.
  console.info("Website calculator lead payload", { form, input, estimate });
  setStatus("success");
};
```

- **API call:** None. Logs to `console.info`.
- **Validation:** Only HTML `required` on `name` (101) and `contact` (118). No `aria-invalid`, no format check.
- **Payload memo (lines 36–54, embedded as hidden input line 187):**
  ```ts
  {
    form: { name, contact, company, projectBrief, preferredMethod: "email"|"telegram"|"whatsapp" },
    calculator: {
      input,    // CalculatorInput
      estimate, // CalculatorEstimate
      summary: { range: "€X - €Y", maintenanceMonthly: "€Z" }
    }
  }
  ```
- **Success UI:** `<div className="calc-success">` line 193. Form not cleared.

### 5c. `/api/lead` endpoint (`src/app/api/lead/route.ts`)

- **70 lines, single handler.** `POST` only (line 38). No `GET`, no `OPTIONS`, no CORS, no rate-limiting, no auth.
- **Body shape — lines 6–15 (FLAT, not nested):**
  ```ts
  type LeadPayload = {
    name?: string;
    contact?: string;
    business?: string;
    tier?: string;
    budget?: string;
    timeline?: string;
    description?: string;
    source?: string;
  };
  ```
- **No schema validation** (no Yup/Zod). All fields optional; missing → `—` or skipped via `line()` helper (lines 22–23).
- **What it does:** Builds Telegram MarkdownV2 message (21–36), `POST`s to `https://api.telegram.org/bot{TOKEN}/sendMessage` if `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` env set (43–59). Otherwise logs `[LEAD] <msg>` server-side. Always returns `{ok:true}` 200 or `{ok:false}` 500.
- **Existing callers** use the flat shape with `source` (see commit `7807129 feat(lead-form): wire ?source= URL param into POST body`).

### ⚠️ Contract gap for C2.14

LeadForm's nested `{form, calculator}` payload does NOT match `/api/lead`'s flat schema. Options:
1. **Flatten in LeadForm before POST** — map `form.name → name`, `form.contact → contact`, serialize `calculator.summary.range + estimate breakdown → description`, `source: "calculator"`.
2. **Extend the endpoint** to accept a richer payload (add Yup/Zod schema, support both shapes). More work, but lets calculator data survive intact to Telegram.

Recommendation: **option 1** (flatten in LeadForm). Smaller blast radius; the Telegram message is for the human reading it, not for downstream parsing. Calculator summary serialized into `description` field gives operator the full context.

---

## 6. Production deploy state

### Recent merges to `master`
```
a264fe7 Merge fix/sprint-1-followups: 8 follow-up fixes from QA pass   ← latest
a53c17e Merge pull request #2 from cyanidium1/audit-sprint-1
eeb10c4 Merge pull request #1 from cyanidium1/audit-sprint-1
956f326 Merge branch 'feat/i18n-medicine-en'
```
Last 5 linear commits: `a264fe7, 779f797, cb0d8fd, 94976e8, 58ea406` — all Sprint 1 / Sprint 1 follow-ups.

### Was `audit-sprint-2a` merged?
**No.** Branches `audit-sprint-2a` and `audit-sprint-2bc` exist locally and on `origin`, but neither has been merged to `master`. `git log --merges` shows zero merges from those branches. No Sprint 2 work has reached master.

### `/blog` — why it shows "Скоро"
`src/app/blog/page.tsx` (full 34 lines) is a **hardcoded stub** — no Sanity fetch, no posts, no `[slug]` route. Hardcodes heading "Скоро" (line 25), eyebrow "/ БЛОГ", sets `robots: { index: false, follow: false }` (line 9). Only file under `src/app/blog/` is this `page.tsx`.

**Real blog work exists on unmerged `audit-sprint-2bc` branch:**
```
80528e3 fix(seo): P0.1 — fix empty pages for /blog, /vs/*, /sites-for/legal
e68a323 feat(blog): listing page /blog
cd0d5fc feat(blog): post page /blog/[slug] with JSON-LD Article + FAQPage
fb68246 feat(sanity): mirror blogPost queries and types from admin
d47f444 feat(blog): EN routes /en/blog and /en/blog/[slug]
```

Sanity blog schema is already on master (`src/lib/sanity/queries.ts:60-68` as `BLOG_POST_REF`), but no page consumes it. Sanity client wiring (`client.ts`, `fetch.ts`, `queries.ts`, `types.ts`, `image.tsx`) all present.

### Implication for C2.15

Three options, ordered by recommendation:

1. **Merge `audit-sprint-2bc` → master** (or cherry-pick the 5 blog commits onto this branch). Carries listing + `[slug]` + queries + EN slug map. Fastest path to real `/blog` content.
2. **Hide `/blog` link** from nav (`src/components/homepage/header-services.ts` + `hp-header.tsx`) and footer (`hp-footer.tsx`) until merge happens.
3. **Worst case:** keep stub but ensure no internal links point to it.

Decision deferred to user — Sprint 2D scope says "investigate and either fix or hide". Either is one-commit.

---

## 7. `/process` homepage step animation bug

### Component trigger (`src/components/homepage/process.tsx:39-63`)

- IntersectionObserver on `wrapRef`, `threshold: 0.35`, `rootMargin: "0px 0px -10% 0px"`.
- On first intersection: `setVisible(true)` + `io.disconnect()` (one-shot).
- Adds `is-visible` class to `.hp-process-track` (line 77).
- Each `<li className="hp-process-step">` sets inline `--i: i` (lines 89–92) for stagger.

### CSS — initial vs animated state (`src/components/homepage/homepage.css:913-924`)

```css
.hp-process-step {
  position: relative;
  z-index: 1;
  opacity: 0;                                        /* ← BASELINE 0 — the bug */
  transform: translateY(10px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: calc(var(--i, 0) * 0.32s);      /* stagger: 0, 0.32, 0.64, 0.96, 1.28s */
}
.hp-process-track.is-visible .hp-process-step {
  opacity: 1;
  transform: translateY(0);
}
```
Reduced-motion override (926–934) snaps to `opacity: 1`. Rocket `.hp-process-line` animates width `0 → 100%` over 3s (874–888).

### Diagnosis

- **Baseline `opacity: 0`** confirmed (line 916).
- All 5 steps share one observer; once `is-visible` lands, stagger reveals them over ~1.28s + 0.7s ≈ **~2 seconds**.
- Reviewer's "only step 01 visible at initial viewport" happens because:
  - At page top, wrapper hasn't crossed 0.35 threshold → no `is-visible` → all 5 invisible (opacity 0).
  - On scroll-past, the long staggered fade-in means at any frozen moment only 1–2 are visible.
  - Even step 01 may not actually be "visible at initial viewport" — the perception is just that 01 appears first.

### C2.16 fix confirmation

The proposed fix `baseline opacity: 0.3, animate to 1.0` will work but additionally consider:
- Reduce stagger multiplier: `0.32s × 4 = 1.28s` is too long. Drop to `0.15s × 4 = 0.6s` total.
- Lower threshold to `0.15` so trigger fires when section is barely in view, not 35%.
- Without these, even with baseline 0.3 the last step still takes ~2s to fully appear.

### Key file:line references for Phase 1

| What | Where |
|---|---|
| Newsletter submit | `src/components/homepage/newsletter.tsx:18-24` |
| LeadForm submit | `src/components/calculator/LeadForm.tsx:56-66` |
| LeadForm payload memo | `src/components/calculator/LeadForm.tsx:36-54` |
| `/api/lead` handler | `src/app/api/lead/route.ts:38-68` |
| `/api/lead` body type | `src/app/api/lead/route.ts:6-15` |
| Blog stub | `src/app/blog/page.tsx:12-34` (entire file) |
| Sanity blog query (unused on master) | `src/lib/sanity/queries.ts:60-68` |
| Process IO observer | `src/components/homepage/process.tsx:42-63` |
| Process step baseline CSS | `src/components/homepage/homepage.css:913-920` |
| Process step animated CSS | `src/components/homepage/homepage.css:921-924` |
| Process reduced-motion fallback | `src/components/homepage/homepage.css:926-934` |
| Global em hack | `src/app/globals.css:51-55` |
| Hero H1 em fake-serif | `src/components/blocks/hero/hero.css:223-231` |

---

## Open decisions (need approval before Phase 1)

1. **Eyebrow strategy (C2.6/C2.7):** localize numbers, or drop numbering entirely? Recommend **drop**.
2. **`/api/lead` payload (C2.14):** flatten in LeadForm, or extend endpoint with Zod schema? Recommend **flatten**.
3. **`/blog` strategy (C2.15):** cherry-pick `audit-sprint-2bc` blog commits, or just hide nav links? Recommend **hide nav for now** (cherry-pick risks Sprint 2BC conflicts; can do as separate sprint).
4. **Price format (C2.11):** `$1,000` US or `$1 000` UA NBSP? Recommend **`$1,000` US** (consistent w/ Tailwind/dev tooling; UA users read both formats).
5. **Section padding standard (C2.2):** 100/56 (dominant) or 80/56 (closer to `.hp-section`)? Recommend **100/56** since 12+ blocks already use it; migrate `.hp-section` up rather than newer blocks down.

Stop after commit. Awaiting approval.
