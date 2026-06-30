# Calculator Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the website-cost calculator per `code-site-workspace/docs/calculator-simplification.md` — customizer-only (drop presets), remove recurring plans, keep only `howItWorks` marketing, single-number estimate (drop range), timeline becomes a flat additive fee (multipliers kept only for languages + design), all option copy consolidated into one `calculatorConfig` Sanity singleton, and hints moved into an on-demand `InfoHint` (i) popover.

**Architecture:** Two repos. Sanity admin (`code-site-solutions-admin`) collapses 13 fixed-`_id` calculator singletons into one `calculatorConfig` singleton (a data migration copies surviving collections in; maintenance/seoGrowth/presets are dropped). Frontend (`code-site-solutions`) rewrites the GROQ query + config-shaping + types to read the one doc, simplifies the pure pricing engine (TDD), and trims the React components.

**Tech Stack:** Sanity Studio v5 / `@sanity/client` v7 / `tsx` scripts (admin); Next.js 15 App Router, next-intl, Tailwind, `node:test` via `node --import tsx --test` (frontend).

**Granularity note (adaptation):** This is a large two-repo refactor. Tasks below give full code for the *load-bearing* pieces (singleton schema, migration, query, types, engine + tests, `InfoHint`) and exact file-level instructions for mechanical deletions/trims. Execute in phase order — later phases depend on earlier ones. Commit after each task.

**Decisions locked** (from the proposal doc): A=multipliers only for languages+design, timeline→flat additive, drop range. B=customizer-only. C=keep `howItWorks` only. D=remove recurring. §H=`InfoHint` (i) popover.

**⚠ Review-before-apply pricing call:** timeline `percent`→`price` needs real € amounts. Defaults used here: `standard 0`, `faster 600`, `urgent 1200`. These are editable in the CMS singleton — confirm/adjust during Phase 2 review.

---

## Phase 0 — Safety & branches

### Task 0.1: Branch both repos
**Files:** none (git)

- [ ] **Step 1: Frontend branch**
Run in `C:\GitHub23\code-site-solutions`:
```bash
git checkout -b feat/calculator-simplification
```
- [ ] **Step 2: Admin branch**
Run in `C:\GitHub23\code-site-solutions-admin`:
```bash
git checkout -b feat/calculator-singleton
```

### Task 0.2: Back up live calculator dataset
**Files:** Create `code-site-solutions-admin/backups/calculator-pre-singleton/` (gitignored — confirm it is ignored, like the blog backup precedent)

- [ ] **Step 1: Export the 13 calculator docs to JSON**
Create `scripts/backup-calculator-docs.ts` (mirror `seed-calculator-v2.ts` client setup):
```ts
import {createClient} from '@sanity/client'
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs'
import {resolve} from 'node:path'

// Load token like the other scripts (.env.local: SANITY_AUTH_TOKEN / project id)
const env = Object.fromEntries(
  readFileSync(resolve('.env.local'), 'utf8')
    .split('\n').filter(Boolean).filter((l) => !l.startsWith('#'))
    .map((l) => {const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]}),
)
const client = createClient({
  projectId: '4lk0x7o9', dataset: 'production', apiVersion: '2024-01-01',
  token: env.SANITY_AUTH_TOKEN ?? env.SANITY_API_WRITE_TOKEN, useCdn: false,
})
const IDS = [
  'calculatorProjectTypes','calculatorPresets','calculatorCmsOptions','calculatorSeoOptions',
  'calculatorFeatureOptions','calculatorLanguageOptions','calculatorDesignOptions',
  'calculatorTimelineOptions','calculatorMaintenanceOptions','calculatorSeoGrowthOptions',
  'calculatorContentOptions','calculatorProductComplexityOptions','calculatorSettings',
]
const docs = await client.fetch(`*[_id in $ids]`, {ids: IDS})
mkdirSync('backups/calculator-pre-singleton', {recursive: true})
writeFileSync('backups/calculator-pre-singleton/docs.json', JSON.stringify(docs, null, 2))
console.log(`Backed up ${docs.length} docs`)
```
- [ ] **Step 2: Run it**
```bash
npx tsx scripts/backup-calculator-docs.ts
```
Expected: `Backed up 13 docs` and a populated `backups/calculator-pre-singleton/docs.json`.
- [ ] **Step 3: Confirm gitignore** — verify `backups/` is ignored (`git status` shows the folder untracked/ignored). Do NOT commit the backup.

---

## Phase 1 — CMS singleton schema (admin)

### Task 1.1: Author the `calculatorConfig` singleton schema
**Files:**
- Create: `code-site-solutions-admin/schemaTypes/documents/calculatorConfig.ts`

