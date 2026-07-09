# RSC flight payload on `/en` — full report

**Date:** 2026-07-09 · **State analyzed:** master post PRs #29/#30/#31 served
locally as a production build (byte-identical to the deploy) · **Question:**
what is inside the `/en` document's RSC payload, why does it cost ~2.7 s of
main-thread time on a throttled mobile CPU, and what can shrink it.
Companion report: [render-blocking-css-report.md](./render-blocking-css-report.md).
Tools: `flight-analyze.mjs` / `flight-tchunks.mjs` (session scratchpad —
promote to `tools/perf/` if this becomes a recurring measurement).

## 1. Mechanism: why the page ships its UI twice

An App Router page is delivered as **two representations of the same UI in
one document**:

1. **HTML markup** — `<div class="…">` elements the browser paints
   immediately, before any JavaScript.
2. **The RSC flight payload** — inline
   `<script>self.__next_f.push([1,"…"])</script>` strings carrying a
   serialized description of the same React element tree: every element,
   every prop (including every `className`), every text node, again.

React needs the second copy because hydration does not reverse-engineer the
component tree from the DOM — parsed HTML has lost the information React
requires (component boundaries, props, client-component mount points). The
client builds the tree from the flight payload and attaches it to the
existing DOM; the same payload also feeds client-side navigation and the
router cache. This is the RSC trade-off: server components ship **no JS
code**, but their **rendered output ships twice**.

