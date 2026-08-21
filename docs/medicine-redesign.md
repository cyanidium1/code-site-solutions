# Medicine page — reference lock and decision ledger

August 2026 redesign of `/sites-for/medicine` (all three locales). Read this
before changing anything under `src/components/industry-page/medicine/`.

The other seven industry pages share the CMS blocks in
`src/components/blocks/` and were **not** touched. Everything medicine-specific
either lives in the `medicine/` folder or is guarded by
`slug === "medicine"` in `src/components/industry-page/index.tsx`.

## What was wrong

Audited against the rendered page, not the source. The findings that drove the
work, in order of how loudly they read as machine-generated:

1. **Italic + gradient word swaps in every heading** — twelve of them down one
   page, plus more inside body copy. The site-type pages had already dropped
   this treatment (see the `site-types-design-language` note); the industry
   pages had not.
2. **Six identical capability cards**, each an icon square over a stock photo
   dimmed to roughly 8% opacity. Equal weight for six things means no
   hierarchy, and near-invisible photography behind a card communicates
   nothing.
3. **Eight empty pills** listing integration names — a logo wall with the
   logos removed and no indication of what flows where.
4. **A three-card "reasons" bento** whose tall left card carried ~350px of
   nothing.
5. **Every number in the same violet gradient** — `01`, `60%`, `×3.2`, `98`,
   `×4` — so the page had no way to say which figure was evidence.
6. **One rhythm repeated ten times**: eyebrow pill → giant uppercase heading →
   grid of rounded cards on the same surface.

## Reference lock

Researched through Refero MCP (styles layer), then synthesised — no single
reference is copied.

| Source | Bounded job | Traits preserved |
|--------|-------------|------------------|
| **Impilo** (impilo.health) — primary | The page's overall logic | Deep-dark healthcare control room. Depth from layered surfaces and hairline borders, never box-shadows. Two **functional** accents beside the brand violet, each bound to one role. Accent phrase in a headline is set solid/upright, never italicised. |
| **Harness.io** | Graphics only | A marketing graphic must explain a mechanism, not decorate a claim: atmospheric, engineered diagrams instead of product beauty shots. Glow-edged panels. |
| **Superlative** | Labels and register | Small hairline-boxed technical labels, corner metadata, mono uppercase captions, ruled sheets instead of cards. |
| **Ease Health** | The booking widget island only | Cream canvas, forest-green primary, mint tints, 14px radii — scoped to the `W` token object in `med-booking-demo.tsx`. Must not leak onto the dark canvas. |
| **code-site-frontend** (old repo) | Our own inherited language | The "drops": diagonal blurred light streaks as section decor (`public/images/**/drops-*.svg` → `.med-streaks`). Coded SVG product art instead of screenshots (`MockupArt.tsx` → `med-admin-art.tsx`). Floating annotation pills over the device. The marquee ticker. |

**Kept from our own system, non-negotiable:** `#0b0b0b` canvas, violet brand
accent, Actay uppercase display, JetBrains mono captions, Manrope body, glow
instead of shadow.

### Role-bound accents

Declared on `.med` in `medicine.css`. These are the only two colours on the
page besides the brand violet, and each does exactly one job:

| Token | Role | Never |
|-------|------|-------|
| `--med-signal` (blue) | A measurement of the site: speed, positions, traffic, conversion multiples | A background, a heading colour, a CTA |
| `--med-vital` (green) | A confirmed state: booking taken, SMS sent, check passed | A background, a heading colour, a CTA |

If a number is not evidence, it does not get `--med-signal`. If a thing has
not happened yet, it does not get `--med-vital`.

## Decision ledger

| Decision | Source | Why |
|----------|--------|-----|
| `.med em { font-style: normal }` scoped to the page | Impilo; existing site-type lock | Kills the decorative italic across the shared CMS blocks on this page only. Body `em` keeps emphasis via weight + contrast. |
| Bespoke `MedHero` instead of `HeroEditorial` | Impilo, Harness, Superlative | The shared hero welded the "50+ patients" KPI into the `<h1>`, so a display face carried a lowercase caption; and it renders every CMS stat value at 22px bold, which breaks on phrases like "doctor profiles". |
| KPI on its own ruled row; spec grid replaces check-chips | Superlative | Ruled cells with mono captions read as a specification, not as four more generic checkmarks. |
| ECG vitals strip between hero and demo | new; motion role from the old site's marquee | The page needed one graphic that could only be medical, and a quieter bridge out of the hero than another giant heading. Scrolls like a bedside monitor. |
| Booking demo split into two synchronised panels | Impilo (functional accents), old-site MockupArt (browser chrome) | A clinic owner has seen a hundred booking forms; they have never seen what fires behind one. The argument is made by the mechanism instead of a bullet list claiming it exists. All six backend events are listed from the start, dimmed, so the panel is never an empty box. |
| Patient-route diagram on one rail, two registers | Harness (explanatory graphic), Superlative (register) | What we deliver sits above the rail, where a template leaks sits below it. The reader gets the argument from the shape before reading a word. Deliberately not cards — cards on this page are reserved for things you can interact with. |
| Reasons → ruled diagnostic sheet | Superlative | Removes the 350px hole in card 01 and gives the statistic the only colour in the row, because it is the only part that is evidence. |
| Capabilities → ruled spec list beside coded admin art | Harness, old-site MockupArt | Replaces six equal-weight cards and their invisible stock photos with one real piece of artwork: the panel those capabilities are actually administered from. |
| Integrations → directional bus | Harness | Splitting the CMS list into inbound/outbound and putting a marching rail between each system and the hub turns a name wall into a diagram of where a booking goes. |

## Things to preserve on future edits

- Do not reintroduce italic word-swaps, on this page or elsewhere.
- Do not turn the ruled sheets back into cards to "match the rest of the site".
  The mixed register — ruled sheets for reading, cards for interacting — is the
  point.
- Do not promote `--med-signal` or `--med-vital` out of their roles.
- Keep the light booking-island tokens inside `med-booking-demo.tsx`.
- All motion is CSS (no animation library is installed) and every keyframe is
  disabled under `prefers-reduced-motion`.

## Verification

Checked at 1440px and 390px across `uk` / `ru` / `en`, with `/sites-for/legal`
and `/sites-for/finance` as regression controls (unchanged, still on the shared
blocks). `npm run typecheck` and `next lint` clean.