Mirror the existing field shapes (from the 13 docs) but in one document. Timeline carries `price` (not `percent`). No maintenance/seoGrowth/presets. Settings inline (no `highEstimateFactor`).

- [ ] **Step 1: Create the schema file**
```ts
import {defineType, defineField, defineArrayMember} from 'sanity'
import {requireLocalizedUk} from '../validation' // match path used by existing docs

const ukReq = (msg: string) => (r: any) => requireLocalizedUk(msg)(r)

export const calculatorConfig = defineType({
  name: 'calculatorConfig',
  title: 'Калькулятор — конфігурація',
  type: 'document',
  // Singleton: pinned to _id 'calculatorConfig' via structure/index.ts
  groups: [
    {name: 'core', title: 'Основне'},
    {name: 'modifiers', title: 'Модифікатори'},
    {name: 'addons', title: 'Додатки'},
    {name: 'settings', title: 'Налаштування'},
  ],
  fields: [
    // ---- settings (flat) ----
    defineField({
      name: 'defaultProjectType', title: 'Тип за замовчуванням', type: 'string', group: 'settings',
      options: {list: ['landing', 'multiPage', 'ecommerce']}, initialValue: 'multiPage',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'roundStep', title: 'Крок округлення (USD)', type: 'number', group: 'settings',
      initialValue: 50, validation: (r) => r.required().min(1),
    }),

    // ---- projectTypes ----
    defineField({
      name: 'projectTypes', title: 'Типи проєктів', type: 'array', group: 'core',
      of: [defineArrayMember({type: 'object', name: 'projectTypeRow', fields: [
        defineField({name: 'projectKey', title: 'Ключ', type: 'string',
          validation: (r) => r.required().regex(/^[a-z][a-zA-Z0-9]*$/, {name: 'camelCase'}).max(40)}),
        defineField({name: 'label', title: 'Назва', type: 'localizedString', validation: ukReq('UK обовʼязкова')}),
        defineField({name: 'hint', title: 'Підказка', type: 'localizedText'}),
        defineField({name: 'basePrice', title: 'Базова ціна (USD)', type: 'number', validation: (r) => r.required().min(0)}),
        defineField({name: 'hasProductComplexity', title: 'Показувати складність товарів', type: 'boolean', initialValue: false}),
        defineField({name: 'pages', title: 'Сторінки', type: 'object', fields: [
          defineField({name: 'min', type: 'number', validation: (r) => r.required().min(1)}),
          defineField({name: 'max', type: 'number', validation: (r) => r.required().min(1)}),
          defineField({name: 'defaultValue', type: 'number', validation: (r) => r.required()}),
          defineField({name: 'included', type: 'number', validation: (r) => r.required().min(0)}),
          defineField({name: 'extraPrice', type: 'number', validation: (r) => r.required().min(0)}),
        ]}),
      ]})],
    }),

    // ---- productComplexity ----
    defineField({
      name: 'productComplexity', title: 'Складність товарів', type: 'array', group: 'core',
      of: [defineArrayMember({type: 'object', name: 'productComplexityOption', fields: [
        defineField({name: 'optionKey', type: 'string', options: {list: ['simple','medium','advanced']}, validation: (r) => r.required()}),
        defineField({name: 'label', type: 'localizedString', validation: ukReq('UK обовʼязкова')}),
        defineField({name: 'hint', type: 'localizedText'}),
        defineField({name: 'price', type: 'number', initialValue: 0, validation: (r) => r.min(0)}),
      ]})],
    }),

    // ---- design (keeps percent multiplier) ----
    defineField({
      name: 'design', title: 'Дизайн (множник)', type: 'array', group: 'modifiers',
      of: [defineArrayMember({type: 'object', name: 'designOption', fields: [
        defineField({name: 'optionKey', type: 'string', options: {list: ['simple','custom','advanced']}, validation: (r) => r.required()}),
        defineField({name: 'label', type: 'localizedString', validation: ukReq('UK обовʼязкова')}),
        defineField({name: 'hint', type: 'localizedText'}),
        defineField({name: 'percent', title: 'Множник (0–1)', type: 'number', validation: (r) => r.required().min(0).max(1)}),
        defineField({name: 'previews', type: 'array', of: [defineArrayMember({type: 'object', name: 'designPreview', fields: [
          defineField({name: 'src', type: 'string', validation: (r) => r.required()}),
          defineField({name: 'caption', type: 'localizedString'}),
        ]})]}),
      ]})],
    }),

    // ---- languages (keeps percent multiplier) ----
    defineField({
      name: 'languages', title: 'Мови (множник)', type: 'array', group: 'modifiers',
      of: [defineArrayMember({type: 'object', name: 'languageOption', fields: [
        defineField({name: 'optionKey', type: 'string', options: {list: ['one','two','three','fourPlus']}, validation: (r) => r.required()}),
        defineField({name: 'label', type: 'localizedString', validation: ukReq('UK обовʼязкова')}),
        defineField({name: 'percent', title: 'Множник (0–1)', type: 'number', validation: (r) => r.required().min(0).max(1)}),
      ]})],
    }),

    // ---- timeline (NOW flat price, additive) ----
    defineField({
      name: 'timeline', title: 'Терміни (додатково, USD)', type: 'array', group: 'modifiers',
      of: [defineArrayMember({type: 'object', name: 'timelineOption', fields: [
        defineField({name: 'optionKey', type: 'string', options: {list: ['standard','faster','urgent']}, validation: (r) => r.required()}),
        defineField({name: 'label', type: 'localizedString', validation: ukReq('UK обовʼязкова')}),
        defineField({name: 'hint', type: 'localizedText'}),
        defineField({name: 'price', title: 'Доплата (USD)', type: 'number', initialValue: 0, validation: (r) => r.required().min(0)}),
      ]})],
    }),

    // ---- contentOptions ----
    defineField({
      name: 'contentOptions', title: 'Контент', type: 'array', group: 'addons',
      of: [defineArrayMember({type: 'object', name: 'contentOption', fields: [
        defineField({name: 'optionKey', type: 'string', options: {list: ['clientProvided','lightPolishing','fullCopywriting','seoCopywriting']}, validation: (r) => r.required()}),
        defineField({name: 'label', type: 'localizedString', validation: ukReq('UK обовʼязкова')}),
        defineField({name: 'price', type: 'number', initialValue: 0, validation: (r) => r.min(0)}),
      ]})],
    }),

    // ---- cmsUpgrades ----
    defineField({
      name: 'cmsUpgrades', title: 'CMS', type: 'array', group: 'addons',
      of: [defineArrayMember({type: 'object', name: 'cmsOption', fields: checkboxOptionFields()})],
    }),
    // ---- seoOptions ----
    defineField({
      name: 'seoOptions', title: 'SEO', type: 'array', group: 'addons',
      of: [defineArrayMember({type: 'object', name: 'seoOption', fields: checkboxOptionFields()})],
    }),
    // ---- features (has featureGroup) ----
    defineField({
      name: 'features', title: 'Функціонал', type: 'array', group: 'addons',
      of: [defineArrayMember({type: 'object', name: 'featureOption', fields: [
        ...checkboxOptionFields(),
        defineField({name: 'featureGroup', title: 'Підгрупа', type: 'string', options: {list: [
          {title: 'Lead capture', value: 'leadCapture'},
          {title: 'Conversion & tracking', value: 'conversion'},
          {title: 'Advanced UX', value: 'advancedUx'},
        ]}, validation: (r) => r.required()}),
      ]})],
    }),
  ],
  preview: {prepare: () => ({title: 'Калькулятор — конфігурація'})},
})

function checkboxOptionFields() {
  return [
    defineField({name: 'optionKey', type: 'string', validation: (r: any) => r.required()}),
    defineField({name: 'label', type: 'localizedString', validation: ukReq('UK обовʼязкова')}),
    defineField({name: 'hint', type: 'localizedText'}),
    defineField({name: 'price', type: 'number', initialValue: 0, validation: (r: any) => r.min(0)}),
    defineField({name: 'included', type: 'boolean', initialValue: false}),
  ]
}
```
> **Verify before coding:** confirm the exact import path/name of `requireLocalizedUk` from an existing doc (e.g. `calculatorProjectTypes.ts`) and copy it verbatim. If the helper isn't exported where assumed, match the existing import line exactly.