Where the cost lands: on the wire the duplication is almost free — the two
copies are highly repetitive and gzip mixes them well (the 480 KB document
transfers as ~53 KiB). The cost is **client CPU on decompressed bytes**:
parsing 124 inline script chunks, evaluating ~217 KB of string data,
reconstructing the tree, and walking it during hydration. Lighthouse's
bootup-time audit attributes **~2,693 ms** to the `/en` document itself on a
throttled mobile CPU — the single biggest main-thread item on the page, and
the mechanism behind the 1.85 s element-render-delay in the slow PSI runs.
It is also why `experimental.inlineCss` failed in July: it added ~300 KB of
CSS *into* this payload (see perf-log, PR #27).

## 2. Measured composition

### 2.1 Document level

| Component | Size (raw) | Share |
|---|---|---|
| `/en` document total | 480.3 KB | 100% |
| — SSR HTML markup + head | ~263 KB | ~55% |
| — RSC flight payload (124 chunks, escaped) | 216.8 KB | 45% |
| Wire size after gzip (PSI network log) | ~53 KiB | — |

### 2.2 The dominant ingredient: `className` strings — 40% of the document

| Where | Count | Bytes |
|---|---|---|
| HTML `class="…"` attributes | 903 | 128.5 KB |
| Flight `"className":"…"` props | 586 | 65.5 KB |
| **Total class-string bytes** | | **194 KB ≈ 40% of the document** |

Tailwind concentrates styling into markup attributes instead of a stylesheet
referenced once — so on an RSC page every utility stack is a literal string
inside every rendered instance, **in both representations**. 87 class
attributes are ≥300 characters, totaling 50.7 KB on the HTML side alone
(plus their flight twins).

Worst individual offenders (flight "T" text chunks — strings big enough that
React serializes them as separate references; note they are **not deduped**
across instances):

| Chunk content | Size × instances | Source |
|---|---|---|
| `group/biz-card relative flex flex-col overflow-hidden rounded-[24px]…` (1.4 KB stack) | 8.4 KB (×6) in flight + 6 copies in HTML ≈ **17 KB** | `src/components/homepage/business-value.tsx` |
| `group/vs relative isolate flex min-h-[300px]…` (1.2 KB stack) | 3.5 KB (×3) + HTML copies ≈ 7 KB | `src/components/blocks/value-stack/index.tsx` |
| JSON-LD `@graph` | 3.5 KB (×1) | homepage structured data — needed for SEO |
| base64 PNG blur placeholder | 2.0 KB (+7.4 KB found in first pass) | `AppImage` blur placeholders |

### 2.3 What is NOT the problem (checked and cleared)

| Suspect | Measured | Verdict |
|---|---|---|
| next-intl messages serialized to the client | 10.9 KB | already lean (not the full 100+ KB messages file — trimmed upstream) |
| Homepage cases data (`fetchHomepageCases`) | 1.9 KB | lean |
| Testimonial slides | 1.9 KB | lean |
| i18n registry / calculator config / tiers / FAQ | absent from flight | server-only, correctly so |
| Long-text chunks overall | 17.4 KB of 199.6 KB | the tree structure, not blobs, dominates |

The flight payload is **not** bloated data-fetch props. It is the structural
serialization of a large, className-heavy page. That rules out "trim the
props" as a lever and points all remaining leverage at markup weight.

## 3. Options analysis

### 3a. Turn off / reduce the duplication itself — ❌ not available

- Next.js provides **no way to omit the flight payload for static subtrees**.
  That capability is Partial Prerendering (PPR) territory, which is not
  stable on this Next 15 setup and changes rendering architecture.
- Moving sections to client components would *add* bundle JS and lose SSR
  benefits — strictly worse.
- The duplication ratio is fixed; only the bytes being duplicated are ours
  to change.

### 3b. Shrink `className` weight on repeated components — ✅ the lever

Every byte removed from a class string is removed from **both copies × every
instance**. The pattern already exists in this codebase (PR #30/#31): move a
mega-stack into a semantic class inside a React-hoisted
`<style href precedence>` block owned by the component.

Worked example — the biz-card stack: 1.4 KB × 6 instances × 2 copies ≈ 17 KB
today. As a hoisted style: ~20 bytes × 6 × 2 + one 1.4 KB style block ≈
1.6 KB. **Net −15 KB from one component.**

Scope estimate: 87 attributes ≥300 chars (50.7 KB HTML-side + proportional
flight share ≈ 75–90 KB total). Converting the ~15–20 heaviest *repeated*
stacks (cards, list rows — where the multiplier lives) plausibly cuts
**40–60 KB raw** off the document, shrinking flight eval, HTML parse, and
DOM-size complaints together. Singleton stacks (hero shell etc.) have no
multiplier and can stay Tailwind.

Trade-offs to hold the line on: this must NOT become a wholesale
Tailwind→CSS migration (explicitly ruled out); only stacks with
size × repetition above a threshold (say ≥600 B × ≥3 instances) get
converted, and visuals must stay byte-identical (same values, semantic class
names, hoisted style block).

### 3c. Micro-items — ⚠️ real but small

- Blur placeholders: ~9 KB of base64 PNG across HTML+flight. Could switch the
  hero/cards to a solid `background` placeholder; saves single-digit KB.
- JSON-LD (3.5 KB) and messages (10.9 KB): functional, keep.

## 4. Proposed next round (when approved)

1. **Audit:** script to rank class attributes by `length × instances` from
   the served homepage (extend `flight-analyze.mjs`), pick the top ~15–20
   repeated stacks (starting with `business-value.tsx`, `value-stack`,
   bento/industries cards).
2. **Implement:** hoisted-style conversion per component, same discipline as
   PR #30 (byte-identical values, `csb-*` naming, one `<style href>` per
   component).
3. **Measure:** document raw size, flight escaped size, `className` byte
   share (the three numbers in §2), Lighthouse bootup-time for `/en`, and a
   3-run PSI set. Success = document −40 KB+ raw and a visible dent in the
   2.7 s bootup line; failure/rollback if bootup does not move (it is the
   metric this round exists for).
4. **Own branch + PR**, no merge without approval — as before.

## Results (2026-07-09, branch `perf/slim-classnames`)

The §4 plan was executed same-day. All five frozen stacks converted to
semantic classes in `src/app/homepage-cards.css` (imported by `globals.css`;
for homepage styles the cached main sheet beats a hoisted `<style>`, which
would itself ship twice per document):

| Metric | Before | After | Δ |
|---|---|---|---|
| `/en` document raw | 480.3 KB | 433.0 KB | **−47.3 KB (−9.9%)** |
| flight payload (escaped) | 216.8 KB | 195.8 KB | −21.0 KB |
| HTML class-attr bytes | 128.5 KB | 104.0 KB | −24.5 KB |
| flight className bytes | 65.5 KB | 55.8 KB | −9.7 KB |
| audit candidates ≥600 B×3 | 5 | **0** | — |
| main CSS | 206,402 / 32,551 gz | 205,581 / 32,772 gz | −821 raw / +221 gz |

The main sheet *shrank* raw — the retired arbitrary-value utilities outweighed
the added semantic classes. Local Lighthouse doc-bootup was too machine-noisy
to adjudicate (2.3–5.1 s scatter across 6 runs, medians 56/62 with TBT
contamination); the byte reduction is mechanical (−10% of parse/eval input),
prod PSI post-merge is the arbiter. Visual/interaction parity verified per
component in the preview (computed styles, reveal states, FAQ open state,
hover bindings via `a.hp-ind-card`).

## TL;DR

The `/en` document is 480 KB raw (53 KiB gzipped): ~263 KB HTML plus a
217 KB RSC flight payload that re-serializes the same UI tree for hydration
— an architectural duplication you cannot opt out of. Evaluating it costs
~2.7 s of main-thread time on mobile, the page's biggest JS item. The
payload is not bloated data (messages 10.9 KB, all fetch props <2 KB each);
it is **Tailwind class strings: 194 KB — 40% of the whole document — paid
once in HTML and again in flight, per instance**. The one effective lever is
converting the heaviest *repeated* class stacks (biz-card 1.4 KB×6,
value-stack 1.2 KB×3, plus ~15 more ≥300-char attributes) into semantic
classes backed by hoisted `<style>` blocks — estimated −40–60 KB raw and a
proportional cut to hydration eval, using the exact pattern PRs #30/#31
established. Full inlining tricks, prop trimming, and PPR are dead ends here.
