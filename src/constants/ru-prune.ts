/**
 * RU-version pruning (SEO overhaul, Aug 2026) — DECISION ITEM, NOT ACTIVE.
 *
 * GSC (28d to 2026-08-19): the RU surface earned 196 impressions / 5 clicks
 * a quarter while 28 /ru/portfolio/* URLs sat in "Discovered, currently not
 * indexed". The SEO task proposes keeping only the RU pages that earn
 * impressions (/ru plus the slugs below) and 301-ing the rest to their UA
 * equivalents, removing them from the sitemap and hreflang sets.
 *
 * That conflicts with the in-progress RU expansion (/ru/calculator,
 * /ru/portfolio, /ru/process shipped Aug 2026), so it was NOT applied.
 * The full, ready implementation lives in
 * `docs/seo-aug-2026-ru-prune.patch` — apply it with
 * `git apply --ignore-whitespace docs/seo-aug-2026-ru-prune.patch` if the
 * RU/KZ strategy is abandoned. Nothing imports this file until then.
 */
export const RU_KEPT_CASE_SLUGS: ReadonlySet<string> = new Set([
  "oleksandr-sitnikov",
]);

export const RU_KEPT_BLOG_UA_SLUGS: ReadonlySet<string> = new Set([
  "tilda-vs-kastomnyy-sayt-2026",
]);