- [ ] **Step 2: Register in `schemaTypes/index.ts`**
Add `import {calculatorConfig} from './documents/calculatorConfig'` and add `calculatorConfig` to the `schemaTypes` array (near the other calculator entries). Leave the 13 old schemas registered for now (the migration reads them; removal is Phase 7).

- [ ] **Step 3: Typecheck the studio**
```bash
npx tsc --noEmit
```
Expected: no errors from `calculatorConfig.ts`.

- [ ] **Step 4: Commit**
```bash
git add schemaTypes/documents/calculatorConfig.ts schemaTypes/index.ts
git commit -m "feat(calc): add calculatorConfig singleton schema"
```

### Task 1.2: Add the singleton to Studio structure
**Files:** Modify `code-site-solutions-admin/structure/index.ts`

- [ ] **Step 1:** Add a top-level singleton list item (mirror the existing `calculatorSettings` singleton pattern), placed above the old calculator submenu:
```ts
S.listItem()
  .title('Калькулятор — конфігурація')
  .id('calculatorConfig')
  .child(S.document().schemaType('calculatorConfig').documentId('calculatorConfig')),
```
Keep the old calculator submenu entries for now (removed in Phase 7).
- [ ] **Step 2: Commit**
```bash
git add structure/index.ts
git commit -m "feat(calc): surface calculatorConfig singleton in studio structure"
```

