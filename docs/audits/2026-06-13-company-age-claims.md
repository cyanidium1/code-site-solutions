# Company founding-year & age-claim audit — 2026-06-13

Founding year corrected to **2023** across the site. CMS (Sanity) checked — no
company founding-year claims there (its year mentions are all about clients' old
sites or asset filenames). The "47 projects over 3 years" copy in blog/comparison
content is already consistent with a 2023 founding.

## Fixed (founding year → 2023)

| File | Change |
|------|--------|
| `src/content/uk/about.tsx:68` | "запустив у 2025 році" → 2023 |
| `src/content/uk/about.tsx:75` | fact "Студію засновано: 2025" → 2023 |
| `src/content/en/about.tsx:68` | "founded in 2025" → 2023 |
| `src/content/en/about.tsx:75` | fact "Studio founded: 2025" → 2023 |
| `src/lib/shared/jsonld.ts:141` | `foundingDate: "2021"` → "2023" (SEO structured data) |

Founder's personal career dates left unchanged on purpose ("developing since
2021" / "Building since 2021", and 6+/8+ years experience) — these describe
Fedir's coding history, not the studio's founding.

## Group D — fixed (uk/en locale mismatch)

UK said "За 2 роки" while EN said "3 years" for the same studio-tenure claim.
Aligned UK up to "3 роки" (matches 2023 founding → 2026 = 3 years):
- `src/content/uk/process.tsx:263` — "За 2 роки роботи…" → "За 3 роки роботи…"
- `src/content/uk/process.tsx:279` — "За 2 роки таке було 1 раз" → "За 3 роки…"

### Count mismatch — resolved (UK used as source of truth)
The deadline-rebate FAQ also disagreed on the **count**. Per owner decision the
Ukrainian claim is authoritative ("1 раз" / once), so EN was corrected:
- `src/content/en/process.ts:239` — "We've done it **twice** in 3 years, and
  **both times** we wired the rebate…" → "We've done it **once** in 3 years, and
  we wired the rebate…"

## Deferred for future review — "N years" experience claims (intentionally NOT changed)

Left as-is per owner decision: these read as *overall experience* (incl. Fedir's
freelance work since 2021 → 2021–2026 = 5 years), not studio age. Revisit if the
brand framing should switch to studio-age (3 years).

**Group A — "50+ projects · 5 years" brand line**
- `messages/uk.json:30`, `messages/en.json:30` (brandDesc)
- `src/lib/shared/jsonld.ts:140` (Organization description — sits next to the
  foundingDate that was changed to 2023; note the internal 5-years-vs-2023 tension)
- `src/components/blocks/final/clinic-footer.tsx:132-133`

**Group B — homepage stat counter "50+ / 5 years"**
- `src/app/(uk)/page.tsx:111`, `src/app/(en)/en/page.tsx:141`
- `messages/uk.json:99`, `messages/en.json:99`

**Group C — already "3 years" (consistent with 2023, no change needed)**
- `src/content/comparisons/vs-constructors.tsx:286,831`
- `src/content/en/process.ts:239`
- CMS blog posts ("47 projects over 3 years")