---

## Phase 2 — Data migration (admin)

### Task 2.1: Migration script (dry-run first)
**Files:** Create `code-site-solutions-admin/scripts/migrate-calculator-to-singleton.ts`; Modify `package.json` scripts.

- [ ] **Step 1: Write the migration**
Reads the surviving source docs, composes one `calculatorConfig` doc, prints it on dry-run, writes on `--apply`. Timeline percent→price via the locked defaults. Preserves `_key`s.
```ts
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'

const env = Object.fromEntries(
  readFileSync(resolve('.env.local'), 'utf8').split('\n').filter(Boolean)
    .filter((l) => !l.startsWith('#'))
    .map((l) => {const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]}),
)
const client = createClient({
  projectId: '4lk0x7o9', dataset: 'production', apiVersion: '2024-01-01',
  token: env.SANITY_AUTH_TOKEN ?? env.SANITY_API_WRITE_TOKEN, useCdn: false,
})
const APPLY = process.argv.includes('--apply')

// Locked timeline percent->price map (review value). Anything not listed -> 0.
const TIMELINE_PRICE: Record<string, number> = {standard: 0, faster: 600, urgent: 1200}

const src = await client.fetch(`{
  "projectTypes": *[_id == "calculatorProjectTypes"][0].types,
  "productComplexity": *[_id == "calculatorProductComplexityOptions"][0].options,
  "design": *[_id == "calculatorDesignOptions"][0].options,
  "languages": *[_id == "calculatorLanguageOptions"][0].options,
  "timeline": *[_id == "calculatorTimelineOptions"][0].options,
  "contentOptions": *[_id == "calculatorContentOptions"][0].options,
  "cmsUpgrades": *[_id == "calculatorCmsOptions"][0].options,
  "seoOptions": *[_id == "calculatorSeoOptions"][0].options,
  "features": *[_id == "calculatorFeatureOptions"][0].options,
  "settings": *[_id == "calculatorSettings"][0]{defaultProjectType, roundStep}
}`)

const doc = {
  _id: 'calculatorConfig',
  _type: 'calculatorConfig',
  defaultProjectType: src.settings?.defaultProjectType ?? 'multiPage',
  roundStep: src.settings?.roundStep ?? 50,
  projectTypes: src.projectTypes ?? [],
  productComplexity: src.productComplexity ?? [],
  design: src.design ?? [],
  languages: src.languages ?? [],
  timeline: (src.timeline ?? []).map((o: any) => {
    const {percent: _drop, ...rest} = o
    return {...rest, price: TIMELINE_PRICE[o.optionKey] ?? 0}
  }),
  contentOptions: src.contentOptions ?? [],
  cmsUpgrades: src.cmsUpgrades ?? [],
  seoOptions: src.seoOptions ?? [],
  features: src.features ?? [],
}

if (!APPLY) {
  console.log('DRY RUN — composed calculatorConfig:')
  console.log(JSON.stringify(doc, null, 2))
  console.log('\nCounts:', Object.fromEntries(
    ['projectTypes','productComplexity','design','languages','timeline','contentOptions','cmsUpgrades','seoOptions','features']
      .map((k) => [k, (doc as any)[k].length]),
  ))
  console.log('\nRe-run with --apply to write.')
} else {
  await client.createOrReplace(doc)
  console.log('Applied: calculatorConfig written.')
}
```
- [ ] **Step 2: Add package.json script**
```json
"migrate:calculator-singleton": "tsx scripts/migrate-calculator-to-singleton.ts"
```
- [ ] **Step 3: Dry-run**
```bash
npm run migrate:calculator-singleton
```
Expected: prints the composed doc + non-zero counts for each array; timeline rows show `price` (0/600/1200) and no `percent`.
- [ ] **Step 4: REVIEW CHECKPOINT** — confirm counts match the live data and the timeline prices are acceptable (adjust `TIMELINE_PRICE` if needed). **Pause for user sign-off before applying.**
- [ ] **Step 5: Apply**
```bash
npm run migrate:calculator-singleton -- --apply
```
Expected: `Applied: calculatorConfig written.` Then open Studio → the singleton shows all arrays populated.
- [ ] **Step 6: Commit script**
```bash
git add scripts/migrate-calculator-to-singleton.ts scripts/backup-calculator-docs.ts package.json
git commit -m "feat(calc): migration to fold 13 calculator docs into calculatorConfig singleton"
```

---

## Phase 3 — Frontend config plumbing

### Task 3.1: Rewrite the GROQ query
**Files:** Modify `code-site-solutions/src/lib/server/sanity-queries.ts` (`CALCULATOR_CONFIG_QUERY`).

- [ ] **Step 1:** Replace the whole `CALCULATOR_CONFIG_QUERY` with a single-doc read (drops presets/maintenance/seoGrowth; timeline `price`):
```ts
export const CALCULATOR_CONFIG_QUERY = /* groq */ `*[_id == "calculatorConfig"][0]{
  "settings": { defaultProjectType, roundStep },
  "projectTypes": projectTypes[]{ _key, projectKey, label { uk, ru, en }, hint { uk, ru, en }, basePrice, hasProductComplexity, pages },
  "productComplexityOptions": productComplexity[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price },
  "designOptions": design[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, percent, "previews": previews[]{ _key, src, caption { uk, ru, en } } },
  "languageOptions": languages[]{ _key, optionKey, label { uk, ru, en }, percent },
  "timelineOptions": timeline[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price },
  "contentOptions": contentOptions[]{ _key, optionKey, label { uk, ru, en }, price },
  "cmsOptions": cmsUpgrades[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price, included },
  "seoOptions": seoOptions[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price, included },
  "featureOptions": features[]{ _key, optionKey, label { uk, ru, en }, hint { uk, ru, en }, price, included, featureGroup }
}`
```
- [ ] **Step 2: Commit** (`git commit -m "refactor(calc): query single calculatorConfig doc"`)

### Task 3.2: Update shared pricing types
**Files:** Modify `src/types/pricing.ts`.

- [ ] **Step 1:** In `CalculatorInput` remove `maintenancePlan` and `seoGrowthPlan`. In `CalculatorEstimate`: remove `lowEstimate`, `highEstimate`, `monthlyMaintenance`; in `breakdown` remove `timelinePercent`, add `timelineCost: number`. Remove the now-unused exported types `MaintenancePlan`, `SeoGrowthPlan`, `PackagePreset`. Keep `TimelineOption`. (Grep the repo for each removed symbol first — see Task 5.x consumers.)
- [ ] **Step 2: Commit.**

### Task 3.3: Update CalculatorConfig types
**Files:** Modify `src/types/calculator-config.ts`.

- [ ] **Step 1:** Remove `ConfigMaintenance`, `ConfigSeoGrowth`, `ConfigPreset`, and the `FeatureGroup` stays. Change `timeline` from `ConfigPercentOption<TimelineOption>[]` to `ConfigPriceOption<TimelineOption>[]` **plus** an optional `hint` — define a small dedicated type:
```ts
export type ConfigTimelineOption = {
  key: TimelineOption;
  label: string;
  hint?: string;
  price: number;
};
```
In `CalculatorConfig`: remove `maintenance`, `seoGrowth`, `presets`; set `timeline: ConfigTimelineOption[]`; in `settings` remove `highEstimateFactor` and `seoGrowthRecommendedBadge`.
- [ ] **Step 2: Commit.**

### Task 3.4: Update the Sanity result types
**Files:** Modify `src/types/sanity.ts` (calculator section).

- [ ] **Step 1:** Update `CalculatorConfigQueryResult` to the new keys (drop `presets`, `maintenanceOptions`, `seoGrowthOptions`; `timelineOptions` item now has `price` not `percent`). Update/remove `CalculatorPresetItem`, `CalculatorMaintenanceOptionItem`, `CalculatorSeoGrowthOptionItem`. Change the timeline item type to carry `price: number` and `hint`.
- [ ] **Step 2: Commit.**

### Task 3.5: Update `shapeConfig`
**Files:** Modify `src/lib/server/fetch-calculator-config.ts`.

- [ ] **Step 1:** Remove the `productComplexity`/design/etc. unchanged blocks stay; delete the `maintenance`, `seoGrowth`, `presets` mapping blocks; change `timeline` mapping to read `price` (+ `hint`); remove `settings.highEstimateFactor`/`seoGrowthRecommendedBadge`. Update the early-return guard (it currently checks `result.presets?.length` — change to `result.projectTypes?.length && result.featureOptions?.length`). Update the returned object to drop `maintenance/seoGrowth/presets`.
- [ ] **Step 2: Typecheck** (`npx tsc --noEmit`) — expect errors only in not-yet-updated consumers (engine, components, constants). Note them; they're fixed in later phases.
- [ ] **Step 3: Commit.**

### Task 3.6: Update constants + fallback builder
**Files:** Modify `src/constants/calculator-config.ts`, `src/lib/shared/build-config-from-constants.ts`.

- [ ] **Step 1 (constants):** Remove `MAINTENANCE_OPTIONS`, `SEO_GROWTH_OPTIONS`, `PACKAGE_PRESETS`. Change `TIMELINE_OPTIONS` to `{ label; price; hint }` with values `standard{price:0}`, `faster{price:600}`, `urgent{price:1200}`. In `DEFAULT_CALCULATOR_INPUT` remove `maintenancePlan` + `seoGrowthPlan`.
- [ ] **Step 2 (builder):** In `build-config-from-constants.ts` remove the `maintenance`, `seoGrowth`, `presets` blocks; change the `timeline` map to emit `price` (+ `hint`); drop `highEstimateFactor`/`seoGrowthRecommendedBadge` from `settings`; remove the now-unused imports.
- [ ] **Step 3: Commit.**

---

## Phase 4 — Pricing engine (TDD)

### Task 4.1: Update the engine test to the new behavior
**Files:** Modify `src/lib/shared/calculate-website-estimate.test.ts`.

- [ ] **Step 1: Rewrite assertions** — multiplier excludes timeline; timeline is additive (`timelineCost`); no range; no `monthlyMaintenance`. Replace the maintenance test with a timeline test:
```ts
test("default multi-page input returns the expected estimate", () => {
  const r = calculateWebsiteEstimate(baseInput);
  assert.equal(r.breakdown.basePrice, 3500);
  assert.equal(r.breakdown.subtotal, 3500);
  assert.equal(r.breakdown.multiplier, 1);
  assert.equal(r.breakdown.timelineCost, 0);
  assert.equal(r.oneTimeEstimate, 3500);
});

test("timeline is a flat additive fee, not a multiplier", () => {
  const r = calculateWebsiteEstimate({ ...baseInput, timeline: "faster" });
  assert.equal(r.breakdown.timelineCost, 600);
  assert.equal(r.breakdown.multiplier, 1); // unchanged by timeline
  assert.equal(r.breakdown.subtotal, 3500 + 600);
  assert.equal(r.oneTimeEstimate, 4100);
});

test("design + language multipliers stack (timeline excluded)", () => {
  const r = calculateWebsiteEstimate({ ...baseInput, designComplexity: "custom", languages: "two", timeline: "urgent" });
  assert.equal(r.breakdown.multiplier, 1.35);
  assert.equal(r.breakdown.timelineCost, 1200);
  // (3500 + 1200) * 1.35 = 6345 -> round 50 -> 6350
  assert.equal(r.oneTimeEstimate, 6350);
});
```
Keep the existing extra-pages, ecommerce, clamp, and CMS/SEO/feature/content tests (their numbers are unchanged because those inputs use `timeline:"standard"` = +0). Delete the `maintenance plan reports monthly price` test and any `highEstimate`/`lowEstimate` assertions.
- [ ] **Step 2: Run — expect FAIL**
```bash
npm test
```
Expected: the new timeline assertions fail (engine not yet updated).

### Task 4.2: Update the engine
**Files:** Modify `src/lib/shared/calculate-website-estimate.ts`.

- [ ] **Step 1:** Add timeline cost to subtotal, drop timeline from the multiplier, drop the range:
  - Look up `const timeline = config.timeline.find((t) => t.key === input.timeline)!;` then `const timelineCost = timeline.price;`
  - `subtotal = project.basePrice + pageCost + productComplexityCost + cmsCost + seoCost + featureCost + contentCost + timelineCost;`
  - `multiplier = round4(1 + designPercent + languagePercent);` (remove `timelinePercent`)
  - `oneTimeEstimate = round(subtotal * multiplier);` — remove `lowEstimate`/`highEstimate`/`monthlyMaintenance`/`maintenance` lookup.
  - `breakdown`: remove `timelinePercent`, add `timelineCost`; remove low/high.
  - Return `{ breakdown, oneTimeEstimate }`.
- [ ] **Step 2: Run — expect PASS**
```bash
npm test
```
Expected: all engine tests pass.
- [ ] **Step 3: Commit** (`git commit -m "feat(calc): timeline additive + single-number estimate (TDD)"`)

---

## Phase 5 — Frontend UI

### Task 5.1: Build the reusable `InfoHint` (i) popover
**Files:** Create `src/components/ui/InfoHint.tsx`; Modify `src/components/ui/index.ts`.

- [ ] **Step 1: Component** — accessible, works on hover + focus + tap, dismiss on Esc/outside, renders nothing when `text` is empty:
```tsx
"use client";
import { useId, useRef, useState, useEffect } from "react";
import { Info } from "lucide-react";

export function InfoHint({ text, label = "More info" }: { text?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDocClick); document.removeEventListener("keydown", onKey); };
  }, [open]);
  if (!text) return null;
  return (
    <span ref={ref} className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-ink-3 hover:text-accent-soft focus-visible:outline-2 focus-visible:outline-accent-soft cursor-help align-middle"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((v) => !v); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Info size={13} strokeWidth={1.7} />
      </button>
      {open ? (
        <span
          id={id} role="tooltip"
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-[calc(100%+6px)] w-[220px] max-w-[60vw] rounded-[10px] border border-line bg-[oklch(0.14_0.005_300)] px-3 py-2 text-[12px] leading-[1.45] text-ink-dim shadow-[0_8px_24px_oklch(0_0_0_/_0.4)]"
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
```
- [ ] **Step 2:** Export from `src/components/ui/index.ts`: `export { InfoHint } from "./InfoHint";`
- [ ] **Step 3: Typecheck** (`npx tsc --noEmit`) for this file. **Commit.**

### Task 5.2: Delete dropped components
**Files:** Delete `src/components/calculator/MaintenanceTiles.tsx`, `SeoGrowthTiles.tsx`, `presets.ts`.

- [ ] **Step 1:** Delete the three files. **Commit** after the consumers stop importing them (Tasks 5.3–5.4) — or delete now and fix imports immediately in 5.3/5.4 in the same commit to keep the build green.

### Task 5.3: Trim `WebsiteCalculator.tsx`
**Files:** Modify `src/components/calculator/WebsiteCalculator.tsx`.

- [ ] **Step 1:** Remove imports/usages of `MaintenanceTiles`, `SeoGrowthTiles`. Remove the `whyPackages`, `underHood`, and `afterLaunch` `InfoSection` blocks and their card arrays (`whyPackages`, `whyEstimate`). Keep `howItWorks`, the `customizer` section, `SocialProof`, `FAQ`, `GetFinalCta`. Remove `seoGrowthMonthly` calc and the `EstimateSummary` `seoGrowthMonthly` prop. Remove now-unused lucide imports + `config.seoGrowth` reference.
- [ ] **Step 2: Typecheck. Commit.**

### Task 5.4: Trim `CalculatorControls.tsx`
**Files:** Modify `src/components/calculator/CalculatorControls.tsx`.

- [ ] **Step 1 (presets out):** Remove the entire preset `<section>` (the `config.presets.map` block), the `selectedPreset` state, `applyPreset`, `inputForPreset` import, and the preset-related `resetToBasicSetup`→keep reset but it can stay (basicSetupInput). Remove `import { basicSetupInput, inputForPreset } from "./presets"` → since `presets.ts` is deleted, inline `basicSetupInput` logic or move it into this file. Simplest: keep a local `resetToBasicSetup` that builds the basic input inline (copy the body of `basicSetupInput`).
- [ ] **Step 2 (timeline display):** The timeline segmented buttons currently show `formatPercent(option.percent)` — change to `option.price > 0 ? "+" + formatEur(option.price) : t("controls.includedLower")`.
- [ ] **Step 3 (hints → InfoHint):** Replace always-on `<small>{option.hint}</small>` / group-note `<p className={NOTE_CLASS}>{...hint}</p>` patterns with `<InfoHint text={option.hint} />` next to the label. Apply to: feature/cms/seo checkbox cards, product-complexity buttons, design cards (keep "View examples" action), content/timeline buttons, and the `productSelected.hint`/`designSelected.hint` group notes. Remove the reserved `min-h-[88px]` from `CHECKBOX_CLASS`. Import `InfoHint` from `@/components/ui`.
- [ ] **Step 4: Typecheck. Commit.**

### Task 5.5: Trim `EstimateSummary.tsx` + `PriceBreakdown.tsx`
**Files:** Modify both.

- [ ] **Step 1 (EstimateSummary):** Replace the range block (`{formatEur(lowEstimate)} – {formatEur(highEstimate)}`) with a single `{formatEur(estimate.oneTimeEstimate)}`. Remove the `rangeNote`. Remove the maintenance monthly block and the `seoGrowthMonthly` block (and the prop). Remove `maintenanceMeta`. Per §E, also drop the standalone *what-you-get* / *will-include* / *why-changes* sections and the ROI + scarcity blocks **or** keep a slimmer version — **CHECKPOINT: confirm how aggressive to trim** (default: keep "will include" + CTA + disclaimer; drop what-you-get, why-changes, ROI, scarcity). Update `PriceBreakdown` props passed (no low/high; pass `timelineCost`).
- [ ] **Step 2 (PriceBreakdown):** Props: remove `timelinePercent`, `lowEstimate`, `highEstimate`; add `timelineCost`. Replace the timeline `formatPercent` row with a `formatEur(timelineCost)` row (additive, shown under the add-ons, not in the multiplier group). Replace the `estimatedRange` low–high row with a single `total`/estimate row.
- [ ] **Step 3: Typecheck. Commit.**

### Task 5.6: Verify both locales build
**Files:** none (verification).

- [ ] **Step 1:** `npx tsc --noEmit` → zero errors. Grep for any lingering `maintenancePlan|seoGrowthPlan|highEstimate|lowEstimate|presets|MaintenanceTiles|SeoGrowthTiles` references under `src/` and fix.
- [ ] **Step 2:** `npm run build` → succeeds.
- [ ] **Step 3: Commit** any fixups.

---

## Phase 6 — i18n trims + copy pass

### Task 6.1: Trim the `Calculator` namespace
**Files:** Modify `messages/uk.json`, `messages/en.json`.

- [ ] **Step 1:** Remove now-dead keys under `Calculator`: `whyPackages`, `afterLaunch`, `underHood`, the preset-related `controls.*` keys (`presetTitle`, `presetNote`, `presetBestForLabel`, `presetUse`, `compareAnchors`, etc.), `summary.range*` (if going single-number keep a label), `summary.whatYouGet*`/`willInclude`/`whyChanges*` per the 5.5 checkpoint, `summary.maintenanceMonth`, `summary.seoGrowthMonth`, `breakdown.timelineMultiplier`, `breakdown.estimatedRange`, and any maintenance/seoGrowth option text. Keep both locales structurally identical (same keys).
- [ ] **Step 2:** `npm run build` (next-intl will error on missing keys referenced by surviving components). Fix any key the components still read.
- [ ] **Step 3: Commit.**

### Task 6.2: Calculator copy pass (the deferred step)
**Files:** `messages/uk.json`, `messages/en.json`, and the `calculatorConfig` singleton text in Sanity.

- [ ] **Step 1:** Per `code-site-workspace/docs/calculator-simplification.md` §6 — write/tighten the surviving Calculator copy in both locales (uk + en-GB) **and** the option labels/hints in the singleton. Hints are now tooltip-length one-liners (omit to hide the (i)). Follow the UK style guide / localisation audit (British EN on /en; «пакет» not «тир»). Apply anti-AI-slop + copywriting skills.
- [ ] **Step 2:** This is its own work item — brainstorm/scope before writing. Commit copy separately.

---

## Phase 7 — Remove the old CMS docs (after frontend cutover verified)

### Task 7.1: Cleanup script + schema/structure removal
**Files:** Create `code-site-solutions-admin/scripts/cleanup-calculator-legacy.ts`; Modify `schemaTypes/index.ts`, `structure/index.ts`; delete the 13 old `schemaTypes/documents/calculator*Options.ts` etc.

- [ ] **Step 1:** Only after Phase 5/6 verified in a deployed/preview studio+site reading `calculatorConfig`. Write a transaction that deletes the 13 legacy `_id`s (mirror `cleanup-calculator-v1.ts`). Dry-run, then `--apply`.
- [ ] **Step 2:** Remove the 13 imports + array entries from `schemaTypes/index.ts`, remove their `structure/index.ts` list items, delete the schema files.
- [ ] **Step 3:** `npx tsc --noEmit` in admin; Studio loads with only `calculatorConfig`. **Commit.**

---

## Phase 8 — Final verification

### Task 8.1: End-to-end check
- [ ] **Step 1:** Frontend `npm test` + `npm run build` green.
- [ ] **Step 2:** Run the dev server; load `/calculator` and `/en/calculator`. Confirm: no presets, single-number estimate, timeline shows `+€`, hints behind (i), no maintenance/seoGrowth/whyPackages/underHood sections, FAQ + howItWorks + SocialProof present.
- [ ] **Step 3:** `preview_console_logs` clean; `preview_screenshot` both locales for the record.
- [ ] **Step 4:** Open PRs in both repos (frontend + admin), cross-link.

---

## Self-review notes
- **Spec coverage:** A (engine: Task 4.2 + 3.6 timeline price), B (presets: 5.4, 7), C (marketing: 5.3), D (recurring: 3.x + 5.x + 7), E (aside: 5.5), F (features flatten: optional within 5.4), §H (InfoHint: 5.1 + 5.4), label/hint consolidation (singleton: 1.1 + 6.2), copy step (6.2). ✓
- **Type consistency:** `timelineCost` (engine breakdown) ↔ `ConfigTimelineOption.price` ↔ schema `timeline[].price` ↔ query `price`. `oneTimeEstimate` is the single output everywhere (range removed). ✓
- **Open checkpoints (need user sign-off mid-execution):** (1) timeline € defaults at Phase 2 Step 4; (2) how aggressively to trim the EstimateSummary aside at Task 5.5 Step 1.
